// This example requires the Drawing library. Include the libraries=drawing
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=drawing">

function moveTruck(map, route , marker){

    var i = 0
    
    setInterval(()=>{
        marker.setPosition( new google.maps.LatLng( route[i].lat, route[i].lng ) );
        //map.panTo( new google.maps.LatLng(route[i].lat, route[i].lng) );
        //truck controller cambia posicion camion
        i++;
    },10)
    
}



function initMap() {
    


    //process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    var routepath = []

    var req = new XMLHttpRequest();
    req.open('GET', 'https://localhost:30003/acg:lab:virtual-routes/61b1eac8592c80dafbcb724c/property/routeDetails', false);
    req.send(null);
    if (req.status == 200)
    var jmeh = JSON.parse(req.response)
    jmeh.polyline.forEach(element => {
        element.forEach(element2=>{
            routepath.push({lat: element2[0], lng: element2[1]})
        })       
    });

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: routepath[0],
        mapTypeId: "terrain",
    });
    const path = new google.maps.Polyline({
        path: routepath,
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
    });
    path.setMap(map);
    var marker = new google.maps.Marker( {position: routepath[0], map: map} );
    // /acg:lab:virtual-routes/:id/property/routeDetails
    moveTruck( map, routepath, marker)
}

 