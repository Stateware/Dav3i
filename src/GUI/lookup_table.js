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

// File Name:           lookup_table.js
// Description:         Generates lookup table
// Date Created:        3/5/2015
// Contributors:        Emma Roudabush, Vanajam Soni, Paul Jang, Joshua Crafts
// Date Last Modified:  4/7/2015
// Last Modified By:    Emma Roudabush
// Dependencies:        descriptor.php, by_stat.php, data.js
// Additional Notes:    N/A

// Author: Emma Roudabush, Joshua Crafts, William Bittner
// Date Created: 3/5/2015
// Last Modified: 9/24/2015 by William Bittner
// Description: Fills g_DescriptorJSON with the contents of descriptor.php,
//              fills g_LookupTable and g_StatList with their corresponding data
//              and logs the resulting variables to the console.
// PRE: DescriptorJSON is not null, g_StatList and g_LookupTable exist,
//      GenerateLookupTable and GenerateStatReferenceList function correctly
// POST: DescriptorJSON, g_StatList, g_LookupTable contain their correct data.
function ParseDescriptor(DescriptorJSON)
{
    var hmsData;

	//Grab an object containing the first and last year 
    var yearRangeObject = GetInitialYears(DescriptorJSON);
    
    
    //Set the globals for the year range and initial year values
    g_FirstYear = yearRangeObject.FirstYear;
	g_YearStart = yearRangeObject.FirstYear;
	g_LastYear = yearRangeObject.LastYear;
	g_YearEnd = yearRangeObject.LastYear;
    
    //settings.js
    SetGraphType(0);
    
    //Set global for lookup table
    g_LookupTable = InitializeLookupTable(DescriptorJSON);
    
    //Generate an array of stat names
    g_StatList = GenerateStatReferenceList(DescriptorJSON);
    
    //Generate a parsed stat list
    //TODO: Figure out what this is doing and why
    g_ParsedStatList = ParseStatList();

    CleanStatNames();
    
    //Set initial stat displayed to deaths
    g_StatID = 1;
    
    //Set the initial year displayed to the most current year for which we have data
    g_HMSYear = g_LastYear;
    
    ColorByHMS();
    BuildTabs();

    g_TempSettings = UpdateInputs();
        
}

// Author: Emma Roudabush, William Bittner
// Date Created: 3/5/2015
// Last Modified: 2/8/2016 by Nicholas Denaro
// Description: Retrieves descriptor.php from the server                
// PRE: descriptor.php exists on the server.
// POST: If retrieval is successful, call the function to parse the descriptor
//			if retrieval is not, error is logged.
function GetDescriptor(sessionID)
{
	var URL = 'http://localhost/dav3i/API/descriptor.php';
	if(sessionID != undefined)
	{
		URL += '?sessionID=' + sessionID;
	}
    return $.ajax({                                      
        url: URL,                                                     
        dataType: 'JSON',                 
        success: function(data){
        	ParseDescriptor(data);
        	initMap();
    		FindCountriesNoData();
        },
        error: function(xhr, textStatus, errorThrown){
       		console.log('Descriptor could not be fetched. The error is as follows: ' + errorThrown);
       		console.log(URL);
    	}
    });
}

// Author: Emma Roudabush, William Bittner
// Date Created: 4/7/2015
// Last Modified: 2/8/2016 by Nicholas Denaro
// Description: Returns an object corresponding to the year range defined in the descriptor			
// PRE: DescriptorJSON is formatted as to the specifications in the documentation
// POST: An object with the first and last year values defined
function GetInitialYears(DescriptorJSON)
{
	var firstYear = Number(DescriptorJSON.yearRange["startYear"]);
	var lastYear = Number(DescriptorJSON.yearRange["endYear"]);
	var yearRangeObject = {
						FirstYear : firstYear,
						LastYear  : lastYear
					};

	return yearRangeObject;
}

// Author: Emma Roudabush, William Bittner
// Date Created: 3/5/2015
// Last Modified: 2/8/2016 by Nicholas Denaro
// Description: Returns a table of Countries CC2 codes, the country
//              names, and HMS values are set to 0.
// PRE: DescriptorJSON exists with the correct data from descriptor.php,
// POST: A 2d array is returned that has the correct CC2, name, and HMS values zero'd for each country
function InitializeLookupTable(DescriptorJSON)
{
	var countryKeys = Object.keys(DescriptorJSON.countries)

    var lookupTable = new Array(countryKeys.length);

    for (i = 0; i < countryKeys.length; i++)
    {
    	//TODO: Get rid of magic numbers?
        lookupTable[i] = new Array(3);
        lookupTable[i][0] = DescriptorJSON.countries[countryKeys[i]].cc2;
        lookupTable[i][1] = DescriptorJSON.countries[countryKeys[i]].common_name;
        lookupTable[i][2] = 0;
    }
    
    return lookupTable;
}

// Author: Emma Roudabush, William Bittner
// Date Created: 3/5/2015
// Last Modified: 9/24/2015 by William Bittner
// Description: Returns an array of stat names gathered from DescriptorJSON            
// PRE: DescriptorJSON exists with the correct data from descriptor.php
// POST: returns an array containing the correct stat names
function GenerateStatReferenceList(DescriptorJSON)
{
	var statKeys = Object.keys(DescriptorJSON.stats);

    var statList = new Array(statKeys.length); 
    
    for (i = 0; i < statKeys.length; i++)
    {
        statList[i] = DescriptorJSON.stats[statKeys[i]];
    }
    
    return statList;
}

// Author: Emma Roudabush, Joshua Crafts
// Date Created: 3/17/2015
// Last Modified: 9/28/2015 by Murlin Wei
// Description:Replace HMS values in lookup table with new HMS data (will happen just after lookup table generation for default HMS)
// PRE: hmsData contains valid heat map values and hmsData is of size g_LookupTable.length
// POST: g_LookupTable has heat map values of hmsData
function SetHMS(hmsData)
{
	var heatMapValues = [];
    for (var i = 0; i < g_LookupTable.length; i++)
    {
    	heatMapValues[i] = hmsData[i]
    }

    return heatMapValues
}


/*
 * Function: ReformatByStatData
 * Takes a cache instance object for a particular session and returns an
 * array of the values
 * 
 * Parameters: 
 * cache
 * statID
 * year
 * 
 * Pre: 
 * instanceCache contains valid instance data for the stat and all countries in the
 * cache storage format
 * 
 * Post: 
 * FCTVAL == array containing [country] = value at year
 * 
 * Returns: 
 * array [country]
 * 
 * Authors: 
 * Nicholas Denaro
 * 
 * Date Created: 
 * 2/12/16 
 * 
 * Last Modified: 
 * 2/15/16 by Nicholas Denaro
 */
function ReformatByStatData(instanceCache, statID, year)
{
	var data = [];
	var keys = instanceCache.keys;

	for(var country = 0; country < keys.length; country++)
	{
		//console.log(cache.get(keys[country]));
		if( !isNaN( keys[country] ) )
		{
			data[ keys[country]-1 ] = instanceCache.get(keys[country]).get(statID).get(year);
		}
	}

	return data;
}

/*
 * Function: SuccessfulByStat
 * Connects the formatting of the data from the server and the updating of the heatmap
 * 
 * Parameters: 
 * data
 * statID
 * year
 * 
 * Pre: 
 * data is valid and does not contain an error
 * 
 * Post: 
 * Heatmap is updated
 * 
 * Authors: 
 * Nicholas Denaro
 * 
 * Date Created: 
 * 2/12/16 
 * 
 * Last Modified: 
 * 2/15/16 by Nicholas Denaro
 */
function SuccessfulByStat(data, statID, year)
{
	data = ReformatByStatData(data, statID, year);
   	ParseMapData(data,statID);
}

// Author: Vanajam Soni, Kyle Nicholson, Joshua Crafts
// Date Created: 3/19/2015
// Last Modified: 2/8/2016 by Nicholas Denaro
// Description: Returns HMS data based on hmsID
// PRE: hmsID is an integer and a valid heat map stat id, year is an integer and within the valid range
// POST: FCTVAL == HMS data corresponding to stat enumerated by hmsID in the stat reference list, in JSON format
function GetHMS(sessionID, instanceID, hmsID, year)
{
	var URL = 'http://localhost/dav3i/API/by_stat.php?sessionID='.concat(sessionID.toString()+"&instanceID="+instanceID.toString()+"&statID="+hmsID.toString()+"&year="+year.toString());

    $.ajax({        
        url: URL,                                                     
        dataType: 'JSON',
        success: function(data){     
        	data = ReformatByStatData(data);
        	ParseMapData(data,hmsID);
            //console.log("Successfully received by_stat.php?statID=".concat(hmsID.toString()));
        },
        error: function(xhr, textStatus, errorThrown){
       		console.log('HMS could not be fetched. The error is as follows: ' + errorThrown);
       		console.log('HMS could not be fetched. URL: ' + URL);
    	}
    });
}

// Author: Emma Rouabush, Joshua Crafts
// Date Created: 3/17/2015
// Last Modified: 3/22/2015 by Joshua Crafts
// Description: Translate CC2 to CID using g_LookupTable
// PRE: cc2 is a string that is a valid CC2 code corresponding to a country/region in the lookup table,
//		g_LookupTable exists and has the correct data
// POST: FCTVAL = cid (CID corresponding to the input CC2 in the lookup table), -1 if cc2 not found
function GetCID(cc2)
{
    var length = g_LookupTable.length;
    var cid = -1;
    
    for (var i in g_LookupTable)
    {
        if (g_LookupTable[i][0] === cc2)
        {
            cid = i;
        }
    }

    return cid; 
}

/*
 * Function: CleanStatNames
 */
// Author: Nicholas Denaro, William Bittner
// Date Created: 2/22/2016
// Last Modified: 2/22/2016 by Nicholas Denaro
// Description: Take the stat list and give them nicer names to display.
// PRE: g_StatList exist
// POST: g_StatList has friendlier names
function CleanStatNames()
{
	g_StatList[g_StatList.indexOf("births")] = "Births";
	g_StatList[g_StatList.indexOf("cases")] = "Reported Cases";
	g_StatList[g_StatList.indexOf("deaths")] = "Deaths";
	g_StatList[g_StatList.indexOf("e_cases")] = "Estimated Cases";
	g_StatList[g_StatList.indexOf("e_mortality")] = "Estimated Mortality";
	g_StatList[g_StatList.indexOf("populations")] = "Population";
	g_StatList[g_StatList.indexOf("sia")] = "sia-VACCB";
}

/*
 * Function: ParseStatList
 */
// Author: Nicholas Denaro, William Bittner
// Date Created: 4/2/2015
// Last Modified: 2/22/2016 by Nicholas Denaro
// Description: Take the stat list and populate a parsed data 2d array for use in creating graphs
// PRE: g_StatList exist
// POST: return a 2D array A[x][y], in which each x value represents a selectable 
// 		 stat, and each y value either represents stat type (0), indicates head stat (1), or indicates 
//		 associated data (2-3).
function ParseStatList()
{
	var statList = g_StatList.slice();
	var parsedStatList = [];						// 2d array
	parsedStatList[0] = [];
	parsedStatList[1] = [];
	parsedStatList[2] = [];
	parsedStatList[3] = [];

	// index variables for the vaccination stats
	var vaccL1 = -1;
	var vaccL2 = -1;
	var vaccSIAHead = -1;
	
	var statType = {
		NOT_VACCINE : 0,
		VACCINE : 1
	};

	// 'global' variables for index locations
	var parsedStatIndexes = { 
		GRAPH_TYPE : 0,
		HEAD_STAT : 1,
		ASSOCIATED1 : 2,
		ASSOCIATED2 : 3
	};

	var mcvRegex = new RegExp("^mcv(1|2)$");
	var siaRegex = new RegExp("^sia$");
	var estimatedRegex = new RegExp("^e_");
	var estimatedBoundRegex = new RegExp("^(ube_|lbe_)");

	var index = 0;

	// Vaccines
	var siaIndex = statList.indexOf("sia");
	parsedStatList[parsedStatIndexes.GRAPH_TYPE][index] = statType.VACCINE;
	parsedStatList[parsedStatIndexes.HEAD_STAT][index] = siaIndex;
	var svaccSIAHead = index;
	var mcv1Index = statList.indexOf("mcv1");
	var mcv2Index = statList.indexOf("mcv2");
	parsedStatList[parsedStatIndexes.ASSOCIATED1][index] = mcv1Index;
	parsedStatList[parsedStatIndexes.ASSOCIATED2][index] = mcv2Index;

	index++;

	for(var i = statList.length - 1; i >= 0; i--)
	{
		var currentStat = statList[i];

		if(estimatedRegex.test(currentStat) || (!estimatedBoundRegex.test(currentStat) && !mcvRegex.test(currentStat) && currentStat != "sia"))
		{
			parsedStatList[parsedStatIndexes.GRAPH_TYPE][index] = statType.NOT_VACCINE;
			parsedStatList[parsedStatIndexes.HEAD_STAT][index] = i;
			parsedStatList[parsedStatIndexes.ASSOCIATED1][index] = -1;
			parsedStatList[parsedStatIndexes.ASSOCIATED2][index] = -1;
			index++;
		}
	}

	for(var i = parsedStatList.length - 1; i >= 0; i--)
	{
		var statName = statList[parsedStatList[parsedStatIndexes.HEAD_STAT][i]];
		var normalizedStatName = statName.replace("e_","");

		if(estimatedRegex.test(statName))
		{
			var lowerIndex = statList.indexOf("lbe_"+normalizedStatName);
			var upperIndex = statList.indexOf("ube_"+normalizedStatName);

			parsedStatList[parsedStatIndexes.ASSOCIATED1][i] = lowerIndex;
			parsedStatList[parsedStatIndexes.ASSOCIATED2][i] = upperIndex;
		}
	}
	return parsedStatList;
	
}
