#!/bin/bash

deploy_code ()
{
  echo 'deploying code'
  autodeploy_up=`netstat -lnt | grep ":81 " | wc -l`
  
  if [ $autodeploy_up -ge 1 ]; then
    echo 'hit'
    curl --request POST localhost:81
  else
    echo 'miss'
    sleep 5s
    deploy_code
  fi
}

deploy_code
