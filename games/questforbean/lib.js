const lib = {
    slope(loc, min, max, ...points) {
        // points [x,y] where x is position and y is value. For example, 0.2 is 1 and 0.5 is 0.2, meaning if loc is 0.3, value will be closer to 0.2 than 0.5,  
        let point1 = [99999999, 0];
        let point2 = [100000000, 0];
        for (let point of points) {
            if (Math.abs(point[0] - loc) < Math.abs(point1[0] - loc)) {
                point2 = point1;
                point1 = point;
                continue;
            }
            console.log(Math.abs(point[0] - loc) < Math.abs(point2[0] - loc), Math.abs(point[0] - loc) > Math.abs(point1[0] - loc), point);
            if (Math.abs(point[0] - loc) < Math.abs(point2[0] - loc) && Math.abs(point[0] - loc) >= Math.abs(point1[0] - loc)) {
                point2 = point;
            }
        }
        console.log(point1, point2);
        let val = point1[1] + (loc - point1[0]) * (point2[1] - point1[1]) / (point2[0] - point1[0]);
        return min + val * (max - min);
    },
    /**
     * Finds a value based on given LootTable
     * @param {LootTable} lootTable used for weights
     * @param {Number | Boolean} inverse if amount is flipped (e.g. lower weight causes higher chance), gives inverse
     * @returns A value from the lootTable based on the weights
     * @example {red:2,blue:4} -> "blue has 2x chance of getting rolled compared to red"
     * @example {red:2,blue:4,green:3} -> "total sum of 9. Imagine the weights as a sliding bar, and those with the highest weight have the largest area. It becomes a geometric probability where any part of the 1D bar can be selected, and those with the highest area have the highest probability."
     */
    weight(lootTable,inverse=false) {
        // new LootTable(); for index, have weight and name
        let weights = [];
        function recurse(currentObj) { // effectively the same as iterating through each key and adding the value to the array
            for (let k in currentObj) {
                // add weight to lootTable
                if (typeof inverse == "number") { // add inverse where the lower the weight the higher the chance
                    console.log("hi");
                    weights.push(inverse-currentObj[k]);
                } else {
                    weights.push(currentObj[k]);
                }
                
                if (typeof currentObj[k] === 'object' && currentObj[k] !== null) {
                    recurse(currentObj[k]);
                }
            }
        }
        recurse(lootTable); 
        let totalWeight = weights.reduce((acc, weight) => acc + weight, 0); // get sum of weights
        let randomNum = Math.random() * totalWeight; // get random number between 0 and the sum
        let sum = 0;
        let outcome = 1;

        for (let i = 0; i < weights.length; i++) { // for every weight
            sum += weights[i]; // add the weight to the sum
            if (randomNum < sum) { // if the sum is greater than the randomNum, this will be the outcome
                outcome = i; // Dice faces are 1-indexed
                break;
            }
        }
        console.log(Object.keys(lootTable)[outcome],outcome);
        return Object.keys(lootTable)[outcome]; // return outcome
    },
    affect(value,fn){
        return fn(value);
    },
    sequence(value,iterations,fn) {
        for (let i = 0; i < iterations; i++) {
            value = fn(value);
        }
        return value;
    }
};
const logPoints = {
    "oppDraw": {
        console: {success:"oppDraw ran successfully",failure:"oppDraw failed"},
        active: true,
    },
    "useCardData": {
        console: "Card here: [data]",
        active: true,
    }
}

console.log("lib.js loaded");
