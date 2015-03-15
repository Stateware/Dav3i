// File Name:		map.js
// Description:		This module generates a map inside the div 'map', and
//			defines a listener for the button "clear"
// Date Created:	2/24/2015
// Contributors:	Vanajam Soni, Joshua Crafts
// Date Last Modified:	3/15/2015
// Last Modified By:	Joshua Crafts
// Dependencies:	index.html
// Additional Notes:	N/A


// Author: Vanajam Soni
// Date Created: 2/24/2015
// Last Modified: 3/15/2015 by Joshua Crafts
// Description: This function initializes the map, fills up the textarea 'cc2_
//		selected' with the list of selected regions and clears the map
//		on the click of button "clear"
// PRE: index.html and div with id "map" exist 
// POST: The map is initialized in the div "map"
$(function()
{
    var map = new jvm.Map(
    {
        container: $('#map'),	// container div for the map
        backgroundColor: '#7D7ABC',
        regionsSelectable: true,	// allows us to select regions
		
        regionStyle: 
        {
            initial:	// color of non-selected regions
            {
                fill: '#FFFFFF'
            },
            hover:	// color and border color when hovering
            {
                fill: '#FFFFFF',
                stroke: '#F8F4A5',
                "stroke-width": 1
            },
            selected:	// color and border color when selected
            {
                fill: '#C1BFB5',
                stroke: '#000000',
                "stroke-width": 1,
                "stroke-opacity": 0.5
            },
        },
		
        // script to run when a region is selected
        onRegionSelected: function()
        {
            // Storing selected regions in the windows local cache
            if (window.localStorage) 
            {
                window.localStorage.setItem(
                    'jvectormap-selected-regions',
                    JSON.stringify(map.getSelectedRegions())
                );
            }
			
            // Filling the textarea with list of regions selected 
            document.getElementById('cc2-selected').value = JSON.stringify(map.getSelectedRegions());
        }
    });

    // clearing selected regions when the "clear" button in clicked
    document.getElementById("clear").onclick = function() 
    {
        map.clearSelectedRegions();
    };
});
