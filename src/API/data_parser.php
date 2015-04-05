<?php

require_once("connect.php");
require_once("toolbox.php");



$databaseConnection = GetDatabaseConnection();

//Get CSV from data_uploader, then format it correctly with regex
//Check for uploading error
$fileError = $_FILES['userfile']['error'];
if($fileError !== UPLOAD_ERR_OK)
{
	ThrowFatalError("Error Uploading - Please Try Again");
}
//Check to make sure file is a CSV
$fileType = $_FILES['userfile']['type'];
if($fileType != "text/csv")
{
	ThrowFatalError("Incorrect Data Type of Uploaded File - Please Use CSV");
}
//Format string
$fileTemporaryName = $_FILES['userfile']['tmp_name'];
$testData = file_get_contents($fileTemporaryName);
$testData = preg_replace("/\,NA\,|,,/", ",-1,", preg_replace("/\,NA\,|,,/", ",-1,", $testData));

//Get data from inputter about what the data corresponds to in the database 
$type = $_POST['data_type'];
$tableName = $_POST['table_name'];
$statisticName = $_POST['stat_name'];

//Query to insert the stat's meta data into the meta table 
$metaTableQuery = "INSERT INTO meta_stats (stat_name, table_name) VALUES ('$statisticName', '$tableName')";
$metaTableResults = $databaseConnection->query($metaTableQuery);
if ($metaTableResults === false)
{
    ThrowFatalError("Meta Data Query Failed");
}

//Replace all newlines with a '|' so that we can parse it easier
$testData = preg_replace('~\R~', "|", $testData);

//Create array separated with each row in its own index
$queryArray = array();
$tableArray = explode("|", $testData);
//Separating the first entry from all the other
foreach($tableArray as $value)
{
    $tempArray = explode(",", $value, 2);
    $queryArray[$tempArray[0]] = $tempArray[1];
}

//Delete the first element, then assign to headers
$headers = array_shift($queryArray);

//Separate the header fields
$columnsArray = explode(",", $headers);

//Create the query to create the query from the headers
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
    ThrowFatalError("Table Creation Query Failed");
}

// Create lookup table
$countryLookupTable = array();
$countryLookupQuery = "SELECT cc3, country_id FROM meta_countries";
$countryLookupResults = $databaseConnection->query($countryLookupQuery);
while($countryLookupRow = $countryLookupResults->fetch_assoc())
{
    $countryLookupTable[$countryLookupRow['cc3']] = $countryLookupRow['country_id'];
}

//Insert the actual data into the database
foreach($queryArray as $country => $query)
{
	$specificQuery = "INSERT INTO $tableName VALUES(";
    
    $specificQuery .= $countryLookupTable[$country] . ", ";

    $specificQuery .= $query;

  	$specificQuery .= ");";
	
	$specificResults = $databaseConnection->query($specificQuery);
	if ($specificResults === false)
	{
		ThrowInconvenientError("You're missing a row - refer to the database for specifics.");
	}
//ALTER TABLE data_cases ORDER BY country_id ASC

?>