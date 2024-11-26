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
    weight(lootTable) {
        // new LootTable(); for index, have weight and name
        let weights = [];
        function recurse(currentObj) {
            for (let k in currentObj) {
                if (k == "weight") {
                    weights.push(currentObj[k]);
                }
                if (typeof currentObj[k] === 'object' && currentObj[k] !== null) {
                    recurse(currentObj[k]);
                }
            }
        }
        recurse(lootTable);
        let totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
        let randomNum = Math.random() * totalWeight;
        let sum = 0;
        let outcome = 1;

        for (let i = 0; i < weights.length; i++) {
            sum += weights[i];
            if (randomNum < sum) {
                outcome = i; // Dice faces are 1-indexed
                break;
            }
        }
        console.log(lootTable[Object.keys(lootTable)[outcome]],outcome);
        console.log(`Rolled a ${lootTable[Object.keys(lootTable)[outcome]].name}`);
        return lootTable[Object.keys(lootTable)[outcome]];
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