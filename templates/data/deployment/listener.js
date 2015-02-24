#!/usr/bin/env node

// {{ ansible_managed }}

var cluster = require('cluster'),
  fs = require('fs'),
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

// {% if autodeploy_dynamic_deploy %}

    switch (request.method) {
      case 'POST':
        request.on('data', function (data) {
          body += data
        });
        request.on('end', function () {
          response.statusCode = 200;
          response.write('<pre>');

          var post = qs.parse(body);

          // if there is only one repository on this server, deploy the single project .yml file
          if (fs.existsSync('/data/deployment/deploy.key')) {
            ansible = require('child_process').spawn('/usr/local/bin/ansible-playbook', ["/data/deployment/deploy.yml"]);
          // else deploy the project specified by the github POST payload
          } else {
            var playbook = post["repository"]["slug"] + '.yml';
            ansible = require('child_process').spawn('/usr/local/bin/ansible-playbook', ["/data/deployment/" + playbook]);
          }

          ansible.stdout.pipe(response);
          ansible.stdout.on('end', function() {
            response.end('</pre>');
          })
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
                }
              });
            })
            break;
          // else deploy the project according to the specified URL
          default:
            ansible = require('child_process').spawn('/usr/local/bin/ansible-playbook', ['/data/deployment' + request.url + '.yml']);
        }

        ansible.stdout.pipe(response);
        ansible.stdout.on('end', function() {
          response.end('</pre>');
        });
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
            }
          });
        })
        break;
      // else deploy the project according to the specified URL
      default:
        ansible = require('child_process').spawn('/usr/local/bin/ansible-playbook', ['/data/deployment' + request.url + '.yml']);
    }

    ansible.stdout.pipe(response);
    ansible.stdout.on('end', function() {
      response.end('</pre>');
    });

// {% endif %}

  }).listen(port);
}