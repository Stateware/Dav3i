<?php

require_once("connect.php");

$testData = "";
$fileTemporaryName = $_FILES['userfile']['tmp_name'];
$testData = file_get_contents($fileTemporaryName);

$testData = preg_replace("/\,NA\,|,,/", ",-1,", preg_replace("/\,NA\,|,,/", ",-1,", $testData));

$databaseConnection = GetDatabaseConnection();

$type = $_POST['data_type'];
$tableName = $_POST['table_name'];
$statisticName = $_POST['stat_name'];

$metaTableQuery = "INSERT INTO meta_stats (stat_name, table_name) VALUES ('$statisticName', '$tableName')";
$metaTableResults = $databaseConnection->query($metaTableQuery);
if ($metaTableResults === false)
{
    echo "Query failed.";
    die();
}

$testData = preg_replace('~\R~', "|", $testData);

$queryArray = array();
$tableArray = explode("|", $testData);
foreach($tableArray as $value)
{
    $tempArray = explode(",", $value, 2);
    $queryArray[$tempArray[0]] = $tempArray[1];
}

$headers = array_shift($queryArray);

$columnsArray = explode(",", $headers);

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
    echo "Query failed.";
    die();
}

// Create lookup table
$countryLookupTable = array();
$countryLookupQuery = "SELECT cc3, country_id FROM meta_countries";
$countryLookupResults = $databaseConnection->query($countryLookupQuery);
while($countryLookupRow = $countryLookupResults->fetch_assoc())
{
    $countryLookupTable[$countryLookupRow['cc3']] = $countryLookupRow['country_id'];
}


$specificQuery = "";

foreach($queryArray as $country => $query)
{
	$specificQuery = "INSERT INTO $tableName VALUES(";
    
    $specificQuery .= $countryLookupTable[$country] . ", ";

    $specificQuery .= $query;

  	$specificQuery .= ");";
	
	$specificResults = $databaseConnection->query($specificQuery);
	if ($specificResults === false)
	{
		echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!query didn't work<br />";
	}
	else
	{
		echo "query definately passed.<br />";
	}
}
//ALTER TABLE data_cases ORDER BY country_id ASC

?>