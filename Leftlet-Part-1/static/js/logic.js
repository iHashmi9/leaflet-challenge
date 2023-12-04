let myMap = L.map("map", {
    center: [37.96044, -100.30695],
    zoom: 5
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

d3.json(geoData).then(function(data) {

    data.features.forEach(function(feature) {

        let magnitude = feature.properties.mag;
        let depth = feature.geometry.coordinates[2];
        let coordinates = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];

        let color = getColor(depth);

        L.circle(coordinates, {
            radius: magnitude * 50000,
            color: 'black',
            fillColor: color,
            fillOpacity: 0.7,
            weight: 0.5
        }).bindPopup(`<strong>Location:</strong> ${feature.properties.place}<br><strong>Magnitude:</strong> ${magnitude}<br><strong>Depth:</strong> ${depth} km`).addTo(myMap);
    });

    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        div.style.backgroundColor = 'white'; 
        let depthLabels = ['-10-10', '10-30', '30-50', '50-70', '70-90', '90+'];
        let depthColors = ['#5DFF5D', '#A2FFA2', '#FFFFB3', '#FFDAB3', '#FFA07A', '#FF6347']; 

        for (let i = 0; i < depthColors.length; i++) {
            div.innerHTML += `<div style="background:${depthColors[i]}; width: 25px; height: 25px; display: inline-block; margin-right: 10px;"></div>${depthLabels[i]}<br>`;
        }

        return div;
    };

    legend.addTo(myMap);
});

function getColor(depth) {
    if (depth < -10) return '#00FF00'; 
    else if (depth >= -10 && depth < 10) return '#00FF00'; 
    else if (depth >= 10 && depth < 30) return '#FFA500'; 
    else return '#FF0000'; 
}