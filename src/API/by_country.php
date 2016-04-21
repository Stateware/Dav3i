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

/* File Name:           by_country.php
 * Description:         This file gets all of the stats for a list of of the given countries.
 * 
 * Date Created:        2/22/2015
 * Contributors:        Drew Lopreiato, Will Bittner, Arun Kumar, Dylan Fetch
 * Date Last Modified:  5/1/2015
 * Last Modified By:    William Bittner 
 * Dependencies:        api_library.php
 * PRE:               countryIDs - a string of one or more country IDs delimited by a comma
 * POST:              FCTVAL == Formatted JSON String containing the statistics of the countries
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
	//This checks to see if anything was passed into the parameter countryIDs
	$_countryIDs=GetArgumentValue('countryIDs', true);

	$_instanceID=GetArgumentValue('instanceID', true);
	$_sessionID=GetArgumentValue('sessionID', true);
	
	country_exe($_countryIDs, $_sessionID, $_instanceID);
}

function country_exe($country_id, $session_id, $instance_id )
{
	if (is_null($country_id))
	{
		ThrowFatalError("Input is not defined: countryIDs");
	}
	if (is_null($session_id))
	{
		ThrowFatalError("Input is not defined: sessionID");
	}
	if (is_null($instance_id))
	{
		ThrowFatalError("Input is not defined: instanceID");
	}

	//Here we are calling our function ByCountry - which is in api_library.php - and assigning the output to an array
	$byCountryPacketArray = ByCountry($country_id, $session_id, $instance_id);

	$keys = array_keys($byCountryPacketArray);

	$i = 0;

	$prettyprint = isset($_GET['prettyprint']) ? true : false;

	echo "{";

	if(count($keys) > 0)
	{
		echo "\"".($i++)."\":";
		$byCountryPacketArray[$keys[0]]->send($prettyprint);
	}
	for(; $i < count($keys) ;$i++)
	{
		echo ",\"".$i."\":";
		$byCountryPacketArray[$keys[$i]]->send($prettyprint);
		
	}

	echo "}";
}
?>