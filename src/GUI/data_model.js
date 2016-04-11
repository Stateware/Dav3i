/*TEMP FUNCTIONS FOR GET INSTANCE AND SESSION*/

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
	var URL = "http://localhost/dav3i/API/by_stat.php?sessionID=" + sessionID +
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
	
	var URL = "http://localhost/dav3i/API/by_country.php?sessionID=" + sessionID +
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
	var statID = packet["stat_id"] + 1;
	var year = packet["year"];
	var data = packet["data"];
	var instanceCache = g_cache.get(sessionID).get(instanceID);

	var i;
	for(i = 0; i < data.length; i++)
	{
		var pair = data[i];
		var country = Object.keys(pair)[0]; // the first key is the only key =)
		var value = pair[country];
		instanceCache.get(country - 1).get(statID).set(year,value); // the server sends us the ID from the database, but we 0 index ;)
	}
}