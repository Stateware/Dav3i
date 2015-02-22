<?php
/* File Name:           test_lib.php
 * Description:         This file tests the helper functions provided in api_library.php.
 * 
 * Date Created:        2/22/2015
 * Contributors:        Will Bittner, Arun Kumar, Drew Lopreiato
 * Date Last Modified:  2/22/2015
 * Last Modified By:    Arun Kumar
 * Dependencies:        api_library.php
 * Input:               none
 * Output:              Echo out text confirming or denying validity of api_library helper functions.
 */
 
require_once("toolbox.php");
require_once("connect.php");
require_once("api_library.php");

$databaseConnection = GetDatabaseConnection();

if (GetYearRange($databaseConnection, "data_births") == array("1980", "2012")) 
{
	echo "Test 1 for GetYearRange Passed. This is good. <br>";
}
else
{
	echo "Test 1 for GetYearRange failed. This is bad. <br>";
}

if (GetYearRange($databaseConnection, "data_cases") == array("1980", "2012")) 
{
	echo "Test 2 for GetYearRange Passed. This is good. <br>";
}
else
{
	echo "Test 2 for GetYearRange failed. This is bad. <br>";
}

//The following should not pass.
/*****************************************************************************
if (GetYearRange($databaseConnection, "data_births") == array("1900", "2012")) 
{
	echo "Test 3 for GetYearRange failed. This is good. <br>";
}	
else
{
	echo "Test 3 for GetYearRange passed. This is bad. <br>";
}
if (GetYearRange($databaseConnection, "data_births") == array("1980", "2000")) 
{
	echo "Test 4 for GetYearRange failed. This is good. <br>";
}
else
{
	echo "Test 4 for GetYearRange passed. This is bad. <br>";
}
*****************************************************************************/

if (GetStatNames($databaseConnection) == array("Births", "Cases"))
{
	echo "Test 1 for GetStatNames Passed. This is good. <br>";
}
else
{
	echo "Test 1 for GetStatNames failed. This is bad. <br>";
}

//The following should not pass.
/*****************************************************************************
if (GetStatNames($databaseConnection)!= array("Births", "Cases"))
{
	echo "Test 2 for GetStatNames failed. This is good. <br>";
}
else
{
	echo "Test 2 for GetStatNames passed. This is bad. <br>";
}
if (GetStatNames($databaseConnection)== array("Cases", "Births"))
{
	echo "Test 3 for GetStatNames failed. This is good. <br>";
}
else
{
	echo "Test 3 for GetStatNames passed. This is bad. <br>";
}
*****************************************************************************/

?>