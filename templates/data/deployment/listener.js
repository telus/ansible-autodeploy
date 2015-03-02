#!/usr/bin/env node

// {{ ansible_managed }}

var cluster = require('cluster'),
  fs = require('fs'),
  qs = require('qs'),
  port = 30080,
  ansible,
  body;

function record_pidfile_at(pidfile_path) {
  try {
    var pid = require('npid').create(pidfile_path);
    pid.removeOnExit();
  } catch(error) {
    console.log(error);
    process.exit(1);
  }
}


function pipeAnsible(response) {
  ansible.stdout.pipe(response);
  ansible.stdout.on('end', function() {
    response.end('</pre>');
  });
};


if (cluster.isMaster) {
  record_pidfile_at('{{ autodeploy_pidfile_path }}');
  cluster.on('exit', function(worker, code, signal) {
    cluster.fork();
  });
  cluster.fork();
} else {
  require('http').createServer(function(request, response) {

// {% if autodeploy_dynamic_deploy %}

    switch (request.method) {
      case 'POST':
        request.on('data', function (data) {
          body += data
        });
        request.on('end', function () {
          response.statusCode = 200;
          response.write('<pre>');

          var payload = qs.parse(body)["undefinedpayload"];
          var post = JSON.parse(payload);

          var playbook = post["repository"]["name"] + '.yml';
          ansible = require('child_process').spawn('/usr/local/bin/ansible-playbook', ["/data/deployment/" + playbook]);
          pipeAnsible(response);

        });
      break;
      case 'GET':
        response.statusCode = 200;
        response.write('<pre>');

        switch(request.url) {
          // if no repository is specified on a GET, deploy all projects in /data/deployment
          case '/':
            fs.readdir('/data/deployment', function(err, files) {
              if(err) console.log(err);
              files.filter(function(item) {
                if(/\.yml/.test(item)) {
                  ansible = require('child_process').spawn('/usr/local/bin/ansible-playbook', ['/data/deployment/' + item]);
                  pipeAnsible(response);
                }
              });
            })
            break;
          // else deploy the project according to the specified URL
          default:
            ansible = require('child_process').spawn('/usr/local/bin/ansible-playbook', ['/data/deployment' + request.url + '.yml']);
            pipeAnsible(response);
        }
      break;
    }
    
// {% else %}

    response.statusCode = 200;
    response.write('<pre>');

    switch(request.url) {
      // if no repository is specified on a GET, deploy all projects in /data/deployment
      case '/':
        fs.readdir('/data/deployment', function(err, files) {
          if(err) console.log(err); 
          files.filter(function(item) {
            if(/\.yml/.test(item)) {
              ansible = require('child_process').spawn('/usr/local/bin/ansible-playbook', ['/data/deployment/' + item]);
              pipeAnsible(response);
            }
          });
        })
        break;
      // else deploy the project according to the specified URL
      default:
        ansible = require('child_process').spawn('/usr/local/bin/ansible-playbook', ['/data/deployment' + request.url + '.yml']);
        pipeAnsible(response);
    }

// {% endif %}

  }).listen(port);
}