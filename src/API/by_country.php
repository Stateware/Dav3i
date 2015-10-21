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
	//This checks to see if anything was passed into the parameter statID
	if (!isset($countryIDs))
	{
		ThrowFatalError("Input is not defined: countryIDs");
	}
	$_countryIDs=($_GET['countryIDs']);

	country_exe($_countryIDs);
}

function country_exe($country_id)
{
	if (!isset($country_id))
	{
		ThrowFatalError("Input is not defined: countryIDs");
	}

	//Here we are calling our function ByCountry - which is in api_library.php - and assigning the output to an array
	$byCountryArray = ByCountry($country_id);

	//encode results of ByCountry into json
	$byCountryJSON = json_encode($byCountryArray);

	// return byCountry json string
	echo $byCountryJSON;

}
?>