const maps         = document.getElementById("map");
const inputAddress = document.querySelector('.address');
const btnSearch    = document.querySelector('.btnSearch');
const latitude     = document.querySelector('.addrsLat');
const longitude    = document.querySelector('.addrsLong');

let map; //GOOGLE SERVICE MAP
let marker;
let infoWindow;
let infoWindowClose = false;

const geoLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;

            let latlng = new google.maps.LatLng(lat, lon);
            map.setCenter(latlng);
            markeMap(lat, lon);
            infoPosition(lat, lon);
        })
    }
}

const markeMap = (lat, lng) => {
    let latlng = new google.maps.LatLng(lat, lng);

    if (marker == undefined) {
        marker = new google.maps.Marker({
            position: latlng,
            map: map,
            draggable: true
        });
    }else{
        marker.setPosition(latlng);
    }

    infoPosition(lat, lng);

    marker.addListener('dragend', e => { infoPosition(e.latLng.lat(), e.latLng.lng())});
}

const infoPosition = (lat, lon) => {
    if (infoWindow == undefined) {
        infoWindow = new google.maps.InfoWindow({
            content: `Latitud: ${lat} <br>Longitud: ${lon}`
        });
        infoWindow.open(map, marker);
        infoWindow.addListener('closeclick', ()=>{
            infoWindowClose = true;
        });
    } else {
        infoWindow.setContent(`Latitud: ${lat} <br>Longitud: ${lon}`);
    }

    if (infoWindowClose) {
        infoWindow.open(map, marker);
        infoWindowClose = !infoWindowClose;
    }
};

btnSearch.onclick = () => {
    if (inputAddress.value && inputAddress.value.trim().length > 0) {
        const geocoder = new google.maps.Geocoder();

        geocoder.geocode({'address': inputAddress.value}, (result, status) => {
            if (status === 'OK') {
                inputAddress.value = result[0].formatted_address;
                latitude.value     = result[0].geometry.location.lat();
                longitude.value    = result[0].geometry.location.lng();

                map.setCenter(result[0].geometry.location);
                map.setZoom(12);
                markeMap(result[0].geometry.location.lat(), result[0].geometry.location.lng());
            }else {
                alert('ubicacion no encontrada');
            }
        });
    }
}

function initMap() {
    let lat = 10.506098;
    let lon = -66.9146017;
    map = new google.maps.Map(maps, {
    center: {
        lat: lat,
        lng: lon
    },
      zoom: 8,
    });

    geoLocation();
}