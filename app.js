mapboxgl.accessToken = 'pk.eyJ1IjoiZmFiaWVuZGVsb2xtbyIsImEiOiJmTGl1RWY4In0.S5btC2vTMfibP8m6LAdlqA';
markersLayer = [];
// supprimer tous les markers (de type DOM)
function removeDomMarkers() {
    if (markersLayer.length > 0) {
        for (var i = 0; i < markersLayer.length; i++) { // on supprime les marker
            markersLayer[i].remove();
        }
    }
}
function drawDomMarker() {
    // on supprime les données du layer trees
    map.getSource('trees').setData({
        "type": "FeatureCollection", "features": []
    });
    removeDomMarkers();
    $.ajax({
        url: 'data/supermarket.geojson',
        dataType: 'JSON',
        success: function (geojson) {
            geojson.features.forEach(function (feature) {
                //On crée un element DOM pour le marker
                let el = document.createElement('div');
                el.className = 'extra-marker extra-marker-circle-red';
                let icon = document.createElement('i');
                icon.className = 'fa fa-circle';
                icon.style.color = 'white';
                icon.className = 'fa fa-shopping-cart';
                el.appendChild(icon);


                var currentMarker = new mapboxgl.Marker(el, { offset: [-17, -42] });
                currentMarker['data'] = feature; // on ajoute les données de la feature dans le marker 
                markersLayer.push(currentMarker); // pour pouvoir les supprimer
                // Event onClick Marker
                el.addEventListener('click', e => {
                    console.log(currentMarker.data);
                });
                currentMarker.setLngLat(feature.geometry.coordinates)
                    .addTo(map);
            });
        }
    });
}

// recupére le Geojson le pousse en tant que donnée dans la source 'trees'
function drawWebGLMarker() {
    map.getSource('trees').setData({
        "type": "FeatureCollection", "features": []
    });
    removeDomMarkers();
    $.ajax({
        url: 'data/trees.geojson',
        dataType: 'JSON',
        success: function (geojson) {
            map.getSource('trees').setData(geojson);
        }
    });
}

var map = new mapboxgl.Map({
    container: 'map',
    style: 'basic-v9.json',
    center: [5.73551, 45.186189],
    zoom: 13
});

map.on('load', function () { // quand la carte est chargé, on défini une source vide
    map.addSource("trees", {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": []
        }
    });
    // defini le style du marker en arrière plan
    map.addLayer({
        "id": "marker",
        "type": "symbol",
        "source": "trees",
        "layout": {
            "icon-image": "marker-circle-green",
            "icon-allow-overlap": true,

            "icon-offset": [0, -12]
        }
    });
    // defini le layer icon (le symbole de l'abre)
    map.addLayer({
        "id": "icon",
        "type": "symbol",
        "source": "trees",
        "layout": {
            "icon-image": "tree-white",
            "icon-ignore-placement": true,
            "icon-offset": [0, -18]
        }
    });

    // Event OnClick 
    map.on('click', function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ['marker', 'icon'] });
        if (!features.length) {
            return;
        }
        var feature = features[0];
        console.log(feature.properties);
    });

    map.on('mousemove', function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ['marker', 'icon'] });
        map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
    });
});