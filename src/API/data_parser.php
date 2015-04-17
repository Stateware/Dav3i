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

require_once("connect.php");

$testData = "";
$fileTemporaryName = $_FILES['userfile']['tmp_name'];
$testData = file_get_contents($fileTemporaryName);

$testData = preg_replace("/,,/", ",-1,", preg_replace("/,,/", ",-1,", $testData));
$testData = preg_replace("/,NA/", ",-1", preg_replace("/,NA/", ",-1", $testData));
$testData = preg_replace("/\"/", "", $testData);

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

//$testData = preg_replace('~\R~', "|", preg_replace("/[\r\n]/", "|", $testData));
$testData = trim(preg_replace('~\R~', "|", $testData));

$queryArray = array();
$tableArray = explode("|", $testData);
foreach($tableArray as $value)
{
    
    $tempArray = explode(",", $value, 2);
    if (isset($tempArray[1]))
    {
        $queryArray[$tempArray[0]] = $tempArray[1];
    }
}

$headers = array_shift($queryArray);

$columnsArray = explode(",", $headers);
//TODO: Make the country_id column be the index
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
    
    $specificQuery .= $countryLookupTable[$country];

    $allTheStats = explode(",", $query);
    foreach ($allTheStats as $statistic) {
        $specificQuery .= sprintf(", %f", ScientificConversion($statistic));
    }

    //$specificQuery .= $query;

  	$specificQuery .= ");";
	
    //echo $specificQuery;
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
//ALTER TABLE data_cases ORDER BY country_id ASC//*/

// convert text in scientific notation into a floating point value
// Steven Shaffer, March 30, 2015
function ScientificConversion($in) {
    $pos = strpos($in, "E");
    if ($pos === false) {
        //Just convert it directly
        return floatval($in);
    }
    else {
        //Needs to be converted
        $part1 = substr($in, 0, $pos);
        $part2 = substr($in, $pos+1);
        $base = $part1 + 0;
        $exponent = $part2 + 0;
        $answer = $base * (pow(10, $exponent));
        return $answer;
    }
}

?>