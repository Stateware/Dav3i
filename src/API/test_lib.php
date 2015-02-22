<?php

require_once("toolbox.php");
require_once("connect.php");
require_once("api_library.php");

$databaseConnection = GetDatabaseConnection();

print_r(GetStatNames($databaseConnection));


?>