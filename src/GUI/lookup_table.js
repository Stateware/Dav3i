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
// Last Modified: 4/7/2015 by Emma Roudabush
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
        $.when(GetHMS(g_StatID=1)).done(function(hmsData){
            SetHMS(hmsData[1]);     // Need to index in due to JSON format of by_stat.php
        });
        GenerateStatReferenceList(DescriptorJSON);
        ParseStatList();
        console.log(g_LookupTable);
        console.log(g_StatList);
        BuildTabs();
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
        url: 'http://usve74985.serverprofi24.com/API/descriptor.php',                                                     
        dataType: 'JSON',                 
        success: function(data){     
            console.log("Successfully received descriptor.php");
        } 
    });
}

// Author: Emma Roudabush
// Date Created: 4/7/2015
// Last Modified: 4/7/2015 by Emma Roudabush
// Description: Sets the time span to the correct span given by descriptor.php				
// PRE: descriptor.php has been successfully retrieved 
// POST: g_FirstYear and g_YearStart have the correct beginning year of statistics.
// 		 g_LastYear and g_YearEnd have the correct ending year of statistics. 
function SetInitalYears(DescriptorJSON)
{
	g_FirstYear = DescriptorJSON.yearRange[0];
	g_YearStart = DescriptorJSON.yearRange[0];
	g_LastYear = DescriptorJSON.yearRange[1];
	g_YearEnd = DescriptorJSON.yearRange[1];
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
// PRE: g_DescriptorJSON exists with the correct data from descriptor.php,
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
// PRE: hms contains valid heat map values and hms is of size g_LookupTable.length
// POST: g_LookupTable has heat map values of hms
function SetHMS(hmsData)
{
    for (var i = 0; i < g_LookupTable.length; i++)
    {
        g_LookupTable[i][2] = hmsData[i];
    }
}

// Author: Vanajam Soni, Kyle Nicholson, Joshua Crafts
// Date Created: 3/19/2015
// Last Modified: 3/23/2015 by Joshua Crafts
// Description: Returns HMS data based on hmsID
// PRE: hms contains valid heat map values and hms is of size g_LookupTable.length
// POST: FCTVAL == HMS data corresponding to stat enumerated by hmsID in the stat reference list, in JSON format
function GetHMS(hmsID)
{
    return $.ajax({                                      
        url: 'http://usve74985.serverprofi24.com/API/by_stat.php?statID='.concat(hmsID.toString()),                                                     
        dataType: 'JSON',
        success: function(data){     
            console.log("Successfully received by_stat.php?statID=".concat(hmsID.toString()));
        } 
    });
}

// Author: Emma Rouabush, Joshua Crafts
// Date Created: 3/17/2015
// Last Modified: 3/22/2015 by Joshua Crafts
// Description: Translate CC2 to CID using g_LookupTable
// PRE: cc2 is a string that is a valid CC2 code corresponding to a country/region in the lookup table
// POST: FCTVAL = cid (CID corresponding to the input CC2 in the lookup table)
function GetCID(cc2)
{
    var length = g_LookupTable.length;
    var cid;
    
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
// Author: Kyle Nicholson
// Date Created: 4/2/2015
// Last Modified: 4/2/2015 by Kyle Nicholson
// Description: Take the stat list and populate a parsed data 2d array for use in creating graphs
// PRE: stat list is 
// POST: 

// console.log(name of variable) -> this shows the data inside a variable
// to test make this happen on load! wee!
function ParseStatList()
{
    g_ParsedStatList = [[1,0,0,0,0,0,0][12,0,1,2,3,5,8],[4,-1,-1,-1,-1,10,11],[6,-1,-1,-1,-1,9,7]];
}*/

// Author: Kyle Nicholson
// Date Created: 4/2/2015
// Last Modified: 4/14/2015 by Kyle Nicholson
// Description: Take the stat list and populate a parsed data 2d array for use in creating graphs
function parseStatList()
{
	var sortedStatList = g_StatList.slice();
	sortedStatList.sort();
	var parsedStatList = [];						// 2d array
	parsedStatList[0] = [];
	parsedStatList[1] = [];
	parsedStatList[2] = [];
	parsedStatList[3] = [];
	
	var index = 0;
	var headStat = 1;
	var statType = 0;
	
	// this loop searches through the g_statList and places only single stats
	// in the parsedStatList in the appropriate slot
	for(var i = 0; i<sortedStatList.length; i++)
	{
		var currentStat = sortedStatList[i];
		var isAssociatedStat = false;
		var isVacc = false;
	
		
		if(i > 0 && currentStat.indexOf(sortedStatList[i-1]) == 0)
		{
			isAssociatedStat = true;
			parsedStatList[2][index-1] = g_StatList.indexOf(currentStat);
		}
		else if(i > 1 && currentStat.indexOf(sortedStatList[i-2]) == 0)
		{
			isAssociatedStat = true;
			parsedStatList[3][index-1] = g_StatList.indexOf(currentStat);
		}
		
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
			}
			index++;
		}
	}
	console.log(parsedStatList);
	
	if(parsedStatList[3][0] == null)			// vanajam - instead of -1 you can test these places for null
		console.log("No Upper Bound");
	
	parsedStatList = g_parsedStatList;
}



