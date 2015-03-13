#!/usr/bin/env node

// {{ ansible_managed }}

var cluster = require('cluster'),
  fs = require('fs'),
  qs = require('qs'),
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

if (cluster.isMaster) {
  record_pidfile_at('{{ autodeploy_pidfile_path }}');
  cluster.on('exit', function(worker, code, signal) {
    cluster.fork();
  });
  cluster.fork();
} else {
  require('http').createServer(function(request, response) {

// {% if autodeploy_dynamic_deploy_enabled %}

  switch (request.method) {
    case 'POST':
      var body;
      request.on('data', function (data) {
        body += data
      });
      request.on('end', function () {
        response.statusCode = 200;
        response.write('<pre>');

        var payload = qs.parse(body)["undefinedpayload"];
        var post = JSON.parse(payload);

        var repo = post["repository"]["name"];
        switch(repo){

      // {% for repo in autodeploy_dynamic_deploy_repo_names %}   

          case '{{ repo }}':
            var ansible = require('child_process').spawn('/usr/local/bin/ansible-playbook', ["/data/deployment/{{ repo }}.yml"]);
            ansible.stdout.pipe(response);
            ansible.stdout.on('end', function() {
              response.end('</pre>');
            });
          break;

      // {% endfor%}

        }
      });
    break;
    case 'GET':
      response.statusCode = 200;
      response.write('<pre>');

      switch(request.url) {
        case '/':
          var arr = [];
          fs.readdir('/data/deployment', function(err, files) {
            files.filter(function(item) {
              if(/\.yml/.test(item)) {
                arr.push(item);
              }
            })
            ansible = require('child_process').spawn('/usr/local/bin/ansible-playbook', arr);
            ansible.stdout.pipe(response);
            ansible.stdout.on('end', function() {
              response.end('</pre>');
            });
          })
          break;

      // {% for repo in autodeploy_dynamic_deploy_repo_names %}

        case '/{{ repo }}':
          ansible = require('child_process').spawn('/usr/local/bin/ansible-playbook', ["/data/deployment/{{ repo }}.yml"]);
          ansible.stdout.pipe(response);
          ansible.stdout.on('end', function() {
            response.end('</pre>');
          });
          break;

      // {% endfor%}

      }
    break;
  }
  
// {% else %}

  response.statusCode = 200;
  response.write('<pre>');
  ansible = require('child_process').spawn('/usr/local/bin/ansible-playbook', ['/data/deployment/deploy.yml']);
  ansible.stdout.pipe(response);
  ansible.stdout.on('end', function() {
    response.end('</pre>');
  })

// {% endif %}

  }).listen(port);
}