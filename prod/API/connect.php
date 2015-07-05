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
 * Contributors:        Kyle Nicholson, Berty Ruan, Drew Lopreiato, William Bittner
 * Date Last Modified:  5/1/2015
 * Last Modified By:    William Bittner
 * Dependencies:        Toolbox.php
 * Input:               NONE
 * Output:              NONE
 * Additional Notes:    Replace HOST, USER, PASSWORD, and DATABASE with information relvant to your build.
 */
require_once("toolbox.php");


function GetDatabaseConnection()
//Post: A database connection has been created and returned
{
    $databaseConnection = new mysqli(HOST, USER, PASSWORD, DATABASE);
    
    if ($databaseConnection->connect_error)
    {
        ThrowFatalError("Could not connect to database.");
    }
    return $databaseConnection;
} // END GetDatabaseConnection

?>
