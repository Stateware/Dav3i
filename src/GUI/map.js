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
            key;

        // iterate through regions by key
        for (key in map.regions) {
            // iterate through lookup table by index
            for (var i in g_LookupTable)
            {
                // set value by key if key is equal to cc2 in lookup table
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
            // Filling the textarea with list of regions selected
            ModifyData(map.getSelectedRegions());
            var cc2_list = [];
            for(var i = 0;i<g_DataList.size;i++) {
                    if(g_DataList.item(i) != null)
                        cc2_list[cc2_list.length] = g_DataList.item(i).cc2;
            }
            GenerateGraphs();
        },
        // runs when region is hovered over
        onRegionTipShow: function(e, label, key){
            var tipString = "";
            tipString += label.html()+' (';
            if (map.series.regions[0].values[key] !== undefined)
            {
                tipString += g_StatList[g_StatID]+' - '+map.series.regions[0].values[key];
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
        // try HMS coloring until valid data is available
        while (values === undefined)
        {
            setTimeout(function(){values = ColorByHMS()}, 1000);
        }
        // have to manually set min because API function doesn't work correctly, may have to change if we have stats that can be negative
        map.series.regions[0].params.min = 0;
        map.series.regions[0].setValues(values);
    }, 1000);
    // clearing selected regions when the "clear" button in clicked
    document.getElementById("clear").onclick = function()
    {
		var parentTabDivName = "id-"+g_StatList[g_StatID]+"-graphs";
		// removes graphs subdivs
		document.getElementById(parentTabDivName).innerHTML = "";
		// removes map selections
		map.clearSelectedRegions();
	}
});
