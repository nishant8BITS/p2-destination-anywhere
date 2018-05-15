/*
* Variables
*/

var map;
var attractions = [];
var accommodation = [];
var restaurants = [];

/*
* Functions
*/


// Create map
function initMap(cities_list) {

    if (typeof (cities_list) === 'undefined') {
        cities_list = "all_cities";
    }

    // Create map
    var center = { lat: 40.4165, lng: -3.70256 };
    map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 2,
        styles: map_styles
    });

    getCities(cities_list).then(function (cities) {
        // Create city markers
        createCityMarkers(cities);
    });
};

// Create city markers
function createCityMarkers(cities) {
    var markers = cities.map(function (city, i) {
        var city_label;
        cities.length > 10 ? city_label = `${city.name}` : city_label = `${city.rank}. ${city.name}`;
        return new google.maps.Marker({
            position: { lat: city.lat, lng: city.lon },
            label: city_label
        });
    });

    // Add event listners for city markers
    createCityHandlers(markers);

    // Create clusters
    var markerCluster = new MarkerClusterer(map, markers,
        { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });
};

// Create city marker click handlers
function createCityHandlers(markers) {
    markers.forEach(function (marker) {
        google.maps.event.addListener(marker, 'click', function () {
            map.setZoom(12);
            map.setCenter(marker.getPosition());

            // Update navigation (router.js)
            cityMarkerClicked();

            // Get places (venues) in the city
            getPlaces(marker);

            // Create markers and populate venue-lists section
            displayPlaces();
        });
    });
};

function getCities(cities_list) {
    switch (cities_list) {
        case 'all_cities':
            return $.getJSON("assets/data/all_cities.json").then(function (data) {
                return data;
            });
            break;
        case 'top_10_culture':
            return $.getJSON("assets/data/top_10_culture.json").then(function (data) {
                return data;
            });
            break;
        case 'top_10_food':
            return $.getJSON("assets/data/top_10_food.json").then(function (data) {
                return data;
            });
            break;
        case 'top_10_shopping':
            return $.getJSON("assets/data/top_10_shopping.json").then(function (data) {
                return data;
            });
            break;
        default:
            console.log('Invalid cities list');
    }
};

function getPlaces(city) {
    var types = [['lodging'], ['bar'], ['restaurant'], ['amusement_park'], ['aquarium'], ['art_gallery'], ['museum'], ['zoo']];
    service = new google.maps.places.PlacesService(map);

    types.forEach(function (type) {
        var request = {
            location: city.position,
            radius: '500',
            type: type
        };
        service.nearbySearch(request, placesCallback);
    });
};

function placesCallback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            var place = results[i];

            // Sort places into categories
            if (place.types.includes('lodging')) {
                accommodation.push(place);
            };

            if (place.types.includes('bar') || place.types.includes('restaurant')) {
                restaurants.push(place);
            };

            if (place.types.includes('amusement_park') || place.types.includes('aquarium') || place.types.includes('art_gallery') || place.types.includes('museum') || place.types.includes('zoo')) {
                attractions.push(place);
            };
        }
    }
};

function displayPlaces() {

    setTimeout(function() {
        console.log("attractions: " + attractions.length);
        attractions.forEach(function (place) {
            console.log(`Type: ${place.types}, Name: ${place.name}`);
        });
    }, 1000);
    setTimeout(function() {
        console.log("accommodation: " + accommodation.length);
        accommodation.forEach(function (place) {
            console.log(`Type: ${place.types}, Name: ${place.name}`);
        });
    }, 1000);
    setTimeout(function() {
        console.log("restaurants: " + restaurants.length);
        restaurants.forEach(function (place) {
            console.log(`Type: ${place.types}, Name: ${place.name}`);
        });
    }, 1000);

};

var map_styles = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ebe3cd"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#523735"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#f5f1e6"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#c9b2a6"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#dcd2be"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ae9e90"
            }
        ]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dfd2ae"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dfd2ae"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#93817c"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#a5b076"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#447530"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f1e6"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#fdfcf8"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f8c967"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#e9bc62"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e98d58"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#db8555"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#806b63"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dfd2ae"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#8f7d77"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#ebe3cd"
            }
        ]
    },
    {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dfd2ae"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#09a2d0"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#92998d"
            }
        ]
    }
];