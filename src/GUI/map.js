
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
      document.getElementById('test').value = JSON.stringify(map.getSelectedRegions());
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
});
