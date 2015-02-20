<?php
/* File Name:           by_stats.php
 * Description:         This file queries the database for data from every country for 1 specific year and 1 specifc
 *                      statistic.
 * 
 * Date Created:        2/7/2015
 * Contributors:        Will Bittner, Arun Kumar, Drew Lopreiato
 * Date Last Modified:  2/20/2015
 * Last Modified By:    Drew Lopreiato
 * Dependencies:        Connect.php, Toolbox.php
 * Input:               GET: statID - a positive integer
 *                           year   - a four digit integer
 * Output:              Fromatted JSON string containing the data for the specified stat and year for every country.
 */
require_once("connect.php");
require_once("toolbox.php");
require_once("api_library.php");

// ===================== Variable Declaration =====================
$databaseConnection;
$returningData = array();
$yearRange = array();
$byStats = DEFAULT_STRING;
$inputYear = DEFAULT_NUMBER;
$inputStatID = DEFAULT_NUMBER;
//$descriptor = json_decode(include('Descriptor.php'));
//$numStats = count(descriptor.stats)

// ========== Error Checking and Variable Initialization ==========
$databaseConnection = GetDatabaseConnection();

//      TODO: unhardcode table name
$yearRange = GetYearRange($databaseConnection, "data_births");

if (!isset($_GET['statID'])) 
{
    ThrowFatalError("Input is not defined.");
}
else
{
    $inputStatID = $_GET['statID'];
}
if (!isset($_GET['year']))
{
    // We'll make our default year, the most current one we have data for.
    $inputYear = $yearRange[1];
}
else
{
    $inputYear = $_GET['year'];
}

//Check inputs are sanitary
if (!(IsSanitaryYear($inputYear) && IsSanitaryStatID($inputStatID)))
{
    ThrowFatalError("Input is unsanitary.");
}

//Check inputs are valid
if (!(IsValidYear($yearRange, $inputYear) && IsValidStatID($inputStatID)))
{
    ThrowFatalError("Input is invalid.");
}

// ======================= Main Computation =======================

// Retrieve the table name of the inputted stat ID.
$tableName = GetFirstRowFromColumn($databaseConnection, "info_stats", "stat_table", "stat_id = $inputStatID");

$heatMapQuery = "SELECT `" . $inputYear . "` FROM " . $tableName . " ORDER BY country_id ASC";
$heatMapResults = $databaseConnection->query($heatMapQuery);
while($row = $heatMapResults->fetch_assoc())
{
    array_push($returningData, $row[$inputYear]);
}

$byStats = json_encode($returningData);
echo $byStats;

// ===================== Function Definitions =====================
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

function IsValidYear($yearRange, $year)
{
    return ($year >= $yearRange[0] && $year <= $yearRange[1]);
}

function IsValidStatID($statID)
{
    // TODO: CHECK AGAINST THE DATABASE
    // return($statID<=$numStats);
    return true;
}

?>