//TODO: fix the coding standards things like setting vars near the top.

//if supplied a list with an added index with respect to g_mapSelectedRegionsToDivs,
//	create a div and add that to the page, then add this 
function updateCharts( selectedRegions )
{
	if( selectedRegions.length > Object.keys( g_mapSelectedRegionsToDivs ).length )
	{
		for( var i = 0; i < selectedRegions.length; i++)
		{
			if( g_mapSelectedRegionsToDivs[selectedRegions[i]] === undefined )
			{
				//make div
				var div = makeChartDivs( selectedRegions[i] );
				
				g_mapSelectedRegionToDivs[selectedRegions[i]] = div;
			}
		}
	}
	else if( selectedRegions.length < Object.keys( g_mapSelectedRegionsToDivs ).length )
	{
		var keys = Object.keys( g_mapSelectedRegionsToDivs );
		for( var i = 0; i < keys.length; i++ )
		{
			if( selectedRegions.indexOf( keys[i] ) == -1 )
			{
				var div = g_mapSelectedRegionToDivs[keys[i]];
				div.parentNode.removeChild(div);
				
				delete g_mapSelectedRegionToDivs[keys[i]];
			}
		} 
	}
	else//same size, do nothing (hope nothing changed?)
	{
	}
	
	return g_mapSelectedRegionToDivs;
}

function generateChartData(sessionID, instanceID, countryID,statID)
{
	var data = new Array();
	data[0] = new Array();
	data[1] = new Array();
	var country = retrieveByCountryData(sessionID,instanceID,countryID);

	//.log(JSON.stringify(country,' ',' '));

	var keys = Object.keys(country.get(statID));
	for(var i = 0 ; i < keys.length; i++)
	{
		var year = keys[i];
		if(!isNaN(year))
		{
			data[0].push(year);
			data[1].push(country.get(statID).get(year));
		}
	}

	alert(JSON.stringify(data,' ', ' '));
}

function retrieveByCountryData(sessionID, instanceID, countryID, options)
{
	var have = checkCacheByCountry(sessionID, instanceID, countryID);
	
	if(!have)
	{
		getDataByCountry(sessionID, instanceID, countryID);
	}
	
	return g_cache.get(sessionID).get(instanceID).get(countryID);
	
}

function retrieveByStatData(sessionID, instanceID, statID, year)
{
	var have = checkCacheByStat(sessionID, instanceID, statID, year);
	
	if(!have)
	{
		getDataByStat(sessionID, instanceID, statID, year);
	}
	
	return g_cache.get(sessionID).get(instanceID);
}

function checkCacheByStat(sessionID, instanceID, statID, year)
{
	var stat = g_cache.get(sessionID).get(instanceID).get("flags").get("statIDs").get(statID);
	
	return stat[year] === undefined ? false : stat[year];//handle undefined
}

function checkCacheByCountry(sessionID, instanceID, countryID)
{
	var countryIDs = g_cache.get(sessionID).get(instanceID).get("flags").get("countryIDs");

	return countryIDs[countryID] === undefined ? false : countryIDs[countryID];//handle undefined
}

function getDataByStat(sessionID, instanceID, statID, year)
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
	},
	error: function(xhr, ajaxOptions, thrownError){
			console.log("Error on stat ajax call...\n" + xhr.status + "\n" + thrownError + "\nURL: " + URL);
			}
	});
	
	
}

function getDataByCountry(sessionID, instanceID, countryID)
{
	
	var URL = "http://localhost/dav3i/API/by_country.php?sessionID=" + sessionID +
				"&instanceID=" + instanceID + "&countryIDs=" + countryID;
	
	//get the data and send it to be parsed
	$.ajax({
	url:URL,
	success: function(data){ parseCountryPacket(data); },
	error: function(xhr, ajaxOptions, thrownError){
			console.log("Error on country ajax call...\n" + xhr.status + "\n" + thrownError + "\nURL: " + URL);
			}
	});
	
	g_cache.get(sessionID).get(instanceID).get("flags").get("countryIDs").set(countryID, true);
}


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