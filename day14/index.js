const fs = require("fs");

fs.readFile("./input.txt", "utf-8", (err, data) => {
    if (err) {
        console.log(err);
        return;
    }

    const inputs = data.split("\n");

    const blocks = [];
    let maxY = 0;

    inputs.forEach(input => {
        const coords = input.split(" -> ");
        let previousCoord = [];
        coords.forEach(coord => {
            let [x, y] = coord.split(',');
            if (previousCoord.length === 0) {
                previousCoord = [+x, +y];
            }

            x = +x;
            y = +y;

            if (y > maxY)
                maxY = y;
            // console.log("Prev: " + previousCoord);
            // console.log("Actual: " + x + "," + y);


            if (previousCoord[0] != x) {
                if (x < previousCoord[0]) {
                    for (var i = 0; i + x <= previousCoord[0]; i++)
                        blocks.push([x + i, y]);
                }
                else {
                    for (var i = 0; i + previousCoord[0] <= x; i++)
                        blocks.push([previousCoord[0] + i, y]);
                }
            }
            else if (previousCoord[1] != y) {
                if (y < previousCoord[1]) {
                    for (var i = 0; i + y <= previousCoord[1]; i++)
                        blocks.push([x, y + i]);
                }
                else {
                    for (var i = 0; previousCoord[1] + i <= y; i++)
                        blocks.push([x, previousCoord[1] + i]);
                }
            }

            previousCoord = [x, y];
        });
    });

    let sandCoords = [500, 0];
    let sands = 0;
    while (1) {
        /// While there's no block under, continue falling
        while (!blocks.find(block => block[0] == sandCoords[0] && block[1] == sandCoords[1] + 1) && sandCoords[1] < maxY + 1) {
            sandCoords[1] += 1;
        }

        // If the sand Y is the same as the maximum Y for a block, then it is falling ti the abyss
        if (sandCoords[1] >= maxY + 1) {
            blocks.push([sandCoords[0], sandCoords[1]]);
            sandCoords = [500, 0];
            sands++;
            continue;
        }

        // there's a block under, try left side
        if (!blocks.find(block => block[0] == sandCoords[0] - 1 && block[1] == sandCoords[1] + 1)) {
            sandCoords[0] -= 1;
            sandCoords[1] += 1;
        }
        /// There's a block, try right side
        else if (!blocks.find(block => block[0] == sandCoords[0] + 1 && block[1] == sandCoords[1] + 1)) {
            sandCoords[0] += 1;
            sandCoords[1] += 1;
        }
        /// There's also a block, so add this sand to the blocks
        else {
            blocks.push([sandCoords[0], sandCoords[1]]);
            sands++;
            if (sandCoords[1] == 0) {
                break;
            }
            sandCoords = [500, 0];
        }
    }

    console.log(sands);
})