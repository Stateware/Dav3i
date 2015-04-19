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

// File Name:       map.js
// Description:     This module generates a map inside the div 'map', and
//          defines a listener for the button "clear"
// Date Created:    2/24/2015
// Contributors:    Vanajam Soni, Joshua Crafts
// Date Last Modified:  3/26/2015
// Last Modified By:    Vanajam Soni
// Dependencies:    index.html, descriptor.php, by_stat.php, lookup_table.js, loading_script.js, data.js
// Additional Notes:    N/A


// Author: Vanajam Soni, Joshua Crafts
// Date Created: 2/24/2015
// Last Modified: 4/14/2015 by Paul Jang
// Description: This function initializes the map, fills up the textarea 'cc2_
//      selected' with the list of selected regions and clears the selection
//      on the click of button "clear"
// PRE: index.html and div with id "map" exist 
// POST: The map is initialized in the div "map"
$(function(){
    // Author: Joshua Crafts
    // Date Created: 3/21/2015
    // Last Modified: 4/14/2015 by Paul Jang
    // Description: This function matches each country/region object in the vector map
    //              to its corresponding value in the HMS section of g_LookupTable and
    //              returns the array, indexed by CC2
    // PRE: the HMS section of g_LookupTable is initialized
    // POST: FCTVAL == object containing the as many elements as the total number of 
    //       initialized elements of g_LookupTable, composed of cc2 and the related
    //       HMS value. Should be used as argument to maps.series.regions[0].setValues()
    ColorByHMS = function(){
        var data = {},
            key,
            isFound,
            min,
            max,
            hmsID = g_StatID,
            type = 0;

        for (i = 0; i < g_ParsedStatList[1].length && type != 1; i++)
            {
                if (g_ParsedStatList[1][i] == g_StatID && g_ParsedStatList[0][i] == 1)
                {
                    type = 1;
                    if (g_VaccHMS == 1)
                        hmsID = g_ParsedStatList[2][i];
                    else if (g_VaccHMS == 2)
                        hmsID = g_ParsedStatList[3][i];
                }
            }

        $.when(GetHMS(hmsID,g_HMSYear)).done(function(hmsData){
            isFound = false;
            min = Number.MAX_VALUE;
            max = Number.MIN_VALUE;
            SetHMS(hmsData[hmsID]);     // Need to index in due to JSON format of by_stat.php
            // iterate through regions by key
            for (key in map.regions) {
                // iterate through lookup table by index
                for (var i = 0; i < g_LookupTable.length && isFound == false; i++)
                {
                    // set value by key if key is equal to cc2 in lookup table
                    if (key === g_LookupTable[i][0] && g_LookupTable[i][2] != -1)
                    {
                        data[key] = g_LookupTable[i][2];
                        if (data[key] < min)
                            min = data[key];
                        if (data[key] > max)
                            max = data[key];
                        isFound = true;
                    }
                    else
                    {
                        //data[key] = -1;
                    }
                }
                isFound = false;
            }
            
            map.series.regions[0].params.min = min;
            map.series.regions[0].params.max = max;
            map.reset();
            map.series.regions[0].setValues(data);
        });
    }

    map = new jvm.Map(
    {
        map: 'world_mill_en',
        container: $('#map'),
        regionsSelectable: true, // allows us to select regions
        backgroundColor: 'transparent',
        regionStyle: {
            initial: {
                fill: '#999999',
                "stroke-width": 0.2,
                stroke: '#112211'
            },
            hover: {
                "fill-opacity": 0.7
            },
            selected: {
                "stroke-width": 0.4,
                stroke: '#000000',
                fill: '#7FDBFF'
            }
        },
        series: {
            regions: [{
                attribute: 'fill',
                // needs some random init values, otherwise dynamic region coloring won't work
                values: { ID: 148576, PG: 13120.4, MX: 40264.8, EE: 78.6, DZ: 30744.6, MA: 24344.4, MR: 14117.6, SN: 39722.6, GM: 7832.6, GW: 9902.2 },
                scale: ['#22FF70', '#1D7950'],
                normalizeFunction: 'polynomial'
            }]
        },
        // runs when a region is selected
        onRegionSelected: function()
        {
            if (g_Clear != true)
                ModifyData(map.getSelectedRegions());
        },
        // runs when region is hovered over
        onRegionTipShow: function(e, label, key){
            var tipString = "",
                i, 
                type = 0,
                hmsID = g_StatID;

            tipString += label.html()+" - ";
            for (i = 0; i < g_ParsedStatList[1].length && type != 1; i++)
            {
                if (g_ParsedStatList[1][i] == g_StatID && g_ParsedStatList[0][i] == 1)
                {
                    type = 1;
                    if (g_VaccHMS == 1)
                        hmsID = g_ParsedStatList[2][i];
                    else if (g_VaccHMS == 2)
                        hmsID = g_ParsedStatList[3][i];
                }
            }
            if (type == 1)
            {
                for (i = 0; i < (g_StatList[hmsID].indexOf("VACC")-1); i++)
                    tipString += g_StatList[hmsID][i];
                tipString += " Vaccinations";
            }
            else
                tipString += g_StatList[hmsID];
            tipString += " in " + g_HMSYear + ": ";
            if (map.series.regions[0].values[key] === undefined)            
                tipString += "No Data Available";
            else if (type == 1)
                tipString += (map.series.regions[0].values[key] * 100).toFixed(0) + "%";
            else
            {
                tipString += map.series.regions[0].values[key].toFixed(0);
            }
            label.html(tipString);
        }
    });
    // after lookup table is loaded, color map
    setTimeout(function(){
        var isFound = false;
        g_CountriesNoData = new Array();
        for (var key in map.regions) 
        {
        	isFound = false;
            // iterate through lookup table by index
            for (var i=0; i<g_LookupTable.length && !isFound; i++)
            {
                // set value by key if key is equal to cc2 in lookup table
                if (key == g_LookupTable[i][0])
                {
                    isFound = true;
                }
            }
            if(!isFound)
            {
	        	g_CountriesNoData.push(key);
	        }
	            
        }
        console.log(g_CountriesNoData);
        
    }, 1000);
    // clearing selected regions when the "clear" button in clicked
    document.getElementById("clear").onclick = function()
    {
        var parentTabDivName = "id-"+g_StatList[g_StatID]+"-graphs";
        // removes graphs subdivs
        document.getElementById(parentTabDivName).innerHTML = "";
        // removes map selections

        g_DataList.size = 0;
        g_DataList.start = null;
        g_DataList.end = null;

        g_Clear = true;
        map.clearSelectedRegions();
        g_Clear = false;
    }
});
