<?php
/* File Name:           api_library.php
 * Description:         This file holds all of the functions which the api calls will return
 * Date Created:        2/19/2015
 * Contributors:        William Bittner, Drew Lopreiato, Kyle Nicholson, Arun Kumar, Dylan Fetch
 * Date Last Modified:  2/19/2015
 * Last Modified By:    William Bittner, Drew Lopreiato, Kyle Nicholson, Arun Kumar, Dylan Fetch
 * Dependencies:        connect.php, toolbox.php
 * Input:               none                     
 * Output:              none
 */
 
require_once("toolbox.php");
require_once("connect.php");
 
// ======================== API Functions =========================

function ByStat($statID, $year)
{
	
}




function Descriptor()
{
	$databaseConnection = GetDatabaseConnection();
	$cc2 = array();
	$cc3 = array();
	$countryName = array();
	//Hardcoded table because idk
	$yearRange = GetYearRange($databaseConnection, "data_births");
	$stats = GetStatNames($databaseConnection);
	
	$countriesQuery = "SELECT * FROM meta_countries ORDER BY country_id";
	$countriesResult = $databaseConnection->query($countriesQuery);
	
	//fill cc2, cc3, and countryName arrays in order by ID
	while($countriesRow = $countriesResult->fetch_assoc())
	{
		array_push($cc2, $countriesRow['cc2']);
		array_push($cc3, $countriesRow['cc3']);
		array_push($countryName, $countriesRow['common_name']);
	}
	
	//return the nested arrays
	return(array("yearRange" => $yearRange, "cc2" => $cc2, "cc3"=> $cc3, "common_name" => $countryName, "stats" => $stats));
}

// ======================= Helper Functions =======================
 
 
// Author:        William Bittner, Drew Lopreiato, Berty Ruan, Dylan Fetch
// Date Created:  2/22/2015 
// Last Modified: 2/22/2015 by William Bittner, Drew Lopreiato, Berty Ruan, Dylan Fetch  
// Description:   This function returns an array containing every statistic that is in the database
// PRE:  $database is a mysqli database connection
// POST: FCTVAL == array of the names of all statistics in the database
function GetStatNames($database)
{
	//returning array
	$statArray = array();
	
	$statQuery = "SELECT stat_name FROM meta_stats";
	$statResult = $database->query($statQuery);
	
	//If the table is empty, statResults will have a value of false. If this happens something has deleted
	//the meta_stats table - refer to the mySQL architecture
	if($statResult === false)
	{
		ThrowFatalError("MySQL Architecture error");
	}
	
	//Put each row's column of "stat_name" into an array
	while($statRow = $statResult->fetch_assoc())
	{
		array_push($statArray, $statRow['stat_name']);
	}
	
	return $statArray;
}
  
 
 
 
// Author:        William Bittner, Drew Lopreiato  
// Date Created:  2/19/2015 
// Last Modified: 2/19/2015 by William Bittner, Drew Lopreiato  
// Description:   This function returns the first and last year of a given table, which is the second and last columns header 
// PRE:  $database is a mysqli database connection, and table is a valid table in that connection
// POST: return an array with exactly two indices: index 0 is the lowest year, index 1 is the highest year  
function GetYearRange($database, $table)
{
	$indexOfFirstYearColumn = 1;
	$descriptionArray = array();
	$yearRange = array();
		
	//Create the query and query the query
    $descriptionQuery = "DESCRIBE " . $table;
	$descriptionResult = $database->query($descriptionQuery);
	
	if($descriptionResult === false)
	{
		ThrowFatalError("Invalid table name for year range.");
	}
	
	//Throw each column's 'field' value into an array 
	while($descriptionRow = $descriptionResult->fetch_assoc())
	{
		array_push($descriptionArray, $descriptionRow['Field']);
	} 
	
	//Put the first and last year into the returning array
	array_push($yearRange, $descriptionArray[$indexOfFirstYearColumn]);
	array_push($yearRange, $descriptionArray[count($descriptionArray) - 1]);
	
	
	return $yearRange;
} //END GetYearRange

?>