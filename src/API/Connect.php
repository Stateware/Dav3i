<?php
/* File Name:           Connect.php
 * Description:         This file contains a function to create a mysqli connection
 * 
 * Date Created:        2/7/2015
 * Contributors:        Kyle Nicholson, Berty Ruan
 * Date Last Modified:  2/13/2015
 * Last Modified By:    Drew Lopreiato
 * Dependencies:        Toolbox.php
 * Input:               NONE
 * Output:              NONE
 * Additional Notes:    Replace HOST, USER, PASSWORD, and DATABASE with information relvant to your build.
 */
require_once("Toolbox.php");


function GetDatabaseConnection()
{
    $databaseConnection = new mysqli("localhost","root","","peachtree");
    
    if ($databaseConnection->connect_error)
    {
        ThrowFatalError("Could not connect to database.");
    }
    return $databaseConnection;
} // END GetDatabaseConnection

?>
