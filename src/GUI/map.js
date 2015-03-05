// File Name:				map.js
// Description:				This module generates a map inside the div 'map', and
//							defines a listener for the button "clear"
// Date Created:			2/24/2015
// Contributors:			Vanajam Soni
// Date Last Modified:		3/5/2015
// Last Modified By:		Vanajam Soni
// Dependencies:			N/A
// Additional Notes:		N/A


// Author: Vanajam Soni
// Date Created: 2/24/2015
// Last Modified: 3/5/2015 by Vanajam Soni
// Description: This function initializes the map, fills up the textarea 'cc2_
//				selected' with the list of selected regions and clears the map
//				on the click of button "clear"
// PRE: index.html and div with id "map" exist 
// POST: The map is initialized in the div "map"
$(function()
{
	var map = new jvm.Map(
	{
		container: $('#map'),	// container div for the map
		regionsSelectable: true,	// allows us to select regions
		
		regionStyle: 
		{
			initial:	// color of non-selected regions
			{
				fill: '#FFFFFF'
			},
			selected:	// color of selected regions
			{
				fill: '#F4A582'
			}
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
			document.getElementById('cc2_selected').value = JSON.stringify(map.getSelectedRegions());
		}
	});
	
	// in case of a refresh, setting selected regions to the list of regions in cache
	map.setSelectedRegions( JSON.parse( window.localStorage.getItem('jvectormap-selected-regions') || '[]' ) );
	map.setSelectedMarkers( JSON.parse( window.localStorage.getItem('jvectormap-selected-markers') || '[]' ) );
	
	// clearing selected regions when the "clear" button in clicked
	document.getElementById("clear").onclick = function() 
	{
		map.clearSelectedRegions();
	};

	
});
