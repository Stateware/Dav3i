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

// Author: Emma Roudabush, Joshua Crafts
// Date Created: 3/5/2015
// Last Modified: 4/16/2015 by Nicholas Denaro
// Description: Fills g_DescriptorJSON with the contents of descriptor.php,
//              fills g_LookupTable and g_StatList with their corresponding data
//              and logs the resulting variables to the console.
// PRE: DescriptorJSON, g_StatList, and g_LookupTable exist,
//      GenerateLookupTable and GenerateStatReferenceList function correctly
// POST: DescriptorJSON, g_StatList, g_LookupTable contain their correct data.
function ParseDescriptor()
{
    var DescriptorJSON;
    var hmsData;

    $.when(GetDescriptor()).done(function(DescriptorJSON){
        SetInitalYears(DescriptorJSON);
        SetGraphType(0);
        GenerateLookupTable(DescriptorJSON);
        GenerateStatReferenceList(DescriptorJSON);
        ParseStatList();
        g_StatID = 1;
        g_HMSYear = g_LastYear;
        ColorByHMS();
        //console.log(g_LookupTable);
        //console.log(g_StatList);
        BuildTabs();
        UpdateInputs();
    });
}

// Author: Emma Roudabush
// Date Created: 3/5/2015
// Last Modified: 3/19/2015 by Emma Roudabush
// Description: Retrieves descriptor.php from the server                
// PRE: descriptor.php exists on the server.
// POST: returns the contents of descriptor.php
function GetDescriptor()
{
    return $.ajax({                                      
        url: 'http://localhost/dav3i/API/descriptor.php',                                                     
        dataType: 'JSON',                 
        success: function(data){     
            //console.log("Successfully received descriptor.php");
        } 
    });
}

// Author: Emma Roudabush
// Date Created: 4/7/2015
// Last Modified: 4/7/2015 by Emma Roudabush
// Description: Sets the time span to the correct span given by descriptor.php				
// PRE: DescriptorJSON exists with the correct data from descriptor.php,
//		g_FirstYear, g_YearStart, g_LastYear and g_YearEnd exist
// POST: g_FirstYear and g_YearStart have the correct beginning year of statistics.
// 		 g_LastYear and g_YearEnd have the correct ending year of statistics. 
function SetInitalYears(DescriptorJSON)
{
	g_FirstYear = Number(DescriptorJSON.yearRange[0]);
	g_YearStart = Number(DescriptorJSON.yearRange[0]);
	g_LastYear = Number(DescriptorJSON.yearRange[1]);
	g_YearEnd = Number(DescriptorJSON.yearRange[1]);
}

// Author: Emma Roudabush
// Date Created: 3/5/2015
// Last Modified: 3/19/2015 by Emma Roudabush
// Description: Fills the contents of g_LookupTable with data from
//              DescriptorJSON. This includes the CC2 codes, the 
//              names, and the HMS values are set to 0.
// PRE: DescriptorJSON exists with the correct data from descriptor.php,
//      g_LookupTable exists
// POST: g_LookupTable has the correct CC2, name, and HMS values
function GenerateLookupTable(DescriptorJSON)
{
    g_LookupTable = new Array(DescriptorJSON.cc2.length);
    for (i = 0; i < DescriptorJSON.cc2.length; i++)
    {
        g_LookupTable[i] = new Array(3);
        g_LookupTable[i][0] = DescriptorJSON.cc2[i];
        g_LookupTable[i][1] = DescriptorJSON.common_name[i];
        g_LookupTable[i][2] = 0;
    }
}

// Author: Emma Roudabush
// Date Created: 3/5/2015
// Last Modified: 3/19/2015 by Emma Roudabush
// Description: Fills the contents of g_StatList with the stats
//              data from DescriptorJSON            
// PRE: DescriptorJSON exists with the correct data from descriptor.php,
//      g_StatList exists
// POST: g_StatList has the correct stat values
function GenerateStatReferenceList(DescriptorJSON)
{
    g_StatList = new Array(DescriptorJSON.stats.length); 
    for (i = 0; i < DescriptorJSON.stats.length; i++)
    {
        g_StatList[i] = DescriptorJSON.stats[i];
    }
}

// Author: Emma Roudabush, Joshua Crafts
// Date Created: 3/17/2015
// Last Modified: 3/23/2015 by Joshua Crafts
// Description:Replace HMS values in lookup table with new HMS data (will happen just after lookup table generation for default HMS)
// PRE: hmsData contains valid heat map values and hmsData is of size g_LookupTable.length
// POST: g_LookupTable has heat map values of hmsData
function SetHMS(hmsData)
{
    for (var i = 0; i < g_LookupTable.length; i++)
    {
        g_LookupTable[i][2] = Number(hmsData[i]);
    }
}

// Author: Vanajam Soni, Kyle Nicholson, Joshua Crafts
// Date Created: 3/19/2015
// Last Modified: 3/23/2015 by Joshua Crafts
// Description: Returns HMS data based on hmsID
// PRE: hmsID is an integer and a valid heat map stat id, year is an integer and within the valid range
// POST: FCTVAL == HMS data corresponding to stat enumerated by hmsID in the stat reference list, in JSON format
function GetHMS(hmsID, year)
{
    return $.ajax({        
        url: 'http://localhost/dav3i/API/by_stat.php?statID='.concat(hmsID.toString()+"&year="+year.toString()),                                                     
        dataType: 'JSON',
        success: function(data){     
            //console.log("Successfully received by_stat.php?statID=".concat(hmsID.toString()));
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
// I'm keeping this here just in case something breaks TODO: Delete these comments when approval is granted
function ParseStatList()
{
    g_ParsedStatList = [[1,0,0,0,0,0,0],[12,0,1,2,3,5,8],[4,-1,-1,-1,-1,10,11],[6,-1,-1,-1,-1,9,7]];
}*/

// Author: Kyle Nicholson
// Date Created: 4/2/2015
// Last Modified: 4/15/2015 by Kyle Nicholson
// Description: Take the stat list and populate a parsed data 2d array for use in creating graphs
// PRE: g_StatList, g_ParsedStatList exist
// POST: g_ParsedStat is set up as a 2D array A[x][y], in which each x value represents a selectable 
// 		 stat, and each y value either represents stat type (0), indicates head stat (1), or indicates 
//		 associated data (2-3).
function ParseStatList()
{
	var sortedStatList = g_StatList.slice();		// copy into a new array	
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
			parsedStatList[headStat][index] = g_StatList.indexOf(currentStat);
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
	g_ParsedStatList = parsedStatList;
}


