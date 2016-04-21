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

/* File Name:           descriptor.php
 * Description:         This file queries the database for the country names, 
 *                      year range, two character country code (cc2), and the stats
 * 
 * Date Created:        2/7/2015
 * Contributors:        Kyle Nicholson, Berty Ruan, Drew Lorpeiato, William Bittner, Brent Mosier
 * Date Last Modified:  9/27/2015
 * Last Modified By:    Brent Mosier
 * Dependencies:        api_library.php
 * PRE:               NONE
 * POST:              FCTVAL == Formatted JSON String containing the countryName,
 *                      yearRange, cc2, and stats arrays
 * Additional Notes:    Before completion of this file we need a populated
 *                      database on the correct server
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
	$_sessionID=GetArgumentValue('sessionID', false);

	$prettyprint = isset($_GET['prettyprint']) ? true : false;

	if(!$prettyprint)
		echo desc($_sessionID);
	else
		echo "<pre>".json_encode(json_decode(desc($_sessionID)), JSON_PRETTY_PRINT)."</pre>";
}

function desc($sessionID)
{	
	if(is_null($sessionID))
		$descriptorArray = Descriptor();
	else
		$descriptorArray = Descriptor($sessionID);

	//encode results of Descriptor() into json
	$descriptorJSON = json_encode($descriptorArray);

	// return descriptor json string
	return $descriptorJSON;
}


?>
