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

/* File Name:           api_library.php
 * Description:         This file holds all of the functions which the api calls will return as well as helper functions to those calls
 * Date Created:        2/19/2015
 * Contributors:        William Bittner, Drew Lopreiato, Kyle Nicholson, Arun Kumar, Dylan Fetch
 * Date Last Modified:  5/1/2015
 * Last Modified By:    William Bittner
 * Dependencies:        connect.php, toolbox.php
 * Input:               none                     
 * Output:              none
 */
 
require_once("toolbox.php");
require_once("connect.php");
require_once("by_stat_packet.php");
require_once("by_country_packet.php");
 
// ======================== API Functions =========================


// Author:        William Bittner, Drew Lopreiato
// Date Created:  2/22/2015  
// Last Modified: 5/1/2015 by William Bittner  
// Description:   This function queries the database for one specific stat for one specific year for every country
function ByStat($statID, $year, $sessionID, $instanceID)
// PRE: statID is a valid ID of a stat in the database, and year is a valid year in the database
// POST: FCTVAL == array of key value pairs whose index are:
//			0: key: statID, value: an array containing each countries data for that stat in the index that corresponds
// 					to the countries ID
//			1: key: "force", value: "object" - this is so that the json returned to the caller of this function 
//					returns an object, not an array of one element.
{
    $heatMapArray = array();						//initialize the array we will return as the heatmap
    $descriptor = Descriptor(); 					//call our desciptor function and assign it to a variable
    $yearRange = $descriptor['yearRange'];			//get the year range out of the descriptor 
    $numStats = count($descriptor['stats']);		//get the number of stats out of the descriptor
    $databaseConnection = GetDatabaseConnection();	//store connection to the database
    
    //if year is null, there was no year entered and thus we give it the most recent year
    //this also means we don't need to check to see if the year is valid or sanitary 
    if(is_null($year))
    {
        $year = $yearRange["endYear"];
    }
    else
    {
        //check year is sanitary
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
    //check statID is sanitary
    if (!IsSanitaryStatID($statID))
    {
           ThrowFatalError("Input is unsanitary: statID");
    }
    
    //Check inputs are valid
    if (!IsValidStatID($statID,$numStats))
    {
       ThrowFatalError("Input is invalid: statID");
    }
    
	//TODO: validate and sanitize session and instance ids
	
    // The statID given to us is expected to be indexed by 0, however our database is indexed by 1, so we'll add 1
    $databaseIndexedStatID = $statID + 1;
    
    // Retrieve the table name of the inputted stat ID.
    //$tableName = GetFirstRowFromColumn($databaseConnection, "meta_stats", "table_name", "table_id = $databaseIndexedStatID");
    //$heatMapQuery = "SELECT `" . $year . "` FROM " . $tableName . " ORDER BY country_id ASC";
    $heatMapQuery = "SELECT value, country_id ".
						"FROM data ".
						"WHERE session_id =".$sessionID." AND ".
	  					"instance_id=".$instanceID." AND ". 
						"year=".$year." AND ".
						"stat_id=".$databaseIndexedStatID." ORDER BY country_id ASC;";
	
	//TODO: heatmap to bystat names, comment, unit test
	$heatMapResults = $databaseConnection->query($heatMapQuery);
	$results = array();
	while($heatMapRow = $heatMapResults->fetch_assoc())
	{
		array_push($results,$heatMapRow);
	}

	return ParseIntoByStatPacket($sessionID, $instanceID, $databaseIndexedStatID, $results, $year);
} //END ByStat

//Date Created: 10/29/2015
function ParseIntoByStatPacket($sessionID, $instanceID, $statID, $queryResults, $year)
{
	$packetData = array();
	foreach($queryResults as $result)
	{
		$obj = array($result["country_id"] => $result["value"]);
		array_push($packetData, $obj);
	}

	return new by_stat_packet($sessionID,$instanceID,$statID,$packetData,$year);
}

// Author:        William Bittner, Drew Lopreiato
// Date Created:  2/22/2015  
// Last Modified: 5/1/2015 by William Bittner    
// Description:   This function queries the database for every stat for every year for any number of countries
function ByCountry($countryIDs, $sessionID, $instanceID)
// PRE: countryIDs a string of valid countryIDs separated by a comma, or just one valid countryID
// POST: an array containing all of the stats for each country ID input, with each stat in the index corresponding to its stat ID
{
    $databaseConnection = GetDatabaseConnection();		//store connection to database
    $byCountryArray = array();							//initialize returning array
    $descriptor = Descriptor();							//grab descriptor
    $numCountries = count($descriptor['countries']);	//use descriptor to get the number of countries
    $statTables = array();								//initialize statTables array
    
    if (!IsSanitaryCountryList($countryIDs))
    {
        ThrowFatalError("Input is unsanitary: countryIDs");
    }

    //TODO: validate and sanitize session and instance ids
    
    $countryIDList = explode(",", $countryIDs);
    $databaseIndexedCountryIDList = array();

    // validate each countryID
    foreach ($countryIDList as $countryID)
    {
        if (!IsValidCountryID($countryID, $numCountries))
        {
            ThrowFatalError("Input is invalid: countryID (" . $countryID . ")");
        }
    }

    //TODO: add functionality for multiple country ids or fix IDs?
    $byCountryQuery = "SELECT value, stat_id, year ".
						"FROM data ".
						"WHERE session_id =".$sessionID." AND ".
	  					"instance_id=".$instanceID." AND ". 
						"country_id=".($countryIDs + 1)." ORDER BY country_id ASC;";
						
	
	$countryDataResults = $databaseConnection->query($byCountryQuery);
	$results = array();
	while($countryRow = $countryDataResults->fetch_assoc())
	{
		array_push($results,$countryRow);
	}

	return ParseIntoByCountryPacket($sessionID, $instanceID, $countryIDs + 1, $results);
} //END ByCountry

//Date Created: 10/29/2015
function ParseIntoByCountryPacket($sessionID, $instanceID, $countryIDs, $queryResults)
{
	$packetData = array();
	foreach($queryResults as $result)
	{
		$obj = array($result["year"] => $result["value"]);
		if(!array_key_exists($result["stat_id"],$packetData))
			$packetData[$result["stat_id"]] = array();
		array_push($packetData[$result["stat_id"]], $obj);
	}

	$countryPackets = array();
	foreach($packetData as $statID => $data)
	{
		array_push($countryPackets, new by_country_packet($sessionID, $instanceID, $statID, $data, $countryIDs));
	}
	return $countryPackets;
}

// Author:        Kyle Nicholson, Berty Ruan, William Bittner
// Date Created:  2/7/2015
// Last Modified: 5/1/2015 by William Bittner  
// Description: Returns an array of the indecies that get turned into 
// 				the Descriptor Table - See BackEndArchitecture.md for contents of Descriptor Table
function Descriptor($sessionID = DEFAULT_SESSION)
// POST: FCTVAL = an array of key value pairs whose indices are: 	
//		"yearRange": year range of session as key pair values startYear: value, endYear:value
//		"countries": "cc2": the 2 digit country code for each country in the session
//		             "cc3": the 3 digit country code for each country in the session
//		             "common_name": the name for each country in the session, in american english
//		"stats": stats: an array key-pair values of stat id: stat name for all the stats in the session
//		"instances": array of instances in the session as key pair instance id: instance name.
//		"sessions": array of sessions as key pair values of session id: session name
{
    $databaseConnection = GetDatabaseConnection();	//get the connection to the database
    
    $yearRange = GetYearRange($databaseConnection, $sessionID);
    if ($yearRange === null)
    {
    	ThrowFatalError("SessionID does not have data");
    }
	

    $stats = GetStatMap($databaseConnection, $sessionID);

    if($stats === null)
    {
        ThrowFatalError("SessionID does not have data");
    }
    
    $countries = GetCountryMap($databaseConnection, $sessionID);

    if ($countries === null)
    {
        ThrowFatalError("SessionID does not have data");
    }

    $instances = GetInstanceMap($databaseConnection, $sessionID);

    if ($instances === null)
    {
        ThrowFatalError("SessionID does not have data");
    }

    $sessions = GetSessionMap($databaseConnection);

    if ($sessions === null)
    {
        ThrowFatalError("Error getting sessions");
    }
    
    //return the nested arrays
    return(array("yearRange" => $yearRange, "countries" => $countries, "stats" => $stats, "instances"=>$instances, "sessions"=>$sessions));
} //END Descriptor

// ======================= Helper Functions =======================

// Author:        William Bittner, Andrew Lopreiato
// Date Created:  2/22/2015
// Last Modified: 4/7/2015 by Andrew Lopreiato
// Description:   This function takes any input and determines if it is safe to
//                send to the server in the context of a year.
function IsSanitaryYear($year)
// PRE:  year is anything
// POST: true if year is in the format of 4 digits in a row.
{
    return preg_match("/^\d{4}$/", $year) === 1;
}
// Author:        William Bittner, Andrew Lopreiato
// Date Created:  2/22/2015
// Last Modified: 4/7/2015 by Andrew Lopreiato
// Description:   This function takes any input and determines if it is safe to
//                send to the server in the context of a statistic ID.
function IsSanitaryStatID($statID)
// PRE:  statID is anything
// POST: true if the statID is 1 or more digits in a row
{
    return preg_match("/^\d+$/", $statID) === 1;
} //END IsSanitaryStatID

// Author:        William Bittner, Andrew Lopreiato
// Date Created:  2/22/2015
// Last Modified: 4/7/2015 by Andrew Lopreiato
// Description:   This function takes any input and determines if it is safe to
//                send to the server in the context of a country list.
function IsSanitaryCountryList($countryList)
// PRE:  countryList is anything
// POST: true if the countryList is 1 or more groups of comma delimited digits.
{
    return preg_match("/^\d+(,\d+)*$/", $countryList) === 1;
} //END IsSanitaryCountryList

// Author:        William Bittner, Andrew Lopreiato
// Date Created:  2/22/2015
// Last Modified: 4/7/2015 by Andrew Lopreiato
// Description:   This function takes a year, and determines if it falls within
//                a given year range (in the form of a 2 element array).
function IsValidYear($year, $yearRange)
// PRE:  year is a number, and yearRange is an array with two elements which are numbers
// POST: true if the year falls within the given year range
{
    //TODO: Query database for if country is in session
    return ($year >= $yearRange["startYear"] && $year <= $yearRange["endYear"]);
} //END IsValidYear

// Author:        William Bittner, Andrew Lopreiato
// Date Created:  2/22/2015
// Last Modified: 4/7/2015 by Andrew Lopreiato
// Description:   This function determines if a statistic ID falls within the valid statID range.
function IsValidStatID($statID, $numStats)
// PRE:  statID is a number, and numStats is a number
// POST: true if statID falls between 0 and numStats
{
    //TODO: Query database for if stats is in session
    return($statID < $numStats && $statID >= 0);
} //END IsValidStatID


// Author:        William Bittner, Andrew Lopreiato
// Date Created:  2/22/2015
// Last Modified: 4/7/2015 by William Bittner
// Description:   This function determines if a country ID falls within the valid countryID range.
function IsValidCountryID($countryID, $numCountries)
// PRE:	countryID is a number, and numCountries is a number
// POST: true if countryID falls between 0 and numCountries
{
    //As countries are numbered starting at one, the count of the array is equal to the highest value country.
    //Check >= 0 and < the number of countries as a country id can't be less than 0, or more than or equal
    //the number of countries
    //TODO: Query database for if country is in session
    return($countryID < $numCountries && $countryID >= 0);
} //END IsValidCountryID

// Author:        William Bittner, Drew Lopreiato, Berty Ruan, Dylan Fetch
// Date Created:  2/22/2015 
// Last Modified: 2/22/2015 by William Bittner, Drew Lopreiato, Berty Ruan, Dylan Fetch  
// Description:   This function returns an array containing every statistic that is in the database
function GetStatMap($database,$sessionID)
// PRE:  $database is a mysqli database connection
// POST: FCTVAL == array of the human readable names of all statistics in the database
{
    //returning array
    $statArray = array();
    
	$statListQuery = "SELECT DISTINCT stat_id FROM data WHERE session_id='".$sessionID."' ORDER BY stat_id ASC";
	$statListResult = $database->query($statListQuery);
	
	while($statRow = $statListResult->fetch_assoc())
	{
		array_push($statArray, $statRow["stat_id"]);
	}
	
	if(empty($statArray))
		return null;

    $statNameQuery = "SELECT stat_id, stat_name FROM meta_stats WHERE stat_id IN (" . implode($statArray,",") . ");";
    $statNameResult = $database->query($statNameQuery);
    
    $statMap = array();

    while($statRow = $statNameResult->fetch_assoc())
    {
        $statMap[$statRow["stat_id"]]=$statRow["stat_name"];
    }

    return $statMap;
} //END GetStatNames

// Date Created:  11/5/2015 
function GetCountryMap($database, $sessionID)
{
    //returning array
    $countryArray = array();
    
    $countryListQuery = "SELECT DISTINCT country_id FROM data WHERE session_id='".$sessionID."' ORDER BY country_id ASC";
    $countryListResult = $database->query($countryListQuery);
    
    while($countryRow = $countryListResult->fetch_assoc())
    {
        array_push($countryArray, $countryRow["country_id"]);
    }
    
    if(empty($countryArray))
        return null;

    $countryNameQuery = "SELECT country_id, cc2, cc3, common_name FROM meta_countries WHERE country_id IN (" . implode($countryArray,",") . ");";
    $countryNameResult = $database->query($countryNameQuery);
    
    $countryMap = array();

    while($countryRow = $countryNameResult->fetch_assoc())
    {
        $countryMap[$countryRow["country_id"]]=array("cc2"=>$countryRow["cc2"], "cc3"=>$countryRow["cc3"], "common_name"=>$countryRow["common_name"]);
    }

    return $countryMap;
}


// Date Created:  11/5/2015 
function GetInstanceMap($database, $sessionID)
{
    $instanceArray = array();

    $instanceListQuery = "SELECT DISTINCT instance_id FROM data WHERE session_id='".$sessionID."' ORDER BY instance_id ASC";
    $instanceListResult = $database->query($instanceListQuery);
    //echo $instanceListQuery . "<br>";

    while($instanceRow = $instanceListResult->fetch_assoc())
    {
        array_push($instanceArray, $instanceRow["instance_id"]);
    }
    
    if(empty($instanceArray))
        return null;

    $instanceNameQuery = "SELECT instance_id, instance_name FROM meta_instance WHERE instance_id IN (" . implode($instanceArray,",") . ");";
    $instanceNameResult = $database->query($instanceNameQuery);
    //echo $instanceNameQuery . "<br>";
    
    $instanceMap = array();

    while($instanceRow = $instanceNameResult->fetch_assoc())
    {
        $instanceMap[$instanceRow["instance_id"]]=$instanceRow["instance_name"];
    }

    return $instanceMap;
}

// Date Created:  11/5/2015 
function GetSessionMap($database)
{
    $sessionNameQuery = "SELECT session_id, session_name FROM meta_session;";
    $sessionNameResult = $database->query($sessionNameQuery);
    //echo $instanceNameQuery . "<br>";
    
    $sessionMap = array();

    while($sessionRow = $sessionNameResult->fetch_assoc())
    {
        $sessionMap[$sessionRow["session_id"]]=$sessionRow["session_name"];
    }

    return $sessionMap;

}

// Author:        William Bittner, Drew Lopreiato  
// Date Created:  2/19/2015 
// Last Modified: 2/19/2015 by William Bittner, Drew Lopreiato  
// Description:   This function returns the first and last year of a given table, which is the second and last columns header 
function GetYearRange($database, $sessionID)
// PRE:  $database is a mysqli database connection, and sessioID is a valid session 
// POST: return an array with exactly two key value pairs: startYear is the lowest year, endYear is the highest year  
{
	$yearRangeQuery = "SELECT DISTINCT year FROM data WHERE session_id='".$sessionID."' ORDER BY year ASC";
	$yearRangeResult = $database->query($yearRangeQuery);
	
	$yearArray = array();
	
	while($yearRow = $yearRangeResult->fetch_assoc())
	{
		array_push($yearArray, $yearRow["year"]);
	}
	
	if(empty($yearArray))
		return null;
	
	$yearRange = array("startYear"=>$yearArray[0], "endYear"=>$yearArray[count($yearArray)-1]);
	
	return $yearRange;
	
} //END GetYearRange

?>