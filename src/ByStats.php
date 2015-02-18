<?php
/* File Name:           ByStats.php
 * Description:         This file queries the database for data from every country for 1 specific year and 1 specifc
 *                      statistic.
 * 
 * Date Created:        2/7/2015
 * Contributors:        Will Bittner, Arun Kumar, Drew Lopreiato
 * Date Last Modified:  2/12/2015
 * Last Modified By:    Will Bittner, Arun Kumar, Drew Lopreiato
 * Dependencies:        Connect.php, Toolbox.php
 * Input:               GET: statID - a positive integer
 *                           year   - a four digit integer
 * Output:              Fromatted JSON string containing the data for the specified stat and year for every country.
 */
require_once("Connect.php");
require_once("Toolbox.php");

// ===================== Variable Declaration =====================
$databaseConnection;
$returningData = array();
$byStats = DEFAULT_STRING;
$inputYear = DEFAULT_NUMBER;
$inputStatID = DEFAULT_NUMBER;

// ========== Error Checking and Variable Initialization ==========
$databaseConnection = GetDatabaseConnection();

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
    //TODO:
    //Change to query database for most recent year once data is input
    $inputYear = 2015;
}
else
{
    $inputYear = $_GET['year'];
}

if (!IsSanitaryYear($inputYear) || !IsSanitaryStatID($inputStatID))
{
    ThrowFatalError("Input is unsanitary.");
}
if (!IsValidYear($inputYear) || !IsValidStatID($inputStatID))
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

function IsValidYear($year)
{
    // TODO: CHECK AGAINST THE DATABASE
    return true;
}

function IsValidStatID($statID)
{
    // TODO: CHECK AGAINST THE DATABASE
    return true;
}

?>