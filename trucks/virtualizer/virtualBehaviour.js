

function consumeFuel(truck){

    if(!truck.onRoute) return truck;

    var random = Math.floor(Math.random() * (1 - (- 1) + 1) + (- 1))
    var consumption = truck.fuelConsumption + random;
    
    console.log('consumption', consumption);

    if((truck.fuel - consumption) <= 0) {
        truck.fuel = 0;
        return truck;
    }
    
    
    truck.fuel -= consumption;
    console.log('truck fuel', truck.fuel);

    return truck;

}

module.exports = consumeFuel;