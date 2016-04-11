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

/* File Name:           connect.php
 * Description:         This file contains a function to create a mysqli connection.
 * 
 * Date Created:        2/7/2015
 * Contributors:        Kyle Nicholson, Berty Ruan, Drew Lopreiato, William Bittner, Brent Mosier, Nicholas Denaro
 * Date Last Modified:  4/4/2016
 * Last Modified By:    William Bittner
 * Dependencies:        Toolbox.php
 * Input:               NONE
 * Output:              NONE
 */
require_once("toolbox.php");

//define globally for use as "singleton" in GetDatabaseConnection function
$_databaseConnection;

/*
 * Function: GetDatabaseConnection
 * This function returns a "singleton" object $_databaseConnection that can be used to connect to the database
 * 
 *
 * Pre: A config file exists in $configLocation structured as defined in the documentation
 * 
 *
 * Post: A database connection object is returned
 * 
 *
 * Authors: William Bittner, Nicholas Denaro
 * 
 *
 * Date Created: 4/4/2016
 * 
 *
 * Last Modified: 4/4/2016 by William Bittner
 * 
 */
function GetDatabaseConnection( $configLocation ="..\\CONF\\backend_connection_strings.conf" )
//Post: A database connection has been created and returned
{
	if( !isset( $_databaseConnection ) )
	{
		//read conf file
		$string = file_get_contents( $configLocation );
		
		//parse conf string
		$json = json_decode($string);
		
		//set db credentials
		$environment = $json->environment;
		
		if ( !isset( $json->$environment) )
		{
			ThrowFatalError("Invalid Environment in Connection Strings config");
		}
		
		$host = $json->$environment->DBHost;
		$user = $json->$environment->DBUser;
		$pass = $json->$environment->DBPass;
		$name = $json->$environment->DBName;
		
		$_databaseConnection = new mysqli($host, $user, $pass, $name);
		
	    if ($_databaseConnection->connect_error)
	    {
	        ThrowFatalError("Could not connect to database.");
	    }
	}
    return $_databaseConnection;
} // END GetDatabaseConnection

?>
