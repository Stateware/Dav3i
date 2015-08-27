/*! Dav3i - v0.1.0 - 2015-08-27
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
    {									//  and prepend it to list
        if (g_Data[selectedRegions[i]] !== undefined && g_Data[selectedRegions[i]][g_StatId] !== undefined)
        {
            node = new t_AsdsNode(selectedRegions[i],
                                  g_Countries[selectedRegions[i]],
                                  g_Data[selectedRegions[i]]);
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
var g_Data;      				// CID, CC2, name, and HMS lookup table
var g_Countries;				// number of countries for which data exists
var g_Stats;      	   			// stat reference list, indexed by stat ID
var g_SelectedIndex = 0;
var g_Diseases;
var g_FirstYear;        			// first year for which data is available
var g_LastYear;         			// last year for which data is available
var g_YearStart;        			// first year for which user wants data
var g_YearEnd;          			// last year for which user wants data
var g_DataList;         			// data list for use in graphing
var g_StatId;           			// stat ID corresponding to selected HMS.
var g_HmsYear;          			// year for which HMS data is wanted
var g_GraphType = 0;        			// represents the graph type, enumerated 0 to 2
var g_Clear = false;				// used by the clear selection function to avoid rebuilding data list on each deselect
var g_Expanded = false; 			// used to determine whether or not the graph section is expanded
var g_IntHms = 0;				// used to determine which vaccination stat to use when heat mapping
var g_TempSettings = new Array(5);  		// indicies are "first year, last year, heat map year, graph type, int heat map"
var g_Map;					// number of countries for which data is loaded

// prototype (constructor) for ASDS node
function t_AsdsNode(cc2, name, data)
// PRE:  0 <= cid <= g_NumCountries, cc2 is a 2 alpha character code corresponding to the country whose country id is cid,
//       name is the name of that country, and data is a 2D array of length (g_LastYear-g_FirstYear)+1, and depth g_StatList.length,
//       which contains the data points from g_FirstYear to g_LastYear for all stats (enumerated 0 to g_StatList.length-1)
// POST: FCTVAL == new ASDS node with the specified values for its data members, whose next pointer points to null
{
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

ColorByHMS = function(){
// PRE:  g_LookupTable is initialized
// POST: map is recolored in terms of the currently selected stat (based on g_VaccHMS if
//       stat is vaccinations), where tint of a country is based on the magnitude of its
//       selected stat value 
    var data = {},				// object indexed by CC2 to attach data to
						//  vector objects
	data_set,
	temp,
        tempValue,
        min,					// minimum data value from HMS data
        max,					// maximum data value from HMS data
        i, j;					// indexing variable

    min = Number.MAX_VALUE;
    max = Number.MIN_VALUE;

    for (i in g_Map.regions) {
        if (g_Data[i] !== undefined)
        {
            temp = g_Data[i][g_StatId]['data'];
            for (j in temp)
            {
                if (temp[j]['index'] === g_SelectedIndex)
		{
			data_set = temp[j]['values'];
		}
            }
            if (g_Data[i][g_StatId]['type'] === 'lin' || g_Data[i][g_StatId]['type'] === 'bar')
            {
                if (data_set['y_' + g_HmsYear] !== '-1')
                {
                    tempValue = data_set['y_' + g_HmsYear];
                    if (tempValue != undefined)
                    {
                        data[i] = tempValue;
                    }
                }
            }
            else if (g_Data[i][g_StatId]['type'] === 'est')
            {
                if (data_set[1]['y_' + g_HmsYear] !== '-1')
                {
                    tempValue = data_set[1]['y_' + g_HmsYear];
                    if (tempValue != undefined)
                    {
                        data[i] = tempValue;
                    }
                }
            }
            else // temp.type === 'int'
            {
                if (data_set[g_IntHms]['values']['y_' + g_HmsYear] !== '-1')
                {
                    tempValue = data_set[g_IntHms]['values']['y_' + g_HmsYear];
                    if (tempValue != undefined)
                    {
                        data[i] = tempValue;
                    }
                }
            }
            if (data[i] !== undefined)
            {
                if (Number(data[i]) < min)
                {
                    min = data[i];
                }
                if (Number(data[i]) > max)
                {
                    max = data[i];
                }
            }
        }
    }

    // set data series
    g_Map.series.regions[0].params.min = min;
    g_Map.series.regions[0].params.max = max;
    g_Map.reset();
    if (Object.keys(data).length > 0)
    {
        g_Map.series.regions[0].setValues(data);
    }
}

// Author: Emma Roudabush, Joshua Crafts
// Date Created: 3/5/2015
// Last Modified: 4/16/2015 by Nicholas Denaro
// Description: Fills g_DescriptorJSON with the contents of descriptor.php,
//              fills g_LookupTable and g_StatList with their corresponding data
//              and logs the resulting variables to the console.
// PRE: DescriptorJSON, g_StatList, and g_LookupTable exist,
//      GenerateLookupTable and GenerateStatReferenceList function correctly
// POST: DescriptorJSON, g_StatList, g_LookupTable contain their correct data.
function ParseData()
{
    var DataJSON,
	key;			// text returned from descriptor.php call

    $.when(GetData()).done(function(DataJSON){
        SetInitalYears(DataJSON);			// set year range
        g_Data = DataJSON.country_data;			// get region data from server
	g_Stats = DataJSON.stats;
	g_Countries = DataJSON.countries;
	g_Diseases = DataJSON.diseases;
        g_StatId = Object.keys(g_Stats)[0];
        g_HmsYear = g_LastYear;				// set init HMS year to end of data
        ColorByHMS();					// color map
        BuildTabs();					// build tab menu
        UpdateInputs();					// set init values for settings inputs
	SwitchToMain();
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
function GetData()
{
    return $.ajax({                                      
        url: "API/get_data.php",
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
function SetInitalYears(DataJSON)
{
	g_FirstYear = Number(DataJSON.firstYear);
	g_YearStart = Number(DataJSON.firstYear);
	g_LastYear = Number(DataJSON.lastYear);
	g_YearEnd = Number(DataJSON.lastYear);
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

function SelectIndex(choice)
{
    g_SelectedIndex = Number(choice.value);
}

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
	console.log(g_ParsedStatList);
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
function SetIntHms(newIntHms)
{
    g_IntHms = newIntHms;
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
    		document.getElementById("int0").checked = true;
    		break;
    	case 1:
    		document.getElementById("int1").checked = true;
    		break;
    	case 2:
    		document.getElementById("int2").checked = true;
    		break;
    }
    
    // set the global settings stats
    g_YearStart = g_TempSettings[0];
    g_YearEnd = g_TempSettings[1];
    g_HmsYear = g_TempSettings[2];
    g_GraphType = g_TempSettings[3]; 
    g_IntHMS = g_TempSettings[4];	
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
    g_TempSettings[4] = g_IntHms;	
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
        g_HmsYear=heatmapYearDiv.value;

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
            cur = g_DataList.start;
            if (g_Stats[g_StatId]['type'] !== 'int')
            {
	        switch(g_GraphType)
	        {
	            case 0:    
                        max = FindMax();
	                for(i=1; i<=g_DataList.size; i++)
	                {
	                    if(GraphRegional("region-graphs-"+i, cur, max) === -1)
                            {
                                element = document.getElementById("region-graphs-"+i);
                                element.parentNode.removeChild(element);
                            }
	                    cur=cur.next;
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
            else
            {
	        switch(g_GraphType)
	        {
	            case 0:    
                        max = FindMax();
	                for(i=1; i<=g_DataList.size; i++)
	                {
	                    if(GraphIntegrated("region-graphs-"+i, cur, max) === -1)
                            {
                                element = document.getElementById("region-graphs-"+i);
                                element.parentNode.removeChild(element);
                            }
	                    cur=cur.next;
	                }
	                break;
	            case 1:
	                for(i=1; i<=g_DataList.size; i++)
	                {
	                    if(GraphIntegrated("region-graphs-"+i, cur, max) === -1)
                            {
                                element = document.getElementById("region-graphs-"+i);
                                element.parentNode.removeChild(element);
                            }
	                    cur=cur.next;
	                }
	                break;
	            case 2:
	                sumNode = GenerateSumNode();
	                GraphIntegrated("region-graphs-"+1, sumNode);
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
    var data = GenerateSingleData(node['data'][g_StatId]['data']),
        options = {
            title: node.name,
            seriesType: "line",
            legend: 'none',
            vAxis: {
                viewWindowMode:'explicit',
                viewWindow: {min: 0, max: maxVal}
            },
            hAxis: {title: 'Year', format: '####'},
            series: {0: {color: "white" }, 1: {type: "area", color: "transparent"}, 2: {color: "navy"}, 3: {type: "area", color: "navy"}},
            isStacked: true,
            backgroundColor: '#EAE7C2',
            tooltip: {trigger: 'both'}
        },
    formatter,
    chart,
    i;

    if (g_Stats[g_StatId]['type'] !== 'est')
    {
        options['series'][0]['color'] = "navy";
    }
    	
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
function GraphIntegrated(divID, node, maxVal) {
    var data = GenerateSingleData(node['data'][g_StatId]['data']),
        dataSeries = {0: {type: "bar"}, 1: {type: "bar"}, 2: {type: "bar"}},
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
            tooltip: {trigger: 'both'}
        },
        formatter,
        chart,
        i;

    if (maxVal > 1)
    {
        options['vAxis']['viewWindow']['max'] = maxVal;
    }

    for (i = 0; i < g_Stats[g_StatId]['subType'].length; i++)
    {
        if (g_Stats[g_StatId]['subType'][i] === 'lin')
        {
             dataSeries[i]['type'] = 'line'; 
        }
    }

    options['series'] = dataSeries;
	
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
    if(data != -1)
    {
        return data;
    }
    else
    {
        return null;
    }
}

function GetYears(values)
{
    var years = [],
        re = new RegExp("y_(\\d+)");

    for (i in values)
    {
        if (i !== 'country_id' && i !== 'data_set_index')
        {
            year = re.exec(i);
            years.push(Number(year[1]));
        }
    }

    return years;
}

function GetValues(values)
{
    var row = [];

    for (i in values)
    {
        if (i !== 'country_id' && i !== 'data_set_index')
        {
            row.push(FixMissingData(Number(values[i])));
        }
    }

    return row;
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
    var dataTable = new google.visualization.DataTable(),
        i,
        temp = new Array(4);

    if (g_Stats[g_StatId]['type'] === 'est')
    {
        temp[0] = GetYears(data[g_SelectedIndex]['values'][0]);
        temp[1] = GetValues(data[g_SelectedIndex]['values'][0]);
        temp[2] = GetValues(data[g_SelectedIndex]['values'][1]);
        temp[3] = GetValues(data[g_SelectedIndex]['values'][2]);
        dataTable.addColumn('number','year');
        dataTable.addColumn('number', g_Stats[g_StatId]['subName'][1]);
        dataTable.addColumn('number', 'lower bound space'); // area under lower bound
        dataTable.addColumn('number', g_Stats[g_StatId]['subName'][2]); // additional line to outline confidence interval
        dataTable.addColumn('number', 'size of confidence interval'); // area between upper bound and lower bound
        dataTable.addColumn('number', g_Stats[g_StatId]['subName'][0]); // additional line to generate accurate upper bound tooltip, ow it would show size of confidence interval
        for (i = 0; i < temp[0].length; i++)
        {
            dataTable.addRow([temp[0][i],temp[2][i],temp[3][i],
                    temp[3][i],temp[1][i] - temp[3][i], temp[1][i]]);
        }
        
    }
    else if (g_Stats[g_StatId]['type'] === 'int')
    {
        temp[0] = GetYears(data[g_SelectedIndex]['values'][0]['values']);
        temp[1] = GetValues(data[g_SelectedIndex]['values'][0]['values']);
        temp[2] = GetValues(data[g_SelectedIndex]['values'][1]['values']);
        temp[3] = GetValues(data[g_SelectedIndex]['values'][2]['values']);
        dataTable.addColumn('number','year');
        dataTable.addColumn('number', g_Stats[g_StatId]['subName'][0]);
        dataTable.addColumn('number', g_Stats[g_StatId]['subName'][1]);
        dataTable.addColumn('number', g_Stats[g_StatId]['subName'][2]);
        for (i = 0; i < temp[0].length; i++)
        {
            dataTable.addRow([temp[0][i],temp[1][i],temp[2][i],temp[3][i]]);
        }
    }
    else
    {
        dataTable.addColumn('number','year');
        dataTable.addColumn('number', g_Stats[g_StatId]['name']);
        temp[0] = GetYears(data[g_SelectedIndex]['values']);
        temp[1] = GetValues(data[g_SelectedIndex]['values']);
        for (i = 0; i < temp[0].length; i++)
        {
            dataTable.addRow([temp[0][i],temp[1][i]]);
        }
    }

    return dataTable;
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
    var dataTable = new google.visualization.DataTable(),
        i, j,
        cur,
        temp = new Array(g_DataList.size + 1),
        row;

    dataTable.addColumn('number','year');
    cur = g_DataList.start;
    for (i = 0; i < g_DataList.size; i++)
    {
        dataTable.addColumn('number', cur.name);
        cur = cur.next;
    }

    cur = g_DataList.start;
    if (g_Stats[g_StatId]['type'] === 'est')
    {
        temp[0] = GetYears(cur['data'][g_StatId]['data'][g_SelectedIndex]['values'][1]);
        for (i = 0; i < g_DataList.size; i++)
        {
            temp[i + 1] = GetValues(cur['data'][g_StatId]['data'][g_SelectedIndex]['values'][1]);
            cur = cur.next;
        }
    }
    else
    {
        temp[0] = GetYears(cur['data'][g_StatId]['data'][g_SelectedIndex]['values']);
        for (i = 0; i < g_DataList.size; i++)
        {
            temp[i + 1] = GetValues(cur['data'][g_StatId]['data'][g_SelectedIndex]['values']);
            cur = cur.next;
        }
    }

    for (i = 0; i < temp[0].length; i++)
    {
        row = [];
        for (j = 0; j < temp.length; j++)
        {
            row.push(temp[j][i]);
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
function GenerateSumNode()
{
    var clone,
        data,
        cur,
        i, j,
        name = "",
        temp;

    cur = g_DataList.start;
    // MUST clone initial object or you will modify country's data when summing
    clone = jQuery.extend(true, {}, g_Data[cur.cc2]);
    data = clone[g_StatId]['data'];
    name += cur.name;
    cur = cur.next;
    for (i = 1; i < g_DataList.size; i++)
    {
        name += ", " + cur.name;
        if (g_Stats[g_StatId]['type'] === 'est')
        {
            for (j = g_Data[cur.cc2][g_StatId]['firstYear']; j <= g_Data[cur.cc2][g_StatId]['lastYear']; j++)
            {
		data[g_SelectedIndex]['values'][0]['y_' + j] = Number(data[g_SelectedIndex]['values'][0]['y_' + j]);
                if (Number(g_Data[cur.cc2][g_StatId]['data'][g_SelectedIndex]['values'][0]['y_' + j]) != -1)
                {
                    data[g_SelectedIndex]['values'][0]['y_' + j] += Number(g_Data[cur.cc2][g_StatId]['data'][g_SelectedIndex]['values'][0]['y_' + j]);
                }
		data[g_SelectedIndex]['values'][1]['y_' + j] = Number(data[g_SelectedIndex]['values'][1]['y_' + j]);
                if (Number(g_Data[cur.cc2][g_StatId]['data'][g_SelectedIndex]['values'][1]['y_' + j]) != -1)
                {
                    data[g_SelectedIndex]['values'][1]['y_' + j] += Number(g_Data[cur.cc2][g_StatId]['data'][g_SelectedIndex]['values'][1]['y_' + j]);
                }
		data[g_SelectedIndex]['values'][2]['y_' + j] = Number(data[g_SelectedIndex]['values'][2]['y_' + j]);
                if (Number(g_Data[cur.cc2][g_StatId]['data'][g_SelectedIndex]['values'][2]['y_' + j]) != -1)
                {
                    data[g_SelectedIndex]['values'][2]['y_' + j] += Number(g_Data[cur.cc2][g_StatId]['data'][g_SelectedIndex]['values'][2]['y_' + j]);
                }
            }
        }
        else if (g_Stats[g_StatId]['type'] === 'int')
        {
            for (j = g_Data[cur.cc2][g_StatId]['firstYear']; j <= g_Data[cur.cc2][g_StatId]['lastYear']; j++)
            {
		data[g_SelectedIndex]['values'][0]['values']['y_' + j] = Number(data[g_SelectedIndex]['values'][0]['values']['y_' + j]);
                if (Number(g_Data[cur.cc2][g_StatId]['data'][g_SelectedIndex]['values'][0]['values']['y_' + j]) != -1)
                {
                    data[g_SelectedIndex]['values'][0]['values']['y_' + j] += Number(g_Data[cur.cc2][g_StatId]['data'][g_SelectedIndex]['values'][0]['values']['y_' + j]);
                }
		data[g_SelectedIndex]['values'][1]['values']['y_' + j] = Number(data[g_SelectedIndex]['values'][1]['values']['y_' + j]);
                if (Number(g_Data[cur.cc2][g_StatId]['data'][g_SelectedIndex]['values'][1]['values']['y_' + j]) != -1)
                {
                    data[g_SelectedIndex]['values'][1]['values']['y_' + j] += Number(g_Data[cur.cc2][g_StatId]['data'][g_SelectedIndex]['values'][1]['values']['y_' + j]);
                }
                if (data[g_SelectedIndex].length === 3)
                {
		    data[g_SelectedIndex]['values'][2]['values']['y_' + j] = Number(data[g_SelectedIndex]['values'][2]['values']['y_' + j]);
                    if (Number(g_Data[cur.cc2][g_StatId]['data'][g_SelectedIndex]['values'][2]['y_' + j]) != -1)
                    {
                        data[g_SelectedIndex]['values'][2]['values']['y_' + j] += Number(g_Data[cur.cc2][g_StatId]['data'][g_SelectedIndex]['values'][2]['values']['y_' + j]);
                    }
                }
            }
        }
        else
        {
            for (j = g_Data[cur.cc2][g_StatId]['firstYear']; j <= g_Data[cur.cc2][g_StatId]['lastYear']; j++)
            {
		data[g_SelectedIndex]['values']['y_' + j] = Number(data[g_SelectedIndex]['values']['y_' + j]);
                if (Number(g_Data[cur.cc2][g_StatId]['data'][g_SelectedIndex]['values']['y_' + j]) != -1)
                {
                    data[g_SelectedIndex]['values']['y_' + j] += Number(g_Data[cur.cc2][g_StatId]['data'][g_SelectedIndex]['values']['y_' + j]);
                }
            }
        }
        cur = cur.next;
    }

    if (g_Stats[g_StatId]['type'] === 'int')
    {
        for (j = g_Data[g_DataList.start.cc2][g_StatId]['firstYear']; j <= g_Data[g_DataList.start.cc2][g_StatId]['lastYear']; j++)
        {
            data[g_SelectedIndex]['values'][0]['values']['y_' + j] = data[g_SelectedIndex]['values'][0]['values']['y_' + j] / g_DataList.size;
            data[g_SelectedIndex]['values'][1]['values']['y_' + j] = data[g_SelectedIndex]['values'][0]['values']['y_' + j] / g_DataList.size;
            data[g_SelectedIndex]['values'][2]['values']['y_' + j] = data[g_SelectedIndex]['values'][0]['values']['y_' + j] / g_DataList.size;
        }
    }
    
    sumNode = new t_AsdsNode('sum', name, clone);

    return sumNode;
}

function GetMaxFromValueRow(values)
{
    var max = Number.MIN_VALUE,
        re = new RegExp("y_(\\d+)"),
        temp;

    for (i in values)
    {
        if (i !== 'country_id' && i !== 'data_set_index')
        {
            temp = re.exec(i);
            year = Number(temp[1]);
            if (year >= g_YearStart && year <= g_YearEnd && Number(values[i]) > max)
            {
                max = Number(values[i]);
            }
        }
    }

    return max;
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
        cur = g_DataList.start,
        i,
        thisNodeMax;

    // find max value of needed data set
    for (i = 0; i < g_DataList.size; i++)
    {
        // get max of current node for current stat
        if (g_Stats[g_StatId]['type'] === 'est')
        {
            thisNodeMax = Math.max.apply(Math, [GetMaxFromValueRow(cur['data'][g_StatId]['data'][g_SelectedIndex]['values'][0]), GetMaxFromValueRow(cur['data'][g_StatId]['data'][g_SelectedIndex]['values'][1]), GetMaxFromValueRow(cur['data'][g_StatId]['data'][g_SelectedIndex]['values'][2])]);
        }
        else if (g_Stats[g_StatId]['type'] === 'int')
        {
            thisNodeMax = Math.max.apply(Math, [GetMaxFromValueRow(cur['data'][g_StatId]['data'][g_SelectedIndex]['values'][0]['values']),GetMaxFromValueRow(cur['data'][g_StatId]['data'][g_SelectedIndex]['values'][1]['values']),GetMaxFromValueRow(cur['data'][g_StatId]['data'][g_SelectedIndex]['values'][2]['values'])]);
        }
        else
        {
            thisNodeMax = GetMaxFromValueRow(cur['data'][g_StatId]['data'][g_SelectedIndex]['values']);
        }

        if (thisNodeMax > max)
        {
            max = thisNodeMax;
        }
        cur = cur.next;
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

    for(i in g_Stats)
    {
        temp=g_Stats[i]['name'];
        div=document.createElement("DIV");
        div.id="id-"+i;
        div.setAttribute("stat",i);
        div.className="graph-tab";
        div.setAttribute("onclick","ChooseTab(this)");
        div.innerHTML=temp;
        document.getElementById("tabsDiv").appendChild(div);

        BuildDiv(i);

        if(i === g_StatId)
        {
            document.getElementById("id-"+i+"-graphs").style.display="block";
            div.className="graph-tab selected-tab";
        }
    }

    temp='Custom';
    div=document.createElement("DIV");
    div.id="id-custom";
    div.setAttribute("stat",'custom');
    div.className="graph-tab";
    div.setAttribute("onclick","ChooseTab(this)");
    div.innerHTML=temp;
    document.getElementById("tabsDiv").appendChild(div);

    BuildDiv('custom');
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
function BuildDiv(statId)
{
    var div=document.createElement("DIV");
    div.id="id-"+statId+"-graphs";
    div.style.display="none";
    div.style.top="18%";
    div.style.height="77%";
    div.className="graph";
    document.getElementById("graphs").appendChild(BuildDropDown(statId));
    document.getElementById("graphs").appendChild(div);
}

function BuildDropDown(statId)
{
    var div=document.createElement("DIV"),
        menu = "";
    div.id="id-"+statId+"-dropdown";
    div.style.display="none";
    div.style.top="8%";
    div.style.height="10%";
    div.className="graph";

    if (g_StatId === 'custom')
    {
        menu += "<p class='open-sans'>Select Data Set</p><select name='stat1' onchange='SelectIndex(this)'>";
        for (i in g_Stats)
        {
            menu += "<option value='" + i + "'>" + i + " - ";
        }
    }
    else
    {
        menu += "<p class='open-sans'>Select Data Set</p><select name='index' onchange='SelectIndex(this)'>";
        for (i in g_Stats[g_StatId]['tags'])
        {
            menu += "<option value='" + i + "'>" + i + " - ";
            if (g_Stats[g_StatId]['tags'][i] === "")
            {
                menu += "untagged";
            }
            else
            {
                menu += g_Stats[g_StatId]['tags'][g_SelectedIndex];
            }
            menu += "</option></br>";
        }
        menu += "</select>";
    }

    div.innerHTML = menu;

    return div;
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
        prevTab,
        menu = "";

    g_SelectedIndex = 0;
    // remove divs in previous tab
    parentTabDivName = "id-"+g_StatId+"-graphs";
    document.getElementById(parentTabDivName).innerHTML = "";
    prevTab=document.getElementById("id-"+g_StatId);
    // sets class names of tabs
    prevTab.className="graph-tab";
    element.className="graph-tab selected-tab";
    document.getElementById("id-"+g_StatId+"-graphs").style.display="none";
    document.getElementById("id-"+g_StatId+"-dropdown").style.display="none";
    document.getElementById(element.id+"-graphs").style.display="block";
    document.getElementById(element.id+"-dropdown").style.display="block";
    g_StatId=element.getAttribute("stat");

    if (g_StatId !== 'custom')
    {
        ColorByHMS();
    }

    document.getElementById(element.id+"-graphs").innerHTML=menu;
    GenerateSubDivs();
    if (g_GraphType === 0 || g_GraphType === 1 && g_Stats[g_StatId]['type'] === 'int')
    {
        FixDivSize();
    }
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
	        g_Expanded = true;
	        GenerateSubDivs();
	        // if single graph, graph is expanded to whole section
	        if(g_GraphType === 1 && g_StatList[g_StatId]['type'] !== 'int' || g_GraphType === 2)
	        {
	            document.getElementById("region-graphs-1").style.width = "100%";
	            document.getElementById("region-graphs-1").style.height = "100%";
	        }
                else
                {
                    FixDivSize();
                }
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
        GenerateSubDivs();
        FixDivSize(); 
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
        parentTabDivName = "id-"+g_StatId+"-graphs";
        currentNumDivs = document.getElementById(parentTabDivName).childNodes.length;
        children = document.getElementById(parentTabDivName).childNodes;
        // if we only need one graph for either combined lines or summation of lines
        if(g_GraphType === 1 && g_Stats[g_StatId]['type'] !== 'int' || g_GraphType === 2)
        {
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
            while (size < currentNumDivs)
            {
                $("#region-graphs-"+currentNumDivs).remove();
                currentNumDivs--;
            }
            while (size > currentNumDivs)
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

    document.getElementById(parent).appendChild(elem);

    if(g_Expanded  && (g_GraphType === 0 || 
        (g_Stats[g_StatId]['type'] === 'int' && g_GraphType === 1)))
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

function FixDivSize()
{
    var i;

    for (i = 0; i < g_DataList.size; i++)
    {
        if(!g_Expanded)
        {
            document.getElementById("region-graphs-"+(i+1)).style.width = "100%";
        }
        else
        {
            document.getElementById("region-graphs-"+(i+1)).style.width = "50%";
        }
        document.getElementById("region-graphs-"+(i+1)).style.height = "50%";
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
