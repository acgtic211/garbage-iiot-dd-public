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
                            "type": "number"
                        },
                        "lng": {
                            "type": "number"
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
                    "href": "https://dd-garbage-trucks-controller:443/acg:lab:virtual-trucks/{?frameNumber}/property/truckDetails",
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
                                "type": "number"
                            },
                            "lng": {
                                "type": "number"
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
                    "href": "https://dd-garbage-trucks-controller:443/acg:lab:virtual-trucks/property/fleetDetails",
                    "contentType": "application/json"
                }
            ]
        }
    },
    "actions": {
        "collectGarbage": {
            "title": "Collect garbage",
            "description": "Garbage is collected, emptying the truck",
            "input": {
                "type": "object",
                "properties": {
                    "capacity": {
                        "type": "number"
                    }
                }
            },
            "required": [
                "capacity"
            ],
            "uriVariables": {
                "frameNumber": { "type": "string" }
            },
            "forms": [
                {
                    "op": "invokeaction",
                    "href": "https://dd-garbage-trucks-controller:443/acg:lab:virtual-trucks/{?frameNumber}/action/collect",
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
                                "type": "number"
                            },
                            "lng": {
                                "type": "number"
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
                    "href": "https://dd-garbage-trucks-controller:443/acg:lab:virtual-trucks/{?frameNumber}/action/move",
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
                    "href": "https://dd-garbage-trucks-controller:443/acg:lab:virtual-trucks/{?frameNumber}/action/consumeFuel",
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
                    "href": "https://dd-garbage-trucks-controller:443/acg:lab:virtual-trucks/{?frameNumber}/action/startRoute",
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
                    "href": "https://dd-garbage-trucks-controller:443/acg:lab:virtual-trucks/{?frameNumber}/action/stopRoute",
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
                    "href": "https://dd-garbage-trucks-controller:443/acg:lab:virtual-trucks/{?frameNumber}/action/refillFuel",
                    "contentType": "application/json"
                }
            ]
        },
        "emptyTruck": {
            "uriVariables": {
                "frameNumber": { "type": "string" }
            },
            "forms": [
                {
                    "op": "invokeaction",
                    "href": "https://dd-garbage-trucks-controller:443/acg:lab:virtual-trucks/{?frameNumber}/action/emptyTruck",
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
                    }
                }
            },
            "uriVariables": {
                "frameNumber": { "type": "string" }
            },
            "forms": [
                {
                    "op": "invokeaction",
                    "href": "https://dd-garbage-trucks-controller:443/acg:lab:virtual-trucks/{?frameNumber}/action/nextRoute",
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
                    "href": "https://dd-garbage-trucks-controller:443/acg:lab:virtual-trucks//action/finishRoute",
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
                    "href": "https://dd-garbage-trucks-controller:443/acg:lab:virtual-trucks/events/noFuel/sse",
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
                    "href": "https://dd-garbage-trucks-controller:443/acg:lab:virtual-trucks/events/nextRoute/sse",
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
                    "href": "https://dd-garbage-trucks-controller:443/acg:lab:virtual-trucks/events/routeFinished/sse",
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