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
                if (key === g_LookupTable[i][0])
                {
                    data[key] = g_LookupTable[i][2];
                }
            }
        }

        console.log(data);

        return data;
    }, map;

    var map = new jvm.Map(
    {
        container: $('#map'), // container div for the map
        regionsSelectable: true, // allows us to select regions
        series: {
            regions: [{
                scale: ['#DEEBF7', '#08519C'],
                attribute: 'fill',
            }]
        },
        // script to run when a region is selected
        onRegionSelected: function()
        {
            // Filling the textarea with list of regions selected
            document.getElementById('cc2-selected').value = JSON.stringify(map.getSelectedRegions());
        }
    });
    setTimeout(function(){
        map.series.regions[0].setValues(ColorByHMS());
        map.series.regions[0].setScale(['#C8EEFF', '#0071A4']);
        map.series.regions[0].setNormalizeFunction('polynomial');
        }, 1000);
    // clearing selected regions when the "clear" button in clicked
    document.getElementById("clear").onclick = function()
    {
        map.clearSelectedRegions();
    };
});
