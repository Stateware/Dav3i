<?php
/* File Name:           api_library
 * Description:         This file holds all of the functions which the api calls will return
 * Date Created:        2/19/2015
 * Contributors:        William Bittner, Drew Lopreiato, Kyle Nicholson, Arun Kumar, Dylan Fetch
 * Date Last Modified:  2/19/2015
 * Last Modified By:    William Bittner, Drew Lopreiato, Kyle Nicholson, Arun Kumar, Dylan Fetch
 * Dependencies:        connect.php, toolbox.php
 * Input:               none                     
 * Output:              none
 */
 
require_once("toolbox.php");
require_once("connect.php");
 
 
 
function GetYearRange($database, $table)
{
	$indexOfFirstYearColumn = 1;
	$descriptionArray = array();
	$yearRange = array();
		
	//Create the query and query the query
    $descriptionQuery = "DESCRIBE " . $table;
	$descriptionResult = $database->query($descriptionQuery);
	
	if($descriptionResult === false)
	{
		ThrowFatalError("Invalid table name for year range.");
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

?>