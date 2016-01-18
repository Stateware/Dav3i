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
    
    //Set initial stat displayed to deaths
    g_StatID = 1;
    
    //Set the initial year displayed to the most current year for which we have data
    g_HMSYear = g_LastYear;
    
    FindCountriesNoData();
    ColorByHMS();
    BuildTabs();

    g_TempSettings = UpdateInputs();
        
}

// Author: Emma Roudabush, William Bittner
// Date Created: 3/5/2015
// Last Modified: 9/24/2015 by William Bittner
// Description: Retrieves descriptor.php from the server                
// PRE: descriptor.php exists on the server.
// POST: If retrieval is successful, call the function to parse the descriptor
//			if retrieval is not, error is logged.
function GetDescriptor()
{
    return $.ajax({                                      
        url: 'http://localhost/dav3i/API/descriptor.php',                                                     
        dataType: 'JSON',                 
        success: function(data){
        	ParseDescriptor(data);
        },
        error: function(xhr, textStatus, errorThrown){
       		console.log('Descriptor could not be fetched. The error is as follows: ' + errorThrown);
    	}
    });
}

// Author: Emma Roudabush, William Bittner
// Date Created: 4/7/2015
// Last Modified: 9/24/2015 by William Bittner
// Description: Returns an object corresponding to the year range defined in the descriptor			
// PRE: DescriptorJSON is formatted as to the specifications in the documentation
// POST: An object with the first and last year values defined
function GetInitialYears(DescriptorJSON)
{
	var firstYear = Number(DescriptorJSON.yearRange.startYear);
	var lastYear = Number(DescriptorJSON.yearRange.endYear);
	var yearRangeObject = {
						FirstYear : firstYear,
						LastYear  : lastYear
					};

	return yearRangeObject;
}

// Author: Emma Roudabush, William Bittner
// Date Created: 3/5/2015
// Last Modified: 9/24/2015 by William Bittner
// Description: Returns a table of Countries CC2 codes, the country
//              names, and HMS values are set to 0.
// PRE: DescriptorJSON exists with the correct data from descriptor.php,
// POST: A 2d array is returned that has the correct CC2, name, and HMS values zero'd for each country
function InitializeLookupTable(DescriptorJSON)
{
    var countries = DescriptorJSON.countries;
    var keys = Object.keys(countries);
    var lookupTable = new Array(keys.length);

    for(var i = 0; i < keys.length; i++)
    {
    	var key = keys[i];
    	lookupTable[key] = new Array(3);
        lookupTable[key][0] = countries[key].cc2;
        lookupTable[key][1] = countries[key].common_name;
        lookupTable[key][2] = 0;
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
    /*var statList = new Array(DescriptorJSON.stats.length); 
    
    for (i = 0; i < DescriptorJSON.stats.length; i++)
    {
        statList[i] = DescriptorJSON.stats[i];
    }
    
    return statList;*/

    var stats = DescriptorJSON.stats;
    var keys = Object.keys(stats);
    var statList = {};//new Array(keys.length);
    
    for (var i = 0; i < keys.length; i++)
    {
    	var key = keys[i];
        statList[key] = DescriptorJSON.stats[key];
    }
    
    return statList;
}

// Author: Emma Roudabush, Joshua Crafts
// Date Created: 3/17/2015
// Last Modified: 9/28/2015 by Murlin Wei
// Description:Replace HMS values in lookup table with new HMS data (will happen just after lookup table generation for default HMS)
// PRE: hmsData contains valid heat map values and hmsData is of size g_LookupTable.length
// POST: g_LookupTable has heat map values of hmsData
function SetHMS(hmsData, stat, year)
{
    var heatMapValues = [];

    var countrykeys = Object.keys(hmsData);
    for(var i = 0; i < countrykeys.length; i++)
    {
    	var key = countrykeys[i];
    	if($.isNumeric(key))
    	{
    		heatMapValues[i] = hmsData[key][stat][year];
    	}
    }

    return heatMapValues;
}

// Author: Vanajam Soni, Kyle Nicholson, Joshua Crafts
// Date Created: 3/19/2015
// Last Modified: 3/23/2015 by Joshua Crafts
// Description: Returns HMS data based on hmsID
// PRE: hmsID is an integer and a valid heat map stat id, year is an integer and within the valid range
// POST: FCTVAL == HMS data corresponding to stat enumerated by hmsID in the stat reference list, in JSON format
function GetHMS(hmsID, year)
{
	var data = retrieveByStatData(SESSION, INSTANCE, hmsID, year);

	function wait(){
		var keys = Object.keys(data);
		if(checkCacheByStat(SESSION, INSTANCE, hmsID, year))
		{
			ParseMapData(data, hmsID, year);
		}
		else
		{
			setTimeout(wait, 100);
		}
	}

	setTimeout(wait,100);
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

// Author: Kyle Nicholson, William Bittner
// Date Created: 4/2/2015
// Last Modified: 9/24/2015 by William Bittner
// Description: Take the stat list and populate a parsed data 2d array for use in creating graphs
// PRE: g_StatList exist
// POST: return a 2D array A[x][y], in which each x value represents a selectable 
// 		 stat, and each y value either represents stat type (0), indicates head stat (1), or indicates 
//		 associated data (2-3).
function ParseStatList()
{
	var statArray = new Array(Object.keys(g_StatList).length);
	var keys = Object.keys(g_StatList);
	for(var i = 0; i < keys.length; i++)
	{
		statArray[i] = g_StatList[keys[i]];
	}

	var sortedStatList = statArray.slice();//g_StatList.slice();		// copy into a new array	
	sortedStatList.sort();
	var parsedStatList = [];						// 2d array
	parsedStatList[0] = [];
	parsedStatList[1] = [];
	parsedStatList[2] = [];
	parsedStatList[3] = [];
	
	var index = 0;
	
	// 'global' variables for index locations
	var statType = 0;
	var headStat = 1;
	var assocStat1 = 2;
	var assocStat2 = 3;
	
	// index variables for the vaccination stats
	var vaccL1 = -1;
	var vaccL2 = -1;
	var vaccSIAHead = -1;
	
	// this loop searches through the g_statList and places only single stats
	// in the parsedStatList in the appropriate slot
	for(var i = 0; i<sortedStatList.length; i++)
	{
		var currentStat = sortedStatList[i];
		var isAssociatedStat = false;
		var isVacc = false;
		
		if(currentStat.indexOf('VACCL') >= 0)
		{
			// prevent any vaccination bounds from being put as a head stat and mark vaccl indexes
			// also sets location of associated vaccination stats
			isAssociatedStat = true;
			if(vaccL1 == -1)
			{
				vaccL1 = g_StatList.indexOf(currentStat);
			}
			else if(vaccL2 == -1)
			{
				vaccL2 = g_StatList.indexOf(currentStat); 
			}
		}
		
		// sets the assocaited stat indexes
		if(i > 0 && currentStat.indexOf(sortedStatList[i-1]) == 0)
		{
			isAssociatedStat = true;
			parsedStatList[assocStat1][index-1] = g_StatList.indexOf(currentStat);
		}
		else if(i > 1 && currentStat.indexOf(sortedStatList[i-2]) == 0)
		{
			isAssociatedStat = true;
			parsedStatList[assocStat2][index-1] = g_StatList.indexOf(currentStat);
		}
		
		// sets the head stats
		if(!isAssociatedStat)
		{
			//parsedStatList[headStat][index] = g_StatList.indexOf(currentStat);
			for(var j = 0; j < keys.length; j++)
			{
				if(g_StatList[keys[j]] == currentStat)
				{
					parsedStatList[headStat][index] = keys[j];
				}
			}

			// if the current stat doesn't contain vacc then set statType to 0
			if(currentStat.indexOf('VACCB') < 0)
			{
				parsedStatList[statType][index] = 0;
			}
			else
			{
				parsedStatList[statType][index] = 1;
				isSIAInList = true; 
				vaccSIAHead = index;
			}
			index++;
		}
	}
	
	// set the associated stats for the SIA vaccination stat
	parsedStatList[assocStat1][vaccSIAHead] = vaccL1;
	parsedStatList[assocStat2][vaccSIAHead] = vaccL2;
	
	
	// hacky way of filling in nulls with -1 TODO: figure out how to do this better
	for(var i=0;i<index;i++)
	{
		for(var j=0;j<4;j++)
		{
			if(parsedStatList[j][i] == null)
			{
				parsedStatList[j][i] = -1;
			}
		}
	}
	return parsedStatList;
}


