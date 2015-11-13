
function retrieveByCountryData(sessionID, instanceID, countryID)
{
	var have = checkCacheByCountry(sessionID, instanceID, countryID);
	
	if(have)
	{
		alert( "Have!" );
	}
	else
	{
		alert( "Don't have!" );
		getDataByCountry(sessionID, instanceID, countryID);
	}
	
	alert("Data!");
	//return data
	
}

function retrieveByStatData(sessionID, instanceID, statID, year)
{
	var have = checkCacheByStat(sessionID, instanceID, statID, year);
	
	if(have)
	{
		alert( "Have!" );
	}
	else
	{
		alert( "Don't have!" );
		getDataByStat(sessionID, instanceID, statID, year);
	}
	
	alert("Data!");
	//return data
	
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
	success: function(data){ parseStatPacket(data); },
	error: function(xhr, ajaxOptions, thrownError){
			console.log("Error on stat ajax call...\n" + xhr.status + "\n" + thrownError + "\nURL: " + URL);
			}
	});
	
	g_cache.get(sessionID).get(instanceID).get("flags").get("statIDs").get(statID).set(year, true);
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
	console.log(packet);
}

function parseStatPacket(packet)
{
	console.log(packet);
}