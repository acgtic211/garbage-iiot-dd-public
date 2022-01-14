var td = {
    "@context": "https://www.w3.org/2019/wot/td/v1",

    "title": "ACG Route",
    "@type": "Garbage Route",
    "securityDefinitions": {
        "basic_sc": {
            "scheme": "nosec"
        }
    },
    "security": [
        "nosec"
    ],
    "properties": {
        "routeDetails": {
            "type": "object",
            "properties": {
                "polyline": {
                    "type": "object",
                    "properties": {
                        "coordinates": {
                            "type": "array",
                            "items": {
                                "type": "array",
                                "items": {
                                    "type": "number"
                                }
                            }
                        }
                    }
                },
                "truckFrameNumber": {
                    "type": "number",
                    "min": 0
                },
                "nextRoute": {
                    "type": "string"
                },
                "previousRoute": {
                    "type": "string"
                },
                "status": {
                    "type": "string"
                },
                "garbageClass": {
                    "type": "string"
                },
                "expectedCapacity": {
                    "type": "number"
                },
                "containersToCollect": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "serialNumber": {
                                "type": "number"
                            },
                            "collected": {
                                "type": "boolean"
                            },
                            "containerLocation": {
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
                    }
                }
            },
            "uriVariables": {
                "routeId": { "type": "string" }
            },
            "forms": [
                {
                    "op": "readproperty",
                    "href": "https://dd-garbage-routes-controller-entrypoint:443/acg:lab:virtual-routes/{?routeId}/property/routeDetails",
                    "contentType": "application/json"
                }
            ]
        },
        "activeRouteDetails": {
            "type": "object",
            "properties": {
                "polyline": {
                    "type": "object",
                    "properties": {
                        "coordinates": {
                            "type": "array",
                            "items": {
                                "type": "array",
                                "items": {
                                    "type": "number"
                                }
                            }
                        }
                    }
                },
                "truckFrameNumber": {
                    "type": "number",
                    "min": 0
                },
                "nextRoute": {
                    "type": "string"
                },
                "previousRoute": {
                    "type": "string"
                },
                "status": {
                    "type": "string"
                },
                "garbageClass": {
                    "type": "string"
                },
                "expectedCapacity": {
                    "type": "number"
                },
                "containersToCollect": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "serialNumber": {
                                "type": "number"
                            },
                            "collected": {
                                "type": "boolean"
                            },
                            "containerLocation": {
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
                    }
                }
            },
            "uriVariables": {
                "routeId": { "type": "string" }
            },
            "forms": [
                {
                    "op": "readproperty",
                    "href": "https://dd-garbage-routes-controller-entrypoint:443/acg:lab:virtual-routes/{?routeId}/property/activeRouteDetails",
                    "contentType": "application/json"
                }
            ]
        },
        "routesDetails": {
            "description": "Shows details from all routes",
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "polyline": {
                        "type": "object",
                        "properties": {
                            "coordinates": {
                                "type": "array",
                                "items": {
                                    "type": "array",
                                    "items": {
                                        "type": "number"
                                    }
                                }
                            }
                        }
                    },
                    "truckFrameNumber": {
                        "type": "number",
                        "min": 0
                    },
                    "nextRoute": {
                        "type": "string"
                    },
                    "previousRoute": {
                        "type": "string"
                    },
                    "status": {
                        "type": "string"
                    },
                    "garbageClass": {
                        "type": "string"
                    },
                    "expectedCapacity": {
                        "type": "number"
                    },
                    "containersToCollect": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "serialNumber": {
                                    "type": "number"
                                },
                                "collected": {
                                    "type": "boolean"
                                }
                            }
                        }
                    }
                }
            },
            "forms": [
                {
                    "op": "readproperty",
                    "href": "https://dd-garbage-routes-controller-entrypoint:443/acg:lab:virtual-routes/property/routesDetails",
                    "contentType": "application/json"
                }
            ]
        },
        "activeRoutesDetails": {
            "description": "Shows details from all active routes",
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "polyline": {
                        "type": "object",
                        "properties": {
                            "coordinates": {
                                "type": "array",
                                "items": {
                                    "type": "array",
                                    "items": {
                                        "type": "number"
                                    }
                                }
                            }
                        }
                    },
                    "truckFrameNumber": {
                        "type": "number",
                        "min": 0
                    },
                    "nextRoute": {
                        "type": "string"
                    },
                    "previousRoute": {
                        "type": "string"
                    },
                    "status": {
                        "type": "string"
                    },
                    "garbageClass": {
                        "type": "string"
                    },
                    "expectedCapacity": {
                        "type": "number"
                    },
                    "containersToCollect": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "serialNumber": {
                                    "type": "number"
                                },
                                "collected": {
                                    "type": "boolean"
                                },
                                "containerLocation": {
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
                        }
                    }
                }
            },
            "forms": [
                {
                    "op": "readproperty",
                    "href": "https://dd-garbage-routes-controller-entrypoint:443/acg:lab:virtual-routes/property/activeRoutesDetails",
                    "contentType": "application/json"
                }
            ]
        }

    },
    "actions": {
        "generateRoute": {
            "inputs": {
                "frameNumber": {
                    "type": "number"
                }
            },
            "required": [
                "frameNumber"
            ],
            "forms": [
                {
                    "op": "invokeaction",
                    "href": "https://dd-garbage-routes-controller-entrypoint:443/acg:lab:virtual-routes/actions/generateRoute",
                    "contentType": "application/json"
                }
            ]
        },
        "addContainer": {
            "inputs": {
                "serialNumber": {
                    "type": "number"
                }
            },
            "required": [
                "serialNumber"
            ],
            "uriVariables": {
                "routeId": { "type": "string"}
            },
            "forms": [
                {
                    "op": "invokeaction",
                    "href": "https://dd-garbage-routes-controller-entrypoint:443/acg:lab:virtual-routes/actions/addContainer",
                    "contentType": "application/json"
                }
            ]
        },
        "stopRoute": {
            "inputs": {
                "routeId": { "type": "string" }
            },
            "forms": [
                {
                    "op": "invokeaction",
                    "href": "https://dd-garbage-routes-controller-entrypoint:443/acg:lab:virtual-routes/actions/stopRoute",
                    "contentType": "application/json"
                }
            ]
        },
        "finishRoute": {
            "inputs": {
                "routeId": { "type": "string" }
            },
            "forms": [
                {
                    "op": "invokeaction",
                    "href": "https://dd-garbage-routes-controller-entrypoint:443/acg:lab:virtual-routes/actions/finishRoute",
                    "contentType": "application/json"
                }
            ]
        }
    },
    "events": {
       "routeStarted": {
           "data":{
                "type": "string"
           },
           "forms": [
                {
                   "op": [ "subscribeevent", "unsubscribeevent" ],
                   "href": "https://dd-garbage-routes-controller-entrypoint:443/acg:lab:virtual-routes/events/routeStarted/sse",
                   "subprotocol": "sse",
                   "response": { "contentType": "text/event-stream" }
                }
           ]
       },
       "routeStopped": {
           "data": {
                "type": "string"
           },
           "forms": [
               {
                    "op": [ "subscribeevent", "unsubscribeevent" ],
                    "href": "https://dd-garbage-routes-controller-entrypoint:443/acg:lab:virtual-routes/events/routeStopped/sse",
                    "subprotocol": "sse",
                    "response": { "contentType": "text/event-stream" }
               }
           ]
       },
       "routeModified": {
           "data": {
                "type": "string"
           },
           "forms": [
            {
                "op": [ "subscribeevent", "unsubscribeevent" ],
                "href": "https://dd-garbage-routes-controller-entrypoint:443/acg:lab:virtual-routes/events/routeModified/sse",
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
                    "href": "https://dd-garbage-routes-controller-entrypoint:443/acg:lab:virtual-routes/events/routeFinished/sse",
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