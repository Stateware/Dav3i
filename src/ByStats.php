<?php
require_once("Connect.php");
require_once("Toolbox.php");

// ===================== Variable Declaration =====================
$databaseConnection;
$returningJson = array();
$byStats = DEFAULT_STRING;
$inputYear = DEFAULT_NUMBER;
$inputStatID = DEFAULT_NUMBER;

// ===================== Error Checking and Variable Initialization =====================
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

// ===================== Main Computation =====================

$tableNameQuery = "SELECT stat_table FROM info_stats WHERE stat_id = " . $_GET['statID'];

$tableNameResults = $databaseConnection->query($tableNameQuery);

$tableNameRow = $tableNameResults->fetch_assoc();

$tableName = $tableNameRow['stat_table'];

$heatMapQuery = "SELECT `" . $inputYear . "` FROM " . $tableName . " ORDER BY country_id ASC";

$heatMapResults = $databaseConnection->query($heatMapQuery);

while($row = $heatMapResults->fetch_assoc())
{
	array_push($returningJson, $row[$inputYear]);
}
$byStats = json_decode($returningJson);

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