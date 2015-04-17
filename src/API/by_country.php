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
 * Date Last Modified:  4/2/2015
 * Last Modified By:    Drew Lopreiato 
 * Dependencies:        api_library.php
 * Input:               NONE
 * Output:              Formatted JSON String containing the statistics of the countries
 */

require_once("api_library.php");

// enable foreign access in testing
if (EXTERNAL_ACCESS)
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