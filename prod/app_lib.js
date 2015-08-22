/*! Dav3i - v0.1.0 - 2015-08-22
* https://github.com/Stateware/Dav3i
* Copyright (c) 2015 Stateware Team;
 Licensed GPL v3 (https://github.com/Stateware/Dav3i/blob/master/LICENSE) */
// File Name:               data_query.js
// Description:             takes CC2 codes and sends them to lookup_table.js, receives CIDs, queries the database,
//                          parses the JSON and returns the array
// Date Created:            3/5/2015
// Contributors:            Paul Jang, Vanajam Soni, Kyle Nicholson
// Date Last Modified:      3/26/2015
// Last Modified By:        Vanajam Soni
// Dependencies:            lookup_table.js, byCountry.php, parser.js
// Additional Notes:        N/A


// Author:          Nicholas Denaro
// Date Created:    2/12/15
// Last Modified:   3/19/15 by Nicholas Denaro
// Description:     Parses the object that is passed in and returns data array.
// PRE: json is valid JSON with data for only one country, assumed to be in the proper format
// POST: FCTVAL == a 2d array containing stat, year in the form [stat][year]
function ParseData(json)
{
    var data = []; // Creates the array for the data to be returned
    data = json[Object.keys(json)[0]];// Since there will only be one country in each json,
                                      // we can simply get the first key, and use that to
                                      // get the value for the data.

    return data;
}


// Author:          Vanajam Soni, Paul Jang
// Date Created:    3/5/15
// Last Modified:   3/26/15 by Vanajam Soni
// Description:     Makes Ajax call to get country data from server
// PRE: cid is a valid country-id
// POST: FCTVAL == Ajax object that makes the API call with the given cid
function GetData(cid)
{
    return $.ajax({                                      
        url: "API/by_country.php?countryIDs=".concat(cid.toString()),                                                    
        dataType: "JSON",
        success: function(data){     
            console.log("Successfully received by_country.php?countryIDs=".concat(cid.toString()));
        } 
    });

}

// Author: Vanajam Soni, Kyle Nicholson
// Date Created: 3/24/15
// Last Modified: 3/26/15 Vanajam Soni
// Description: adds or removes a node to the g_DataList to reflect the chosen regions on the map
// PRE:  selectedRegions is a 1D array of CC2 codes output from map.getSelectedRegions in map.js
// POST: the current data list is replaced with a list containing the relevant data for all countries
//       whose CC2s are in selectedRegions which have data available
function BuildList(selectedRegions) 
{
    var index;			// index in g_LookupTable for a given entry, hashed based on CC2
    var node;			// new node to be added to list

    if (g_DataList == null)					// create list if it does not exist
    {
	g_DataList = new c_List();
    }

    g_DataList.clear();						// clear list

    for(var i = 0; i < selectedRegions.length; i++)			// iterate through list of selected countries
    {
        index = Hash(selectedRegions[i]);			// index into hash table using CC2
        if (g_LookupTable[index] !== undefined)			// if data exists for country, create node
        {							//  and prepend it to list
            node = new t_AsdsNode(g_LookupTable[index][0],
                                  g_LookupTable[index][1],
                                  g_LookupTable[index][2],
                                  g_LookupTable[index][3]);
            g_DataList.add(node);
        }
    }
}

// File Name:               data.js
// Description:             This module holds all global data for the other modules of the project
// Date Created:            3/19/2015
// Contributors:            Joshua Crafts, Vanajam Soni, Paul Jang
// Date Last Modified:      4/23/2015
// Last Modified By:        Kyle Nicholson
// Dependencies:            index.html
// Additional Notes:        N/A

// constants
var g_BUCKETS = 676;				// number of hashable buckets in the lookup table

// global variables
var g_LookupTable;      			// CID, CC2, name, and HMS lookup table
var g_NumCountries;				// number of countries for which data exists
var g_StatList;         			// stat reference list, indexed by stat ID
var g_FirstYear;        			// first year for which data is available
var g_LastYear;         			// last year for which data is available
var g_YearStart;        			// first year for which user wants data
var g_YearEnd;          			// last year for which user wants data
var g_DataList;         			// data list for use in graphing
var g_StatID;           			// stat ID corresponding to selected HMS.
var g_HMSYear;          			// year for which HMS data is wanted
var g_ParsedStatList;   			// parsed stat reference list
var g_GraphType = 0;        			// represents the graph type, enumerated 0 to 2
var g_Clear = false;				// used by the clear selection function to avoid rebuilding data list on each deselect
var g_Expanded = false; 			// used to determine whether or not the graph section is expanded
var g_VaccHMS = 1;				// used to determine which vaccination stat to use when heat mapping
var g_TempSettings = new Array(5);  		// indicies are "first year, last year, Heat map year, graph type, vacc heat map"
var g_DataReady = false;			// true when all lookup table data is loaded
var g_HMSReady = false;				// true when init heat map data is loaded
var g_DataLoaded = 0;				// number of countries for which data is loaded

// prototype (constructor) for ASDS node
function t_AsdsNode(cid, cc2, name, data)
// PRE:  0 <= cid <= g_NumCountries, cc2 is a 2 alpha character code corresponding to the country whose country id is cid,
//       name is the name of that country, and data is a 2D array of length (g_LastYear-g_FirstYear)+1, and depth g_StatList.length,
//       which contains the data points from g_FirstYear to g_LastYear for all stats (enumerated 0 to g_StatList.length-1)
// POST: FCTVAL == new ASDS node with the specified values for its data members, whose next pointer points to null
{
    this.cid = cid;
    this.cc2 = cc2;
    this.name = name;
    this.data = data;
    this.next = null;
}

// prototype for variable containing list of nodes
function c_List() 
// POST: FCTVAL == new empty list of size 0, whose start points to null
{
     
    this.size = 0;
    this.start = null;
    
    this.add = function(node) 
    // POST: node is appended at the start of the list
    {
        var temp;

        temp = this.start;		// insert node at head of list
        this.start = node;
        this.start.next = temp;
        this.size++;
    }; 

    this.clear = function()
    // POST: the list, if it has members, is cleared, and its size is reset to 0, and start pointer points to null
    { 
        this.size = 0;
        this.start = null;
    };
}

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
    var DescriptorJSON;			// text returned from descriptor.php call

    $.when(GetDescriptor()).done(function(DescriptorJSON){
        SetInitalYears(DescriptorJSON);			// set year range
        GenerateLookupTable(DescriptorJSON);		// initialize lookup table
        SetTableData();					// get region data from server
        GenerateStatReferenceList(DescriptorJSON);	// set stat list
        ParseStatList();				// create parsed stat list
        g_StatID = 1;					// set init stat id
        g_HMSYear = g_LastYear;				// set init HMS year to end of data
        ColorByHMS();					// color map
        // console.log(g_LookupTable);
        // console.log(g_StatList);
        BuildTabs();					// build tab menu
        UpdateInputs();					// set init values for settings inputs
    });
}

// Author: Joshua Crafts
// Date Created: 5/20/2015
// Last Modified: 5/20/2015 by Joshua Crafts
// Description: This function takes in a 2 character CC2 code and returns the key of g_LookupTable
//              to which the CC2 belongs
// PRE:  cc2 is a 2 alpha character code
// POST: FCTVAL == the key of the correct bucket to which cc2 belongs
function Hash(cc2)
{
    var key = 26 * (cc2.charCodeAt(0) - "A".charCodeAt(0)) + (cc2.charCodeAt(1) - "A".charCodeAt(0));

    return key;
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
        url: "API/descriptor.php",
        dataType: "JSON",
        error: function() {
            console.log("Error receiving descriptor.php");
        },        
        success: function(){
            console.log("Successfully received descriptor.php");
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
// POST: g_LookupTable has 676 buckets, of which 193 are initialized to 5 element vectors, of which
//       their keys are the hashed values of all 193 CC2s from descriptor.php. The vectors contain
//       (in order) the CID of a country, the CC2, the name, a field containing the data set for the
//       country (initialized to null), and the heat map value for that country (init to 0)
function GenerateLookupTable(DescriptorJSON)
{
    var CID = 0,
        index,
        i;

    g_LookupTable = new Array(g_BUCKETS); // create bucket for all possible CC2s
    g_NumCountries = DescriptorJSON.cc2.length;
    for (i = 0; i < DescriptorJSON.cc2.length; i++)
    {
        index = Hash(DescriptorJSON.cc2[CID]);				// get hash key for current CC2
        g_LookupTable[index] = new Array(5);				// create fields
        g_LookupTable[index][0] = CID;					// set CID field to index of current
									//  cc2 in descriptor.php
        g_LookupTable[index][1] = DescriptorJSON.cc2[CID];		// set cc2 to current cc2
        g_LookupTable[index][2] = DescriptorJSON.common_name[CID];	// set name to current name
        g_LookupTable[index][3] = null;					// init null data field
        g_LookupTable[index][4] = 0;					// init 0 heat map stat
        CID++;								// increment index
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
    var i;

    g_StatList = new Array(DescriptorJSON.stats.length); 
    for (i = 0; i < DescriptorJSON.stats.length; i++)
    {
        g_StatList[i] = DescriptorJSON.stats[i];
    }
}

// Author: Joshua Crafts
// Date Created: 5/20/2015
// Last Modified: 5/27/2015 by Joshua Crafts
// Desription: Gets all region data from server and fills table
// PRE:  g_LookupTable is initialized
// POST: All table entries for which data exists on the server now have data stored locally in
//       g_LookupTable
function SetTableData()
{
    var i;

    for (i = 0; i < g_LookupTable.length; i++)
    {								// each must be set separately so that
        SetData(i);						//  i is hidden between calls, otherwise
    }								//  loop will continue before data is set
								//  data is lost or becomes redundant
}

// Author: Joshua Crafts
// Date Created: 5/27/2015
// Last Modified: 5/27/2015 by Joshua Crafts
// Description: Gets data for a single table entry if it exists and sets data field in g_LookupTable
// PRE:  g_LookupTable is initialized and 0 <= index < g_LookupTable.length
// POST: if g_LookupTable[index] exists, g_LookupTable[index][data] contains its stat data
function SetData(index)
{
    var parsedData;

    if (g_LookupTable[index] !== undefined)
    {
        $.when(GetData(g_LookupTable[index][0])).done(function(data){
            parsedData = ParseData(data);				// parse data and set data field
            g_LookupTable[index][3] = parsedData;
            g_DataLoaded++;
            if (g_DataLoaded === g_NumCountries)				// if last region accounted for,
            {								//  set ready flag to true
                g_DataReady = true;
            }
        });
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
    var i;

    for (i = 0; i < g_LookupTable.length; i++)
    {
        if (g_LookupTable[i] !== undefined)
        {
            g_LookupTable[i][4] = Number(hmsData[g_LookupTable[i][0]]);
        }
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
        url: "API/by_stat.php?statID=".concat(hmsID.toString()+"&year="+year.toString()),                                                     
        dataType: "JSON",
        success: function(data){     
            console.log("Successfully received by_stat.php?statID=".concat(hmsID.toString()));
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
    var key = Hash(cc2),
        cid = g_LookupTable[key][0];

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
	var sortedStatList = g_StatList.slice(),
            parsedStatList = [],						// 2d array
            index = 0,
            // 'global' variables for index locations
	    statType = 0,
	    headStat = 1,
	    assocStat1 = 2,
	    assocStat2 = 3,
	    // index variables for the vaccination stats
	    vaccL1 = -1,
	    vaccL2 = -1,
	    vaccSIAHead = -1,
            i, j,
            currentStat,
            isAssociatedStat,
            isVacc;

        parsedStatList[0] = [];
	parsedStatList[1] = [];
	parsedStatList[2] = [];
	parsedStatList[3] = [];
	sortedStatList.sort();

	// this loop searches through the g_statList and places only single stats
	// in the parsedStatList in the appropriate slot
	for(i = 0; i<sortedStatList.length; i++)
	{
                currentStat = sortedStatList[i];
                isAssociatedStat = false;
                isVacc = false;

		if(currentStat.indexOf('VACCL') >= 0)
		{
			// prevent any vaccination bounds from being put as a head stat and mark vaccl indexes
			// also sets location of associated vaccination stats
			isAssociatedStat = true;
			if(vaccL1 === -1)
			{
				vaccL1 = g_StatList.indexOf(currentStat);
			}
			else if(vaccL2 === -1)
			{
				vaccL2 = g_StatList.indexOf(currentStat); 
			}
		}
		
		// sets the assocaited stat indexes
		if(i > 0 && currentStat.indexOf(sortedStatList[i-1]) === 0)
		{
			isAssociatedStat = true;
			parsedStatList[assocStat1][index-1] = g_StatList.indexOf(currentStat);
		}
		else if(i > 1 && currentStat.indexOf(sortedStatList[i-2]) === 0)
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
	for(i=0;i<index;i++)
	{
		for(j=0;j<4;j++)
		{
			if(parsedStatList[j][i] === null)
			{
				parsedStatList[j][i] = -1;
			}
		}
	}
	g_ParsedStatList = parsedStatList;
}



// File Name:               settings.js
// Description:             Module to modify and work with settings
// Date Created:            3/26/2015
// Contributors:            Emma Roudabush, Paul Jang, Kyle Nicholson
// Date Last Modified:      4/23/2015
// Last Modified By:       	Kyle Nicholson
// Dependencies:            data.js, index.html
// Additional Notes:        N/A

// Author: Emma Roudabush
// Date Created: 4/14/2015
// Last Modified: 4/23/2015 by Kyle Nicholson
// Description: To set g_GraphType
// PRE: type is a number between 0-2
// POST: g_GraphType is set to the appropriate graph type
function SetGraphType(type)
{
    g_GraphType = type;
}

// Author: Joshua Crafts
// Date Created: 4/19/2015
// Last Modified: 4/23/2015 by Kyle Nicholson
// Description: To set g_VaccHMS
// PRE: new is a number between 0-2
// POST: g_VaccHMS is set to the appropriate stat, and the map is recolored/revalued accordingly
function SetVaccHMS(newVaccHMS)
{
    g_VaccHMS = newVaccHMS;
}

// Author: Kyle Nicholson
// Date Created: 4/23/2015
// Last Modified: 4/23/2015 by Kyle Nicholson
// Description: To set settings for the year ranges
// PRE: See ApplySettings() and CloseSettings()
// POST: if apply settings fails nothing happens, else apply settings and close the menu
function ApplyAndClose()
{
	if(ApplySettings())
	{
		CloseSettings();
	}
}

// Author: Kyle Nicholson
// Date Created: 4/23/2015
// Last Modified: 4/23/2015 by Kyle Nicholson
// Description: To set settings for the year ranges
// PRE: N/A
// POST: 
function CancelSettings()
{
    // remove box shadow and check marks or x marks	
    var startDiv=document.getElementById("year-range-start"),
        endDiv=document.getElementById("year-range-end"),
        heatmapYearDiv=document.getElementById("heatmap-year");
	
    startDiv.style["box-shadow"]="none";
    endDiv.style["box-shadow"]="none";
    heatmapYearDiv.style["box-shadow"]="none";
        
    document.getElementById(startDiv.id+"-error").innerHTML="";
    document.getElementById(endDiv.id+"-error").innerHTML="";
    document.getElementById(heatmapYearDiv.id+"-error").innerHTML="";
    
    // visually and globally set all values in the settings menu to the tempSettings array
    ResetAllStatValues();
  	
    CloseSettings();
}

// Author: Kyle Nicholson
// Date Created: 4/23/2015
// Last Modified: 4/23/2015 by Kyle Nicholson
// Description: sets all of the settings based on the g_TempSettings array
// PRE: g_TempSettingsArray is initialized
// POST: all settings in the settings menu are visually set and their global variables are set
//       based on the g_TempSettings array
function ResetAllStatValues()
{
    var startDiv=document.getElementById("year-range-start"),
        endDiv=document.getElementById("year-range-end"),
        heatmapYearDiv=document.getElementById("heatmap-year");

	// set start end and heatmap div values
    startDiv.value = g_TempSettings[0];
    endDiv.value = g_TempSettings[1];
    heatmapYearDiv.value = g_TempSettings[2];
	
	// set radio buttons
    switch (g_TempSettings[3])
    {
    	case 0:
    		document.getElementById("graph-regional").checked = true;
    		break;
    	case 1:
    		document.getElementById("graph-combined").checked = true;
    		break;
    	case 2:
    		document.getElementById("graph-whole").checked = true;
    		break;
    }
    
    switch (g_TempSettings[4])
    {
    	case 0:
    		document.getElementById("vacc-sia").checked = true;
    		break;
    	case 1:
    		document.getElementById("vacc-mcv1").checked = true;
    		break;
    	case 2:
    		document.getElementById("vacc-mcv2").checked = true;
    		break;
    }
    
    // set the global settings stats
    g_YearStart = g_TempSettings[0];
    g_YearEnd = g_TempSettings[1];
    g_HMSYear = g_TempSettings[2];
    g_GraphType = g_TempSettings[3]; 
    g_VaccHMS = g_TempSettings[4];	
}

// Author: Kyle Nicholson
// Date Created: 4/23/2015
// Last Modified: 4/23/2015 by Kyle Nicholson
// Description: saves all current radio buttons and dates 
// PRE: there are values in each radio button and date div
// POST: saves all current radio buttons and dates and stores them in g_TempSettings array
function SaveCurrentStatValues()
{
    var startDiv=document.getElementById("year-range-start"),
        endDiv=document.getElementById("year-range-end"),
        heatmapYearDiv=document.getElementById("heatmap-year");
    
    g_TempSettings[0] = startDiv.value;
    g_TempSettings[1] = endDiv.value;
    g_TempSettings[2] = heatmapYearDiv.value;
    g_TempSettings[3] = g_GraphType;
    g_TempSettings[4] = g_VaccHMS;	
}

// Author: Nicholas Denaro
// Date Created: 4/18/2015
// Last Modified: 4/23/2015 by Kyle Nicholson
// Description: To set settings for the year ranges
// PRE: N/A
// POST: Assigns the global variables if ranges are valid, otherwise display error.
function ApplySettings()
{
    var canContinue=true,
        startDiv=document.getElementById("year-range-start"),
        endDiv=document.getElementById("year-range-end"),
        heatmapYearDiv=document.getElementById("heatmap-year");

    startDiv.style["box-shadow"]="";
    endDiv.style["box-shadow"]="";
    heatmapYearDiv.style["box-shadow"]="";

    document.getElementById(startDiv.id+"-error").style.cursor="default";
    document.getElementById(endDiv.id+"-error").style.cursor="default";
    document.getElementById(heatmapYearDiv.id+"-error").style.cursor="default";

    document.getElementById(startDiv.id+"-error").innerHTML="&emsp;";
    document.getElementById(endDiv.id+"-error").innerHTML="&emsp;";
    document.getElementById(heatmapYearDiv.id+"-error").innerHTML="&emsp;";

    document.getElementById(startDiv.id+"-error").removeAttribute("tooltip");
    document.getElementById(endDiv.id+"-error").removeAttribute("tooltip");
    document.getElementById(heatmapYearDiv.id+"-error").removeAttribute("tooltip");
    document.getElementById(startDiv.id+"-error").className="";
    document.getElementById(endDiv.id+"-error").className="";
    document.getElementById(heatmapYearDiv.id+"-error").className="";

    if(startDiv.value===""||(Number(startDiv.value)<Number(startDiv.min)||Number(startDiv.value)>Number(startDiv.max))||isNaN(startDiv.value))
    {
        canContinue=false;
        startDiv.style["box-shadow"]="0px 0px 8px #F00";
        document.getElementById(startDiv.id+"-error").style.cursor="help";
        document.getElementById(startDiv.id+"-error").innerHTML="X";
        document.getElementById(startDiv.id+"-error").setAttribute("tooltip","Out of range: "+startDiv.min+"-"+startDiv.max);
        document.getElementById(startDiv.id+"-error").className="settings-error";
    }
    if(endDiv.value===""||(Number(endDiv.value)<Number(endDiv.min)||Number(endDiv.value)>Number(endDiv.max))||isNaN(endDiv.value))
    {
        canContinue=false;
        endDiv.style["box-shadow"]="0px 0px 8px #F00";
        document.getElementById(endDiv.id+"-error").style.cursor="help";
        document.getElementById(endDiv.id+"-error").innerHTML="X";
        document.getElementById(endDiv.id+"-error").setAttribute("tooltip","Out of range: "+endDiv.min+"-"+endDiv.max);
        document.getElementById(endDiv.id+"-error").className="settings-error";
    }
    if(heatmapYearDiv.value===""||(Number(heatmapYearDiv.value)<Number(heatmapYearDiv.min)||Number(heatmapYearDiv.value)>Number(heatmapYearDiv.max))||isNaN(heatmapYearDiv.value))
    {
        canContinue=false;
        heatmapYearDiv.style["box-shadow"]="0px 0px 8px #F00";
		document.getElementById(heatmapYearDiv.id+"-error").style.cursor="help";
        document.getElementById(heatmapYearDiv.id+"-error").innerHTML="X";
        document.getElementById(heatmapYearDiv.id+"-error").setAttribute("tooltip","Out of range: "+heatmapYearDiv.min+"-"+heatmapYearDiv.max);
        document.getElementById(heatmapYearDiv.id+"-error").className="settings-error";
    }
    if(endDiv.value<startDiv.value)
    {
        canContinue=false;
        startDiv.style["box-shadow"]="0px 0px 8px #F00";
        endDiv.style["box-shadow"]="0px 0px 8px #F00";
        document.getElementById(startDiv.id+"-error").style.cursor="help";
        document.getElementById(endDiv.id+"-error").style.cursor="help";
        document.getElementById(startDiv.id+"-error").innerHTML="X";
        document.getElementById(endDiv.id+"-error").innerHTML="X";
        document.getElementById(startDiv.id+"-error").setAttribute("tooltip","Year must be before End.");
        document.getElementById(endDiv.id+"-error").setAttribute("tooltip","Year must be after Start.");
        document.getElementById(startDiv.id+"-error").className="settings-error";
        document.getElementById(endDiv.id+"-error").className="settings-error";
    }

    if(canContinue)
    {
    	startDiv.style["box-shadow"]="0px 0px 8px #00FF00";
        endDiv.style["box-shadow"]="0px 0px 8px #00FF00";
        heatmapYearDiv.style["box-shadow"]="0px 0px 8px #00FF00";
        
        document.getElementById(startDiv.id+"-error").innerHTML="&#10003";
    	document.getElementById(endDiv.id+"-error").innerHTML="&#10003";
    	document.getElementById(heatmapYearDiv.id+"-error").innerHTML="&#10003";
    	
    	// set settings
        g_YearStart=startDiv.value;
        g_YearEnd=endDiv.value;
        g_HMSYear=heatmapYearDiv.value;

        GenerateSubDivs();
        GenerateGraphs();
        ColorByHMS();	
        
        // saves all radio buttions and dates in g_TempSettings array
        SaveCurrentStatValues();
        
        return true;
    }
    else
    {
    	return false;
    }
}

// File Name: graph.js
// Description: This file generates graphs based on parsed data
// Date Created: 3/17/2015
// Contributors: Nicholas Dyszel, Berty Ruan, Arun Kumar, Paul Jang, Vanajam Soni
// Date Last Modified: 4/23/2015
// Last Modified By: Vanajam Soni
// Dependencies: client_parser.js, ..., [Google Charts API]
// Additional Notes: N/A

// Author: Arun Kumar
// Date Created: 4/14/2015
// Last Modified: 4/23/2015 by Vanajam Soni
// Description: Creates switch case to determine which function to call
// PRE: The divs for the graphs exist, and correct data is stored in g_DataList,
//      g_GraphType and g_StatList 
// POST: Calls the appropriate graphing functions depending on the g_GraphType and 
//       whether the g_StatID selected is vaccination or not 
function GenerateGraphs()
{
	var sumNode,
            max,
            element,
            cur,
            i;

	if(g_DataList !== undefined && g_DataList.size !== 0)
	{
    	    curr=g_DataList.start;    
	    if (g_StatList[g_StatID].indexOf("VACC") > -1)
	    {
	        if (g_GraphType !== 2)
	        {
	            for(i=1; i<=g_DataList.size; i++)
	            {
	                GraphVaccine("region-graphs-"+i, curr);
	                curr=curr.next;
	            }
	        }
	        else
	        {
	            sumNode = GenerateSumNode();
	            GraphVaccine("region-graphs-"+1,sumNode);
	        }
	    }
	    else
	    {
	        switch(g_GraphType)
	        {
	            case 0:    
                        max = FindMax();
	                for(i=1; i<=g_DataList.size; i++)
	                {
	                    if(GraphRegional("region-graphs-"+i, curr, max) === -1)
                            {
                                element = document.getElementById("region-graphs-"+i);
                                element.parentNode.removeChild(element);
                            }
	                    curr=curr.next;
	                }
	                break;
	            case 1:
	                GraphCombined("region-graphs-"+1);
	                break;
	            case 2:
	                sumNode = GenerateSumNode();
	                GraphRegional("region-graphs-"+1, sumNode);
	                break;
	        }
	    }
	}
}

// Author: Arun Kumar, Berty Ruan, Vanajam Soni
// Date Created:4/2/2015
// Last Modified: 4/25/2015 By Berty Ruan
// Description: Takes stat data and divID to generate a graph for a single country and stat
// PRE: divID is a div in the graphing section, node is a valid t_AsdsNode containing data for a country or 
//      a sum of countries, and maxVal is the max is maximum value of the selected stat for the entire list
// POST: generates a single Google ComboChart for the given node on the divID
function GraphRegional(divID, node, maxVal) {
    var data = GenerateSingleData(node.data),
        options = {
            title: node.name,
            seriesType: "line",
            legend: 'none',
            vAxis: {
                viewWindowMode:'explicit',
                viewWindow: {min: 0, max: maxVal}
            },
            hAxis: {title: 'Year', format: '####'},
            series: {1: {type: "area", color: "transparent"}, 2: {color: "navy"}, 3: {type: "area", color: "navy"}},
            isStacked: true,
            backgroundColor: '#EAE7C2',
            tooltip: {trigger: 'both'}
        },
    formatter,
    chart,
    i;
    	
    if(data !== null)
    {
        formatter = new google.visualization.NumberFormat({pattern: '#,###.##'} );
        for(i=1; i < data.getNumberOfColumns(); i++)
        {
            if(data !== null)
            {
                formatter.format(data, i);
            }
        }

        // instantiate and draw chart using prepared data
        chart = new google.visualization.ComboChart(document.getElementById(divID));
        chart.draw(data, options);
        return 0;
    }
    else
    {
        return -1;
    }
}

// Authors: Josh Crafts, Arun Kumar, Berty Ruan
// Date Created: 3/27/2015
// Last Modified: 4/25/2015 by Berty Ruan
// Description: Takes stat data from multiple countries and generates a graph
// using data from multiple countries combined
// PRE: divID is a div in the graphing section, GenerateCombinedData function is defined
// POST: generates a single Google LineChart on divID for all regions on g_DataList
function GraphCombined(divID) {
    var data = GenerateCombinedData(),
        options = {
        seriesType: "line",
        legend: {position: 'top'},
        vAxis: {
            viewWindowMode:'explicit',
            viewWindow: {min:0}
        },
        hAxis: {title: 'Year', format: '####'},
        backgroundColor: '#EAE7C2',
        tooltip: {trigger: 'both'}
    },
    num,
    formatter,
    chart,
    i;
	
	num = [];
	
	//console.log(num);
	formatter = new google.visualization.NumberFormat({pattern: '#,###.##'});
	for(i=1; i<data.getNumberOfColumns(); i++)
	{
		formatter.format(data, i);
	}
	
	
    // instantiate and draw chart using prepared data
    chart = new google.visualization.LineChart(document.getElementById(divID));
    chart.draw(data, options);
}

// Author: Arun Kumar, Berty Ruan
// Date Created: 4/14/2015
// Last Modified: 4/25/2015 by Berty Ruan
// Description: Takes stat data from multiple countries and generates a graph for vaccinations
// creating bars with mass vaccinations and line graphs with periodic vaccinations
// PRE: divID is a div in the graphing section, node is a valid t_AsdsNode containing data for a country or 
//      a sum of countries, GenerateVaccineData function is defined
// POST: generates a single Google ComboChart for the given node's vaccination data on the divID 
//       SIA data is shown in bars, whereas MCV1 and MCV2 data is shown in lines.
function GraphVaccine(divID, node) {
    var data = GenerateVaccineData(node.data),
        options = {
        title: node.name,
        vAxis: {
            viewWindowMode:'explicit',
            viewWindow: {
                min: 0,
                max: 1
            },
            format: '###%'
        },
        hAxis: {title: 'Year', format: '####'},
        backgroundColor: '#EAE7C2',
        seriesType: "bars",
        series: {
            0: {type: "line"}, 1: {type: "line"}
        },
        tooltip: {trigger: 'both'}
    },
    formatter,
    chart,
    i;
	
    formatter = new google.visualization.NumberFormat({pattern: '##.##%'});
    for(i=1; i<data.getNumberOfColumns(); i++)
    {
        formatter.format(data,i);
    }
	
    chart = new google.visualization.ComboChart(document.getElementById(divID));
    chart.draw(data, options);
}

// Author: Vanajam Soni, Berty Ruan
// Date Created: 4/16/2015
// Last Modified: 4/25/2015 by Berty Ruan
// Description: Checks for missing data and returns null, if data is missing.
// PRE: data is an integer or float, missing data is represented as -1
// POST: FCTVAL == data if data is not -1, null otherwise
function FixMissingData(data)
{
    if(data >= 0)
    {
        return data;
    }
    else
    {
        return null;
    }
}

// Author: Vanajam Soni, Joshua Crafts, Berty Ruan
// Date Created: 4/7/2015
// Last Modified: 4/25/2015 by Berty Ruan 
// Description: Prepares Data given for a single country (taken as argument) into data table, for the global statID, 
//              Also depends on graph type for bounded or unbounded data
// PRE: data is a 2d array, containing all data for one country, or a sum of countries,
//      g_ParsedStatList exists and contains valid data
// POST: FCTVAL == data table containing data from the year g_YearStart to g_YearEnd, for the given country's data
//       so that we can graph
function GenerateSingleData(data)
{
    // type = 0 => unbounded or only has 1 bound
    // type = 1 => both bounds exist
    var type = 0,
        dataAvailable = 0,
        dataTable = new google.visualization.DataTable(),
        lowerBoundID,
        upperBoundID,
        i,
        statIDNum,
        lowerBoundNum,
        lower; // data table to be returned
    
    dataTable.addColumn('number','year');
    dataTable.addColumn('number', g_StatList[g_StatID]);

    // get the bound stats from parsed stat list
    lowerBoundID = -1;
    upperBoundID = -1;

    for(i=0;i<g_ParsedStatList[1].length;i++)
    {
        if(g_StatID === g_ParsedStatList[1][i])
        {
            lowerBoundID = g_ParsedStatList[2][i];
            upperBoundID = g_ParsedStatList[3][i];   
        }
    }

    // if both bounds exist, add columns for those
    if(lowerBoundID !== -1 && upperBoundID !== -1)
    {
        dataTable.addColumn('number', 'lower bound space'); // area under lower bound
        dataTable.addColumn('number', 'lower bound of confidence interval'); // additional line to outline confidence interval
        dataTable.addColumn('number', 'size of confidence interval'); // area between upper bound and lower bound
        dataTable.addColumn('number', 'upper bound of confidence interval'); // additional line to generate accurate upper bound tooltip, ow it would show size of confidence interval
        type = 1;
    }    

    // add data to table from start year to end year
    for(i=g_YearStart-g_FirstYear;i<g_YearEnd-g_FirstYear+1;i++)
    {   

        //format numbers 
        statIDNum = FixMissingData(Number(data[g_StatID][i])); // FixMissingData(parseFloat((data[g_StatID][i]).toString));//FixMissingData(parseFloat(Math.ceil())); //null or int

        switch(type) 
        {
            case 0: // unbounded
                if(dataAvailable === 0 && statIDNum !== null)
                {
                    dataAvailable = 1;
                }
                dataTable.addRow([g_FirstYear+i, statIDNum]);
                break;

            case 1: // bounded
                lowerBoundNum = FixMissingData(Number(data[lowerBoundID][i]));
                
                if(dataAvailable === 0 && statIDNum !== null)
                {
                    dataAvailable = 1;
                }
                if (lowerBoundNum === null) // replace -1 with 0 when subtracting lower from upper for size of confidence interval
                {
                    lower = 0;
                }
                else
                {
                    lower = lowerBoundNum;
                }

                dataTable.addRow([g_FirstYear+i,statIDNum,lowerBoundNum,lowerBoundNum,
                    FixMissingData(Number(data[upperBoundID][i])-lower),FixMissingData(Number(data[upperBoundID][i]))]);
                break;
        }
    }

    if(dataAvailable === 1)
    {
        return dataTable;
    }
    else
    {
        return null;
    }
}


// Author: Joshua Crafts
// Date Created: 3/27/2015
// Last Modified: 3/27/2015 by Joshua Crafts
// Description: Prepares data in terms of the data type needed by graphing api
// PRE: g_DataList > 0, 
//      g_ParsedStatList exists and contains valid data.
// POST: FCTVAL == data table containing data from the year g_YearStart to g_YearEnd, for all countries on the 
//       g_DataList, so that we can graph all data on one graph
function GenerateCombinedData()
{
    // create array with indices for all years plus a header row
    var currentNode,
        i, j,
        dataTable = new google.visualization.DataTable(),
        type = 0,
        row;
    
    dataTable.addColumn('number','Year');
    
    currentNode = g_DataList.start;
    for (i = 0; i < g_DataList.size; i++)
    {
        dataTable.addColumn('number', currentNode.name);
        currentNode = currentNode.next;
    }

    for(i=0;i<g_ParsedStatList[1].length;i++)
    {
        if(g_StatID === g_ParsedStatList[1][i] && (g_ParsedStatList[2][i] !== -1 || g_ParsedStatList[2][i] !== -1))
        {
            type = 1;  
        }
    } 

    // filling the data table, iterate through each node, then through each year
    for(i=g_YearStart-g_FirstYear;i<g_YearEnd-g_FirstYear+1;i++)
    {   
        row = new Array(g_DataList.size + 1);
        row[0] = g_FirstYear+i;
        currentNode = g_DataList.start;
        for (j = 0; j < g_DataList.size; j++)
        {
            row[j+1] = FixMissingData(Number(currentNode.data[g_StatID][i]));
            currentNode = currentNode.next;
        }
        dataTable.addRow(row);
    }
    return dataTable;
}

// Author: Vanajam Soni
// Date Created: 4/7/2015
// Last Modified: 4/13/2015 by Vanajam Soni
// Description: Generates an ASDS node with all data summed over selected regions
// PRE: g_DataList.size > 0, 
//      g_ParsedStatList, g_YearEnd and g_FirstYear exist and contain correct data
// POST: FCTVAL == t_AsdsNode with cid = -1, cc2 = "SUM", 
//       name = comma separated names of all countries in g_DataList,
//       data = sum of all data of the countries in g_DataList
function GenerateSumNode(){
    
    var data = new Array(g_StatList.length),
        names = "",
        i,j,
        currentNode = g_DataList.start,
        ass1ID = -1,
        ass2ID = -1,
        newNode;

    // get the associated stats from parsed stat list
    for(i=0;i<g_ParsedStatList[1].length;i++)
    {
        if(g_StatID === g_ParsedStatList[1][i])
        {
            ass1ID = g_ParsedStatList[2][i];
            ass2ID = g_ParsedStatList[3][i];   
        }
    }
    // create arrays for necessary data 
    data[g_StatID] = new Array(g_YearEnd-g_FirstYear+1);
    if (ass1ID > -1)
    {
        data[ass1ID] = new Array(g_YearEnd-g_FirstYear+1);
    }
    if (ass2ID > -1)
    {
        data[ass2ID] = new Array(g_YearEnd-g_FirstYear+1);
    }

    // initialize arrays to 0
    for (j = 0; j < g_YearEnd-g_FirstYear+1; j++)
    {
        data[g_StatID][j] = -1;
        if (ass1ID > -1)
        {
            data[ass1ID][j] = -1;
        }
        if (ass2ID > -1)
        {
            data[ass2ID][j] = -1;
        }
    }

    // add and store data for whole list
    for (i = 0; i < g_DataList.size; i++)
    {
        for (j = g_YearStart-g_FirstYear; j < g_YearEnd-g_FirstYear+1; j++)
        {
            if (Number(currentNode.data[g_StatID][j]) > 0)
            {
                if (data[g_StatID][j] === -1 && Number(currentNode.data[g_StatID][j]) !== -1)
                {
                    data[g_StatID][j] = Number(currentNode.data[g_StatID][j]);
                }
                else if (Number(currentNode.data[g_StatID][j]) !== -1)
                {
                    data[g_StatID][j] += Number(currentNode.data[g_StatID][j]);
                }
            }
            if (ass1ID > -1 && Number(currentNode.data[ass1ID][j]) > 0)
            {
                if (data[ass1ID][j] === -1 && Number(currentNode.data[ass1ID][j]) !== -1)
                {
                    data[ass1ID][j] = Number(currentNode.data[ass1ID][j]);
                }
                else if (Number(currentNode.data[ass1ID][j]) !== -1)
                {
                    data[ass1ID][j] += Number(currentNode.data[ass1ID][j]);
                }
            }
            if (ass2ID > -1 && Number(currentNode.data[ass2ID][j]) > 0)
            {
                if (data[ass2ID][j] === -1 && Number(currentNode.data[ass2ID][j]) !== -1)
                {
                    data[ass2ID][j] = Number(currentNode.data[ass2ID][j]);
                }
                else if (Number(currentNode.data[ass2ID][j]) !== -1)
                {
                    data[ass2ID][j] += Number(currentNode.data[ass2ID][j]);
                }
            }
        }
        names += currentNode.name; // add name of current node to list of names
        if (currentNode !== g_DataList.end)
        {
            names += "; ";
        }
        currentNode = currentNode.next;
    }
    // divide by size of list to maintain percentages if vaccines
    if (g_StatList[g_StatID].indexOf("VACC") > -1)
    {
        for (j = g_YearStart-g_FirstYear; j < g_YearEnd-g_FirstYear+1; j++)
        {
            data[g_StatID][j] = data[g_StatID][j] / g_DataList.size;
            data[ass1ID][j] = data[ass1ID][j] / g_DataList.size;
            data[ass2ID][j] = data[ass2ID][j] / g_DataList.size;
        }
    }
    
    newNode = new t_AsdsNode(-1, "SUM", names, data);

    return newNode;
}


// Author: Vanajam Soni, Berty Ruan
// Date Created: 4/7/2015
// Last Modified: 4/25/2015 by Berty Ruan
// Description: Prepares data for vaccination stats, for a given country
//              Takes data of the country as input.
// PRE: data is a 2d array, containing all data for one country, or a sum of countries,
//      g_ParsedStatList exists
// POST: FCTVAL == data table containing vaccination data from the year g_YearStart to g_YearEnd, in the right format
//       so that we can graph it. 
function GenerateVaccineData(data)
{
    var dataTable = new google.visualization.DataTable(),
        mcv1ID,
        mcv2ID,
        siaID,
        i,
        firstNum,
        secondNum,
        thirdNum;
    dataTable.addColumn('number','year');
    dataTable.addColumn('number', 'MCV1');
    dataTable.addColumn('number', 'MCV2');
    dataTable.addColumn('number', 'SIA');

    // get associated stat ids
    siaID = g_StatID;

    for(i=0;i<g_ParsedStatList[1].length;i++)
    {
        if(g_StatID === g_ParsedStatList[1][i])
        {
            mcv1ID = g_ParsedStatList[2][i];
            mcv2ID = g_ParsedStatList[3][i];   
        }
    }

    // add data to table
    for(i=g_YearStart-g_FirstYear;i<g_YearEnd-g_FirstYear+1;i++)
    {
        firstNum  = parseFloat((data[mcv1ID][i]  * 1).toFixed(4));
        secondNum = parseFloat((data[mcv2ID][i] * 1).toFixed(4));
        thirdNum  = parseFloat((data[siaID][i]  * 1).toFixed(4));

        dataTable.addRow([1980+i, firstNum, secondNum, thirdNum]);
    }
    
    return dataTable;   
}

// Author: Joshua Crafts
// Date Created: 4/7/2015
// Last Modified: 4/13/2015 by Vanajam Soni
// Description: Finds and returns maximum value of a stat for the entire list
// PRE: g_DataList.size > 0, 
//      g_ParsedStatList, g_YearFirst, g_FirstYear and g_YearEnd exist and contain correct data
// POST: FCTVAL == maximum value of the selected stat for the entire list
function FindMax()
{
    var max = Number.MIN_VALUE,
        currentNode = g_DataList.start,
        assID,
        ass2ID,
        i, j;

    // get associated stat ids
    for(i=0;i<g_ParsedStatList[1].length;i++)
    {
        if(g_StatID === g_ParsedStatList[1][i])
        {
            ass1ID = g_ParsedStatList[2][i];
            ass2ID = g_ParsedStatList[3][i];   
        }
    }

    // find max value of needed data set
    for (i = 0; i < g_DataList.size; i++)
    {
        for (j = g_YearStart-g_FirstYear; j < g_YearEnd-g_FirstYear + 1;j++)
        {
            if (Number(currentNode.data[g_StatID][j]) > max)
            {
                max = Number(currentNode.data[g_StatID][j]);
            }
            if (ass1ID !== -1 && Number(currentNode.data[ass1ID][j]) > max)
            {
                max = Number(currentNode.data[ass1ID][j]);
            }
            if (ass2ID !== -1 && Number(currentNode.data[ass2ID][j]) > max)
            {
                max = Number(currentNode.data[ass2ID][j]);
            }
        }
        currentNode = currentNode.next;
    }
    
    if (max < 0 || max === undefined || max === Number.MIN_VALUE)
    {
        return -1;
    }

    return max;   
}


// File Name:               dynamic_markup.js
// Description:             This module contains the code needed to dynamically create modules on the client
// Date Created:            3/26/2015
// Contributors:            Paul Jang, Nicholas Denaro, Emma Roudabush
// Date Last Modified:      4/20/2015
// Last Modified By:        Paul Jang
// Dependencies:            index.html, lookup_table.js, data.js
// Additional Notes:        N/A

// Author: Paul Jang, Nicholas Denaro
// Date Created: 3/26/2015
// Last Modified: 4/14/2015 by Nicholas Denaro
// Description: Retrieve stat values from the lookup_table,
//              Builds the tabs and inserts them into index.html
// PRE: lookup_table is filled correctly, index.html exists
// POST: index.html contains tabs of the correct stat data from the lookup_table
function BuildTabs()
{
    var i,
        temp,
        div;

    for(i=0;i<g_ParsedStatList[1].length;i++)
    {
        temp=g_StatList[g_ParsedStatList[1][i]];
        div=document.createElement("DIV");
        div.id="id-"+temp;
        div.setAttribute("stat",""+g_ParsedStatList[1][i]);
        div.className="graph-tab";
        div.setAttribute("onclick","ChooseTab(this)");
        div.innerHTML=temp;
        if (temp.indexOf("VACC") > -1)
	{
            div.innerHTML="Vaccinations";
	}
        document.getElementById("tabsDiv").appendChild(div);

        BuildDiv(temp);

        if(g_ParsedStatList[1][i]===g_StatID)
        {
            document.getElementById("id-"+temp+"-graphs").style.display="block";
            div.className="graph-tab selected-tab";
        }
    }
}

// Author: Nicholas Denaro
// Date Created: 4/16/2015
// Last Modified: 4/23/2015 by Kyle Nicholson
// Description: Assigns values to the year ranges
// PRE: lookup_table is filled correctly, index.html exists
// POST: appropriate input tags are modified and g_TempSettings array is initialized
function UpdateInputs()
{
    var startDiv=document.getElementById("year-range-start"),
        endDiv=document.getElementById("year-range-end"),
        heatmapYearDiv=document.getElementById("heatmap-year");
	
	// set min and max for the settings input boxes
    startDiv.max=g_LastYear;
    startDiv.min=g_FirstYear;	
	
    endDiv.max=g_LastYear;
    endDiv.min=g_FirstYear;

    heatmapYearDiv.max=g_LastYear;
    heatmapYearDiv.min=g_FirstYear;
    
    // initialize TempSettings array
    g_TempSettings[0]=g_FirstYear;
    g_TempSettings[1]=g_LastYear;   
    g_TempSettings[2]=g_LastYear;
    g_TempSettings[3]=0;
    g_TempSettings[4]=1;
}

// Author: Paul Jang, Nicholas Denaro
// Date Created: 3/26/2015
// Last Modified: 3/26/2015 by Paul Jang
// Description: build divs where the graphs go in index.html
// PRE: Called from BuildTabs
// POST: appropriate divs are created
function BuildDiv(stat)
{
    var div=document.createElement("DIV");
    div.id="id-"+stat+"-graphs";
    div.style.display="none";
    div.style.top="8%";
    div.style.height="87%";
    div.className="graph";
    document.getElementById("graphs").appendChild(div);
}

// Author: Paul Jang, Nicholas Denaro
// Date Created: 3/26/2015
// Last Modified: 4/14/2015 by Nicholas Denaro
// Description: build divs where the graphs go in index.html
// PRE: Called from the onclick of a tab
// POST: previous tab is switched out, and now tab is switched in
function ChooseTab(element)
{
    var parentTabDivName,
        prevTab;

    // remove divs in previous tab
    parentTabDivName = "id-"+g_StatList[g_StatID]+"-graphs";
    document.getElementById(parentTabDivName).innerHTML = "";
    prevTab=document.getElementById("id-"+g_StatList[g_StatID]);
    // sets class names of tabs
    prevTab.className="graph-tab";
    element.className="graph-tab selected-tab";
    document.getElementById("id-"+g_StatList[g_StatID]+"-graphs").style.display="none";
    document.getElementById(element.id+"-graphs").style.display="block";
    g_StatID=Number(element.getAttribute("stat"));
    ColorByHMS();

    GenerateSubDivs();
    GenerateGraphs();
}

// Author: Nicholas Denaro
// Date Created: 4/18/2015
// Last Modified: 4/18/2015 by Nicholas Denaro
// Description: Rotates the tabs left or right depending on the direction
// PRE: direction!=0
// POST: The first/last tab is moved to the last/first position
function RotateTabs(direction)
{
    var div,
    tabs=document.getElementById("tabsDiv"),
    children=tabs.childNodes;

    if(direction>0)
    {
        div=children[0];
        tabs.removeChild(div);
        tabs.appendChild(div);
    }
    else
    {
        div=children[children.length-1];
        tabs.removeChild(div);
        tabs.insertBefore(div,children[0]);
    }
}

// Author: Emma Roudabush
// Date Created: 3/5/2015
// Last Modified: 3/31/2015 by Emma Roudabush
// Description: Fades the screen back to the main page
// PRE: N/A
// POST: Screen is switched to the main page
function SwitchToMain ()
{
    $(".loading-screen").fadeOut(750);
}

// Author: Emma Roudabush
// Date Created: 3/30/2015
// Last Modified: 4/23/2015 by Kyle Nicholson
// Description: Opens the settings overlay
// PRE: N/A
// POST: Settings overlay is showing with black backing mask and all stat values are reset
function OpenSettings()
{
     ResetAllStatValues();
	 
     $(".settings-screen, .settings-black").fadeIn(400);
     
}

// Author: Emma Roudabush
// Date Created: 3/5/2015
// Last Modified: 4/23/2015 by Kyle Nicholson
// Description: Closes the settings overlay and assigns global values
// PRE: Settings overlay is currently showing on screen
// POST: Settings overlay and mask is gone
function CloseSettings()
{
    $(".settings-screen, .settings-black").fadeOut(400);
        
    var startDiv=document.getElementById("year-range-start"),
        endDiv=document.getElementById("year-range-end"),
        heatmapYearDiv=document.getElementById("heatmap-year");
     
    startDiv.style["box-shadow"]="";
    endDiv.style["box-shadow"]="";
    heatmapYearDiv.style["box-shadow"]="";
       
    document.getElementById(startDiv.id+"-error").innerHTML="";
    document.getElementById(endDiv.id+"-error").innerHTML="";
    document.getElementById(heatmapYearDiv.id+"-error").innerHTML="";
}

// Author: Emma Roudabush
// Date Created: 3/30/2015
// Last Modified: 3/31/2015 by Emma Roudabush
// Description: Opens the settings overlay
// PRE: N/A
// POST: Settings overlay is showing with black backing mask
function OpenHelp()
{
     $(".help-screen, .help-black").fadeIn(400);
}

// Author: Emma Roudabush
// Date Created: 3/5/2015
// Last Modified: 4/16/2015 by Nicholas Denaro
// Description: Closes the settings overlay and assigns global values
// PRE: Settings overlay is currently showing on screen
// POST: Settings overlay and mask is gone
function CloseHelp()
{
    $(".help-screen, .help-black").fadeOut(400);
}

// Author: Emma Roudabush
// Date Created: 3/5/2015
// Last Modified: 4/20/2015 by Kyle Nicholson
// Description: Expands the c ontrol panel
// PRE: N/A
// POST: Control panel is expanded and black mask is in place behind
function Expand()
{
    $(".control-panel").animate({width:"97.5%"}, 500);
    $("#expand").attr("onclick","Shrink()");
    $("#expand").attr("src","res/arrow_left.png");
    $("#scroll-left").fadeOut(400);
    $("#scroll-right").fadeOut(400);
    $(".expand-black").fadeIn(400);
    setTimeout(function () 
    {
        if(g_DataList !== undefined && g_DataList.size !== 0)
        {
	        GenerateSubDivs();
	        // if single graph, graph is expanded to whole section
	        if(g_GraphType === 1 && g_StatList[g_StatID].indexOf("VACC") === -1 || g_GraphType === 2)
	        {
	            document.getElementById("region-graphs-1").style.width = "100%";
	            document.getElementById("region-graphs-1").style.height = "100%";
	        }
	        g_Expanded = true;
	        GenerateSubDivs();
	        GenerateGraphs();
	    }
    }, 500);
}

// Author: Emma Roudabush
// Date Created: 3/5/2015
// Last Modified: 4/16/2015 by Paul Jang
// Description: Shrinks the control panel
// PRE: Control panel is currently expanded
// POST: Control panel shrinks back to original size and black mask is gone
function Shrink()
{
    $(".control-panel").animate({width:"25%"}, 500);
    $("#expand").attr("onclick","Expand()");
    $("#expand").attr("src","res/arrow_right.png");
    $("#scroll-left").fadeIn(400);
    $("#scroll-right").fadeIn(400);
    $(".expand-black").fadeOut(400);
    setTimeout(function()
    {
        g_Expanded = false;
        while(document.getElementById("tabsDiv").childNodes[0]!==document.getElementById("id-"+g_StatList[g_StatID]))
        {
            RotateTabs(-1);
        }
        GenerateSubDivs();
        GenerateGraphs();
    }, 500);  
}


// Author: Paul Jang
// Date Created: 4/2/2015
// Last Modified: 4/20/2015 by Kyle Nicholson
// Description: Calls CreateDiv to dynamically generate subgraph divs and generate graphs
// PRE: CreateDiv functions correctly, g_DataList is properly full
// POST: Divs are created based on how many countries are selected,
//       Correct graphs are filled in the appropriate divs
function GenerateSubDivs()
{
    var size,
        i,
        parentTabDivName,
        currentNumDivs,
        children,
        newNumDivs;

    // only if there are countries in the data list
    if(g_DataList !== undefined)
    {
        size = g_DataList.size;
        parentTabDivName = "id-"+g_StatList[g_StatID]+"-graphs";
        currentNumDivs = document.getElementById(parentTabDivName).childNodes.length;
        children = document.getElementById(parentTabDivName).childNodes;
        newNumDivs = size - currentNumDivs;
        // if we only need one graph for either combined lines or summation of lines
        if(g_GraphType === 1 && g_StatList[g_StatID].indexOf("VACC") === -1 || g_GraphType === 2)
        {
            document.getElementById(parentTabDivName).innerHTML = "";
            if(size !== 0)
            {
            	CreateSubDiv("region-graphs-1",parentTabDivName);
	    }
            // if the graph section is expanded
            if(g_Expanded)
            {
                // expand graph
                document.getElementById("region-graphs-1").style.width = "100%";
                document.getElementById("region-graphs-1").style.height = "100%";    
            }
        }
        else
        {
            document.getElementById(parentTabDivName).innerHTML = "";
            for(i = 1; i<=size; i++)
            {
                CreateSubDiv("region-graphs-"+i,parentTabDivName);
            }
            while (g_DataList.size < currentNumDivs)
            {
                $("#region-graphs-"+currentNumDivs).remove();
                currentNumDivs--;
            }
            while (g_DataList.size > currentNumDivs)
            {
                CreateSubDiv("region-graphs-"+(currentNumDivs+1), parentTabDivName);
                currentNumDivs++;
            }
        }
    }
}

// Author: Paul Jang
// Date Created: 4/2/2015
// Last Modified: 4/20/2015 by Paul Jang
// Description: Creates a single div with an inputted id and
//              appends it to the specified parent div
// PRE: Parent div exists
// POST: Single div is appended to the parent div
function CreateSubDiv(id,parent)
{
    var elem = document.createElement('div'),
        divs,
        i;
    elem.id = id;
    elem.className = "subgraph";
    divs=document.getElementsByTagName("div");

    for(i in divs)
    {
        if(divs[i].className==="control-panel")
        {
            elem.style="max-width: "+divs[i].clientWidth+"px;";
        }
    }
    document.getElementById(parent).appendChild(elem);
    
    if(!g_Expanded)
    {
        document.getElementById(elem.id).style.width = "100%";
    }
    else
    {
        document.getElementById(elem.id).style.width = "50%";
    }

    document.getElementById(elem.id).style.height = "50%";

    if(g_GraphType !== 1 && g_GraphType !== 2 && g_Expanded || 
        g_StatList[g_StatID].indexOf("VACC") !== -1 && g_GraphType !== 2 && g_Expanded)
    {
        $(elem).click(function() {
            if(document.getElementById(id).style.width !== "100%")
            {
            
                document.getElementById(elem.id).style.width = "100%";
                document.getElementById(elem.id).style.height = "100%";
            }
            else
            {
                document.getElementById(elem.id).style.width = "50%";
                document.getElementById(elem.id).style.height = "50%";
            }
            GenerateGraphs();
        });
    }
}

// Author: Joshua Crafts
// Date Created: 4/17/2015
// Last Modified: 4/17/2015 by Joshua Crafts
// Description: Pops up team info
// PRE: none
// POST: Alert box pops up with info about project contributors
function teamPopup()
{
    window.alert("Stateware Team\nSpring 2015:\nWilliam Bittner," + 
        " Joshua Crafts, Nicholas Denaro, Dylan Fetch, Paul Jang," + 
        " Arun Kumar, Drew Lopreiato, Kyle Nicholson, Emma " + "Roudabush, Berty Ruan, Vanajam Soni");
}

// Author: Joshua Crafts
// Date Created: 4/17/2015
// Last Modified: 4/17/2015 by Joshua Crafts
// Description: Pops up info on reporting a bug
// PRE: none
// POST: Alert box pops up with info about and instructions for 
//       reporting a bug
function bugPopup()
{
    window.alert("If you would like to report a bug, please send " + "an email to stateware@acm.psu.edu with the following " + 
        "details included in your message:\n1. Description of the " + "bug\n2. Steps for reproducing the bug\n3. What browser and" + 
        " operating system you experienced the bug on\n4. Any " + "additional relevant information.");
}
