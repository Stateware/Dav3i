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
	$heatMapArray = array();
	$descriptor = Descriptor();
	$yearRange = $descriptor['yearRange'];
	$numStats = count($descriptor['stats']);
	$databaseConnection = GetDatabaseConnection();
	
	//if year is set to default, there was no year enter and thus we give it the most recent year
	//this also means we don't need to check to see if the year is valid or sanitary 
	if($year == DEFAULT_STRING)
	{
		$year = $yearRange[1];
	}
	else
	{
		//check inputs are sanitary
		if (!IsSanitaryYear($year))
		{
	    	ThrowFatalError("Input is unsanitary: year");
		}

		//Check inputs are valid
		if (!IsValidYear($year, $yearRange))
		{
		    ThrowFatalError("Input is invalid: year");
		}
	}
	//check inputs are sanitary
	if (!IsSanitaryStatID($statID))
	{
	   	ThrowFatalError("Input is unsanitary: statID");
	}
	
	//Check inputs are valid
	if (!IsValidStatID($statID,$numStats))
	{
	   ThrowFatalError("Input is invalid: statID");
	}
	
	
	// Retrieve the table name of the inputted stat ID.
	$tableName = GetFirstRowFromColumn($databaseConnection, "meta_stats", "table_name", "table_id = $statID");
	$heatMapQuery = "SELECT `" . $year . "` FROM " . $tableName . " ORDER BY country_id ASC";
	$heatMapResults = $databaseConnection->query($heatMapQuery);
	while($heatMapRow = $heatMapResults->fetch_assoc())
	{
   		array_push($heatMapArray, $heatMapRow[$year]);
	}
	
	return ($heatMapArray);	
}


function ByCountry($countryIDs)
{
	$databaseConnection = GetDatabaseConnection();
	$byCountryArray = array();
	$descriptor = Descriptor();
	$numCountries = count($descriptor['common_name']);
	$statTables = array();
	
	if (!IsSanitaryCountryList($countryIDs))
	{
		ThrowFatalError("Input is unsanitary: countryIDs");
	}
	
	$countryIDList = explode(",", $countryIDs);
	
	// validate each countryID
	foreach ($countryIDList as $countryID)
	{
		if (!IsValidCountryID($countryID, $numCountries))
		{
			ThrowFatalError("Input is invalid: countryID (" . $countryID . ")");
		}
	}
	
	// put each stat table into an array, where its index is the id for that table
	$statTablesQuery = "SELECT table_id, table_name FROM meta_stats";
	$statTablesResults = $databaseConnection->query($statTablesQuery);
	while ($statTablesRow = $statTablesResults->fetch_assoc())
	{
	    $statTables[$statTablesRow['table_id']] = $statTablesRow['table_name'];
	}
	
	// get the queries for each country and stat
	$countryDataQueries = GetCountryQueries($statTables, $countryIDList);
	
	// query the query for each country n stuff.
	foreach($countryDataQueries as $statID => $query)
	{
		$countryDataResults = $databaseConnection->query($query);
	    while ($countryDataRow = $countryDataResults->fetch_array(MYSQLI_NUM))
	    {
	    	$countryID = $countryDataRow[0];
	    	$byCountryArray[$countryID][$statID] = array_slice($countryDataRow, 1);
	    }	
	}
	
	
	return $byCountryArray;
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
 
function IsSanitaryYear($year)
{
    // This matches exclusively 4 digits in a row.
    return preg_match("/^\d{4}$/", $year) === 1;
}

function IsSanitaryStatID($statID)
{
    // This matches exclusively 1 or more digits in a row.
    return preg_match("/^\d+$/", $statID) === 1;
}

function IsSanitaryCountryList($countryList)
{
	// This matches exclusively 1 or more groups of comma delimited digits.
	return preg_match("/^\d+(,\d+)*$/", $countryList) === 1;
}

function IsValidYear($year, $yearRange)
{
    return ($year >= $yearRange[0] && $year <= $yearRange[1]);
}

function IsValidStatID($statID, $numStats)
{
	//As stats are numbered starting at one, the count of the array is equal to the highest value stat.
	//Check >0 and <= the number of stats as a stat id can't be less than 1 or more than the number of stats
    return($statID <= $numStats && $statID > 0);
}

function IsValidCountryID($countryID, $numCountries)
{
	//As countries are numbered starting at one, the count of the array is equal to the highest value country.
	//Check > 0 and <= the number of countries as a country id can't be less than 1, or more than the number of
	//countries
    return($countryID <= $numCountries && $countryID > 0);
}
 
 
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

// Returns an array of queries given a set of tables to be queried, and the countries to be queried
// $tableNames must be in format: tableID => tableName
// $countries must be an array of integers
function GetCountryQueries($tableNames, $countries)
{
    $returnValue = array();
    // iterate through each table name
    foreach ($tableNames as $tableID => $tableName) 
    {
        $getDataQuery = "SELECT * FROM " . $tableName . " WHERE";
        $firstOne=true;
        // iterate through each country identifier
        foreach ($countries as $countryID) 
        {
            if(!$firstOne)
            {
                $getDataQuery.= " OR";
            }
            
            $getDataQuery.= " country_id=" . $countryID;
            $firstOne=false;
        }
        $returnValue[$tableID] = $getDataQuery;
    }
    return $returnValue;
} // END getCountryQueries

?>