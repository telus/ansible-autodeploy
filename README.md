# ansible-autodeploy

Simple deployment tool

[![Platforms](http://img.shields.io/badge/platforms-ubuntu-lightgrey.svg?style=flat)](#)

Tunables
--------
`autodeploy_inital_deploy` (boolean) - Should autodeploy be invoked with running of the role

Dependencies
------------
* none

Example Playbook
----------------
    - hosts: servers
      roles:
         - role: telusdigital.autodeploy

License
-------
[MIT](https://tldrlegal.com/license/mit-license)

Contributors
------------
* Chris Olstrom
