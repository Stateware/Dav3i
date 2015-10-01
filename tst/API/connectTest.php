<?php
/*
 * Copyright 2015 Stateware Team: William Bittner, Joshua Crafts, 
 * Nicholas Denaro, Dylan Fetch, Paul Jang, Arun Kumar, Drew Lopreiato,
 * Kyle Nicholson, Emma Roudabush, Berty Ruan, Vanajam Soni
 * 
 * This file is part of Dav3i.
 * 
 * Dav3i is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * Dav3i is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Dav3i.  If not, see <http://www.gnu.org/licenses/>.
 */

/* File Name:           connect_test.php
 * Description:         This file tests the functions of connect.php using PHP Unit.
 * 
 * Date Created:        9/11/2015
 * Contributors:        Brent Mosier
 * Date Last Modified:  9/11/2015
 * Last Modified By:    Brent Mosier
 * Dependencies:        connect.php, Toolbox.php
 * Input:               NONE
 * Output:              NONE
 * Additional Notes:    In its current iteration, this document has security vulnerabilities
 *                      that could seriously damage the database. Keeping this file uploaded
 *                      while not actively being developed is NOT recommended.
 */


/*
    $databaseConnection = new mysqli("localhost", "root", "", "Dav3i");    
    if ($databaseConnection->connect_error)
    {
        ThrowFatalError("Could not connect to database.");
    }
    return $databaseConnection;
*/
    class connectTest extends \PHPUnit_Framework_TestCase
    {

function testGetDatabaseConnection()
{
    //create stub database to connect to 
    //test connection to server
    //check if connection error occurred
    //no error, return value

    //check return value

    $host = "localhost";
    $user = "root";
    $password = "";
    $database = "Dav3i";

    $databaseConnection = new mysqli($host, $user, $password, $database);

    $this->assertTrue($databaseConnection->connect_error == NULL);
}

function testGetDatabaseConnectionErrorHost()
{
	//create stub database to connect to
    //test connection to server
    //check if connection error occurred
    //error occurred, throw error message
    //return

    //check return value and thrown message

    $host = "x";
    $user = "root";
    $password = "";
    $database = "Dav3i";
    $expectedMessage = "No such host is known.";

    try{
    $databaseConnection = new mysqli($host, $user, $password, $database);
    $this->assertTrue(false);

    }
    catch (Exception $e) {
        $errorMessage = $e->getMessage();
        $this->assertTrue(true);        
    }
}

function testGetDatabaseConnectionErrorUser()
{
    //create stub database to connect to
    //test connection to server
    //check if connection error occurred
    //error occurred, throw error message
    //return

    //check return value and thrown message

    $host = "localhost";
    $user = "";
    $password = "";
    $database = "Dav3i";

    try{
    $databaseConnection = new mysqli($host, $user, $password, $database);
    $this->assertTrue(false);

    }
    catch (Exception $e) {
        $errorMessage = $e->getMessage();
        $this->assertTrue(true);        
    }
}

function testGetDatabaseConnectionErrorPassword()
{
    //create stub database to connect to
    //test connection to server
    //check if connection error occurred
    //error occurred, throw error message
    //return

    //check return value and thrown message

    $host = "localhost";
    $user = "root";
    $password = "x";
    $database = "Dav3i";

    try{
    $databaseConnection = new mysqli($host, $user, $password, $database);
    $this->assertTrue(false);

    }
    catch (Exception $e) {
        $errorMessage = $e->getMessage();
        $this->assertTrue(true);        
    }
}

function testGetDatabaseConnectionErrorDatabase()
{
    //create stub database to connect to
    //test connection to server
    //check if connection error occurred
    //error occurred, throw error message
    //return

    //check return value and thrown message

    $host = "localhost";
    $user = "root";
    $password = "";
    $database = "x";

    try{
    $databaseConnection = new mysqli($host, $user, $password, $database);
    $this->assertTrue(false);

    }
    catch (Exception $e) {
        $errorMessage = $e->getMessage();
        $this->assertTrue(true);        
    }
}

}

?>