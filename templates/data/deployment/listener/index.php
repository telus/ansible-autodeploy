<pre><?php

if($_SERVER["REQUEST_METHOD"] === 'POST') {
  $data = file_get_contents('php://input');
  $post = json_decode($data, TRUE);

  $canon_url = preg_replace('/^.+:\/\//', 'git@', post["canon_url"]);
  $absolute_url = post["repository"]["absolute_url"];
  $repository = preg_replace('/\/$/', '.git', $absolute_url);
  $dynamic_repository_origin = $canon_url.$repository;
  $absolute_repository = substr(strrchr($absolute_url, '/' ), 1);

  if(file_exists('/data/deployment/deploy.key')) {
    $extra_vars = 'dynamic_repository_origin='.$dynamic_repository_origin;
  } else {
    $dynamic_deploy_key = $absolute_repository.'.key';
    $extra_vars = 'dynamic_repository_origin='.$dynamic_repository_origin.' dynamic_deploy_key='.$dynamic_deploy_key;
  }

  echo shell_exec('/usr/local/bin/ansible-playbook /data/deployment/'.$absolute_repository.'.yml --extra-vars='.$extra_vars)
} else {
  // echo shell_exec('/usr/local/bin/ansible-playbook /data/deployment/deploy.yml');
  switch($request_uri) {
    case '/':
      $dir_files = scandir('/data/deployment');
      foreach($dir_files as $file){
        if (strpos($file,'.yml') !== false) {
          echo shell_exec('/usr/local/bin/ansible-playbook /data/deployment/'.$file);
        }
      }   
    default:
      echo shell_exec('/usr/local/bin/ansible-playbook /data/deployment'.$request_uri.'.yml');   
  } 
}

?></pre>