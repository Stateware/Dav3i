<?php
/* File Name:           connect.php
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

$host; // = localhost || adderen.cse.psu.edu || azure.peachtree || server4you.com/umbuntu
$username; // = root
$password = password;
$dbname = peachtree;
// $conn is the database connection object
$conn = new mysqli($host,$username,$pass,$dbname);
if($conn->connect_error)
{
    die('ERROR: Could not connect');
}
?>