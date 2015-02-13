<?php
/* File Name:           Connect.php
 * Description:         This file connects to the database using
 *                      the proper hostname/username/password/dbname
 * 
 * Date Created:        2/7/2015
 * Contributors:        Kyle Nicholson, Berty Ruan
 * Date Last Modified:  2/8/2015
 * Last Modified By:    Kyle Nicholson, Berty Ruan
 * Dependencies:        NULL
 * Input:               NONE
 * Output:              $conn -> this is a connection to the database
 * Additional Notes:    when we get the real database we will input the 
 *                      correct hostname/username/password/dbname
 */
require_once("Toolbox.php");


function GetDatabaseConnection()
{
	$databaseConnection = new mysqli("localhost", "root", "", "peachtree");

	if ($databaseConnection->connect_error)
	{
		ThrowFatalError("Could not connect to database.");
	}

	return $databaseConnection;
} // END GetDatabaseConnection

?>