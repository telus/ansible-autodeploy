<pre><?php

if($_SERVER["REQUEST_METHOD"] === 'POST') {
  $data = file_get_contents('php://input');
  $post = json_decode($data, TRUE);

  // if there is only one repository on this server, deploy the single project .yml file
  if(file_exists('/data/deployment/deploy.key')) {
    echo shell_exec('/usr/local/bin/ansible-playbook /data/deployment/deploy.yml')
  // else deploy the project specified by the github POST payload
  } else {
    $playbook = $post["repository"]["slug"].'.yml';
    echo shell_exec('/usr/local/bin/ansible-playbook /data/deployment/'.$playbook)
  }
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

?></pre>