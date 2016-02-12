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
function initMap() {
    // Author: Joshua Crafts
    // Date Created: 3/21/2015
    // Last Modified: 9/28/2015 by Murlin Wei
    // Description: This function matches each country/region object in the vector map
    //              to its corresponding value in the HMS section of g_LookupTable and
    //              returns the array, indexed by CC2
    // PRE: the HMS section of g_LookupTable is initialized
    // POST: FCTVAL == object containing the as many elements as the total number of 
    //       initialized elements of g_LookupTable, composed of cc2 and the related
    //       HMS value. Should be used as argument to maps.series.regions[0].setValues()
    var localMap = new jvm.Map(
    {
        map: 'world_mill_en',
        container: $('#map'),
        regionsSelectable: true, // allows us to select regions
        backgroundColor: 'transparent',
        regionStyle: {
            initial: {
                fill: '#888888'
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
                ModifyData(g_Map.getSelectedRegions());
        },
        // runs when region is hovered over
        onRegionTipShow: function(e, label, key){
            var tipString = "",
                i, 
                type = 0,
                hmsID = g_StatID;
				
			var Format = wNumb({
				thousand: ','
			});

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
            if (g_Map.series.regions[0].values[key] === undefined)            
                tipString += "No Data Available";
            else if (type == 1)
                tipString += (g_Map.series.regions[0].values[key] * 100).toFixed(0) + "%";
            else
            {
                tipString += Format.to(Number(g_Map.series.regions[0].values[key]));
            }
            label.html(tipString);
        }
    });

    FindCountriesNoData();
    SetClearButtonOnClick();

    g_Map = localMap;
    return localMap;
};

// Author: Murlin Wei, William Bittner
// Date Created: 3/21/2015
// Last Modified: 10/5/2015 by Murlin Wei
// Description: This is like the 'main' function which sets up the the main variables and then
//              passes those variables through the GetHMS function.
// PRE:  g_ParsedStateList is initalized and contains values
// POST: We have found the selected data from the lookup table and g_Map is populated with min and max values
function ColorByHMS() {
    var hmsID = g_StatID,
        type = 0;

    var key,
        isFound,
        min,
        max;

    // iterate through list of stats until we found the one chosen by user
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

    //GetHMS(getSession(), getFirstInstance(), hmsID, g_HMSYear);
    //retrieveByStatData(getSession(), getFirstInstance(), hmsID, g_HMSYear);
    getDataByStat(getSession(), getFirstInstance(), hmsID, g_HMSYear, SuccessfulByStat);
};

// Author: Murlin Wei, William Bittner
// Date Created: 3/21/2015
// Last Modified: 10/5/2015 by Murlin Wei
// Description: Finding and setting our min and max values for our heat map.
// PRE:  hmsData is valid and hmsID is a valid year
// POST: We have found the selected data from the lookup table and g_Map is populated with min and max values
function ParseMapData(hmsData,hmsID) {
    var data = {};
    var isFound = false;
    var min = Number.MAX_VALUE;
    var max = Number.MIN_VALUE;

    //console.log(JSON.stringify(hmsData,' ',' '));
    var hms = SetHMS(hmsData);
    for (var i = 0; i < g_LookupTable.length; i++)
    {
        g_LookupTable[i][2] = Number(hms[i]);
    }

    // iterate through regions by key
    for (key in g_Map.regions) {
        // iterate through lookup table by index
        for (var i = 0; i < g_LookupTable.length && isFound == false; i++)
        {
            // set value by key if key is equal to cc2 in lookup table
            if (key === g_LookupTable[i][0] && g_LookupTable[i][2] != -1)
            {
                //raw numbers?
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

    g_Map.series.regions[0].params.min = min;
    g_Map.series.regions[0].params.max = max;
    g_Map.reset();
    g_Map.series.regions[0].setValues(data);
    //g_Map.series.regions[0].values = data;

    var dataArray = {
        Data : data,
        Min : min,
        Max : max
    }

    return dataArray;
};

// Author: Murlin Wei, William Bittner
// Date Created: 3/21/2015
// Last Modified: 10/5/2015 by Murlin Wei
// Description: Sets the country that have no data into an array that is called g_CountriesNoData.
//              We wait a second before calling it is because the map may not have been fully populated yet.
// PRE:  g_Map regions countains a list of countries
// POST: g_CountriesNoData is populated with countries with no data
function FindCountriesNoData() {
  setTimeout(function(){
    var isFound = false;
    g_CountriesNoData = [];
    for (var key in g_Map.regions) 
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
    }, 10000);
    //console.log(g_CountriesNoData);

};

// Author: Murlin Wei, William Bittner
// Date Created: 3/21/2015
// Last Modified: 10/5/2015 by Murlin Wei
// Description: Sets up the function for the clear button method
// PRE:  The "clear" div exists and is created
// POST: returns 0 if setting up the onclick method succeeds, 1 otherwise.
function SetClearButtonOnClick() {
    // clearing selected regions when the "clear" button in clicked
    var clearButton = document.getElementById("clear");
    if(clearButton == null) {
        return 1;
    } else {
        clearButton.onclick = function() {
            var parentTabDivName = "id-"+g_StatList[g_StatID]+"-graphs";
            // removes graphs subdivs
            document.getElementById(parentTabDivName).innerHTML = "";
            // removes map selections

            g_DataList.size = 0;
            g_DataList.start = null;
            g_DataList.end = null;

            g_Clear = true;
            g_Map.clearSelectedRegions();
            g_Clear = false;
        };
        return 0;
    }

};
