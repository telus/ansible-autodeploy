#!/usr/bin/env node

// {{ ansible_managed }}

var cluster = require('cluster'),
  queryString = require('qs'),
  port = 30080;

function record_pidfile_at(pidfile_path) {
  try {
    var pid = require('npid').create(pidfile_path);
    pid.removeOnExit();
  } catch(error) {
    console.log(error);
    process.exit(1);
  }
}

function printAnsible(response, repo) {
  var ansible = require('child_process').spawn('/usr/local/bin/ansible-playbook', ["{{ autodeploy_path }}/" + repo + ".yml"]);
  ansible.stdout.pipe(response);
  ansible.stdout.on('end', function() {
    response.end('</pre>');
  });
}

if (cluster.isMaster) {
  record_pidfile_at('{{ autodeploy_pidfile_path }}');
  cluster.on('exit', function(worker, code, signal) {
    cluster.fork();
  });
  cluster.fork();
} else {
  require('http').createServer(function(request, response) {

// {% if autodeploy_dynamic_deploy_repo_names %}

  switch (request.method) {
    case 'POST':
      var body = "";
      request.on('data', function (data) {
        body += data
      });
      request.on('end', function () {
        response.statusCode = 200;
        response.write('<pre>');

        var post = queryString.parse(body);
        var payload = JSON.parse(post["payload"]);
        var repo = payload["repository"]["slug"];

        switch(repo){

      // {% for repo in autodeploy_dynamic_deploy_repo_names %}   

          case '{{ repo }}':
            printAnsible(response, '{{ repo }}');
            break;

      // {% endfor%}

        }
      });
      break;
    default:
      response.statusCode = 405;
      response.end();
  }
  
// {% else %}

  response.statusCode = 200;
  response.write('<pre>');
  printAnsible(response, 'deploy')

// {% endif %}

  }).listen(port);
}