var t = {
    "id": 001,
    "thingId": "acg:lab:virtual-trucks:---",
    "isManaged": false,
    "self": {
        "rel": "self",
        "href": "https://dd-garbage-trucks-controller-entrypoint:443/acg:lab:virtual-trucks/td",
        "type": "application/td+json"
    },
    "effects": {
        "nextRoute": {
            "causes": [{
                "link": {
                    "rel": "newRoute",
                    "href": "https://dd-garbage-routes-controller-entrypoint:443/acg:lab:virtual-routes/td",
                    "type": "application/td+json"
                },
                "interactionType": "property",
                "interaction": "routesDetails",
                "origin": "virtualDevice"
            }],
            "hasOrder": false,
            "evalExpression": 'causes[\'property.routesDetails\'].data != undefined && causes[\'property.routesDetails\'].data != null && causes[\'property.routesDetails\'].data.nextRoute != null && causes[\'property.routesDetails\'].data.nextRoute != undefined ? processInteraction(\'self.actions.changeActualRoute\', {"options":{"method":"PUT", "origen":causes[\'property.routesDetails\'].origen},"data":{nextRouteId: causes[\'property.routesDetails\'].data._id}}) : console.log("fallo en nextRoute")'
        },
        "endOfRoute": {
            "causes": [
                {
                    "link": {
                        "rel": "finishRoute",
                        "href": "https://dd-garbage-routes-controller-entrypoint:443/acg:lab:virtual-routes/td",
                        "type": "application/td+json"
                    },
                    "interactionType": "property",
                    "interaction": "routesDetails",
                    "origin": "virtualDevice"
                }
            ],
            "hasOrder": false,
            "evalExpression": 'causes[\'property.routesDetails\'].data.status == "finished" ? processInteraction(\'self.actions.finishRoute\', {"options":{"method":"PUT", "origen": causes[\'property.routesDetails\'].origen},"data":{frameNumber: causes[\'property.routesDetails\'].data.truckFrameNumber}}) : console.log("fallo en endOfRoute")'
        },
        
        //processInteraction(\'self.actions.emptyTruck\', {"options":{"method":"PUT", "origen": causes[\'property.routesDetails\'].origen},"data":{frameNumber: causes[\'property.routesDetails\'].data.truckFrameNumber}})
    }
};

module.exports = t;