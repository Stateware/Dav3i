<?php
/* File Name:           connect.php
 * Description:         This file contains a function to create a mysqli connection.
 * 
 * Date Created:        2/7/2015
 * Contributors:        Kyle Nicholson, Berty Ruan
 * Date Last Modified:  2/22/2015
 * Last Modified By:    Arun Kumar
 * Dependencies:        Toolbox.php
 * Input:               NONE
 * Output:              NONE
 * Additional Notes:    Replace HOST, USER, PASSWORD, and DATABASE with information relevant to your build.
 */
require_once("toolbox.php");


function GetDatabaseConnection()
{
    $databaseConnection = new mysqli(HOST, USER, PASSWORD, DATABASE);
    
    if ($databaseConnection->connect_error)
    {
        ThrowFatalError("Could not connect to database.");
    }
    return $databaseConnection;
} // END GetDatabaseConnection

?>
