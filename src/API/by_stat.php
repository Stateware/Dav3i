<?php
/*
 * Copyright 2015 Stateware Team: William Bittner, Joshua Crafts, 
 * Nicholas Denaro, Dylan Fetch, Paul Jang, Arun Kumar, Drew Lopreiato,
 * Brent Mosier, Kyle Nicholson, Emma Roudabush, Berty Ruan, Vanajam Soni, 
 * Murlin Wei, Zekun Yang
 * 
 * This file is part of Dav3i.
 * 
 * Dav3i is free software: you can redistribute it and/or modify
 * it under the terms of the MIT Software License.
 * 
 * Dav3i is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * MIT Software License for more details.
 * 
 * You should have received a copy of the MIT Software License along 
 * with Dav3i.  If not, see <https://opensource.org/licenses/MIT/>.
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
//Checks if this is running from a request
if(isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'GET')
{
	//This checks to see if anything was passed into the parameter statID
	$_stat_id = GetArgumentValue('statID', true);
	$_year = GetArgumentValue('year', false);
	
	$_instanceID=GetArgumentValue('instanceID', true);
	$_sessionID=GetArgumentValue('sessionID', true);

	stat_exe($_stat_id,$_year, $_sessionID, $_instanceID ); 
}

function stat_exe($stat_id, $year, $session_id, $instance_id)
{

	//This checks to see if anything was passed into the parameter statID
	if (is_null($stat_id))
	{
		ThrowFatalError("Input is not defined: statID");
	}
	if (is_null($session_id))
	{
		ThrowFatalError("Input is not defined: sessionID");
	}
	if (is_null($instance_id))
	{
		ThrowFatalError("Input is not defined: instanceID");
	}

	$prettyprint = isset($_GET['prettyprint']) ? true : false;

	//call ByStats function with first argument as statID and second argument as year
	$byStatsPacket = ByStat($stat_id, $year, $session_id, $instance_id);

	$byStatsPacket->send($prettyprint);

}

?>