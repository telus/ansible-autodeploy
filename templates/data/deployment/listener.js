#!/usr/bin/env node

// {{ ansible_managed }}

var cluster = require('cluster'),
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
    response.statusCode = 200;
    response.write('<pre>');
    ansible = require('child_process').spawn('/usr/local/bin/ansible-playbook', ['/data/deployment/deploy.yml']);
    ansible.stdout.pipe(response);
    ansible.stdout.on('end', function() {
      response.end('</pre>');
      
    })
  }).listen(port);
}
