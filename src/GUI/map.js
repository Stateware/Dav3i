// File Name:               map.js
// Description:             Initialization of map
// Date Created:            2/24/2015
// Contributors:            Vanajam Soni
// Date Last Modified:      2/26/2015
// Last Modified By:        Vanajam Soni
// Dependencies:            index.html
// Additional Notes:        N/A


// Author: Vanajam Soni
// Date Created: 3/4/2015
// Last Modified: 3/4/2015 by Vanajam Soni
// Description: This function initializes the map, fills up the textarea 'cc2_
// 				selected' with the list of selected regions and clears the map
//				on the click of button "clear"
// PRE: index.html and div with id "map" exist 
// POST: The map is initialized in the div "map"
$(function()
{
	var map = new jvm.Map(
	{
		container: $('#map'),
		regionsSelectable: true,
		
		// colors for selected and non-selected regions
		regionStyle: 
		{
			initial: 
			{
				fill: '#FFFFFF'
			},
			selected: 
			{
				fill: '#F4A582'
			}
		},
		
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
		},
		onMarkerSelected: function()
		{
			if (window.localStorage) 
			{
				window.localStorage.setItem(
					'jvectormap-selected-markers',
					JSON.stringify(map.getSelectedMarkers())
				);
			}
		}
	});
	
	// in case of a refresh, setting selected regions to the list of regions in
	// cache
	map.setSelectedRegions( JSON.parse( window.localStorage.getItem('jvectormap-selected-regions') || '[]' ) );
	map.setSelectedMarkers( JSON.parse( window.localStorage.getItem('jvectormap-selected-markers') || '[]' ) );
	
	// clearing selected regions when the "clear" button in clicked
	document.getElementById("clear").onclick = function() 
	{
		map.clearSelectedRegions();
	};

	
});
