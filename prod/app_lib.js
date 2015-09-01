/*! Dav3i - v0.1.0 - 2015-09-01
* https://github.com/Stateware/Dav3i
* Copyright (c) 2015 Stateware Team;
 Licensed GPL v3 (https://github.com/Stateware/Dav3i/blob/master/LICENSE) */
// File Name:               data.js
// Description:             This module holds all global data for the other modules of the project
// Date Created:            3/19/2015
// Contributors:            Joshua Crafts, Vanajam Soni, Paul Jang
// Date Last Modified:      8/30/2015
// Last Modified By:        Joshua Crafts
// Dependencies:            none
// Additional Notes:        N/A

// constants
var g_BUCKETS = 676;				// number of hashable buckets in the lookup table

// global variables
var g_Data;      				// CID, CC2, name, and HMS lookup table
var g_Countries;				// number of countries for which data exists
var g_Stats;      	   			// stat reference list, indexed by stat ID
var g_SelectedIndex = 0;			// index of selected stat data set
var g_Diseases;					// list of diseases
var g_FirstYear;        			// first year for which data is available
var g_LastYear;         			// last year for which data is available
var g_YearStart;        			// first year for which user wants data
var g_YearEnd;          			// last year for which user wants data
var g_DataList;         			// data list for use in graphing
var g_StatId;           			// stat ID corresponding to selected stat
var g_StatId1;					// first selected stat ID for comparison
var g_SelectedIndex1 = 0;			// index of selected stat data set for stat 1
var g_SubStat1;					// index of selected stat data set for stat 1
var g_StatId2;					// second selected stat ID for comparison
var g_SelectedIndex2 = 0;			// index of selected stat data set for stat 2
var g_SubStat2;					// index of selected stat data set for stat 1
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

// File Name:           data_pull.js
// Description:         Contains functions relevant to global server data
// Date Created:        3/5/2015
// Contributors:        Emma Roudabush, Vanajam Soni, Paul Jang, Joshua Crafts
// Date Last Modified:  8/30/2015
// Last Modified By:    Joshua Crafts
// Dependencies:        ../API/get_data.php, data.js, map.js, graph.js, dynamic_markup.js, settings.js
// Additional Notes:    N/A

// High Cyclical Complexity. Change if you want to, I think it looks reasonably simple enough. -Josh Crafts
/* jshint ignore:start */
function ColorByHms()
// PRE:  g_Data, g_StatId, g_HmsYear, g_IntHms, and g_Map are initialized with server data
// POST: map is recolored in terms of the currently selected stat (based on g_IntHms if
//       stat is of type 'int'), where tint of a country is based on the magnitude of its
//       selected stat value 
{
    var data = {},				// object indexed by CC2 to attach data to
						//  vector objects
	dataSet,                                // a given country's set of data values for a particular stat
	temp,                                   // temporary holder for country's data set
        tempValue,                              // value for a country for a stat for a particular year
        min,					// minimum data value from Hms data
        max,					// maximum data value from Hms data
        i, j;					// indexing variable

    min = Number.MAX_VALUE;
    max = Number.MIN_VALUE;

    for (i in g_Map.regions) {
        if (g_Map.regions.hasOwnProperty(i))
        {
            if (g_Data[i] !== undefined)
            {
                if (g_StatId !== 'custom')
                {
                    temp = g_Data[i][g_StatId].data;
                }
                else
                {
                    temp = g_Data[i][g_StatId1].data;
                }
                for (j in temp)
                {
                    if (temp[j].index === g_SelectedIndex)
		    {
			dataSet = temp[j].values;
		    }
                }
                GetColor(dataSet, data, i);
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
/* jshint ignore:end */

function GetColor(dataSet, data, i)
// PRE:  dataSet is the set of data values for a particular stat for country i
//       i is a valid cc2 code
//       data is the array of values to be attached to the map
// POST: data[i] is set to value of the stat identified by g_StatId for year g_HmsYear for country i
{
    if (g_Data[i][g_StatId].type === 'int')
    {
        GetIntColor(dataSet, data, i);
    }
    else if (g_Data[i][g_StatId].type === 'est')
    {
        GetEstColor(dataSet, data, i);
    }
    else // g_Data[i][g_StatId].type === 'lin' || g_Data[i][g_StatId].type === 'bar'
    {
        GetOtherColor(dataSet, data, i);
    }
}

function GetIntColor(dataSet, data, i)
// PRE:  dataSet is the set of data values for a particular stat for country i
//       i is a valid cc2 code
//       data is the array of values to be attached to the map
//       g_Stats[g_StatId]['type'] == 'int'
// POST: data[i] is set to value of the stat identified by g_StatId for year g_HmsYear for country i
{
    var tempValue;

    if (dataSet[g_IntHms].values['y_' + g_HmsYear] !== '-1')
    {
        tempValue = dataSet[g_IntHms].values['y_' + g_HmsYear];
        if (tempValue !== undefined)
        {
            data[i] = tempValue;
        }
    }
}

function GetEstColor(dataSet, data, i)
// PRE:  dataSet is the set of data values for a particular stat for country i
//       i is a valid cc2 code
//       data is the array of values to be attached to the map
//       g_Stats[g_StatId]['type'] == 'est'
// POST: data[i] is set to value of the stat identified by g_StatId for year g_HmsYear for country i
{
    var tempValue;

    if (dataSet[1]['y_' + g_HmsYear] !== '-1')
    {
        tempValue = dataSet[1]['y_' + g_HmsYear];
        if (tempValue !== undefined)
        {
            data[i] = tempValue;
        }
    }
}

function GetOtherColor(dataSet, data, i)
// PRE:  dataSet is the set of data values for a particular stat for country i
//       i is a valid cc2 code
//       data is the array of values to be attached to the map
//       g_Stats[g_StatId]['type'] == 'lin' or 'bar'
// POST: data[i] is set to value of the stat identified by g_StatId for year g_HmsYear for country i
{
    var tempValue;

    if (dataSet['y_' + g_HmsYear] !== '-1')
    {
        tempValue = dataSet['y_' + g_HmsYear];
        if (tempValue !== undefined)
        {
            data[i] = tempValue;
        }
    }
}

function ParseData()
// PRE: Document is loaded and g_Map is initialized
// POST: g_Data, g_Stats, g_Countries, g_Diseases, g_StatId, and g_HmsYear are all
//       set to default values based on server data. Map is colored by default Hms
//       and Hms year. Tabs are built based on stat list. Init settings values are
//       set. Loading screen fades out.
{
    var DataJSON,
	key;			// text returned from descriptor.php call

    $.when(GetData()).done(function(DataJSON){
        SetInitalYears(DataJSON);			// set year range
        g_Data = DataJSON.country_data;			// get region data from server
	g_Stats = DataJSON.stats;                       // set stat list
	g_Countries = DataJSON.countries;               // set country list
	g_Diseases = DataJSON.diseases;                 // set disease list
        g_StatId = Object.keys(g_Stats)[0];             // set default stat to first in list
        g_StatId1 = Object.keys(g_Stats)[0];            // set default stat to first in list
        g_StatId2 = Object.keys(g_Stats)[0];            // set default stat to first in list
        g_SubStat1 = 0;            			// set default stat to first in list
        g_SubStat2 = 0;  			        // set default stat to first in list
        g_HmsYear = g_LastYear;				// set init HMS year to end of data
        ColorByHms();					// color map
        BuildTabs();					// build tab menu
        UpdateInputs();					// set init values for settings inputs
	SwitchToMain();                                 // disappear loading screen
    });
}
              
function GetData()
// PRE: data exists on server and database is set up correctly
// POST: returns the contents of get_data.php encoded as JSON
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
			
function SetInitalYears(DataJSON)
// PRE: DataJSON exists with the correct data from get_data.php,
//		g_FirstYear, g_YearStart, g_LastYear and g_YearEnd exist
// POST: g_FirstYear and g_YearStart have the correct beginning year of statistics.
// 		 g_LastYear and g_YearEnd have the correct ending year of statistics. 
{
	g_FirstYear = Number(DataJSON.firstYear);
	g_YearStart = Number(DataJSON.firstYear);
	g_LastYear = Number(DataJSON.lastYear);
	g_YearEnd = Number(DataJSON.lastYear);
}

function SelectIndex(choice)
// PRE:  choice is an option in a dropdown menu
// POST: g_SelectedIndex == the 'value' field of choice
{
    g_SelectedIndex = Number(choice.value);
}

// PRE:  selectedRegions is a 1D array of CC2 codes output from map.getSelectedRegions in map.js
// POST: the current data list is replaced with a list containing the relevant data for all countries
//       whose CC2s are in selectedRegions which have data available
function BuildList(selectedRegions) 
{
    var i,			// indexing variable
        node;			// new node to be added to list

    if (g_DataList == null)						// create list if it does not exist
    {
	g_DataList = new c_List();
    }

    g_DataList.clear();							// clear list

    for(i = 0; i < selectedRegions.length; i++)				// iterate through list of selected countries
    {									//  and prepend associated object to list
        if (g_Data[selectedRegions[i]] !== undefined && g_Data[selectedRegions[i]][g_StatId] !== undefined)
        {
            node = new t_AsdsNode(selectedRegions[i],
                                  g_Countries[selectedRegions[i]],
                                  g_Data[selectedRegions[i]]);
            g_DataList.add(node);
        }
    }
}

// File Name:               settings.js
// Description:             Module to modify and work with settings
// Date Created:            3/26/2015
// Contributors:            Emma Roudabush, Paul Jang, Kyle Nicholson, Joshua Crafts
// Date Last Modified:      9/1/2015
// Last Modified By:        Joshua Crafts
// Dependencies:            data.js, dynamic_markup.js, graph.js
// Additional Notes:        N/A

function SetGraphType(type)
// PRE: type is a number between 0-2
// POST: g_GraphType is set to the appropriate graph type
{
    g_GraphType = type;
}

function SetIntHms(newIntHms)
// PRE: new is a number between 0-2
// POST: g_IntHms is set to the appropriate stat, and the map is recolored/revalued accordingly
{
    g_IntHms = newIntHms;
}

function ApplyAndClose()
// PRE: See ApplySettings() and CloseSettings()
// POST: if apply settings fails nothing happens, else apply settings and close the menu
{
	if(ApplySettings())
	{
		CloseSettings();
	}
}

function CancelSettings()
// PRE:  N/A
// POST: All settings values are returned to g_TempSettings values
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

function ResetAllStatValues()
// PRE: g_TempSettings is initialized
// POST: all settings in the settings menu are visually set and their global variables are set
//       based on the g_TempSettings array
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

function SaveCurrentStatValues()
// PRE: there are values in each radio button and date div
// POST: saves all current radio buttons and dates and stores them in g_TempSettings array
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

// JS Hint throws errors on this function for high statement count and high cyclical complexity.
// Reccommend compartmentalizing some of this code when adding new features.
/* jshint ignore:start */
function ApplySettings()
// PRE: N/A
// POST: Assigns the global variables if ranges are valid, otherwise display error.
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
        if (g_StatId !== 'custom')
        {
            ColorByHms();	
        }

        // saves all radio buttions and dates in g_TempSettings array
        SaveCurrentStatValues();
        
        return true;
    }
    else
    {
    	return false;
    }
}
/* jshint ignore:end */

function SelectIndex(id)
// PRE:  id is the id of a dropdown menu used to select a data set index
// POST: based on the use of the dropdown menu (select index for a selected stat, or
//       for one of the 2 custom stats), the appropriate global variable is set to the
//       newly selected value
{
    if (id !== 'stat1index' && id !== 'stat2index')
    {
        g_SelectedIndex = document.getElementById(id).value;
    }
    else
    {
        if (id === 'stat1Index')
        {
            g_SelectedIndex1 = document.getElementById(id).value;
        }
        else
        {
            g_SelectedIndex2 = document.getElementById(id).value;
        }
    }
    GenerateGraphs();
}

function SelectStat(id)
// PRE:  id is the id of a dropdown menu used to select a stat
// POST: based on the use of the dropdown menu (which custom stat is being selected), 
//       the appropriate global variable is set to the newly selected value
{
    var re = new RegExp('([a-z\_]+)\\+?(\\d+)?'),
        results;

    results = re.exec(document.getElementById(id).value);
    if (id === 'stat1')
    {
        g_StatId1 = results[1];
        if (results[2] !== undefined)
        {
            g_SubStat1 = results[2];
        }
        RefreshIndices('stat1index');
        g_SelectedIndex1 = 0;
    }
    else
    {
        g_StatId2 = results[1];
        if (results[2] !== undefined)
        {
            g_SubStat2 = results[2];
        }
        RefreshIndices('stat2index');
        g_SelectedIndex2 = 0;
    }
    GenerateGraphs();
}

// File Name:          graph.js
// Description:        This file generates graphs based on server data
// Date Created:       3/17/2015
// Contributors:       Berty Ruan, Arun Kumar, Paul Jang, Vanajam Soni, Joshua Crafts
// Date Last Modified: 9/1/2015
// Last Modified By:   Joshua Crafts
// Dependencies:       data.js, data_pull.js, dynamic_markup.js
// Additional Notes:   N/A

function BuildList(selectedRegions)
// PRE:  selectedRegions is a 1D array of CC2 codes output from g_Map.getSelectedRegions in map.js
// POST: the current data list is replaced with a list containing the relevant data for all countries
//       whose CC2s are in selectedRegions which have data available
{
    var i,			// index in selectedRegions
        node;			// new node to be added to list

    if (g_DataList == null)					// create list if it does not exist
    {
	g_DataList = new c_List();
    }

    g_DataList.clear();						// clear list

    for(i = 0; i < selectedRegions.length; i++)			// iterate through list of selected countries
    {								//  and prepend it to list
        if (g_Data[selectedRegions[i]] !== undefined && (g_Data[selectedRegions[i]][g_StatId] !== undefined || g_StatId === 'custom' && g_Data[selectedRegions[i]][g_StatId1] !== undefined && g_Data[selectedRegions[i]][g_StatId2] !== undefined))
        {
            node = new t_AsdsNode(selectedRegions[i],
                                  g_Countries[selectedRegions[i]],
                                  g_Data[selectedRegions[i]]);
            g_DataList.add(node);
        }
    }
}
 
function GenerateGraphs()
// PRE:  The divs for the graphs exist, and correct data is stored in g_DataList,
//       g_GraphType and g_StatList 
// POST: Calls the appropriate graphing functions depending on the g_GraphType and 
//       whether the g_StatID selected is vaccination or not
{
	var sumNode,		// temp node for use in 'whole selection' option
            max,		// max value between regional graphs
            cur,		// points to nodes as we iterate through list
            i;			// indexing variable

	if(g_DataList !== undefined && g_DataList.size !== 0)
	{
            if (g_StatId === 'custom')
            {
                GenerateCustomGraphs();
            }
            else if (g_Stats[g_StatId].type === 'int')
            {
                GenerateIntegratedGraphs();
            }
            else
            {
                GenerateOtherGraphs();
            }
	}
}

function GenerateCustomGraphs()
// PRE:  g_DataList is initialized with server data and the document is ready
// POST: appropriate graphs are drawn for the 'custom' tab according to the stats
//       to be graphed and the data type (est, int, lin, or bar)
{
    var i,
        cur = g_DataList.start,
        max;

    switch(g_GraphType)
    {
        case 0:
            for(i=1; i<=g_DataList.size; i++)
            {
                GraphCustom("region-graphs-"+i, cur);
                cur=cur.next;
            }
            break;
        case 1:
            for(i=1; i<=g_DataList.size; i++)
            {
                GraphCustom("region-graphs-"+i, cur);
                cur=cur.next;
            }
            break;
        case 2:
            sumNode = GenerateSumNode();
            GraphCustom("region-graphs-"+1, sumNode);
            break;
    }
}

function GenerateIntegratedGraphs()
// PRE:  g_DataList has been initialized with server data g_Stats[g_StatId] is of type 'int'
// POST: graphs of the appropriate number and type are rendered in the graph section of the
//       control panel
{
    var i,
        cur = g_DataList.start,
        max;

    switch(g_GraphType)
    {
        case 0:    
            max = FindMax();
            for(i=1; i<=g_DataList.size; i++)
            {
                GraphIntegrated("region-graphs-"+i, cur, max);
                cur=cur.next;
            }
            break;
        case 1:
            max = FindMax();
            for(i=1; i<=g_DataList.size; i++)
            {
                GraphIntegrated("region-graphs-"+i, cur, max);
                cur=cur.next;
            }
            break;
        case 2:
            sumNode = GenerateSumNode();
            GraphIntegrated("region-graphs-"+1, sumNode);
            break;
    }
}

function GenerateOtherGraphs()
// PRE:  g_DataList has been initialized with server data g_Stats[g_StatId] is not of type 'int'
// POST: graphs of the appropriate number and type are rendered in the graph section of the
//       control panel
{
    var i,
        cur = g_DataList.start,
        max;

    switch(g_GraphType)
    {
        case 0:    
            max = FindMax();
            for(i=1; i<=g_DataList.size; i++)
            {
                GraphRegional("region-graphs-"+i, cur, max);
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


function GraphRegional(divID, node, maxVal)
// PRE:  divID is a div of class "region-graphs-\d", node is a valid t_AsdsNode containing data for a country or 
//       a sum of countries, and maxVal is the max is maximum value of the selected stat for the entire list
// POST: generates a single Google ComboChart for g_Stats[g_StatId] for the given node on the divID
{
    var data = GenerateSingleData(node.data[g_StatId].data),
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

    // default options are for 'est'
    // if single line, make navy
    if (g_Stats[g_StatId].type !== 'est')
    {
        options.series[0].color = "navy";
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

function GraphCombined(divID)
// PRE:  divID is a div of class "region-graphs-\d", g_DataList is initialized with server data
// POST: generates a single Google LineChart on divID for all regions in g_DataList
{
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

function GraphIntegrated(divID, node, maxVal)
// PRE:  divID is a div of class "region-graphs-\d", node is a valid t_AsdsNode containing data for a country or 
//       a sum of countries, and maxVal is the max is maximum value of the selected stat for the entire list
// POST: generates a single Google ComboChart for integrated stat g_Stats[g_StatId] for the given node on the divID
{
    var data = GenerateSingleData(node.data[g_StatId].data),
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
        options.vAxis.viewWindow.max = maxVal;
    }

    for (i = 0; i < g_Stats[g_StatId].subType.length; i++)
    {
        if (g_Stats[g_StatId].subType[i] === 'lin')
        {
             dataSeries[i].type = 'line'; 
        }
    }

    options.series = dataSeries;
	
    formatter = new google.visualization.NumberFormat({pattern: '##.##%'});
    for(i=1; i<data.getNumberOfColumns(); i++)
    {
        formatter.format(data,i);
    }
	
    chart = new google.visualization.ComboChart(document.getElementById(divID));
    chart.draw(data, options);
}

function GraphCustom(divID, node)
// PRE:  node is a pointer to a particular node in g_DataList
//       divID is the id of a particular div in which to graph
// POST: a graph of the 2 stats indicated by g_StatId1 and g_StatId2 from node is created in div divID
{
    var data = GenerateCustomData(node),
        options = {
            title: node.name,
            hAxis: {title: 'Year', format: '####'},
            backgroundColor: '#EAE7C2',
            seriesType: "line",
            tooltip: {trigger: 'both'}
        },
        formatter,
        chart,
        i;
	
    chart = new google.visualization.ComboChart(document.getElementById(divID));
    chart.draw(data, options);
}

function FixMissingData(data)
// PRE: data is an integer or float, missing data is represented as -1
// POST: FCTVAL == data if data is not -1, null otherwise
{
    if(data !== -1)
    {
        return data;
    }
    else
    {
        return null;
    }
}

function GetYears(values)
// PRE:  values is an object with its keys being column ids from the source database table,
//       and the values matched to them being the data values from the table for a particular
//       country
// POST: FCTVAL == an array of years as Numbers with the prefix "y_" stripped from the column name
{
    var years = [],
        re = new RegExp("y_(\\d+)"),
        i;

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
// PRE:  values is an object with its keys being column ids from the source database table,
//       and the values matched to them being the data values from the table for a particular
//       country
// POST: FCTVAL == an array of the data values from values as Numbers
{
    var row = [],
        i;

    for (i in values)
    {
        if (i !== 'country_id' && i !== 'data_set_index')
        {
            row.push(FixMissingData(Number(values[i])));
        }
    }

    return row;
}

function GenerateSingleData(data)
// PRE:  data == g_Data[{{country}}][g_StatId]['data']
// POST: FCTVAL == data table containing data from the year g_YearStart to g_YearEnd, for the given country's data
//       so that we can graph
{
    var dataTable,
        i,
        temp = new Array(4);

    if (g_Stats[g_StatId].type === 'est')
    {
        dataTable = GenerateSingleEstData(data);
    }
    else if (g_Stats[g_StatId].type === 'int')
    {
        dataTable = GenerateSingleIntData(data);
    }
    else
    {
        dataTable = GenerateSingleOtherData(data);
    }

    return dataTable;
}

function GenerateSingleEstData(data)
// PRE:  data is initialized with server data, and g_Stats[g_StatId]['type] == 'est'
//       g_SelectedIndex and g_StatId are initialized
// POST: FCTVAL == a data table of data with the appropriate format
{
    var temp = [],
        dataTable = new google.visualization.DataTable(),
        i;

    temp.push(GetYears(data[g_SelectedIndex].values[0]));
    temp.push(GetValues(data[g_SelectedIndex].values[0]));
    temp.push(GetValues(data[g_SelectedIndex].values[1]));
    temp.push(GetValues(data[g_SelectedIndex].values[2]));
    dataTable.addColumn('number','year');
    dataTable.addColumn('number', g_Stats[g_StatId].subName[1]);
    dataTable.addColumn('number', 'lower bound space'); // area under lower bound
    dataTable.addColumn('number', g_Stats[g_StatId].subName[2]); // additional line to outline confidence interval
    dataTable.addColumn('number', 'size of confidence interval'); // area between upper bound and lower bound
    dataTable.addColumn('number', g_Stats[g_StatId].subName[0]); // additional line to generate accurate upper bound tooltip, ow it would show size of confidence interval
    for (i = 0; i < temp[0].length; i++)
    {
        dataTable.addRow([temp[0][i],temp[2][i],temp[3][i],
                temp[3][i],temp[1][i] - temp[3][i], temp[1][i]]);
    }

    return dataTable;
}

function GenerateSingleIntData(data)
// PRE:  data is initialized with server data, and g_Stats[g_StatId]['type] == 'int'
//       g_SelectedIndex and g_StatId are initialized
// POST: FCTVAL == a data table of data with the appropriate format
{
    var temp = [],
        dataTable = new google.visualization.DataTable(),
        i;

    temp.push(GetYears(data[g_SelectedIndex].values[0].values));
    temp.push(GetValues(data[g_SelectedIndex].values[0].values));
    temp.push(GetValues(data[g_SelectedIndex].values[1].values));
    temp.push(GetValues(data[g_SelectedIndex].values[2].values));
    dataTable.addColumn('number','year');
    dataTable.addColumn('number', g_Stats[g_StatId].subName[0]);
    dataTable.addColumn('number', g_Stats[g_StatId].subName[1]);
    dataTable.addColumn('number', g_Stats[g_StatId].subName[2]);
    for (i = 0; i < temp[0].length; i++)
    {
        dataTable.addRow([temp[0][i],temp[1][i],temp[2][i],temp[3][i]]);
    }

    return dataTable;
}

function GenerateSingleOtherData(data)
// PRE:  data is initialized with server data, and g_Stats[g_StatId]['type] != 'est' or 'int'
//       g_SelectedIndex and g_StatId are initialized
// POST: FCTVAL == a data table of data with the appropriate format
{
    var temp = [],
        dataTable = new google.visualization.DataTable(),
        i;

    dataTable.addColumn('number','year');
    dataTable.addColumn('number', g_Stats[g_StatId].name);
    temp.push(GetYears(data[g_SelectedIndex].values));
    temp.push(GetValues(data[g_SelectedIndex].values));
    for (i = 0; i < temp[0].length; i++)
    {
        dataTable.addRow([temp[0][i],temp[1][i]]);
    }

    return dataTable;
}

//TODO: reduce cyclomatic complexity to below jshint threshold
/* jshint ignore:start */
function GenerateCustomData(node)
// PRE:  node is a pointer to a particular node in g_DataList
// POST: FCTVAL == a google charts DataTable object containing all necessary data from 2 stats
//       from node
{
    var temp1 = [],
        temp2 = [],
        dataTable = new google.visualization.DataTable(),
        i, j;

    console.log(g_StatId1);
    console.log(g_SelectedIndex1);
    dataTable.addColumn('number','year');
    if (g_Stats[g_StatId1].type !== 'int')
    {
        dataTable.addColumn('number', g_Stats[g_StatId1].name);
    }
    else
    {
        dataTable.addColumn('number', g_Stats[g_StatId1].subName[g_SubStat1]);
    }
    if (g_Stats[g_StatId2].type !== 'int')
    {
        dataTable.addColumn('number', g_Stats[g_StatId2].name);
    }
    else
    {
        dataTable.addColumn('number', g_Stats[g_StatId2].subName[g_SubStat2]);
    }
    if (g_Stats[g_StatId1].type === 'est')
    {
        temp1.push(GetYears(node.data[g_StatId1].data[g_SelectedIndex1].values[1]));
        temp1.push(GetValues(node.data[g_StatId1].data[g_SelectedIndex1].values[1]));
    }
    else if (g_Stats[g_StatId1].type === 'int')
    {
        temp1.push(GetYears(node.data[g_StatId1].data[g_SelectedIndex1].values[g_SubStat1].values));
        temp1.push(GetValues(node.data[g_StatId1].data[g_SelectedIndex1].values[g_SubStat1].values));
    }
    else
    {
        temp1.push(GetYears(node.data[g_StatId1].data[g_SelectedIndex1].values));
        temp1.push(GetValues(node.data[g_StatId1].data[g_SelectedIndex1].values));
    }
    console.log(g_StatId2);
    console.log(g_SelectedIndex2);
    if (g_Stats[g_StatId2].type === 'est')
    {
        temp2.push(GetYears(node.data[g_StatId2].data[g_SelectedIndex2].values[1]));
        temp2.push(GetValues(node.data[g_StatId2].data[g_SelectedIndex2].values[1]));
    }
    else if (g_Stats[g_StatId2].type === 'int')
    {
        temp2.push(GetYears(node.data[g_StatId2].data[g_SelectedIndex2].values[g_SubStat2].values));
        temp2.push(GetValues(node.data[g_StatId2].data[g_SelectedIndex2].values[g_SubStat2].values));
    }
    else
    {
        temp2.push(GetYears(node.data[g_StatId2].data[g_SelectedIndex2].values));
        temp2.push(GetValues(node.data[g_StatId2].data[g_SelectedIndex2].values));
    }

    j = 0;
    i = 0;
    while (temp1[0][i] !== temp2[0][j])
    {
        j++;
    }
    if (temp1[0][i] !== temp2[0][j])
    {
        j = 0;
        while (temp1[0][i] !== temp2[0][j])
        {
            i++;
        }
    }
    for (i = i; i < temp1[0].length; i++)
    {
        dataTable.addRow([temp1[0][i],temp1[1][i],temp2[1][j]]);
        j++;
    }
    return dataTable;
}
/* jshint ignore:end */

function GenerateCombinedData()
// PRE:  g_DataList, g_StatId, and g_SelectedIndex are initialized with server data
// POST: FCTVAL == data table containing data from the year g_YearStart to g_YearEnd, for all countries on the 
//       g_DataList, so that we can graph all data on one graph
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
    if (g_Stats[g_StatId].type === 'est')
    {
        temp[0] = GetYears(cur.data[g_StatId].data[g_SelectedIndex].values[1]);
        for (i = 0; i < g_DataList.size; i++)
        {
            temp[i + 1] = GetValues(cur.data[g_StatId].data[g_SelectedIndex].values[1]);
            cur = cur.next;
        }
    }
    else
    {
        temp[0] = GetYears(cur.data[g_StatId].data[g_SelectedIndex].values);
        for (i = 0; i < g_DataList.size; i++)
        {
            temp[i + 1] = GetValues(cur.data[g_StatId].data[g_SelectedIndex].values);
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

function GenerateSumNode()
// PRE:  g_DataList, g_StatId, and g_SelectedIndex are initialized with server data
// POST: FCTVAL == t_AsdsNode with cc2 = 'sum', name = comma delimited list of country names,
//       and data being a partial data set that includes summed values for only the needed stats
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
    name += cur.name;
    cur = cur.next;
    for (i = 1; i < g_DataList.size; i++)
    {
        name += ", " + cur.name;
        // add all data values for stat and substats to the copied node, effectively creating a sum node with respect to the needed stat
        if (g_StatId === 'custom')
        {
            clone[g_StatId1].data = AddValuesFromNode(clone[g_StatId1].data, cur, g_StatId1, g_SelectedIndex1);
            if (g_StatId1 !== g_StatId2)
            {
                clone[g_StatId2].data = AddValuesFromNode(clone[g_StatId2].data, cur, g_StatId2, g_SelectedIndex2);
            }
        }
        else
        {
            clone[g_StatId].data = AddValuesFromNode(clone[g_StatId].data, cur, g_StatId, g_SelectedIndex);
        }
        cur = cur.next;
    }

    if (g_StatId !== 'custom' && g_Stats[g_StatId].type === 'int')
    {
        for (j = g_Data[g_DataList.start.cc2][g_StatId].firstYear; j <= g_Data[g_DataList.start.cc2][g_StatId].lastYear; j++)
        {
            data[g_SelectedIndex].values[0].values['y_' + j] = data[g_SelectedIndex].values[0].values['y_' + j] / g_DataList.size;
            data[g_SelectedIndex].values[1].values['y_' + j] = data[g_SelectedIndex].values[0].values['y_' + j] / g_DataList.size;
            data[g_SelectedIndex].values[2].values['y_' + j] = data[g_SelectedIndex].values[0].values['y_' + j] / g_DataList.size;
        }
    }
    
    sumNode = new t_AsdsNode('sum', name, clone);

    return sumNode;
}

//TODO: reduce cyclomatic complexity to below jshint threshold
/* jshint ignore:start */
function AddValuesFromNode(data, node, statId, index)
// PRE:  data is a pointer to the 'data' field of the output node's node[cc2][statId] object
//       node is the current node in the list being traversed
//       statId is the id of the stat whose values are being added to the output node
//       index is the index of the stat data set whose values are being added to the output node
// POST: FCTVAL == a data object with the values of the current node added to the desired stat
//       and data set index
{
    if (g_Stats[statId].type === 'est')
    {
        for (j = g_Data[node.cc2][statId].firstYear; j <= g_Data[node.cc2][statId].lastYear; j++)
        {
            data[index].values[0]['y_' + j] = Number(data[index].values[0]['y_' + j]);
            if (Number(g_Data[node.cc2][statId].data[index].values[0]['y_' + j]) !== -1)
            {
                data[index].values[0]['y_' + j] += Number(g_Data[node.cc2][statId].data[index].values[0]['y_' + j]);
            }
            data[index].values[1]['y_' + j] = Number(data[index].values[1]['y_' + j]);
            if (Number(g_Data[node.cc2][statId].data[index].values[1]['y_' + j]) !== -1)
            {
                data[index].values[1]['y_' + j] += Number(g_Data[node.cc2][statId].data[index].values[1]['y_' + j]);
            }
            data[index].values[2]['y_' + j] = Number(data[index].values[2]['y_' + j]);
            if (Number(g_Data[node.cc2][statId].data[index].values[2]['y_' + j]) !== -1)
            {
                data[index].values[2]['y_' + j] += Number(g_Data[node.cc2][statId].data[index].values[2]['y_' + j]);
            }
        }
    }
    else if (g_Stats[statId].type === 'int')
    {
        for (j = g_Data[node.cc2][statId].firstYear; j <= g_Data[node.cc2][statId].lastYear; j++)
        {
            data[index].values[0].values['y_' + j] = Number(data[index].values[0].values['y_' + j]);
            if (Number(g_Data[node.cc2][statId].data[index].values[0].values['y_' + j]) !== -1)
            {
                data[index].values[0].values['y_' + j] += Number(g_Data[node.cc2][statId].data[index].values[0].values['y_' + j]);
            }
            data[index].values[1].values['y_' + j] = Number(data[index].values[1].values['y_' + j]);
            if (Number(g_Data[node.cc2][statId].data[index].values[1].values['y_' + j]) !== -1)
            {
                data[index].values[1].values['y_' + j] += Number(g_Data[node.cc2][statId].data[index].values[1].values['y_' + j]);
            }
            if (data[index].length === 3)
            {
		data[index].values[2].values['y_' + j] = Number(data[index].values[2].values['y_' + j]);
                if (Number(g_Data[node.cc2][statId].data[index].values[2]['y_' + j]) !== -1)
                {
                    data[index].values[2].values['y_' + j] += Number(g_Data[node.cc2][statId].data[index].values[2].values['y_' + j]);
                }
            }
        }
    }
    else
    {
        for (j = g_Data[node.cc2][statId].firstYear; j <= g_Data[node.cc2][statId].lastYear; j++)
        {
            data[index].values['y_' + j] = Number(data[index].values['y_' + j]);
            if (Number(g_Data[node.cc2][statId].data[index].values['y_' + j]) !== -1)
            {
                data[index].values['y_' + j] += Number(g_Data[node.cc2][statId].data[index].values['y_' + j]);
            }
        }
    }
    return data;
}
/* jshint ignore:end */

function GetMaxFromValueRow(values)
// PRE:  values is an object with its keys being column ids from the source database table,
//       and the values matched to them being the data values from the table for a particular
//       country
// POST: FCTVAL == maximum value from values
{
    var max = Number.MIN_VALUE,
        re = new RegExp("y_(\\d+)"),
        temp,
        i;

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

function FindMax()
// PRE:  g_DataList, g_StatId, and g_SelectedIndex are initialized with server data
//       g_ParsedStatList, g_YearFirst, g_FirstYear and g_YearEnd exist and contain correct data
// POST: FCTVAL == maximum value of the selected stat for the entire list
{
    var max = Number.MIN_VALUE,
        cur = g_DataList.start,
        i,
        thisNodeMax;

    // find max value of needed data set
    for (i = 0; i < g_DataList.size; i++)
    {
        // get max of current node for current stat
        thisNodeMax = GetMaxThisNode(cur);
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

function GetMaxThisNode(node)
// PRE:  g_DataList, g_StatId, and g_SelectedIndex are initialized with server data
//       g_ParsedStatList, g_YearFirst, g_FirstYear and g_YearEnd exist and contain correct data
//       node is a particular node of g_DataList
// POST: FCTVAL == the max value of stat g_StatId for node node
{
    var max;

    if (g_Stats[g_StatId].type === 'est')
    {
        max = Math.max.apply(Math, [GetMaxFromValueRow(node.data[g_StatId].data[g_SelectedIndex].values[0]), GetMaxFromValueRow(node.data[g_StatId].data[g_SelectedIndex].values[1]), GetMaxFromValueRow(node.data[g_StatId].data[g_SelectedIndex].values[2])]);
    }
    else if (g_Stats[g_StatId].type === 'int')
    {
        max = Math.max.apply(Math, [GetMaxFromValueRow(node.data[g_StatId].data[g_SelectedIndex].values[0].values),GetMaxFromValueRow(node.data[g_StatId].data[g_SelectedIndex].values[1].values),GetMaxFromValueRow(node.data[g_StatId].data[g_SelectedIndex].values[2].values)]);
    }
    else
    {
        max = GetMaxFromValueRow(node.data[g_StatId].data[g_SelectedIndex].values);
    }

    return max;
}

// File Name:               dynamic_markup.js
// Description:             This module contains the code needed to dynamically create markup on the page based on server data
// Date Created:            3/26/2015
// Contributors:            Paul Jang, Nicholas Denaro, Emma Roudabush, Joshua Crafts
// Date Last Modified:      8/29/2015
// Last Modified By:        Joshua Crafts
// Dependencies:            data_pull.js, data.js, graph.js, settings.js
// Additional Notes:        N/A

function BuildTabs()
// PRE:  .control-panel is loaded in the document, g_Stats is initialized with server data
// POST: .control-panel contains all stat tabs, including 'custom', as well as their graph sections
//       and dropdown menus
{
    var i;

    // create stat tabs and divs
    for(i in g_Stats)
    {
	if (g_Stats.hasOwnProperty(i)) {
            document.getElementById("tabsDiv").appendChild(CreateTab(g_Stats[i].name, i));
        }
    }

    // create custom tab and div
    document.getElementById("tabsDiv").appendChild(CreateTab('Custom', 'custom'));
}

function CreateTab(name, id)
// PRE:  name is a text string representing the name to put on the tab
//       id is a text string to be used to create that tab's id
// POST: FCTVAL == a tab with text name and id id,
//       and a div to go with this tab is created in the control panel
{
    var div;

    div=document.createElement("div");
    div.id="id-"+id;
    div.setAttribute("stat", id);
    div.className="graph-tab";
    div.setAttribute("onclick","ChooseTab(this)");
    div.innerHTML=name;

    BuildDiv(id);

    if(id === g_StatId)
    {
        document.getElementById("id-"+id+"-graphs").style.display="block";
        document.getElementById("id-"+id+"-dropdown").style.display="block";
        div.className="graph-tab selected-tab";
    }

    return div;
}

function UpdateInputs()
// PRE:  .settings-screen is loaded in the document, g_FirstYear and g_LastYear are initialized
//       with server data
// POST: default settings values are set and g_TempSettings array is initialized with original settings
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
    g_TempSettings[4]=0;
}

function BuildDiv(statId)
// PRE: Called from BuildTabs
// POST: appropriate divs are created
{
    var div=document.createElement("DIV");

    div.id="id-"+statId+"-graphs";
    div.style.display="none";
    div.style.top="23%";
    div.style.height="72%";
    div.className="graph";
    document.getElementById("graphs").appendChild(BuildDropdown(statId));
    document.getElementById("graphs").appendChild(div);
}

function BuildDropdown(statId)
// PRE:  statId is the name of some data table from the database
//       ParseData() has been called and all globals have been set successfully
// POST: FCTVAL == a div object which contains a dropdown menu with indices of all
//       data sets relevant to statId and their tags if they exist
{
    var div=document.createElement("DIV"),
        menu = "",
        i;

    div.id="id-"+statId+"-dropdown";
    div.style.display="none";
    div.style.top="8%";
    div.style.height="15%";

    if (statId === 'custom')
    {
        menu += GetCustomDropdownHTML();
    }
    else
    {
        menu += GetDropdownHTML(statId);
    }

    div.innerHTML = menu;

    return div;
}

function GetDropdownHTML(statId)
// PRE:  statId is the id of some stat that exists in g_Stats, and g_Stats is initialized with server data
// POST: FCTVAL == html representing a dropdown menu including choices for all available data sets for stat statId
{
    var i,
        menu = "";

    menu += "<p class='open-sans'>Select Data Set</p><select id='stat-indices-" + statId + "' name='index' onchange=\"SelectIndex('stat-indices-" + statId + "')\">";
    for (i in g_Stats[statId].tags)
    {
	if (g_Stats[statId].tags.hasOwnProperty(i))
        {
            menu += "<option value='" + i + "'>" + i + " - ";
            if (g_Stats[statId].tags[i] === "")
            {
                menu += "untagged";
            }
            else
            {
                menu += g_Stats[statId].tags[i];
            }
            menu += "</option></br>";
        }
    }
    menu += "</select>";

    return menu;
}

//TODO: reduce cyclomatic complexity to below jshint threshold
/* jshint ignore:start */
function GetCustomDropdownHTML()
// PRE:  g_Stats is initialized with server data
// POST: FCTVAL == html representing 4 dropdown menus including choices for all available data sets and stats
{
    var i, j,
        menu = "";

    menu += "<p class='open-sans' id='stats-select'>Select Stats</p><p class='open-sans' id='indices-select'>Select Data Sets</p><select id='stat1' name='stat1' onchange=\"SelectStat('stat1')\">";
    for (i in g_Stats)
    {
	if (g_Stats.hasOwnProperty(i))
        {
            if (g_Stats[i].type === 'int')
            {
                for (j = 0; j < g_Stats[i].subName.length; j++)
                {
                    menu += "<option value='" + i + "+" + j + "'>" + g_Stats[i].name + " - " + g_Stats[i].subName[j] + "</option>";
                }
            }
            else
            {
                menu += "<option value='" + i + "'>" + g_Stats[i].name + "</option>";
            }
        }
    }
    menu += "</select>";
    menu += "<select id='stat2' name='stat2' onchange=\"SelectStat('stat2')\">";
    for (i in g_Stats)
    {
	if (g_Stats.hasOwnProperty(i))
        {
            if (g_Stats[i].type === 'int')
            {
                for (j = 0; j < g_Stats[i].subName.length; j++)
                {
                    menu += "<option value='" + i + "+" + j + "'>" + g_Stats[i].name + " - " + g_Stats[i].subName[j] + "</option>";
                }
            }
            else
            {
                menu += "<option value='" + i + "'>" + g_Stats[i].name + "</option>";
            }
        }
    }
    menu += "</select>";
    menu += "<select id='stat1index' name='stat1index' onchange=\"SelectIndex('stat1index')\">";
    for (i in g_Stats[g_StatId1].tags)
    {
	if (g_Stats[g_StatId1].tags.hasOwnProperty(i))
        {
            menu += "<option value='" + i + "'>" + i + " - ";
            if (g_Stats[g_StatId1].tags[i] === "")
            {
                menu += "untagged";
            }
            else
            {
                menu += g_Stats[g_StatId1].tags[i];
            }
            menu += "</option></br>";
        }
    }
    menu += "</select>";
    menu += "<select id='stat2index' name='stat2index' onchange=\"SelectIndex('stat2index')\">";
    for (i in g_Stats[g_StatId2].tags)
    {
	if (g_Stats[g_StatId2].tags.hasOwnProperty(i))
        {
            menu += "<option value='" + i + "'>" + i + " - ";
            if (g_Stats[g_StatId2].tags[i] === "")
            {
                menu += "untagged";
            }
            else
            {
                menu += g_Stats[g_StatId2].tags[i];
            }
            menu += "</option></br>";
        }
    }
    menu += "</select>";

    return menu;
}

//TODO: reduce cyclomatic complexity to below jshint threshold
function RefreshIndices(id)
// PRE:  id is the id of a dropdown menu for an index in the custom tab
// POST: the dropdown menu with id id has its options replaced with those
//       for the selected stat
{
    var menu = "",
    i;

    if (id === 'stat1index')
    {
        for (i in g_Stats[g_StatId1].tags)
        {
            if (g_Stats[g_StatId1].tags.hasOwnProperty(i))
            {
                menu += "<option value='" + i + "'>" + i + " - ";
                if (g_Stats[g_StatId1].tags[i] === "")
                {
                    menu += "untagged";
                }
                else
                {
                    menu += g_Stats[g_StatId1].tags[i];
                }
                menu += "</option></br>";
            }
        }
    }
    else
    {
        for (i in g_Stats[g_StatId2].tags)
        {
            if (g_Stats[g_StatId2].tags.hasOwnProperty(i))
            {
                menu += "<option value='" + i + "'>" + i + " - ";
                if (g_Stats[g_StatId2].tags[i] === "")
                {
                    menu += "untagged";
                }
                else
                {
                    menu += g_Stats[g_StatId2].tags[i];
                }
                menu += "</option></br>";
            }
        }
    }
    document.getElementById(id).innerHTML = menu;
}
/* jshint ignore:end */

function ChooseTab(element)
// PRE: Called from the onclick of a tab
// POST: previous tab is switched out, and now tab is switched in
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
        ColorByHms();	
    }

    document.getElementById(element.id+"-graphs").innerHTML=menu;
    GenerateSubDivs();
    if (g_GraphType === 0 || g_GraphType === 1 && (g_StatId === 'custom' || g_Stats[g_StatId].type === 'int'))
    {
        FixDivSize();
    }
    GenerateGraphs();
}

function RotateTabs(direction)
// PRE: direction!=0
// POST: The first/last tab is moved to the last/first position
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

function SwitchToMain ()
// PRE: N/A
// POST: Screen is switched to the main page
{
    $(".loading-screen").fadeOut(750);
}

function OpenSettings()
// PRE: N/A
// POST: Settings overlay is showing with black backing mask and all stat values are reset
{
     ResetAllStatValues();
	 
     $(".settings-screen, .settings-black").fadeIn(400);
     
}

function CloseSettings()
// PRE: Settings overlay is currently showing on screen
// POST: Settings overlay and mask is gone
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

function OpenHelp()
// PRE: N/A
// POST: Settings overlay is showing with black backing mask
{
     $(".help-screen, .help-black").fadeIn(400);
}

function CloseHelp()
// PRE: Settings overlay is currently showing on screen
// POST: Settings overlay and mask is gone
{
    $(".help-screen, .help-black").fadeOut(400);
}

function Expand()
// PRE: N/A
// POST: Control panel is expanded and black mask is in place behind
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
	        if(g_GraphType === 1 && (g_StatId !== 'custom' || g_StatList[g_StatId].type !== 'int') || g_GraphType === 2)
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

function Shrink()
// PRE: Control panel is currently expanded
// POST: Control panel shrinks back to original size and black mask is gone
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

function GenerateSubDivs()
// PRE: g_DataList is initialized
// POST: Divs are created based on how many countries are selected,
//       Correct graphs are filled in the appropriate divs based on graph type
{
    var i,
        parentTabDivName,
        currentNumDivs,
        children,
        newNumDivs;

    // only if there are countries in the data list
    if(g_DataList !== undefined)
    {
        parentTabDivName = "id-"+g_StatId+"-graphs";
        currentNumDivs = document.getElementById(parentTabDivName).childNodes.length;
        children = document.getElementById(parentTabDivName).childNodes;
        // if we only need one graph for either combined lines or summation of lines
        if(g_GraphType === 1 && g_StatId !== 'custom' && g_Stats[g_StatId].type !== 'int'  || g_GraphType === 2)
        {
            document.getElementById(parentTabDivName).innerHTML = "";
            if(g_DataList.size !== 0)
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
            FixDivNum(currentNumDivs, parentTabDivName);
        }
    }
}

function FixDivNum(numDivs, parent)
// PRE:  numDivs is the current number of divs available for graphing, and the g_GraphType
//       is 1 or g_GraphType is 2 and the selected stat type is 'int'
//       parent is the parent element into which any new divs must be appended
// POST: numDivs == g_DataList.size
{
   while (g_DataList.size < numDivs)
   {
       $("#region-graphs-"+numDivs).remove();
       numDivs--;
   }
   while (g_DataList.size > numDivs)
   {
       CreateSubDiv("region-graphs-"+(numDivs+1), parent);
       numDivs++;
   }
}

function CreateSubDiv(id,parent)
// PRE: div parent with id id exists
// POST: Single div is appended to parent
{
    var elem = document.createElement('div'),
        divs,
        i;
    elem.id = id;
    elem.className = "subgraph";
    divs=document.getElementsByTagName("div");

    document.getElementById(parent).appendChild(elem);

    if(g_Expanded  && (g_GraphType === 0 || 
        g_Stats[g_StatId].type === 'int' && g_GraphType === 1))
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
// PRE:  g_GraphType == 0 or g_GraphType == 1 and the stat being graphed is of type 'int'
//       graph divs "region-graphs-1" through "region-graphs-" + g_DataList.size+1 exist in the document
//       g_DataList is initialized and contains relevant data
// POST: the size of the graph divs is adjusted to fit the view, either to fit a quarter of the expanded view, or half
//       of the collapsed view (vertically)
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

function teamPopup()
// PRE: none
// POST: Alert box pops up with info about project contributors
{
    window.alert("Stateware Team\nSpring 2015:\nWilliam Bittner," + 
        " Joshua Crafts, Nicholas Denaro, Dylan Fetch, Paul Jang," + 
        " Arun Kumar, Drew Lopreiato, Kyle Nicholson, Emma " + "Roudabush, Berty Ruan, Vanajam Soni");
}

function bugPopup()
// PRE: none
// POST: Alert box pops up with info about and instructions for 
//       reporting a bug
{
    window.alert("If you would like to report an issue, please send " + "an email to stateware@acm.psu.edu with the following " + 
        "details included in your message:\n1. Description of the " + "issue\n2. Steps for reproducing the issue\n3. What browser and" + 
        " operating system you experienced the issue on\n4. Any " + "additional relevant information.");
}
