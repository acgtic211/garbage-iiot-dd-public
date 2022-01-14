<script>
    import { Loader } from "google-maps";
    import { onMount } from "svelte";
    const loader = new Loader("AIzaSyBJGDpYwtxgwNAzjbfeduuwMUQPtxJX-IM");
    export let routeID = "";
    var cont;
    var truck;
    onMount(async () => {
        if (routeID == null) {
            loader.load().then(function (google) {
                initEmptyMap(google);
            });
        } else {
            loader.load().then(function (google) {
                initMap(google);
            });
            var es = new EventSource(
                "https://localhost:30003/acg:lab:virtual-routes/" +
                    routeID +
                    "/property/routeDetails/sse"
            );

            es.onmessage = function (message) {
                if (!message) {
                    console.log("no message");
                } else {
                    console.log(JSON.parse(JSON.parse(message.data)));
                    let data = JSON.parse(JSON.parse(message.data));
                    if (data.nextRoute != null) {
                        console.log("NUEVA RUTA");
                        routeID = data._id;
                        loader.load().then(function (google) {
                            initMap(google);
                        });
                    }
                }
            };
        }
    });

    async function initEmptyMap(google) {
        const map = new google.maps.Map(document.getElementById("map"), {
            zoom: 14,
            center: { lat: 36.8936, lng: -2.2653 },
            mapTypeId: "terrain",
        });
        var marker = new google.maps.Marker({
            position: { lat: 36.8936, lng: -2.2653 },
            map: map,
        });
    }

    async function initMap(google) {
        //process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

        var routepath = [];
        var req = await fetch(
            "https://localhost:30003/acg:lab:virtual-routes/" +
                routeID +
                "/property/routeDetails",
            {
                method: "GET",
            }
        );

        if (req.status == 200) var jmeh = await req.json();

        var tr = await fetch(
            "https://localhost:30002/acg:lab:virtual-trucks/" +
                jmeh.truckFrameNumber +
                "/property/truckDetails",
            {
                method: "GET",
            }
        );

        truck = await tr.json();

        cont = jmeh;
        jmeh.polyline.forEach((element) => {
            element.forEach((element2) => {
                routepath.push({ lat: element2[0], lng: element2[1] });
                //console.log(element2)
            });
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
        var marker = new google.maps.Marker({
            position: routepath[0],
            map: map,
            icon: 'images/express-delivery.png'
        });

        var containersMarkers = [];


        await cont.containersToCollect.forEach((e, index) => {
            containersMarkers[index] = new google.maps.Marker({
                position: {
                    lat: parseFloat(e.contLocation.lat),
                    lng: parseFloat(e.contLocation.lng)
                },
                map: map,
                icon: './images/garbage.png',
                id: index
            });

        });


        await moveTruck(map, routepath, marker);
    }

    async function moveTruck(map, route, marker) {
        var i = 0;

        var interval = setInterval(async () => {
            marker.setPosition(
                new google.maps.LatLng(route[i].lat, route[i].lng)
            );

            var n = cont.containersToCollect.forEach(async (e) => {
                
                var closeCont = await close(
                    parseFloat(e.contLocation.lat),
                    route[i].lat,
                    parseFloat(e.contLocation.lng),
                    route[i].lng
                );
                if (closeCont == true && !e.collected) {
                    //container collected = true
                    e.collected = true;
                    console.log("SI", e);
                    //Traer container
                    console.log(routeID);
                    /*var fmr = await fetch('https://localhost:30003/acg:lab:virtual-routes/' + routeID + '/modifyRoute', {
                            method: 'PUT',
                            body: JSON.stringify({
                                containersToCollect: cont.containersToCollect
                            }),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        });*/

                    var res = await fetch(
                        "https://localhost:30001/acg:lab:virtual-containers/" +
                            e.serialNumber +
                            "/property/containerDetails",
                        {
                            method: "GET",
                        }
                    );
                    var container = await res.json();

                    //collectGarbage container
                    truck.capacity += container.capacity;

                    var fcg = await fetch(
                        "https://localhost:30002/acg:lab:virtual-trucks/" +
                            truck.frameNumber +
                            "/action/collectGarbage",
                        {
                            method: "PUT",
                            body: JSON.stringify({ capacity: truck.capacity }),
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    //empty container aqui

                    var fec = await fetch(
                        "https://localhost:30001/acg:lab:virtual-containers/" +
                            e.serialNumber +
                            "/actions/emptyContainer",
                        {
                            method: "PUT",
                            body: {},
                        }
                    );

                    //moveTruck aqui
                    var fmt = await fetch(
                        "https://localhost:30002/acg:lab:virtual-trucks/" +
                            truck.frameNumber +
                            "/action/moveTruck",
                        {
                            method: "PUT",
                            body: JSON.stringify({
                                location: e.containerLocation,
                            }),
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                            },
                        }
                    );
                }
            });

            i++;

            if (route[i + 1] == undefined || route[i + 1] == null) {
                clearInterval(interval);
                await fetch(
                    "https://localhost:30002/acg:lab:virtual-trucks/" +
                        truck.frameNumber +
                        "/action/moveTruck",
                    {
                        method: "PUT",
                        body: JSON.stringify({
                            location: {
                                lat: 36.8936,
                                lng: -2.2653,
                            },
                        }),
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                    }
                );
            }
        }, 200);
    }

    async function close(x1, x2, y1, y2) {
        if (Math.abs(x1 - x2) > 0.001 || Math.abs(y1 - y2) > 0.001) {
            return false;
        }
        var rsq = Math.pow(0.001, 2);

        return rsq > Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
    }
</script>

<svelte:head>
    <script
        src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
</svelte:head>

<div id="map" />

<style>
    div {
        height: 500px;
    }
</style>
