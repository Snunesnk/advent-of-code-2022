const fs = require("fs");

fs.readFile("input.txt", "utf-8", (err, data) => {
    if (err) {
        console.log("err");
        return;
    }

    // Quite simple, for each sensor, determine length until first signal, and push in array everything that is covered by a sensor
    const inputs = data.split("\n");

    const sensors = [];

    inputs.forEach(input => {
        let sensorX;
        let sensorY;
        let beaconX;
        let beaconY;

        const split_input = input.split("=");
        sensorX = split_input[1].split(",")[0];
        sensorY = split_input[2].split(":")[0];
        beaconX = split_input[3].split(",")[0];
        beaconY = split_input[4];

        const range = getCoordDiff([sensorX, sensorY], [beaconX, beaconY]);

        sensors.push({
            position: [+sensorX, +sensorY],
            beacon: [+beaconX, +beaconY],
            range: range
        });
    });


    // const target = 2000000;
    const target = 4000000;
    // const target = 10;
    // const target = 20;
    const notPossible = new Set();
    // let beaconsOnRow = 0;
    sensors.map(sensor => {
        notPossible.add((sensor.beacon[0] * 4000000) + sensor.beacon[1]);
    });

    // sensors.forEach(sensor => {
    //     // Check if the sensor is able to reach and therefore detect anything on the line
    //     let x;

    //     for (var wantedRow = 0; wantedRow <= target; wantedRow++) {
    //         console.log(notPossible.size);


    //     }
    // });

    // Okay
    // For each point, I check if it is in range of a sensor. If so, then I calculate when would i be out of range of this sensor, and go there

    for (var y = 0; y <= target; y++) {
        for (var x = 0; x <= target; x++) {
            // console.log(x);
            const sensor = sensors.find(s =>
                (s.range - getCoordDiff(s.position, [x, y])) >= 0
            );

            if (!sensor) {
                console.log("Found!");
                console.log(x * 4000000 + y);
                return;
            }

            const rangeToRow = sensor.range - getCoordDiff(sensor.position, [x, y]);
            // console.log("\nNew sensor: " + sensor.position);
            // console.log("Range to sensor: " + sensor.range + ", range to row: " + rangeToRow);

            x += rangeToRow;
            // console.log("Going to " + x);
        }
        console.log("New y: " + y);
    }
})

const getCoordDiff = (coord1, coord2) => {
    return Math.abs(coord1[0] - coord2[0]) + Math.abs(coord1[1] - coord2[1]);
}