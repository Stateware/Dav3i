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
// Description: This function initializes our map, and also includes overrides for custom functionality
//              (on hover, on select, etc.) and some newly defined helper functions specified below.
// PRE: index.html, jvectormap/jquery-jvectormap-world-mill-en.js, and div with id "map" exist 
// POST: The map is initialized in the div "map"
$(document).ready(function() {
	g_Map = new jvm.Map(
	{
	    map: 'world_mill_en',					// load map file
	    container: $('#map'),					// specify id of container div
	    regionsSelectable: true, 				// allows us to select regions
	    backgroundColor: 'transparent',
	    regionStyle: {
		initial: {						// grey out regions without data
		    fill: '#888888'
		},
		hover: {
		    "fill-opacity": 0.7				// animate hover
		},
		selected: {
		    "stroke-width": 0.4,				// outline and color when selected
		    stroke: '#000000',
		    fill: '#7FDBFF'
		}
	    },
	    series: {
		regions: [{
		    attribute: 'fill',
		    // needs some random init values, otherwise dynamic region coloring won't work
		    values: { ID: 148576, PG: 13120.4, MX: 40264.8, EE: 78.6, DZ: 30744.6, MA: 24344.4, MR: 14117.6, SN: 39722.6, GM: 7832.6, GW: 9902.2 },
		    scale: ['#22FF70', '#1D7950'],		// specify upper and lower color bounds
		    normalizeFunction: 'polynomial'
		}]
	    },
	    // runs when a region is selected
	    onRegionSelected: function()
	    {
		if (g_Clear !== true)				// when clear is selected, each region is deselected one at a time,
		{						//  so we use this variable to avoid rebuilding the list, generating
		    BuildList(g_Map.getSelectedRegions());	//  subdivs, and generating graphs on each deselect, which would run
		    GenerateSubDivs();				//  into n^2 time
		    GenerateGraphs();
		}
	    },
	    // runs when region is hovered over
	    onRegionTipShow: function(e, label, key){
		var tipString = "",				// string to display when hovering over a country
		    i, 						// indexing variable
		    type = 0,					// type of stat
		    Format = wNumb({				// format for numbers	
			thousand: ','
		    });	

		if (g_Countries[key] !== undefined)		// if entry exists for region, use server-defined
		{							//  name in hover tip
		    tipString += g_Countries[key] + " - ";
		}
		else						// else use name defined in map	file
		{
		    tipString += label.html()+" - ";
		}
		if (g_Stats[g_StatId]['name'] === 'Vaccinations')
		{
			tipString += g_Stats[g_StatId]['subName'][g_IntHms] + ' ' + g_Stats[g_StatId]['name'];
		}
		else
		{
			tipString += g_Stats[g_StatId]['name'];
		}
		tipString += " in " + g_HmsYear + ": ";
		if (g_Map.series.regions[0].values[key] === undefined)		// notify if no data available
		{
		    tipString += "No Data Available";
		}
		else if (g_Stats[g_StatId]['name'] === 'Vaccinations')			// else if it is vaccinations,
		{									// print percentage
		    tipString += (g_Map.series.regions[0].values[key] * 100).toFixed(0) + "%";
		}
		else								// else print data normally
		{
		    tipString += Format.to(Number(g_Map.series.regions[0].values[key]));
		}
		label.html(tipString);						// output string
	    }
	});
	// clearing selected regions when the "clear" button in clicked
	document.getElementById("clear").onclick = function()
	{
	    var parentTabDivName = "id-"+g_StatId+"-graphs";
	    // removes graphs subdivs
	    document.getElementById(parentTabDivName).innerHTML = "";
	    // removes map selections
	    g_Clear = true;
	    g_Map.clearSelectedRegions();
	    BuildList([]);
	    g_Clear = false;
	};

	ParseData();
});
