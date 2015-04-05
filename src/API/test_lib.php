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


// ==================================== TEST GetYearRange ====================================

// ------------------------------- TEST GetYearRange => births -------------------------------
echo "<h4> Test if GetYearRange(databaseConnection, data_births) lower bound is 1980</h4>";

$yearRangeArray = GetYearRange($databaseConnection, "data_births");

if($yearRangeArray[0] == "1980") 
{
	echo "Test 1 for GetYearRange passed. <br>";
}
else
{
	echo "Test 1 for GetYearRange failed. <br>";
}

echo "<h4>GetYearRange(databaseConnection, data_births) == 2012)</h4>";

if($yearRangeArray[1] == "2012") 
{
	echo "Test 2 for GetYearRange passed. <br>";
}
else
{
	echo "Test 2 for GetYearRange failed. <br>";
}

// ------------------------------- TEST GetYearRange => cases -------------------------------
echo "<h4> Test if GetYearRange(databaseConnection, data_cases) lower bound is 1980</h4>";

$yearRangeArray = GetYearRange($databaseConnection, "data_cases");

if($yearRangeArray[0] == "1980") 
{
	echo "Test 3 for GetYearRange passed. <br>";
}
else
{
	echo "Test 3 for GetYearRange failed. <br>";
}

echo "<h4>GetYearRange(databaseConnection, data_cases) == 2012</h4>";

if($yearRangeArray[1] == "2012") 
{
	echo "Test 4 for GetYearRange passed. <br>";
}
else
{
	echo "Test 4 for GetYearRange failed. <br>";
}

// ------------------------------- TEST GetYearRange => deaths -------------------------------
echo "<h4> Test if GetYearRange(databaseConnection, data_deaths) lower bound is 1980</h4>";

$yearRangeArray = GetYearRange($databaseConnection, "data_deaths");

if($yearRangeArray[0] == "1980") 
{
	echo "Test 5 for GetYearRange passed. <br>";
}
else
{
	echo "Test 5 for GetYearRange failed. <br>";
}

echo "<h4>GetYearRange(databaseConnection, data_deaths) == 2012</h4>";

if($yearRangeArray[1] == "2012") 
{
	echo "Test 6 for GetYearRange passed. <br>";
}
else
{
	echo "Test 6 for GetYearRange failed. <br>";
}

// ================================= TEST GetStatNames =================================
                               
echo "<h1> Testing for GetStatNames(conn) </h1>";

echo "<h4> GetStatNames(databaseConnection) == array(Births, Cases, Deaths) </h4>";

if (GetStatNames($databaseConnection) == array("Births", "Cases", "Deaths"))
{
	echo "Test 1 for GetStatNames passed. <br>";
}
else
{
	echo "Test 1 for GetStatNames failed. <br>";
}

echo "<h4> GetStatNames(databaseConnection) != array(Births, Cases, Deaths) </h4>";

if (GetStatNames($databaseConnection) != array("Births", "Cases", "Deaths"))
{
	echo "Test 2 for GetStatNames passed. <br>";
}
else
{
	echo "Test 2 for GetStatNames failed. <br>";
}

echo "<h4> GetStatNames(databaseConnection) == array(Births, Cases, Deaths) </h4>";

if (GetStatNames($databaseConnection)== array("Cases", "Births", "Deaths"))
{
	echo "Test 3 for GetStatNames passed. <br>";
}
else
{
	echo "Test 3 for GetStatNames failed. <br>";
}

// ================================= END TEST GETSTATNAMES =================================
?>