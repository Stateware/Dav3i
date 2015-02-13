<?php
function ThrowFatalError($message = "An Error has occured.") 
{
    echo "{\"error\" : \"" . $message . "\"}";
    die();
} // END ThrowFatalError

function GetFirstRowFromColumn($database, $tableName, $columnName, $filter = false)
{
	$query = "SELECT " . $columnName . " FROM " . $tableName;
	if ($filter !== false)
	{
		$query .= " WHERE " . $filter;
	}
	$results = $database->query($query);
	$row = $results->fetch_assoc();
	$results->free();
	return $row[$columnName];
} // END GetFirstRowFromColumn

// These are global variables that we can use as ways to start variables as types.
define("DEFAULT_NUMBER", -1);
define("DEFAULT_STRING", "");
?>