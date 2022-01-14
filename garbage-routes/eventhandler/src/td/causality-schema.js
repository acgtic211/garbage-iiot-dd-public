var t = {
    "id": 001,
    "thingId": "acg:lab:virtual-routes:---",
    "isManaged": false,
    "self": {
        "rel": "self",
        "href": "https://dd-garbage-routes-controller-entrypoint:443/acg:lab:virtual-routes/td",
        "type": "application/td+json"
    },
    "effects": {
        "routeModified": {
            "causes": [{
                "link": {
                    "rel": "newContainer",
                    "href": "https://dd-garbage-containers-controller-entrypoint:443/acg:lab:virtual-containers/td",
                    "type": "application/td+json"
                },
                "interactionType": "property",
                "interaction": "containerDetails",
                "origin": "virtualDevice"
            }],
            "hasOrder": false,
            "evalExpression": '(causes[\'property.containerDetails\'].data.capacity >= causes[\'property.containerDetails\'].data.totalCapacity * 0.9) ? processInteraction(\'self.actions.addContainer\', {"options":{"method":"PUT", "origen": causes[\'property.containerDetails\'].origen},"data":{"serialNumber": causes[\'property.containerDetails\'].data.serialNumber}}) : console.log("fallo en add container")'
        },
        "routeGenerated": {
            "causes": [{
                "link": {
                    "rel": "startRoute",
                    "href": "https://dd-garbage-trucks-controller-entrypoint:443/acg:lab:virtual-trucks/td",
                    "type": "application/td+json"
                },
                "interactionType": "action",
                "interaction": "startRoute",
                "origin": "user"
            }],
            "hasOrder": false,                                                                              
            "evalExpression": 'causes[\'action.startRoute\'] ? processInteraction(\'self.actions.generateRoute\', {"options":{"method":"PUT", "origen": causes[\'action.startRoute\'].origen},"data":{"frameNumber":causes[\'action.startRoute\'].device.slice(23,causes[\'action.startRoute\'].device.length)}}) : console.log("fallo en route started")'
        },
        "routeStopped": {
            "causes": [{
                "link": {
                    "rel": "stopRoute",
                    "href": "https://dd-garbage-trucks-controller-entrypoint:443/acg:lab:virtual-trucks/td",
                    "type": "application/td+json"
                },
                "interactionType": "property",
                "interaction": "truckDetails",
                "origin": "virtualDevice"
            },
            {
                "link": {
                    "rel": "stopRouteAction",
                    "href": "https://dd-garbage-trucks-controller-entrypoint:443/acg:lab:virtual-trucks/td",
                    "type": "application/td+json"
                },
                "interactionType": "action",
                "interaction": "stopRoute",
                "origin": "user"
            }],
            "hasOrder": false,
            "evalExpression": 'causes[\'property.truckDetails\'].data.onRoute == false && causes[\'action.stopRoute\'] ? processInteraction(\'self.actions.stopRoute\', {"options":{"method":"PUT", "origen": causes[\'property.truckDetails\'].origen},"data":{"routeId": causes[\'property.truckDetails\'].data.actualRoute}}) : console.log("fallo en route stopped")'
        },
        "routeFinished": {
            "causes": [
                {
                    "link": {
                        "rel": "truckLocation",
                        "href": "https://dd-garbage-trucks-controller-entrypoint:443/acg:lab:virtual-trucks/td",
                        "type": "application/td+json"
                    },
                    "interactionType": "property",
                    "interaction": "truckDetails",
                    "origin": "virtualDevice"
                },
                {
                    "link": {
                        "rel": "truckMoved",
                        "href": "https://dd-garbage-trucks-controller-entrypoint:443/acg:lab:virtual-trucks/td",
                        "type": "application/td+json"
                    },
                    "interactionType": "action",
                    "interaction": "moveTruck",
                    "origin": "user"
                }
            ],
            "hasOrder": false,
            "evalExpression": '(causes[\'property.truckDetails\'].data.location.lat == "36.8936" && causes[\'property.truckDetails\'].data.location.lng == "-2.2653" && causes[\'action.moveTruck\']) ? processInteraction(\'self.actions.finishRoute\', {"options": {"method": "PUT", "origen": causes[\'property.truckDetails\'].origen}, "data": {"routeId": causes[\'property.truckDetails\'].data.actualRoute}}) : console.log("fallo en route finished", causes[\'property.truckDetails\'].data)'
        }
        
    }
};

module.exports = t;