function byId(id) {
    return document.getElementById(id);
}
console.log("script.js loaded");
console.log(lib);

var p1txt = byId("p1");
var p2txt = byId("p2");
var gametitle = byId("gametitle");
var battletitle = byId("battletitle");
var turnbtn = byId("turn");
var modebtn = byId("mode");
var modetext = byId("curmode");
var currentmode = "Normal";
var whichturn = byId("whichturn");
var drawbtn = byId("draw");
var discardbtn = byId("discard");
var focused;
var turns = 0;
var unselectbtn = byId("endselect");
// menu
var playbtn = byId("play");
var menuscreen = byId("menu");
var backgroundscreen = byId("background");
var modescreen = byId("modes");
var startmodsscreen = byId("startingmods");
var adventurescreen = byId("adventure");
var curvolume = 0.4;
var gamescreen = byId("game");
var sob = 1; // start or battle? 1 = start | 2 = battle
var skipped = false;
var ultrawrap = byId("ultrawrapper");
var ultrawrapimg= byId("ultrawrapperimg");
var invspecial = byId("inventoryspecialtext");
// adventure screen
var curoverview = byId("currentoverview");
var curloctxt = byId("curloc");
var curlocdesctxt = byId("curlocdesc");

var loretxt = byId("loretext");
var proceedtxt = byId("proceed");
var proceeddesc = byId("proceeddesc");
var travelbtn = byId("travel");
var specialdiv = byId("special");
var specialdiv2 = byId("special2");
var statsdiv = byId("plrstats");
var inventorydiv = byId("plrinventory");
var inventorytable;
var relicdiv = byId("plrrelics"); //
var relictable;
var speciallock = false;
var speciallock2 = false;
var curspecial1 = null;
var curspecial2 = null;
var alttravelbtn = byId("alttravel");
var textfinished = false;
var currenttext = "";
var currenttextnum = 0;
var rerolls = 0;
var shopmult = 1;
var shopmod = null;
// new run vars
var startmod;
// CARD MODES
var cardmode = 1; // 1 == use, 2 == select;
var togglecardmode = byId("togglecardmode");
var customselect = byId("customoptions");
var customtype = "";
var deathmode = "";
var Game = {
    turn: 1,
    p1: {
        managain: 5,
        maxdiscards: 1,
        maxhealth: 300,
        coins: 20,
        startingmana: 10,
        // battlestats
        health: 300,
        mana: 10,
        discards: 1,
        inventory: {},
        deck: {},
        battledeck: {},
        mods: [],
        relics: {},
        drawarr: [],
        drawarrindex: 0,
    },
    p2: {
        managain: 5,
        maxdiscards: 1,
        // battlestats
        health: 300,
        mana: 10,
        discards: 1,
        inventory: {},
        deck: {},
        battledeck: {},
        mods: [],
    },
};
var turn = Game.turn;


/* COOL LANGUAGE:

randKey(cards)[??WHERE@return.obtainable!=false~~];



*/
var importantoknowledgo = ["The select mode allows you to do more strategic moves.","High attack is not always the best.","Solar Prism is the easiest way to win a run.","You can hover over relics to see tooltips.","This jar has no other purpose than providing mildly helpful information."];

// GET SOUNDS

function countDebounce() {
    debouncetimer++;
}
var debouncetimer = 0;
var debounceInterval = window.setInterval(countDebounce,10);
var aimode = 1;
var modetick = 0;
var p1 = Game.p1;
var p2 = Game.p2;
var opptries = 0;
var oppturndone = false;
var blockoppturn = false;
var blockturnover = false;
var playerpower = 0;
var powertxt = byId("playerpower");
var embtnWrap = byId("event-modal-btn-wrapper");
var embtn = byId("event-modal-btn");
var template = {
    formalname: "",
    health: 300,
    mana: 10,
    discards: 1,
    inventory: {},
    deck: {},
    battledeck: {},
}
function randItem(arr) {
    return arr[Math.floor(Math.random()*arr.length)];
}
// IMPORTANT!!! //
// LOCATIONS!! //
var locationplacing = {
    1: {
        name: "Owarp",
        stages: {
            stage1: {
                name: "AdventureStart",
                // change testfight to mysteryfight
                set: ["home","roadtocoda","mysteryfight","owarpcenter","anyshops","mysteryfight2","janjovictory","mysteryloc","tallmart","mysteryloc2","behindtallmart"],
                anyshops: ["cosmeticshop"],
                mysteryloc: ["cloakedhuman","speedingcar","none"],
                mysteryloc2: ["tallmartroof","suddenurge"],
                testfight: [],
                mysteryfight: ["andreasappear,andreasvictory","goldslimeappear,goldslimevictory","phaserwizardappear,phaserwizardvictory"],
                mysteryfight2: ["tavern,taverngroupvictory","potato,potatovictory"]
            },
            stage2: {
                name: "CityOutskirts",
                set: ["roadtocoda3","danceclub","mysteryfight","mysteryloc","danceclub2","djneonvictory","mysteryloc2","danceclubexit","hotel","beanfactory","cheesedinovictory","unclerictorappear","mysteryloc3"],
                mysteryfight: ["helloitsmeappear,helloitsmevictory","danceclubsign,fakecoinsvictory"],
                mysteryloc: ["beancandispenser","neonrobot","slotmachine","none"],
                mysteryloc2: ["danceclubroof","danceclubspill","none"],
                mysteryloc3: ["securityguard","shippingsector"],
            },
            stage3: {
                name: "LordKSearch",
                set: ["mysteryloc","roadtocoda4","mysteryfight","lordkarena","lordkvictory","roadtocoda5","roadtocoda6","mysteryloc2","trafficlordappear","trafficlordvictory","zeend"],
                mysteryloc: ["strangealtar","unclemanstatue","none"],
                mysteryloc2: ["crowattack","cardtornado","none"],
                mysteryfight: ["forest1,banditsvictory","leafo,leafovictory"/*,"forestclearing,forestcastle,wisespiritsvictory"*/,"forest1,banditsvictory","leafoappear,leafovictory","forestclearing,forestcastle,wisespiritsvictory","lostcave"],
            },
        },
    },
    2: {
        name: "Coda",
        stages: {
            stage1: {
                name: "CodaCity",
                set: ["coda","hotel2","jamodarcards","jamodarcards2","mysteryloc","jamodarcards3","jamodarcardsroof","ancientlibrary","constructionsite","mysteryloc2","zeend"],
                mysteryloc: ["jamodarcardsvendingmachine","jamodarcardsdealer"],
                mysteryloc2: ["bridge","maskedpeople"],
            },
            stage1a: {
                name: "AncientLibrary",
                set: ["ancientlibrary1","mysteryfight","knowledge"],
                mysteryfight: ["cursedtome,cursedtomevictory","owllibrarian,owllibrarianvictory"],
            },
        },
    }
};
var keywords = ["anyshops","mysteryloc","mysteryloc2","mysteryloc3","mysteryfight","mysteryfight2","testfight"];
var locationsarr = [];
var curlocationindex = 0;
var curlocationstage = 2;
var curlocationpart = 1;

for (let i = 0; i < 100; i++) {
    let zestage = locationplacing[curlocationstage].stages["stage"+curlocationpart];
    let zeloc = zestage.set[i];
    if (arrHas(keywords,zeloc)) {
        console.log(zeloc,randItem(zestage[zeloc]));
        zeloc = randItem(zestage[zeloc]);
        
    }
    if (zeloc.includes(",")) {
        zeloc = zeloc.split(",");
        for (let j = 0; j < zeloc.length; j++) {
            if (arrHas(keywords,zeloc[j])) {
                zeloc[j] = randItem(zestage[zeloc[j]]);
            }
        }
    } else {
        
    }
    if (zeloc != "none") {
        if (typeof zeloc == "string") {
            locationsarr.push(zeloc);
        } else {
            for (let k =0; k < zeloc.length; k++) {
                locationsarr.push(zeloc[k]);
            }
        }
    }
    if (zestage.set.length == i+1) {
        break;
    }
}
var curlocation = locations[locationsarr[0]];
/**
 * logPoint(type,success)
 * @param {String} type type of log point
 * @param {Boolean} success success or failure, can be null
 */
function logPoint(type,success=null) {
    if (logPoints[type].active == true) {
        if (success != null) {
            if (success == true) {
                console.log(logPoints[type].console["success"]);
            } else {
                console.log(logPoints[type].console["failure"]);
            }
            
        } else {
            console.log(logPoints[type].console);
        }
        
    }
}
function nextLoc() {
    if (curlocation.name == "zeend") {
        curlocation = locations.home;
        curlocationpart = 1;
        curlocationstage = 1;
        locationsarr = [];
        curlocationindex = 0;
        for (let i = 0; i < 100; i++) {
            let zestage = locationplacing[curlocationstage].stages["stage"+curlocationpart];
            let zeloc = zestage.set[i];
            if (arrHas(keywords,zeloc)) {
                console.log(zeloc,randItem(zestage[zeloc]));
                zeloc = randItem(zestage[zeloc]);
                
            }
            if (zeloc.includes(",")) {
                zeloc = zeloc.split(",");
                for (let j = 0; j < zeloc.length; j++) {
                    if (arrHas(keywords,zeloc[j])) {
                        zeloc[j] = randItem(zestage[zeloc[j]]);
                    }
                }
            } else {
                
            }
            if (zeloc != "none") {
                if (typeof zeloc == "string") {
                    locationsarr.push(zeloc);
                } else {
                    for (let k =0; k < zeloc.length; k++) {
                        locationsarr.push(zeloc[k]);
                    }
                }
            }
            if (zestage.set.length == i+1) {
                break;
            }
        }
        curlocation = locationsarr[0];
    }
    if (curlocationindex+1 != locationsarr.length) {
        curlocationindex++;
        curlocation = locations[locationsarr[curlocationindex]];
    } else {
        if (Object.keys(locationplacing[curlocationstage].stages).length == curlocationpart) {
            curlocationstage += 1;
            curlocationpart = 0;
        }
        curlocationpart += 1;
        locationsarr = [];
        curlocationindex = 0;
        for (let i = 0; i < 100; i++) {
            let zestage = locationplacing[curlocationstage].stages["stage"+curlocationpart];
            let zeloc = zestage.set[i];
            if (arrHas(keywords,zeloc)) {
                console.log(zeloc,randItem(zestage[zeloc]));
                zeloc = randItem(zestage[zeloc]);
                
            }
            if (zeloc.includes(",")) {
                zeloc = zeloc.split(",");
                for (let j = 0; j < zeloc.length; j++) {
                    if (arrHas(keywords,zeloc[j])) {
                        zeloc[j] = randItem(zestage[zeloc[j]]);
                    }
                }
            } else {
                
            }
            if (zeloc != "none") {
                if (typeof zeloc == "string") {
                    locationsarr.push(zeloc);
                } else {
                    for (let k =0; k < zeloc.length; k++) {
                        locationsarr.push(zeloc[k]);
                    }
                }
            }
            if (zestage.set.length == i+1) {
                break;
            }
        }
        curlocation = locations[locationsarr[0]];
    }
    
}
function setLoc(type,data) {
    if (type == "addpart") {
        /*curlocation = locations.home;
        curlocationpart = 1;
        curlocationstage = 1;
        locationsarr = [];
        curlocationindex = 0;*/
        // For 'addpart', data[0] is the curlocation index, and data[1] is the part
        let index = locationsarr.indexOf(data[0]);
        data[1] = randItem(data[1]);
        let temparr = [];
        let zestage = locationplacing[curlocationstage].stages["stage"+data[1]];
        for (let i = 0; i < 100; i++) {
            
            let zeloc = zestage.set[i];
            if (arrHas(keywords,zeloc)) {
                zeloc = randItem(zestage[zeloc]);
                
            }
            if (zeloc.includes(",")) {
                zeloc = zeloc.split(",");
                for (let j = 0; j < zeloc.length; j++) {
                    if (arrHas(keywords,zeloc[j])) {
                        zeloc[j] = randItem(zestage[zeloc[j]]);
                    }
                }
            } else {
                
            }
            if (zeloc != "none") {
                if (typeof zeloc == "string") {
                    temparr.push(zeloc);
                } else {
                    for (let k =0; k < zeloc.length; k++) {
                        temparr.push(zeloc[k]);
                    }
                }
            }
            if (zestage.set.length == i+1) {
                break;
            }
        }
        let part1 = locationsarr.slice(0,index+1);
        let part2 = locationsarr.slice(index+1,locationsarr.length);
        locationsarr = part1.concat(temparr).concat(part2);
    }
    // For :addloc, data[0] is the index of the curlocation, and data[1] is the location to be added. 
    if (type == "addloc") {
        let index = locationsarr.indexOf(data[0]);
        locationsarr = locationsarr.toSpliced(index+1,0,randItem(data[1]));
    }
    
}
// LOCATIONSMAXXING //
// UNIMPORTANCE //
for (let k =0; k < Object.keys(enemies).length; k++) {
    let zeopp = enemies[Object.keys(enemies)[k]];
    for (let i = 0; i<zeopp.simpledeck.length; i++) {
        drawCard(zeopp,true,zeopp.simpledeck[i],["addToDeck","specialp"]);
    }
}
var shopcards = structuredClone(cards);
for (let i = 0; i < Object.keys(cards).length; i++) {
    let card = cards[Object.keys(cards)[i]];
    let card2 = shopcards[Object.keys(shopcards)[i]];
    card.effects = [];
    card.cardmods = [];
    card2.effects = [];
    card2.cardmods = [];
}
var reloading = false;
var battletext = byId("battletext");
var keynames = ["name","formal","atk","hp","manause","ammo","maxammo","cool","coolleft","type","heal","uses","tempuses","obtainable","storedmana","sound"];
var keyformal = ["Name","Formal Name","Attack","Health","Mana Use","Ammo","Maximum Default Ammo","Cooldown","Starting Cooldown","Card Type","Heal","Uses","Obtainable By Drawing Cards","Stored Mana","Sound"];
var openBtn = document.querySelectorAll(".open-modal-btn");
var modal = document.querySelectorAll(".modal-overlay");
var closeBtn = document.querySelectorAll(".close-modal-btn");
var modalContent = byId("modal-content");
//modal.classList.add("hide");
function openModal(e) {
    byId(e.target.getAttribute("data-target")).style.background = "rgba(0,0,0,0.7)";
    byId(e.target.getAttribute("data-target")).style.top = "0px";
    byId(e.target.getAttribute("data-target").replace("-overlay","-wrapper")).style.top = "50%";
}
function closeModal(e, clickedOutside) {
    let target;
    if (clickedOutside) {
        target = e.target;
        if (target.classList.contains("modal-overlay"))
            target.classList.add("hide");
    } else {
        target = byId(e.target.getAttribute("data-target"));
        target.classList.add("hide");
    }
    byId(target.getAttribute("id").replace("-overlay","-wrapper")).style.top = "1000px";
}
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}
function openMiniTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("minitabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks-mini");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}
for (let i =0; i < openBtn.length; i++) {
    let elem = openBtn[i];
    elem.addEventListener("click", function(e) {
        byId(e.target.getAttribute("data-target")).classList.remove("hide");
        
        window.setTimeout(openModal,1,e);
    });
}
for (let i =0; i < closeBtn.length; i++) {
    let elem = closeBtn[i];
    elem.addEventListener("click", function(e){
        
        byId(e.target.getAttribute("data-target")).style.background = "none";
        byId(e.target.getAttribute("data-target").replace("-overlay","-wrapper")).style.top = "2000px";
        window.setTimeout(closeModal,500,e);
    });
}
for (let i =0; i < modal.length; i++) {
    let elem = modal[i];
    elem.addEventListener("click", function(e){
        if (e.target == modal) {
            e.target.style.background = "none";
            byId(e.target.getAttribute("id").replace("-overlay","-wrapper")).style.top = "2000px";
            window.setTimeout(closeModal,500,e,true);
        }
        
    });
}
//openBtn.addEventListener("click", openModal);
//modal.addEventListener("click", (e) => closeModal(e, true));
//closeBtn.addEventListener("click", closeModal);
// VERY USEFUL FUNCTIONS
function arrHas(arr,substr) {
    return arr.some(str => str.includes(substr));
}
function arrFirst(arr,substr) {
    return arr.filter(str => str.includes(substr))[0];
}
function morphType(str) {
    /*if (stringIsArray(str)) {
        return str.split(/^["'\d\[\]\{\}],/gm);
    }*/
    if (isNaN(str) == false) {
        return parseFloat(str);
    }
    if (str == "true") {
        return 1;
    }
    if (str == "false") {
        return 0;
    }
    return str;
}
function randKey(obj,con = null) {
    let keys = Object.keys(obj);
    let passedKeys = [];
    if (con) {
        for (let i =0; i < keys.length; i++) {
            let key = keys[i];
            // subobj?val=false
            // prop?val=false
            // prop?=false;
            let conditions = con.split(";");
            let keyPassed = true; // by default, let key pass
            for (let j = 0; j < conditions.length; j++) {
                let tempcon = conditions[j].split("?");
                let secondary = tempcon[1].split("=");
                secondary[1] = morphType(secondary[1]); // secondary is the property to check and value to get
                // if conditions are not met, key will be unpassed
                if (tempcon[0] == "subobj") {
                    if (obj[key][secondary[0]] == secondary[1]) {
                        keyPassed =false;
                    }
                    // check for booleans
                    if ((obj[key][secondary[0]] == true && secondary[1] == "true") || (obj[key][secondary[0]] == false && secondary[1] == "false")) {
                        keyPassed =false;
                    } 
                }
                if (tempcon[0] == "prop") {
                    if (obj[key] == secondary[0]) {
                        keyPassed =false;
                    }
                }
            }
            if (keyPassed) { // if key passed, add it to passed keys array
                passedKeys.push(key);
            }
        }
    } else {
        passedKeys = structuredClone(keys);
    }
    return obj[passedKeys[passedKeys.length * Math.random() << 0]]; // get random key from passed keys
};
function randNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
/**
    * Easier method of using defaults for null values. 
    * @param vari The original variable. The function will check if this is null.
    * @param subvari The replacement variable. If {@link vari} is null, {@link subvari} will be returned.
    * @returns A value that is either {@link vari} or {@link subvari} depending on {@link vari}'s value.
*/
function ifNo(vari,subvari) {
    if (vari == undefined || vari == null) {
        return subvari;
    } else {
        return vari;
    }
}
/**
    * Gets the logarithm of a number with a custom base.
    * @param {number} x The number used to find the logarithm.
    * @param {number} base The base of the logarithm.
    * @returns {number} The logarithm of {@link x} with a base of {@link base}.
*/
Math.logb = function (x,base) {
    return Math.log(x) / Math.log(base);
}
/**
    * Finds a string inbetween two delimiters. 
    * @param {string} this The original string.
    * @param {string} delimiter1 The first delimiter, or separator. The {@link result} will be the second half of {@link string}.
    * @param {string} delimiter2 The second delimiter. The {@link result} will be the first half of the array formed by the delimiter.
    * @returns {string} A string that is between the two delimiters.
    * @example
    * // returns "first"
    * "bigobject[first][second][third]".splitTwo("[","]")
    * @example
    * // returns "StoredValue"
    * "value{StoredValue}".splitTwo("{","}")
*/
String.prototype.splitTwo = function (delimiter1,delimiter2) {
    return this.split(delimiter1)[1].split(delimiter2)[0];
}
let remove = [
    /\s+/g,
    /'(\\.|[^'])*'/g,
    /"(\\.|[^"])*"/g,
    /\d+/g,
];
let emptyArray = /\[,*\]/g;
function stringIsArray(str) {

    for (let r of remove)
        str = str.replace(r, '');

    if (str[0] !== '[')
        return false;

    while (str.match(emptyArray))
        str = str.replace(emptyArray, '');

    return str.length === 0;
}
function shuffle([...arr]) {
    let m = arr.length;
    while (m) {
        const i = Math.floor(Math.random() * m--);
        [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
};
function sample([...arr],n=1) {
    return shuffle(arr).slice(0,n);
}
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}
function assign(object, source) {
    //console.log(object);
    if (typeof source == "object" && source) {
        Object.keys(source).forEach(function(key) {
            //console.log(key,object[key],source[key]);
            object[key] = source[key];
        });
    } else {
        return false;
    }
    
}
function reload() {
    /*Reloads the cards. The draw arr is equivalent to the deck's length */
    p1.drawarr = sample(Object.keys(p1.deck),Object.keys(p1.deck).length);
    // EXTRA ARR, may be added later and removed in hard mode
    //let extraarr = sample(Object.keys(p1.deck),Math.min(Math.round(Object.keys(p1.deck).length/2),1));
    //p1.drawarr.concat(extraarr);
    p1.drawarrindex = 0;
    reloading = true;
    battletext.innerHTML = "Reloading...";
}
function playAudio(zesound) {
    let sound = new Audio(zesound);
    sound.volume = curvolume;
    sound.play();
}
function setDisplay(element,value) {
    element.style.display = value;
}
// ULTRAWRAPPER INTEGRATION
function fullSD(element,successor,t1,t2) {
    window.clearInterval(debounceInterval);
    debouncetimer = 0;
    debounceInterval = window.setInterval(countDebounce,10);
    let ultrawrapintegration = ["adventure"];
    console.log(successor.getAttribute('id'));
    if (ultrawrapintegration.includes(successor.getAttribute('id'))) {
        ultrawrap.display = "block";
        ultrawrapimg.style.opacity = 0.3;
        ultrawrapimg.src = "img/background/"+curlocation.locimg;
    } else {
        if (successor.getAttribute('id') != "game") {
            ultrawrap.display = "none";
            ultrawrapimg.style.opacity = 0;
        }
        
    }
    element.style.opacity = 0;
    successor.style.opacity = 1;
    setDisplay(successor,t2);
    window.setTimeout(setDisplay,200,element,t1);
};
/**
 * addEffect() -> adds effect to card
 * @param {*} card -> card to affect
 * @param {*} effectname -> effect's name
 * @param {*} s -> scale of effect
 * @param {*} t -> time left
 * @param {*} u -> upgrade or not
 * 
 * Adds given effect effectname{s,t} to card. If effect is already present, boolean u decides whether or not to scale onto the effect -> effectname{cs+1,ct+t}
 */
function addEffect(card,effectname,s,t,u=false) {
    if (card.effects.some(str => str.includes(effectname)) == true && u == true) {
        let zeval = card.effects.filter(str => str.includes(effectname))[0];
        let index = card.effects.indexOf(zeval);
        let args = formateffect("Attributes",zeval);
        args[0] = Number(args[0]);
        args[0] += 1;
        args[1] += 1;
        card.effects[index] = effectname+"{"+args[0]+","+args[1]+"}";
    }
    if (card.effects.some(str => str.includes(effectname)) == false) {
        card.effects.push(`${effectname}{${s},${t}}`);
    }
    return card;
}
for (let i = 0; i < Object.keys(cards).length;i++) {
    let para = document.createElement("p");
    para.innerHTML = "<h3>"+cards[Object.keys(cards)[i]].formal+":</h3><p>"+cards[Object.keys(cards)[i]].desc+"</p><h4>Attributes</h4>";
    Object.keys(cards[Object.keys(cards)[i]]).forEach(function (key) {
        let val = cards[Object.keys(cards)[i]][key];
        let keyindex = keynames.indexOf(key);
        let formalkeyname = keyformal[keyindex];
        if (key != "funnyname" && key != "desc" && key != "img") {
            para.innerHTML += formalkeyname+": "+val+"<br>";
        }
        // use val
    });
    
    byId("cardstab").appendChild(para);
    let img = document.createElement("img");
    img.src = "img/cards/"+cards[Object.keys(cards)[i]].name+".png";
    img.width = "140";
    img.height = "160";
    byId("cardstab").appendChild(img);
}
for (let i = 0; i < Object.keys(locations).length;i++) {
    let para = document.createElement("p");
    para.innerHTML = "<h3>"+locations[Object.keys(locations)[i]].formal+":</h3><p>"+locations[Object.keys(locations)[i]].desc+"</p><h4>Attributes</h4>";
    Object.keys(locations[Object.keys(locations)[i]]).forEach(function (key) {
        let val = locations[Object.keys(locations)[i]][key];
        para.innerHTML += key+": "+val+"<hr style='opacity:0.1;margin:4px;'>";
        // use val
    });
    
    byId("locationstab").appendChild(para);
    /*let img = document.createElement("img");
    img.src = "img/cards/"+cards[Object.keys(cards)[i]].name+".png";
    img.width = "140";
    img.height = "160";
    byId("cardstab").appendChild(img);*/
}
for (let i = 0; i < Object.keys(relics).length;i++) {
    let para = document.createElement("p");
    para.innerHTML = "<h3>"+relics[Object.keys(relics)[i]].formal+":</h3><p>"+relics[Object.keys(relics)[i]].desc+"</p><h4>Attributes</h4>";
    Object.keys(relics[Object.keys(relics)[i]]).forEach(function (key) {
        let val = relics[Object.keys(relics)[i]][key];
        para.innerHTML += key+": "+val+"<hr style='opacity:0.1;margin:4px;'>";
        // use val
    });
    
    byId("relicstab").appendChild(para);
    /*let img = document.createElement("img");
    img.src = "img/cards/"+cards[Object.keys(cards)[i]].name+".png";
    img.width = "140";
    img.height = "160";
    byId("cardstab").appendChild(img);*/
}
for (let i = 0; i < Object.keys(enemies).length;i++) {
    let para = document.createElement("p");
    para.innerHTML = "<h3>"+enemies[Object.keys(enemies)[i]].formal+":</h3><h4>Attributes</h4>";
    Object.keys(enemies[Object.keys(enemies)[i]]).forEach(function (key) {
        let val = enemies[Object.keys(enemies)[i]][key];
        if (Object.prototype.toString.call(val) == '[object Array]') {
            val = val.toString();
        }
        if (Object.prototype.toString.call(val) == '[object Object]') {
            val = "{object}";
        }
        para.innerHTML += key+": "+val+"<hr style='opacity:0.1;margin:4px;'>";
        // use val
    });
    
    byId("enemiestab").appendChild(para);
    /*let img = document.createElement("img");
    img.src = "img/cards/"+cards[Object.keys(cards)[i]].name+".png";
    img.width = "140";
    img.height = "160";
    byId("cardstab").appendChild(img);*/
}
function displayCard(elem,card) {
    let id = elem.getAttribute("id");
    if (card != null && card != undefined) {
        elem.innerHTML = "<span class='title'>"+card.formal+":</span><br>"+card.hp+" HP | ";
        if (Object.hasOwn(card,"timer")) {
            elem.innerHTML += card.timer+" TIME LEFT | ";
        }
        if (Object.hasOwn(card,"atk")) {
            elem.innerHTML += card.atk+" ATK | ";
        }
        if (Object.hasOwn(card,"heal")) {
            elem.innerHTML += card.heal+" HEAL | ";
        }
        if (Object.hasOwn(card,"coolleft")) {
            if ((Object.hasOwn(card,"uses") && card.uses != -1) || Object.hasOwn(card,"timer")) {
            } else {
                elem.innerHTML += card.coolleft+" CD | ";
            }
            
        }
        if (Object.hasOwn(card,"ammo")) {
            elem.innerHTML += card.ammo+" AMMO | ";
        }
        if (Object.hasOwn(card,"scraps")) {
            elem.innerHTML += card.scraps+" SCR | ";
        }
        if (Object.hasOwn(card,"uses") && Object.hasOwn(card,"ammo") == false) {
            elem.innerHTML += card.uses+" USES | ";
        }
        if (Object.hasOwn(card,"storedmana")) {
            elem.innerHTML += card.storedmana+" STORED MANA | ";
        }
        if (Object.hasOwn(card,"manause")) {
            elem.innerHTML += card.manause+" MU";
        }
        if (card.effects.length > 0) {
            elem.innerHTML += "<br>";
            for (let i = 0; i < card.effects.length; i++) {
                let args = formateffect("Attributes",card.effects[i]);
                for (let z = 0; z < args.length; z++) {
                    args[z] = Number(args[z]);
                }
                card.effects[i] = formateffect("FlatEffect",card.effects[i])+"{"+args+"}";
                elem.innerHTML += formateffect("FlatEffect",card.effects[i])+" "+args[0];
                if (card.effects.length-i > 1) {
                    elem.innerHTML += " | ";
                }
            }
        }
        elem.innerHTML += "<br><hr><span class='desc'>"+card.desc+"</span>";
        // CARD IMAGES //
        /*#c1 {
            background-image:url("img/cards/solarprism.png");
            background-size: 140px 160px;
        }*/
        let tempimg;
        if (card.img != "") {
            tempimg = "url(img/cards/"+card.name+".png)";  
            elem.style.backgroundSize = "140px 160px";
            if (card.name == "oblivion" && card.manause == 0.5 && card.cool == 1) {
                tempimg = "url('img/cards/enragedoblivion.png')";
            }
            
        } else {
            tempimg = "url()";
            card.style.backgroundSize = "140px 160px";
        }
        if (card.effects.some(str => str.includes("Camouflaged")) == true) {
            tempimg += ", url(img/foils/camofoil.png)";
        }
        if (card.effects.some(str => str.includes("Frozen")) == true) {
            tempimg += ", url(img/foils/frostfoil.png)";
        }
        if (card.effects.some(str => str.includes("Confused")) == true) {
            tempimg += ", url(img/foils/confusedfoil.png)";
        }
        if (card.effects.some(str => str.includes("Burning")) == true) {
            tempimg += ", url(img/foils/burningfoil.png)";
        }
        if (card.effects.some(str => str.includes("Stunned")) == true) {
            tempimg += ", url(img/foils/stunnedfoil.png)";
        }
        if (card.effects.some(str => str.includes("Guarded")) == true) {
            tempimg += ", url(img/foils/guardedfoil.png)";
        }
        if (card.effects.some(str => str.includes("Shock")) == true) {
            tempimg += ", url(img/foils/shockfoil.png)";
        }
        if (card.effects.some(str => str.includes("Fear")) == true) {
            tempimg += ", url(img/foils/fearfoil.png)";
        }
        if (card.effects.some(str => str.includes("Death")) == true) {
            tempimg += ", url(img/foils/deathfoil.png)";
        }
        elem.style.backgroundSize = "140px 160px";
        elem.style.backgroundImage = tempimg;
        if (Object.hasOwn(card,"maskeffect")) {
            elem.style.mask = "url(#"+card.maskeffect+")";
        }
        
        
        /*
        if (curcard.type == "Attack") {
            card.innerHTML = "<span class='title'>"+curcard.formal+":</span><br>"+curcard.hp+" HP | "+curcard.atk+" ATK | "+curcard.coolleft+" CD<br>"+curcard.ammo+" AMMO | "+curcard.manause+" MU<br><hr><span class='desc'>"+curcard.desc+"</span>";
        }
        if (curcard.type == "Healing") {
            if (curcard.uses == -1) {
                card.innerHTML = "<span class='title'>"+curcard.formal+":</span><br>"+curcard.hp+" HP | "+curcard.heal+" HEAL | "+curcard.coolleft+" CD<br>"+curcard.tempuses+" AMMO | "+curcard.manause+" MU<br><hr><span class='desc'>"+curcard.desc+"</span>";
            } else {
                card.innerHTML = "<span class='title'>"+curcard.formal+":</span><br>"+curcard.hp+" HP | "+curcard.heal+" HEAL | "+curcard.uses+" USES | "+curcard.manause+" MU<br><hr><span class='desc'>"+curcard.desc+"</span>";
            }
        }
        if (curcard.type == "Support") {
            card.innerHTML = "<span class='title'>"+curcard.formal+":</span><br>"+curcard.hp+" HP | "+curcard.manause+" MU<br><hr><span class='desc'>"+curcard.desc+"</span>";
        }*/
        
    } else {
        elem.innerHTML = "NO CARD";
        elem.style.backgroundImage = null;  
    }
}
function displayRelic(elem,relic) {
    elem.style.width = "120px";
    elem.style.height = "120px";
    
    elem.innerHTML = "<span class='title'>"+currelic.formal+":</span><br>"+currelic.rarity+" RARITY | ";
    elem.innerHTML += "<br><hr><span class='desc'>"+currelic.desc+"</span>";
    let tempimg;
    if (currelic.img != "") {
        tempimg = "url(img/relics/"+relic.name+".png)";  
        elem.style.backgroundSize = "120px 120px";
    } else {
        tempimg = "url()";
        elem.style.backgroundSize = "120px 120px";
    }
    elem.style.backgroundSize = "120px 120px";
    elem.style.backgroundImage = tempimg;
    elem.className = "tooltipholder";
    let relictooltip = document.createElement("span");
    relictooltip.className = "tooltip";
    let zehtml = `<h3 style="font-size:22px;margin:0;">${relic.formal}</h3><p style="font-size:14px;">${relic.desc}<br><br>${currelic.advdesc}<br><br>Current relic stats: ${relic.attr.toString()}</p>`;
    let tries = 0;
    do {
        console.log("YE");
        if (zehtml.includes(".EXEC")) {
            let zefunc = zehtml.splitTwo(".EXEC{","}");
            let result = eval(zefunc);
            if (result == "undefined" || result == undefined) {
                result = "";
            }
            zehtml = zehtml.replace(".EXEC{"+zehtml.splitTwo(".EXEC{","}")+"}",result);
        }
        tries++;
    } while (tries < 50 && zehtml.includes(".EXEC"));
    relictooltip.innerHTML = zehtml;
    elem.appendChild(relictooltip);
}




function checkDead() {
    if (p1.health < 1) {
        resetBattleUI();
        fullSD(gamescreen,menuscreen,"none","block");
        sob = 2;
        //window.setTimeout(enterAdventureScreen,200);
        gametitle.innerHTML = "You Lose..";
        playbtn.innerHTML = "RESTART";
        openBtn.style.display = "none";
    }
}

function addRelic(player,relic,changes=null) {
    Game[player].relics[relic] = structuredClone(relics[relic]);
    if (changes) {
        Game[player].relics[relic].attr = changes;
    }
}

function drawCard(player,specific = false,choice = null,otherargs = ["None"]) {
    if (otherargs.includes("specialp")) {
        let chosenkey = cards[choice];
        let key = {};
        assign(key,chosenkey);
        key.effects = [];
        player.deck[key.name] = key;
        key["cardmods"] = [];
        return false;
    }
    if (otherargs.includes("setcard")) {
        let key = choice;
        let table = otherargs[1];
        if (Object.hasOwn(Game[player][table],key.name)) {
            let i2 = 0;
            do {
                i2++;
            } while (i2 <1000 && Object.hasOwn(Game[player][table],key.name+i2));
            
            if (Object.hasOwn(Game[player][table],key.name+i2) == false) {
                Game[player][table][key.name+i2] = key;
            }
        } else {
            Game[player][table][key.name] = key;
        }
        return false;
    }
    if (otherargs[0] == "None" && player == "p1" && reloading == true) {
        return false;
    }
    let table = "inventory"; // by default add to inventory, but add to deck if argument is given
    if (otherargs.includes("addToDeck")) {
        table = "deck";
    } 
    if (Object.keys(Game[player][table]).length >= 10) { // prevent overflow of cards (no more than 10)
        return "Too many cards!";
    }

    let chosenkey;
    chosenkey = randKey(Game[player].deck); // gets random key from player's deck andadds it to the deck
    if (otherargs[0] == "None" && player == "p1") {
        chosenkey = p1.deck[p1.drawarr[p1.drawarrindex]];
        p1.drawarrindex++;
        if (p1.drawarrindex == p1.drawarr.length) {
            reload();
        } else {
            reloading = false;
            battletext.innerHTML = "Next Card: "+p1.drawarr[p1.drawarrindex];
        }
    }
    if (otherargs.includes("addToDeck")) { // if addToDeck is true, chooses a random one from the shop
        chosenkey = randKey(shopcards);

        
    }
    if (specific == true) { // if specific is true, adds the given card
        chosenkey = cards[choice];
        if (otherargs.includes("addToDeck")) {
            chosenkey = shopcards[choice];
        }
        if (Object.keys(Game[player].deck).includes(choice) && otherargs.includes("addToDeck") == false) {
            chosenkey = Game[player].deck[choice];
        }
    }    let key = {};
    assign(key,chosenkey); // assign the values
    key.effects = [];
    if (otherargs.includes("addToDeck")) { 
        key.level = 0; // set's the card's level to be 0
        // add special masks with 1/100 chance
        let masks = ["mask-1","mask-2"];
        if (randNum(1,100) == 100) {
            key.maskeffect = randItem(masks);
        }
    }

    if (key.obtainable == false && specific == false && otherargs == null) {
        drawCard(player);
        return false;
    }
    
    if (Object.hasOwn(Game[player][table],key.name)) {
        let i2 = 0;
        do {
            i2++;
        } while (i2 <1000 && Object.hasOwn(Game[player][table],key.name+i2));
        
        if (Object.hasOwn(Game[player][table],key.name+i2) == false) {
            Game[player][table][key.name+i2] = key;
        }
    } else {
        Game[player][table][key.name] = key;
    }
    if (otherargs.includes("addToDeck") || otherargs.includes("ignoreReload")) {
        key["cardmods"] = [];
    }
    playAudio("sounds/draw-card.mp3");
    if (otherargs[0] == "None") {
        if (player == "p1") {
            
            if (currentmode == "Easy") {
                key.hp *= 1.5;
                if (key.type == "Attack") {
                    key.atk *= 1.5;
                }
                if (key.type == "Healing") {
                    key.heal *= 1.5;
                }
            }
            if (currentmode == "Hard") {
                key.hp *= 0.8;
                if (key.hp < 5) {
                    key.hp = 5;
                }
                if (key.type == "Attack") {
                    key.atk *= 0.8;
                    if (key.atk < 5) {
                        key.atk = 5;
                    }
                }
                if (key.type == "Healing") {
                    key.heal *= 0.8;
                    if (key.heal < 5) {
                        key.heal = 5;
                    }
                }
            }
            if (currentmode == "Insane") {
                key.hp -= 35;
                if (key.hp < 5) {
                    key.hp = 5;
                }
                if (key.type == "Attack") {
                    key.atk *= 0.6;
                    if (key.atk < 5) {
                        key.atk = 5;
                    }
                }
                if (key.type == "Healing") {
                    key.heal -= 20;
                    if (key.heal < 5) {
                        key.heal = 5;
                    }
                }
            }
            if (currentmode == "Cataclysm") {
                key.hp *= 0.5;
                if (key.hp < 5) {
                    key.hp = 5;
                }
                if (key.type == "Attack") {
                    key.atk *= 0.5;
                    if (key.atk < 5) {
                        key.atk = 5;
                    }
                }
                if (key.type == "Healing") {
                    key.heal = 0;
                }
            }
        }
    }
    if (otherargs.includes("addToDeck") == false) {
        if (player == "p1" && Object.hasOwn(p1.relics,"hammerhammer") && ["factory","dysonsphere"].includes(key.name)) {
            key.manause += 1;
        }
        if (key.name == "etherealguardian") {
            let chosen;
            for (let i = 0; i < Object.keys(Game[player].inventory).length; i++) {
                let tempchosen = Game[player].inventory[Object.keys(Game[player].inventory)[i]];
                if (tempchosen.effects.some(str => str.includes("Guarded")) == false) {
                    chosen = tempchosen;
                    break;
                }
            }
            if (chosen == null) {
            } else {
                chosen.effects.push("Guarded{1,5}")
            }
        }
        if (Game[player].mods.some(str => str.includes("QuickUse"))) {
            let str = Game[player].mods.filter(str => str.includes("QuickUse"))[0];
            str = str.replace("QuickUse{","");
            str = Number(str.replace("}",""));
            if (key.coolleft != 0) {
                key.coolleft -= str;
                if (key.coolleft < 0) {
                    key.coolleft = 0;
                    key.hp += 15;
                }
            }
        }
        if (Game[player].mods.some(str => str.includes("Tank"))) {
            let str = Game[player].mods.filter(str => str.includes("Tank"))[0];
            str = str.replace("Tank{","");
            str = Number(str.replace("}",""));
            key.hp += key.hp*(str/100);
            key.hp = Math.round(key.hp);
        }
        if (Game[player].mods.some(str => str.includes("Strength")) && Object.hasOwn(key,"atk")) {
            let str = Game[player].mods.filter(str => str.includes("Strength"))[0];
            str = str.replace("Strength{","");
            str = Number(str.replace("}",""));
            key.atk += key.atk*(str/100);
            key.atk = Math.round(key.atk);
        }
        if (Game[player].mods.some(str => str.includes("Healing")) && Object.hasOwn(key,"heal")) {
            let str = Game[player].mods.filter(str => str.includes("Healing"))[0];
            str = str.replace("Healing{","");
            str = Number(str.replace("}",""));
            key.heal += key.heal*(str/100);
            key.heal = Math.round(key.heal);
        }
    }
    if (otherargs.includes("doubleStats")) {
        key.hp *= 2;
        if (Object.hasOwn(key,"atk")) {
            key.atk *= 2;
        }
        if (Object.hasOwn(key,"heal")) {
            key.heal *= 2;
        }
        if (Object.hasOwn(key,"stat")) {
            key.stat += key.statincrease*2;
        }
    }
    key.hp = Math.round(key.hp);
    if (Object.hasOwn(key,"atk")) {
        key.atk = Math.round(key.atk);
    }
    if (Object.hasOwn(key,"heal")) {
        key.heal = Math.round(key.heal);
    }
    update();
    return Object.keys(Game[player][table])[Object.keys(Game[player][table]).length-1];
} 

Array.from(document.getElementsByClassName("card")).forEach(function(element) {
    element.innerHTML = "loading...";
});
function formateffect(type,effect) {
    if (type == "FlatEffect") {
        let newfx = effect.split("{")[0];
        return newfx;
    }
    if (type == "Attributes") {
        let args = effect.split("{")[1];
        args = args.replace("}","").split(",");
        return args;
    }
}
function cleanseModifier(type,mod) {
    if (type=="Norm") {
        let newmod = mod.split("{")[1];
        if (newmod.includes(",")) {
            newmod = newmod.split(",");
            let nmp2 = newmod[1].replace("}","");
            return [newmod[0],nmp2];
        } else {
            return Number(newmod.replace("}",""));
        }
        
    }
}
function increaseModifier(type,mod,amount) {
    if (type=="Norm") {
        let oldmod = mod.split("{")[0];
        console.log(mod);
        let newmod = mod.split("{")[1];
        console.log(newmod);
        newmod = newmod.split(",")
        newmod = [newmod[0],newmod[1].replace("}","")];
        console.log(newmod);
        for (let i =0; i < newmod.length; i++) {
            newmod[i] += amount[i];
        }
        mod = oldmod+"{"+newmod.toString()+"}";
        return oldmod+"{"+newmod.toString()+"}";
        
    }
}
function update(reset = null) {
    battletitle.innerHTML = "Fight Against "+p2.formal+" "+deathmode;
    p1txt.innerHTML = "You: "+p1.health+" Health | "+p1.mana+" Mana";
    p2txt.innerHTML = p2.formal+": "+p2.health+" Health | "+p2.mana+" Mana | AI MODE "+aimode+" (for testing) |";
    if (p2.mods.length > 0) {
        for (let i =0; i < p2.mods.length; i++) {
            let mod = p2.mods[i];
            let flat = formateffect("FlatEffect",mod);
            let attr = cleanseModifier("Norm",mod);
            if (arrHas(Object.keys(modifiers),flat.toLowerCase())) {
                let zemod = modifiers[arrFirst(Object.keys(modifiers),flat.toLowerCase())];
                p2txt.innerHTML += ` <span class='tooltipholder'><img class='ico' src='img/modifiers/${zemod.img}'/><span class='tooltip'>${zemod.formal}&emsp;<img class='ico' src='img/modifiers/${zemod.img}'/><br><span class='text-mini'>${zemod.desc}<br>Mod Stats:${attr}</span></span></span>`;
            }
        }
    }
    discardbtn.innerHTML = "Discard ("+p1.discards+" left)";
    if (turn == 1) {
        whichturn.innerHTML = "YOUR TURN";
    } else {
        whichturn.innerHTML = "OPP TURN";
    }
    if (reset == null && adventurescreen.style.display == "none") {
        if (p1.health <= 0) {
            gametitle.innerHTML = "YOU LOSE!!!!";
            endBattle(2);
        }
        if (p2.health <= 0) {
            gametitle.innerHTML = "YOU WIN!!!!";
            endBattle(1);
        }
    }
    
    /*if (p1.health <= 0 || p2.health <= 0) {
        whichturn.innerHTML = "<a href='.'>PLAY AGAIN</a>";
        throw new Error('GAME ENDED');
    }*/
    Array.from(document.getElementsByClassName("card")).forEach(function(element) {
        let card = element;
        let id = element.getAttribute("id");
        let index;
        let curcard;
        if (id.includes("c")) {
            index = Number(id.replace("c",""))-1;
            curcard = p1.inventory[Object.keys(Game.p1.inventory)[index]];
        } else {
            index = Number(id.replace("o",""))-1;
            curcard = p2.inventory[Object.keys(Game.p2.inventory)[index]];
        }
        if (curcard == undefined) {
            card.innerHTML = "NO CARD";
            card.style.backgroundImage = null;  
            return false;
        }
        console.log(id,index,curcard);
        if (curcard.hp <= 0 && id.includes("c")) {
            delete p1.inventory[Object.keys(Game.p1.inventory)[index]];
            update();
            return false;
        }
        if (curcard.hp <= 0 && id.includes("o")) {
            delete p2.inventory[Object.keys(Game.p2.inventory)[index]];
            update();
            return false; 
        }
        displayCard(element,curcard);
        /*let card = element;
        let id = element.getAttribute("id");
        let index;
        let curcard;
        if (id.includes("c")) {
            index = Number(id.replace("c",""))-1;
            curcard = p1.inventory[Object.keys(Game.p1.inventory)[index]];
        } else {
            index = Number(id.replace("o",""))-1;
            curcard = p2.inventory[Object.keys(Game.p2.inventory)[index]];
            
        }
        if (curcard != null && curcard != undefined) {
            if (curcard.hp <= 0 && id.includes("c")) {
                delete p1.inventory[Object.keys(Game.p1.inventory)[index]];
                update();
                return false;
            }
            if (curcard.hp <= 0 && id.includes("o")) {
                delete p2.inventory[Object.keys(Game.p2.inventory)[index]];
                update();
                return false; 
            }
            card.innerHTML = "<span class='title'>"+curcard.formal+":</span><br>"+curcard.hp+" HP | ";
            if (Object.hasOwn(curcard,"atk")) {
                card.innerHTML += curcard.atk+" ATK | ";
            }
            if (Object.hasOwn(curcard,"heal")) {
                card.innerHTML += curcard.heal+" HEAL | ";
            }
            if (Object.hasOwn(curcard,"coolleft")) {
                if (Object.hasOwn(curcard,"uses") && curcard.uses != -1) {

                } else {
                    card.innerHTML += curcard.coolleft+" CD | ";
                }
                
            }
            if (Object.hasOwn(curcard,"ammo")) {
                card.innerHTML += curcard.ammo+" AMMO | ";
            }
            if (Object.hasOwn(curcard,"uses") && Object.hasOwn(curcard,"ammo") == false) {
                card.innerHTML += curcard.uses+" USES | ";
            }
            if (Object.hasOwn(curcard,"storedmana")) {
                card.innerHTML += curcard.storedmana+" STORED MANA | ";
            }
            if (Object.hasOwn(curcard,"manause")) {
                card.innerHTML += curcard.manause+" MU";
            }
            if (curcard.effects.length > 0) {
                card.innerHTML += "<br>";
                for (let i = 0; i < curcard.effects.length; i++) {
                    let args = formateffect("Attributes",curcard.effects[i]);
                    for (let z = 0; z < args.length; z++) {
                        args[z] = Number(args[z]);
                    }
                    curcard.effects[i] = formateffect("FlatEffect",curcard.effects[i])+"{"+args+"}";
                    card.innerHTML += formateffect("FlatEffect",curcard.effects[i])+" "+args[0];
                    if (curcard.effects.length-i > 1) {
                        card.innerHTML += " | ";
                    }
                }
            }
            card.innerHTML += "<br><hr><span class='desc'>"+curcard.desc+"</span>";
            // CARD IMAGES //
            let tempimg;
            if (curcard.img != "") {
                tempimg = "url(img/cards/"+curcard.name+".png)";  
                card.style.backgroundSize = "140px 160px";
                if (curcard.name == "oblivion" && curcard.manause == 0.5 && curcard.cool == 1) {
                    tempimg = "url('img/cards/enragedoblivion.png')";
                }
                
            } else {
                tempimg = "url()";
                card.style.backgroundSize = "140px 160px";
            }
            if (curcard.effects.some(str => str.includes("Camouflaged")) == true) {
                tempimg += ", url(img/foils/camofoil.png)";
            }
            if (curcard.effects.some(str => str.includes("Frozen")) == true) {
                tempimg += ", url(img/foils/frostfoil.png)";
            }
            if (curcard.effects.some(str => str.includes("Confused")) == true) {
                tempimg += ", url(img/foils/confusedfoil.png)";
            }
            if (curcard.effects.some(str => str.includes("Burning")) == true) {
                tempimg += ", url(img/foils/burningfoil.png)";
            }
            if (curcard.effects.some(str => str.includes("Stunned")) == true) {
                tempimg += ", url(img/foils/stunnedfoil.png)";
            }
            if (curcard.effects.some(str => str.includes("Guarded")) == true) {
                tempimg += ", url(img/foils/guardedfoil.png)";
            }
            if (curcard.effects.some(str => str.includes("Shock")) == true) {
                tempimg += ", url(img/foils/shockfoil.png)";
            }
            if (curcard.effects.some(str => str.includes("Fear")) == true) {
                tempimg += ", url(img/foils/fearfoil.png)";
            }
            if (curcard.effects.some(str => str.includes("Death")) == true) {
                tempimg += ", url(img/foils/deathfoil.png)";
            }
            card.style.backgroundSize = "140px 160px";
            card.style.backgroundImage = tempimg;
            if (Object.hasOwn(curcard,"maskeffect")) {
                card.style.mask = "url(#"+curcard.maskeffect+")";
            }
            
            
        } else {
            card.innerHTML = "NO CARD";
            card.style.backgroundImage = null;  
        }*/
        
    
    });
}
function resetBattleUI(){
    p1.inventory = {};
    p2.inventory = {};
    update(true);
}
function startBattle(enemy) {
    Game.p2 = {};
    let zeopp = enemies[enemy];
    turns = 0;
    p1.mods = [];
    battletitle.innerHTML = "Fight Against "+zeopp.formal;
    p1.mana = p1.startingmana;
    ultrawrapimg.src = "img/background/"+zeopp.fightimg;
    assign(Game.p2,zeopp);
    p2 = Game.p2;
    
    reload();
    reloading = false;
    battletext.innerHTML = "Next Card: "+p1.drawarr[p1.drawarrindex];

    for (let i = 0; i < 3; i++) {
        drawCard("p1",false,null,"Start");
    }
    for (let j = 0; j < 3; j++) {
        drawCard("p2",false,null,"Start");
    }
    if (currentmode == "Hard") {
        p2.health *= 1.2;
    }
    if (currentmode == "Cataclysm") {
        p2.health *= 2;
    }
    if (currentmode == "Easy") {
        p2.health *= 0.7;
    }
    gamescreen.style.display = "block";
    // RELICS
    if (Object.hasOwn(p1.relics,"emberring")) {
        let relic = p1.relics["emberring"];

        p1.mods.push("FlameTouch{"+relic.attr.toString()+"}");
    }
    if (Object.hasOwn(p1.relics,"grandfatheroak")) {
        let relic = p1.relics["grandfatheroak"];
        p1.mods.push("Tank{"+relic.attr+"}");
    }
    if (Object.hasOwn(p1.relics,"redstarmedallion")) {
        let relic = p1.relics["redstarmedallion"];
        p1.mods.push("RedStarMedallion{"+relic.attr+"}");
    }
    if (Object.hasOwn(p1.relics,"soullantern")) {
        let relic = p1.relics["soullantern"];
        p1.mods.push("SoulLantern{"+relic.attr+"}");
    }
    update();
}
function endBattle(outcome) {
    ultrawrapimg.src = "";
    p1.drawarr = [];
    p1.drawarrindex = 0;
    // 1 == win | 2== lose
    if (outcome == 1) {
        nextLoc();
        resetBattleUI();
        fullSD(gamescreen,menuscreen,"none","block");
        sob = 2;
        //window.setTimeout(enterAdventureScreen,200);
        gametitle.innerHTML = "Victory!";
        playbtn.innerHTML = "CONTINUE";
        openBtn[1].style.display = "none";
        let enemy = enemies[p2.name];
        p1.coins += Math.round((randNum(10,20)/10)*(enemy.health/10));
        p1.coins += enemy.coinsgive;
        console.log("hello",p1.coins,enemy.coinsgive)
        if (Object.hasOwn(p1.relics,"coinsack")) {
            p1.coins += Math.round((randNum(10,20)/10)*(enemy.health/10)*p1.relics.coinsack.attr);
        }
        enemy.managain *= 1.5;
        enemy.health *= 1.5;
        enemy.mana *= 1.5;
        if (Object.hasOwn(p1.relics,"partyhat")) {
            p1.health += (p1.relics["partyhat"].attr/100)*p1.maxhealth;
            p1.health = Math.round(p1.health);
            p1.coins -= 5;
            if (p1.health > p1.maxhealth) {
                p1.health = p1.maxhealth;
            }
        }
        if (enemy.name == "cheesedino") {
            p1.maxhealth += 50;
            p1.health += 50;
        }
    }
    if (outcome == 2) {
        resetBattleUI();
        fullSD(gamescreen,menuscreen,"none","block");
        sob = 2;
        //window.setTimeout(enterAdventureScreen,200);
        gametitle.innerHTML = "You Lose..";
        playbtn.innerHTML = "RESTART";
        openBtn[1].style.display = "none";
    }
}
/*
for (let i = 0; i < 3; i++) {
        let chosenkey = randKey(cards);
        let key = {};
        assign(key,chosenkey);
        if (Object.hasOwn(Game.p1.inventory,key.name)) {
            let i2 = 0;
            do {
                i2++;
            } while (i2 <1000 && Object.hasOwn(Game.p1.inventory,key.name+i2));
           
            if (Object.hasOwn(Game.p1.inventory,key.name+i2) == false) {
                Game.p1.inventory[key.name+i2] = key;
            }
        } else {
            Game.p1.inventory[key.name] = key;
        }
    }
    for (let j = 0; j < 3; j++) {
        let chosenkey = randKey(cards);
        let key = {};
        assign(key,chosenkey);
        if (Object.hasOwn(Game.p2.inventory,key.name)) {
            let j2 = 0;
            do {
                j2++;
            } while (j2 <1000 && Object.hasOwn(Game.p2.inventory,key.name+j2));
            if (Object.hasOwn(Game.p2.inventory,key.name+j2) == false) {
                Game.p2.inventory[key.name+j2] = key;
            }
        } else {
            Game.p2.inventory[key.name] = key;
        }
    }
*/
function firstOpp(player) {
    let plr = Game[player];
    if (Object.keys(plr.inventory).length > 0) {
        let chosen;
        for (let i = 0; i < Object.keys(plr.inventory).length; i++) {
            if (plr.inventory[Object.keys(plr.inventory)[i]].effects.some(str => str.includes("Camouflaged")) == false) {
                chosen = Object.keys(plr.inventory)[i];
                break;
            }
        }
        if (chosen == null) {
            return "Opp";
        }
        return chosen;
    } else {
        return "Opp";
    }
}
function turnover(player) {
    // argument 'player' means the player that just ended their turn
    turns++;
    let curdeath;
    if (turns % 20 == 0) {
        if (deathmode != "") {
            curdeath = deathmode.replace("[DEATH MODE ","");
            curdeath = Number(curdeath.replace("]",""));
        } else {
            curdeath = 0;
        }
        deathmode = "[DEATH MODE "+(curdeath+1)+"]";
        if (currentmode == "Hard") {
            p1.health += 20;
            p2.health += 20;
        }
        if (currentmode == "Insane") {
            p1.health += 50;
            p2.health += 50;
        }
        if (currentmode == "Cataclysm") {
            p1.health += 70;
            p2.health += 70;
        }
        p1.health -= 25;
        p2.health -= 50;
        p1.mana += 22;
        p2.mana += 15;
    }
    let plr;
    if (player == "p1") {
        plr = p1;
        reloading = false;
        battletext.innerHTML = "Next Card: "+p1.drawarr[p1.drawarrindex];
        p1.drawarr.push(randItem(Object.keys(p1.deck)));
    } else {
        plr = p2;
    }
    plr.mana = stepRound(plr.mana,0.1);
    if (plr == p1) {
        if (Object.hasOwn(p1.relics,"redstarstaff") && (turns+1) % 10 == 0 && p1.health > 60 && Object.keys(p1.inventory).length > 0) {
            p1.health -= 20;
            let zestat = p1.relics.redstarstaff.attr;
            console.log(zestat);
            for (let i =0; i < Object.keys(p1.inventory).length; i++) {
                let zecard = p1.inventory[Object.keys(p1.inventory)[i]];
                zecard.hp *= 1+zestat;
                zecard.hp = Math.round(zecard.hp);
                if (Object.hasOwn(zecard,"atk")) {
                    zecard.atk *= 1+zestat;
                    zecard.atk = Math.round(zecard.atk);
                }
                if (Object.hasOwn(zecard,"heal")) {
                    zecard.heal *= 1+zestat;
                    zecard.heal = Math.round(zecard.heal);
                }
                if (Object.hasOwn(zecard,"ammo")) {
                    zecard.ammo++;
                }
                zecard.coolleft = 0;
                
            }
            p1.mana += 3;
        }
        if (Object.hasOwn(p1.relics,"beamturret") && (turns+1) % 8 == 0 && p1.mana > 0) {
            p1.mana -= 1;
            if (Object.keys(p2.inventory).length > 0) {
                let card = p2.inventory(Object.keys(p2.inventory)[0]);
                card.hp -= p1.relics.beamturret.attr;
            } else {
                p2.health -= p1.relics.beamturret.attr;
            }
        }
    }
    if (plr.name == "goldslime") {
        plr.health -= 20;
    }
    if (plr.name == "magicapprentice") {
        // to get a cycle, do: turns % 6 == 0, turns % 6 == 2, and turns % 6 == 4
        if (turns % 6 == 0) {
            if (Object.keys(p2.inventory).length > 0) {
                let card = p2.inventory[Object.keys(p2.inventory)[0]];
                card.hp += 50;
            }
        } 
        // ^^ WALL ^^
        if (turns % 6 == 2) {
            for (let i = 0; i < 2; i++) {
                let card = randKey(p1.inventory);
                if (card != null) {
                    card.coolleft += 2;
                }
            }
        }
        // ^^ LOCK CARD ^^
        if (turns % 6 == 4) {
            for (let i = 0; i < 4; i++) {
                let card = randKey(p1.inventory);
                if (card != null) {
                    if (randNum(1,4) == 4) {
                        plr.health -= 11+(i*2);
                    } else {
                        card.hp -= 11+(i*2);
                        if (arrHas(card.effects,"Shock") == false) {
                            card.effects.push("Shock{2,2}");
                        }
                    }
                    
                }
            }
        } 
        // ^^ LIGHTNING CLOUD ^^
    }
    if (plr.name == "janjo" && turns % 4 == 0) {
        for (let i = 0; i < 3; i++) {
            let card = randKey(p1.inventory);
            if (card != null) {
                if (arrHas(card.effects,"Burning") == false) {
                    card.effects.push("Burning{1,1}");
                }
            }
        }
        playAudio("sounds/burn.mp3");
    }
    if (plr.name == "djneon" && turns % 4 == 0) {
        for (let i = 0; i < 3; i++) {
            let card = randKey(p1.inventory);
            console.log("yuh",card);
            if (card != null) {
                if (arrHas(card.effects,"Stunned") == false) {
                    card.effects.push("Stunned{1,2}");
                }
            }
        }
    }
    console.log(turns);
    // boss abilities during turn
    if (plr.name == "wisespirits") {
        // to get a cycle, do: turns % 6 == 0, turns % 6 == 2, and turns % 6 == 4
        if (turns % 6 == 0) {
            for (let i = 0; i < 3; i++) {
                let card = randKey(p2.inventory);
                if (card != null) {
                    card.hp += 20;
                    if (Object.hasOwn(card,"atk")) {
                        card.atk += 20;
                    }
                    if (Object.hasOwn(card,"heal")) {
                        card.heal += 20;
                    }
                    card.coolleft = 0;
                    card.ammo += 2;
                }
            }
            // AVOD'S ABILITY
        } 
        if (turns % 6 == 2) {
            for (let i = 0; i < 3; i++) {
                let card = randKey(p2.inventory);
                if (card != null) {
                    card.hp += 20;
                }
            }
            // LAPPUR'S ABILITY
        }
        if (turns % 6 == 4) {
            for (let i = 0; i < 4; i++) {
                let card = randKey(p1.inventory);
                if (card != null) {
                    if (arrHas(card.effects,"Death") == false) {
                        card.effects.push("Death{1,2}");
                    }
                    card.hp -= 10;
                }
            }
            // PRASKIM'S ABILITY
        } 
    }
    if (plr.name == "lordk" && turns % 4 == 0) {
        for (let i = 0; i < 4; i++) {
            let card = randKey(p1.inventory);
            console.log("yuh",card);
            if (card != null) {
                if (arrHas(card.effects,"Stunned") == false) {
                    card.effects.push("Stunned{1,2}");
                }
                card.hp -= 20;
            }
        }
        playAudio("sounds/bash.mp3");
        p1.health -= 50;
        p1.mana -= 3;
        if (p1.mana < 0) {
            p1.mana = 0;
        }
    }
    if (plr.name == "trafficlord" && randNum(1,3) == 3) {
        let card = randKey(p1.inventory);
        card.coolleft += 2;
    }
    if (plr.name == "trafficlord" && randNum(1,10) == 10 && Object.keys(p1.inventory).length > 1) {
        let card = randKey(p1.deck);
        let key = getKeyByValue(p1.deck,card);
        delete p1.deck[key];
    }
    
    plr.discards = plr.maxdiscards;
    plr.mana += plr.managain;
    if (plr == p1 && arrHas(Object.keys(plr.relics),"gamblersdice")) {
        plr.mana -= plr.managain;
        plr.mana += Math.round((randNum(plr.relics.gamblersdice.attr[0], plr.relics.gamblersdice.attr[1])/100)*plr.managain);
    }
    for (let i = 0; i < Object.keys(plr.inventory).length; i++) {
        let zecard = plr.inventory[Object.keys(plr.inventory)[i]];
        if (Object.hasOwn(zecard,"coolleft") && zecard.coolleft != 0) {
            zecard.coolleft -= 1;
            
        }
        if ((currentmode == "Cataclysm" || (currentmode == "Custom" && customtype == "decay")) && player == "p1") {
            zecard.hp -= 20;
        }
        for (let j = 0; j < zecard.effects.length;j++) {
            let effect = zecard.effects[j];
            let args = formateffect("Attributes",effect);
            args[0] = Number(args[0]);
            args[1] = Number(args[1]);
            let flatfx = formateffect("FlatEffect",effect);
            console.log(effect);
            // [0] == scale; [1] == timeleft
            if (flatfx == "Burning") {
                zecard.hp -= Number(args[0])*8;
                if (zecard.cardmods.includes("infernalfoil")) {
                    zecard.hp += Number(args[0])*14;
                }
            }
            if (flatfx == "Shock") {
                zecard.hp -= 15;
                if (Object.hasOwn(zecard,"atk")) {
                    zecard.atk *= 1.2;
                    zecard.atk = Math.round(zecard.atk);
                }
            }
            if (flatfx == "Frozen") {
                zecard.hp -= Number(args[0])*15;
                if (Object.hasOwn(zecard,"atk")) {
                    zecard.atk -= 10;
                    if (zecard.atk < 5) {
                        zecard.atk = 5;
                    }
                }
            }
            if (flatfx == "Fear") {
                zecard.coolleft += 1;
                if (Object.hasOwn(zecard,"atk")) {
                    zecard.atk -= 10;
                }
            }
            if (args[0] > 1) {
                args[0] -= 1;
            }
            
            if (args[1] == 1) {
                if (flatfx == "Death") {
                    delete plr.inventory[Object.keys(plr.inventory)[i]];
                    continue;
                }
                zecard.effects.splice(j,1);
                continue;
                
            }
            if (args[1] > 1) {
                args[1] -= 1;
            }
            zecard.effects[j] = flatfx+"{"+args.toString()+"}";
        }
        if (zecard.type == "Attack") {
            if (zecard.ammo < zecard.maxammo) {
                zecard.ammo += 1;
            }
        }
        if (zecard.name == "charger") {
            zecard.hp += 10;
            zecard.atk += 22;
        }
        if (zecard.name == "bank") {
            // gain bank's stat (default 2) value every turn
            zecard.storedmana += zecard.stat;
        }
        if (Object.hasOwn(zecard,"timer")) {
            zecard.timer -= 1;
        }
        if (zecard.name == "hotpotato" && zecard.timer == 0) {
            plr.health -= 50;
            delete plr.inventory[Object.keys(plr.inventory)[i]];
            
            for (let i =0; i < 3; i++) {
                let zecard2 = randKey(plr.inventory);
                if (zecard2 != undefined) {
                    zecard2.health = 0;
                } else {
                    plr.health -= 20;
                }
            }
        }
        if (zecard.name == "comet" && zecard.timer == 0) {
            plr.health -= zecard.atk;
            delete plr.inventory[Object.keys(plr.inventory)[i]];
            for (let i =0; i < 3; i++) {
                let zecard2 = randKey(plr.inventory);
                if (zecard2 != undefined) {
                    zecard2.health = 0;
                } else {
                    plr.health -= 20;
                }
            }
        }
        if (zecard.name =="phaser") {
            // checks if phaser's stat qualifies (base chance is 30%)
            let chance = randNum(1,100);
            console.log("Chance is: "+chance,zecard.stat);
            if (chance <= zecard.stat) {
                zecard.effects.push("Phased{1,1}");
            }
            
        }
    }
    if (plr.name == "trafficlord" && randNum(1,6) == 6) {
        p1.mana = 0;
        p1.discards = 0;
    }
}
function unborder(id) {
    let zeelement = document.getElementById(id);
    if (zeelement == focused) {
        focused = null;
    }
    zeelement.style.border = "1px solid black";
    zeelement.style.backgroundColor = null;
}
function unblockOpp() {
    blockoppturn = false;
    blockturnover = false;
}
function playerTurn() {
    let prevturn = turn;
    if (prevturn == 2) {
        turn = 1;
        oppturndone = false;
        blockoppturn = true;
        blockturnover = true;
        window.setTimeout(unblockOpp,2000);
        turnover("p2");
        if (prevturn == 2) {

        }

        update();
    }
    
}
/**
 * Gets first object element in array where a subkey is a subvalue
 * @param {Array} arr 
 * @param {String} subkey
 * @param {String} subvalue 
 * @param {Boolean} object_return decides whether or not object or index is returned
 * @return {Object} first object where subkey is specified value
 */
function getFirstWithValue(arr,subkey,subvalue,object_return=false) {
    arr = objectToArray(arr);
    console.log(arr);
    for (let i = 0; i < arr.length; i++) {
        // iterate through all elems in array, try to find where subkey is value
        console.log(arr[i]);
        if (tryAccess(arr[i],subkey) == subvalue) {
            if (object_return == true) {
                return arr[i];
            } else {
                return i;
            }
            
        }
    }
}
function oppAttack() {
    let tries = 0;
    let chosencard;
    let index;
    let done = false;
    do {
        chosencard = randKey(p2.inventory);
        index;
        for (let z = 0; z < Object.keys(p2.inventory).length; z++) {
            if (chosencard == p2.inventory[Object.keys(p2.inventory)[z]]) {
                index = z;
                if (chosencard.name == "Drawback") {
                    let chance = randNum(1,4);
                    if (chance == 4) {
                        done = true;
                    }
                    if (Object.keys(p2.inventory).length < 3) {
                        done = false;
                    }
                } else {
                    done = true;
                }
                
            }
        }
       
        tries++;
    } while (p2.mana > 0 && tries < 200 && done == false);
    console.log(chosencard);
    if (chosencard == null) {
        return false;
    }
    useCard(null,true,index);
    return chosencard.manause;
}
function oppDraw() {
    if (Object.keys(p2.inventory).length < 10) {
        drawCard("p2");
        if (tryAccess(p2,"aitype") == "super-buff" && p2.inventory[Object.keys(p2.inventory)[Object.keys(p2.inventory).length - 1]].type == "Healing" && randNum(1,3) == 1) {
            update();
            window.setTimeout(useCard(null,true,getFirstWithValue(p2.inventory,"type","Healing")),300)
            
        }
        p2.mana -= 3;
        if (randNum(0,1) == 1) {
            window.setTimeout(oppAttack,350);
        }   
        logPoint("oppDraw",true);
        return true;
    } else {
        let feeling1 = randNum(1,3);
        if (feeling1 >1 && p2.mana > 7)  {
            aimode = 3;
        } else {
            aimode = 2;
        }
        logPoint("oppDraw",false);
        return false;
    }
    
}
function oppChoice(start) {
    console.log(oppturndone,opptries);
    if (blockoppturn == true) {
        return false;
    }
    if (opptries > 30) {
        oppturndone = true;
    }
    if (oppturndone == true && turn != 1) {
        window.setTimeout(playerTurn,400);
    }
    if (start == true) {
        opptries = 0;
    }
    // var aimodes = 1,2,3 | 1: default, spend random amounts, select random cards | 2: save up, when many cards are on board, save up for more | 3: siege, attack with all force | 4: stock up, draw more cards | sB = super-buff
    // FLOWMAP: start->4->2->3->repeat
    let prevmode = aimode;
    if (Object.keys(p1.inventory).length-Object.keys(p2.inventory).length < -6 && p2.mana > 8) {
        aimode = 3;
    } else {
        if (Object.keys(p2.inventory).length<7 && p1.mana> 8) {
            aimode = 4;
        } else if (Object.keys(p2.inventory).length > 6 && (p2.mana > 8 && aimode != 3)) {
            aimode = 3;
        } else if (p2.mana < 9 && Object.keys(p2.inventory).length > 6) {
            aimode = 2;
        } else {
            aimode = 1;
        }
    }
    
    if (prevmode != aimode) {
        modetick = 0;
    } else {
        
    }
    let choice = 0; // choice means how much mana is the limit. for example, if choice is 3, use cards until mana is 3.
    if (aimode == 1 || aimode == 4) {
        if (p2.mana > 8) {
            choice = 0;
        } else {
            choice = randNum(0,3);
        }
        
    }
    if (aimode == 2) {
        choice = 8;
    }
    if (aimode == 3) {
        choice = randNum(0,3);
    }
    if (choice < 2) {
        choice = 2;
    }
    modetick++;
    console.log(choice);
    if (p2.mana > choice) {
        opptries++;
        let result;
        let time;
        if (tryAccess(p2,"aitype") == "super-buff" && randNum(1,3) == 1) {
            aimode == "super-buff";
        }
        if (aimode == 1) {
            // 1, which is default, draws when there is a small inventory. if not, it will either attack or draw.
            if (Object.keys(p2.inventory).length < 2) {
                result = oppDraw();
                choice -= 1;
            } else {
                let feeling1 = randNum(1,3);
                if (feeling1 >= 2 && Object.keys(p2.inventory).length > 0) {
                    result = oppAttack();
                } else {
                    result = oppDraw();
                }
            }
        }
        if (aimode == 2) {
            let feeling1 = randNum(1,5);
            if (feeling1 <= 2) {
                let feeling2 = randNum(1,3);
                if (Object.keys(p2.inventory).length < 2 || feeling2 == 1) {
                    result = oppDraw();
                    choice -= 1;
                } else {
                    result = oppAttack();
                }
            }
        }
        if (aimode == 3) {
            // SIEGE
            let feeling1 = randNum(1,4);
            if (feeling1 > 1) {
                result = oppAttack();
            } else {
                result = oppDraw();
            }
        }
        if (aimode == 4) {
            // STOCK UP
            let feeling1 = randNum(1,4);
            if (feeling1 > 1) {
                result = oppDraw();
                if (randNum(1,2) == 1) {
                    oppAttack();
                }
            } else {
                result = oppAttack();
            }
        }
        if (aimode == "super-buff") {
            // SUPER BUFF
            let firstHealing = getFirstWithValue(p2.inventory,"type","Healing");
            let firstSupport = getFirstWithValue(p2.inventory,"type","Support");
            let firstAttack = getFirstWithValue(p2.inventory,"type","Attack");
            if (firstHealing) {
                useCard(null,true,firstHealing);
            }
            if (firstSupport) {
                useCard(null,true,firstSupport);
            }
            if (firstAttack) {
                useCard(null,true,firstAttack);
            }
            
        }
        console.log(result);
        if (result == false) {
            time = 0;
        } else {
            time = 350;
        }
        window.setTimeout(oppChoice,350,false);
    } else {
        console.log("yeah");
        oppturndone = true;
        window.setTimeout(oppChoice,350,false);
    }
    
    
}
function oppTurn() {
    // states: spend, save, neutral
    turnover("p1");
    if (currentmode == "Custom" && customtype == "interest") {
        p1.mana -= 3;
        p1.mana *= 1.2;
        p1.health *= 1.2;
        p1.mana = Math.ceil(p1.mana);
        p1.health = Math.ceil(p1.health);
    }

    turn = 2;
    update(true);
    oppChoice(true);
    
}
    
    

/*function oppUse(index) {
    let card = p2.inventory[Object.keys(p2.inventory)[index]];
    if (card.coolleft == 0 && p2.mana >= card.manause) {
        p2.mana -= card.manause;
        let attacked = firstOpp("p1");
        if (attacked == "Opp") {
            p1.health -= card.atk;
        } else {
            let zeattacked = p2.inventory[attacked];
            console.log(zeattacked);
            p1.inventory[attacked].hp -= card.atk;
            if (p1.inventory[attacked].hp <= 0) {
                delete p1.inventory[attacked];
            }
        }
        card.ammo -= 1;
        if (card.ammo <= 0) {
            card.coolleft = card.cool;
            card.ammo = card.maxammo;
        }
    }
    
    update();
}*/
/**
 * 
 * @param {HTMLBodyElement} element element for card
 * @param {Boolean} opp whether or not user is opponent.
 * @param {Number} index index of card/element
 * @param {Card} select selected card to use
 * @param {"p1" | "p2"} selectp selected player for used card
 * @returns 
 */
function useCard(element = null,opp = null,index = null,select = null,selectp) {
    let id;
    let fid;
    let findex;
    let fmain;
    let fattacked;
    let selected;
    let opponent;
    let user;
    let stropp;
    let strmain;
    if (element != null) {
        id = element.getAttribute("id");
        index = Number(id.replace("c",""))-1;
    } else {
        if (index != null) {
            element = document.getElementById("o"+(index+1));
            id = element.getAttribute("id");
        }
        
    }
    if (opp == true) {
        opponent = p1;
        user = p2;
        stropp = "p1";
        strmain = "p2";
        if (select != null) {
            selected = Game[selectp].inventory[select];
            fmain = selectp;
        }
    } else {
        opponent = p2;
        user = p1;
        stropp = "p2";
        strmain = "p1";
        if (focused != null) {
            fid = focused.getAttribute("id");
            if (fid.includes('c')) {
                findex = Number(fid.replace("c",""))-1;
                selected = user.inventory[Object.keys(user.inventory)[findex]];
                if (selected != undefined && selected != null) {
                    fmain = "p1";
                    fattacked = Object.keys(user.inventory)[findex];
                }
                
            } else {
                findex = Number(fid.replace("o",""))-1;
                selected = opponent.inventory[Object.keys(opponent.inventory)[findex]];
                if (selected != undefined && selected != null) {
                    fmain = "p2";
                    fattacked = Object.keys(opponent.inventory)[findex];
                }
                
            }
            
            
        }
        
    }
    if (Object.keys(user.inventory).length < index+1) {
        return false;
    } else {
        let card = user.inventory[Object.keys(user.inventory)[index]];
        console.log(card,index);
        if (card.effects.some(str => str.includes("Stunned")) || card.effects.some(str => str.includes("Frozen"))) {
            return false;
        }
        if (user.mana >= card.manause) {
            /// WHEN APPLYING EFFECTS: TO ALLY, DO TURN+1 | TO ENEMY, DO TURN
            if (Object.hasOwn(card,"coolleft") && card.coolleft > 0) {
                if (Object.hasOwn(card,"evadecool")) {

                } else {
                    return false;
                }
            }
            if (element != null) {
                // add border effect to card
                element.style.border = "3px solid maroon";
                window.setTimeout(unborder,500,id);
            }
            if (user == p1 && Object.hasOwn(p1.relics,"frostyhorn") && card.name != "froster") {
                // if you have frosty horn, immediately make froster's cooldown 0
                let chosen;
                for (let i = 0; i < Object.keys(p1.inventory).length; i++) {
                    let card = p1.inventory[Object.keys(p1.inventory)[i]];
                    if (card.name == "froster" && card.coolleft > 0) {
                        chosen = card;
                        break;
                    }
                }
                if (chosen != null) {
                    chosen.coolleft = 0;
                }
                
            }
            if (card.type == "Attack") {
                let attacked = firstOpp(stropp);
                let extraatk = 0;
                if (user.mods.some(str => str.includes("RedStarMedallion"))) {
                    // deal extra damage with redstarmedallion, equivalent to scale*healthdiff/10
                    let cm = cleanseModifier("Norm",user.mods.filter(str => str.includes("RedStarMedallion"))[0]);
                    let zextra;
                    if (user == p1) {
                        zextra = cm*((p1.maxhealth-p1.health)/10);
                    } else {
                        zextra = cm*((enemies[p2.name].health-p2.health)/10);
                    }
                    extraatk += Math.round(zextra);
                }
                let extracount = 0;
                for (let i = 0; i < card.effects.length; i++) {
                    if (card.effects.filter(str => str.includes("ExtraAtk")).length > extracount) {
                        let cm = cleanseModifier("Norm",card.effects.filter(str => str.includes("ExtraAtk"))[extracount]);
                        extraatk += Math.round(card.atk*(cm[0]/100));
                        extracount++;
                    }
                }
                if (arrHas(card.effects,"Bubbly")) {
                    // do extra atk and gain extra hp if bubbly
                    let cm = cleanseModifier("Norm",arrFirst(card.effects,"Bubbly"));
                    extraatk += Math.round(card.atk*(cm[0]/100));
                    card.hp += Math.round(card.hp*(cm[0]/300));
                }
                
                if (user == p1 && Object.hasOwn(p1.relics,"morningglory") && turns == 0) {
                    extraatk += Math.round(card.atk*p1.relics.morningglory.attr);
                }
                if (user == p1 && Object.hasOwn(p1.relics,"quincyspillar") && card.atk+extraatk < 45) {
                    p1.coins += p1.relics.quincyspillar.attr;
                }
                if (user == p1 && Object.hasOwn(p1.relics,"quincychainsaw") && turns > 19) {
                    extraatk += Math.round(card.atk*(p1.relics.quincychainsaw.attr/100));
                }
                // CARD POWERS THAT ARE NOT OPPONENT CARD-BASED
                if (card.name == "charger") {
                    extraatk = card.atk;
                    for (let i = 0; i < Object.keys(user.inventory).length; i++) {
                        let cardInInventory = user.inventory[Object.keys(user.inventory)[i]];
                        if (cardInInventory.name == "energycapsule") {
                            // since stats are like: 0.5, add 1 to do multiplier
                            extraatk *= (cardInInventory.stat+1);
                        }
                    }
                    // subtract the original, as there is only meant to be additional damage.
                    extraatk -= card.atk;
                    console.log(extraatk);
                }
                if (card.name == "turret") {
                    card.atk += card.stat;
                }
                if (card.name == "celestialstriker") {
                    drawCard(stropp,true,"comet");
                }
                // HANDLE OPP/CARD DAMAGE
                if (attacked == "Opp") {
                    opponent.health -= card.atk+extraatk;
                    if (card.name == "cultist") {
                        let add = -card.stat; // balance out for own cultist
                        let chosen;
                        for (let i = 0; i < Object.keys(user.inventory).length; i++) { // add 8 extra damage per cultist, undodgeable
                            let tempchosen = user.inventory[Object.keys(user.inventory)[i]];
                            if (tempchosen.name == "cultist") {
                                add += card.stat;
                            }
                        }
                        opponent.health -= add;
                    }
                } else {
                    // PRE DAMAGE EFFECTS
                    // get the attacked card
                    let zeattacked = opponent.inventory[attacked];
                    if (fmain == "p2") {
                        zeattacked = selected;
                        attacked = Object.keys(opponent.inventory)[findex];
                    }
                    // heal attacked if current card is confused
                    if (card.effects.some(str => str.includes("Confused")) == true) {
                        zeattacked.hp += card.atk*2;
                    } else {
                        playAudio("sounds/sword.mp3");
                        if (card.sound != undefined) {
                            playAudio("sounds/"+card.sound);
                        }
                    }
                    if (user.mods.some(str => str.includes("FlameTouch"))) {
                        let cm = cleanseModifier("Norm",user.mods.filter(str => str.includes("FlameTouch"))[0]);
                        console.log(cm);
                        if (zeattacked.effects.some(str => str.includes("Burning")) == false) {
                            zeattacked.effects.push(`Burning{${cm[0]},${cm[1]}}`);
                        }
                    }
                    if (arrHas(user.mods,"SoulLantern") == true && ["soulkeeper","weakener","wizard","reaper"].includes(card.name)) {
                        let cm = cleanseModifier("Norm",arrFirst(user.mods,"SoulLantern"));
                        zeattacked.hp -= Math.round(card.atk*(cm/100));
                    }
                    if (card.name == "spearman" && card.level >= 1 && randNum(1,3) == 1) { // deal 2x damage every 3 shots
                        zeattacked.hp -= card.atk;
                    }
                    if (user == p1 && Object.hasOwn(p1.relics,"mammothtusk") && card.name == "spearman") {
                        let count = 0;
                        for (let i = 0; i < Object.keys(p1.inventory).length; i++) {
                            let card = Object.keys(p1.inventory)[i];
                            if (card.includes("spearman")) {
                                count += 1;
                            }
                        }
                        if (count < 3) {
                            zeattacked.hp += Math.round(card.atk*0.3);
                        } else {
                            zeattacked.hp -= Math.round(card.atk*0.5);
                        }
                    }
                    
                    if (card.name == "cannoneer") {
                        if (arrHas(zeattacked.effects,"Stunned") == false) {
                            zeattacked.effects.push("Stunned{1,2}");
                        }
                        let attackAmount = 1;
                        let attackMult = 0.4;
                        let superCannon = false;
                        if (card.level >= 1 && randNum(1,2) == 1) { // 1/2 chance of super cannon
                            superCannon = true;
                            attackAmount = 3;
                            attackMult = 0.7;
                        } 
                        for (let i = 0; i < attackAmount; i++) {
                            let chosencard;
                            if (Object.keys(opponent.inventory).length < 4) {
                                chosencard = randKey(opponent.inventory);
                            } else {
                                chosencard = opponent.inventory[Object.keys(opponent.inventory)[i]];
                            }
                            chosencard.hp -= Math.round(card.atk*attackMult); // deal attackmult% of damage
                            if (arrHas(chosencard.effects,"Stunned") == false && superCannon) { // apply stun if super cannon
                                chosencard.effects.push("Stunned{1,2}");
                            }
                        }
                    }
                    if (card.name == "bandit") {
                        let managain = Math.ceil(opponent.mana*(randNum(20,60)/100));
                        if (managain < 1) {
                            managain = 1;
                        }
                        user.mana += managain;
                        opponent.mana -= managain;
                        if (opponent.mana < 2) {
                            opponent.mana = 2;
                        }
                    }
                    
                    if (zeattacked.name == "vine") {
                        // lose health according to the vine's stat (rebound damage)
                        card.hp -= zeattacked.stat;
                    }
                    if (card.cardmods.includes("infernalfoil") && arrHas(zeattacked.effects,"Burning") == false) {
                        if (randNum(1,5) == 5) {
                            extraatk += 25;
                            zeattacked.effects.push("Burning{3,1}");
                        }
                    }
                    
                    /* MAIN DAMAGE (deals damage to opponent themselves) */

                    predamagehp = zeattacked.hp;
                    preeffects = zeattacked.effects;
                    zeattacked.hp -= card.atk+extraatk;
                    if (arrHas(zeattacked.effects,"Bubbly")) {
                        // heal for x% of the damage taken based off of bubbly effect scale 
                        zeattacked.hp += formateffect("Attributes",arrFirst(zeattacked.effects,"Bubbly"))[0]*(card.atk+extraatk)/100;
                    }
                    console.log(zeattacked);
                    
                    if (card.name == "solarprism") {
                        let beamDamage = card.atk;
                        if (card.level >= 1 && randNum(1,3) == 1) { // deal 25 more damage if it is a super beam
                            beamDamage += 25;
                            zeattacked.hp -= 25;
                        }
                        opponent.health -= beamDamage;
                    }
                    /* UNMAIN DAMAGE */
                    if (card.name == "turret" && card.level >= 1 && randNum(1,4) == 1) { // 25% chance to triple shot
                        opponent.health -= 2*card.atk;
                    }
                    if (card.name == "charger") {
                        let chargeAmount = 4;
                        let superCharge = false;
                        let manaSteal = 0;
                        if (card.level == 1 && randNum(1,5) == 1) { // enable supercharge, dealing extra damage
                            superCharge = true;
                            chargeAmount = 10;
                        }
                        // reset attack
                        card.atk = 40;
                        for (let i = 0; i < chargeAmount; i++) {
                            // shocks and (50%) stuns 4 opponent cards
                            let card = opponent.inventory[Object.keys(opponent.inventory)[i]];
                            if (card != undefined) {
                                let substr = "Shock";
                                if (card.effects.some(str => str.includes(substr)) == false) {
                                    card.effects.push("Shock{1,1}");
                                }
                                if (randNum(1,2)) {
                                    substr = "Stunned";
                                    if (arrHas(card.effects,substr) == false) {
                                        card.effects.push("Stunned{1,1}");
                                    }
                                }
                                if (superCharge) { // add manasteal
                                    manaSteal += 1;
                                    card.hp -= 8;
                                }
                            } else {
                                // if no card to shock, deal 20 damage
                                opponent.health -= 20;
                            }
                        }
                        if (superCharge) { // drain mana from opponent
                            p1.mana += stepRound(manaSteal/4,0.5);
                            p2.mana -= stepRound(manaSteal/4,0.5);
                        }
                    }
                    if (card.name == "weakener") {
                        // steals attack, if not takes 30 hp
                        let chosen;
                        for (let i = 0; i < Object.keys(opponent.inventory).length; i++) {
                            let tempchosen = opponent.inventory[Object.keys(opponent.inventory)[i]];
                            if (tempchosen.type == "Attack") {
                                chosen = tempchosen;
                                break;
                            }
                        }
                        if (chosen == null || chosen.type != "Attack") {
                            opponent.health -= 30;
                        } else {
                            chosen.atk -= Math.round(card.stat*2);
                            card.atk += card.stat;
                            if (chosen.atk < 5) {
                                chosen.atk = 5;
                            }
                        }
                        
                    }
                    if (card.name == "teslacoil") {
                        for (let i = 0; i < Object.keys(opponent.inventory).length; i++) {
                            // shocks every card, dealing 1/7 of coil's attack with extra shock.
                            let tempchosen = opponent.inventory[Object.keys(opponent.inventory)[i]];
                            tempchosen.hp -= Math.ceil(card.atk/7);
                            tempchosen = addEffect(tempchosen,"Shock",1,1,true);
                            /*if (tempchosen.effects.some(str => str.includes("Shock")) == true) {
                                let zeval = tempchosen.effects.filter(str => str.includes("Shock"))[0];
                                let index = tempchosen.effects.indexOf(zeval);
                                let args = formateffect("Attributes",zeval);
                                args[0] = Number(args[0]);
                                args[0] += 1;
                                args[1] += 1;
                                tempchosen.effects[index] = "Shock{"+args[0]+","+args[1]+"}";
                            }
                            if (tempchosen.effects.some(str => str.includes("Shock")) == false) {
                                tempchosen.effects.push("Shock{1,1}");
                            }*/
                        }
                        
                    }
                    if (card.name == "oblivion" && index != null && index == 0) {
                        // if oblivion is at the front it will do what it does
                        zeattacked += card.atk;
                        user.mana += card.manause;
                        card.ammo += 1;
                    }
                    if (card.name == "oblivion" && index != 0 && zeattacked.hp - card.atk <= 0) {
                        // if oblivion is not at the front it will use less mana and cooldown
                        card.cool -= 1;
                        card.manause -= 0.5
                        if (card.cool < 1) {
                            card.cool = 1;
                        }
                        if (card.manause < 0.5) {
                            card.manause = 0.5;
                        }
                    }
                    if (card.name == "flamethrower") {
                        let substr = "Burning";
                        // deals extra damage if player has flametouch
                        if (arrHas(user.mods,"FlameTouch")) {
                            zeattacked.hp -= 7;
                        }
                        // add burning effect to enemy
                        zeattacked = addEffect(zeattacked,"Burning",1,1,true);
                        /*
                        if (zeattacked.effects.some(str => str.includes(substr)) == true) {
                            let zeval = zeattacked.effects.filter(str => str.includes(substr))[0];
                            let index = zeattacked.effects.indexOf(zeval);
                            let args = formateffect("Attributes",zeval);
                            args[0] = Number(args[0]);
                            args[0] += 1;
                            zeattacked.effects[index] = "Burning{"+args[0]+","+args[1]+"}";
                        }
                        if (zeattacked.effects.some(str => str.includes(substr)) == false) {
                            zeattacked.effects.push("Burning{1,1}");
                        }*/
                        
                    }
                    if (card.name == "ninja") {
                        // add camouflaged effect for 2 turns
                        card = addEffect(card,"Camouflaged",1,2,false);
                        /*if (card.effects.some(str => str.includes("Camouflaged")) == false) {
                            card.effects.push("Camouflaged{1,2}");
                        }*/
                    }
                    if (card.name == "juggernaut") {
                        let stunAmount = 1;
                        let bashDamage = 10;
                        if (card.level >= 1 && randNum(1,5) == 1) { // 20% chance of super bash at level 1
                            stunAmount = 4;
                            bashDamage = 30;
                        }
                        for (let i = 0; i < 4; i++) {
                            let card = opponent.inventory[Object.keys(opponent.inventory)[i]];
                            if (card != undefined) {
                                if (i < stunAmount) {
                                    let substr = "Stunned";
                                    if (card.effects.some(str => str.includes(substr)) == false) {
                                        card.effects.push("Stunned{1,1}");
                                        
                                    }
                                }
                                card.hp -= bashDamage; // deal bash damage
                                
                            } else {
                                opponent.health -= 20;
                            }
                        }
                        for (let i = 0; i < Object.keys(opponent.inventory).length; i++) { // delete opponent card if dead
                            let card = opponent.inventory[Object.keys(opponent.inventory)[i]];
                            if (card.hp <= 0 && card != zeattacked) {
                                delete opponent.inventory[Object.keys(opponent.inventory)[i]];
                            }
                        }
                    }
                    if (card.name == "sniper") {
                        for (let i = 0; i < 4; i++) {
                            let card = opponent.inventory[Object.keys(opponent.inventory)[i]];
                            if (card != undefined) {
                                let substr = "Stunned";
                                if (card.effects.some(str => str.includes(substr)) == false) {
                                    card.effects.push("Stunned{1,1}");
                                    
                                }
                                card.hp -= 20;
                                
                            } else {
                                opponent.health -= 20;
                            }
                        }
                        for (let i = 0; i < Object.keys(opponent.inventory).length; i++) {
                            let card = opponent.inventory[Object.keys(opponent.inventory)[i]];
                            if (card.hp <= 0 && card != zeattacked) {
                                delete opponent.inventory[Object.keys(opponent.inventory)[i]];
                            }
                        }
                    }
                    if (card.name == "reaper") {
                        let substr = "Death";
                        let mosthp = 0;
                        let chosen;
                        let keyname;
                        let tries = 0;
                        // rare error found here, reason stil unknown
                        do {
                            mosthp = 0;
                            chosen = null;
                            for (let i = 0; i < Object.keys(opponent.inventory).length; i++) {
                                let tempchosen = opponent.inventory[Object.keys(opponent.inventory)[i]];
                                if (tempchosen.hp > mosthp && tempchosen.effects.some(str => str.includes(substr)) == false) {
                                    keyname = Object.keys(opponent.inventory)[i];
                                    chosen = tempchosen;
                                    mosthp = chosen.hp;
                                }
                            }
                            tries++;
                        } while (tries < 50)
                        if (chosen == null) {
                           
                        } else {
                            if (chosen.effects.some(str => str.includes(substr)) == false) { // push death effect, which kills enemy after 3 turns
                                chosen.effects.push("Death{1,1}");
                            }
                            if (card.level >= 1 && randNum(1,10) == 1) { // 1/10 chance of insta killing enemy
                                delete opponent.inventory[keyname];
                            }
                        }
                    }
                    if (card.name == "froster") {
                        let substr = "Frozen";
                        let mostatk = 0;
                        let chosen;
                        let tries = 0;
                        do {
                            mostatk = 0;
                            chosen = null;
                            for (let i = 0; i < Object.keys(opponent.inventory).length; i++) {
                                let tempchosen = opponent.inventory[Object.keys(opponent.inventory)[i]];
                                if (Object.hasOwn(tempchosen,"atk")) {
                                    if (tempchosen.atk > mostatk && tempchosen.coolleft < 2 && tempchosen.effects.some(str => str.includes(substr)) == false) {
                                        chosen = tempchosen;
                                        mostatk = chosen.atk;
                                    }
                                }
                                
                            }
                            tries++;
                            
                        } while (tries < 50)
                        if (chosen == null) {
                           
                        } else {
                            if (chosen.effects.some(str => str.includes(substr)) == false) {
                                chosen.effects.push("Frozen{1,2}");
                            }
                        }
                    }
                    if (card.name == "jester") {
                        let substr = "Confused";
                        let chosen;
                        for (let i = 0; i < Object.keys(opponent.inventory).length; i++) {
                            let tempchosen = opponent.inventory[Object.keys(opponent.inventory)[i]];
                            if (tempchosen.type == "Attack" && tempchosen.effects.some(str => str.includes(substr)) == false) {
                                chosen = tempchosen;
                                break;
                            }
                        }
                        if (chosen == null || chosen.type != "Attack") {
                           
                        } else {
                            if (chosen.effects.some(str => str.includes(substr)) == false) {
                                chosen.effects.push("Confused{1,2}");
                            }
                        }
                        
                    }
                    if (card.name == "cultist") {
                        let add = 0;
                        let chosen;
                        for (let i = 0; i < Object.keys(user.inventory).length; i++) {
                            let tempchosen = user.inventory[Object.keys(user.inventory)[i]];
                            if (tempchosen.name == "cultist") {
                                add += 30;
                            }
                        }
                        zeattacked.hp -= add;
                        if (arrHas(user.mods,"RedStarMedallion")) {
                            user.mana += 0.5;
                            if (extraatk > 0) {
                                card.atk += Math.round(extraatk);
                                extraatk = Math.round(extraatk)*2;
                                user.health += extraatk/4;
                                user.health = Math.round(user.health);
                            }
                        }
                    }
                    if (card.name == "robot" && turns < 5) {
                        let add = 0;
                        for (let i = 0; i < Object.keys(user.inventory).length; i++) {
                            let tempchosen = user.inventory[Object.keys(user.inventory)[i]];
                            if (tempchosen.name == "robot") {
                                add += 1;
                            }
                        }
                        user.maxhealth += add;
                        user.health += add/1;
                        user.health = Math.round(user.health);
                    }
                    // IF CURRENT ATTACKED CARD IS PHASED, TAKE NO DAMAGE
                    if (arrHas(zeattacked.effects,"Phased")) {
                        console.log(zeattacked.hp,predamagehp,);
                        zeattacked.hp = predamagehp;
                        zeattacked.effects = preeffects;
                    }
                    if (zeattacked.hp <= 0) {
                        if (card.name == "soulkeeper") {
                            user.mana += 0.5;
                            user.mana = Number(user.mana.toFixed(1));
                            if (card.hp < 75+card.stat*5) {
                                card.hp += Math.round(card.stat*2.3); // 7
                            }
                            if (user.health < user.maxhealth-25) {
                                user.health += card.stat; // 3
                            }
                            if (card.atk < 55+card.stat*5) {
                                card.atk += Math.round(card.stat*1.3); // 4
                            }
                            
                        }
                        if (zeattacked.cardmods.includes("diamondfoil") && randNum(1,4) == 4){
                            // diamond foil cards have 1/4 chance of getting deleted after dying
                            delete opponent.deck[attacked];
                        }
                        if (zeattacked.effects.some(str => str.includes("Guarded")) == false) {
                            delete opponent.inventory[attacked];
                            if (currentmode == "Custom" && customtype == "flagship" && strmain == "p2") {
                                opponent.health = -100;
                            }
                        } else {
                            let zeval = zeattacked.effects.filter(str => str.includes("Guarded"))[0];
                            let index = zeattacked.effects.indexOf(zeval);
                            zeattacked.effects.splice(index,1);
                            zeattacked.hp = 30;
                        }
                        
                    } else {
                        if (user == p1 && Object.hasOwn(p1.relics,"morningglory") && turns == 0) {
                            p1.coins -= 15;
                            if (p1.coins < 0) {
                                p1.coins = 0;
                            }
                        }
                    }
                    
                }
                if (extraatk > 0 && 1 + 1 == 3) {
                    card.atk -= extraatk;
                }
                console.log(card);
                card.ammo -= 1;
                console.log(card);
                if (card.ammo <= 0) {
                    card.coolleft = card.cool;
                    card.ammo = card.maxammo;
                    if (card.name == "turret") {
                        card.atk -= card.stat*2;
                    }
                }
            }
            if (card.type == "Healing") {
                
                playAudio("sounds/heal.mp3");
                let chosen;
                for (let i = 0; i < Object.keys(user.inventory).length; i++) {
                    let tempchosen = user.inventory[Object.keys(user.inventory)[i]];
                    if (tempchosen.type == "Attack") {
                        chosen = tempchosen;
                        break;
                    }
                }
                if (chosen == null || chosen.type != "Attack") {
                    chosen = "Opp";
                }
                let zechosen;
                if (chosen != "Opp") {
                    zechosen = chosen;
                    if (selected != null) {
                        zechosen = selected;
                    }
                } else {
                    zechosen = "Opp";
                }
                if (zechosen == "Opp") {
                    user.health += card.heal;
                    if (card.name == "bubblemancer") {
                        user.health += card.heal*2;
                    }
                    if (user == p1) {
                        if (user.health > user.maxhealth) {
                            user.health = user.maxhealth;
                        }
                    }
                } else {
                    if (card.name != "bubblemancer") {
                        zechosen.hp += card.heal;
                        if (user == p1 && Object.hasOwn(p1.relics,"orbmix") && card.name == "healorb") {
                            zechosen.hp += p1.relics.orbmix.attr;
                        }
                    }
                    
                }
                
                if (card.name == "bubblemancer") {
                    for (let i = 0; i < 3; i++) {
                        let chosencard = randKey(user.inventory);
                        chosencard.hp += card.heal;
                        let badeffects = ["Burning","Death","Fear","Frozen","Stunned","Shock"];
                        for (let j = 0; j < chosencard.effects.length; j++) {
                            let zefect = chosencard.effects[j];
                            if (badeffects.includes(formateffect("FlatEffect",zefect))) {
                                chosencard.effects.splice(chosencard.effects.indexOf(zefect),1);
                            }
                        }
                        if (arrHas(chosencard.effects,"Bubbly")) {
                            increaseModifier("Norm",arrFirst(chosencard.effects,"Bubbly"),[5,1]);
                        } else {
                            chosencard.effects.push("Bubbly{15,2}");
                        }
                    }
                }

                if (card.uses == -1) {
                    card.ammo -= 1;
                    if (card.ammo <= 0) {
                        card.coolleft = card.cool;
                        card.ammo = card.maxammo;
                    }
                } else {
                    card.uses -= 1;
                    if (card.uses <= 0) {
                        delete user.inventory[Object.keys(user.inventory)[index]];
                        
                    }
                }
            }
            if (card.type == "Support") {
                playAudio("sounds/item.mp3");
                if (card.name == "supplycrate" || (user == p1 && Object.hasOwn(p1.relics,"thundercrate") && card.name == "energycapsule")) {
                    let chosen;
                    for (let i = 0; i < Object.keys(user.inventory).length; i++) {
                        let tempchosen = user.inventory[Object.keys(user.inventory)[i]];
                        if (tempchosen.type == "Attack") {
                            chosen = tempchosen;
                            break;
                        }
                    }
                    if (chosen == null || chosen.type != "Attack") {
                        return false;
                    }
                    if (selected != null && selected.type == "Attack") {
                        chosen = selected;
                    }
                    let gain = Math.round((100-chosen.atk)/15);
                    if (gain < 3) {
                        gain = 3;
                    }
                    chosen.ammo += gain;
                    delete user.inventory[Object.keys(user.inventory)[index]];
                }
                if (card.name == "atkpotion") {
                    let chosen;
                    for (let i = 0; i < Object.keys(user.inventory).length; i++) {
                        let tempchosen = user.inventory[Object.keys(user.inventory)[i]];
                        if (tempchosen.type == "Attack") {
                            chosen = tempchosen;
                            break;
                        }
                    }
                    if (chosen == null || chosen.type != "Attack") {
                        return false;
                    }
                    if (selected != null && selected.type == "Attack") {
                        chosen = selected;
                    }
                    chosen.atk *= 1+(card.stat/100);
                    chosen.atk = Math.round(chosen.atk);
                    if (arrHas(chosen.effects,"Guarded") == false) {
                        chosen.effects.push("Guarded{1,3}");
                    }
                    chosen.ammo += 1;
                    delete user.inventory[Object.keys(user.inventory)[index]];
                }
                if (card.name == "factory") {
                    drawCard(strmain,true,"robot",["ignoreReload"]);
                    card.ammo -= 1;
                    if (card.ammo <= 0) {
                        card.coolleft = card.cool;
                        card.ammo = card.maxammo;
                    }
                }
                if (card.name == "managenerator") {
                    user.mana += card.stat;
                    card.ammo -= 1;
                    if (card.ammo <= 0) {
                        card.coolleft = card.cool;
                        card.ammo = card.maxammo;
                    }
                }
                if (card.name == "energycapsule" || (user == p1 && Object.hasOwn(p1.relics,"thundercrate") && card.name == "supplycrate")) {
                    let chosen;
                    for (let i = 0; i < Object.keys(user.inventory).length; i++) {
                        let tempchosen = user.inventory[Object.keys(user.inventory)[i]];
                        if (tempchosen.type == "Attack") {
                            chosen = tempchosen;
                            break;
                        }
                    }
                    if (chosen == null || chosen.type != "Attack") {
                        return false;
                    }
                    if (selected != null && selected.type == "Attack") {
                        chosen = selected;
                    }
                    chosen.coolleft = 0;
                    chosen.ammo += 1;
                    if (chosen.cool > 1) {
                        chosen.cool -= 1;
                    }
                    card.ammo -= 1;
                    if (card.ammo <= 0) {
                        card.coolleft = card.cool;
                        card.ammo = card.maxammo;
                    }
                }
                if (card.name == "dysonsphere") {
                    drawCard(strmain,true,"solarprism");
                    card.ammo -= 1;
                    let chosen = firstOpp(stropp);
                    let substr = "Fear";
                    if (chosen != "Opp") {
                        chosen = opponent.inventory[chosen];
                        if (chosen.effects.some(str => str.includes(substr)) == false) {
                            chosen.effects.push("Fear{1,1}");
                            chosen.coolleft += 1;
                        }
                    }
                    if (card.ammo <= 0) {
                        card.coolleft = card.cool;
                        card.ammo = card.maxammo;
                    }
                }
                if (card.name == "clonebox") {
                    if (index != null && index == 0) {
                        drawCard(strmain,true,"oblivion",["ignoreReload"])
                    } else {
                        drawCard(strmain,true,user.inventory[Object.keys(user.inventory)[0]].name,["ignoreReload"]);
                    }
                    
                    card.ammo -= 1;
                    if (card.ammo <= 0) {
                        card.coolleft = card.cool;
                        card.ammo = card.maxammo;
                    }
                }
                if (card.name == "bus") {
                    let card1 = user.inventory[Object.keys(user.inventory)[0]];
                    let card2 = user.inventory[Object.keys(user.inventory)[Object.keys(user.inventory).length-1]];
                    let temp1 = {};
                    let temp2 = {};
                    temp1 = Object.assign(temp1,card1);
                    temp1.hp += 10;
                    temp2 = Object.assign(temp2,card2);
                    temp2.hp += 10;
                    let newobj = {};
                    Object.defineProperty(newobj,Object.keys(user.inventory)[Object.keys(user.inventory).length-1],Object.getOwnPropertyDescriptor(user.inventory,Object.keys(user.inventory)[Object.keys(user.inventory).length-1]));
                    Object.keys(user.inventory).forEach(function(key,index) {
                        if (index != Object.keys(user.inventory).length-1 && index != 0) {
                            Object.defineProperty(newobj,key,Object.getOwnPropertyDescriptor(user.inventory,key));
                        }
                    });
                    Object.defineProperty(newobj,Object.keys(user.inventory)[0],Object.getOwnPropertyDescriptor(user.inventory,Object.keys(user.inventory)[0]));
                    user.inventory = newobj;
                    
                    card.ammo -= 1;
                    if (card.ammo <= 0) {
                        card.coolleft = card.cool;
                        card.ammo = card.maxammo;
                    }
                }
                
                if (card.name == "bank") {
                    if (card.storedmana > 0) {
                        user.mana += card.storedmana;
                        delete user.inventory[Object.keys(user.inventory)[index]];
                    }
                    
                }
                
                if (user == p1 && ["dysonsphere","factory"].includes(card.name) && Object.hasOwn(p1.relics,"hammerhammer")) {
                    if (card.name == "dysonsphere") {
                        drawCard(strmain,true,"solarprism",["ignoreReload"]);
                        card.ammo -= 1;
                        let chosen = firstOpp(stropp);
                        let substr = "Fear";
                        if (chosen != "Opp") {
                            chosen = opponent.inventory[chosen];
                            if (chosen.effects.some(str => str.includes(substr)) == false) {
                                chosen.effects.push("Fear{1,1}");
                                chosen.coolleft += 1;
                            }
                        }
                    }
                    if (card.name == "factory") {
                        drawCard(strmain,true,"robot",["ignoreReload"]);
                    }
                }
            }
            if (card.type == "Action") {
                if (card.name == "ritual") {
                    drawCard(strmain,true,"cultist",["ignoreReload"]);
                    drawCard(strmain,true,"cultist",["ignoreReload"]);
                    drawCard(strmain,true,"cultist",["ignoreReload"]);
                    delete user.inventory[Object.keys(user.inventory)[index]];
                    let loss = 20;
                    if (user.health - 20 < 1) {
                        loss = 20-user.health;
                    }
                    user.health -= loss;
                }
                if (card.name == "drawback") {
                    let tempmana = 0;
                    let temphp = 0;
                    for (let i = 0; i < Object.keys(user.inventory).length; i++) {
                        let tempcard = user.inventory[Object.keys(user.inventory)[i]];
                        if (tempcard.hp/9 > 5) {
                            tempmana += 5;
                        } else {
                            tempmana += tempcard.hp/9;
                        }
                        if (tempcard.hp/4.5 > 10) {
                            temphp += 10;
                        } else {
                            temphp += tempcard.hp/4.5;
                        }
                        
                    }
                    temphp = Math.round(temphp);
                    if (temphp > 75) {
                        temphp = 75;
                    }
                    tempmana = Math.round(tempmana);
                    if (tempmana > 30) {
                        tempmana = 30;
                    }
                    user.mana += tempmana;
                    user.health += temphp;
                    user.maxhealth += Math.round(temphp/3);
                    if (user.health > user.maxhealth) {
                        user.health = user.maxhealth;
                    }
                    user.inventory = {};
                    update();
                    return;
                }
                if (card.name == "armageddon") {
                    user.mana += 16;
                    opponent.mana += 6;
                    user.health -= 30;
                    opponent.health -= 30;
                    if (user.health <= 1) {
                        user.health = 1;
                    }
                    if (opponent.health <= 1) {
                        opponent.health = 1;
                    }
                    delete user.inventory[Object.keys(user.inventory)[index]];                    
                }
                if (card.name == "hotpotato") {
                    let newcard = structuredClone(card);
                    if (Object.keys(opponent.inventory).length == 10) {
                        delete opponent.inventory[Object.keys(opponent.inventory)[0]];
                    }
                    drawCard(stropp,true,newcard,["setcard","inventory"]);
                    delete user.inventory[Object.keys(user.inventory)[index]];                    
                }
            }
            user.mana -= card.manause;
        }
    }
    update();
}
function selectCard(element) {
    if (focused != null) {
        unborder(focused.getAttribute("id"));
    }
    if (focused != element) {
        focused = element;
        element.style.border = "3px solid blue";
    } else {
        focused = null;
    }
    
}
/**
 * Discards given card from player's inventory
 * @param {*} player The player that is discarding
 * @param {*} index The index of the card in the inventory that is discarded
 * @returns Card is removed.
 */
function discard(player, index = null) {
    let id;
    let opponent;
    let user;
    let stropp;
    let strmain;
    if (player == "p2") {
        opponent = p1;
        user = p2;
        stropp = "p1";
        strmain = "p2";
        element = document.getElementById("o"+(index+1));
        id = element.getAttribute("id");
    } else {
        opponent = p2;
        user = p1;
        stropp = "p2";
        strmain = "p1";
        id = focused.getAttribute("id");
        index = Number(id.replace("c",""))-1;
    }
    let card = user.inventory[Object.keys(user.inventory)[index]];
    if (user.inventory[Object.keys(user.inventory)[index]] != undefined) {
        if (Object.hasOwn(card,"discardable") && card.discardable == false) {
            console.log("Card is not discardable!");
            return false
        }
        
        delete user.inventory[Object.keys(user.inventory)[index]];
        user.mana += 1;
        user.discards -= 1;
        if (strmain == "p1") {
            if (tryAccess(user.relics,"gregsbox")) {
                user.mana += user.relics.gregsbox.attr[0];
                user.coins += user.relics.gregsbox.attr[1];
            }
            if (tryAccess(user.relics,"engineerswrench")) {
                for (card in user.inventory) {
                    card = user.inventory[card];
                    if (card.subtypes.includes("mechanical")) {
                        // add scrap
                        if (tryAccess(card,"scraps")) {
                            card.scraps += 1;
                        } else {
                            card.scraps = 1;
                        }
                        // boost stats
                        card.hp *= 1.05;
                        card.hp = Math.round(card.hp);
                        if (tryAccess(card,"atk")) {
                            card.atk *= 1.05;
                            card.atk = Math.round(card.atk);
                        }
                    }
                }
            }
        }
        update();
    } else {
        if (strmain == "p1" && Object.hasOwn(p1.relics,"goldenshovel") && p1.mana >= 3) {
            p1.mana -= 3;
            drawCard("p1",true,"gold");
        }
    }
    
}
function setStartMod(mod) {
    
    if (mod == "nephew") {
        drawCard("p1",true,"spearman","addToDeck");
        drawCard("p1",true,"spearman","addToDeck");
        drawCard("p1",true,"charger","addToDeck");
        drawCard("p1",true,"energycapsule","addToDeck");
    }
    if (mod == "uncleman") {
        drawCard("p1",true,"factory","addToDeck");
        p1.maxhealth = 200;
        p1.health = 200;
        p1.maxdiscards = 2;
        p1.coins = 100;
        p1.discards = 2;
        p1.managain = 4;
    }
    if (currentmode == "Hard") {
        p1.health *= 0.7;
        p1.maxhealth *= 0.7;
        //p1.managain *= 0.8;
    }
    if (currentmode == "Cataclysm") {
        p1.health *= 0.2;
        p1.maxhealth *= 0.2;
    }
    if (currentmode == "Easy") {
        p1.health *= 2;
        p1.maxhealth *= 2;
        p1.managain *= 2;
    }
    p1.health = Math.round(p1.health);
    p1.maxhealth = Math.round(p1.maxhealth);
    p1.managain = Math.round(p1.managain);
}
/*function transitionScreen(arg) {
    // SET TO DISPLAY; E.G. BOOL TRUE = DISPLAY; BOOL FALSE = DON'T DISPLAY;
    let elem = byId("transition");
    if (arg == true) {
        adventurescreen.style.display = "none";
        adventurescreen.style.opacity = 0;
        elem.style.display = "block";
        elem.style.opacity = 1;
        window.setTimeout(transitionScreen, 500, false);
    }
    if (arg == false) {
        elem.style.opacity = 0;
        adventurescreen.style.display = "block";
        
        window.setTimeout(transitionScreen, 500, "falser");
    }
    if (arg == "falser") {
        elem.style.display = "none";
        adventurescreen.style.opacity = 1;
    }
}*/
function enterAdventureScreen() {
    adventurescreen.style.opacity = 1;
    adventurescreen.style.display = "block";
    curloctxt.innerHTML = "Current Location: "+curlocation.formal;
    curlocdesctxt.innerHTML = curlocation.desc;
    loretxt.innerHTML = curlocation.loretext;
    let zelist = ["destroycard","upgcard","energizer","duplicatecard","infernalfoil","diamondfoil","gaincard","gainrelic","buycard"];
    let emmodallist = ["gaincard","buycard"];
    
    if (Object.hasOwn(curlocation,"skipallowed")) {
        alttravelbtn.style.display = "block";
    } else {
        alttravelbtn.style.display = "none";
    }
    if (skipped == true) {
        curlocdesctxt.innerHTML = curlocation.altdesc;
        loretxt.innerHTML = curlocation.alttext;
    }
    if (curlocation.name == "lordkvictory") {
        p1.coins += 1000;
    }
    if (Object.hasOwn(curlocation,"proceedspecial")) {
        let splitarr1;
        let type;
        let typearg;
        if (curlocation.proceedspecial.includes("|")) {
            splitarr1 = curlocation.proceedspecial.split("|");
            type = splitarr1[0];
            typearg = splitarr1[1];
        } else {
            type = curlocation.proceedspecial;
        }
        if (type == "fight") {
            proceedtxt.innerHTML = "Begin Fight With "+enemies[typearg].formal;
            travelbtn.innerHTML = "Begin Fight";
        }
    } else {
        proceedtxt.innerHTML = "Travel To Next Location: "+locations[curlocation.nextloc].formal;
        travelbtn.innerHTML = "Travel";
    }
    proceeddesc.innerHTML = curlocation.proceedtext;
    if (Object.hasOwn(curlocation,"special") && skipped == false && Object.hasOwn(curlocation,"excludegui") == false) {
        curspecial1 = null;
        curspecial2 = null;
        byId("sc1").style.display = "block";
        byId("sc2").style.display = "block";
        byId("sc3").style.display = "block";
        let special = curlocation.special;
        shopmod = null;
        if (tryAccess(curlocation,"special") && curlocation.special.includes("|") == false) {
            curspecial1 = curlocation.special;
        } else {
            // e.g. the format goes like shop|special1|special2
            // can also be like noshop|special1 or just special1
            let secondhalf = curlocation.special.split("|");
            shopmod = secondhalf[0];
            secondhalf.splice(0, 1);
            curspecial1 = secondhalf[0];
            curspecial2 = secondhalf[1];
            console.log(secondhalf,curlocation.special);
        }

        console.log(special,curspecial1,curspecial2);
        if (curspecial1 == "gaincard") {
            embtnWrap.style.display = "block";
            embtn.innerHTML = "Choose Card";
            Array.from(document.getElementsByClassName("asp-main")).forEach(function(element) {
                /*if (element.getAttribute("id").includes("a")) {
                    return;
                }*/
                let card = randKey(shopcards,"subobj?obtainable=false");
                card.effects = [];
                /*let tempobj = {};
                assign(tempobj,card);
                card = tempobj;*/
                let chance = randNum(1,3); // 1/3 chance of increasing stats
                if (chance > 2) {
                    let chance2 = randNum(1,10);
                    if (chance2 > 0) { // guaranteed to provide 0.7-1.3x buff
                        if (Object.hasOwn(card,"atk")) {
                            card.atk *= randNum(7,13)/10;
                            card.atk = Math.round(card.atk);
                        }
                        if (Object.hasOwn(card,"heal")) {
                            card.heal *= randNum(7,13)/10;
                            card.heal = Math.round(card.heal);
                        }
                    } 
                    if (chance2 > 4) { // 60% chance of decreasing cooldown by 1
                        let prevcool = card.cool;
                        card.cool -= randNum(1,3);
                        if (card.cool < 1 && prevcool != 0) {
                            card.cool = 1;
                        }
                        if (card.cool < 0) {
                            card.cool = 0;
                        }
                        card.hp *= randNum(7,13)/10; // also further applies buff
                        card.hp = Math.round(card.hp);
                    }
                    if (chance2 > 7) { // 30% chance of decreasing manause by 0.5-1.5
                        let prevuse = card.manause;
                        if (card.manause >= 1) {
                            card.manause -= randNum(1,3)/2;
                        }
                        // ensures manause stays above 0.5 (cannot make below)
                        if (prevuse >= 0.5 && card.manause < 0.5) {
                            card.manause = 0.5;
                        }
                    }
                }
                element.style.width = "140px";
                element.style.height = "160px";
                displayCard(element,card);
                //element.innerHTML = `<h2>${card.formal}</h2>`;
                element.setAttribute("data-card",card.name);
                byId(element.getAttribute("id").replace("-main","-tag")).innerHTML = "";
                /*let text = `<p>${card.desc}<br><span style='font-size:13px;'>${card.hp} HP`;
                if (Object.hasOwn(card, "atk")) {
                    text +=` | ${card.atk} ATK`;
                }
                if (Object.hasOwn(card, "heal")) {
                    text +=` | ${card.heal} HEAL`;
                }
                if (Object.hasOwn(card, "ammo")) {
                    text +=` | ${card.ammo} AMMO`;
                }
                text += ` | ${card.manause} MU`;
                if (Object.hasOwn(card, "cool")) {
                    text +=` | ${card.cool} COOLDOWN`;
                }
                text += "</span></p>";
                console.log(text);
                element.innerHTML += text;
                console.log(element.innerHTML);*/
            });
        }
        if (curspecial1 == "gainrelic" || curspecial2 == "gainrelic") {
            addRelic("p1",curlocation.relicgain);
        }
        if (curspecial1 == "buycard") {
            embtnWrap.style.display = "block";
            embtn.innerHTML = "Open Shop";
            Array.from(document.getElementsByClassName("asp-main")).forEach(function(element) {
                /*if (element.getAttribute("id").includes("a")) {
                    return false;
                }*/
                let card = randKey(shopcards,"subobj?obtainable=false");
                /*let tempobj = {};
                assign(tempobj,card);
                card = tempobj;*/
                let chance = randNum(1,10);
                if (chance >= 6) { // 50% chance of getting stat buff
                    let chance2 = randNum(1,10);
                    if (chance2 > 0) { // guaranteed to increase stats by 1-1.4x
                        if (Object.hasOwn(card,"atk")) {
                            card.atk *= randNum(10,14)/10;
                            card.atk = Math.round(card.atk);
                        }
                        if (Object.hasOwn(card,"heal")) {
                            card.heal *= randNum(10,14)/10;
                            card.heal = Math.round(card.heal);
                        }
                    } 
                    if (chance2 > 4) { // 60% chance of decreasing cooldown from 1-2
                        let prevcool = card.cool;
                        card.cool -= randNum(1,2);
                        if (card.cool < 1 && prevcool != 0) {
                            card.cool = 1;
                        }
                        card.hp *= randNum(10,14)/10; // further applies buff
                        card.hp = Math.round(card.hp);
                    }
                    if (chance2 > 7) { // 30% chance of decreasing mana use
                        let prevuse = card.manause;
                        if (card.manause >= 1) {
                            card.manause -= randNum(1,3)/2;
                        }
                        // ensures manause stays above 0.5 (cannot make below)
                        if (prevuse >= 0.5 && card.manause < 0.5) {
                            card.manause = 0.5;
                        }
                    }
                }
                //element.innerHTML = `<h2>${card.formal}</h2>`;
                element.setAttribute("data-card",card.name);
                let cost = Math.round(Math.log(card.hp)**1.3)*3;
                console.log(cost);
                if (Object.hasOwn(card,"atk")) {
                    if (card.cool != 0 && card.manause != 0) {
                        cost +=((card.atk/card.cool)*5)/(Math.log(card.manause*20)/1.8);
                    } else {
                        cost += card.atk*2;
                    }
                    console.log(cost);
                }
                if (Object.hasOwn(card,"heal")) {
                    cost += (card.heal*5)/card.manause;
                }
                
                if (card.type == "Support" || card.type == "Action") {
                    cost *= Math.log((card.manause+2)*2);
                }
                cost = Math.round(cost);
                element.setAttribute("data-cost",cost);
                
                byId(element.getAttribute("id").replace("-main","-tag")).innerHTML = cost+" Coda Coins";
                /*let text = `<p>${card.desc}<br>${card.hp} HP`;
                if (Object.hasOwn(card, "atk")) {
                    text +=` | ${card.atk} ATK`;
                }
                if (Object.hasOwn(card, "heal")) {
                    text +=` | ${card.heal} HEAL`;
                }
                text += ` | ${card.manause} MU`;
                if (Object.hasOwn(card, "cool")) {
                    text +=` | ${card.cool} COOLDOWN`;
                }
                text += ` | ${cost} COST`;
                text += "</p>";
                console.log(text);
                element.innerHTML += text;
                console.log(element.innerHTML);*/
                displayCard(element,card);
            });
        }
        if (curspecial2 == "buyrelic") {
            specialdiv2.style.display = "block";
            Array.from(document.getElementsByClassName("tooltip")).forEach(function(element2) {
                element2.remove();
            })
            Array.from(document.getElementsByClassName("specialcard")).forEach(function(element) {
                element.classList.remove("tooltipholder");
                if (element.getAttribute("id").includes("a") == false) {
                    return false;
                }
                //let relic = randKey(relics,"subobj?obtainable=false"); // old random method
                let relic = relics[lib.weight(relicLootTable,6)]; // new weighted method
                console.log(relic);
                let chance = randNum(1,10);
                element.innerHTML = `<h2>${relic.formal}</h2>`;
                element.setAttribute("data-relic",relic.name);
                let cost = relicCosts[relic.name];
                element.setAttribute("data-cost",cost);
                
                let text = `<p>${relic.desc}<br>${relic.rarity} RARITY`;
                text += ` | ${cost} COST`;
                text += "</p>";
                console.log(text);
                element.innerHTML += text;
                console.log(element.innerHTML);
                let relictooltip = document.createElement("span");
                relictooltip.style.width = "38%";
                relictooltip.className = "tooltip";
                let zehtml = `<h3 style="font-size:22px;margin:0;">${relic.formal}</h3><p style="font-size:14px;">${relic.desc}<br><br>${relic.advdesc}<br><br>Current relic stats: ${relic.attr.toString()}</p>`;
                let tries = 0;
                do {
                    console.log("YE");
                    if (zehtml.includes(".EXEC")) {
                        let zefunc = zehtml.splitTwo(".EXEC{","}");
                        let result = eval(zefunc);
                        if (result == "undefined" || result == undefined) {
                            result = "";
                        }
                        zehtml = zehtml.replace(".EXEC{"+zehtml.splitTwo(".EXEC{","}")+"}",result);
                    }
                    tries++;
                } while (tries < 50 && zehtml.includes(".EXEC"));
                relictooltip.innerHTML = zehtml;
                element.appendChild(relictooltip);
                element.classList.add("tooltipholder");
            });
        }
        if (curspecial1 == "speedingcar") {
            specialdiv.style.display = "block";
            byId("sc3").style.display = "none";
            byId("sc1").innerHTML = "<h2>Run Quickly</h2><p>Get out of the car's way, damaging cards in the process.</p>";
            byId("sc2").innerHTML = "<h2>Stay Still</h2><p>The car can't hurt you, right?</p>";
        }
        if (curspecial1 == "beancandispenser") { // give 50 health for 20 coda coins
            specialdiv.style.display = "block";
            byId("sc2").style.display = "none";
            byId("sc3").style.display = "none";
            byId("sc1").innerHTML = "<h2>Bean Dispenser</h2><p>+50 health, but at the cost of 20 coda coins. Capped at max health.</p>";
        }
        if (curspecial1 == "drinkrobot") { // give two options: good cola and fake cola
            specialdiv.style.display = "block";
            byId("sc3").style.display = "none";
            byId("sc1").innerHTML = "<h2>FEEBOLE COLA</h2><p>A cola that many Feebolians drink. Sounds like ebola. 25 cost.</p>";
            byId("sc1").setAttribute("data-cost",25);
            byId("sc1").setAttribute("data-heal",40);
            byId("sc2").innerHTML = "<h2>NEON ENERGY</h2><p>NEON ENERGY! AMAZING FOR THE MIND! ULTIMATE ENERGY! 100 cost.</p>";
            byId("sc2").setAttribute("data-cost",100);
            byId("sc2").setAttribute("data-heal",-70);
        }
        if (curspecial1 == "fakecoins") { // cause fight with fakecoins
            specialdiv.style.display = "block";
            byId("sc3").style.display = "none";
            byId("sc2").style.display = "none";
            byId("sc1").innerHTML = "<h2>Grab Coins</h2><p>Take the coins for monetary gain.</p>";
            byId("sc1").setAttribute("data-cost",-50);
            byId("sc1").setAttribute("data-fight","fakecoins");
        }
        if (curspecial1 == "gainpower") {
            specialdiv.style.display = "block";
            byId("sc3").style.display = "none";
            byId("sc2").style.display = "none";
            byId("sc1").innerHTML = "<h2>GAIN POWER</h2><p>BECOME THE ALMIGHTY</p>";
        }
        if (curspecial1 == "risk") {
            specialdiv.style.display = "block";
            byId("sc2").style.display = "none";
            byId("sc3").style.display = "none";
            byId("sc1").innerHTML = "<h2>Take the risk.</h2><p>???</p>";
        }
        if (curspecial1 == "unclemanstatue") {
            specialdiv.style.display = "block";
            byId("sc2").style.display = "none";
            byId("sc3").style.display = "none";
            byId("sc1").innerHTML = "<h2>Climb the statue.</h2><p>Seems a little dangerous.. Surely isn't that bad.. right?</p>";
        }
        if (curspecial1 == "flamebean") {
            specialdiv.style.display = "block";
            byId("sc2").style.display = "none";
            byId("sc3").style.display = "none";
            byId("sc1").innerHTML = "<h2>Take the Bean Can.</h2><p>-50 health, but it must be worth it.. right?</p>";
        }
        if (curspecial1 == "celestial") {
            specialdiv.style.display = "block";
            byId("sc2").style.display = "none";
            byId("sc3").style.display = "none";
            byId("sc1").innerHTML = "<h2>Join.</h2><p>Seek a better future.</p>";
        }
        if (curspecial1 == "crowattack") {
            specialdiv.style.display = "block";
            byId("sc3").style.display = "none";
            byId("sc1").innerHTML = "<h2>Throw cards at them!</h2><p>Lose 2 random cards.</p>";
            byId("sc2").innerHTML = "<h2>Run through the crows.</h2><p>Rahh!! They can't attack me!! -80 health.</p>";
        }
        if (curspecial1 == "suddenurge") {
            specialdiv.style.display = "block";
            byId("sc3").style.display = "none";
            byId("sc2").style.display = "none";
            byId("sc1").innerHTML = "<h2>Steal.</h2><p>Gain an extra item for free!</p>";
        }
        if (curspecial1 == "danceclubspill") {
            specialdiv.style.display = "block";
            byId("sc3").style.display = "none";
            byId("sc1").innerHTML = "<h2>Take the Cards</h2><p>Take all the cards you see, may or may not be yours.</p>";
            byId("sc2").innerHTML = "<h2>Leave Quickly</h2><p>Lose two random cards.</p>";
        }
        if (curspecial1 == "cardtornado") {
            specialdiv.style.display = "block";
            byId("sc3").style.display = "none";
            byId("sc1").innerHTML = "<h2>Block the Tornado With Your Backpack</h2><p>+2 random cards.</p>";
            byId("sc2").innerHTML = "<h2>Run Through the Tornado</h2><p>-80 health.</p>";
        }
        if (curspecial1 == "knowledge") {
            specialdiv.style.display = "block";
            byId("sc3").style.display = "none";
            byId("sc1").innerHTML = "<h2>Book of Mana Harnessing</h2><p>+0.5 mana gain.</p>";
            byId("sc2").innerHTML = "<h2>Book of Life</h2><p>+25% more max health.</p>";
        }
        if (curspecial1 == "rest") {
            specialdiv.style.display = "block";
            byId("sc3").style.display = "none";
            byId("sc2").innerHTML = "<h2>ULTRA-CHEAP Room</h2><p>Dirty, old mattresses for the night. It's free, but only heals 20 health.</p>";
            byId("sc2").setAttribute("data-cost",0);
            byId("sc2").setAttribute("data-heal",20);
            byId("sc1").innerHTML = "<h2>Standard Room</h2><p>+70 health, but at the cost of 50 coda coins. Capped at max health.</p>";
            byId("sc1").setAttribute("data-cost",50);
            byId("sc1").setAttribute("data-heal",70);
        }
        if (curspecial1 == "mystery") {
            specialdiv.style.display = "block";
            specialdiv2.style.display = "none";
            byId("sc2").style.display = "none";
            byId("sc3").style.display = "none";
            byId("sc1").innerHTML = "<h2>Mystery Box</h2><p>Lose 120 coda coins, but get a random card with DOUBLE stats.</p>";
        }
        
        if (zelist.includes(curspecial1) || zelist.includes(curspecial2) && shopmod != "showopt") {
            specialdiv.style.display = "none";
            specialdiv2.style.display = "none";
            if (curlocation.name == "cosmeticshop") {
                specialdiv.style.display = "block";
            }
        }
        if (curspecial1 == "gamble") {
            specialdiv.style.display = "none";
            specialdiv2.style.display = "none";
            byId("sc1").style.display = "none";
            byId("sc2").style.display = "none";
            byId("sc3").style.display = "none";
        }
        if (curspecial1 == "jamodarcardsdealer") {
            specialdiv.style.display = "block";
            specialdiv2.style.display = "none";
            byId("sc1").innerHTML = "<h2>1</h2><p>1 is simple. 1 is not composite or prime. 1 is superior.</p>";
            byId("sc2").innerHTML = "<h2>2</h2><p>2*2 and 2+2 are the same. 2 is the only even prime. 2 is the way.</p>";
            byId("sc3").innerHTML = "<h2>3</h2><p>3 rhymes with tree. 3 is a conservationist. #TeamThrees</p>";
        }
        if (curspecial1 == "jamodarcardsvendingmachine") {
            specialdiv.style.display = "block";
            specialdiv2.style.display = "none";
            byId("sc2").style.display = "none";
            byId("sc3").style.display = "none";
            byId("sc1").innerHTML = "<h2>Use Vending Machine</h2><p>Get a random drink.</p>";
        }
        // IMPORTANT
        if (curspecial1 == "setpart" || curspecial1 == "setloc") {
            specialdiv.style.display = "block";
            specialdiv2.style.display = "none";
            byId("sc2").style.display = "none";
            byId("sc3").style.display = "none";
            byId("sc1").innerHTML = `<h2>${curlocation.specialheader}</h2><p>${curlocation.specialdesc}</p>`;
        }
        // END OF IMPORTANT
        if (shopmod == "showopt") {
            specialdiv.style.display = "block";
            byId("sc3").style.display = "none";
            let zespec1 = specials[curspecial1];
            let zespec2 = specials[curspecial2];
            byId("sc1").innerHTML = `<h2>${zespec1.formal}</h2><p>${zespec1.desc}</p>`;
            byId("sc1").setAttribute("data-specialset",zespec1.name);
            byId("sc2").innerHTML = `<h2>${zespec2.formal}</h2><p>${zespec2.desc}</p>`;
            byId("sc2").setAttribute("data-specialset",zespec2.name);
        } else {
            byId("sc1").removeAttribute("data-specialset");
            byId("sc2").removeAttribute("data-specialset");
        }
    } else {
        specialdiv.style.display = "none";
        specialdiv2.style.display = "none";
        curspecial1 = null;
        curspecial2 = null;
    }
    statsdiv.innerHTML = `
    <p>
        ${p1.health} Health | ${p1.coins} Coda Coins
    </p>
    <p>
        ${p1.managain} Mana Gain | ${p1.maxdiscards} Discards
    </p>
    `;
    console.log(textfinished);
    if (curlocation.loretext.includes("||") && textfinished == false) {
        travelbtn.innerHTML = "Next";
        alttravelbtn.style.display = "block";
        alttravelbtn.innerHTML = "Skip Dialogue";
        loretxt.innerHTML = currenttext;
        proceedtxt.style.display = "none";
        proceeddesc.style.display = "none";
        byId("reroll").style.display = "none";
        specialdiv.style.display = "none";
        specialdiv2.style.display = "none";
        embtnWrap.style.display = "none";
    } else {
        alttravelbtn.innerHTML = "Skip";
        if (Object.hasOwn(curlocation,"skipallowed")) {
            alttravelbtn.style.display = "block";
        } else {
            alttravelbtn.style.display = "none";
        }
        if (Object.hasOwn(curlocation,"forceaction") && speciallock == false) {
            travelbtn.style.display = "none";
        } else {
            travelbtn.style.display = "block";
        }
        if (emmodallist.includes(curspecial1) || emmodallist.includes(curspecial2)) {
            embtnWrap.style.display = "block";
        } else {
            embtnWrap.style.display = "none";
        }
        console.log(curspecial1 != null && curspecial1 != "upgcard" && curspecial1 != "destroycard");
        if (curspecial1 != null && zelist.includes(curspecial1) == false) {
            specialdiv.style.display = "block";
            console.log("yo");
        }
        if (curspecial2 != null && zelist.includes(curspecial2) == false && curspecial1 != "mystery") {
            specialdiv2.style.display = "block";
        }
        if (emmodallist.includes(curspecial1) && (zelist.includes(curspecial2) == true || curspecial2 == null)) {
            specialdiv.style.display = "none";
            specialdiv2.style.display = "none";
        }
        if (textfinished == true) {
            loretxt.innerHTML = currenttext;
        }
        if (sCondition("gaincard")[0] == true || sCondition("buycard")[0] == true || sCondition("buyrelic")[0] == true) {
            byId("reroll").style.display = "block";
        } else {
            byId("reroll").style.display = "none";
        }
        proceedtxt.style.display = "block";
        proceeddesc.style.display = "block";
    }
    annotateText(loretxt);
    updateAdventureScreen();
    
    
}
function updateAdventureScreen() {
    checkDead();
    let totalpower = 0;
    statsdiv.innerHTML = `
    <p>
        ${p1.health}/${p1.maxhealth} Health | ${p1.coins} Coda Coins
    </p>
    <p>
        ${p1.managain} Mana Gain | ${p1.maxdiscards} Discards
    </p>
    `;
    // CARDS
    if (inventorytable != null) {
        inventorytable.remove();
    }
    inventorytable = document.createElement('table');
    inventorytable.id = "inventorytable";
    inventorydiv.appendChild(inventorytable);
    let remainder = Object.keys(p1.deck).length % 4;
    let finaltr;
    for (let j = 0; j < Math.ceil(Object.keys(p1.deck).length/4); j++) {
        let zerow = document.createElement('tr');
        if (j-Math.ceil(Object.keys(p1.deck).length/4) == 1) {
            finaltr = zerow;
        }
        inventorytable.appendChild(zerow);
        for (let i = 0; i < 4; i++) {
            if ((j*4)+i > Object.keys(p1.deck).length-1) {
                break;
            }
            let card = document.createElement('td');
            let curcard = p1.deck[Object.keys(p1.deck)[(j*4)+i]];
            displayCard(card,curcard);
            card.setAttribute("data-card",Object.keys(p1.deck)[(j*4)+i]);
            card.setAttribute("data-usetimes",0);
            card.className = "inventorytablecard";
            zerow.appendChild(card);
            totalpower += Math.round(Math.log(curcard.hp)*Math.max(Math.log(ifNo(curcard.maxammo,1)*2),1)*Math.max(Math.log(ifNo(curcard.atk,1)*2),1)*Math.max(Math.log(ifNo(curcard.heal,1)*2),1)/Math.max(Math.log(ifNo(curcard.cool,1)*2),1)/Math.max(Math.log(ifNo(curcard.manause,1)*2),1));
        }
    }
    playerpower = totalpower;
    powertxt.innerHTML = "POWER: "+playerpower;
    // RELICS
    if (relictable != null) {
        relictable.remove();
    }
    
    relictable = document.createElement('table');
    relictable.id = "inventorytable";3
    relicdiv.appendChild(relictable);
    let remainder2 = Object.keys(p1.deck).length % 4;
    let finaltr2;
    for (let j = 0; j < Math.ceil(Object.keys(p1.relics).length/4); j++) {
        let zerow = document.createElement('tr');
        if (j-Math.ceil(Object.keys(p1.relics).length/4) == 1) {
            finaltr2 = zerow;
        }
        relictable.appendChild(zerow);
        for (let i = 0; i < 4; i++) {
            if ((j*4)+i > Object.keys(p1.relics).length-1) {
                break;
            }
            let relic = document.createElement('td');
            relic.style.width = "120px";
            relic.style.height = "120px";
            
            let currelic = p1.relics[Object.keys(p1.relics)[(j*4)+i]];
            
            relic.innerHTML = "<span class='title'>"+currelic.formal+":</span><br>"+currelic.rarity+" RARITY | ";
            relic.innerHTML += "<br><hr><span class='desc'>"+currelic.desc+"</span>";
            let tempimg;
            if (currelic.img != "") {
                tempimg = "url(img/relics/"+currelic.name+".png)";  
                relic.style.backgroundSize = "120px 120px";
            } else {
                tempimg = "url()";
                relic.style.backgroundSize = "120px 120px";
            }
            relic.style.backgroundSize = "120px 120px";
            relic.style.backgroundImage = tempimg;
            relic.className = "tooltipholder";
            let relictooltip = document.createElement("span");
            relictooltip.className = "tooltip";
            zerow.appendChild(relic);
            let zehtml = `<h3 style="font-size:22px;margin:0;">${currelic.formal}</h3><p style="font-size:14px;">${currelic.desc}<br><br>${currelic.advdesc}<br><br>Current relic stats: ${currelic.attr.toString()}</p>`;
            let tries = 0;
            do {
                console.log("YE");
                if (zehtml.includes(".EXEC")) {
                    let zefunc = zehtml.splitTwo(".EXEC{","}");
                    let result = eval(zefunc);
                    if (result == "undefined" || result == undefined) {
                        result = "";
                    }
                    zehtml = zehtml.replace(".EXEC{"+zehtml.splitTwo(".EXEC{","}")+"}",result);
                }
                tries++;
            } while (tries < 50 && zehtml.includes(".EXEC"));
            relictooltip.innerHTML = zehtml;
            relic.appendChild(relictooltip);
            
        }
    }
    Array.from(document.getElementsByClassName("inventorytablecard")).forEach(function(element) {
        element.addEventListener('click', function() {
            if (curspecial1 == "destroycard") {
                if (Object.keys(p1.deck).length == 1){
                    invspecial.innerHTML = "ONLY ONE CARD LEFT";
                    return false;
                }
                if (Object.hasOwn(curlocation,"specialmax")) {
                    if (speciallock == curlocation.specialmax) {
                        invspecial.innerHTML = "MAX DESTROYS REACHED";
                        return false;
                    }
                    if (typeof speciallock == "boolean") {
                        speciallock = 1;
                    } else {
                        speciallock++;
                    }
                }
                let card = p1.deck[element.getAttribute("data-card")];
                if (curlocation.name == "behindtallmart") {
                    p1.coins += 15;
                }
                if (curlocation.name == "roadtocoda4") {
                    if (speciallock == true) {
                        return false;
                    }
                    speciallock = true;
                    if (randNum(1,2) == 1) {
                        p1.health += 30;
                    } else {
                        p1.health -= 30;
                    }
                    if (p1.health > p1.maxhealth) {
                        p1.health = p1.maxhealth;
                    }
                    
                }
                console.log(card);
                delete p1.deck[element.getAttribute("data-card")];
                updateAdventureScreen();
            }
            if (sCondition("upgcard")[0]) {
                if (curlocation.name == "unclerictorappear") {
                    if (curspecial1 == "upgcard" && speciallock < 3) {
                        let card = p1.deck[element.getAttribute("data-card")];
                        let upgradeStats = card.upgrades[card.level+1];
                        if (card.level >= 1) { // ensure card cannot be over upgraded
                            invspecial.innerHTML = `CARD IS AT MAX LEVEL`;
                            return false;
                        }
                        // subtract money by cost
                        if (p1.coins < upgradeStats.cost) {
                            invspecial.innerHTML = `INSUFFICIENT FUNDS ${upgradeStats.cost}`;
                            return false;
                        } else {
                            p1.coins -= upgradeStats.cost;
                        }
                        // prevent card from being upgraded again
                        if (typeof speciallock == "boolean") {
                            speciallock = 1;
                        } else {
                            speciallock++;
                        }
                        card.level += 1;
                        for (let i = 0; i < upgradeStats.stats.length; i++) {
                            let upgStat = upgradeStats.stats[i];
                            let upgAttr = upgStat[0]; // get attributes and values
                            let upgValue = upgStat[1];
                            card[upgAttr] += upgValue;
                        }

                        /*card.hp *= 1.2;
                        card.hp = Math.round(card.hp);
                        if (Object.hasOwn(card,"atk")) {
                            card.atk *= 1.2;
                            card.atk = Math.round(card.atk);
                        }
                        if (Object.hasOwn(card,"heal")) {
                            card.heal *= 1.2;
                            card.heal = Math.round(card.heal);
                        }
                        if (Object.hasOwn(card,"stat")) {
                            card.stat += card.statincrease;
                        }*/
                        updateAdventureScreen();
                    } else {
                        invspecial.innerHTML = "MAX CARD UPGRADES REACHED";
                    }
                }
                if (curlocation.name == "cosmeticshop") {
                    if (curspecial2 == "upgcard" && speciallock2 < 2) {
                        // speciallock means you cannot upgrade more than twice (or once if a card has been bought)
                        if (speciallock == true && speciallock2 == 1) {
                            return false;
                        } 
                        if (typeof speciallock2 == "boolean") {
                            speciallock2 = 1;
                        } else {
                            speciallock2++;
                        }
                        // buff stats by 1.1;
                        let card = p1.deck[element.getAttribute("data-card")];
                        card.hp *= 1.1;
                        card.hp = Math.round(card.hp);
                        if (Object.hasOwn(card,"atk")) {
                            card.atk *= 1.1;
                            card.atk = Math.round(card.atk);
                        }
                        if (Object.hasOwn(card,"heal")) {
                            card.heal *= 1.1;
                            card.heal = Math.round(card.heal);
                        }
                        if (Object.hasOwn(card,"stat")) {
                            card.stat += card.statincrease/2; // increase stats 1/2 the standard amount
                        }
                        updateAdventureScreen();
                    } else {
                        invspecial.innerHTML = "MAX CARD UPGRADES REACHED";
                    }
                }
                if (curlocation.name == "jamodarcards2") {
                    if (curspecial1 == "upgcard" && speciallock < 3) {
                        let card = p1.deck[element.getAttribute("data-card")];
                        let upgradeStats = card.upgrades[card.level+1];
                        if (card.level >= 1) { // ensure card cannot be over upgraded
                            invspecial.innerHTML = `CARD IS AT MAX LEVEL`;
                            return false;
                        }
                        // subtract money by cost
                        if (p1.coins < upgradeStats.cost) {
                            invspecial.innerHTML = `INSUFFICIENT FUNDS ${upgradeStats.cost}`;
                            return false;
                        } else {
                            p1.coins -= upgradeStats.cost;
                        }
                        // prevent card from being upgraded again
                        if (typeof speciallock == "boolean") {
                            speciallock = 1;
                        } else {
                            speciallock++;
                        }
                        card.level += 1;
                        for (let i = 0; i < upgradeStats.stats.length; i++) {
                            let upgStat = upgradeStats.stats[i];
                            let upgAttr = upgStat[0]; // get attributes and values
                            let upgValue = upgStat[1];
                            card[upgAttr] += upgValue;
                        }
                        updateAdventureScreen();
                    } else {
                        invspecial.innerHTML = "MAX CARD UPGRADES REACHED";
                    }
                }
            }
            if (sCondition("gamble")[0]) {
                if (p1.coins < 50) {
                    invspecial.innerHTML = "INSUFFICIENT FUNDS";
                    return false;
                }
                if (Object.keys(p1.deck).length == 1) {
                    invspecial.innerHTML = "ONLY ONE CARD LEFT";
                    return false;
                }
                let card = p1.deck[element.getAttribute("data-card")];
                p1.coins -= 50;
                let chance = randNum(1,5);
                if (chance < 3) {
                    card.hp *= 1.5;
                    card.hp = Math.round(hp);
                    if (Object.hasOwn(card,"atk")) {
                        card.atk *= 1.5;
                        card.atk = Math.round(atk);
                    }
                    if (Object.hasOwn(card,"heal")) {
                        card.heal *= 1.5;
                        card.heal = Math.round(heal);
                    }
                    if (Object.hasOwn(card,"stat")) {
                        card.stat += card.statincrease*2;
                    }
                } else {
                    delete p1.deck[element.getAttribute("data-card")];
                }
                updateAdventureScreen();
            }
            
            if (curspecial2 == "energizer" && p1.coins >= 150 && speciallock2 < 2) {
                p1.coins -= 150;
                if (typeof speciallock2 == "boolean") {
                    speciallock2 = 1;
                } else {
                    speciallock2++;
                }
                let card = p1.deck[element.getAttribute("data-card")];
                card.cool -= 2;
                card.coolleft -= 2;
                if (card.cool < 1) {
                    card.cool = 1;
                }
                if (card.coolleft < 0) {
                    card.coolleft = 0;
                }
                updateAdventureScreen();
            }
            if (curspecial1 == "infernalfoil" && p1.coins >= 150 && speciallock == false && p1.deck[element.getAttribute("data-card")].cardmods.includes("infernalfoil") == false) {
                if (typeof speciallock == "number") {
                    return false;
                }
                speciallock = true;
                p1.coins -= 150;
                let card = p1.deck[element.getAttribute("data-card")];
                card.cardmods.push("infernalfoil");
                updateAdventureScreen();
            }
            if (curspecial1 == "diamondfoil" && p1.coins >= 200 && speciallock == false && p1.deck[element.getAttribute("data-card")].cardmods.includes("diamondfoil") == false) {
                speciallock = true;
                p1.coins -= 200;
                let card = p1.deck[element.getAttribute("data-card")];
                card.cardmods.push("diamondfoil");
                card.hp *= 5;
                card.hp = Math.round(card.hp);
                if (Object.hasOwn(card,"atk")) {
                    card.atk *= 2;
                    card.atk = Math.round(card.atk);
                }
                updateAdventureScreen();
            }
            if (curspecial1 == "duplicatecard" &&speciallock == false) {
                speciallock = true;
                p1.coins += 50;
                let card = p1.deck[element.getAttribute("data-card")];
                let names = element.getAttribute("data-card");
                if (/\d/.test(names)) {
                    names = names.substring(0,names.length()-1);
                }
                let tries = 0;
                let newname;
                do {
                    newname = names+tries;
                    tries++;
                } while (Object.keys(p1.deck).includes(newname) == true && tries < 50);
                p1.deck[newname] = structuredClone(card);
                updateAdventureScreen();
            }
        });
    });
}
/*function hideStat(element,show) {
    console.log("YES");
    let id = element.getAttribute("id");
    let index = Number(id.replace("c",""))-1;
    let card = p1.inventory[Object.keys(p1.inventory)[index]];
    console.log(card,index);
    if (show == true) {
        /*text-indent: 100%;
    white-space: nowrap;
    overflow: hidden;
        console.log("BA");
        element.style.fontSize = null;
        element.style.whiteSpace = null;
        element.style.overflow = null;
        element.style.backgroundImage = null;   
    } else {
        console.log("MA");
        element.style.fontSize = "0 !important";
        element.style.overflow = "hidden";
        if (card.name == "solarprism") {
            console.log("YAAA");
            element.style.backgroundImage = "url('img/cards/solarprism.png')";
            element.style.backgroundSize = "140px 160px";
        } else {
            console.log("NAAA");
            element.style.backgroundImage = null;   
        }
    }
}*/
Array.from(document.getElementsByClassName("card")).forEach(function(element) {
    element.addEventListener('click', function() {
        if (turn == 1) {
            if (cardmode == 1) {
                useCard(element);
            }
            if (cardmode == 2) {
                selectCard(element);
            }
            
        }
        
    });
});
turnbtn.addEventListener('click',function(){
    if (turn == 1 && blockturnover == false) {
        oppTurn();
    }
    
    
});
togglecardmode.addEventListener('click',function() {
    if (cardmode == 1) {
        cardmode = 2;
        togglecardmode.innerHTML = "Toggle Card Mode (Current: Select)";
    } else {
        cardmode = 1;
        /*if (focused != null) {
            unborder(focused.getAttribute("id"));
        }
        
        focused = null;*/
        togglecardmode.innerHTML = "Toggle Card Mode (Current: Use)";
    }
})
drawbtn.addEventListener('click',function(){
    if (p1.mana >= 3 && turn == 1 && Object.keys(p1.inventory).length < 10 && reloading == false) {
        p1.mana -= 3;
        if (currentmode == "Custom" && customtype == "industrial") {
            drawCard("p1",true,"factory");
        } else {
            drawCard("p1");
        }
        
        update();
    }
    
});
discardbtn.addEventListener('click',function(){
    if (turn == 1 && Object.keys(p1.inventory).length > 0 && p1.discards > 0) {
        discard("p1");
    }
});
unselectbtn.addEventListener('click',function() {
    if (focused != null) {
        unborder(focused.getAttribute("id"));
        focused = null;
    }
    
})

playbtn.addEventListener("click",function() {
    if (sob == 2 && debouncetimer > 30) {
        if (playbtn.innerHTML == "RESTART") {
            curlocation = locations.home;
            Game.p1 = {
                managain: 5,
                maxdiscards: 1,
                maxhealth: 300,
                coins: 20,
                startingmana: 10,
                // battlestats
                health: 300,
                mana: 10,
                discards: 1,
                inventory: {},
                deck: {},
                battledeck: {},
                mods: [],
                relics: {},
            };
            p1 = Game.p1;
            drawCard("p1",true,"spearman","addToDeck");
            drawCard("p1",true,"spearman","addToDeck");
        }
        fullSD(menuscreen,adventurescreen,"none","block");
        window.setTimeout(enterAdventureScreen,200);
    }
    if (sob == 1) {
        sob = 2;
        fullSD(menuscreen,modescreen,"none","flex");
    }
    
    
});
// startBattle("andreas");
Array.from(document.getElementsByClassName("modes")).forEach(function(element) {
    element.addEventListener('click', function() {
        if (debouncetimer < 30) {
            return false;
        }
        let id = element.getAttribute("id");
        let cleaned = id.replace("mode","");
        cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
        currentmode = cleaned;
        fullSD(modescreen,startmodsscreen,"none","flex");
    });
});
Array.from(document.getElementsByClassName("startmods")).forEach(function(element) {
    element.addEventListener('click', function() {
        if (debouncetimer < 30) {
            return false;
        }
        let startmod = element.getAttribute("id");
        setStartMod(startmod);
        fullSD(startmodsscreen,adventurescreen,"none","block");
        window.setTimeout(enterAdventureScreen,200);
        document.body.style.overflowY = "scroll";
        document.body.style.height = null;
        document.body.style.width = null;
    });
});
function sCondition(special) {
    let arr = [];
    if ((speciallock == false || typeof speciallock == "number") && curspecial1 == special) {
        arr = [true,1];
    } else if ((speciallock2 == false || typeof speciallock2 == "number") && curspecial2 == special) {
        arr = [true,2];
    } else {
        arr = [false,0];
    }
    return arr;
}
Array.from(document.getElementsByClassName("reroll")).forEach(function(element) {
    element.addEventListener('click', function() {
        if (rerolls < 5 && (sCondition("gaincard")[0] == true || sCondition("buycard")[0] == true || sCondition("buyrelic")[0] == true) && p1.coins >= 15) {
            p1.coins -= 15;
            rerolls++;
            Array.from(document.getElementsByClassName("specialcard")).forEach(function(element) {
                element.style.border = "2px solid black";
            });
            enterAdventureScreen();
        }
    });
});
Array.from(document.getElementsByClassName("specialcard")).forEach(function(element) {
    // SPECIALHANDLING BOOKMARK
    element.addEventListener('click', function() {
        if (element.hasAttribute("data-fight")) {
            if (element.hasAttribute("data-cost")) {
                p1.coins -= Number(element.getAttribute("data-cost"));
            }
            startBattle(element.getAttribute("data-fight"));
            fullSD(adventurescreen,gamescreen,"none","block");
            currenttext = "";
            textfinished = false;
            currenttextnum = 0;
            rerolls = 0;
            element.removeAttribute("data-fight");
        }
        let con1 = false;
        let con2 = false;
        if (Object.hasOwn(curlocation,"actiontext") && speciallock == false) {
            con1 = true;
        }
        if (Object.hasOwn(curlocation,"forceaction") && speciallock == false) {
            con2 = true;
        }
        if (element.hasAttribute("data-specialset")) {
            curspecial1 = element.getAttribute("data-specialset");
        }

        if (curspecial1 == "setpart") {
            setLoc("addpart",[curlocation.name,curlocation.setpart]);
            nextLoc();
            travel();
        }
        if (curspecial1 == "setloc") {
            setLoc("addloc",[curlocation.name,curlocation.setloc]);
            nextLoc();
            travel();
        }

        if (sCondition("gaincard")[0] == true && element.hasAttribute("data-card")) {
            if (curlocation.name == "cosmeticshop" && speciallock2 == 2) {
                return false;
            }
            let num = sCondition("gaincard")[1];
            let card = element.getAttribute("data-card");
            drawCard("p1",true,card,"addToDeck");
            updateAdventureScreen();
            if (num == 1) {
                speciallock = true;
            } else {
                speciallock2 = true;
            }
            
            element.style.border = "7px solid black";
        }
        if (sCondition("buycard")[0] == true && element.hasAttribute("data-card") && element.hasAttribute("data-cost")) {
            let card = element.getAttribute("data-card");
            if (p1.coins >= Number(element.getAttribute("data-cost"))) {
                p1.coins -= Number(element.getAttribute("data-cost"));
            } else {
                return false;
            }
            drawCard("p1",true,card,"addToDeck");
            updateAdventureScreen();
            element.style.border = "7px solid black";
        }
        if (sCondition("buyrelic")[0] == true && element.hasAttribute("data-relic") && element.hasAttribute("data-cost") && element.style.border == "2px solid black") {
            let relic = element.getAttribute("data-relic");
            if (p1.coins >= Number(element.getAttribute("data-cost"))) {
                p1.coins -= Number(element.getAttribute("data-cost"));
            } else {
                return false;
            }
            if (Object.hasOwn(p1.relics,relic)) {
                if (p1.relics[relic].attrtype == "arrup") {
                    for (let i = 0; i < p1.relics[relic].attr.length; i++) {
                        p1.relics[relic].attr[i] += relics[relic].attrincrease[i];
                    }
                }
                if (p1.relics[relic].attrtype == "int") {
                    p1.relics[relic].attr += relics[relic].attrincrease;
                    if (relic == "lifecapsule") {
                        p1.maxhealth += 20;
                        p1.health += 20;
                    }
                    if (relic == "trashcan") {
                        p1.maxdiscards += 0.5;
                        p1.discards += 0.5;
                    }
                    if (relic == "blueprint") {
                        p1.startingmana += 0.5;
                    }
                }
                let list = ["thundercrate","frostyhorn","hammerhammer"]
                if (list.includes(relic)) {
                    p1.coins += Number(element.getAttribute("data-cost"));
                }
            }else {
                let key = {};
                assign(key,relics[relic]);
                p1.relics[relic] = key;
                if (relic == "lifecapsule") {
                    p1.maxhealth += 60;
                    p1.health += 60;
                }
                if (relic == "trashcan") {
                    p1.maxdiscards += 1;
                    p1.discards += 1;
                }
                if (relic == "soullantern") {
                    p1.startingmana += 1;
                }
                if (relic == "blueprint") {
                    p1.startingmana += 1;
                }
            }
            
            updateAdventureScreen();
            element.style.border = "7px solid black";
        }
        if (sCondition("mystery")[0] == true && p1.coins >= 120 && speciallock < 3) {
            p1.coins -= 120;
            if (typeof speciallock == "boolean") {
                speciallock = 1;
            } else {
                speciallock++;
            }
            drawCard("p1",false,null,["addToDeck","doubleStats"]);
            updateAdventureScreen();
        }
        if (sCondition("speedingcar")[0] == true && speciallock == false) { // damage card or take damage
            speciallock = true;
            let zeoption = element.getAttribute("id");
            if (zeoption == "sc1") { // first option, debuffs cards
                for (let i =0; i < 2; i++) {
                    let card = randKey(p1.deck);
                    card.hp *= randNum(6,9)/10;
                    if (Object.hasOwn(card,"atk")) {
                        card.atk *= randNum(7,9)/10;
                    }
                    if (Object.hasOwn(card,"heal")) {
                        card.heal *= randNum(7,9)/10;
                    }
                    if (Object.hasOwn(card,"cool") && randNum(1,2) == 1) {
                        card.cool += randNum(0,1);
                    }
                    if (Object.hasOwn(card,"coolleft")) {
                        card.coolleft += randNum(0,1);
                    }
                }
            } else {
                p1.health -= 80; // take damage from car
            }
            
            updateAdventureScreen();
        }
        if (sCondition("beancandispenser")[0] == true && p1.coins >= 30) {
            p1.coins -= 30;
            p1.health += 50;
            p1.maxhealth += 50;
            updateAdventureScreen();
        }
        if (sCondition("drinkrobot")[0]) {
            if (p1.coins >= element.getAttribute("data-cost")) {
                p1.coins -= element.getAttribute("data-cost");
                p1.health += Number(element.getAttribute("data-heal"));
                if (p1.health > p1.maxhealth) {
                    p1.health = p1.maxhealth;
                }
                if (p1.health < 1) {
                    p1.health = 1;
                }
                speciallock= true;
            }
            updateAdventureScreen();
        }
        if (sCondition("gainpower")[0] && speciallock ==false) {
            speciallock = true;
            p1.maxhealth = 1;
            p1.health = 1;
            for (let z = 0; z < Object.keys(p1.deck).length; z++) { // make all cards gain double stats, but set health to 1.
                let chosencard = p1.deck[Object.keys(p1.deck)[z]];
                chosencard.hp *= 2;
                if (Object.hasOwn(chosencard,"atk")) {
                    chosencard.atk *= 2;
                }
                if (Object.hasOwn(chosencard,"heal")) {
                    chosencard.heal *= 2;
                }
                if (Object.hasOwn(chosencard,"stat")) {
                    chosencard.stat += chosencard.statincrease*4;
                }
            }
            updateAdventureScreen();
        }
        if (sCondition("risk")[0] == true && Object.keys(p1.deck).length > 1) { // delete all cards except one, that card becomes the paragon.
            let card = randKey(p1.deck);
            Object.keys(p1.deck).forEach(function(key) {
                if (p1.deck[key] != card) {
                    delete p1.deck[key];
                }
            });
            card.hp *= 2;
            if (Object.hasOwn(card,"atk")) {
                card.atk *= 2;
            }
            if (Object.hasOwn(card,"cool")) {
                card.cool = 1;
            }
            updateAdventureScreen();
        }
        if (sCondition("unclemanstatue")[0] == true) { // give random card at cost of 100 hp
            speciallock = true;
            let card = randKey(cards);
            drawCard("p1",true,card.name,"addToDeck");
            p1.health -= 100;
            if (p1.health < 1) {
                p1.health = 1;
            }
            updateAdventureScreen();
        }
        if (sCondition("flamebean")[0] == true) { // give flamebean relic
            speciallock = true;
            p1.health -= 50;
            let key = {};
            assign(key,relics.flamebean);
            p1.relics["flamebean"] = key;
            updateAdventureScreen();
        }
        if (sCondition("celestial")[0] == true) { // add celestial striker to deck
            p1.health -= 100;
            speciallock = true;
            drawCard("p1",true,"celestialstriker","addToDeck");
        }
        if (sCondition("rest")[0] == true) {
            if (p1.coins >= element.getAttribute("data-cost")) {
                p1.coins -= element.getAttribute("data-cost");
                p1.health += Number(element.getAttribute("data-heal"));
                if (p1.health > p1.maxhealth) {
                    p1.health = p1.maxhealth;
                }
                speciallock= true;
            }
            
            updateAdventureScreen();
        }
        if (sCondition("knowledge")[0] == true) {
            speciallock = true;
            let id  = element.getAttribute("id");
            if (id == "sc1") {
                p1.managain += 0.5;
            } else if (id == "sc2") {
                let am = Math.round(p1.maxhealth/4);
                p1.maxhealth += am;
                p1.health += am;
            }
            updateAdventureScreen();
        }
        if (sCondition("crowattack")[0] && speciallock ==false) {
            speciallock = true;
            let zeoption = element.getAttribute("id");
            if (zeoption == "sc1" && Object.keys(p1.deck).length > 2) {
                let zecards = sample(Object.keys(p1.deck),2);
                for (let i =0; i < zecards.length; i++) {
                    delete p1.deck[zecards[i]];
                }
            } else {
                p1.health -= 80;
            }
            updateAdventureScreen();
        }
        if (sCondition("suddenurge")[0] && speciallock ==false) {
            speciallock = true;
            p1.health -= 80;
            updateAdventureScreen();
        }
        if (sCondition("danceclubspill")[0] && speciallock ==false) {
            speciallock = true;
            let zeoption = element.getAttribute("id");
            if (zeoption == "sc2" && Object.keys(p1.deck).length > 2) {
                let zecards = sample(Object.keys(p1.deck),2);
                for (let i =0; i < zecards.length; i++) {
                    delete p1.deck[zecards[i]];
                }
            } else {
                let zecards = sample(Object.keys(p1.deck),2);
                for (let i =0; i < zecards.length; i++) {
                    delete p1.deck[zecards[i]];
                }
                let card = randKey(cards);
                drawCard("p1",true,card.name,"addToDeck");
                card = randKey(cards);
                drawCard("p1",true,card.name,"addToDeck");
            }
            
        }
        if (sCondition("cardtornado")[0] && speciallock ==false) {
            speciallock = true;
            let zeoption = element.getAttribute("id");
            if (zeoption == "sc1") {
                let card = randKey(cards);
                drawCard("p1",true,card.name,"addToDeck");
                card = randKey(cards);
                drawCard("p1",true,card.name,"addToDeck");
            } else {
                p1.health -= 80;

            }
            
        }
        if (sCondition("jamodarcardsvendingmachine")[0] && speciallock ==false) {
            speciallock = true;
            p1.coins -= 50;
            let rand = randNum(1,5);
            if (rand == 1) {
                p1.health += 50;
                p1.maxhealth += 50;
            } // GOOD DRINK!
            if (rand == 2) {
                p1.health += 25;
                p1.maxhealth += 25;
            } // Eh, decent!
            if (rand == 3) {
                let rand2 = randNum(-10,10);
                p1.health += rand2;
                p1.maxhealth += rand2;
            } // True rand
            if (rand == 4) {
                p1.health -= 25;
                p1.maxhealth -= 25;
            }
            if (rand == 5) {
                p1.health -= 50;
                p1.maxhealth -= 50;
            }// RIP
        }
        if (sCondition("jamodarcardsdealer")[0] && speciallock ==false) {
            speciallock = true;
            let chosen = randNum(1,3);
            console.log(element.getAttribute("id").split("sc"));
            if (Number(element.getAttribute("id").split("sc")[0])== chosen) {
                p1.coins += 100;
            } else {
                p1.coins -= 100;
            }
        }
        element.style.border = "7px solid black";
        if (con1) {
            currenttext += "<br>"+curlocation.actiontext;
            loretxt.innerHTML = currenttext;
        }
        if (con2) {
            enterAdventureScreen();
        }
        updateAdventureScreen();
    });
});
Array.from(document.getElementsByClassName("asp-main")).forEach(function(element) {
    element.addEventListener("click",function() {
        if (element.hasAttribute("data-specialset")) {
            curspecial1 = element.getAttribute("data-specialset");
        }

        if (sCondition("gaincard")[0] == true && element.hasAttribute("data-card")) {
            if (curlocation.name == "cosmeticshop" && speciallock2 == 2) {
                return false;
            }
            let num = sCondition("gaincard")[1];
            let card = element.getAttribute("data-card");
            drawCard("p1",true,card,"addToDeck");
            updateAdventureScreen();
            if (num == 1) {
                speciallock = true;
            } else {
                speciallock2 = true;
            }
            
            element.style.border = "7px solid black";
        }
        if (sCondition("buycard")[0] == true && element.hasAttribute("data-card") && element.hasAttribute("data-cost")) {
            let card = element.getAttribute("data-card");
            if (p1.coins >= Number(element.getAttribute("data-cost"))) {
                p1.coins -= Number(element.getAttribute("data-cost"));
            } else {
                return false;
            }
            drawCard("p1",true,card,"addToDeck");
            updateAdventureScreen();
            element.style.border = "7px solid black";
        }
    });
});
function travel() {
    adventurescreen.style.opacity = 0;
    ultrawrapimg.src = "img/background/"+curlocation.locimg;
    window.setTimeout(enterAdventureScreen,200);
    currenttext = "";
    textfinished = false;
    currenttextnum = 0;
    rerolls = 0;
}
travelbtn.addEventListener("click", function() {
    skipped = false;
    speciallock = false;
    speciallock2 = false;
    specialdiv.style.display = "none";
    specialdiv2.style.display = "none";
    Array.from(document.querySelectorAll(".specialcard, .asp-main")).forEach(function(element) {
        element.style.border = "2px solid black";
    });
    invspecial.innerHTML = "";
    playAudio("sounds/pop.mp3");
    if (travelbtn.innerHTML == "Travel") {
        if (curlocation.name == "danceclubsign") {
            skipped = true;
        }
        if (curlocation.name == "trafficlordvictory") {
            if (p1.coins < 600) {
                resetBattleUI();
                fullSD(adventurescreen,menuscreen,"none","block");
                sob = 2;
                //window.setTimeout(enterAdventureScreen,200);
                gametitle.innerHTML = "You Lose..";
                playbtn.innerHTML = "RESTART";
                openBtn[1].style.display = "none";
                return false;
            } else {
                p1.coins -= 600;
                fullSD(adventurescreen,menuscreen,"none","block");
                sob = 2;
                //window.setTimeout(enterAdventureScreen,200);
                gametitle.innerHTML = "Coda At Last!";
                playbtn.innerHTML = "CONTINUE";
                openBtn[1].style.display = "none";
                nextLoc();
                
                currenttext = "";
                textfinished = false;
                currenttextnum = 0;
                rerolls = 0;
                return false;
            }
        }
        if (curlocation.special == "setpart" && Object.hasOwn(curlocation,"specialopt") == false) {
            setLoc("addpart",[curlocation.name,curlocation.setpart]);
        }
        if (curlocation.special == "setloc" && Object.hasOwn(curlocation,"specialopt") == false) {
            setLoc("addloc",[curlocation.name,curlocation.setloc]);
        }
        nextLoc();
        // curlocation = locations[curlocation.nextloc];
        adventurescreen.style.opacity = 0;
        ultrawrapimg.src = "img/background/"+curlocation.locimg;
        window.setTimeout(enterAdventureScreen,200);
        currenttext = "";
        textfinished = false;
        currenttextnum = 0;
        rerolls = 0;
        let invspecials = {
            "destroycard": {
                text: "Click a card to destroy it.",
                color: "rgb(90,20,20)",
            },
            "upgcard": {
                text: "Click a card to upgrade it.",
                color: "rgb(100,200,100)",
            },
            "gamble": {
                text: "Click a card to use it for gambling.",
                color: "rgb(155,155,0)",
            },
            "energizer": {
                text: "Click a card to add an energizer foil to it.",
                color: "rgb(200,200,30)",
            },
        };
        let specey1;
        let specey2;
        if (curlocation.special.includes("|") == false) {
            specey1 = curlocation.special;
        } else {
            let secondhalf = curlocation.special.split("|");
            secondhalf.splice(0, 1);
            specey1 = secondhalf[0];
            specey2 = secondhalf[1];
        }
        if (Object.keys(invspecials).includes(specey1) || Object.keys(invspecials).includes(specey2)) {
            let zespec;
            if (Object.keys(invspecials).includes(specey1)) {
                zespec = specey1;
            } else {
                zespec = specey2;
            }
            invspecial.innerHTML = invspecials[zespec].text;
            invspecial.style.color = invspecials[zespec].color;
        } else {
            invspecial.innerHTML = "";
        }
    }
    if (travelbtn.innerHTML == "Begin Fight") {
        startBattle(curlocation.proceedspecial.split("|")[1]);
        fullSD(adventurescreen,gamescreen,"none","block");
        currenttext = "";
        textfinished = false;
        currenttextnum = 0;
        rerolls = 0;
    }
    if (travelbtn.innerHTML == "Next") {
        if (curlocation.loretext.includes("||") && textfinished == false) {
            let texts = curlocation.loretext.split("||");
            let text = texts[currenttextnum];
            if (currenttextnum > 0) {
                text = "<br>"+text;
            }
            if (currenttextnum-texts.length >= -1) {
                textfinished = true;
                currenttextnum = 0;
            } else {
                currenttextnum += 1;
            }
            currenttext += text;
            enterAdventureScreen();
        }
        
    }
    
    
    
});
alttravelbtn.addEventListener("click", function() {
    Array.from(document.querySelectorAll(".specialcard, .asp-main")).forEach(function(element) {
        element.style.border = "2px solid black";
    });
    playAudio("sounds/pop.mp3");
    if (alttravelbtn.innerHTML == "Skip") {
        skipped = true;
        nextLoc();
        adventurescreen.style.opacity = 0;
        currenttext = "";
        textfinished = false;
        currenttextnum = 0;
        rerolls = 0;
        window.setTimeout(enterAdventureScreen,200);
    } else {
        let text = curlocation.loretext.replaceAll("||","<br>");
        textfinished = true;
        currenttextnum = 0;
        currenttext = text;
        enterAdventureScreen();
    }
    
});
byId("togglevolume").addEventListener("click",function() {
    if (curvolume == 0.4) {
        curvolume = 0;
        byId("togglevolume").style.backgroundColor = `rgba(130,130,170,0.7)`;
    } else {
        curvolume = 0.4;
        byId("togglevolume").style.backgroundColor = `rgba(210, 210, 250, 0.7)`;
    }
});
/* CHANGELOG ANNOTATIONS */
function replaceChar(origString, replaceChar, index) {
    let firstPart = origString.substr(0, index);

    let lastPart = origString.substr(index + 1);

    let newString =
        firstPart + replaceChar + lastPart;

    return newString;
}
var changelogtab = byId("changelogtab");
var tutorialtab = byId("tutorialtab");
var importanttab = byId("importanttab");
var annot_in = [".text-yell{",".text-blue{",".text-purp{",".text-green{",".text-red{",".text-highlight~~{",".text-linedeco~~{",".text-custom~~{",".text-woah{",".text-skewdash{",".text-italic{",".text-bold{",".text-maxi{"];
var annot_out = ["<span class='text-yell'>|||</span>","<span class='text-blue'>|||</span>","<span class='text-purp'>|||</span>","<span class='text-green'>|||</span>","<span class='text-red'>|||</span>","<mark style='background-color:zespecial;'>|||</mark>","<span style='text-decoration:zespecial;'>|||</span>","<span style='zespecial'>|||</span>","<span class='text-woah'>|||</span>","<div class='text-skewdash'><span>|||</span></div>","<span style='font-style:italic;'>|||</span>","<span style='font-weight:bolder;'>|||</span>","<span class='text-maxi'>|||</span>"];
function annotateText(element) {
    for (let i =0; i < annot_in.length; i++) {
        let annot = annot_in[i];
        if (element.innerHTML.includes(annot.replace("~~{","")) == false) {
            continue;
        }
        let tries = 0;
        do {
            let zetext = element.innerHTML;
            let annot1 = annot_out[i].split("|||")[0];
            let annot2 = annot_out[i].split("|||")[1];
            let zespecial;
            if (zetext.includes("~~") && annot.includes("~~")) {
                let substr = zetext.substring(zetext.indexOf("~~")+2,zetext.indexOf("{",zetext.indexOf("~~")));
                // 
                console.log(substr);
                zespecial = substr.replace("{","");
            }
            if (annot2.includes("zespecial") && zespecial != null) {
                annot2 = annot2.replace("zespecial",zespecial);
            }
            let index1 = zetext.indexOf(annot);
            if (zespecial) {
                index1 = zetext.indexOf("~~"+zespecial+"{");
            }
            console.log(zespecial);
            
            let textslice1 = zetext.substring(0,index1)
            let textslice2 = zetext.substring(index1,index1+zetext.substring(index1).indexOf("}"));
            
            
            let textslice3 = zetext.substring(index1+zetext.substring(index1).indexOf("}"));
            
            zetext = textslice1+textslice2.replace(annot,annot1)+textslice3.replace("}",annot2);
            if (zespecial) {
                console.log("yuh",textslice2.replace(zespecial,annot1.replace("zespecial",zespecial)));
                zetext = textslice1.replace(annot.replace("~~{",""),"")+textslice2.replace(zespecial,annot1.replace("zespecial",zespecial)).replace("~~","").replace("{","")+textslice3.replace("}",annot2);
            }
            element.innerHTML = zetext;
            /*let index2 = zetext.substring((index1-(annot_in[i].length-1))+annot_out[i].length-1).indexOf("}");
            zetext = zetext.substring(0,index2)+annot2+zetext.substring(index2+annot2.length-1);*/
            tries++;
            
        } while (element.innerHTML.includes(annot.replace("~~{","")) && tries < 20);
    }
}
Array.from(document.getElementsByClassName("modal-content")).forEach(function(element) {
    annotateText(element)
});
/* other stuff */
var backpackactive = true;
byId("backpack-toggle").addEventListener("click",function(e) {
    if (backpackactive == true) {
        backpackactive = false;
        byId("a1").style.width = "100%";
        byId("a2").style.width = "0px";
    } else {
        backpackactive =true;
        byId("a1").style.width = "50%";
        byId("a2").style.width = "50%";
    }
});
byId("card-test-display-submit").addEventListener("click",function() {
    if (cards[byId("card-test-display-input").value.split(";")[0]] != undefined) {
        let input = byId("card-test-display-input").value;
        input = input.split(";");
        console.log(input);
        let zecard = structuredClone(cards[input[0]]);
        if (input.length > 1) {
            for (let i =0; i < input.length-1; i++) {
                let part = input[i+1].split("=");
                console.log(part);
                let part2 = part[1];
                let part1 = part[0];
                zecard[part1] = morphType(part2);
            }
        }
        
        displayCard(byId("card-test-display"),zecard);
    }
});
// hidden functions
function cheat(bool) {
    if (bool == 0) {
        byId("cheat-menu").classList.add("hide");
    } else {
        byId("cheat-menu").classList.remove("hide");
    }
}
Array.from(document.getElementsByClassName("cheat-btn")).forEach(function(element) {
    element.addEventListener("click",function() {
        let zecheat = Number(element.getAttribute("data-cheat"));
        if (zecheat == 1) {
            p2.health = 0;
            update();
        }
        if (zecheat == 2) {
            drawCard("p1",true,byId("cheat-input-2").value,["addToDeck"]);
            updateAdventureScreen();
        }
        if (zecheat == 3) {
            p1.coins += 1000;
            updateAdventureScreen();
        }
        if (zecheat == 4) {
            p1.coins += 1000;
            p1.deck = {};
            drawCard("p1",true,"celestialstriker",["addToDeck","doubleStats"]);
            drawCard("p1",true,"celestialstriker",["addToDeck","doubleStats"]);
            enterAdventureScreen();
            updateAdventureScreen();
        }
    });
});
dragElement(document.getElementById("cheat-menu"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "-header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "-header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
var lastkey;
var keylist = [];
document.addEventListener('keydown', function(event) {
    if(event.key == "c") {
        keylist.push("c");
    }
    if (lastkey == "c" && event.key == "h") {
        keylist.push("h");
    }
    if (lastkey == "h" && event.key == "e") {
        keylist.push("e");
    }
    if (lastkey == "e" && event.key =="a") {
        keylist.push("a");
    }
    if (lastkey == "a" && event.key == "t") {
        keylist.push("t");
    }
    if (keylist.toString().replaceAll(",","") == "cheat") {
        if (byId("cheat-menu").classList.contains("hide")) {
            cheat(1);
        } else {
            cheat(0);
        }
        keylist = [];
    }
    if (["c","h","e","a","t"].includes(event.key) == false) {
        keylist = [];
    }
    if (keylist.length > 5) {
        keylist = [];
    }
    console.log(lastkey,keylist);
    lastkey = event.key;
});
// (2^3)-(1*3)
