var LootTable = function(table) {
    this.table = [];
    if (table !== undefined) this.table = table;
};

LootTable.prototype.constructor = LootTable;

LootTable.prototype.clear = function() {
    this.table.length = 0;
};

/**
 * Add an item
 *
 * Weights are arbitrary, not percentages, and don't need to add up to 100.
 * If one item has a weight of 2 and another has a weight of 1, the first item
 * is twice as likely to be chosen. If quantity is given, then calls to choose()
 * will only return that item while some are available. Each choose() that
 * selects that item will reduce its quantity by 1.
 *
 * Item can be anything, not just strings. It could be an array, a number, JSON
 * data, null, a function... even another LootTable!
 * 
 * @param {mixed} item      The item to be chosen
 * @param {number} weight   (optional) The weight of the item, defaults to 1
 * @param {number} quantity (optional) Quantity available, defaults to Infinite
 */
LootTable.prototype.add = function(item, weight, requirement, quantity, type) {
    if (weight === undefined || weight === null || weight <= 0) weight = 1;
    if (requirement === undefined || requirement === null || requirement <= 0) requirement = 0;
    if (quantity === undefined || quantity === null || quantity <= 0) quantity = Number.POSITIVE_INFINITY;
    if (type === undefined || type === null || type <= 0) type = 0;
    this.table.push({ item: item, weight: weight, requirement: requirement, quantity: quantity, type: type});
};

LootTable.prototype.edit = function (id, data) {
    let chosen = null;
    for (let i = 0; i < this.table.length; i++) {
        if (this.table[i].item == id) {
            chosen = this.table[i].item;
            break;
        }
    }
    if (chosen == null) {
        let style = "color:rgb(130,220,255);font-weight:bolder;";
        let defaultStyle = "";
        console.log("%cCouldn't find item via id %c'" + id +"%c' in table: %c" + JSON.stringify(this.table) + ".",defaultStyle,style,defaultStyle,style);
    } else {
        for (let i = 0; i < data.length; i++) {
            if (data[i] === null || data[i] === undefined || data[i] === "%keep" || data[i] === "") {continue;}
            let keyNames = ["item","weight","requirement","quantity","type"];
            let keyName = keyNames[i];
            chosen[keyName] = data[i];
        }
    }
};

/**
 * Return a random item from the LootTable
 */
LootTable.prototype.choose = function(requirement = 0,types = []) {
    if (this.table.length === 0) return null;
    var possibleTable = structuredClone(this.table);
    for (let i =0; i < Object.keys(possibleTable).length; i++) {
        let loot = possibleTable[i];
        if (loot.type != 0) {
            if (types.includes(loot.type) == false) {
                console.log("hi");
                possibleTable.splice(i,1);
                i--;
                continue;
            }
        }
        if (loot.requirement/1.4 > requirement) {
            console.log("hi",loot.requirement/1.4);
            possibleTable.splice(i,1);
            i--;
            continue;
        } else if (loot.requirement > requirement) {
            loot.weight *= requirement/(loot.requirement+1);
            console.log(requirement/(loot.requirement+1));
        }
    }
    var i, v;
    var totalWeight = 0;
    for(i = 0; i < possibleTable.length; i++) {
        v = possibleTable[i];
        if (requirement > (v.requirement+5)*1.5) {
            v.weight *= (v.requirement+5)/(requirement/2);
        }
        if (v.weight < 0) {
            v.weight = 0;
        }
        if (v.quantity > 0) {
            totalWeight += v.weight;
        }
    }
    console.log(possibleTable);
    var choice = 0;
    var randomNumber = Math.floor(Math.random() * totalWeight + 1);
    var weight = 0;
    for(i = 0; i < possibleTable.length; i++) {
        v = possibleTable[i];
        if (v.quantity <= 0) continue;

        weight += v.weight;
        if (randomNumber <= weight) {
            choice = i;
            break;
        }
    }

    var chosenItem = possibleTable[choice];
    possibleTable[choice].quantity--;

    return chosenItem.item;
};
