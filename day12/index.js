const fs = require("fs");


// OKay
// A queue algo
// With a better parsing of the map
fs.readFile("input.txt", 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    let map = data.split("\n").map(line => line.split(""));

    let startingPoints = [];
    let end;
    for (var y = 0; y < map.length; y++) {
        for (var x = 0; x < map[y].length; x++) {
            if (map[y][x] === "S") {
                map[y][x] = 'a';
                startingPoints.push([y, x]);
            }
            else if (map[y][x] === 'E') {
                end = [y, x];
                map[y][x] = 'z';
            }
            else if (map[y][x] === 'a')
                startingPoints.push([y, x]);
        }
    }

    const DIRECTIONS = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
    ]

    const isPosInGrid = pos => {
        if (pos[0] >= 0 && pos[0] < map.length && pos[1] >= 0 && pos[1] < map[0].length)
            return true;
        return false;
    }
    const isEqualOrHigher = (actualHeight, destPos) => {
        const destHeight = map[destPos[0]][destPos[1]].charCodeAt(0);

        const diff = destHeight - actualHeight;

        if (diff <= 1)
            return true;
        return false;
    }

    const getShortestPathFromStart = (start) => {
        let queue = [[start, 0]];
        let visited = [start[0] + "," + start[1]];

        while (queue.length > 0) {
            const [pos, steps] = queue.shift();

            if (pos[0] == end[0] && pos[1] == end[1]) {
                return steps;
            }

            const actualHeight = map[pos[0]][pos[1]].charCodeAt(0);

            DIRECTIONS.map((([y, x]) => [pos[0] + y, pos[1] + x])
            )
                .filter(testPos => {
                    return isPosInGrid(testPos)
                })
                .filter(testPos => isEqualOrHigher(actualHeight, testPos))
                .filter(testPos => {
                    return !visited.includes(testPos[0] + "," + testPos[1])
                })
                .forEach(testPos => {
                    visited.push(testPos[0] + "," + testPos[1]);
                    queue.push([testPos, steps + 1]);
                });
        }
    }

    let shortest = Number.POSITIVE_INFINITY;

    startingPoints.forEach(start => {
        const rslt = getShortestPathFromStart(start);
        if (rslt < shortest)
            shortest = rslt;
    });

    console.log(shortest);
});