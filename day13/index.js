const fs = require("fs");

fs.readFile("input.txt", "utf-8", (err, data) => {
    if (err) {
        console.log("oops");
        console.log(err);
        return;
    }

    let pairs = data.toString().replace(/\n\n/g, "\n").split("\n");
    pairs.push("[[2]]");
    pairs.push("[[6]]");

    const compareArrays = (left, right, leftIndex, rightIndex) => {
        if (left[leftIndex] === '[')
            leftIndex++;
        if (right[rightIndex] === '[')
            rightIndex++;

        const isDigit = c => {
            if (c >= '0' && c <= '9')
                return true;

            return false;
        }

        const insertBrackets = (str, index) => {
            let i = 0;
            while (isDigit(str[index + i]))
                i++;
            // console.log("str: " + str + ", i: " + i + ", index: " + index);
            str = str.substring(0, index) + "[" + str.substring(index, index + i) + "]" + str.substr(index + i);
            // console.log("New str: " + str);
            return str;
        }

        while (leftIndex < left.length && rightIndex < right.length) {
            // console.log("Gonna compare " + left.substr(leftIndex)); console.log("and " + right.substr(rightIndex));

            if (left[leftIndex] === ']') {
                if (right[rightIndex] === ']') {
                    // console.log("Left and right terminated");
                    return [0, leftIndex, rightIndex];
                }
                else {
                    // console.log("Left Array smaller than right");
                    return [-1, leftIndex, rightIndex];
                }
            }
            if (right[rightIndex] === ']') {
                if (left[leftIndex] === ']') {
                    // console.log("Left and right terminated");
                    return [0, leftIndex, rightIndex];
                }
                else {
                    // console.log("Right Array smaller than right");
                    return [1, leftIndex, rightIndex];
                }
            }

            if (left[leftIndex] === '[') {
                if (isDigit(right[rightIndex])) {
                    right = insertBrackets(right, rightIndex);
                    rightIndex++;
                }
                const rslt = compareArrays(left, right, leftIndex, rightIndex);
                if (rslt[0] != 0) {
                    return rslt;
                }
                leftIndex = rslt[1] + 1;
                rightIndex = rslt[2] + 1;
            }
            if (right[rightIndex] === '[') {
                if (isDigit(left[leftIndex])) {
                    left = insertBrackets(left, leftIndex);
                    leftIndex++;
                }
                const rslt = compareArrays(left, right, leftIndex, rightIndex);
                if (rslt[0] != 0)
                    return rslt;
                leftIndex = rslt[1] + 1;
                rightIndex = rslt[2] + 1;
            }

            if (left[leftIndex] === ',')
                leftIndex++;
            if (right[rightIndex] === ',')
                rightIndex++;

            if (isDigit(right[rightIndex]) && isDigit(left[leftIndex])) {
                let i = 0;
                while (isDigit(right[rightIndex + i]))
                    i++;
                let j = 0;
                while (isDigit(left[leftIndex + j]))
                    j++;
                const rightNum = +right.substring(rightIndex, rightIndex + i);
                const leftNum = +left.substring(leftIndex, leftIndex + j);
                // console.log("left: " + leftNum + ", right: " + rightNum);
                if (rightNum > leftNum) {
                    // console.log("Left smaller than right");
                    return [-1, leftIndex, rightIndex];
                }
                else if (rightNum < leftNum) {
                    // console.log("Right smaller than left");
                    return [1, leftIndex, rightIndex];
                }
                else {
                    leftIndex++;
                    rightIndex++;
                }
            }
        }

        return [leftIndex < rightIndex ? -1 : 1, rightIndex, leftIndex];
    }

    pairs = pairs.sort((left, right) => {
        let rslt = [0, 0, 0];
        // console.log("\n");
        // console.log(left);
        // console.log(right);

        while (rslt[0] == 0) {
            rslt[1]++;
            rslt[2]++;
            rslt = compareArrays(left, right, rslt[1], rslt[2]);
        }
        if (rslt[0] == -1) {
            // console.log(i + " is correct");
            return -1;
        }
        // console.log(i + " is incorrect");
        return 1
    });

    const index1 = pairs.indexOf("[[2]]") + 1;
    const index2 = pairs.indexOf("[[6]]") + 1;
    pairs.map(pair => console.log(pair));


    console.log(index1 * index2);
});