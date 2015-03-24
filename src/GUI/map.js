// File Name:		map.js
// Description:		This module generates a map inside the div 'map', and
//			defines a listener for the button "clear"
// Date Created:	2/24/2015
// Contributors:	Vanajam Soni, Joshua Crafts
// Date Last Modified:	3/23/2015
// Last Modified By:	Joshua Crafts
// Dependencies:	index.html, descriptor.php, by_stat.php, lookup_table.js, loading_script.js, data.js
// Additional Notes:	N/A


// Author: Vanajam Soni, Joshua Crafts
// Date Created: 2/24/2015
// Last Modified: 3/23/2015 by Joshua Crafts
// Description: This function initializes the map, fills up the textarea 'cc2_
//		selected' with the list of selected regions and clears the map
//		on the click of button "clear"
// PRE: index.html and div with id "map" exist 
// POST: The map is initialized in the div "map"
$(function(){
    ColorByHMS = function(){
        var data = {},
            key;

        for (key in map.regions) {
            for (var i in g_LookupTable)
            {
                if (key === g_LookupTable[i][0] && g_LookupTable[i][2] != 0)
                {
                    data[key] = g_LookupTable[i][2];
                }
            }
        }

        console.log(data);

        return data;
    }

    map = new jvm.Map(
    {
        map: 'world_mill_en',
        container: $('#map'),
        regionsSelectable: true, // allows us to select regions
        backgroundColor: '#698091',
        regionStyle: {
            initial: {
                fill: '#999999',
                "stroke-width": 0.4,
                stroke: '#223322'
            },
            hover: {
                "fill-opacity": 0.7
            },
            selected: {
                "stroke-width": 0.4,
                stroke: '#445544',
                fill: '#eebb99'
            }
        },
        series: {
            regions: [{
                attribute: 'fill',
                // needs some random init values, otherwise dynamic region coloring won't work
                values: { ID: 148576, PG: 13120.4, MX: 40264.8, EE: 78.6, DZ: 30744.6, MA: 24344.4, MR: 14117.6, SN: 39722.6, GM: 7832.6, GW: 9902.2 },
                scale: ['#eeffee', '#115a2a'],
                normalizeFunction: 'polynomial'
            }]
        },
        // script to run when a region is selected
        onRegionSelected: function()
        {
            // Filling the textarea with list of regions selected
            document.getElementById('cc2-selected').value = JSON.stringify(map.getSelectedRegions());
        },
        onRegionTipShow: function(e, label, key){
            var tipString = "";
            tipString += label.html()+' (';
            if (map.series.regions[0].values[key] !== undefined)
            {
                tipString += g_StatList[g_HMSID]+' - '+map.series.regions[0].values[key];
            }
            else
            {
                tipString += 'No Data Available';
            }
            tipString += ')';
            label.html(tipString);
        }
    });
    // after lookup table is loaded, color map
    setTimeout(function(){
        var values = ColorByHMS();
        // have to manually set min because API function doesn't work correctly, may have to change if we have stats that can be negative
        map.series.regions[0].params.min = 0;
        map.series.regions[0].setValues(values);
    }, 1000);
    // clearing selected regions when the "clear" button in clicked
    document.getElementById("clear").onclick = function()
    {
        map.clearSelectedRegions();
    };
});