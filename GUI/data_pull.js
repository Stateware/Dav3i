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
