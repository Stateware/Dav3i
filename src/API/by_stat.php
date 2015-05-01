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

/* File Name:           by_stats.php
 * Description:         This file queries the database for data from every country for 1 specific year and 1 specifc
 *                      statistic.
 * 
 * Date Created:        2/7/2015
 * Contributors:        Will Bittner, Arun Kumar, Drew Lopreiato
 * Date Last Modified:  5/1/2015
 * Last Modified By:    William Bittner
 * Dependencies:        Connect.php, Toolbox.php
 * PRE:               GET: statID - a positive integer
 *                           year   - a four digit integer - optional
 * POST:              FCTVAL = Formatted JSON string containing the data for the specified stat and year for 
 *								every country.
 */
require_once("api_library.php");

// enable foreign access in testing
if (EXTERNAL_ACCESS)
{
	header("Access-Control-Allow-Origin: *");
}
//This checks to see if anything was passed into the parameter statID
if(!isset($_GET['statID']))
{
	ThrowFatalError("Input is not defined: statID");
}

//call ByStats function with first argument as statID and
//second argument as ternary operator: if the year is not set, pass DEFAULT_STRING value
$byStatsArray = ByStat($_GET['statID'], (isset($_GET['year'])) ? ($_GET['year']) : (DEFAULT_STRING));

$byStatJSON = json_encode($byStatsArray);

echo $byStatJSON;
?>