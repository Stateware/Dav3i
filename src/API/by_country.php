<?php
/* File Name:           by_country.php
 * Description:         This file gets all of the stats for a list of of the given countries.
 * 
 * Date Created:        2/22/2015
 * Contributors:        Drew Lopreiato, Will Bittner, Arun Kumar, Dylan Fetch
 * Date Last Modified:  2/22/2015
 * Last Modified By:    Drew Lopreiato 
 * Dependencies:        api_library.php
 * Input:               NONE
 * Output:              Formatted JSON String containing the statistics of the countries
 */

require_once("api_library.php");

// enable foreign access in testing
if (TESTING)
{
	header("Access-Control-Allow-Origin: *");
}

if (!isset($_GET['countryIDs']))
{
	ThrowFatalError("Input is not defined: countryIDs");
}

$byCountryArray = ByCountry($_GET['countryIDs']);

//encode results of ByCountry into json
$byCountry = json_encode($byCountryArray);

// return byCountry json string
echo $byCountry;
?>