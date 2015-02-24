<?php
/* File Name:           by_stats.php
 * Description:         This file queries the database for data from every country for 1 specific year and 1 specifc
 *                      statistic.
 * 
 * Date Created:        2/7/2015
 * Contributors:        Will Bittner, Arun Kumar, Drew Lopreiato
 * Date Last Modified:  2/20/2015
 * Last Modified By:    Drew Lopreiato
 * Dependencies:        Connect.php, Toolbox.php
 * Input:               GET: statID - a positive integer
 *                           year   - a four digit integer - optional
 * Output:              Fromatted JSON string containing the data for the specified stat and year for every country.
 */
require_once("api_library.php");

// enable foreign access in testing
if (TESTING)
{
	header("Access-Control-Allow-Origin: *");
}

if(!isset($_GET['statID']))
{
	ThrowFatalError("Input is not defined: statID");
}

//call ByStats function with first argument as statID and
//second argument as ternary operator: if the year is not set, pass DEFAULT_STRING value
$byStatsArray = ByStat($_GET['statID'], (isset($_GET['year'])) ? ($_GET['year']) : (DEFAULT_STRING));

$byStats = json_encode($byStatsArray);

echo $byStats;
?>