<?php
/*
 * Copyright 2015 The Pennsylvania State University
 * 
 * This file is part of CyberVAN.
 * 
 * CyberVAN is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * CyberVAN is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with CyberVAN.  If not, see <http://www.gnu.org/licenses/>.
 */

/* File Name:           connect.php
 * Description:         This file contains a function to create a mysqli connection.
 * Dependencies:        toolbox.php
 * Additional Notes:    Replace HOST, USER, PASSWORD, and DATABASE with information relvant to your build.
 */

require_once("toolbox.php");

function GetDatabaseConnection()
//Post: A database connection has been created and returned
{
    $databaseConnection = new mysqli("localhost", "root", "kennyl0gindangerz0ne$", "davvvi_dev");
    
    if ($databaseConnection->connect_error)
    {
        ThrowFatalError("Could not connect to database.");
    }
    return $databaseConnection;
} // END GetDatabaseConnection

?>
