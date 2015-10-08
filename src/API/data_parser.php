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

/* File Name:           data_parser.php
 * Description:         This file takes an CSV given by data_uploader.php, and parses it into
 *                      the database.
 * 
 * Date Created:        3/18/2015
 * Contributors:        Drew Lopreiato, William Bittner, Brent Mosier
 * Date Last Modified:  10/1/2015
 * Last Modified By:    Brent Mosier
 * Dependencies:        connect.php
 * Input:               NONE
 * Output:              NONE
 * Additional Notes:    In its current iteration, this document has security vulnerabilities
 *                      that could seriously damage the database. Keeping this file uploaded
 *                      while not actively being developed is NOT recommended.
 */

require_once("connect.php");

$g_type = $_POST['data_type'];
$g_tableName = $_POST['table_name'];
$g_statisticName = $_POST['stat_name'];
$g_fileTemporaryName = $_FILES['userfile']['tmp_name'];

//if all are null, don't run parser
//HOPE: check if parser is being called by an api call. if it is, run otherwise don't run. may not be possible to check.
if(($g_type != NULL) && ($g_tableName != NULL) && ($g_statisticsName != NULL) && ($g_fileTemporaryName != NULL))
{
    parser($g_type, $g_tableName, $g_statisticsName, $g_fileTemporaryName);    
}


function parser($type, $tableName, $statisticsName, $fileTemporaryName){
    $testData = "";
    // when a file gets uploaded, it is placed in a temporary directory in the database.
    // this directory location can be accessed by PHP with the following line

    $fileTemporaryName = $_FILES['userfile']['tmp_name'];

    // we place the entire contents of the file into the $testData variable

    $testData = file_get_contents($fileTemporaryName);

    // Because the data needs to at least have a place holder, we will replace any missing
    // data (shown with a ',,') with a negative one. We run this twice because the first run
    // can still leave some double commas.
    $testData = preg_replace("/,,/", ",-1,", preg_replace("/,,/", ",-1,", $testData));
    // We also replace data that is read as NA with -1's.
    $testData = preg_replace("/,NA/", ",-1", preg_replace("/,NA/", ",-1", $testData));
    // We then remove any quotation marks in the file.
    $testData = preg_replace("/\"/", "", $testData);

    $databaseConnection = GetDatabaseConnection();

    // These are the fields set by the user in data_uploader.php
    $type = $_POST['data_type'];
    $tableName = $_POST['table_name'];
    $statisticName = $_POST['stat_name'];

    $metaTableQuery = "INSERT INTO meta_stats (stat_name, table_name) VALUES ('$statisticName', '$tableName')";
    $metaTableResults = $databaseConnection->query($metaTableQuery);
    if ($metaTableResults === false)
    {
        echo "meta_stats create table entry failed.";
        die();
    }


    // We will replace new lines in the data with a pipe. This will make it easier to parse into distinct rows.
    // sometimes you need the line directly below. sometimes you need the line two lines below. but never both.
    // if you're expecting the data to come in from a windows machine, the first line is needed.
    //$testData = preg_replace('~\R~', "|", preg_replace("/[\r\n]/", "|", $testData));
    $testData = trim(preg_replace('~\R~', "|", $testData));


    // separate the file into an array where each value is a row of the table
    $queryArray = array();
    $tableArray = explode("|", $testData);
    foreach($tableArray as $value)
    {
        // inside each row, turn the individual columns into an array, but start after the first column
        // because the first column is expected to be the country CC3.
        $tempArray = explode(",", $value, 2);
        if (isset($tempArray[1]))
        {
            // we are putting this into a key-value array where the key is the country CC3, and the value is the
            // array containing the data in its row
            $queryArray[$tempArray[0]] = $tempArray[1];
        }
    }
    // we pop the first row off because its the headers row
    $headers = array_shift($queryArray);

    // we then create the table with the given headers from the file
    $columnsArray = explode(",", $headers);
    //TODO: Make the country_id column be the index
    $createTableQuery = "CREATE TABLE $tableName (`country_id` int(10)";
    foreach ($columnsArray as $column)
    {
        $fixedColumnName = trim($column);
        $createTableQuery .= ", `$fixedColumnName` $type";
    }
    $createTableQuery .= ");";

    $createTableResults = $databaseConnection->query($createTableQuery);
    if ($createTableQuery === false)
    {
        echo "Table create query failed.";
        die();
    }

    // We then create a lookup table where the key is the countries CC3 value, and the value is its country_id
    $countryLookupTable = array();
    $countryLookupQuery = "SELECT cc3, country_id FROM meta_countries";
    $countryLookupResults = $databaseConnection->query($countryLookupQuery);
    while($countryLookupRow = $countryLookupResults->fetch_assoc())
    {
        $countryLookupTable[$countryLookupRow['cc3']] = $countryLookupRow['country_id'];
    }

    // insert every single row into the column
    foreach($queryArray as $country => $query)
    {
    	$specificQuery = "INSERT INTO $tableName VALUES(";
        
        $specificQuery .= $countryLookupTable[$country];

        $allTheStats = explode(",", $query);
        foreach ($allTheStats as $statistic) {
            // this NEEDS TO BE SPRINTF because (fun fact) when you echo a number, it puts it into scientific
            // notation. This breaks the query. HOWEVER if you use sprintf, it'll be guaranteed to have at
            // least six sig figs.
            $specificQuery .= sprintf(", %f", ScientificConversion($statistic));
        }

      	$specificQuery .= ");";
    	
    	$specificResults = $databaseConnection->query($specificQuery);
    	if ($specificResults === false)
    	{
    		echo "Individual row query failed.";
    	}
    }
}
// This is a line that should have been queried to the database to ensure speedy lookups
//ALTER TABLE data_cases ORDER BY country_id ASC
// oops.

// convert text in scientific notation into a floating point value
// Steven Shaffer, March 30, 2015
function ScientificConversion($in) {
    $pos = strpos($in, "E");
    if ($pos === false) {
        //Just convert it directly
        return floatval($in);
    }
    else {
        //Needs to be converted
        $part1 = substr($in, 0, $pos);
        $part2 = substr($in, $pos+1);
        $base = $part1 + 0;
        $exponent = $part2 + 0;
        $answer = $base * (pow(10, $exponent));
        return $answer;
    }
}

?>