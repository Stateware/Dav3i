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

function getInstance()
{
	return GetSelectedDropdown("instanceSelect","id");
}

function getSession()
{
	return GetSelectedDropdown("sessionSelect","id");
}

/*
 * Function: 
 * 
 *
 * Pre: 
 * 
 *
 * Post: 
 * 
 *
 * Authors: 
 * 
 *
 * Date Created: 
 * 
 *
 * Last Modified: 
 * 
 */
function retrieveByCountryData(sessionID, instanceID, countryID, callback)
{
	var have = checkCacheByCountry(sessionID, instanceID, countryID);
	
	if(!have)
	{
		getDataByCountry(sessionID, instanceID, countryID, callback);
	}
	else
	{
		callback( g_cache.get(sessionID).get(instanceID).get(countryID), countryID );
	}
}

/*
 * Function: 
 * 
 *
 * Pre: 
 * 
 *
 * Post: 
 * 
 *
 * Authors: 
 * 
 *
 * Date Created: 
 * 
 *
 * Last Modified: 
 * 
 */
function retrieveByStatData(sessionID, instanceID, statID, year, callback)
{
	var have = checkCacheByStat(sessionID, instanceID, statID, year);
	
	if(!have)
	{
		getDataByStat(sessionID, instanceID, statID, year, callback);
	}
	else
	{
		callback(g_cache.get(sessionID).get(instanceID), statID, year);
	}
}

/*
 * Function: 
 * 
 *
 * Pre: 
 * 
 *
 * Post: 
 * 
 *
 * Authors: 
 * 
 *
 * Date Created: 
 * 
 *
 * Last Modified: 
 * 
 */
function checkCacheByStat(sessionID, instanceID, statID, year)
{
	var stat = g_cache.get(sessionID).get(instanceID).get("flags").get("statIDs").get(statID);
	
	return stat[year] === undefined ? false : stat[year];//handle undefined
}

/*
 * Function: 
 * 
 *
 * Pre: 
 * 
 *
 * Post: 
 * 
 *
 * Authors: 
 * 
 *
 * Date Created: 
 * 
 *
 * Last Modified: 
 * 
 */
function checkCacheByCountry(sessionID, instanceID, countryID)
{
	var countryIDs = g_cache.get(sessionID).get(instanceID).get("flags").get("countryIDs");

	return countryIDs[countryID] === undefined ? false : countryIDs[countryID];//handle undefined
}

/*
 * Function: 
 * 
 *
 * Pre: 
 * 
 *
 * Post: 
 * 
 *
 * Authors: 
 * 
 *
 * Date Created: 
 * 
 *
 * Last Modified: 
 * 
 */
function getDataByStat(sessionID, instanceID, statID, year, callback)
{
	//TODO: fix undefined year...?
	var URL = g_Config.getAPI() + "by_stat.php?sessionID=" + sessionID +
				"&instanceID=" + instanceID + "&statID=" + statID + "&year=" + year;

	//get the data and send it to be parsed
	$.ajax({
	url: URL,
	success: function(data){
		parseStatPacket(data);
		g_cache.get(sessionID).get(instanceID).get("flags").get("statIDs").get(statID).set(year, true);
		if(typeof(callback) == 'function')
		{
			callback(g_cache.get(sessionID).get(instanceID), statID, year);
		}
	},
	error: function(xhr, ajaxOptions, thrownError){
			console.log("Error on stat ajax call...\n" + xhr.status + "\n" + thrownError + "\nURL: " + URL);
			}
	});
	
	
}

/*
 * Function: 
 * 
 *
 * Pre: 
 * 
 *
 * Post: 
 * 
 *
 * Authors: 
 * 
 *
 * Date Created: 
 * 
 *
 * Last Modified: 
 * 
 */
function getDataByCountry(sessionID, instanceID, countryID, callback)
{
	
	var URL = g_Config.getAPI() + "by_country.php?sessionID=" + sessionID +
				"&instanceID=" + instanceID + "&countryIDs=" + countryID;
	
	//get the data and send it to be parsed
	$.ajax({
	url:URL,
	success: function(data){ 
		parseCountryPacket(data); 
		g_cache.get(sessionID).get(instanceID).get("flags").get("countryIDs").set(countryID, true);
		if( typeof callback === "function" )
			callback( g_cache.get(sessionID).get(instanceID).get(countryID), countryID );
	},
	error: function(xhr, ajaxOptions, thrownError){
			console.log("Error on country ajax call...\n" + xhr.status + "\n" + thrownError + "\nURL: " + URL);
			}
	});
	
}

/*
 * Function: 
 * 
 *
 * Pre: 
 * 
 *
 * Post: 
 * 
 *
 * Authors: 
 * 
 *
 * Date Created: 
 * 
 *
 * Last Modified: 
 * 
 */
function parseCountryPacket(packet)
{
	//console.log(packet);
	packet = JSON.parse(packet);
	
	for(var j = 0; j < Object.keys(packet).length; j++)
	{
		var sessionID, instanceID, countryID, data;
		sessionID = packet[j]["session"];
		instanceID = packet[j]["instance"];
		countryID = packet[j]["country"];
		stat = packet[j]["stat_id"];
		data = packet[j]["data"];
		//var countryCache = g_cache.get(sessionID).get(instanceID).get(countryID);

		for(var i = 0; i < data.length; i++)
		{
			var pair = data[i];
			var year = Object.keys(pair)[0]; // the first key is the only key =)
			var value = pair[year];
			g_cache.get(sessionID).get(instanceID).get(countryID).get(stat).set(year, value);
		}
	}

	
}

/*
 * Function: 
 * 
 *
 * Pre: 
 * 
 *
 * Post: 
 * 
 *
 * Authors: 
 * 
 *
 * Date Created: 
 * 
 *
 * Last Modified: 
 * 
 */
function parseStatPacket(packet)
{
	var sessionID, instanceID, countryID, data;
	//console.log(packet);
	packet = JSON.parse(packet);
	var sessionID = packet["session"];
	var instanceID = packet["instance"];
	var statID = packet["stat_id"];
	var year = packet["year"];
	var data = packet["data"];
	var instanceCache = g_cache.get(sessionID).get(instanceID);

	var i;
	for(i = 0; i < data.length; i++)
	{
		var pair = data[i];
		var country = Object.keys(pair)[0]; // the first key is the only key =)
		var value = pair[country];
		instanceCache.get(country).get(statID).set(year,value);
	}
}