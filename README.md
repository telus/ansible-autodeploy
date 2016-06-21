# ansible-autodeploy

Simple deployment tool with hooks

[![Platforms](http://img.shields.io/badge/platforms-ubuntu-lightgrey.svg?style=flat)](#)

Tunables
--------
* `autodeploy_user` (string) - User to run tomcat as.
* `autodeploy_group` (string) - Group to run tomcat as.

* `autodeploy_runtime_root` (string) - The runtime root.
* `autodeploy_pidfile_path` (string) - The pidfile path.
* `autodeploy_listener_docroot` (string) - Where the autodeploy listener is locate (Listener.js for node, index.php for php).
* `autodeploy_restart_enabled` (boolean) - Allow autodeploy to restart system services?

* `autodeploy_listener` (string) - The listener to use [php, node].
* `autodeploy_proxy_method` (string) - The proxy to autodeploy with [nginx, haproxy].

* `autodeploy_using_standard_playbook` (boolean) - Use ansible generated deployment playbook, or nah?
* `autodeploy_dynamic_deploy_repo_names` (list) - A list of projects to deploy on git POST hooks.
* `autodeploy_post_deployment_commands` (list) - Any shell commands to run after deployment.

* `autodeploy_inital_deployment` (DEPRECATED; boolean) - Support to be removed January 1st, 2017; use `autodeploy_initial_deployment`
* `autodeploy_initial_deployment` (boolean) - Should autodeploy be invoked when the template changes?
* `autodeploy_deployment_on_reboot` (boolean) - Should autodeploy be invoked when the system is rebooted?

 #### file manipulation

* `autodeploy_insert_enabled` (boolean) - Insert data into files?
* `autodeploy_insert` (list) - The files and contents to insert into the file.

* `autodeploy_rewrite_enabled` (boolean) - Rewrite some lines in files?
* `autodeploy_rewrite_replace` (string) - The regex string to replace.
* `autodeploy_rewrite_files` (list) - A list of files to rewrite.

 #### wordpress
* `autodeploy_for_wordpress` (boolean) - Are you deploying a wordpress site?
* `autodeploy_wordpress_config_path` (string) - The location of your worpress config file.

 #### external assets
* `autodeploy_external_asset_storage_enabled` (boolean) - Are you grabbing some assets from an external source?
* `autodeploy_external_asset_storage_source` (string) - The local mount point for the external assets.
* `autodeploy_external_asset_storage_destination` (string) - The path to write out external assets.

 #### version control
* `autodeploy_repository_origin` (string) - The repository origin. Mandatory.
* `autodeploy_repository_branch`(string) - The repository branch.
* `autodeploy_docroot` (string) - The path to deploy into.
* `autodeploy_key` (string) - The path for the private deployment key.

 #### database
* `autodeploy_database_bundled` (boolean) - Is your database in version control?
* `autodeploy_database_compressed` (boolean) - Is your database compressed?
* `autodeploy_database_file` (string) - The name of the database file.
* `autodeploy_database_file_compressed` (string) - The name of the compressed database file.
* `autodeploy_database_load_balanced` (boolean) - Is your database load balanced?
* `autodeploy_database_engine` (string) - The database to use [postgres, mysql-compatible].

 #### slack
* `autodeploy_slack_notifications_enabled` (boolean) - Are you notifying of deployments via slack?
* `autodeploy_slack_domain` (string) - The slack domain.
* `autodeploy_slack_channel` (string) - The slack channel.

 #### dependency management
* `autodeploy_compass_enabled` (boolean) - Are you using compass?
* `autodeploy_compass_root` (string) - The compass root.

* `autodeploy_requirejs_enabled` (boolean) - Are you using require.js?
* `autodeploy_requirejs_fileglob` (string) - The glob of files to use with require.js.

* `autodeploy_composer_enabled` (boolean) - Are you using composer?
* `autodeploy_composer_root` (string) - The composer root.

* `autodeploy_for_node` (boolean) - Are you autodeploying a node app with dependencies?
* `autodeploy_for_bower` (boolean) - Are you autodeploying a project with bower?
* `autodeploy_for_ruby` (boolean) - Are you autodeploying a ruby app with dependencies?

 #### private
* `deployment_private_key` (string) - The deployment private key to use for github/bitbucket

Dependencies
------------
* [telusdigital.yo-dawg](https://github.com/telusdigital/ansible-ansible/)

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
* [Chris Olstrom](https://colstrom.github.io/) | [e-mail](mailto:chris@olstrom.com) | [Twitter](https://twitter.com/ChrisOlstrom)
* Ben Visser
* Nikki
* Steven Harradine
* Aaron Pederson
* Kinnan Kwok
* Justin Scott
