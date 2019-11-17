// API key
const API_KEY = "pk.eyJ1IjoianJhbmRvbHBoMDExIiwiYSI6ImNqd2lmZTVhcjAyOWc0OG5uMWR6YWJhem0ifQ.nph25TyJjuFwA08-KgkqXw";

// Set Tiles
var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
maxZoom: 18,
id: "mapbox.outdoors",
accessToken: API_KEY
});
var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
maxZoom: 18,
id: "mapbox.satellite",
accessToken: API_KEY
});
// Make map type layer
var baseMaps = {
    Satellite: satellite,
    Outdoors: outdoors
  };
// Create our initial map object
// Set the longitude, latitude, and the starting zoom level, satellite as starting base map
var myMap = L.map("map", {
    center: [45.52, -122.67],
    zoom: 5,
    layers: [satellite]
  });

// Get Color References for Legend
function getColor(d) {
    return d > 5  ? '#8B0000' :
           d > 4  ? '#FF0000' :
           d > 3  ? '#FF8C00' :
           d > 2  ? '#FFFF00' :
           d > 1  ? '#ADFF2F' :
           d > 0  ? '#9ACD32' :
                    '#FFEDA0' ;
}
// Create Legend
var info = L.control({
    position: "bottomright"
  });
info.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "legend"),
        severities = [0,1,2,3,4,5]
        labels = [];
        for (var i = 0; i < severities.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(severities[i] + 1) + '"></i> ' +
                severities[i] + (severities[i + 1] ? '&ndash;' + severities[i + 1] + '<br>' : '+');
        }
    return div;
  };
info.addTo(myMap);

// Callback Function For Response
function createMarkers(response)
{
    var earthquakes = response.features;

    for (var index =0; index < earthquakes.length; index++) {
        // Get Place
        var place = earthquakes[index].properties.place
        // Get Coordinates  
        var lat = earthquakes[index].geometry.coordinates[1]      
        var long = earthquakes[index].geometry.coordinates[0]      
        // Get Richter Scale
        var richter = earthquakes[index].properties.mag
        // Determine Color
        if (richter >0 && richter < 1){
            richter_color = "yellowgreen"
        }
        if (richter >=1 && richter < 2){
            richter_color = "greenyellow"
        }
        if (richter >=2 && richter < 3){
            richter_color = "yellow"
        }
        if (richter >=3 && richter < 4){
            richter_color = "orange"
        }
        if (richter >=4 && richter < 5){
            richter_color = "red"
        }
        if (richter >=5){
            richter_color = "darkred"
        }

        // Make Circle
        var earthquake_marker = L.circle([lat,long], {
            color: richter_color,
            fillColor: richter_color,
            fillOpacity: 0.25,
            weight: 0.5,
            radius: richter*20000
        })
        // Add Tooltip
        earthquake_marker.bindPopup("Place: " + place + "<br>" + "Severity " + richter + " Magnitude")
        // Add to Map
        earthquake_marker.addTo(myMap);
        
    }
}

// Get Json
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);

// Map Controls
L.control.layers(baseMaps).addTo(myMap);