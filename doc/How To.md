# How To
This document will explain how to do various things that are important for getting through the semester.

## Set up a development environment

### Prerequisites
  1. XAMPP: [https://www.apachefriends.org/download.html?ModPagespeed=noscript](https://www.apachefriends.org/download.html?ModPagespeed=noscript)
  2. PHPUnit: [https://phpunit.de/](https://phpunit.de/)

### 1. Set up a XAMPP Stack
  1. Install XAMPP.
  2. Enabled the service modules for Apache and MySQL.
  3. Start MySQL and Apache.
  4. Go to the admin page for MySQL (Done by clicking the admin button on xampp).
  5. Import the database from the repository:
    1. Navigate to the databases tab.
    2. Create a database  called "Dav3i".
    3. Click on "Dav3i" and it should bring you to that database, which should be empty.
    4. Navigate to the Import tab.
    5. Click Browse and search for the file called "dav3i_development_database.zip".
    6. Click the Go buttom to finish the import.
  6. Stop Apache.
  7. Open the Apache config, "httpd.conf", and insert the following into the `<IfModule alias_module>` tag:
        ```
        Alias /dav3i "absolute_path_containing the resposity/src"
        <Directory "absolute_path_containing the resposity/src">
            AllowOverride AuthConfig
            Require all granted
        </Directory>
        ```
  8. Start Apache.
  9. Now we need to change the connection strings
    1. Open the CONF folder and open backend_connection_strings.conf. Change the username and password of the database, if applicable

### 2. Set up PHPUnit
  1. Add XAMPP's php to your Path  
    (Windows)
    1. Navigate to XAMPP installation folder
    2. Navigate to php
    3. Open up your System's environment variables.
    4. Append `;<path of the php folder>` to Path
  2. Follow the instructions at [https://phpunit.de/manual/current/en/installation.html](https://phpunit.de/manual/current/en/installation.html) to finish installing PHPUnit.

## Run the unit tests

### 1. PHPUnit
  1. Navigate to the tst/API folder.
  2. Open a console in the current location (Shift + Right click)
  3. Enter: phpunit --coverage-text=cover.txt .\
  4. PHPUnit should run. "." means passed. "F" means failed assert "E" means some sort of error.

### 2. QUnit 
  1. Navigate to tst/Frontend folder
  2. Open testing.html
  3. Blue means passed, red means failed.
  4. This can be sorted by module using the dropdown in the upper right.

## Deploy to the production server

### Prerequisites
  1. SFTP application (like FileZilla): [https://filezilla-project.org/](https://filezilla-project.org/)
  2. SSH application (like Putty): [http://www.putty.org/](http://www.putty.org/)

### 1. Set up
  1. Open your SFTP application and navigate to the folder: /var/www/html (This is the root of the website)
  2. Copy files from  src into a folder(such as Dav3ifa16)
  3. Add password protection to the CONF/protected and Upload folder  
      1. Navigate to /etc/apache2/  
      2. Open httpd.conf  
      3. Copy an existing protection and replace the proper folder paths.  
  4. Open your SSH application and run the command: sudo /etc/init.d/apache2 restart

## Run the documentation generator

### Prerequisites
  1. NaturalDocs: [http://www.naturaldocs.org/](http://www.naturaldocs.org/)
  2. Perl: [https://www.perl.org/](https://www.perl.org/)

### Run
  1. Navigate to the foler you installed NaturalDocs to (You should see the files: NaturalDocs and NaturalDocs.bat here)
  2. Open a command prompt in this location.

  3. Enter the command, replacing \<Dav3i> with the location of your repository: 
      > NaturalDocs.bat -i \<Dav3i>/src -o \<Dav3i>/doc/NaturalDocs -p \<Dav3i>/doc/NaturalDoc