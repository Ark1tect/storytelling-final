var initLoad = true;
var layerTypes = {
    'fill': ['fill-opacity'],
    'line': ['line-opacity'],
    'circle': ['circle-opacity', 'circle-stroke-opacity'],
    'symbol': ['icon-opacity', 'text-opacity'],
    'raster': ['raster-opacity'],
    'fill-extrusion': ['fill-extrusion-opacity'],
    'heatmap': ['heatmap-opacity']
}

var alignments = {
    'left': 'lefty',
    'center': 'centered',
    'right': 'righty',
    'full': 'fully'
}

function getLayerPaintType(layer) {
    var layerType = map.getLayer(layer).type;
    return layerTypes[layerType];
}

function setLayerOpacity(layer) {
    var paintProps = getLayerPaintType(layer.layer);
    paintProps.forEach(function (prop) {
        var options = {};
        if (layer.duration) {
            var transitionProp = prop + "-transition";
            options = { "duration": layer.duration };
            map.setPaintProperty(layer.layer, transitionProp, options);
        }
        map.setPaintProperty(layer.layer, prop, layer.opacity, options);
    });
}

var story = document.getElementById('story');
var features = document.createElement('div');
features.setAttribute('id', 'features');

var header = document.createElement('div');

if (config.title) {
    var titleText = document.createElement('h1');
    titleText.innerText = config.title;
    header.appendChild(titleText);
}

if (config.subtitle) {
    var subtitleText = document.createElement('h2');
    subtitleText.innerText = config.subtitle;
    header.appendChild(subtitleText);
}

if (config.byline) {
    var bylineText = document.createElement('p');
    bylineText.innerText = config.byline;
    header.appendChild(bylineText);
}

if (header.innerText.length > 0) {
    header.classList.add(config.theme);
    header.setAttribute('id', 'header');
    story.appendChild(header);
}

config.chapters.forEach((record, idx) => {
    var container = document.createElement('div');
    var chapter = document.createElement('div');

    if (record.title) {
        var title = document.createElement('h3');
        title.innerText = record.title;
        chapter.appendChild(title);
    }

    if (record.image) {
        var image = new Image();
        image.src = record.image;
        chapter.appendChild(image);
    }

    if (record.description) {
        var story = document.createElement('p');
        story.innerHTML = record.description;
        chapter.appendChild(story);
    }

    container.setAttribute('id', record.id);
    container.classList.add('step');
    if (idx === 0) {
        container.classList.add('active');
    }

    chapter.classList.add(config.theme);
    container.appendChild(chapter);
    container.classList.add(alignments[record.alignment] || 'centered');
    if (record.hidden) {
        container.classList.add('hidden');
    }
    features.appendChild(container);
});

story.appendChild(features);

var footer = document.createElement('div');

if (config.footer) {
    var footerText = document.createElement('p');
    footerText.innerHTML = config.footer;
    footer.appendChild(footerText);
}

if (footer.innerText.length > 0) {
    footer.classList.add(config.theme);
    footer.setAttribute('id', 'footer');
    story.appendChild(footer);
}

mapboxgl.accessToken = config.accessToken;

const transformRequest = (url) => {
    const hasQuery = url.indexOf("?") !== -1;
    const suffix = hasQuery ? "&pluginName=scrollytellingV2" : "?pluginName=scrollytellingV2";
    return {
        url: url + suffix
    }
}

var map = new mapboxgl.Map({
    container: 'map',
    style: config.style,
    center: config.chapters[0].location.center,
    zoom: config.chapters[0].location.zoom,
    bearing: config.chapters[0].location.bearing,
    pitch: config.chapters[0].location.pitch,
    interactive: false,
    transformRequest: transformRequest,
    projection: config.projection
});


//adding the route of the cable, sourced from https://docs.mapbox.com/mapbox-gl-js/example/geojson-line///
map.on('load', () => {

    map.addSource('hydro', {
        'type': 'geojson',
        'data': "./hydro.geojson"
    });

    map.addSource('hertel', {
        'type': 'geojson',
        'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'LineString',
                'coordinates': [
                    [-73.43147059871069, 45.40860309976246],
                    [-73.43442355897821, 45.4076306416989],
                    [-73.42181669825933, 45.39251178800135],
                    [-73.45811851527498, 45.40095265154607],
                    [-73.42917530660586, 45.34013052328129],
                    [-73.45655325821652, 45.32700447298317,],
                    [-73.42965430735084, 45.28525861473891],
                    [-73.46658789937062, 45.265957136679795],
                    [-73.47807200897444, 45.2125614730723],
                    [-73.46806546006412, 45.162626262065594],
                    [-73.46892973676125, 45.09251762059595],
                    [-73.4537213908461, 45.068182376758564],
                    [-73.3780720346245, 45.06411450357629],
                    [-73.38631064737449, 45.017450993081674],
                    [-73.3486695212809, 45.01700732823233],
                    [-73.34312824241931, 45.01082719773736],
                ]
            }
        }
    });

    map.addSource('route', {
        'type': 'geojson',
        'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'LineString',
                'coordinates': [
                    [-73.34312824241931, 45.01082719773736],
                    [-73.36180992661546, 44.51949827727437],
                    [-73.308185, 44.249749],
                    [-73.3992703013945, 44.18218968456888],
                    [-73.429555, 44.026890],
                    [-73.35447761648506, 43.76949270395614],
                    [-73.37422904028365, 43.73461664280734],//putnam//
                    [-73.398232, 43.734701],
                    [-74.035911, 42.820588],
                    [-73.849511, 42.434100],
                    [-73.92027180459297, 42.14651267135619],
                    [-73.907564703141, 42.14388854089606], //Alsen: keeping track of the turns//
                    [-73.9261173975882, 42.071165627524614],
                    [-73.96023326605878, 41.90738882423592],
                    [-73.93758938066254, 41.869087746437984],
                    [-73.95141014710413, 41.84737928933477],
                    [-73.95213320828424, 41.77102599012861],
                    [-73.94132290587586, 41.75602193016511],
                    [-73.95405807257873, 41.58143531843827], //NewHamburg//
                    [-73.99613002292499, 41.523831090004954],
                    [-73.99434191581183, 41.45127644910114],
                    [-73.94748741909913, 41.39429312748052], //westpoint//
                    [-73.96738936801232, 41.34039723165803],
                    [-73.98518238013386, 41.31827505994755],
                    [-73.95300978525712, 41.288880746009966],
                    [-73.99458823108104, 41.239081869418015],
                    [-73.980632, 41.183822],
                    [-73.886337, 41.100181],
                    [-73.89853678891045, 40.99314640030494], //stateline//
                    [-73.933049, 40.877310],
                    [-73.908314, 40.865887],
                    [-73.932362, 40.832645],
                    [-73.927651, 40.801043],
                    [-73.905612, 40.793425],
                    [-73.9008218855962, 40.786981745861574], //Astoria plant//
                    [-73.90320945331622, 40.7846585318176],
                    [-73.90410084840408, 40.7824506631763],
                    [-73.90687902036444, 40.78024577738926],
                    [-73.915627, 40.786009],
                    [-73.924724, 40.778632],
                    [-73.933399, 40.766250],
                    [-73.936276, 40.767582],
                    [-73.939655, 40.766412],
                    [-73.94199111451796, 40.762833204022066],
                ]
            }
        }
    });
    map.addSource('hertel-sub', {
        'type': 'geojson',
        'data': {
            'type': 'Feature',
            'geometry': {
                'type': 'Polygon',
                'coordinates': [
                    [
                        [-73.43280838550338, 45.410377668761384],
                        [-73.42654319814663, 45.41293142412086],
                        [-73.42356578139965, 45.4093558093355],
                        [-73.42816103031232, 45.40740179976032],
                        [-73.42772957482875, 45.40693823930988],
                        [-73.42936753435055, 45.406332786212836],
                        [-73.43280838550338, 45.410377668761384]
                    ]]
            }
        }
    });
    // Add a new layer to visualize the polygon.
    map.addLayer({
        'id': 'hertel-sub',
        'type': 'fill',
        'source': 'hertel-sub',
        'layout': {},
        'paint': {
            'fill-color': 'yellow',
            'fill-opacity': .5
        }
    });

    // Add a black outline around the polygon.
    map.addLayer({
        'id': 'outline',
        'type': 'line',
        'source': 'hertel-sub',
        'layout': {},
        'paint': {
            'line-color': '#000',
            'line-width': 3
        }

    });
    map.addSource('astoria-sub', {
        'type': 'geojson',
        'data': {
            'type': 'Feature',
            'geometry': {
                'type': 'Polygon',
                'coordinates': [
                    [
                        [-73.90087240456334, 40.78752637709339],
                        [-73.90037324480433, 40.78723015149694],
                        [-73.89988339735051, 40.78749828494009],
                        [-73.89909777548976, 40.78685760308902],
                        [-73.90027511075256, 40.78592398884196],
                        [-73.90176316584063, 40.78692539337208],
                        [-73.90087240456334, 40.78752637709339]
                    ]]
            }
        }
    });
    // Add a new layer to visualize the polygon.
    map.addLayer({
        'id': 'astoria-sub',
        'type': 'fill',
        'source': 'astoria-sub',
        'layout': {},
        'paint': {
            'fill-color': '#64c8dd',
            'fill-opacity': .5
        }
    });

    // Add a black outline around the polygon.
    map.addLayer({
        'id': 'astoria-outline',
        'type': 'line',
        'source': 'astoria-sub',
        'layout': {},
        'paint': {
            'line-color': '#000',
            'line-width': 4
        }

    });
    map.addSource('rainey-sub', {
        'type': 'geojson',
        'data': {
            'type': 'Feature',
            'geometry': {
                'type': 'Polygon',
                'coordinates': [
                    [
                        [-73.94253396418293, 40.762203369057275],
                        [-73.94436761285144, 40.76286090206591],
                        [-73.94339850186003, 40.764272642056916],
                        [-73.94159687958596, 40.76369342493009],
                        [-73.94253396418293, 40.762203369057275]

                    ]]
            }
        }
    });
    // Add a new layer to visualize the polygon.
    map.addLayer({
        'id': 'rainey-sub',
        'type': 'fill',
        'source': 'rainey-sub',
        'layout': {},
        'paint': {
            'fill-color': '#64c8dd',
            'fill-opacity': .5
        }
    });

    // Add a black outline around the polygon.
    map.addLayer({
        'id': 'rainey-outline',
        'type': 'line',
        'source': 'rainey-sub',
        'layout': {},
        'paint': {
            'line-color': '#000',
            'line-width': 4
        }

    });
    map.addLayer({
        'id': 'route',
        'type': 'line',
        'source': 'route',
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': '#64c8dd',
            'line-opacity': 1,
            'line-width': 8.5
        }
    });

    map.addLayer({
        id: 'hydro',
        type: 'circle',
        source: 'hydro',
        paint: {
            'circle-radius': 6,
            'circle-color': '#1B75BB',
            'circle-stroke-color': '#FFF',
            'circle-stroke-width': 1
        }
    });

    map.addLayer({
        'id': 'hertel',
        'type': 'line',
        'source': 'hertel',
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': 'yellow',
            'line-opacity': 0.8,
            'line-width': 8.5
        }
    });


});
//making the polygons clickable//
map.on('click', 'hertel-sub', (e) => {
    var hertpop = new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML('<h1>Hidden in Plain Sight </h1> <p>The HVDC cables connecting Hertel Substation to New York will mostly run next to roads and follow highway right-of-ways</p>')
        .addTo(map);
});

// Change the cursor to a pointer when
// the mouse is over the states layer.
map.on('mouseenter', 'hertel-sub', () => {
    map.getCanvas().style.cursor = 'pointer';
});

// Change the cursor back to a pointer
// when it leaves the states layer.
map.on('mouseleave', 'hertel-sub', () => {
    map.getCanvas().style.cursor = '';
});

map.on('click', 'astoria-sub', (e) => {
    var astpop = new mapboxgl.Popup({ offset: [300, -25] })
        .setLngLat(e.lngLat)
        .setHTML('<h1>Evolving Energy</h1> <p>As New York works to complete the new converter station, other nearby properties may soon look different as well. An offshore wind company recently purchased the nearby NRG fossil-fuel powered energy plant and plans to use the site as a connection point to a large-scale wind farm off of Long Island.</p>')
        .addTo(map);
});

map.on('mouseenter', 'astoria-sub', () => {
    map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'astoria-sub', () => {
    map.getCanvas().style.cursor = '';
});

map.on('click', 'rainey-sub', (e) => {
    var raineypop = new mapboxgl.Popup({ offset: [250, 0] })
        .setLngLat(e.lngLat)
        .setHTML('<h1>Asthma Alley No More?</h1><p>Western Queens has been infamous for poor air quality resulting from the concetnration of power plants in the area. The CHPE could result in a savings of over 3.7 million metric tons of harmful emmisions, according to projections published by the Governor\'s office.</p>')
        .addTo(map);
});
map.on('mouseenter', 'rainey-sub', () => {
    map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'rainey-sub', () => {
    map.getCanvas().style.cursor = '';
});


// Create a inset map if enabled in config.js
if (config.inset) {
    var insetMap = new mapboxgl.Map({
        container: 'mapInset', // container id
        style: 'mapbox://styles/nw2257/clw8e1agu00mz01qgb0a82d5m', //hosted style id
        center: config.chapters[0].location.center,
        // Hardcode above center value if you want insetMap to be static.
        zoom: 10, // starting zoom
        hash: false,
        interactive: false,
        attributionControl: false,
        //Future: Once official mapbox-gl-js has globe view enabled,
        //insetmap can be a globe with the following parameter.
        //projection: 'globe'
    });
}

if (config.showMarkers) {
    var marker = new mapboxgl.Marker({ color: config.markerColor });
    marker.setLngLat(config.chapters[0].location.center).addTo(map);
}

// instantiate the scrollama
var scroller = scrollama();


map.on("load", function () {
    if (config.use3dTerrain) {
        map.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            'tileSize': 512,
            'maxzoom': 14
        });
        // add the DEM source as a terrain layer with exaggerated height
        map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

        // add a sky layer that will show when the map is highly pitched
        map.addLayer({
            'id': 'sky',
            'type': 'sky',
            'paint': {
                'sky-type': 'atmosphere',
                'sky-atmosphere-sun': [0.0, 0.0],
                'sky-atmosphere-sun-intensity': 15
            }
        });
    };

    // As the map moves, grab and update bounds in inset map.
    if (config.inset) {
        map.on('move', getInsetBounds);
    }
    // setup the instance, pass callback functions
    scroller
        .setup({
            step: '.step',
            offset: 0.5,
            progress: true
        })
        .onStepEnter(async response => {
            var current_chapter = config.chapters.findIndex(chap => chap.id === response.element.id);
            var chapter = config.chapters[current_chapter];

            response.element.classList.add('active');
            map[chapter.mapAnimation || 'flyTo'](chapter.location);

            // Incase you do not want to have a dynamic inset map,
            // rather want to keep it a static view but still change the
            // bbox as main map move: comment out the below if section.
            if (config.inset) {
                if (chapter.location.zoom < 5) {
                    insetMap.flyTo({ center: chapter.location.center, zoom: 0 });
                }
                else {
                    insetMap.flyTo({ center: chapter.location.center, zoom: 3 });
                }
            }
            if (config.showMarkers) {
                marker.setLngLat(chapter.location.center);
            }
            if (chapter.onChapterEnter.length > 0) {
                chapter.onChapterEnter.forEach(setLayerOpacity);
            }
            if (chapter.callback) {
                window[chapter.callback]();
            }
            if (chapter.rotateAnimation) {
                map.once('moveend', () => {
                    const rotateNumber = map.getBearing();
                    map.rotateTo(rotateNumber + 180, {
                        duration: 30000, easing: function (t) {
                            return t;
                        }
                    });
                });
            }
            if (config.auto) {
                var next_chapter = (current_chapter + 1) % config.chapters.length;
                map.once('moveend', () => {
                    document.querySelectorAll('[data-scrollama-index="' + next_chapter.toString() + '"]')[0].scrollIntoView();
                });
            }
        })
        .onStepExit(response => {
            var chapter = config.chapters.find(chap => chap.id === response.element.id);
            response.element.classList.remove('active');
            if (chapter.onChapterExit.length > 0) {
                chapter.onChapterExit.forEach(setLayerOpacity);
            }
        });


    if (config.auto) {
        document.querySelectorAll('[data-scrollama-index="0"]')[0].scrollIntoView();
    }
});

//Helper functions for insetmap
function getInsetBounds() {
    let bounds = map.getBounds();

    let boundsJson = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            bounds._sw.lng,
                            bounds._sw.lat
                        ],
                        [
                            bounds._ne.lng,
                            bounds._sw.lat
                        ],
                        [
                            bounds._ne.lng,
                            bounds._ne.lat
                        ],
                        [
                            bounds._sw.lng,
                            bounds._ne.lat
                        ],
                        [
                            bounds._sw.lng,
                            bounds._sw.lat
                        ]
                    ]
                ]
            }
        }]
    }

    if (initLoad) {
        addInsetLayer(boundsJson);
        initLoad = false;
    } else {
        updateInsetLayer(boundsJson);
    }

}

function addInsetLayer(bounds) {
    insetMap.addSource('boundsSource', {
        'type': 'geojson',
        'data': bounds
    });

    insetMap.addLayer({
        'id': 'boundsLayer',
        'type': 'fill',
        'source': 'boundsSource', // reference the data source
        'layout': {},
        'paint': {
            'fill-color': '#fff', // blue color fill
            'fill-opacity': 0.2
        }
    });
    // // Add a black outline around the polygon.
    insetMap.addLayer({
        'id': 'outlineLayer',
        'type': 'line',
        'source': 'boundsSource',
        'layout': {},
        'paint': {
            'line-color': '#000',
            'line-width': 1
        }
    });
}

function updateInsetLayer(bounds) {
    insetMap.getSource('boundsSource').setData(bounds);
}



// setup resize event
window.addEventListener('resize', scroller.resize);

// NUDGE USER TO SCROLL AND INTERACT, IF IDLE FOR MORE THAN 2 MIN, NUDGE AGAIN
function hideScrollPrompt() {
    document.querySelector('.scroll-prompt').style.display = 'none';
}

// Attach event listener to hide scroll prompt on scroll
window.addEventListener('scroll', hideScrollPrompt);

