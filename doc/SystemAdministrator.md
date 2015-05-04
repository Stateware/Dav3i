# System Administrator Document

### Table of Contents
* [Introduction](#introduction)
* [Tools](#tools)
  * [Database Backup](#database-backup)
  * [Database Restoration](#database-restoration)
  * [Restarting Apache](#restarting-apache)
  * [Changing A User Password](#changing-a-user-password)
  * [Changing A MySQL Password](#changing-a-mysql-password)

## Introduction

This document exists to outline to any user what our current system set up is, what configurations we have set that differ from application defaults, and helpful notes for how to maintain the server in the future.

## Tools

### Database Backup

It is recommended that before doing any testing on the database, and periodically throughout the lifespan of the server, that the database be backed up. Backing up a MySQL can be done with the following command into the server's terminal.

```
mysqldump -u [username] -p [password] [databasename] > [backupfile.sql]
```

The username, password, and database name can be found in the security document for the server. The backupfile can be placed in any directory and can be named anything, however it is recommended for uniformity sake that you name the file the name of the database you are backing up, and the date you are backing it up on. For example "dtbse2015-04-28.sql" would be the appropriate name for a database named "dtbse" backed up on April 28th, 2015.

### Database Restoration

In order to restore a database to the state it was in when a backup was made, you can execute the following command into the server's terminal.

````
mysql -u [username] -p [password] [databasename] < [backupfile]
````

The username, password, and database name can be found in the security document for the server. The backupfile is the full path to the file you wish to use as your restore point.

### Restarting Apache

When making adjustments to the Apache configuration files, the changes made will not be reflected in the server's behavior until Apache is restarted. This can be done with the following command into the server's terminal.

```
/etc/init.d/apache2 restart
```

Please note that during this restart time (usually on the order of seconds), all connections to the server will be refused.

### Changing A User Password

If you ever need to change the password for a user, you can use the following command in the server's terminal.

````
passwd
````

It will ask you to enter your new password twice before making the changes.

### Changing A MySQL Password

If you ever need to change the password for a MySQL user, you can use the following set of commands in the server's terminal.

````
mysql
use mysql;
SELECT user, host FROM user;
SET PASSWORD FOR 'user'@'host' = PASSWORD('password');
FLUSH PRIVILEGES;
````

The first line should be executed in the shell. This will open the MySQL process. The second line tells MySQL to start editing the database that describes itself. The third line will give you a table of all the users and their hosts that exist in the database. The fourth line will set the password for the given user from a given host. The last line will commit all of those changes to the database.
