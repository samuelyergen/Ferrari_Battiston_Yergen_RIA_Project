let geoloc = navigator.geolocation ;




function onSuccess(position) {
    
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    let mymap = L.map('mapid').setView([lat, long], 13);
    
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2FteWVyZ2VuIiwiYSI6ImNrcDQxNWp5bTA3bXYycHMxN2E5d3FsbGUifQ.8HzGiLBN01_CDZq1EaHkXw', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'your.mapbox.access.token'
}).addTo(mymap);
    
var popup = L.popup()
    .setLatLng([lat, long])
    .setContent("You are here")
    .openOn(mymap);    
    
};

function onError(error) {
      console.log("problem");
};

navigator.geolocation.getCurrentPosition(onSuccess, onError);





