<?php
/* File Name:           toolbox.php
 * Description:         This will be included in nearly every PHP file we write and it will hold commonly
 *                             used functions and any globals we may need.
 * Date Created:        2/12/2015
 * Contributors:        Drew Lopreiato, William Bittner, Kyle Nicholson, Berty Ruan, Arun Kumar
 * Date Last Modified:  2/20/2015
 * Last Modified By:    Drew Lopreiato
 * Dependencies:        none
 * Input:               none
 * Output:              none
 */ 
     
// ===================== Function Definitions =====================     
//OUTPUT: This function will cause the program to close itself after echoing an error message.
//INPUT: string message - optional further description of error
function ThrowFatalError($message = "An Error has occured.") 
{
    echo "{\"error\" : \"" . $message . "\"}";
    if(!TESTING)
    {
        die();
    }
} // END ThrowFatalError


//OUTPUT: The first row from the "columnName" column of the "tableName" table of the "database" database
//            with optional "filter" filter
//INPUTS:     database: the database to query
//            tableName: the table in the database to get the data from
//            columnName: the column of the table from which to return the first row
//            filter: when supplied, will add a filter to the query
function GetFirstRowFromColumn($database, $tableName, $columnName, $filter = false)
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
 * 1. the ThrowFatalError doesn't kill the page
 * 2. the API calls can be made from 
 */
define("TESTING", TRUE);
?>
