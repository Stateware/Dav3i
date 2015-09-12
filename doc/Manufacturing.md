  1. Install XAMPP.
  2. Enabled the service modules for Apache and MySQL.
  3. Start MySQL and Apache.
  4. Go to the admin page for MySQL (Done by clicking the admin button on xampp).
  5. Import the database from the repository:
    1. Navigate to the databases tab.
    2. Create a database  called "Dav3i".
    3. Click on "Dav3i" and it should bring you to that database, which should be empty.
    4. Navigate to the Import tab.
    5. Click Browse and search for the file called "davvvisqldump.sql".
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
  9. Now we need to change the connection strings (Which should be put in a settings file)
    1. Open "data_query.js" in GUI/ and modify line 59:  
      `url: 'http://usve74985.serverprofi24.com/dav3i/API/by_country.php?countryIDs='`  
      to  
      `url: 'http://localhost/dav3i/API/by_country.php?countryIDs='`
    2. Open "lookup_table.js" in GUI/ and modify lines 70 and 160  
      `url: 'http://usve74985.serverprofi24.com/dav3i/API/descriptor.php'`  
      to  
      `url: 'http://localhost/dav3i/API/descriptor.php'`  
      and  
      `url: 'http://usve74985.serverprofi24.com/dav3i/API/by_stat.php?statID='`  
      to  
      `url: 'http://localhost/dav3i/API/by_stat.php?statID='`
    3. Open "Connect.php" in API/ and modify line 41  
      `$databaseConnection = new mysqli(HOST, USER, PASWWORD, DATABASE);`  
      to  
      `$databaseConnection = new mysqli("localhost", "root", "", "dav3i");`