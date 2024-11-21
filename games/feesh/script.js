function byId(id) {
    return document.getElementById(id);
} 
function randNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function lamelRay(collection) {
    let classes = [].slice.call(collection);
    return classes;
}
var sailBtn = byId("sail");
var fishBtn = byId("catch");
var sellBtn = byId("sell");
var eventP = byId("eventP");
var fishP = byId("fishP");
var cashP = byId("cashP");
var itemsTable = new LootTable();
var lootMap = [
    // scrap
    ["scrap",1000],
    ["coin",900],
    ["sword",500],
    ["ruby",50,13],
    // materials
    ["wooden_plank",300,30,-1,1],
    // fish
    ["bristlemouth",300,13],
];
var items = {
    "scrap": {formal:"Metal Scrap",value:[1,3]},
    "coin":{formal:"Bronze Coin",value:[1.5,5]},
    "sword":{formal:"Rusty Sword",value:[2,6]},
    "ruby":{formal:"Dim Ruby",value:[10,30]},
    // materials
    "wooden_plank": {formal:"Wooden Plank",value:5,type:"Material"},
    // fish
    "bristlemouth":{formal:"Bristlemouth",value:[6,12]},
    "grass_carp":{formal:"Grass Carp",value:[9,16]},
};
var boatparts = {
    "wooden_plank":{strength:2,weight:9,cost:15},
    "feebolum":{strength:50,weight:25,cost:200},
    "blue_beanjelly":{strength:37,weight:12,cost:470,desc:"All new beanjelly that has strength and lightness!"},
    "stone":{strength:10,weight:17,cost:30},
    "condensed_bean":{strength:7,weight:7,cost:90},
    "granite":{strength:15,weight:21,cost:50},
    "prismarono":{strength:80,weight:32,cost:720,desc:"Strange material from the seas.."},
    "dark_prismarono":{strength:143,weight:57,cost:1620,desc:"Stronger prismarono."},
    "rolli_core":{strength:109,weight:60,cost:1300,desc:"Rolli core. Strong, dense, heavy."},
    "crab_shield":{strength:179,weight:42,cost:2000,desc:"Shields taken from the crabs native to Crab Peninsula."}
};
var boatupgrades = {

};
var boataddons = {

};
/* types:
0: catchable by any
1: big like planks
2: strong fish
*/
var fishingrods = {
    "basic_rod":{strength:5,time:[4,6],types:[0]},
    "fishy_rod":{strength:20,time:[3.5,5.5],types:[0,2],desc:"Catches stronger fish, faster!"},
    "triple_rod": {desc:"Catches 3 fish at a time!"},
};
var inventory = {fish:[],boat:[],boataddons:[],boatugprades:[],inventory:[],currentrod:null,cash:0};
var strength = 5;
var fishingTimeout = false;
var atSea = false;
for (let i = 0; i < lootMap.length; i++) {
    let loot = lootMap[i];
    let lootname = loot[0];
    let lootweight = loot[1];
    let lootreq = loot[2];
    let lootqty = loot[3];
    let loottype = loot[4];
    itemsTable.add(lootname,lootweight,lootreq,lootqty,loottype);
}
for (let i = 0; i < 5; i ++) {
    inventory.boat.push(boatparts.wooden_plank);
    inventory.currentrod = structuredClone(fishingrods.basic_rod);
}

function catchFish() {
    fishBtn.innerHTML = "Catch Fish";
    let rolled = structuredClone(items[itemsTable.choose(strength,inventory.currentrod.types)]);
    eventP.innerHTML = "You caught a " + rolled.formal + "!";
    if (rolled.value.length > 0){
        rolled.value = randNum(rolled.value[0],rolled.value[1]);
    }
    inventory.fish.push(rolled);
    updateFishInv();
}
fishBtn.addEventListener("click", () => {
    fishBtn.innerHTML = "Fishing..";
    let fishTime = randNum(inventory.currentrod.time[0]*1000,inventory.currentrod.time[1]*1000);
    console.log("Fishing in.. " +fishTime);
    window.setTimeout(catchFish,fishTime);
});
sellBtn.addEventListener("click",() => {
    for (let i = 0; i < inventory.fish.length; i++) {
        let loot = inventory.fish[i];
        inventory.cash += loot.value;
        inventory.fish.splice(i, 1);
        i--;
    }
    cashP.innerHTML = "$"+inventory.cash;
    fishP.innerHTML = "";
});
function updateFishInv() {
    fishP.innerHTML = "";
    for (let i =0; i < inventory.fish.length; i++) {
        let fish = inventory.fish[i];
        fishP.innerHTML += fish.formal+": Sells for $"+fish.value+".<br>";
    }
}
function sail(toggle) {
    // 0 = go home, 1 = go to sea
    console.log(toggle);

    if (toggle == 0) {
        atSea = false;
        sailBtn.setAttribute("status",0);
        sailBtn.innerHTML = "Set Sail";
        console.log(lamelRay(document.getElementsByClassName("seaBtn")));
        lamelRay(document.getElementsByClassName("seaBtn")).forEach((element) => {;element.classList.add("hide");});
        lamelRay(document.getElementsByClassName("homeBtn")).forEach((element) => {element.classList.remove("hide");});
    } else {
        atSea = true;
        sailBtn.setAttribute("status",1);
        sailBtn.innerHTML = "Go Home";
        lamelRay(document.getElementsByClassName("seaBtn")).forEach((element) => {element.classList.remove("hide");});
        lamelRay(document.getElementsByClassName("homeBtn")).forEach((element) => {element.classList.add("hide");});
    }
}
sailBtn.addEventListener("click", function(e) {
    console.log()
    if (Number(sailBtn.getAttribute("status")) == 0) {
        sail(1);
    } else {
        sail(0);
    }
});
sail(0);