
	var gdpData = {
		"AF": 16.63,
		"AL": 11.58,
		"DZ": 158.97,
		"IN": 150,
		"US": 20
	};

	$(function(){
  var map,
      markers = [
        {latLng: [52.50, 13.39], name: 'Berlin'},
        {latLng: [53.56, 10.00], name: 'Hamburg'},
        {latLng: [48.13, 11.56], name: 'Munich'},
        {latLng: [50.95, 6.96], name: 'Cologne'},
        {latLng: [50.11, 8.68], name: 'Frankfurt am Main'},
        {latLng: [48.77, 9.17], name: 'Stuttgart'},
        {latLng: [51.23, 6.78], name: 'Düsseldorf'},
        {latLng: [51.51, 7.46], name: 'Dortmund'},
        {latLng: [51.45, 7.01], name: 'Essen'},
        {latLng: [53.07, 8.80], name: 'Bremen'}
      ],
      cityAreaData = [
        887.70,
        755.16,
        310.69,
        405.17,
        248.31,
        207.35,
        217.22,
        280.71,
        210.32,
        325.42
      ]

  map = new jvm.Map({
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
