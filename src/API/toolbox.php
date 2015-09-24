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

/* File Name:           toolbox.php
 * Description:         This will be included in nearly every PHP file we write and it will hold commonly
 *                             used functions and any globals we may need.
 * Date Created:        2/12/2015
 * Contributors:        Drew Lopreiato, William Bittner, Kyle Nicholson, Berty Ruan, Arun Kumar
 * Date Last Modified:  5/1/2015
 * Last Modified By:    William Bittner
 * Dependencies:        none
 * Input:               none
 * Output:              none
 */ 
     
// ===================== Function Definitions =====================     

function ThrowFatalError($message = "An error has occured - the program has been terminated.") 
//PRE: string message - optional further description of error
//POST: This function will cause the program to close itself after echoing an error message.
{
    if(!TESTING)
    {
        echo "{\"error\" : \"" . $message . "\"}";
        die();
    }
    else
    {
        throw new Exception("{\"error\" : \"" . $message . "\"}");
    }
} // END ThrowFatalError

function ThrowInconvenientError($message = "An inconvenient error has occured - program flow will continue.") 
//PRE: string message - optional further description of error
//POST: This function will cause simply echo an error message, but unlike the above will not terminate the program.
{
    echo "Error: " . $message;
} // END ThrowInconvenientError




function GetFirstRowFromColumn($database, $tableName, $columnName, $filter = false)
//PRE:     database: the database to query tableName: the table in the database to get the data from
//            columnName: the column of the table from which to return the first row
//            filter: when supplied, will add a filter to the query
//POST: FCTVAL == The first row from the "columnName" column of the "tableName" table of the "database" database
//            with optional "filter" filter
{
    $query = "SELECT " . $columnName . " FROM " . $tableName;
    if ($filter !== false)
    {
        $query .= " WHERE " . $filter;
    }
    $results = $database->query($query);
    $row = $results->fetch_assoc();
    $results->free();
    return $row[$columnName];
} // END GetFirstRowFromColumn


// ===================== Variable Declaration =====================
// These are global variables that describe our default values for data of the given types
define("DEFAULT_NUMBER", -1);
define("DEFAULT_STRING", "");
/*      EFFECTS OF TESTING == TRUE:
 * The ThrowFatalError doesn't kill the page
 */
define("TESTING", TRUE);
/*  EFFECTS OF EXTERNAL_ACCESS == TRUE:
 * All API calls are allowed to be accessed by non-server users
 */
define("EXTERNAL_ACCESS", FALSE);
?>
