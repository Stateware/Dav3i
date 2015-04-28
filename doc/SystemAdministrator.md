# System Administrator Document

### Table of Contents
* [Introduction](#introduction)
* [Tools](#tools)
  * [Database Backup](#database-backup)
  * [Database Restoration](#database-restoration)
  * [Restarting Apache](#restarting-apache)

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

```

Please note that during this restart time (usually on the order of seconds), all connections to the server will be refused.
