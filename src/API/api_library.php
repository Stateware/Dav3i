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

// make sure to include all the necessary php files that are referenced in these functions
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
// PRE: statID is a valid ID of a stat in the database, year is a valid year in the database, sessionID is a valid id that points to a session
//      in the database, and instanceID is a valid id that points to an instance in the database
// POST: FCTVAL == packet resulting from call to parse function with parameters determined in this function
//                 see "ParseIntoByStatPacket" function
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
        //check year is sanitary, see IsSanitaryYear for details
        if (!IsSanitaryYear($year))
        {
            ThrowFatalError("Input is unsanitary: year");
        }

        //Check inputs are validm see IsValidYear for details
        if (!IsValidYear($year, $yearRange))
        {
            ThrowFatalError("Input is invalid: year");
        }
    }
    //check statID is sanitary, see IsSanitaryStatID for details
    if (!IsSanitaryStatID($statID))
    {
           ThrowFatalError("Input is unsanitary: statID");
    }
    
    //Check inputs are valid, see IsValidStatID for details
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
	
	$heatMapResults = $databaseConnection->query($heatMapQuery);
	$results = array();
	while($heatMapRow = $heatMapResults->fetch_assoc())
	{
		array_push($results,$heatMapRow);
	}

	return ParseIntoByStatPacket($sessionID, $instanceID, $databaseIndexedStatID, $results, $year);
} //END ByStat

// Author:        William Bittner, Drew Lopreiato
// Date Created:  10/29/2015  
// Last Modified: 11/19/2015 by Paul Jang  
// Description:   This function creates a data packet with results from a bystat call
function ParseIntoByStatPacket($sessionID, $instanceID, $statID, $queryResults, $year)
// PRE: all of the inputted id's and the year are valid, query results is successfully populated
// POST: FCTVAL == packet with the correct stat data that will be passed to the front end,
//                 reference "by_stat_packet.php" for packet structure
{
	$packetData = array();
    // loop through the results of the query and populate the array
	foreach($queryResults as $result)
	{
        // push the data from the result array to the outbound packet data array
		$obj = array($result["country_id"] => $result["value"]);
		array_push($packetData, $obj);
	}

    // return the packet using the previously created array
	return new by_stat_packet($sessionID,$instanceID,$statID,$packetData,$year);
}//END ParseIntoByStatPacket

// Author:        William Bittner, Drew Lopreiato
// Date Created:  2/22/2015  
// Last Modified: 5/1/2015 by William Bittner    
// Description:   This function queries the database for every stat for every year for any number of countries
function ByCountry($countryIDs, $sessionID, $instanceID)
// PRE: countryIDs a string of valid countryIDs separated by a comma, or just one valid countryID
// POST: FCTVAL == the result of calling the parse function with the country data determined in the function,
//                 see "ParseIntoByCountryPacket" function
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


// Author:        William Bittner, Drew Lopreiato
// Date Created:  10/29/2015  
// Last Modified: 11/19/2015 by Paul Jang    
// Description:   This function creates a data packet with the results of a bycountry call
function ParseIntoByCountryPacket($sessionID, $instanceID, $countryIDs, $queryResults)
// PRE: all of the inputted ids are valid and query results contains the appropriate data that will be sent
// POST: FCTVAL == an array all of the data from the by country query results in the form of packets,
//                 reference "by_country_packet.php" for packet structure
{
	$packetData = array();
	foreach($queryResults as $result)
	{
        // loops through the query results and retrieves all the data values in the result array
		$obj = array($result["year"] => $result["value"]);
        // creates an entry in the array for the stat id if it doesn't already exist
    	if(!array_key_exists($result["stat_id"],$packetData))
        {
			$packetData[$result["stat_id"]] = array();
		}
        array_push($packetData[$result["stat_id"]], $obj);
	}

	$countryPackets = array();
	foreach($packetData as $statID => $data)
	{
        // encapsulate all of the packets into an array that will be returned
		array_push($countryPackets, new by_country_packet($sessionID, $instanceID, $statID, $data, $countryIDs));
	}
	return $countryPackets;
} //END ParseIntoByCountryPacket

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
    
    // retrieve the year range of the data that is currently in the database
    $yearRange = GetYearRange($databaseConnection, $sessionID);

    // sanitize the year range, if it is not valid than the database is empty
    if ($yearRange === null)
    {
    	ThrowFatalError("SessionID does not have data");
    }
	
    // retrieve the stat map from the database, see GetStatMap for more details
    $stats = GetStatMap($databaseConnection, $sessionID);

    // if the retrieved stat map is null, that means that the given session ID does not have any data
    if($stats === null)
    {
        ThrowFatalError("SessionID does not have data");
    }

    // retrieve the country map from the database, see GetCountryMap for more details
    $countries = GetCountryMap($databaseConnection, $sessionID);

    // if the retrieved country map is null, that means that the given session ID does not have any data
    if ($countries === null)
    {
        ThrowFatalError("SessionID does not have data");
    }

    // retrieve the instance map from the database, see GetInstanceMap for more details
    $instances = GetInstanceMap($databaseConnection, $sessionID);

    // if the retrieved instance map is null, that means that the given session ID does not have any data
    if ($instances === null)
    {
        ThrowFatalError("SessionID does not have data");
    }

    // retrieve the session map from the database, see GetSessionMap for more details
    $sessions = GetSessionMap($databaseConnection);

    // if the retrieved session map is null, that means that there was some error in retrieving the sessions from the database
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
    // stat storage array for later use
    $statArray = array();
    
    // build the query that will retrieve the list of stats that are contained in the given session ID
	$statListQuery = "SELECT DISTINCT stat_id FROM data WHERE session_id='".$sessionID."' ORDER BY stat_id ASC";
    // execute the aforementioned query and store the resulting stat list into a variable
	$statListResult = $database->query($statListQuery);
	
    // iterate through each of the elements (stats) in the retrieved stat list
    // fetch_assoc() is a member of the return type of the query, which is the actual data value
	while($statRow = $statListResult->fetch_assoc())
	{
        // push the retrieved data into the returning array, indexed in the "stat_id" row
		array_push($statArray, $statRow["stat_id"]);
	}

	// returns null if the returning array is null, meaning that nothing was retrieved from the stat list in the database 
	if(empty($statArray))
    {
		return null;
    }

    // build the query that will retrieve the name of the stats that are in the (just build) stat array, from the meta_stats table
    $statNameQuery = "SELECT stat_id, stat_name FROM meta_stats WHERE stat_id IN (" . implode($statArray,",") . ");";
    // execute the query that was just built
    $statNameResult = $database->query($statNameQuery);
    
    // build the returning array
    $statMap = array();

    // iterate through the rows of the result of the previous query, which will be stat names from meta_stats
    // fetch_assoc() is a member that will be the actual data (stat name) from the query
    while($statRow = $statNameResult->fetch_assoc())
    {
        // push each stat name in the query result into the returning stat map array
        $statMap[$statRow["stat_id"]]=$statRow["stat_name"];
    }

    // return the map of all the stat names in the database
    return $statMap;
} //END GetStatNames

// Author:        William Bittner, Nick Denaro
// Date Created:  11/5/2015 
// Last Modified: 11/19/2015 by Paul Jang  
// Description:   This function, given a session, returns an array of all the countries in the session and all their corresponding info
function GetCountryMap($database, $sessionID)
// PRE:  $database is a mysqli database connection, sessionid points to a session that currently exists and has data
// POST: FCTVAL == array of the country info of every country in the session, indexed by country id
{
    //returning array
    $countryArray = array();
    
    // queries the database for the country id's of the countries that have data in the current session
    $countryListQuery = "SELECT DISTINCT country_id FROM data WHERE session_id='".$sessionID."' ORDER BY country_id ASC";
    $countryListResult = $database->query($countryListQuery);
    
    // populates an array indexed by country ids and containing the corresponding row from the database
    while($countryRow = $countryListResult->fetch_assoc())
    {
        array_push($countryArray, $countryRow["country_id"]);
    }
    
    // returns null if nothing was successfully retrieved from the database
    if(empty($countryArray))
    {
        return null;
    }

    // queries the database for all the country data from the meta_countries table of all the countries retrieved from the previous query
    $countryNameQuery = "SELECT country_id, cc2, cc3, common_name FROM meta_countries WHERE country_id IN (" . implode($countryArray,",") . ");";
    $countryNameResult = $database->query($countryNameQuery);
    
    // create the actual country map structure
    $countryMap = array();

    // iterate through all rows retrieved from the previous query
    while($countryRow = $countryNameResult->fetch_assoc())
    {
        // map the cc2, cc3, and common name to the appropriate country_id index in the country map
        $countryMap[$countryRow["country_id"]]=array("cc2"=>$countryRow["cc2"], "cc3"=>$countryRow["cc3"], "common_name"=>$countryRow["common_name"]);
    }

    // return an array of all the countries in the session that have data, as well as their info
    return $countryMap;
} //END GetCountryMap

// Author:        William Bittner, Nick Denaro
// Date Created:  11/5/2015 
// Last Modified: 11/19/2015 by Paul Jang  
// Description:   This function, given a session, returns an array of all the instances names in the session indexed by id
function GetInstanceMap($database, $sessionID)
// PRE:  $database is a mysqli database connection, sessionid points to a session that currently exists and has data
// POST: FCTVAL == array of the instance names indexed by the instance id
{
    // array that will be returned
    $instanceArray = array();

    // query the database for each instance id in the session given by session_id
    $instanceListQuery = "SELECT DISTINCT instance_id FROM data WHERE session_id='".$sessionID."' ORDER BY instance_id ASC";
    $instanceListResult = $database->query($instanceListQuery);

    // iterates through all the instances and push them to the instance array, mapped by their id
    while($instanceRow = $instanceListResult->fetch_assoc())
    {
        array_push($instanceArray, $instanceRow["instance_id"]);
    }
    
    // returns null if nothing was retrieved from the database
    if(empty($instanceArray))
    {
        return null;
    }

    // query the database for the instance id and instance name for each instance in the array
    $instanceNameQuery = "SELECT instance_id, instance_name FROM meta_instance WHERE instance_id IN (" . implode($instanceArray,",") . ");";
    $instanceNameResult = $database->query($instanceNameQuery);
    
    // create the instance map structure
    $instanceMap = array();

    // push each instance name into the array indexed by it's id
    while($instanceRow = $instanceNameResult->fetch_assoc())
    {
        $instanceMap[$instanceRow["instance_id"]]=$instanceRow["instance_name"];
    }

    // return an array of all the instance names in the current session
    return $instanceMap;
} //END GetInstanceMap

// Author:        William Bittner, Nick Denaro
// Date Created:  11/5/2015 
// Last Modified: 11/19/2015 by Paul Jang  
// Description:   This function, queries the database for each session that currently exists within
function GetSessionMap($database)
// PRE:  $database is a mysqli database connection
// POST: FCTVAL == array of the session names in the database indexed by their session id
{
    // query the database for each session name and session id
    $sessionNameQuery = "SELECT session_id, session_name FROM meta_session;";
    $sessionNameResult = $database->query($sessionNameQuery);
    
    // create the return session map array
    $sessionMap = array();

    // iterate through each session row
    while($sessionRow = $sessionNameResult->fetch_assoc())
    {
        // map each session to it's id, in the returning session map array
        $sessionMap[$sessionRow["session_id"]]=$sessionRow["session_name"];
    }

    // return an array of all the sessions in the database
    return $sessionMap;
} //END GetSessionMap

// Author:        William Bittner, Drew Lopreiato  
// Date Created:  2/19/2015 
// Last Modified: 2/19/2015 by William Bittner, Drew Lopreiato  
// Description:   This function returns the first and last year of a given table, which is the second and last columns header 
function GetYearRange($database, $sessionID)
// PRE:  $database is a mysqli database connection, and sessioID is a valid session 
// POST: return an array with exactly two key value pairs: startYear is the lowest year, endYear is the highest year  
{
    //TODO: Query the meta_session table for start and end year, rather than the data.

    // build the query that will retrieve each distinct year from the database in the current session
	$yearRangeQuery = "SELECT DISTINCT year FROM data WHERE session_id='".$sessionID."' ORDER BY year ASC";
    // execute the (just built) query
	$yearRangeResult = $database->query($yearRangeQuery);
	
    // built an array to hold the years
	$yearArray = array();
	
    // iterate through the result of the database query
	while($yearRow = $yearRangeResult->fetch_assoc())
	{
        // push each resulting year from the query into the year array
		array_push($yearArray, $yearRow["year"]);
	}
	
    // return null if no years were retrieved
	if(empty($yearArray))
    {
		return null;
	}

    // create a new array that contains just the start and end years of the retrieved years
	$yearRange = array("startYear"=>$yearArray[0], "endYear"=>$yearArray[count($yearArray)-1]);
	
    // return the (just built) year array
	return $yearRange;
	
} //END GetYearRange

?>