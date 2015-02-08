<?php
$conn_error = 'ERROR: Could not connect';
$conn = new mysqli($host,$username,$pass,$dbname);
if($conn->connect_error)
{
    die($conn_error);
}
?>