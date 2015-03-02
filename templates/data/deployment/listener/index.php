<pre><?php
$request_uri = $_SERVER["REQUEST_URI"];

// {% if autodeploy_dynamic_deploy %}

if($_SERVER["REQUEST_METHOD"] === 'POST') {
  $data = file_get_contents('php://input');
  $post = json_decode($data, TRUE);

  $playbook = $post["repository"]["slug"].'.yml';
  echo shell_exec('/usr/local/bin/ansible-playbook /data/deployment/'.$playbook);
} else {
  switch($request_uri) {
    // if no repository is specified on a GET, deploy all projects
    case '/':
      $dir_files = scandir('/data/deployment');
      foreach($dir_files as $file){
        if (strpos($file,'.yml') !== false) {
          echo shell_exec('/usr/local/bin/ansible-playbook /data/deployment/'.$file);
        }
      }
    // else deploy the project according to the specified URL
    default:
      echo shell_exec('/usr/local/bin/ansible-playbook /data/deployment'.$request_uri.'.yml');   
  } 
}

// {% else %}

switch($request_uri) {

  // if no repository is specified on a GET, deploy all projects
  case '/':
    $dir_files = scandir('/data/deployment');
    foreach($dir_files as $file){
      if (strpos($file,'.yml') !== false) {
        echo shell_exec('/usr/local/bin/ansible-playbook /data/deployment/'.$file);
      }
    }
  // else deploy the project according to the specified URL
  default:
    echo shell_exec('/usr/local/bin/ansible-playbook /data/deployment'.$request_uri.'.yml');   
}

// {% endif %}

?></pre>
