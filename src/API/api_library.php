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
 * Date Last Modified:  4/23/2015
 * Last Modified By:    Drew Lopreiato
 * Dependencies:        connect.php, toolbox.php
 * Input:               none                     
 * Output:              none
 */
 
require_once("toolbox.php");
require_once("connect.php");
 
// ======================== API Functions =========================


// Author:        William Bittner, Drew Lopreiato
// Date Created:  2/22/2015  
// Last Modified: 4/7/2015 by William Bittner  
// Description:   This function queries the database for one specific stat for one specific year for every country
function ByStat($statID, $year)
// PRE: statID is a valid ID of a stat in the database, and year is a valid year in the database
// POST: returns an array of key value pairs whose index are:
//			0: key: statID, value: an array containing each countries data for that stat in the index that corresponds to the countries ID
//			1: key: "force", value: "object" - this is so that the json returned the the caller of this function returns an object, not an array
//						of one element.
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
    
    // The statID given to us is expected to be indexed by 0, however our database is indexed by 1, so we'll add 1
    $databaseIndexedStatID = $statID + 1;
    
    // Retrieve the table name of the inputted stat ID.
    $tableName = GetFirstRowFromColumn($databaseConnection, "meta_stats", "table_name", "table_id = $databaseIndexedStatID");
    $heatMapQuery = "SELECT `" . $year . "` FROM " . $tableName . " ORDER BY country_id ASC";
    $heatMapResults = $databaseConnection->query($heatMapQuery);
    if ($heatMapResults === FALSE)
    {
        ThrowFatalError("Database missing data.");
    }
    while($heatMapRow = $heatMapResults->fetch_assoc())
    {
           array_push($heatMapArray, $heatMapRow[$year]);
    }

    if (count($heatMapArray) != count($descriptor['cc2']))
    {
        ThrowFatalError("Database missing country data.");
    }

    // if we don't return an array with more than one element in it, it'll come out not as an object, but as an array
    // this line of code forces the json_decode to output the data as an object.
    $containingArray = array($statID => $heatMapArray, 'force' => "object");

    return ($containingArray);    
} //END ByStat



// Author:        William Bittner, Drew Lopreiato
// Date Created:  2/22/2015  
// Last Modified: 4/7/2015 by William Bittner  
// Description:   This function queries the database for every stat for every year for any number of countries
function ByCountry($countryIDs)
// PRE: countryIDs a string of valid countryIDs separated by a comma, or just one valid countryID
// POST: an array containing all of the stats for each country ID input, with each stat in the index corresponding to its stat ID
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
    $databaseIndexedCountryIDList = array();

    // THIS ACTUALLY IS INCORRECT BEHAVIOR. IT LETS THE USER THINK THAT THE DATA IS INTENTIONALLY
    // NONEXISTeNT, WHEN IN REALITY, IT IS MISSING
    // TODO: Communicate with front end on better error handling methods, and then throw an inconvenient error.
    $numberOfCountries = count($countryIDList);
    $numberOfStats = count($descriptor['stats']);
    $numberOfYears = $descriptor['yearRange'][1] - $descriptor['yearRange'][0] + 1;
    for ($i = 0; $i < $numberOfCountries; $i++)
    {
        $byCountryArray[$countryIDList[$i]] = array();
        for ($j = 0; $j < $numberOfStats; $j++)
        {
            $byCountryArray[$countryIDList[$i]][$j] = array();
            for ($k = 0; $k < $numberOfYears; $k++)
            {
                array_push($byCountryArray[$countryIDList[$i]][$j], "-1");
            }
        }
    }

    // validate each countryID
    foreach ($countryIDList as $countryID)
    {
        if (!IsValidCountryID($countryID, $numCountries))
        {
            ThrowFatalError("Input is invalid: countryID (" . $countryID . ")");
        }
    }
    
    // The countryIDs given to us is expected to be indexed by 0, however our database is indexed by 1, so we add 1
    foreach ($countryIDList as $countryID)
    {
        array_push($databaseIndexedCountryIDList, $countryID + 1);
    }

    // put each stat table into an array, where its index is the id for that table
    $statTablesQuery = "SELECT table_id, table_name FROM meta_stats";
    $statTablesResults = $databaseConnection->query($statTablesQuery);
    while ($statTablesRow = $statTablesResults->fetch_assoc())
    {
        $statTables[$statTablesRow['table_id']] = $statTablesRow['table_name'];
    }
    
    // get the queries for each country and stat
    $countryDataQueries = GetCountryQueries($statTables, $databaseIndexedCountryIDList);
    
    // query the query for each country n stuff.
    foreach($countryDataQueries as $statID => $query)
    {
        $countryDataResults = $databaseConnection->query($query);
        if ($countryDataResults === FALSE)
        {
            // do nothing
        }
        else
        {
            while ($countryDataRow = $countryDataResults->fetch_array(MYSQLI_NUM))
            {
                $countryID = $countryDataRow[0];
                // THIS IS INCORRECT BEHAVIOR. IN THE CASE OF A MISSING STATISTIC, WE SHOULD BE THROWING AN ERROR.
                // This makes it so that if we're missing a column of data, we're going to replace that entire
                // tables worth of data with a -1.
                $dataSlice = array_slice($countryDataRow, 1);
                if (count ($dataSlice) == $numberOfYears)
                {
                    $byCountryArray[$countryID - 1][$statID - 1] = $dataSlice;
                }
            }
        }
    }

    // if we don't return an array with more than one element in it, it'll come out not as an object, but as an array
    // this line of code forces the json_decode to output the data as an object.
    $byCountryArray['force'] = "object";

    return $byCountryArray;
} //END ByCountry

// Author:        Kyle Nicholson, Berty Ruan
// Date Created:  2/7/2015
// Last Modified: 4/7/2015 William Bittner
// Description: Returns an array of the indecies that get turned into 
// 				the Descriptor Table - See BackEndArchitecture.md for contents of Descriptor Table
function Descriptor()
// POST: FCTVAL = an array of key value pairs whose indecies are: 	
//		0: year range of data in database
//		1: cc2: the 2 digit country code for each country in the database
//		2: cc3: the 3 digit country code for each country in the database
//		3: common_name: the name for each country, in american english
//		4: stats: an array of all the stats, where the index of the stat is its stat ID
{
    $databaseConnection = GetDatabaseConnection();
    $cc2 = array();
    $cc3 = array();
    $countryName = array();
    
    // This will iterate through the tables looking for the first one that exists,
    // and then pick the year range from that
    $tableNames = GetTableNames($databaseConnection);
    $i = 0;
    $yearRange = GetYearRange($databaseConnection, $tableNames[$i]);
    while ($yearRange === false)
    {
        $i++;
        if (isset($tableNames[$i]))
        {
            $yearRange = GetYearRange($databaseConnection, $tableNames[$i]);
        }
        else
        {
            ThrowFatalError("No tables with years exist");
        }
    }
    $stats = GetStatNames($databaseConnection);
    
    $countriesQuery = "SELECT cc2, cc3, common_name FROM meta_countries ORDER BY country_id";
    $countriesResult = $databaseConnection->query($countriesQuery);

    if ($countriesResult === false)
    {
        ThrowFatalError("The meta_country data is corrupt");
    }
    
    //fill cc2, cc3, and countryName arrays in order by ID
    while($countriesRow = $countriesResult->fetch_assoc())
    {
        array_push($cc2, $countriesRow['cc2']);
        array_push($cc3, $countriesRow['cc3']);
        array_push($countryName, $countriesRow['common_name']);
    }
    
    //return the nested arrays
    return(array("yearRange" => $yearRange, "cc2" => $cc2, "cc3"=> $cc3, "common_name" => $countryName, "stats" => $stats));
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
    return ($year >= $yearRange[0] && $year <= $yearRange[1]);
} //END IsValidYear

// Author:        William Bittner, Andrew Lopreiato
// Date Created:  2/22/2015
// Last Modified: 4/7/2015 by Andrew Lopreiato
// Description:   This function determines if a statistic ID falls within the valid statID range.
function IsValidStatID($statID, $numStats)
// PRE:  statID is a number, and numStats is a number
// POST: true if statID falls between 0 and numStats
{
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
    //Check > 0 and <= the number of countries as a country id can't be less than 1, or more than the number of
    //countries
    return($countryID < $numCountries && $countryID >= 0);
} //END IsValidCountryID

// Author:        William Bittner, Drew Lopreiato, Berty Ruan, Dylan Fetch
// Date Created:  2/22/2015 
// Last Modified: 2/22/2015 by William Bittner, Drew Lopreiato, Berty Ruan, Dylan Fetch  
// Description:   This function returns an array containing every statistic that is in the database
function GetStatNames($database)
// PRE:  $database is a mysqli database connection
// POST: FCTVAL == array of the human readable names of all statistics in the database
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
} //END GetStatNames

// Author:        William Bittner, Drew Lopreiato  
// Date Created:  4/21/2015 
// Last Modified: 4/23/2015 by William Bittner, Drew Lopreiato  
// Description:   This function returns an array containing every statistic's table name that in the database
function GetTableNames($database)
// PRE:  $database is a mysqli database connection
// POST: FCTVAL == array of the table names of all statistics in the database
{
    //returning array
    $statArray = array();
    
    $statQuery = "SELECT table_name FROM meta_stats";
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
        array_push($statArray, $statRow['table_name']);
    }
    
    return $statArray;
} //END GetTableNames

// Author:        William Bittner, Drew Lopreiato  
// Date Created:  2/19/2015 
// Last Modified: 2/19/2015 by William Bittner, Drew Lopreiato  
// Description:   This function returns the first and last year of a given table, which is the second and last columns header 
function GetYearRange($database, $table)
// PRE:  $database is a mysqli database connection, and table is a valid table in that connection
// POST: return an array with exactly two indices: index 0 is the lowest year, index 1 is the highest year  
{
    $indexOfFirstYearColumn = 1;
    $descriptionArray = array();
    $yearRange = array();
        
    //Create the query and query the query
    $descriptionQuery = "DESCRIBE " . $table;
    $descriptionResult = $database->query($descriptionQuery);
    
    if($descriptionResult === false)
    {
        //ThrowFatalError("Invalid table name for year range.");
        return false;
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

// Author:        William Bittner, Drew Lopreiato  
// Date Created:  2/19/2015 
// Last Modified: 4/7/2015 by William Bittner  
// Description:   Returns an array of queries given a set of tables to be queried, and the countries to be queried
function GetCountryQueries($tableNames, $countries)
// PRE: $tableNames must be in format: tableID => tableName, $countries must be an array of integers
// POST: Returns an array of queries given a set of tables to be queried, and the countries to be queried
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