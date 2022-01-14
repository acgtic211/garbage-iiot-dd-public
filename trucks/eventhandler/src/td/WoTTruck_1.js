var td = {
    "@context": "https://www.w3.org/2019/wot/td/v1",
    
    "title": "ACG Truck",
    "@type": "Truck",
    "securityDefinitions": {
        "basic_sc": {
            "scheme": "nosec"
        }
    },
    "security": [
        "nosec"
    ],
    "properties": {
        "truckDetails": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "object",
                    "properties": {
                        "lat": {
                            "type": "string"
                        },
                        "lng": {
                            "type": "string"
                        }
                    }
                },
                "totalCapacity": {
                    "type": "number",
                    "min": 0
                },
                "capacity": {
                    "type": "number",
                    "min": 0
                },
                "garbageClass": {
                    "type": "string"
                },
                "fuelCapacity": {
                    "type": "number",
                    "min": 0
                },
                "frameNumber": {
                    "type": "string"
                },
                "fuelConsumption": {
                    "type": "number",
                    "min": 0
                },
                "onRoute": {
                    "type": "boolean"
                },
                "fuel": {
                    "type": "number",
                    "min": 0
                },
                "actualRoute": {
                    "type": "string"
                }
            },
            "uriVariables": {
                "frameNumber": { "type": "number"}
            },
            "forms": [
                {
                    "op": [ "readproperty" ],
                    "href": "https://dd-garbage-trucks-controller-entrypoint:443/acg:lab:virtual-trucks/{?frameNumber}/property/truckDetails",
                    "contentType": "application/json"
                }
            ]
        },
        "fleetDetails": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "object",
                        "properties": {
                            "lat": {
                                "type": "string"
                            },
                            "lng": {
                                "type": "string"
                            }
                        }
                    },
                    "totalCapacity": {
                        "type": "number",
                        "min": 0
                    },
                    "capacity": {
                        "type": "number",
                        "min": 0
                    },
                    "garbageClass": {
                        "type": "string"
                    },
                    "fuelCapacity": {
                        "type": "number",
                        "min": 0
                    },
                    "frameNumber": {
                        "type": "string"
                    },
                    "fuelConsumption": {
                        "type": "number",
                        "min": 0
                    },
                    "onRoute": {
                        "type": "boolean"
                    },
                    "fuel": {
                        "type": "number",
                        "min": 0
                    },
                    "actualRoute": {
                        "type": "string"
                    }
                }
            },
            "forms": [
                {
                    "op": [ "readproperty" ],
                    "href": "https://dd-garbage-trucks-controller-entrypoint:443/acg:lab:virtual-trucks/property/fleetDetails",
                    "contentType": "application/json"
                }
            ]
        }
    },
    "actions": {
        "collectGarbage": {
            "title": "Collect garbage",
            "description": "Garbage from a specific container is collected",
            "input": {
                "type": "object",
                "properties": {
                    "serialNumber": {
                        "type": "number"
                    }
                }
            },
            "required": [
                "serialNumber"
            ],
            "uriVariables": {
                "frameNumber": { "type": "string" }
            },
            "forms": [
                {
                    "op": "invokeaction",
                    "href": "https://dd-garbage-trucks-controller-entrypoint:443/acg:lab:virtual-trucks/{?frameNumber}/action/collect",
                    "contentType": "application/json"
                }
            ]
        },
        "moveTruck": {
            "input": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "object",
                        "properties": {
                            "lat": {
                                "type": "string"
                            },
                            "lng": {
                                "type": "string"
                            }
                        }
                    }
                }
            },
            "required": [
                "location"
            ],
            "uriVariables": {
                "frameNumber": { "type": "string" }
            },
            "forms": [
                {
                    "op": "invokeaction",
                    "href": "https://dd-garbage-trucks-controller-entrypoint:443/acg:lab:virtual-trucks/{?frameNumber}/action/move",
                    "contentType": "application/json"
                }
            ]
        },
        "consumeFuel": {
            "description": "new fuel quantity in the fuel tank",
            "input": {
                "type": "object",
                "properties": {
                    "fuel": {
                        "type": "number"
                    }
                }
            },
            "required": [
                "fuel"
            ],
            "uriVariables": {
                "frameNumber": { "type": "string" }
            },
            "forms": [
                {
                    "op": "invokeaction",
                    "href": "https://dd-garbage-trucks-controller-entrypoint:443/acg:lab:virtual-trucks/{?frameNumber}/action/consumeFuel",
                    "contentType": "application/json"
                }
            ]
        },
        "startRoute": {
            "uriVariables": {
                "frameNumber": { "type": "string" }
            },
            "forms": [
                {
                    "op": "invokeaction",
                    "href": "https://dd-garbage-trucks-controller-entrypoint:443/acg:lab:virtual-trucks/{?frameNumber}/action/startRoute",
                    "contentType": "application/json"
                }
            ]
        },
        "stopRoute": {
            "uriVariables": {
                "frameNumber": { "type": "string" }
            },
            "forms": [
                {
                    "op": "invokeaction",
                    "href": "https://dd-garbage-trucks-controller-entrypoint:443/acg:lab:virtual-trucks/{?frameNumber}/action/stopRoute",
                    "contentType": "application/json"
                }
            ]
        },
        "refillFuel": {
            "input": {
                "type": "object",
                "properties": {
                    "fuel": {
                        "type": "number"
                    }
                }
            },
            "required": [
                "fuel"
            ],
            "uriVariables": {
                "frameNumber": { "type": "string" }
            },
            "forms": [
                {
                    "op": "invokeaction",
                    "href": "https://dd-garbage-trucks-controller-entrypoint:443/acg:lab:virtual-trucks/{?frameNumber}/action/refillFuel",
                    "contentType": "application/json"
                }
            ]
        },
        "emptyTruck": {
            "inputs": {
                "type": "object",
                "properties": {
                    "frameNumber": { "type": "string" }
                }
            },
            "forms": [
                {
                    "op": "invokeaction",
                    "href": "https://dd-garbage-trucks-controller-entrypoint:443/acg:lab:virtual-trucks/action/emptyTruck",
                    "contentType": "application/json"
                }
            ]
        },
        "changeActualRoute": {
            "inputs": {
                "type": "object",
                "properties": {
                    "nextRouteId": {
                        "type": "string"
                    },
                    "frameNumber": {
                        "type": "number"
                    }
                }
            },
            "uriVariables": {
                "frameNumber": { "type": "string" }
            },
            "forms": [
                {
                    "op": "invokeaction",
                    "href": "https://dd-garbage-trucks-controller-entrypoint:443/acg:lab:virtual-trucks/action/changeActualRoute",
                    "contentType": "application/json"
                }
            ]
        },
        "finishRoute": {
            "inputs": {
                "type": "object",
                "properties": {
                    "frameNumber": {
                        "type": "number"
                    }
                }
            },
            "forms": [
                {
                    "op": "invokeaction",
                    "href": "https://dd-garbage-trucks-controller-entrypoint:443/acg:lab:virtual-trucks/action/finishRoute",
                    "contentType": "application/json"
                }
            ]
        }
    },
    "events": {
        "noFuel": {
            "data": {
                "description": "Sends a message indicating there is no fuel",
                "type": "string"
            },
            "forms": [
                {
                    "op": [ "subscribeevent", "unsubscribeevent" ],
                    "href": "https://dd-garbage-trucks-controller-entrypoint:443/acg:lab:virtual-trucks/events/noFuel/sse",
                    "subprotocol": "sse",
                    "response": { "contentType": "text/event-stream" }
                }
            ]
        },
        "nextRoute": {
            "data": {
                "type": "string",
                "description": "sends the new route id"
            },
            "forms": [
                {
                    "op": [ "subscribeevent", "unsubscribeevent" ],
                    "href": "https://dd-garbage-trucks-controller-entrypoint:443/acg:lab:virtual-trucks/events/nextRoute/sse",
                    "subprotocol": "sse",
                    "response": { "contentType": "text/event-stream" }
                }
            ]
        },
        "routeFinished": {
            "data": {
                "type": "string"
            },
            "forms": [
                {
                    "op": [ "subscribeevent", "unsubscribeevent" ],
                    "href": "https://dd-garbage-trucks-controller-entrypoint:443/acg:lab:virtual-trucks/events/routeFinished/sse",
                    "subprotocol": "sse",
                    "response": { "contentType": "text/event-stream" }
                }
            ]
        }
    },
    "links": [
        
    ]
}

module.exports = td;