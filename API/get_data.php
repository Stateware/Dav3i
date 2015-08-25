<?php
require_once('api_library.php');

$databaseConnection = GetDatabaseConnection();

echo json_encode(new Data($databaseConnection));
?>
