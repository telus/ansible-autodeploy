<pre><?php
// {% if autodeploy_dynamic_deploy_repo_names %}

if($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = file_get_contents('php://input');
  $post = json_decode($data, TRUE);
  $repo = $post['repository']['slug'];

  switch($repo) {
  // {% for repo in autodeploy_dynamic_deploy_repo_names %}   

    case '{{ repo }}':
      echo shell_exec('/usr/local/bin/ansible-playbook /data/deployment/{{ repo }}.yml');
      break;

  // {% endfor%}

  }
}

// {% else %}

echo shell_exec('/usr/local/bin/ansible-playbook /data/deployment/deploy.yml');

// {% endif %}

?></pre>