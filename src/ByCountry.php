<?php
require_once("Connect.php");
require_once("Toolbox.php");

$databaseConnection = GetDatabaseConnection();

$returningJson = array();

if (!isset($_GET['countryIDs'])) 
{
    ThrowFatalError("Input not defined.");
}

if (preg_match("/^\d+(,\d+)*$/", $_GET['countryIDs']) === 0)
{
    ThrowFatalError("Invalid input.");
}

// TODO: VALIDATE countryIDs

$countryIDList = explode(",", $_GET['countryIDs']);

$statTables = array();
$getStatTablesQuery = "SELECT stat_id, stat_table FROM info_stats";
$getStatTablesResults = $database->query($getStatTablesQuery);
while ($row = $getStatTablesResults->fetch_assoc())
{
    $statTables[$row['stat_id']] = $row['stat_table'];
}

$countryDataQueries = getCountryQueries($statTables, $countryIDList);
foreach($countryDataQueries as $stat_id => $query)
{
	$getCountryDataResults = $database->query($query);
    while ($row = $getCountryDataResults->fetch_assoc())
    {
    	$countryID=$row['country_id'];
    	unset($row['country_id']);
    	$returningJson[$countryID][$stat_id]=$row;
    }	
}

echo json_encode($returningJson);

//*/
// Returns an array of queries given a set of tables to be queried, and the countries to be queried
// $tableNames must be in format: tableID => tableName
// $countries must be an array of integers
function getCountryQueries($tableNames, $countries)
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