// File Name:               map.js
// Description:             Initialization of map
// Date Created:            2/24/2015
// Contributors:            Vanajam Soni
// Date Last Modified:      2/26/2015
// Last Modified By:        Vanajam Soni
// Dependencies:            index.html
// Additional Notes:        N/A


$(function(){
	var map = new jvm.Map({
		container: $('#map'),
		regionsSelectable: true,
		regionStyle: {
			initial: {
				fill: '#FFFFFF'
			},
			selected: {
				fill: '#F4A582'
			}
		},
		
		onRegionSelected: function(){
			if (window.localStorage) {
				window.localStorage.setItem(
					'jvectormap-selected-regions',
					JSON.stringify(map.getSelectedRegions())
				);
			}
			document.getElementById('cc2_selected').value = JSON.stringify(map.getSelectedRegions());
		},
		onMarkerSelected: function(){
			if (window.localStorage) {
				window.localStorage.setItem(
					'jvectormap-selected-markers',
					JSON.stringify(map.getSelectedMarkers())
				);
			}
		}
	});
	map.setSelectedRegions( JSON.parse( window.localStorage.getItem('jvectormap-selected-regions') || '[]' ) );
	map.setSelectedMarkers( JSON.parse( window.localStorage.getItem('jvectormap-selected-markers') || '[]' ) );
	
	document.getElementById("clear").onclick = function() {
		map.clearSelectedRegions();
	};

	
});
