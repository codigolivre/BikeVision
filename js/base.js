document.addEventListener('DOMContentLoaded',initialize);

function initialize(){
	
	var bicicletar = new L.layerGroup();
	var bicicletarIcon = L.icon({
		iconUrl: 'bicycle.png',
		iconSize: [25,25]
	});
	var bicicletario = new L.layerGroup();
	var bicicletarioIcon = L.icon({
		iconUrl: 'bike_park.png',
		iconSize: [25, 25]
	});
	var airPump = new L.layerGroup();
	var airPumpIcon = L.icon({
		iconUrl: 'airPump_icon.png',
		iconSize: [25, 25]
	});
	var bicicletaria = new L.layerGroup();
	var bicicletariaIcon = L.icon({
		iconUrl: 'bikeshop.png',
		iconSize: [25, 25]
	});
	for( var point in data.elements){
		switch(data.elements[point].tags.amenity){
			case 'bicycle_rental' : L.marker([data.elements[point].lat, data.elements[point].lon], {icon: bicicletarIcon}).bindPopup('Bicicletar '+data.elements[point].tags.name).addTo(bicicletar);
				break;
			case 'bicycle_parking' : L.marker([data.elements[point].lat, data.elements[point].lon], {icon: bicicletarioIcon}).bindPopup('Estacionamento - '+data.elements[point].tags.name).addTo(bicicletario);
				break;
			case 'fuel' : L.marker([data.elements[point].lat, data.elements[point].lon], {icon: airPumpIcon}).bindPopup('Calibragem - '+data.elements[point].tags.name).addTo(airPump);
				break;
		}	
		if(data.elements[point].tags.shop == "bicycle"){
			L.marker([data.elements[point].lat, data.elements[point].lon], {icon: bicicletariaIcon}).bindPopup('Bicicletaria '+data.elements[point].tags.name).addTo(bicicletaria);
		}
	}	
	var mapboxURL = 'https:\/\/a.tiles.mapbox.com\/v4\/mapbox.streets\/{z}\/{x}\/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpbTgzcHQxMzAxMHp0eWx4bWQ1ZHN2NGcifQ.WVwjmljKYqKciEZIC3NfLA';
	var BING_KEY = 'AuhiCJHlGzhg93IqUH_oCpl_-ZUrIE6SPftlyGYUvr9Amx5nzA-WqGcPquyFZl4L';
	var osmURL = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
	var cyclesURL =  'http://tile.lonvia.de/cycling/{z}/{x}/{y}.png';
	var ocmapUrl = 'https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png';
	
	var mapboLayer = L.tileLayer(mapboxURL,{maxZoom: 18});
	var bingLayer = L.tileLayer.bing(BING_KEY);
	var omsLayer = L.tileLayer(osmURL,{maxZoom: 18});
	var cycle = L.tileLayer(cyclesURL,{maxZoom: 18});
	var ocmap = L.tileLayer(ocmapUrl,{maxZoom: 18});
	
	
	var map = L.map('map',{
		center: [-3.7487, -38.5243],
		zoom: 14,
		layers: [mapboLayer, cycle, bicicletar, bicicletario, airPump, bicicletaria]
	});
	var base = {
			"MapBox": mapboLayer,
			"Bing Maps": bingLayer,
			"Open Street Map": omsLayer,
			"OpenCycleMap": ocmap,
	};
	var layers = {
			"Infra Cicloviária": cycle,
			"Bicicletar": bicicletar,
			"Bicicletário": bicicletario,
			"Posto (Bombas de Ar)": airPump,
			"Bicicletaria": bicicletaria
	};
	L.control.layers(base,layers).addTo(map);
	
	//https://github.com/domoritz/leaflet-locatecontrol
	lc = L.control.locate({
    		strings: {
        	title: "Onde estou?"
    		}
	}).addTo(map);
    		
	// https://github.com/perliedman/leaflet-control-geocoder
   	var geocoder = new L.Control.geocoder({position: "topleft", collapsed: true, showResultIcons: true});
   	map.addControl(geocoder);
   	geocoder.markGeocode = function(result) {
	map.fitBounds(result.bbox);
   	};
   	
	function onLocationFound(e) {
		var radius = e.accuracy / 2;
		var cursor = L.icon({
			iconUrl: 'cursor.png',
			iconSize: [15, 15]
		});
		L.marker(e.latlng,{icon: cursor}).addTo(map).bindPopup("Precisão " + radius + " metros deste ponto").openPopup();

		L.circle(e.latlng, radius).addTo(map);
	}

	function onLocationError(e) {
		alert(e.message);
	}
	
	function Locale(){
    	map.locate({setView: true, maxZoom: 17});
    	map.on('locationfound', onLocationFound);
	map.on('locationerror', onLocationError);
	};
}
