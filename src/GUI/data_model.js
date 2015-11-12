
function checkCacheByStat(sessionID, instanceID, statID, year)
{
	if(var session = g_cache[sessionID] === undefined)
		return false;
	if(var instance = session[instanceID] === undefined)
		return false;
	if(var flags = instance["flags"] === undefined)
		return false;
	if(var statIDs = flags["statIDs"] === undefined)
		return false;
	if(var stat = statIDs[statID] === undefined)
		return false;

	return stat[year] === undefined ? false : stat[year];//handle undefined
}

function checkCacheByCountry(sessionID, instanceID, countryID)
{
	if(var session = cache[sessionID] === undefined)
		return false;
	if(var instance = session[instanceID] === undefined)
		return false;
	if(var country = instance[countryID] === undefined)
		return false;

	return stat[year];
}

function getDataByStat()
{

}

function getDataByStat()
{

}