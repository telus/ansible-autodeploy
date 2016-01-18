#!/bin/bash

deploy_code ()
{
  echo -n 'trying to deploy code '
  is_autodeploy_up=`netstat -lnt | grep ":81 " | wc -l`
  
  if [ $is_autodeploy_up -ge 1 ]; then
    echo 'hit'
    curl --request POST localhost:81
  else
    echo 'miss'
    sleep 5s
    deploy_code
  fi
}

deploy_code
