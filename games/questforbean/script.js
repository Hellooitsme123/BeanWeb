function byId(id) {
    return document.getElementById(id);
}
console.log("script.js loaded");
if (randNum(1,100) == 100) {
    byId("menu").style.backgroundImage = "url('img/background/background2.png')";
}
// battle
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
var eventText = byId("battle-event");
var eventTextDisplayTimeout;
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
var skippedAlt = false;
var ultrawrap = byId("ultrawrapper");
var ultrawrapimg= byId("ultrawrapperimg");
var invspecial = byId("inventoryspecialtext");
// adventure screen
var curoverview = byId("currentoverview");
var curloctxt = byId("curloc");
var curlocdesctxt = byId("curlocdesc");
//main, specials
var loretxt = byId("loretext");
var proceedtxt = byId("proceed");
var proceeddesc = byId("proceeddesc");
var travelbtn = byId("travel");
var focusedSpecial = null;
var specialdiv = byId("special");
var specialdiv2 = byId("special2");
// offers
var offerwrapper = byId("offer-wrapper");
var cardoffer = byId("cardoffer");
var offeredCard = {};
var relicoffer = byId("relicoffer");
var offeredRelic = "";
var statsdiv = byId("plrstats");
var inventorydiv = byId("plrinventory");
var inventorytable;
var relicdiv = byId("plrrelics"); //
var itemdiv = byId("plritems");
var relictable;
var itemtable;
var speciallock = false;
var speciallock2 = false;
var curspecials = {};
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
var unlocksLoaded = false;
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
        mods: [],
        skills: [],
        // battlestats
        health: 300,
        mana: 10,
        discards: 1,
        inventory: {},
        inventoryorder: [],
        items: {},
        deck: {},
        battledeck: {},
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
        inventoryorder: [],
        deck: {},
        battledeck: {},
        mods: [],
    },
};
var turn = Game.turn;


/* COOL LANGUAGE:

randKey(cards)[??WHERE@return.obtainable!=false~~];



*/
var importantoknowledgo = ["The select mode allows you to do more strategic moves.","Spearmen's lives are not worthless. They will get angered once destroyed enough..","Energy capsule gives charger multiplied damage.","Donating 100 or more coins to Greg might cause him to join your side.","The watch is not useless. Maybe buy it more.."];

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
var emtitle = byId("event-modal-tab1-header");
var magnify_on = false;
var template = {
    formalname: "",
    health: 300,
    mana: 10,
    discards: 1,
    inventory: {},
    deck: {},
    battledeck: {},
}
var loadedUnlocks = "";
var currentUnlocks = "";
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
                set: ["roadtocoda3","danceclub","mysteryfight","mysteryloc","danceclub2","djneonvictory","danceclubbasement","mysteryloc2","power","mysteryloc3","danceclubexit","hotel","mysteryfight2","unclerictorappear","mysteryloc4"],
                mysteryfight: ["helloitsmeappear,helloitsmevictory","danceclubsign,fakecoinsvictory"],
                mysteryloc: ["beancandispenser","neonrobot","slotmachine","none"],
                mysteryloc2: ["danceclubroof","danceclubspill"],
                power: ["power_discard","power_mana"],
                mysteryloc3: ["collectorshut","none"],
                mysteryfight2: ["beanfactory,cheesedinovictory","beanfactory2"],
                mysteryloc4: ["securityguard","shippingsector","tastetestingsector"],
            },
            stage2a: {
                name: "BurntFactory",
                set: ["burningfactory"],
            },
            stage3: {
                name: "LordKSearch",
                set: ["mysteryloc","roadtocoda4","mysteryfight","lordkarena","lordkvictory","roadtocoda5","roadtocoda6","mysteryloc2","trafficlordappear","trafficlordvictory"],
                mysteryloc: ["strangealtar","unclemanstatue","none"],
                mysteryloc2: ["crowattack","cardtornado","none"],
                mysteryfight: ["forest1,banditsvictory","leafo,leafovictory"/*,"forestclearing,forestcastle,wisespiritsvictory"*/,"forest1,banditsvictory","leafo,leafovictory","forestclearing,forestcastle,wisespiritsvictory","lostcave"],
            },
        },
    },
    2: {
        name: "Coda",
        stages: {
            stage1: {
                name: "CodaCity",
                set: ["coda","hotel2","jamodarcards","jamodarcards2","mysteryloc","madmechanicappear","madmechanicvictory","jamodarcards3","jamodarcardsroof","mysteryloc2","ancientlibrary","constructionsite","mysteryloc3","stoneguardianappear","stoneguardianvictory","pathnorth"],
                // stoneguardian could possibly be mysteryfight
                mysteryloc: ["jamodarcardsvendingmachine","jamodarcardsdealer"],
                mysteryloc3: ["bridge","maskedpeople"],
                mysteryloc2: ["collectorshut","none"],
            },
            stage1a: {
                name: "AncientLibrary",
                set: ["ancientlibrary1","moneymagic","mysteryfight","knowledge"],
                mysteryfight: ["cursedtome,cursedtomevictory","owllibrarian,owllibrarianvictory"],
            },
            stage2: {
                name: "FiloFields",
                set: ["pathnorth2","filofields","mysteryfight","mysteryloc","filoriver","filocenter","filomeats","filodesert","redstarburstappear","redstarburstvictory","mysteryloc2","darkwaystone"],
                mysteryfight: ["grasslurker,grasslurkervictory"],
                mysteryloc: ["strongwinds"],
                mysteryloc2: ["crimsonpedestal","lostexplorer"],
            },
            stage2a: {
                name: "LodaFortress",
                set: [],
            },
            stage3: {
                name: "Feebole",
                set: ["feeboledocks","fisherappear","fishervictory","strangetunnel","miningstore","cashiervictory"],
            },
            stage3a: {
                name: "FeeboleMines",
            },
            stage3b: {
                name: "MysticForest"
            },
        },
    },
    3: {
        name: "Jarj",
    }
};
var keywords = ["anyshops","mysteryloc","mysteryloc2","mysteryloc3","mysteryloc4","mysteryfight","mysteryfight2","testfight"];
var locationsarr = [];
var curlocationindex = 0;
var curlocationstage =1;
var curlocationpart = 1;
var curlocation;

function createLocations() {
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
    curlocation = locations[locationsarr[curlocationindex]];
    byId("locationsarr_show").innerHTML = locationsarr.join(" ");
}

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
        if (locationsarr[curlocationindex] == "power") {
            if (!hasItem("p1","power",1)) {
                curlocationindex++;
            } else {
                locationsarr[curlocationindex] = randItem(locationplacing[curlocationstage].stages['stage'+curlocationpart].power)
            }
        }
        curlocation = locations[locationsarr[curlocationindex]];
    } else {
        if (!tryAccess(locationplacing[curlocationstage].stages,"stage"+(curlocationpart+1))) {
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
    byId("locationsarr_show").innerHTML = locationsarr.join(" ");
    
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
var shopcards = structuredClone(cards);
// add special attributes
for (let i = 0; i < Object.keys(cards).length; i++) {
    let card = cards[Object.keys(cards)[i]];
    let card2 = shopcards[Object.keys(shopcards)[i]];
    card.level = 0;
    card.effects = {};
    card.cardmods = [];
    card2.level = 0;
    card2.effects = {};
    card2.cardmods = [];
}
function changePropertiesByQuery(obj,query) {
    if (query.split("?").length > 1) {
        let attributes = query.split("?")[1];
        let attributeList = attributes.split(";");
        for (let j = 0; j < attributeList.length; j++) {
            let attributeName = attributeList[j].split("=")[0];
            let attributeValue = attributeList[j].split("=")[1];
            if (attributeName == "level") {
                if (Object.hasOwn(obj,"level") == false) {
                    obj.level = 0;
                }
                obj = lib.levelUp(obj,attributeValue);
                continue;
            } 
            obj[attributeName] = morphType(attributeValue);
        }
    }
    return obj;
}
// ENEMY DECK CREATION
for (let k =0; k < Object.keys(enemies).length; k++) {
    let zeopp = enemies[Object.keys(enemies)[k]];
    for (let i = 0; i<zeopp.simpledeck.length; i++) {
        let query = zeopp.simpledeck[i];
        let cardName = query.split("?")[0];
        let tempCard = structuredClone(cards[cardName]);
        tempCard.level = 0;
        // prevents the card's stats from actually being affected
        tempCard = changePropertiesByQuery(tempCard,query);
        /*if (query.split("?").length > 1) {
            let attributes = query.split("?")[1];
            let attributeList = attributes.split(";");
            for (let j = 0; j < attributeList.length; j++) {
                let attributeName = attributeList[j].split("=")[0];
                let attributeValue = attributeList[j].split("=")[1];
                tempCard[attributeName] = morphType(attributeValue);
            }
        }*/
        
        drawCard(zeopp,true,tempCard,["setcard","oppAddToDeck","specialp"]);
        zeopp.battledeck = structuredClone(zeopp.deck);
    }
    zeopp.relics = {};
    for (let i =0; i <tryAccess(zeopp,"simplerelics",[]).length; i++) {
        let query = zeopp.simplerelics[i];
        let relicName = query.split("?")[0];
        let tempRelic = structuredClone(relics[relicName]);
        tempRelic = changePropertiesByQuery(tempRelic,query);
        zeopp.relics[relicName] = tempRelic;
    }
}

var reloading = false;
var battletext = byId("battletext");
var keynames = ["name","formal","atk","hp","manause","ammo","maxammo","cool","coolleft","type","heal","uses","obtainable","storedmana","sound","level","stat","statdesc","cost","subtypes","shock","poison"];
var keyformal = ["Name","Formal Name","Attack","Health","Mana Use","Ammo","Maximum Default Ammo","Cooldown","Starting Cooldown","Card Type","Heal","Uses","Obtainable By Drawing Cards","Stored Mana","Sound","Level","Stat","Stat Description","Cost","Card Types","Shock","Poison"];
var openBtn = document.querySelectorAll(".open-modal-btn");
var modal = document.querySelectorAll(".modal-overlay");
var closeBtn = document.querySelectorAll(".close-modal-btn");
var modalContent = byId("modal-content");
//modal.classList.add("hide");
function openModal(e) {
    byId(e.target.getAttribute("data-target")).style.background = "rgba(0,0,0,0.7)";
    byId(e.target.getAttribute("data-target")).style.top = "0px";
    byId(e.target.getAttribute("data-target").replace("-overlay","-wrapper")).style.top = "50%";
    /*if (backpackactive) {
        backpackToggle();
    }*/
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
    if (typeof evt == "string") {
        byId(evt).className += " active";
    } else {
        evt.currentTarget.className += " active";
    }
    
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
        if (elem.id == "magnify" && !magnify_on) {
            magnify_on = true;
            elem.style.border = "2px solid black";
            elem.style.background = "orange";
            elem.style.boxShadow = "0px 0px 5px 2px orange";
            return;
        } else if (elem.id == "magnify" && magnify_on) {
            magnify_on = false;
            elem.style.border = "none";
            elem.style.background = "slateblue";
            elem.style.boxShadow = "0px 0px 5px 2px rgb(112, 106, 162)"
        }
        byId(e.target.getAttribute("data-target")).classList.remove("hide");
        
        window.setTimeout(openModal,1,e);
    });
}
function magnify(card) {
    magnify_on = false;
    byId("magnify").style.border = "none";
    byId("magnify").style.background = "slateblue";
    byId("magnify").style.boxShadow = "0px 0px 5px 2px rgb(112, 106, 162)"
    byId(byId("magnify").getAttribute("data-target")).classList.remove("hide");   
    openTab("overview-tablink","overviewtab") 
    byId("magnify-overlay").style.background = "rgba(0,0,0,0.7)";
    byId("magnify-overlay").style.top = "0px";
    byId("magnify-wrapper").style.top = "50%";
    displayCard(byId("magnify-overview-display"),card);
    byId("magnify-name").innerHTML = card.formal;
    byId("magnify-desc").innerHTML = card.desc;
    byId("magnify-stats").innerHTML = "";
    Object.keys(card).forEach(function (key) {
        let val = card[key];
        let keyindex = keynames.indexOf(key);
        if (keyindex != -1) {
            let formalkeyname = keyformal[keyindex];
            if (key != "funnyname" && key != "desc" && key != "img") {
                byId("magnify-stats").innerHTML += formalkeyname+": "+val+"<br>";
            }
            // use val
        }
        
    });
    let cardUpgradesList = card.upgrades;
    console.log(cardUpgradesList);
    clearChildren(byId("magnify-upgrades-wrapper"));
    let advdesc = document.createElement("h4");
    advdesc.innerHTML = tryAccess(card,"advdesc","");
    byId("magnify-upgrades-wrapper").appendChild(advdesc);
    for (let i =0; i < Object.keys(cardUpgradesList).length; i++) {
        let cardUpgrade = cardUpgradesList[i+1];
        let upgradeDiv = document.createElement("div");
        let h2 = document.createElement("h2");
        let h4 = document.createElement("h4");
        let h4a = document.createElement("h4");
        let p = document.createElement("p");
        if (card.level > i) {
            h2.style.color = "limegreen";
            h2.style.fontWeight = "bolder";
        }
        h2.innerHTML = `Level ${i+1}: ${tryAccess(cardUpgrade,"name","")}`;
        h4.innerHTML = cardUpgrade.desc;
        h4a.innerHTML = "Cost: "+cardUpgrade.cost;
        for (let j = 0; j <cardUpgrade.stats.length;j++) {
            let stat = cardUpgrade.stats[j];
            let parity;
            if (stat[1] < 0) {
                parity = "";
            } else {
                parity = "+";
            }
            let key = stat[0];
            let keyindex = keynames.indexOf(key);
            if (keyindex != -1) {
                let formalkeyname = keyformal[keyindex];
                if (key != "funnyname" && key != "img") {
                    p.innerHTML += formalkeyname+`-> ${parity}`+stat[1]+"<br>";
                }
                // use val
            }
        }
        upgradeDiv.appendChild(h2);
        upgradeDiv.appendChild(h4);
        upgradeDiv.appendChild(h4a);
        upgradeDiv.appendChild(p);
        console.log(upgradeDiv.innerHTML);
        byId("magnify-upgrades-wrapper").appendChild(upgradeDiv);
    }
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
/**
 * Gets the first element in an array with the given substring
 * @param {Array} arr 
 * @param {String} substr 
 * @returns {*} Item from array with given substring
 * @example const arr = ["hello","jello","he","jeopardy"];
 * arrFirst(arr,"je") -> returns "jello"
 */
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
    if (Object.keys(p1.relics).includes("lightningbean")) {
        for (let i = 0; i < p1.inventoryorder.length; i++) {
            let chosen = p1.inventory[p1.inventoryorder[i]];
            chosen.coolleft = 0;
        }
    }
    p1.drawarr = sample(Object.keys(p1.battledeck),Object.keys(p1.battledeck).length);
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
 * @param {{s:Number,t:Number}} attr -> Object with all the attributes
 * @param {*} u -> upgrade or not
 * @param {Object} uattr -> Object with all the attributes that you WANT to change
 * 
 * Adds given effect effectname{s,t} to card. If effect is already present, boolean u decides whether or not to scale onto the effect -> effectname{cs+1,ct+t}
 * @example addEffect(card,"Poison",{s:1,t:2},false)
 * // Adds Poison{1,2} to the opponent card. If card already has, then do nothing.
 * @example addEffect(card,"Burn",{s:1,t:2},true,{s:1})
 * // Adds Burn{1,2} to card. If card already has, increase the scale by 1.
 */
function addEffect(card,effectname,attr,u=false,uattr={s:1,t:1}) {
    if (Object.hasOwn(card.effects,effectname) && u == true) {
        let effect = card.effects[effectname];
        for (let attr in uattr) {
            let val = uattr[attr];
            if (typeof val == "number") {
                effect[attr] += val;
            } else {
                effect[attr] = val;
            }
        }
    }
    if (!tryAccess(card.effects,effectname)) {
        let effect = structuredClone(effects[effectname]);
        effect.attr = attr;
        card.effects[effectname] = effect;
        // by default, the attr goes like this: effect: {attr: {s: number, t: number}}
    }
    return card;
}
function addMod(player,mod,attr) {
    if (arrHas(Game[player].mods,mod)) {
        let oldMod = arrFirst(Game[player].mods,mod);
        Game[player].mods.splice(Game[player].mods.indexOf(oldMod),1);
        Game[player].mods.push(increaseModifier("Norm",oldMod,attr));
    } else {
        Game[player].mods.push(mod+"{"+attr.toString()+"}")
    }
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
    elem.style.width = "140px";
    elem.style.height = "160px";
    if (window.matchMedia("(max-width:950px)").matches) {
        elem.style.width = "126px";
        console.log(elem.style.width);
        elem.style.height = "144px";
    }
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
        if (Object.keys(card.effects).length > 0) {
            elem.innerHTML += "<br>";
            for (let effect in card.effects) {
                elem.innerHTML += card.effects[effect].formal+" "+card.effects[effect].attr.s;
                if (Object.keys(card.effects).length > 1) {
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
        elem.style.position = "relative";
        let imgwrapper = document.createElement("img");
        elem.appendChild(imgwrapper);
        imgwrapper.addEventListener("error",() => {
            imgwrapper.style.display = 'none';
        });
        imgwrapper.style.position = "absolute";
        imgwrapper.style.top = "0";
        imgwrapper.style.left = "0";
        imgwrapper.style.width = "140px";
        imgwrapper.style.height = "160px";
        if (window.matchMedia("(max-width:950px)").matches) {
            imgwrapper.style.width = "126px";
            imgwrapper.style.height = "144px";
        }
        imgwrapper.style.zIndex = "-100";
        imgwrapper.style.opacity = "0.8";
        imgwrapper.alt = "";
        imgwrapper.src = `img/cards/${tryAccess(card,"img",card.name).replace('.png','')}.png`;
        let tempimg = "url()";
        if (card.img != "") {
            //tempimg = "url(img/cards/"+card.name+".png)";  
            
            elem.style.backgroundSize = "140px 160px";
            if (window.matchMedia("(max-width:950px)").matches) {
                elem.style.backgroundSize = "126px 144px";
            }
            if (card.name == "oblivion" && card.manause == 0.5 && card.cool == 1) {
                tempimg = "url('img/cards/enragedoblivion.png')";
            }
            
        }
        for (let effect in card.effects) {
            let data = card.effects[effect];
            if (Object.hasOwn(data,"img")) {
                tempimg += `, url(img/foils/${data.img})`;
            }
        }
        /*if (Object.hasOwn(card.effects,"Camouflaged")) {
            tempimg += ", url(img/foils/camofoil.png)";
        }
        if (Object.hasOwn(card.effects,"Frozen")) {
            tempimg += ", url(img/foils/frostfoil.png)";
        }
        if (Object.hasOwn(card.effects,"Confused")) {
            tempimg += ", url(img/foils/confusedfoil.png)";
        }
        if (Object.hasOwn(card.effects,"Burning")) {
            tempimg += ", url(img/foils/burningfoil.png)";
        }
        if (Object.hasOwn(card.effects,"Stunned")) {
            tempimg += ", url(img/foils/stunnedfoil.png)";
        }
        if (Object.hasOwn(card.effects,"Guarded")) {
            tempimg += ", url(img/foils/guardedfoil.png)";
        }
        if (Object.hasOwn(card.effects,"Shock")) {
            tempimg += ", url(img/foils/shockfoil.png)";
        }
        if (Object.hasOwn(card.effects,"Fear")) {
            tempimg += ", url(img/foils/fearfoil.png)";
        }
        if (Object.hasOwn(card.effects,"Death")) {
            tempimg += ", url(img/foils/deathfoil.png)";
        }*/
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
    
    elem.innerHTML = "<span class='title'>"+relic.formal+":</span><br>"+relic.rarity+" RARITY | ";
    elem.innerHTML += "<br><hr><span class='desc'>"+relic.desc+"</span>";
    let tempimg;
    if (relic.img != "") {
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
    let secretdesc ="";
    if (tryAccess(p1.relics,"knowledgejar",false) != false) {
        secretdesc = `<br><i>${tryAccess(relic,"secretdesc",'')}</i>`;
    }
    let zehtml = `<h3 style="font-size:22px;margin:0;">${relic.formal}</h3><p style="font-size:14px;">${relic.desc}<br><br>${relic.advdesc}<br><br>Current relic stats: ${relic.attr.toString()}${secretdesc}</p>`;
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
// BATTLE TEXT
/**
 * Phases text in/out, requiring text as it decreases/increases font size
 * @param {HTMLElement} elem Which element to fade
 * @param {Boolean} show Whether or not the text shows. True: fade the text in. False: fade out the text 
 */
function phaseText(elem,show) {
    let previousFontSize = elem.style.fontSize;
    let previousTransition = elem.style.transition;
    if (show) {
        
        elem.style.fontSize = 0; // display
        elem.style.opacity = 0;
        if (elem.style.display == "none") {
            elem.style.display = "block" // maybe allow an option to change this?
        }
        elem.style.transition = '0.5s ease-in-out';
        elem.style.opacity = 1;
        elem.style.fontSize = previousFontSize;
        window.setTimeout(function() {
            elem.style.transition = previousTransition;
        },800);
    } else {
        elem.style.opacity = 1;
        if (elem.style.display == "none") {
            elem.style.display = "block" // maybe allow an option to change this?
        }
        elem.style.transition = '0.5s ease-in-out';
        elem.style.opacity = 0;
        elem.style.fontSize = 0; // display
        
        window.setTimeout(function() {
            elem.style.display = "none";
            elem.style.transition = previousTransition;
            elem.style.fontSize = previousFontSize;
        },800);
    }
}
function showEventText(text,style) {
    let elem = document.createElement("p");
    elem.innerHTML = text;
    elem.style = eventTextStyles[style].style;
    byId("battle-events").appendChild(elem);
    phaseText(elem,true);
    window.setTimeout(phaseText,3000,elem,false);
    /*eventText.style = '';
    if (eventText.style.display == 'none') {
        eventText.innerHTML = text;
        eventText.style = eventTextStyles[style].style;
        phaseText(eventText,true);
        eventTextDisplayTimeout = window.setTimeout(phaseText,3000,eventText,false);
    } else {
        clearTimeout(eventTextDisplayTimeout);
        eventText.innerHTML = text;
        eventText.style = eventTextStyles[style].style;
        eventTextDisplayTimeout = window.setTimeout(phaseText,3000,eventText,false);
    }*/
}


// BATTLE FUNCTIONS


function checkDead() {
    if (p1.health < 1) {
        resetBattleUI();
        fullSD(gamescreen,menuscreen,"none","block");
        fullSD(adventurescreen,menuscreen,"none","block");
        fullSD(startmodsscreen,menuscreen,"none","block");
        sob = 2;
        //window.setTimeout(enterAdventureScreen,200);
        gametitle.innerHTML = "You Lose..";
        playbtn.innerHTML = "RESTART";
        for (let i in openBtn) {
            console.log(openBtn[i].style);
            openBtn[i].style.display = "none";
        }
        
    }
}
/**
 * 
 * @param {Object} player 
 * @param {String} relic 
 * @param {*} changes 
 */
function addRelic(player,relic,changes=null) {
    let plr = Game[player];
    if (Object.hasOwn(plr.relics,relic)) {
        if (plr.relics[relic].attrtype == "arrup") {
            for (let i = 0; i < plr.relics[relic].attr.length; i++) {
                plr.relics[relic].attr[i] += relics[relic].attrincrease[i];
            }
        }
        if (plr.relics[relic].attrtype == "int") {
            plr.relics[relic].attr += relics[relic].attrincrease;
            if (relic == "lifecapsule") {
                plr.maxhealth += 20;
                plr.health += 20;
            }
            if (relic == "trashcan") {
                plr.maxdiscards += 0.5;
                plr.discards += 0.5;
            }
            if (relic == "blueprint") {
                plr.startingmana += 0.5;
            }
        }
        let list = ["thundercrate","frostyhorn","hammerhammer"]
        if (list.includes(relic)) {
            plr.coins += Number(element.getAttribute("data-cost"));
        }
    }else {
        Game[player].relics[relic] = structuredClone(relics[relic]);
        if (relic == "lifecapsule") {
            plr.maxhealth += 60;
            plr.health += 60;
        }
        if (relic == "trashcan") {
            plr.maxdiscards += 1;
            plr.discards += 1;
        }
        if (relic == "soullantern") {
            p1.startingmana += 1;
        }
        if (relic == "blueprint") {
            plr.startingmana += 1;
        }
    }
    if (relic == "watch" && plr.relics[relic].attr > 1) {
        drawCard(player,true,"drawback",["addToDeck"]);
        invspecial.innerHTML = "A strange new card has manifested..";
    }
    
    if (changes) {
        Game[player].relics[relic].attr = changes;
    }
}
/**
 * Adds item to player's inventory
 * @param {Object} player Player that gains item
 * @param {String} item Name of item
 * @param {*} attr Item attributes
 */
function addItem(player,item,attr) {
    if (tryAccess(Game[player].items,item) != false) {
        if (attr) {
            if (Array.isArray(attr) == false) {
                Game[player].items[item].attr += attr;
            } else {
                for (let i = 0; i < attr.length; i++) {
                    Game[player].items[item].attr[i] += attr[i];
                }
            }
            
        }
    } else {
        Game[player].items[item] = structuredClone(items[item]);
        if (attr) {
            if (Array.isArray(attr) == false) {
                Game[player].items[item].attr += attr;
            } else {
                for (let i = 0; i < attr.length; i++) {
                    Game[player].items[item].attr[i] += attr[i];
                }
            }
            
        }
    }
    
}
/**
 * Removes (attr of) item to player's inventory
 * @param {Object} player Player that gains item
 * @param {String} item Name of item
 * @param {*} attr Item attributes (to remove)
 */
function removeItem(player,item,attr) {
    if (tryAccess(player.items,item) != false) {
        if (Array.isArray(attr) == false) {
            Game[player].items[item].attr -= attr;
            if (Game[player].items[item].attr <= 0) {
                delete Game[player].items[item];
            }
        } else {
            let all0 = true;
            for (let i = 0; i < attr.length; i++) {
                Game[player].items[item].attr[i] -= attr[i];
                if (Game[player].items[item].attr[i] > 0) {
                    all0 = false;
                }
            }
            if (all0 == true) {
                delete Game[player].items[item];
            }
        }
    }
}
function hasItem(player,item,attr) {
    if (tryAccess(Game[player].items,item) != false) {
        if (Array.isArray(attr) == false) {
            if (Game[player].items[item].attr >= attr) {
                return true;
            }
            return false;
        } else {
            for (let i = 0; i < attr.length; i++) {
                if (Game[player].items[item].attr[i] <= attr[i]) {return false;}
            }
            return true;
        }
    }
}
/**
 * Draws a card for a specific player using a variety of arguments
 * @param {"p1"|"p2"} player Player that draws the card 
 * @param {Boolean} specific If the card is specific or not
 * @param {String|Card} choice The chosen card to draw, use Card only if otherargs has setcard
 * @param {Array|String} otherargs Extra options
 * @returns 
 * @example drawCard("p1",true,"flamethrower",["query?cool=0"]) // Draws a flamethrower to inventory with cooldown 0
 * @example drawCard("p2",true,cards.bubblemancer,["setcard","query?manause=2","addToDeck"]) // Adds a bubblemancer with manause 2 to p2's deck. 
 */
function drawCard(player,specific = false,choice = null,otherargs = ["None"]) {
    // SPECIAL HANDLING
    let chosenkey = cards[choice];
    let key = {};
    if (otherargs.includes("specialp")) {
        if (!otherargs.includes("setcard")) {
            assign(key,chosenkey);
            key.effects = {};
            key["cardmods"] = [];
        }
    }
    if (otherargs.includes("setcard")) {// set card allows SPECIFIC card to be chosen, with custom attributes. below changes like reloading do not factor in
        key = choice;
    }
    
    if (otherargs.includes("oppAddToDeck")) {
        let table = "deck";
        if (!otherargs.includes("specialp")) {
            player = Game[player];
        }
        if (Object.hasOwn(player[table],key.name)) {
            let i2 = 0;
            do {
                i2++;
            } while (i2 <1000 && Object.hasOwn(player[table],key.name+i2));
            
            if (Object.hasOwn(player[table],key.name+i2) == false) {
                player[table][key.name+i2] = key;
                player[table][key.name+i2].source = key.name+i2;
            }
        } else {
            player[table][key.name] = key;
            player[table][key.name].source = key.name;
        }
        return false;
    } else if (otherargs.includes("oppAddToDeck")) {
        let table = "inventory";
        if (!otherargs.includes("specialp")) {
            player = Game[player];
        }
        if (Object.hasOwn(player[table],key.name)) {
            let i2 = 0;
            do {
                i2++;
            } while (i2 <1000 && Object.hasOwn(player[table],key.name+i2));
            
            if (Object.hasOwn(player[table],key.name+i2) == false) {
                player[table][key.name+i2] = key;
            }
        } else {
            player[table][key.name] = key;
        }
    }
    // MAIN ARGUMENTS
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

    chosenkey = randKey(Game[player].battledeck); // gets random key from player's deck andadds it to the deck
    if (otherargs[0] == "None" && player == "p1") {
        chosenkey = p1.deck[p1.drawarr[p1.drawarrindex]];
        chosenkey.source = p1.drawarr[p1.drawarrindex]; // original card name
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
    }
    assign(key,chosenkey); // assign the values
    key.effects = {};
    if (otherargs.includes("addToDeck")) { 
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
            Game[player].inventoryorder.push(key.name+i2);
            if (table == "deck") {
                Game[player][table][key.name+i2].source = key.name+i2;
            }
            if (table == "inventory") {
                Game[player][table][key.name+i2].invsource = key.name+i2;
            }
            
        }
    } else {
        Game[player][table][key.name] = key;
        if (table == "deck") {
            Game[player][table][key.name].source = key.name;
        }
        if (table == "inventory") {
            Game[player][table][key.name].invsource = key.name;
        }
    }
    if (otherargs.includes("addToDeck") || otherargs.includes("ignoreReload")) {
        key["cardmods"] = [];
    }
    if (Array.isArray(otherargs) && otherargs.length > 0) {
        if (arrHas(otherargs,"query")) {
            key = changePropertiesByQuery(key,arrFirst(otherargs,"query"));
        }   
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
            key.hp = Math.round(key.hp);
            if (tryAccess(key,"atk")) { key.atk = Math.round(key.atk);}
            if (tryAccess(key,"heal")) {key.heal = Math.round(key.heal);}
            
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
                if (tryAccess(tempchosen.effects,"guarded") == false) {
                    chosen = tempchosen;
                    break;
                }
            }
            if (chosen == null) {
            } else {
                addEffect(chosen,"guarded",{s:1,t:5});
            }
        }
        // sandstorms gain stat health
        for (let i = 0; i < Object.keys(Game[player].inventory).length; i++) {
            let chosen = Game[player].inventory[Object.keys(Game[player].inventory)[i]]; // chosen card 
            if (chosen.name == "sandstorm") {
                chosen.hp += chosen.stat;
            }
        }
        if (key.name == "sandstorm") {
            key.hp -= key.stat;
        }
        
        if (Game[player].mods.some(str => str.includes("QuickUse"))) {
            let str = Game[player].mods.filter(str => str.includes("QuickUse"))[0];
            str = str.replace("QuickUse{","");
            str = Number(str.replace("}",""));
            if (tryAccess(key,"coolleft") && key.coolleft != 0) {
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
/**
 * Returns a formatted version of the effect, like values or names
 * @param {"FlatEffect"|"Attributes"} type FlatEffect - Gets the name. Attributes - returns the attributes as an array 
 * @param {*} effect Given effect to format
 * @returns 
 */
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
    // handle inventoryorder
    p1.inventoryorder = Object.keys(p1.inventory);
    p2.inventoryorder = Object.keys(p2.inventory);

    // MAIN
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
    for (let i =0; i < p1.inventoryorder.length;i++) {
        let card = p1.inventory[p1.inventoryorder[i]];
        if (hasItem("p1","stonefish",1)) {
            if (card.hp <= 40 && !Object.hasOwn(card.effects,"regeneration")) {
                card.coolleft += 1;
                addEffect(card,"regeneration",{s:20,t:2});
            }
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
            if (curObject.hasOwn(card.effects,"Camouflaged")) {
                tempimg += ", url(img/foils/camofoil.png)";
            }
            if (curObject.hasOwn(card.effects,"Frozen")) {
                tempimg += ", url(img/foils/frostfoil.png)";
            }
            if (curObject.hasOwn(card.effects,"Confused")) {
                tempimg += ", url(img/foils/confusedfoil.png)";
            }
            if (curObject.hasOwn(card.effects,"Burning")) {
                tempimg += ", url(img/foils/burningfoil.png)";
            }
            if (curObject.hasOwn(card.effects,"Stunned")) {
                tempimg += ", url(img/foils/stunnedfoil.png)";
            }
            if (curObject.hasOwn(card.effects,"Guarded")) {
                tempimg += ", url(img/foils/guardedfoil.png)";
            }
            if (curObject.hasOwn(card.effects,"Shock")) {
                tempimg += ", url(img/foils/shockfoil.png)";
            }
            if (curObject.hasOwn(card.effects,"Fear")) {
                tempimg += ", url(img/foils/fearfoil.png)";
            }
            if (curObject.hasOwn(card.effects,"Death")) {
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
    p1.battledeck = structuredClone(p1.deck);
    ultrawrapimg.src = "img/background/"+zeopp.fightimg;
    assign(Game.p2,zeopp);
    Game.p2.inventoryorder = [];
    if (!tryAccess(Game.p2,"skills")) {
        Game.p2.skills = [];
    }
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
    p2.health = Math.round(p2.health);
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
    // ITEMS
    for (let i = 0; i < Object.keys(p1.items).length; i++) {
        let item = p1.items[Object.keys(p1.items)[i]];
        if (item.attrname == "Battles Left") {
            item.attr -= 1;
            if (item.attr < 0) {
                delete p1.items[Object.keys(p1.items)[i]];
            }
            if (item.name == "flaming") {
                addMod("p1","FlameTouch",[2,2]);
            }
            if (item.name == "fullstomach") {
                addMod("p1","Strength",20);
                addMod("p1","QuickUse",1);
            }
            if (item.name == "moneymagic") {
                p1.mana += Math.round(p1.coins/4);
                p1.coins = Math.round(p1.coins*3/4);
            }
        }
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
        byId("changelog-btn").style.display = "none";
        let enemy = enemies[p2.name];
        p1.coins += Math.round((randNum(7,15)/10)*(enemy.health/10));
        p1.coins += enemy.coinsgive;
        console.log("hello",p1.coins,enemy.coinsgive)
        if (Object.hasOwn(p1.relics,"coinsack")) {
            p1.coins += Math.round((randNum(10,20)/10)*(enemy.health/10)*p1.relics.coinsack.attr);
        }
        //enemy.managain *= 1.5;
        //enemy.health *= 1.5;
        //enemy.mana *= 1.5;
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
        if (enemy.name == "janjo" && arrHas(Object.keys(p1.deck),"flamethrower")) {
            addUnlock("c1");
        } 
    }
    if (outcome == 2) {
        resetBattleUI();
        fullSD(gamescreen,menuscreen,"none","block");
        sob = 2;
        //window.setTimeout(enterAdventureScreen,200);
        gametitle.innerHTML = "You Lose..";
        playbtn.style.display ="none";
        //playbtn.innerHTML = "RESTART";
        byId("changelog-btn").style.display = "none";
    }
    // ITEMS
    for (let i = 0; i < Object.keys(p1.items).length; i++) {
        let item = p1.items[Object.keys(p1.items)[i]];
        if (item.attrname == "Battles Left") {
            if (item.attr <= 0) {
                delete p1.items[Object.keys(p1.items)[i]];
            }
        }
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
            if (tryAccess(plr.inventory[plr.inventoryorder[i]]) == false) {
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
/**
 * Calculates all effects and events when a player's turn ends.
 * @param {*} player The player that just ended their turn
 */
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
        showEventText("DEATH MODE!","deathmode");
    }
    let plr;
    let opp;
    if (player == "p1") {
        plr = p1;
        opp = p2;
        reloading = false;
        battletext.innerHTML = "Next Card: "+p1.drawarr[p1.drawarrindex];
        let addSuccess =false;
        let tries = 0;
        do {
            tries += 1;
            let cardToDraw = randItem(Object.keys(p1.battledeck));
            let chosen = p1.deck[cardToDraw];
            if (arrHas(p1.inventoryorder,cardToDraw)) {
                if (tryAccess(chosen,"exhaust") == true) {
                    continue;
                }
            }
            p1.drawarr.push(randItem(Object.keys(p1.battledeck)));
            addSuccess = true;
        } while (addSuccess == false && tries <= 20);
        
        
    } else {
        plr = p2;
        opp = p1;
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
                        addEffect(card,"shock",{s:2,t:2});
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
                addEffect(card,"burning",{s:1,t:1});
            }
        }
        playAudio("sounds/burn.mp3");
    }
    if (plr.name == "djneon" && turns % 4 == 0) {
        for (let i = 0; i < 3; i++) {
            let card = randKey(p1.inventory);
            if (card != null) {
                addEffect(card,"stunned",{s:1,t:2});
            }
        }
        showEventText("Cards Stunned!","stun");
    }
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
                    addEffect(card,"death",{s:1,t:2});
                    card.hp -= 10;
                }
            }
            // PRASKIM'S ABILITY
        } 
    }
    if (plr.name == "lordk" && turns % 4 == 0) {
        showEventText("METEOR SLAM!!","danger")
        for (let i = 0; i < 4; i++) {
            let card = randKey(p1.inventory);
            if (card != null) {
                addEffect(card,"stunned",{s:1,t:2});
                card.hp -= randNum(10,30);
            } else {
                p1.health -= 30;
            }
        }
        playAudio("sounds/bash.mp3");
        p1.health -= randNum(10,20);
        p1.mana -= 3;
        if (p1.mana < 0) {
            p1.mana = 0;
        }
    }
    if (plr.name == "trafficlord" && randNum(1,3) == 3) {
        let card = randKey(p1.inventory);
        if (card) {
            card.coolleft += 2;
            showEventText(`${card.formal} Slowed!`,"danger");
        }
        
    }
    if (plr.name == "trafficlord" && randNum(1,10) == 10 && Object.keys(p1.battledeck).length > 1) {
        let card = randKey(p1.battledeck);
        if (card) {
            let key = getKeyByValue(p1.battledeck,card);
            showEventText(`${card.formal} Disabled From Battle!`,"danger");
            delete p1.battledeck[key];
        } 
        
        
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
        // EFFECT HANDLE
        for (let effect in zecard.effects) {
            let data = zecard.effects[effect];
            let attr = data.attr;
            // s == scale; t == timeleft
            if (effect == "burning") {
                if (player == "p1" && Object.keys(p1.relics).includes("flamebean")) {
                    let chosenReflect = opp.inventory[randItem(opp.inventoryorder)];
                    addEffect(chosenReflect,"burning",{s:attr.s,t:attr.t*2},true,{s:attr.s,t:attr.t*2});
                    zecard.hp += Number(attr.s)*8; // cancels out damage done
                    attr.t = 0;
                }
                zecard.hp -= Number(attr.s)*8;
                if (zecard.cardmods.includes("infernalfoil")) {
                    zecard.hp += Number(attr.s)*14;
                }
            }
            if (effect == "shock") {
                zecard.hp -= 15*attr.s;
                if (Object.hasOwn(zecard,"atk")) {
                    zecard.atk *= 1.2;
                    zecard.atk = Math.round(zecard.atk);
                }
            }
            if (effect == "frozen") {
                zecard.hp -= Number(attr.s)*15;
                if (Object.hasOwn(zecard,"atk")) {
                    zecard.atk -= attr.s*5;
                    if (zecard.atk < 5) {
                        zecard.atk = 5;
                    }
                }
            }
            if (effect == "bleeding") {
                // scale value = % of hp lost
                zecard.hp -= Math.round(zecard.hp*(attr.s/100));
                // added with the default 1, loses 5 scale per turn.
                attr.s -= 4; 
            }
            if (effect == "fear") {
                zecard.coolleft += 1;
                if (Object.hasOwn(zecard,"atk")) {
                    zecard.atk -= 10;
                }
            }
            if (effect == "strength") {
                zecard.atk += attr.s;
            }
            if (effect == "regeneration") {
                zecard.hp += attr.s;
            }
            if (effect == "poison") {
                if (zecard.name == "rottenglob") {
                    // poison heals rottenglob
                    zecard.hp += attr.s*2;
                    zecard.poison += attr.s;
                }
                zecard.hp -= attr.s;
                // added with the default 1, loses 5 scale per turn.
                attr.s -= 4; 
            }
            if (attr.s > 1) {
                attr.s -= 1;
            }
            
            if (attr.t <= 1) {
                if (effect == "death") {
                    delete plr.inventory[Object.keys(plr.inventory)[i]];
                    continue;
                }
                delete zecard.effects[effect];
                continue;
                
            }
            if (attr.t > 1) {
                attr.t -= 1;
            }
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
                addEffect(zecard,"phased",{s:1,t:1});
            }
            
        }
    }
    if (plr.name == "trafficlord" && randNum(1,6) == 6) {
        p1.mana -= 5;
        if (p1.mana < 0){
            p1.mana = 0;
        }
        p1.discards = 0;
        showEventText("MANA DRAIN!","mana");
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
    let aitype = tryAccess(p2,"aitype","normal");
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
    // var aimodes = 1,2,3 | 1: default, spend random amounts, select random cards | 2: save up, when many cards are on board, save up for more | 3: siege, attack with all force | 4: stock up, draw more cards | sB = super-buff | d = discarding
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
                    if (randNum(1,3) == 1) {
                        for (let i =0; i < p2.inventoryorder.length; i++) {
                            let chosen = p2.inventory[p2.inventoryorder[i]];
                            console.log(chosen,chosen.source,p2.deck);
                            let source = p2.deck[chosen.source];
                            if (chosen.coolleft >= 1 && chosen.hp < source.hp*0.8) {
                                discard("p2",i);
                                
                                break;
                            }
                            if (aitype == "discard" && tryAccess(chosen,"subtypes",[]).includes("mechanical") == false) {
                                discard("p2",i);
                                break;
                            }
                        }
                        
                    }
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
        if (randNum(1,3) == 1) {
            for (let i =0; i < p2.inventoryorder.length; i++) {
                let chosen = p2.inventory[p2.inventoryorder[i]];
                console.log(chosen,chosen.source,p2.deck);
                let source = p2.deck[chosen.source];
                if (chosen.coolleft >= 1 && chosen.hp < source.hp*0.8) {
                    discard("p2",i);
                    
                    break;
                }
                if (aitype == "discard" && tryAccess(chosen,"subtypes",[]).includes("mechanical") == false) {
                    discard("p2",i);
                    break;
                }
            }
            
        }
        oppturndone = true;
        window.setTimeout(oppChoice,350,false);
    }
    
    
}
function oppTurn() {
    // states: spend, save, neutral
    turnover("p1");
    if (tryAccess(p1.relics,"watch") != false && p1.relics.watch.attr >= 2 && randNum(1,5) == 5) {
        playerTurn();
        turnover("p2");
        return;
    }
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
 * @param {Card} card The card that deals damage
 * @param {Card} attacked The card that is attacked
 * @param {Number} damage The damage dealt
 * @param {"p1" | "p2"} stropp The player who was the victim
 * @param {"p1" | "p2"} strmain The player who dealt the damage
 */
function damageCard(card,attacked,damage,stropp,strmain) {
    console.log(attacked,"hi");
    if (attacked == null || attacked == undefined) {
        return false;
    }
    let user = Game[strmain];
    let opponent = Game[stropp];
    if (tryAccess(Game,stropp) == false) {
        return false;
    }
    
    if (card.sound != undefined) {
        playAudio("sounds/"+card.sound);
    } else {
        playAudio("sounds/sword.mp3");
    }
    if (Object.hasOwn(card.effects,"predicted")) {
        attacked.hp += damage
        card.hp -= Math.round(formateffect("Attributes",arrFirst(card.effects,"Predicted"))[0]*damage);
    }
    if (attacked.name == "rottenglob" && Object.hasOwn(card.effects,"poison")) {
        attacked.hp += damage*2;
    }
    if (tryAccess(Game,"stropp") != false && (arrHas(opponent.inventoryorder,"etherealguardian") || arrHas(opponent.inventoryorder,"juggernaut")) && Object.keys(tryAccess(opponent,"relics",{})).includes("divineshield")) {
        let chosen = arrFirst(opponent.inventoryorder,"etherealguardian")
        if (chosen == null) {
            chosen = arrFirst(opponent.inventoryorder,"juggernaut")
        }
        opponent.inventory[chosen].hp -= damage;
        if (opponent.inventory[chosen].hp <= 0) {
            attacked.hp += 50;
        } 
        damage = 0;
    }
    attacked.hp -= damage
    if (attacked.hp <= 0) {
        if (card.name == "soulkeeper") {
            card.killcount += 1;
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
            if (card.killcount % 5 == 0 && card.level >= 1) {
                addEffect(card,"camouflaged",{s:1,t:2});

            }
            if (card.level >= 2 && card.killcount > 10 && (card.killcount-10) % 4 == 0) {
                drawCard(strmain,true,"soul",["ignoreReload","query?keeper="]);
            }
        }
        if (attacked.cardmods.includes("diamondfoil") && randNum(1,4) == 4){
            // diamond foil cards have 1/4 chance of getting deleted after dying
            delete opponent.deck[attacked.source];
        }
        if (tryAccess(attacked.effects,"guarded") == false) {
            console.log('del soon',attacked.invsource);
            console.log(opponent.inventory[attacked.invsource]);
            delete opponent.inventory[attacked.invsource];
            if (currentmode == "Custom" && customtype == "flagship" && strmain == "p2") {
                opponent.health = -100;
            }
        } else {
            delete attacked.effects["guarded"]
            attacked.hp = 30;
        }
    } else {
        if (user == p1 && Object.hasOwn(p1.relics,"morningglory") && turns == 0) {
            p1.coins -= 15;
            if (p1.coins < 0) {
                p1.coins = 0;
            }
        }
    }
    update();
}
/**
 * 
 * @param {HTMLBodyElement} element element for card
 * @param {Boolean} opp whether or not user is opponent.
 * @param {Number} index index of card/element
 * @param {Card} select selected card to use
 * @param {"p1" | "p2"} selectp selected player for used card
 * @var user - the user's object variable
 * @var opponent - the opponent's object variable
 * @var findex - the index of the selected card
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
    // if there is an element, get the id and get the index then get the card
    if (element != null) {
        id = element.getAttribute("id");
        index = Number(id.replace("c",""))-1;
    } else {
        if (index != null) {
            element = document.getElementById("o"+(index+1));
            id = element.getAttribute("id");
        }
        
    }
    // apply variables to determine opponent, player, text, etcc
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
        if (tryAccess(card.effects,"stunned") != false || tryAccess(card.effects,"frozen") != false) {
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
                    showEventText("Froster Summoned!","frost");
                }
                
            }
            if (Object.hasOwn(card.effects,"harness")) {
                // the first attribute, scale, determines mana gained
                opponent.mana += card.effects.harness.attr.s;
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
                    /*if (card.effects.filter(str => str.includes("ExtraAtk")).length > extracount) {
                        let cm = cleanseModifier("Norm",card.effects.filter(str => str.includes("ExtraAtk"))[extracount]);
                        extraatk += Math.round(card.atk*(cm[0]/100));
                        extracount++;
                    }*/
                }
                if (Object.hasOwn(card.effects,"bubbly")) {
                    // do extra atk and gain extra hp if bubbly
                    let cm = card.effects.bubbly.attr.s;
                    extraatk += Math.round(card.atk*(cm/100));
                    card.hp += Math.round(card.hp*(cm/300));
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
                    if (extraatk > 0) {
                        showEventText("Charger Energized!","mana");
                    }
                }
                if (card.name == "turret") {
                    card.atk += card.stat;
                }
                if (card.name == "celestialstriker") {
                    drawCard(stropp,true,"comet",["summon"]);
                }
                if (card.name == "rottenglob") {
                    for (let i =0; i < randNum(2,4); i++) {
                        let chosen = opponent.inventory[randItem(opponent.inventoryorder)];
                        addEffect(chosen,"poison",{s:card.poison,t:1});
                    }
                }
                if (card.name == "spiritstaff") {
                    for (let tempCard in user.inventory) {
                        let cardInfo = user.inventory[tempCard];
                        if (cardInfo.name == "soulkeeper" && cardInfo.level >= 2) {
                            drawCard(strmain,true,"soul",["ignoreReload"])
                        }
                    }
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
                    if (Object.hasOwn(card.effects,"Confused")) {
                        zeattacked.hp += card.atk*2;
                    }
                    if (user.mods.some(str => str.includes("FlameTouch"))) {
                        let cm = cleanseModifier("Norm",user.mods.filter(str => str.includes("FlameTouch"))[0]);
                        addEffect(zeattacked,'burning',{s:cm[0],t:cm[1]});
                    }
                    if (arrHas(user.mods,"SoulLantern") == true && card.subtypes.includes("magic")) {
                        let cm = cleanseModifier("Norm",arrFirst(user.mods,"SoulLantern"));
                        zeattacked.hp -= Math.round(card.atk*(cm/100));
                    }
                    if (tryAccess(user.relics,"feebolumbullets") && tryAccess(card,"subtypes",[]).includes("shoot")) {
                        addEffect(zeattacked,"brittle",{s:1,t:1});
                    }
                    if (card.name == "spiritstaff") {
                        addEffect(zeattacked,"shock",{s:card.stat,t:1});
                        if (card.level >= 1) {
                            for (let i =0; i<2; i++) { // attacks 2 more cards, using Spirit Range upgrade
                                if (opponent.inventoryorder[i] != undefined) {
                                    damageCard(card,opponent.inventory[opponent.inventoryorder[i]],card.atk,stropp,strmain)
                                }
                            }
                        }
                    }
                    if (card.name == "spearman") { 
                        if (card.level >= 1 && randNum(1,3) == 1) {// deal 2x damage every 3 shots
                            showEventText("Double Strike!","critical");
                            zeattacked.hp -= card.atk;
                        }
                        if (card.level >= 2) {
                            addEffect(zeattacked,"bleeding",{s:5,t:2}); // bleeding 5% for 2 turns
                        }
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
                        addEffect(zeattacked,"stunned",{s:1,t:2});
                        let attackAmount = 1;
                        let attackMult = 0.4;
                        let superCannon = false;
                        if (card.level >= 1 && randNum(1,2) == 1) { // 1/2 chance of super cannon
                            superCannon = true;
                            attackAmount = 3;
                            attackMult = 0.7;
                            showEventText("Super Cannon Shot!","critical");
                        } 
                        for (let i = 0; i < attackAmount; i++) {
                            let chosencard;
                            chosencard = randKey(opponent.inventory);
                            damageCard(card,chosencard,Math.round(card.atk*attackMult),stropp,strmain);
                            //chosencard.hp -= Math.round(card.atk*attackMult); // deal attackmult% of damage
                            if (superCannon) { // apply stun if super cannon
                                addEffect(chosencard,"stunned",{s:1,t:2});
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
                    if (card.name == "corruptedclaw") {
                        addEffect(zeattacked,"poison",{s:card.poison,t:4},true,{s:Math.round(card.poison/2),t:1});
                        // card's stat is the poison given
                    }
                    
                    if (zeattacked.name == "vine") {
                        // lose health according to the vine's stat (rebound damage)
                        card.hp -= zeattacked.stat;
                    }
                    if (zeattacked.name == "sandstorm") {
                        addEffect(card,"poison",{s:Math.round(zeattacked.poison/5),t:1},true,{s:zeattacked.poison,t:2});
                        // worsen opponent's poison
                    }
                    if (card.name == "solarprism") {
                        let beamDamage = card.atk;
                        if (card.level >= 1 && randNum(1,3) == 1) { // deal 25 more damage if it is a super beam
                            beamDamage += 25;
                            extraatk += 25;
                            showEventText("Solar Beam!","critical");
                        }
                        opponent.health -= beamDamage;
                    }
                    if (card.name == "radiantfists") {
                        addEffect(zeattacked,"predicted",{s:card.stat,t:1},true,{s:0.5,t:1});
                        // predicts opponent's attack
                    }
                    if (card.cardmods.includes("infernalfoil")) {
                        if (randNum(1,5) == 5) {
                            extraatk += 25;
                            addEffect(zeattacked,"burning",{s:3,t:1});
                        }
                    }
                    if (card.name == "stopsign") {
                        console.log(opponent.inventoryorder,"me stoppoo");
                        for (let i =0; i < opponent.inventoryorder.length; i++) {
                            let chosen = opponent.inventory[opponent.inventoryorder[i]];
                            damageCard(card,chosen,card.atk+randNum(0,20),stropp,strmain);
                            chosen.coolleft += randNum(0,1);
                            addEffect(chosen,"stunned",{s:1,t:2},true,{s:1,t:1});
                            if (card.level >= 1) {
                                addEffect(chosen,"brittle",{s:2,t:1});
                            }
                        }
                        zeattacked.coolleft += card.stat;
                    }
                    
                    /* MAIN DAMAGE (deals damage to opponent themselves) */

                    predamagehp = zeattacked.hp;
                    preeffects = zeattacked.effects;
                    damageCard(card,zeattacked,card.atk+extraatk,stropp,strmain);
                    //zeattacked.hp -= card.atk+extraatk;
                    if (Object.hasOwn(zeattacked.effects,"bubbly")) {
                        // heal for x% of the damage taken based off of bubbly effect scale 
                        zeattacked.hp += Math.round(zeattacked.effects.bubbly.attr.s*(card.atk+extraatk)/100);
                    }
                    console.log(zeattacked);
                    
                    
                    /* UNMAIN DAMAGE */
                    if (card.name == "turret" && card.level >= 1 && randNum(1,4) == 1) { // 25% chance to triple shot
                        window.setTimeout(damageCard,200,card,zeattacked,card.atk,stropp,strmain);
                        window.setTimeout(damageCard,400,card,zeattacked,card.atk,stropp,strmain);
                        showEventText("Triple Shot!","critical");
                    }
                    if (card.name == "charger") {
                        let chargeAmount = 4;
                        let superCharge = false;
                        let manaSteal = 0;
                        if (card.level == 1 && randNum(1,5) == 1) { // enable supercharge, dealing extra damage
                            superCharge = true;
                            chargeAmount = 10;
                            showEventText("Super Charge!","mana");
                        }
                        // reset attack
                        card.atk = 40;
                        for (let i = 0; i < chargeAmount; i++) {
                            // shocks and (50%) stuns 4 opponent cards
                            let card = opponent.inventory[Object.keys(opponent.inventory)[i]];
                            if (card != undefined) {
                                let substr = "Shock";
                                addEffect(card,"shock",{s:1,t:1});
                                if (randNum(1,2)) {
                                    substr = "Stunned";
                                    addEffect(card,"stunned",{s:1,t:1});
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
                    if (card.name == "wizard" && card.level >= 1 && randNum(1,3) == 1) { // daze 3 enemies
                        for (let i = 0; i < 3; i++) {
                            let chosencard = randKey(opponent.inventory);
                            if (chosencard) {
                                chosencard.hp -= Math.round(card.atk/2); // deal half of attack
                                // harness 
                                addEffect(chosencard,"harness",{s:card.stat,t:3},true,{t:2});
                            }
                            
                        }
                    }
                    if (card.name == "weakener") {
                        // steals attack, if not takes 30 hp
                        let chosen;
                        weakenAmount = 1;
                        if (card.level >= 1 && randNum(1,5) == 5) {
                            showEventText("Weakening Wave!","critical");
                            weakenAmount = 5;
                        }
                        let sampleInventory = structuredClone(opponent.inventory);
                        for (let i = 0; i< weakenAmount; i++) {
                            for (let j = 0; j < Object.keys(sampleInventory).length; j++) {
                                let tempchosen = opponent.inventory[Object.keys(sampleInventory)[j]];
                                if (tempchosen.type == "Attack" || tempchosen.type == "Heal") {
                                    chosen = tempchosen;
                                    delete sampleInventory[Object.keys(sampleInventory)[j]];
                                    break;
                                }
                                
                            }
                            console.log(chosen);
                            if (chosen == null) {
                                opponent.health -= 30;
                            } else {
                                if (chosen.type == "Attack") {
                                    console.log("chosenweaken",card.stat*2);
                                    chosen.atk -= Math.round(card.stat*2);
                                    card.atk += card.stat;
                                    if (chosen.atk < 5) {
                                        chosen.atk = 5;
                                    }
                                }
                                if (chosen.type == "Heal") {
                                    chosen.heal -= Math.round(card.stat*2);
                                    card.atk += card.stat;
                                    if (chosen.heal < 5) {
                                        chosen.heal = 5;
                                    }
                                }
                            }
                        }
                        
                        
                        
                    }
                    if (card.name == "teslacoil") {
                        for (let i = 0; i < Object.keys(opponent.inventory).length; i++) {
                            // shocks every card, dealing 1/7 of coil's attack with extra shock.
                            let tempchosen = opponent.inventory[Object.keys(opponent.inventory)[i]];
                            tempchosen.hp -= Math.ceil(card.atk/7);
                            tempchosen = addEffect(tempchosen,"shock",{s:1,t:1},true);
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
                        if (card.level < 2) {
                            zeattacked = addEffect(zeattacked,"burning",{s:1,t:1},false);
                        } else {
                            zeattacked = addEffect(zeattacked,"burning",{s:1,t:1},true,{s:1,t:1});
                        }
                        
                        if (card.level >= 1 && randNum(1,16)==16) {
                            for (let i =0; i < 5;i++) {
                                let chosen = randKey(opponent.inventory);
                                damageCard(chosen,zeattacked,10,stropp,strmain);
                            }
                            showEventText("Firebomb!","critical");
                        }
                        
                    }
                    if (card.name == "ninja") {
                        // add camouflaged effect for 2 turns
                        addEffect(card,"camouflaged",{s:1,t:2});
                    }
                    if (card.name == "juggernaut") {
                        let stunAmount = 1;
                        let bashDamage = 10;
                        if (card.level >= 1 && randNum(1,5) == 1) { // 20% chance of super bash at level 1
                            showEventText("Ultra Slam!","critical");
                            stunAmount = 4;
                            bashDamage = 30;
                        }
                        for (let i = 0; i < 4; i++) {
                            let card = opponent.inventory[Object.keys(opponent.inventory)[i]];
                            if (card != undefined) {
                                if (i < stunAmount) {
                                    let substr = "Stunned";
                                    addEffect(card,"stunned",{s:1,t:1});
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
                    if (card.name == "soulkeeper") {
                        if (Object.hasOwn(card.effects,"camouflaged")) {
                            card.hp = Math.round(card.hp+(card.atk/10));
                            card.atk = Math.round(card.atk+(card.atk/20));
                        }
                        
                    }
                    if (card.name == "sniper") {
                        let pierce = 4;
                        let damage = 20;
                        if (Object.hasOwn(user.relics,"phasershot")) {
                            showEventText("Pierce Shot!","phaser");
                            pierce = 10;
                            damage = card.atk;
                        }
                        // allow higher pierce with the relic
                        for (let i = 0; i < pierce; i++) {
                            if (Object.hasOwn(user.relics,"phasershot")) {
                                damage -= user.relics.phasershot.attr; // decrease slower with relic
                            } else {
                                damage -= 50;
                            }
                            // prevent healing
                            if (damage < 0) {
                                damage = 0;
                            }
                            let chosen = opponent.inventory[Object.keys(opponent.inventory)[i]];
                            // only stun first four
                            if (chosen != undefined && i < 4) {
                                let substr = "Stunned";
                                addEffect(chosen,"stunned",{s:1,t:1});
                                chosen.hp -= damage;
                                if (Object.hasOwn(user.relics,"feebolumbullets")) {
                                    addEffect(chosen,"brittle",{s:1,t:1},true,{s:1});
                                }
                                
                            } else {
                                opponent.health -= Math.min(Math.round(damage/5),50);
                            }
                        }
                        // shrapnel
                        if (card.level >= 2) {
                            for (let i = 0; i < 3; i++) {
                                let chosen = randKey(opponent.inventory);
                                if (chosen) {
                                    chosen.hp -= card.atk/5;
                                }
                                
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
                                if (tempchosen.hp > mosthp && tryAccess(tempchosen.effects,"death") == false) {
                                    keyname = Object.keys(opponent.inventory)[i];
                                    chosen = tempchosen;
                                    mosthp = chosen.hp;
                                }
                            }
                            tries++;
                        } while (tries < 50)
                        if (chosen == null) {
                           
                        } else {
                            addEffect(chosen,"death",{s:1,t:2});
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
                                    if (tempchosen.atk > mostatk && tempchosen.coolleft < 2 && tryAccess(tempchosen.effects,"frozen") == false) {
                                        chosen = tempchosen;
                                        mostatk = chosen.atk;
                                    }
                                }
                                
                            }
                            tries++;
                            
                        } while (tries < 50)
                        if (chosen == null) {
                           
                        } else {
                            addEffect(chosen,"frozen",{s:1,t:2});
                        }
                    }
                    if (card.name == "jester") {
                        let chosen;
                        for (let i = 0; i < Object.keys(opponent.inventory).length; i++) {
                            let tempchosen = opponent.inventory[Object.keys(opponent.inventory)[i]];
                            if (tempchosen.type == "Attack" && tryAccess(tempchosen.effects,"confused") == false) {
                                chosen = tempchosen;
                                break;
                            }
                        }
                        if (chosen == null || chosen.type != "Attack") {
                           
                        } else {
                            addEffect(chosen,"confused",{s:1,t:2},true,{t:1});
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
                    if (Object.hasOwn(zeattacked.effects,"phased")) {
                        console.log(zeattacked.hp,predamagehp,);
                        zeattacked.hp = predamagehp;
                        zeattacked.effects = preeffects;
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
                    if (!tryAccess(zechosen.effects,"poison")) { // you cannot heal poison, only bubblemancer can fix
                        if (card.name != "bubblemancer") {
                            zechosen.hp += card.heal;
                            if (card.level >= 1 && card.name == "healorb") {
                                let goodeffects = ["bubbly","phased","strength","regeneration"];
                                addEffect(zechosen,randItem(goodeffects),{s:15,t:2});
                            }
                            if (card.level >= 1 && card.name == "healbubble") {
                                addEffect(zechosen,"bubbly",{s:5,t:2});
                            }
                        }
                    }
                    
                    
                }
                
                if (card.name == "bubblemancer") {
                    for (let i = 0; i < 3; i++) {
                        let chosencard = randKey(user.inventory);
                        chosencard.hp += card.heal;
                        //let badeffects = ["burning","death","fear","frozen","stunned","shock","poison"];
                        for (let effect in chosencard.effects) {
                            if (effect.type == "bad") {
                                delete chosencard.effects[effect];
                            }
                        }
                        addEffect(chosencard,"bubbly",{s:15,t:2,d:5},true,{s:10});
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
                if (card.name == "supplycrate") {
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
                    let gain = Math.round((100-chosen.atk)/150*card.stat); // get 100-atk, so if atk is 80 it would be 20/150*card.stat (default 10), so 20/150*10 = 1.3 ammo. with upgrade would be 2
                    // minimum 3 ammo gained
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
                    if (tryAccess(chosen.effects,"guarded") == false) {
                        addEffect(chosen,"guarded",{s:1,t:3});
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
                    drawCard(strmain,true,"solarprism",["ignoreReload"]);
                    card.ammo -= 1;
                    let chosen = firstOpp(stropp);
                    let substr = "Fear";
                    if (chosen != "Opp") {
                        chosen = opponent.inventory[chosen];
                        if (tryAccess(chosen.effects,"fear") == false) {
                            addEffect(chosen,"fear",{s:1,t:1});
                            chosen.coolleft += 1;
                        }
                    }
                    if (card.ammo <= 0) {
                        card.coolleft = card.cool;
                        card.ammo = card.maxammo;
                    }
                }
                if (card.name == "clonebox") {
                    let cloneIndex = index;
                    if (selected != null) {
                        cloneIndex = findex;
                    }
                    if (cloneIndex == 0) {
                        drawCard(strmain,true,"oblivion",["ignoreReload"])
                    } else {
                        drawCard(strmain,true,user.inventory[user.inventoryorder[cloneIndex]],["ignoreReload","setcard"]);
                    }
                    
                    card.ammo -= 1;
                    if (card.ammo <= 0) {
                        card.coolleft = card.cool;
                        card.ammo = card.maxammo;
                    }
                }
                if (card.name == "bus") {
                    let card1 = user.inventory[Object.keys(user.inventory)[0]];
                    let selectedindex = findex;
                    if (selectedindex == undefined) {
                        selectedindex = 0;
                    }
                    // choose selected or first card
                    if (selected != null) {
                        card1 = selected;
                    }
                    card1.hp += 20;
                    let newobj = {};
                    // recreate inventory, with the card
                    let newInvOrder = structuredClone(user.inventoryorder);
                    newInvOrder.splice(selectedindex,1);
                    newInvOrder.push(user.inventoryorder[selectedindex]);
                    console.log(newInvOrder);
                    for (let i =0; i < user.inventoryorder.length; i++) {
                        // add key to object using NEWINVORDER
                        newobj[newInvOrder[i]] = user.inventory[newInvOrder[i]];
                        console.log(newobj);
                    }
                    console.log(newobj);
                    /*Object.defineProperty(newobj,Object.keys(user.inventory)[Object.keys(user.inventory).length-1],Object.getOwnPropertyDescriptor(user.inventory,Object.keys(user.inventory)[Object.keys(user.inventory).length-1]));
                    Object.keys(user.inventory).forEach(function(key,index) {
                        if (index != Object.keys(user.inventory).length-1 && index != 0) {
                            Object.defineProperty(newobj,key,Object.getOwnPropertyDescriptor(user.inventory,key));
                        }
                    });
                    Object.defineProperty(newobj,Object.keys(user.inventory)[0],Object.getOwnPropertyDescriptor(user.inventory,Object.keys(user.inventory)[0]));*/
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
                            if (tryAccess(chosen.effects,"fear") == false) {
                                addEffect(chosen,"fear",{s:1,t:1});
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
                    showEventText("Cultists Summoned...","danger");
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
                            temphp += tempcard.hp/20;
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
                    reload();
                    reloading = false;
                    battletext.innerHTML = "Next Card: "+user.drawarr[user.drawarrindex];
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
                if (card.name == "fishingrod") {
                    let chosen = firstOpp(stropp);
                    let chosenCard = opponent.inventory[chosen]
                    if (selected != undefined && selected != null) {
                        chosen = opponent.inventoryorder[findex];
                        chosenCard = selected;
                    }
                    drawCard(strmain,true,chosenCard,["setcard","ignoreReload"]);
                    delete opponent.inventory[chosen];
                    card.coolleft = card.cool;
                }
            }
            user.mana -= card.manause;
        }
        console.log("will exhaust");
        if (tryAccess(card,"exhaust")) {
            console.log(card,"exhausting");
            delete user.battledeck[tryAccess(card,"source","")];
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
 * @param {"p1"|"p2"} player The player that is discarding
 * @param {Integer} index The index of the card in the inventory that is discarded
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
        
        if (card.name == "gold") {
            user.coins += card.stat*40; // give 40*cardvalue
        }
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
        delete user.inventory[Object.keys(user.inventory)[index]];
        user.mana += 1;
        user.discards -= 1;
        
        update();
    } else {
        if (strmain == "p1" && Object.hasOwn(p1.relics,"goldenshovel") && p1.mana >= 4) {
            // spawn gold when empty cell is dug
            user.discards -= 1;
            p1.mana -= 4;
            drawCard("p1",true,"gold");
        }
    }
    
}
function setStartMod(mod) {
    
    if (mod == "nephew") {
        drawCard("p1",true,"spearman","addToDeck");
        drawCard("p1",true,"spearman","addToDeck");
    }
    if (mod == "janjo") {
        for (let i = 0; i < 2; i++) {
            let chosen = lib.weight(cardLootTables.standard);
            drawCard("p1",true,chosen,"addToDeck");
        }
        let chosenRelic = lib.weight(relicLootTables.standard,6);
        addRelic("p1",chosenRelic);
        p1.maxhealth = 100;
        p1.health = 100;
        p1.maxdiscards = 1;
        p1.coins = 100;
        p1.discards = 1;
        p1.managain = 4.5;
    }
    if (mod == "greg") {
        addRelic("p1","goldenshovel");
        drawCard("p1",true,changePropertiesByQuery(structuredClone(cards.spearman),"hp=15"),["addToDeck","setcard"])
        p1.maxhealth = 300;
        p1.health = 300;
        p1.maxdiscards = 1;
        p1.coins = 0;
        p1.discards = 1;
        p1.managain = 5;

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
    p1.managain = stepRound(p1.managain,0.1);
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
function handleSpecial(special) {
    let data = curspecials[special];
    if (rerolls == 5) {
        rerolls = tryAccess(data,"rerolls",5);
    }
    if (special == "conchange") {
        if (hasUnlock(data.con) && tryAccess(data,"used") != true) {
            curlocation.loretext = data.loretext;
            if (Object.hasOwn(data,"addspecial")) {
                let newspecial = Object.keys(data.addspecial)[0];
                let newdata = data.addspecial[newspecial];
                curlocation.special[newspecial] = newdata;
                curspecials[newspecial] = newdata;
                delete curlocation.special.conchange;
                delete curspecials.conchange;
                enterAdventureScreen();
                return false;
            }
        }
    }
    if (special == "custom" && textfinished == true) {
        let specialdiv = specialEvent.createWrapper("custom");
        if (Object.hasOwn(data,"title")) {
            specialEvent.setTitle(data.title,specialdiv);
        }
        for (let j =0; j < Object.keys(data.choices).length; j++) {
            let choice = data.choices[Object.keys(data.choices)[j]];
            let opt = specialEvent.addOption(`<h2>${choice.h2}</h2><p>${choice.p}</p>`,Object.keys(data.choices)[j],special,specialdiv);
        }
    }
    if (special == "setpart" && textfinished == true) {
        let specialdiv = specialEvent.createWrapper("setpart");
        if (Object.hasOwn(data,"title")) {
            specialEvent.setTitle(data.title,specialdiv);
        }
        for (let j =0; j < Object.keys(data.choices).length; j++) {
            let choice = data.choices[Object.keys(data.choices)[j]];
            let opt = specialEvent.addOption(`<h2>${choice.specialheader}</h2><p>${choice.specialdesc}</p>`,Object.keys(data.choices)[j],special,specialdiv);
        }
    }
    if (special == "gaincard" && textfinished == true) {
        // New Way
        offerwrapper.style.display = "flex";
        cardoffer.classList.remove("hide");
        let cardName = "";
        let cardQuery = data.cardgain;
        if (cardQuery == undefined) {
            cardQuery ="";
        }
        if (data.cardloottable) {
            cardName = lib.weight(cardLootTables[data.cardloottable]);
        } else {
            cardName = cardQuery.split("?")[0];
        }
        

        console.log(cardQuery,cards[cardName],cardName);
        offeredCard = changePropertiesByQuery(structuredClone(cards[cardName]),cardQuery);
        console.log(offeredCard);
        displayCard(cardoffer,offeredCard);
        if (tryAccess(data,"rerolls",5) == 0) {
            byId("reroll").style.display = "none";
        } else {
            byId("reroll").style.display = "block";
        }
    }
    if (special == "gainrelic" && textfinished == true) {
        offerwrapper.style.display = "flex";
        relicoffer.classList.remove("hide");
        offeredRelic = data.relicgain;
        displayRelic(relicoffer,relics[offeredRelic]);
        if (tryAccess(data,"rerolls",5) == 0) {
            byId("reroll").style.display = "none";
        } else {
            byId("reroll").style.display = "block";
        }
        addRelic("p1",offeredRelic);
    }
    if (special == "choosecard") {
        console.log("hi");
        embtnWrap.style.display = "block";
        embtn.innerHTML = "Choose Card";
        emtitle.innerHTML = "Choose Card";
        
        Array.from(document.getElementsByClassName("asp-main")).forEach(function(element) {
            let tempLootTable = "standard";
            if (tryAccess(data,"cardloottable") && Object.hasOwn(cardLootTables,tryAccess(data,"cardloottable"))) {
                tempLootTable = data.cardloottable;
            }
            let card = shopcards[lib.weight(cardLootTables[tempLootTable])]; // gets card from loot table, then gets version in shopcards
            card.effects = {};
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
        });
        if (tryAccess(data,"rerolls",5) == 0) {
            byId("reroll").style.display = "none";
        } else {
            byId("reroll").style.display = "block";
        }
    }
    if (special == "buycard") {
        embtnWrap.style.display = "block";
        embtn.innerHTML = "Open Shop";
        emtitle.innerHTML = "Buy Card";
        Array.from(document.getElementsByClassName("asp-main")).forEach(function(element) {
            let tempLootTable = "standard";
            if (tryAccess(data,"cardloottable") && Object.hasOwn(cardLootTables,tryAccess(data,"cardloottable"))) {
                tempLootTable = data.cardloottable;
            }
            let card = shopcards[lib.weight(cardLootTables[tempLootTable])]; // gets card from loot table, then gets version in shopcards
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
                cost += (card.heal)/card.manause;
                if (card.name == "bubblemancer") {
                    cost *= 1.2;
                }
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
        if (tryAccess(data,"rerolls",5) == 0) {
            byId("reroll").style.display = "none";
        } else {
            byId("reroll").style.display = "block";
        }
    }
    if (special == "buyrelic") {
        let specialdiv = specialEvent.createWrapper("relics");
        specialEvent.setTitle("RELICS",specialdiv);
        for (let i =0; i<3; i++) {
            let element = specialEvent.addOption("",i,"buyrelic",specialdiv);
            let relic = relics[lib.weight(relicLootTables[tryAccess(data,"relicloottable","standard")],6)]; // new weighted method
            console.log(relic);
            let chance = randNum(1,10);
            element.innerHTML = `<h2>${relic.formal}</h2>`;
            element.setAttribute("data-relic",relic.name);
            let cost = relicCosts[relic.name];
            element.setAttribute("data-cost",cost);
            element.classList.remove("tooltipholder");
            //let relic = randKey(relics,"subobj?obtainable=false"); // old random method
            
            
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
        }
        //specialdiv2.style.display = "block";
        Array.from(document.getElementsByClassName("tooltip")).forEach(function(element2) {
            element2.remove();
        })
        if (tryAccess(data,"rerolls",5) == 0) {
            byId("reroll").style.display = "none";
        } else {
            byId("reroll").style.display = "block";
        }
    }
    if (special == "speedingcar") {
        let specialdiv = specialEvent.createWrapper("speedingcar");
        specialEvent.setTitle("What to do?",specialdiv);
        specialEvent.addOption("<h2>Run Quickly</h2><p>Get out of the car's way, damaging cards in the process.</p>",1,special,specialdiv);
        specialEvent.addOption("<h2>Stay Still</h2><p>The car can't hurt you, right?</p>",2,special,specialdiv);
    }
    if (special == "beancandispenser") { // give 50 health for 20 coda coins
        let specialdiv = specialEvent.createWrapper(special);
        specialEvent.addOption("<h2>Bean Dispenser</h2><p>+50 health, but at the cost of 20 coda coins. Capped at max health.</p>",1,special,specialdiv);;
    }
    if (special == "drinkrobot") { // give two options: good cola and fake cola
        let specialdiv = specialEvent.createWrapper(special);
        let opt1 = specialEvent.addOption("<h2>FEEBOLE COLA</h2><p>A cola that many Feebolians drink. Sounds like ebola. 25 cost.</p>",1,special,specialdiv);;
        opt1.setAttribute("data-cost",25);
        opt1.setAttribute("data-heal",40);
        let opt2 = specialEvent.addOption("<h2>NEON ENERGY</h2><p>NEON ENERGY! AMAZING FOR THE MIND! ULTIMATE ENERGY! 100 cost.</p>",2,special,specialdiv);;
        opt2.setAttribute("data-cost",100);
        opt2.setAttribute("data-heal",-70);
    }
    if (special == "fight") { // cause fight with fakecoins
        let specialdiv = specialEvent.createWrapper(special);
        let opt1 = specialEvent.addOption(`<h2>${data.h2}</h2><p>${data.p}</p>`,1,special,specialdiv);
        opt1.setAttribute("data-cost",-50);
        opt1.setAttribute("data-fight",data.enemy);
    }
    if (special == "gainpower") {
        let specialdiv = specialEvent.createWrapper(special);
        byId("sc3").style.display = "none";
        byId("sc2").style.display = "none";
        specialEvent.addOption("<h2>GAIN POWER</h2><p>BECOME THE ALMIGHTY</p>",1,special,specialdiv);;
    }
    if (special == "risk") {
        let specialdiv = specialEvent.createWrapper(special);
        byId("sc2").style.display = "none";
        byId("sc3").style.display = "none";
        specialEvent.addOption("<h2>Take the risk.</h2><p>???</p>",1,special,specialdiv);;
    }
    if (special == "unclemanstatue") {
        let specialdiv = specialEvent.createWrapper(special);
        byId("sc2").style.display = "none";
        byId("sc3").style.display = "none";
        specialEvent.addOption("<h2>Climb the statue.</h2><p>Seems a little dangerous.. Surely isn't that bad.. right?</p>",1,special,specialdiv);;
    }
    if (special == "flamebean") {
        let specialdiv = specialEvent.createWrapper(special);
        byId("sc2").style.display = "none";
        byId("sc3").style.display = "none";
        specialEvent.addOption("<h2>Take the Bean Can.</h2><p>-50 health, but it must be worth it.. right?</p>",1,special,specialdiv);;
    }
    if (special == "celestial") {
        let specialdiv = specialEvent.createWrapper(special);
        byId("sc2").style.display = "none";
        byId("sc3").style.display = "none";
        specialEvent.addOption("<h2>Join.</h2><p>Seek a better future.</p>",1,special,specialdiv);;
    }
    if (special == "crowattack") {
        let specialdiv = specialEvent.createWrapper(special);
        byId("sc3").style.display = "none";
        specialEvent.addOption("<h2>Throw cards at them!</h2><p>Lose 2 random cards.</p>",1,special,specialdiv);;
        specialEvent.addOption("<h2>Run through the crows.</h2><p>Rahh!! They can't attack me!! -80 health.</p>",2,special,specialdiv);;
    }
    if (special == "suddenurge") {
        let specialdiv = specialEvent.createWrapper(special);
        byId("sc3").style.display = "none";
        byId("sc2").style.display = "none";
        specialEvent.addOption("<h2>Steal.</h2><p>Gain an extra item for free!</p>",1,special,specialdiv);;
    }
    if (special == "danceclubspill") {
        let specialdiv = specialEvent.createWrapper(special);
        byId("sc3").style.display = "none";
        specialEvent.addOption("<h2>Take the Cards</h2><p>Take all the cards you see, may or may not be yours.</p>",1,special,specialdiv);;
        specialEvent.addOption("<h2>Leave Quickly</h2><p>Lose two random cards.</p>",2,special,specialdiv);;
    }
    if (special == "cardtornado") {
        let specialdiv = specialEvent.createWrapper(special);
        byId("sc3").style.display = "none";
        specialEvent.addOption("<h2>Block the Tornado With Your Backpack</h2><p>+2 random cards.</p>",1,special,specialdiv);;
        specialEvent.addOption("<h2>Run Through the Tornado</h2><p>-80 health.</p>",2,special,specialdiv);;
    }
    if (special == "knowledge") {
        let specialdiv = specialEvent.createWrapper(special);
        byId("sc3").style.display = "none";
        specialEvent.addOption("<h2>Book of Mana Harnessing</h2><p>+0.5 mana gain.</p>",1,special,specialdiv);;
        specialEvent.addOption("<h2>Book of Life</h2><p>+25% more max health.</p>",2,special,specialdiv);;
    }
    if (special == "rest") {
        let specialdiv = specialEvent.createWrapper(special);
        let opt1 = specialEvent.addOption("<h2>Standard Room</h2><p>+70 health, but at the cost of 50 coda coins. Capped at max health.</p>",1,special,specialdiv);
        opt1.setAttribute("data-cost",50);
        opt1.setAttribute("data-heal",70);
        let opt2 = specialEvent.addOption("<h2>ULTRA-CHEAP Room</h2><p>Dirty, old mattresses for the night. It's free, but only heals 20 health.</p>",2,special,specialdiv);
        opt2.setAttribute("data-cost",0);
        opt2.setAttribute("data-heal",20);
        
    }
    if (special == "mystery") {
        let specialdiv = specialEvent.createWrapper(special);
        specialdiv2.style.display = "none";
        byId("sc2").style.display = "none";
        byId("sc3").style.display = "none";
        specialEvent.addOption("<h2>Mystery Box</h2><p>Lose 120 coda coins, but get a random card with DOUBLE stats.</p>",1,special,specialdiv);
    }
    if (special == "donate") {
        let specialdiv = specialEvent.createWrapper(special);
        specialEvent.addOption("<h2>Donate</h2><p>Donate 10 coda coins for the greater good</p>",1,special,specialdiv);
    }
    /*if (special == "gamble") {
        let specialdiv = specialEvent.createWrapper(special);
        specialdiv2.style.display = "none";
        byId("sc1").style.display = "none";
        byId("sc2").style.display = "none";
        byId("sc3").style.display = "none";
    }*/
    if (special == "jamodarcardsdealer") {
        let specialdiv = specialEvent.createWrapper(special);
        specialdiv2.style.display = "none";
        specialEvent.addOption("<h2>1</h2><p>1 is simple. 1 is not composite or prime. 1 is superior.</p>",1,special,specialdiv);
        specialEvent.addOption("<h2>2</h2><p>2*2 and 2+2 are the same. 2 is the only even prime. 2 is the way.</p>",2,special,specialdiv);
        specialEvent.addOption("<h2>3</h2><p>3 rhymes with tree. 3 is a conservationist. #TeamThrees</p>",3,special,specialdiv);
    }
    if (special == "jamodarcardsvendingmachine") {
        let specialdiv = specialEvent.createWrapper(special);
        specialdiv2.style.display = "none";
        byId("sc2").style.display = "none";
        byId("sc3").style.display = "none";
        specialEvent.addOption("<h2>Use Vending Machine</h2><p>Get a random drink.</p>",1,special,specialdiv);
    }
    if (special == "strongwinds") {
        let specialdiv = specialEvent.createWrapper(special);
        byId("sc3").style.display = "none";
        specialEvent.addOption("<h2>Keep Going</h2><p>Push further, but lose a card and a few coins along the way.</p>",1,special,specialdiv);;
        specialEvent.addOption("<h2>Succumb to the Winds</h2><p>-30 max health.</p>",2,special,specialdiv);
    }
    if (special == "filoriver") {
        let specialdiv = specialEvent.createWrapper(special);
        byId("sc2").style.display = "none";
        byId("sc3").style.display = "none";
        specialEvent.addOption("<h2>Pay the Subscription</h2><p>Pay.</p>",1,special,specialdiv);
    }
    if (special == "filomeats") {
        let specialdiv = specialEvent.createWrapper(special);
        specialEvent.addOption("<h2 class='text-brown'>Crispy BBQ Steak</h2><p>+50 max health & full stomach for 5 battles. Costs 100 CC</p>",1,special,specialdiv);
        specialEvent.addOption("<h2 class='text-yell'>Honey Chicken Wings</h2><p>+75 max health & full stomach for 3 battles. Costs 100 CC</p>",2,special,specialdiv);
        specialEvent.addOption("<h2 class='text-red'>Flaming Reaper Chicken</h2><p>-50 max health & flaming for 10 battles. Costs 50 CC",3,special,specialdiv);
    }
    if (Object.hasOwn(data,"showopt")) {
        let specialdiv = specialEvent.createWrapper(special);
        let info = specials[special];
        let opt1 = specialEvent.addOption(`<h2>${info.formal}</h2><p>${info.desc}</p>`,special,"focus-special",specialdiv);
    } else {
        if (["upgcard","sacrificecard","infernalfoil","energizer","destroycard","duplicatecard","diamondfoil","gamble"].includes(special)) {
            focusedSpecial = special;
        }
    }
    // IMPORTANT
    /*if (special == "setpart" || special == "setloc") {
        let specialdiv = specialEvent.createWrapper(special);
        specialEvent.addOption(`<h2>${data.specialheader}</h2><p>${data.specialdesc}</p>`,1,special,specialdiv);
    }*/
}
function enterAdventureScreen() {
    adventurescreen.style.opacity = 1;
    adventurescreen.style.display = "block";
    curloctxt.innerHTML = "Current Location: "+curlocation.formal;
    console.log(curlocation);
    curlocdesctxt.innerHTML = curlocation.desc;
    if (curlocation.loretext.includes("||") == false) {
       
        currenttext = curlocation.loretext;
        textfinished = true;
    }
    if (["gaincard","gainrelic"].includes(curspecial1) == false && ["gaincard","gainrelic"].includes(curspecial2) == false) {
        offerwrapper.style.display = "none";
    }
    console.log(curlocation.loretext,textfinished);
    loretxt.innerHTML = curlocation.loretext;
    let zelist = ["destroycard","upgcard","energizer","duplicatecard","infernalfoil","diamondfoil","gaincard","gainrelic","buycard","choosecard"];
    let emmodallist = ["buycard","choosecard"];

    // SET BACK TO DEFUALT
    byId("aftertext").innerHTML = "";
    embtnWrap.style.display = "none";
    clearChildren(byId("special-wrapper"));
    byId("reroll").style.display = "none";
    focusedSpecial = null;

    if (Object.hasOwn(curlocation,"skipallowed")) {
        alttravelbtn.style.display = "block";
    } else {
        alttravelbtn.style.display = "none";
    }
    if (skipped == true && skippedAlt == false) {
        let prevLocation = locations[locationsarr[curlocationindex-1]]; // get the previous location
        if (tryAccess(prevLocation,"skipalt") && curlocation.name != tryAccess(prevLocation,"skipalt")) { // if skipalt, add it to the currentlocation
            if (tryAccess(prevLocation,"skipalt") == "none") {
                locationsarr.splice(curlocationindex,1);
            } else {
                locationsarr.splice(curlocationindex,1,tryAccess(prevLocation,"skipalt"));
            }
            skippedAlt = true;
            curlocation = locations[locationsarr[curlocationindex]];
            updateAdventureScreen();
            enterAdventureScreen();
        } else if (Object.hasOwn(prevLocation,"skipalt") == false) {
            console.log("hi3times");
            if (tryAccess(curlocation,"altdesc")) {
                curlocdesctxt.innerHTML = curlocation.altdesc;
            }
            if (tryAccess(curlocation,"alttext")) {
                curlocation.loretext = curlocation.alttext;
                currenttext = curlocation.loretext;
                loretxt.innerHTML = currenttext;
            }
            
            
        }
        
    } else if (skippedAlt == true) {
        skippedAlt = false;
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
            if (textfinished) {
                proceedtxt.innerHTML = "Begin Fight With "+enemies[typearg].formal;
                travelbtn.innerHTML = "Begin Fight";
            }
            
        }
    } else {
        let nextIndex = curlocationindex+1;
        if (nextIndex == locationsarr.length) {
            nextIndex = curlocationindex;
        }
        proceedtxt.innerHTML = "Travel To Next Location: "+locations[locationsarr[nextIndex]].formal;
        travelbtn.innerHTML = "Travel";
    }
    proceeddesc.innerHTML = curlocation.proceedtext;
    if (Object.hasOwn(curlocation,"special") && skipped == false) {
        curspecial1 = null;
        curspecial2 = null;
        if (tryAccess(curlocation,"excludegui") == false) {
            byId("sc1").style.display = "block";
            byId("sc2").style.display = "block";
            byId("sc3").style.display = "block";
        } else {
            byId("sc1").style.display = "none";
            byId("sc2").style.display = "none";
            byId("sc3").style.display = "none";
        }
        
        let special = curlocation.special;
        shopmod = null;
        curspecials = structuredClone(curlocation.special);
        if (typeof curspecials == "object" && textfinished == true) {
            console.log("hi");
            for (let special in curspecials) {
                handleSpecial(special);
            }
        }
        
        /*if (tryAccess(curlocation,"special") && curlocation.special.includes("|") == false) {
            curspecial1 = curlocation.special;
        } else {
            // e.g. the format goes like shop|special1|special2
            // can also be like noshop|special1 or just special1
            let secondhalf = curlocation.special.split("|");
            shopmod = secondhalf[0];
            secondhalf.splice(0, 1);
            curspecial1 = secondhalf[0];
            curspecial2 = secondhalf[1];
        }*/

        if (curspecial1 == "gaincard" && textfinished == true) {
            
        }
        
        
       
        
        if (zelist.includes(curspecial1) || zelist.includes(curspecial2) && shopmod != "showopt" && !tryAccess(curlocation,"excludegui")) {
            let specialdiv = specialEvent.createWrapper(special);
            specialdiv2.style.display = "none";
            if (curlocation.name == "cosmeticshop") {
                let specialdiv = specialEvent.createWrapper(special);
            }
        }
        
        // END OF IMPORTANT
        
    } else {
        curspecials = {};
        let specialdiv = specialEvent.createWrapper(special);
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
        /*if (emmodallist.includes(curspecial1) || emmodallist.includes(curspecial2)) {
            embtnWrap.style.display = "block";
        } else {
            embtnWrap.style.display = "none";
        }*/
        console.log(curspecial1 != null && curspecial1 != "upgcard" && curspecial1 != "destroycard");
        if (curspecial1 != null && zelist.includes(curspecial1) == false) {
            let specialdiv = specialEvent.createWrapper(special);
            console.log("yo");
        }
        /*if (curspecial2 != null && zelist.includes(curspecial2) == false && curspecial1 != "mystery") {
            specialdiv2.style.display = "block";
        }*/
        if (emmodallist.includes(curspecial1) && (zelist.includes(curspecial2) == true || curspecial2 == null)) {
            let specialdiv = specialEvent.createWrapper(special);
            specialdiv2.style.display = "none";
        }
        if (textfinished == true) {
            loretxt.innerHTML = currenttext;
        }
        /*if (Object.keys(curspecials).includes("gaincard") == true || Object.keys(curspecials).includes("buycard") == true || Object.keys(curspecials).includes("buyrelic") == true) {
            byId("reroll").style.display = "block";
        } else {
            byId("reroll").style.display = "none";
        }*/
        proceedtxt.style.display = "block";
        proceeddesc.style.display = "block";
    }
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
            text: "Click a card to gamble.",
            color: "rgb(155,155,0)",
        },
        "energizer": {
            text: "Click a card to add an energizer foil to it.",
            color: "rgb(200,200,30)",
        },
        "diamondfoil": {
            text: "Click a card to apply a diamond foil.",
            color: "rgb(44, 130, 167)",
        },
        "duplicatecard": {
            text: "Click a card to duplicate.",
            color: "rgb(4, 0, 48)",
        },
    };
    
    // specey means special?
    for (let special in curspecials) {
        if (Object.keys(invspecials).includes(special)) {
            let zespec = special;
            invspecial.innerHTML = invspecials[zespec].text;
            invspecial.style.color = invspecials[zespec].color;
        } else {
            invspecial.innerHTML = "";
        }
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
    let rowlen = 4;
    if (window.matchMedia("(max-width:950px)").matches) {
        rowlen = 3;
    }
    if (screen.width/screen.height < 1.5) {
        rowlen = 3;
    }
    // CARDS
    if (inventorytable != null) {
        inventorytable.remove();
    }
    inventorytable = document.createElement('table');
    inventorytable.id = "inventorytable";
    inventorydiv.appendChild(inventorytable);
    let remainder = Object.keys(p1.deck).length % 4;
    let finaltr;
    
    for (let j = 0; j < Math.ceil(Object.keys(p1.deck).length/rowlen); j++) {
        let zerow = document.createElement('tr');
        if (j-Math.ceil(Object.keys(p1.deck).length/rowlen) == 1) {
            finaltr = zerow;
        }
        inventorytable.appendChild(zerow);
        for (let i = 0; i < rowlen; i++) {
            if ((j*rowlen)+i > Object.keys(p1.deck).length-1) {
                break;
            }
            let card = document.createElement('td');
            let curcard = p1.deck[Object.keys(p1.deck)[(j*rowlen)+i]];
            displayCard(card,curcard);
            card.setAttribute("data-card",Object.keys(p1.deck)[(j*rowlen)+i]);
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
    for (let j = 0; j < Math.ceil(Object.keys(p1.relics).length/rowlen); j++) {
        let zerow = document.createElement('tr');
        if (j-Math.ceil(Object.keys(p1.relics).length/rowlen) == 1) {
            finaltr2 = zerow;
        }
        relictable.appendChild(zerow);
        for (let i = 0; i < rowlen; i++) {
            if ((j*rowlen)+i > Object.keys(p1.relics).length-1) {
                break;
            }
            let relic = document.createElement('td');
            
            relic.style.width = "120px";
            relic.style.height = "120px";
            
            let currelic = p1.relics[Object.keys(p1.relics)[(j*rowlen)+i]];
            displayRelic(relic,currelic);
            zerow.appendChild(relic);
            //relic.appendChild(relictooltip);
        }
    }
    // ITEMS
    if (itemtable != null) {
        itemtable.remove();
    }
    
    itemtable = document.createElement('table');
    itemtable.id = "itemstable";
    itemdiv.appendChild(itemtable);
    
    let finaltr3;
    for (let j = 0; j < Math.ceil(Object.keys(p1.items).length/rowlen); j++) {
        let zerow = document.createElement('tr');
        if (j-Math.ceil(Object.keys(p1.items).length/rowlen) == 1) {
            finaltr3 = zerow;
        }
        itemtable.appendChild(zerow);
        for (let i = 0; i < rowlen; i++) {
            if ((j*rowlen)+i > Object.keys(p1.items).length-1) {
                break;
            }
            let item = document.createElement('td');
            item.style.width = "120px";
            item.style.height = "120px";
            
            let curitem = p1.items[Object.keys(p1.items)[(j*rowlen)+i]];
            
            item.innerHTML = "<span class='title'>"+curitem.formal+":</span>";
            item.innerHTML += "<br><hr><span class='desc'>"+curitem.desc+"</span>";
            let tempimg;
            if (curitem.img != "") {
                tempimg = "url(img/items/"+curitem.name+".png)";  
                item.style.backgroundSize = "120px 120px";
            } else {
                tempimg = "url()";
                item.style.backgroundSize = "120px 120px";
            }
            item.style.backgroundSize = "120px 120px";
            item.style.backgroundImage = tempimg;
            item.className = "tooltipholder";
            let itemtooltip = document.createElement("span");
            itemtooltip.className = "tooltip";
            zerow.appendChild(item);
            let zehtml = `<h3 style="font-size:22px;margin:0;">${curitem.formal}</h3><p style="font-size:14px;">${curitem.desc}<br><br>${curitem.advdesc}<br><br>${curitem.attrname}: ${curitem.attr.toString()}</p>`;
            itemtooltip.innerHTML = zehtml;
            item.appendChild(itemtooltip);
            
        }
    }
    Array.from(document.getElementsByClassName("inventorytablecard")).forEach(function(element) {
        element.addEventListener('click', function() {
            if (magnify_on) {
                magnify(p1.deck[element.getAttribute("data-card")]);
                return;
            }
            let card = p1.deck[element.getAttribute("data-card")];
            if (focusedSpecial == "destroycard") {
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
                    p1.coins += randNum(10,40);
                    if (randNum(1,2) == 1) {
                        p1.health += 30;
                    } else {
                        p1.health -= 30;
                    }
                    if (p1.health > p1.maxhealth) {
                        p1.health = p1.maxhealth;
                    }
                    
                }
                invspecial.innerHTML = "CARD DESTROYED!";
                if (card.name == "spearman") {
                    unlockCounters.a1 += 1;
                    if (unlockCounters == 3) {
                        
                        addUnlock("a1");
                    }
                }
                delete p1.deck[element.getAttribute("data-card")];
                updateAdventureScreen();
            }
            if (focusedSpecial == "upgcard") {
                if (curlocation.name == "unclerictorappear") {
                    if (speciallock < 3) {
                        let card = p1.deck[element.getAttribute("data-card")];
                        let upgradeStats = card.upgrades[card.level+1];
                        if (card.upgrades[card.level+1] == undefined) {  // ensure card cannot be over upgraded
                            invspecial.innerHTML = `CARD IS AT MAX LEVEL`;
                            return false;
                        }
                        // subtract money by cost
                        if (p1.coins < upgradeStats.cost) {
                            invspecial.innerHTML = `INSUFFICIENT FUNDS, NEED ${upgradeStats.cost}`;
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
                            card[upgAttr] = lib.enhUpgrade(card[upgAttr],upgValue); // enhanced upgrade function for array compatibility
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
                        invspecial.innerHTML = "CARD UPGRADED!";
                        updateAdventureScreen();
                    } else {
                        invspecial.innerHTML = "MAX CARD UPGRADES REACHED";
                    }
                }
                if (curlocation.name == "cosmeticshop") {
                    if (speciallock2 < 2) {
                        // speciallock means you cannot upgrade more than twice (or once if a card has been bought)
                        if (speciallock == true && speciallock2 == 1) {
                            invspecial.innerHTML = "MAX CARD UPGRADES REACHED";
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
                        invspecial.innerHTML = "CARD UPGRADED!";
                        updateAdventureScreen();
                    } else {
                        embtnWrap.style.display = "none";
                        invspecial.innerHTML = "MAX CARD UPGRADES REACHED";
                    }
                }
                
                if (curlocation.name == "jamodarcards2") {
                    if (speciallock < 3) {
                        let card = p1.deck[element.getAttribute("data-card")];
                        let upgradeStats = card.upgrades[card.level+1];
                        if (card.upgrades[card.level+1] == undefined) {  // ensure card cannot be over upgraded
                            invspecial.innerHTML = `CARD IS AT MAX LEVEL`;
                            return false;
                        }
                        // subtract money by cost
                        if (p1.coins < upgradeStats.cost) {
                            invspecial.innerHTML = `INSUFFICIENT FUNDS, NEED ${upgradeStats.cost}`;
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
                            card[upgAttr] = lib.enhUpgrade(card[upgAttr],upgValue); // enhanced upgrade function for array compatibility
                        }
                        invspecial.innerHTML = "CARD UPGRADED!";
                        updateAdventureScreen();
                    } else {
                        invspecial.innerHTML = "MAX CARD UPGRADES REACHED";
                    }
                }
            }
            if (focusedSpecial == "sacrificecard") {
                if (curlocation.sacrificedcard != undefined) {
                    let card = p1.deck[element.getAttribute("data-card")];
                    let upgradeStats = card.upgrades[card.level+1];
                    if (card.upgrades[card.level+1] == undefined) {  // ensure card cannot be over upgraded
                        invspecial.innerHTML = `CARD IS AT MAX LEVEL`;
                        return false;
                    }
                    // subtract money by cost
                    if (p1.coins < Math.round(upgradeStats.cost/5)) {
                        invspecial.innerHTML = `INSUFFICIENT FUNDS, NEED ${Math.round(upgradeStats.cost/5)}`;
                        return false;
                    } else {
                        p1.coins -= Math.round(upgradeStats.cost/5);
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
                        card[upgAttr] = lib.enhUpgrade(card[upgAttr],upgValue); // enhanced upgrade function for array compatibility
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
                    curlocation.sacrificedcard = undefined;
                    invspecial.innerHTML = "CARD UPGRADED!";
                    updateAdventureScreen();
                } else {
                    if (Object.keys(p1.deck).length < 2) {
                        invspecial.innerHTML = "Can't sacrifice last card!";
                        return;
                    }
                    let card = p1.deck[element.getAttribute("data-card")];
                    curlocation.sacrificedcard = card;
                    delete p1.deck[element.getAttribute("data-card")];
                    invspecial.innerHTML = "CARD HAS BEEN SACRIFICED";
                    updateAdventureScreen();
                }
            }
            if (focusedSpecial == "gamble") {
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
                    card.hp = Math.round(card.hp);
                    if (Object.hasOwn(card,"atk")) {
                        card.atk *= 1.5;
                        card.atk = Math.round(card.atk);
                    }
                    if (Object.hasOwn(card,"heal")) {
                        card.heal *= 1.5;
                        card.heal = Math.round(card.heal);
                    }
                } else {
                    delete p1.deck[element.getAttribute("data-card")];
                }
                updateAdventureScreen();
            }
            
            if (focusedSpecial == "energizer" && p1.coins >= 150 && speciallock2 < 2) {
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
                invspecial.innerHTML = "CARD ENERGIZED!";
                updateAdventureScreen();
            }
            if (focusedSpecial == "infernalfoil" && speciallock == false && p1.deck[element.getAttribute("data-card")].cardmods.includes("infernalfoil") == false) {
                if (p1.coins < 300) {
                    invspecial.innerHTML = "Need 300 CC for Infernal Foil!";
                    return false;
                }
                if (typeof speciallock == "number") {
                    return false;
                }
                speciallock = true;
                p1.coins -= 300;
                let card = p1.deck[element.getAttribute("data-card")];
                card.cardmods.push("infernalfoil");
                invspecial.innerHTML = "Infernal Foil Applied!";
                updateAdventureScreen();
            }
            if (focusedSpecial == "diamondfoil" && p1.coins >= 200 && speciallock == false && p1.deck[element.getAttribute("data-card")].cardmods.includes("diamondfoil") == false) {
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
                invspecial.innerHTML = "Diamond Foil Applied!";
                updateAdventureScreen();
            }
            if (focusedSpecial == "duplicatecard" &&speciallock == false) {
                speciallock = true;
                p1.coins += 50;
                let card = p1.deck[element.getAttribute("data-card")];
                let names = element.getAttribute("data-card");
                // gets the name
                if (/\d/.test(names)) {
                    names = names.substring(0,names.length-1);
                }
                let tries = 0;
                let newname;
                // adds a number at the end to avoid similar card names
                do {
                    newname = names+tries;
                    tries++;
                } while (Object.keys(p1.deck).includes(newname) == true && tries < 50);
                p1.deck[newname] = structuredClone(card);
                invspecial.innerHTML = "Card Duplicated!";
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
        if (Object.keys(p1.relics).includes("lightningbean")) {
            p1.mana += 1;
        }
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
    if (unlocksLoaded == false) {
        loadUnlocks();
    }
    
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
        createLocations();
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
    window.setTimeout(annotateText,1000,element.getElementsByTagName('p')[0]);
    element.addEventListener('click', function() {
        if (debouncetimer < 30) {
            return false;
        }
        startmod = element.getAttribute("data-character");
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
        if (rerolls > 0 && (p1.coins >= 15 || startmod == "greg")) {
            p1.coins -= 15;
            rerolls--;
            unlockCounters.total_rerolls += 1;
            if (unlockCounters.total_rerolls >= 15) {
                addUnlock("a2");
            }
            Array.from(document.getElementsByClassName("specialcard")).forEach(function(element) {
                element.style.border = "2px solid black";
            });
            if (rerolls <= 0) {
                byId("reroll").style.display = "none";
            }
            enterAdventureScreen();
        }
    });
});
function handleSpecialCard(element) {
    if (element.hasAttribute("data-fight")) {
        if (element.hasAttribute("data-cost")) {
            p1.coins -= Number(element.getAttribute("data-cost"));
        }
        startBattle(element.getAttribute("data-fight"));
        fullSD(adventurescreen,gamescreen,"none","block");
        currenttext = "";
        textfinished = false;
        currenttextnum = 0;
        rerolls = 5;
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
    let special = element.getAttribute("data-special");
    let choice = Number(element.getAttribute('data-choice'));
    if (isNaN(choice)) {
        choice = element.getAttribute('data-choice');
    }
    let data = tryAccess(curlocation.special,special,{});
    if (special == "custom" || special =="setpart") {
        // using data.id, you can add special stuff for custom events
        data = tryAccess(curlocation.special.custom.choices,choice,{});
    }
    if (element.hasAttribute("data-specialset")) {
        curspecial1 = element.getAttribute("data-specialset");
    }
    console.log(data,choice,special);
    if (Object.hasOwn(data,"cost")) {
        console.log(data.cost);
        if ((Object.hasOwn(data,"pay") || startmod == "greg") || p1.coins >= data.cost) {
            p1.coins -= data.cost;
        } else {
            return;
        }
        
    }
    if (Object.hasOwn(data,"heal")) {
        p1.health += data.heal;
        if (!tryAccess(data,"maxheal")) {
            if (p1.health > p1.maxhealth) {
                p1.health = p1.maxhealth
            }
        }
    }
    if (Object.hasOwn(data,"maxheal")) {
        p1.maxhealth += data.maxheal;
    }
    if (Object.hasOwn(data,"coins")) {
        p1.coins += data.coins;
    }
    
    if (Object.hasOwn(data,"managain")) {
        p1.managain += data.managain;
    }
    if (Object.hasOwn(data,"maxdiscards")) {
        p1.maxdiscards += data.maxdiscards;
    }
    if (Object.hasOwn(data,"gainitem")) {
        addItem("p1",data.gainitem[0],data.gainitem[1]);
    }
    if (Object.hasOwn(data,"loseitem")) {
        removeItem("p1",data.loseitem[0],data.loseitem[1]);
    }
    if (special == "focus-special") {
        focusedSpecial = choice;
    }
    if (special == "setpart") {
        setLoc("addpart",[curlocation.name,data.setpart]);
        nextLoc();
        travel();
    }
    if (special == "setloc") {
        setLoc("addloc",[curlocation.name,data.setloc]);
        nextLoc();
        travel();
    }
    console.log(special);
    if (special == 'gaincard' && element.hasAttribute("data-card")) {
        if (curlocation.name == "cosmeticshop" && speciallock2 == 2) {
            return false;
        }
        let num = Object.keys(curspecials).includes("gaincard");
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
    if (special == "buycard" && element.hasAttribute("data-card") && element.hasAttribute("data-cost")) {
        let card = element.getAttribute("data-card");
        if (p1.coins >= Number(element.getAttribute("data-cost")) || startmod == "greg") {
            p1.coins -= Number(element.getAttribute("data-cost"));
        } else {
            return false;
        }
        drawCard("p1",true,card,"addToDeck");
        updateAdventureScreen();
        element.style.border = "7px solid black";
    }
    console.log(element.getAttribute('data-relic'),element.getAttribute('data-cost'),element.style.border,p1.coins,element.getAttribute('data-cost'))
    if (special == "buyrelic" && element.hasAttribute("data-relic") && element.hasAttribute("data-cost")) {
        let relic = element.getAttribute("data-relic");
        if (p1.coins >= Number(element.getAttribute("data-cost")) || startmod == "greg") {
            p1.coins -= Number(element.getAttribute("data-cost"));
        } else {
            return false;
        }
        addRelic("p1",relic);
        updateAdventureScreen();
        element.removeAttribute('data-relic');
        
        element.style.border = "7px solid black";
    }
    if (special == "mystery" && p1.coins >= 120 && speciallock < 3) {
        p1.coins -= 120;
        if (typeof speciallock == "boolean") {
            speciallock = 1;
        } else {
            speciallock++;
        }
        drawCard("p1",false,null,["addToDeck","doubleStats"]);
        updateAdventureScreen();
    }
    if (special == "speedingcar" && speciallock == false) { // damage card or take damage
        speciallock = true;
        console.log(choice);
        if (choice == 1) { // first option, debuffs cards
            for (let i =0; i < 2; i++) {
                let card = randKey(p1.deck);
                card.hp *= randNum(7,9)/10;
                if (Object.hasOwn(card,"atk")) {
                    card.atk = Math.round(card.atk*randNum(8,9.5)/10);
                }
                if (Object.hasOwn(card,"heal")) {
                    card.heal = Math.round(card.heal*randNum(8,9.5)/10);
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
    if (special == "beancandispenser" && p1.coins >= 30) {
        p1.coins -= 30;
        p1.health += 50;
        p1.maxhealth += 50;
        updateAdventureScreen();
    }
    if (Object.keys(curspecials).includes("drinkrobot")) {
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
    if (Object.keys(curspecials).includes("gainpower") && speciallock ==false) {
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
        }
        addItem("p1","power",1);
        updateAdventureScreen();
    }
    if (special == "risk" && Object.keys(p1.deck).length > 1) { // delete all cards except one, that card becomes the paragon.
        let card = randKey(p1.deck);
        let boostCount = 1;
        Object.keys(p1.deck).forEach(function(key) {
            if (p1.deck[key] != card) {
                boostCount += 0.25;
                delete p1.deck[key];
            }
        });
        card.hp *= boostCount;
        if (Object.hasOwn(card,"atk")) {
            card.atk *= boostCount;
        }
        if (Object.hasOwn(card,"cool")) {
            card.cool = 1;
        }
        addItem("p1","power",1);
        updateAdventureScreen();
    }
    if (special == "unclemanstatue") { // give random card at cost of 100 hp
        speciallock = true;
        let card = lib.weight(cardLootTables.standard);
        drawCard("p1",true,card.name,"addToDeck");
        p1.health -= 100;
        p1.coins += randNum(20,100);
        if (p1.health < 1) {
            p1.health = 1;
        }
        updateAdventureScreen();
    }
    if (special == "flamebean") { // give flamebean relic
        speciallock = true;
        p1.health -= 50;
        let key = {};
        assign(key,relics.flamebean);
        p1.relics["flamebean"] = key;
        updateAdventureScreen();
    }
    if (special == "celestial") { // add celestial striker to deck
        p1.health -= 100;
        speciallock = true;
        drawCard("p1",true,"celestialstriker","addToDeck");
        addItem("p1","power",1);
    }
    if (special == "rest" && !speciallock) {
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
    if (special == "knowledge") {
        speciallock = true;
        if (choice == 1) {
            p1.managain += 0.5;
        } else if (choice == 2) {
            let am = Math.round(p1.maxhealth/4);
            p1.maxhealth += am;
            p1.health += am;
        }
        updateAdventureScreen();
    }
    if (special == "crowattack" && speciallock ==false) {
        // lose two random cards or 80 health
        speciallock = true;
        if (choice == 1 && Object.keys(p1.deck).length > 2) {
            let zecards = sample(Object.keys(p1.deck),2);
            for (let i =0; i < zecards.length; i++) {
                delete p1.deck[zecards[i]];
            }
        } else {
            p1.health -= 80;
        }
        updateAdventureScreen();
    }
    if (special == "suddenurge" && speciallock ==false) {
        speciallock = true;
        p1.health -= 80;
        updateAdventureScreen();
    }
    if (special=="danceclubspill" && speciallock ==false) {
        speciallock = true;
        if (choice == 2 && Object.keys(p1.deck).length > 2) {
            let zecards = sample(Object.keys(p1.deck),randNum(1,2));
            for (let i =0; i < zecards.length; i++) {
                delete p1.deck[zecards[i]];
            }
        } else {
            let zecards = sample(Object.keys(p1.deck),randNum(1,2));
            for (let i =0; i < zecards.length; i++) {
                delete p1.deck[zecards[i]];
            }
            let card = lib.weight(cardLootTables.standard);
            drawCard("p1",true,card,"addToDeck");
            card = lib.weight(cardLootTables.standard);
            drawCard("p1",true,card,"addToDeck");
        }
        
    }
    if (special=="donate") {
        if (p1.coins >= 10 || startmod == "greg") {
            data.count += 1;
            p1.coins -= 10;
            if (data.count % 10 == 0) {
                addItem("p1","blessing",1);
                addUnlock("d1");
            }
        }
    }
    if (special=="cardtornado" && speciallock ==false) {
        speciallock = true;
        if (choice == 1) {
            let card = lib.weight(cardLootTables.standard);
            drawCard("p1",true,card,"addToDeck");
            card = lib.weight(cardLootTables.standard);
            drawCard("p1",true,card,"addToDeck");
        } else {
            p1.health -= 80;

        }
        
    }
    if (special=="jamodarcardsvendingmachine" && speciallock ==false && p1.coins >= 50) {
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
            let rand2 = randNum(-20,20);
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
    if (special=="jamodarcardsdealer" && speciallock ==false) {
        speciallock = true;
        let chosen = randNum(1,3);
        if (choice == chosen) {
            p1.coins += 100;
        } else {
            p1.coins -= 100;
        }
    }
    if (special=="strongwinds" && speciallock ==false) {
        speciallock = true;
        if (choice == 1 && Object.keys(p1.deck).length > 1) {
            // option 1: lose a card & a few coins
            let zecard = randItem(Object.keys(p1.deck));
            delete p1.deck[zecard];
            p1.coins -= randNum(15,70);
            if (p1.coins < 0) {
                p1.coins = 0;
            }
        } else {
            // option 2: lose 30 max health
            p1.maxhealth -= 30;
            if (p1.health > p1.maxhealth) {
                p1.health = p1.maxhealth;
            }
        }
    }
    if (special=="filoriver" && speciallock ==false) {
        // the subscription costs 150 coda coins
        speciallock = true;
        p1.coins -= 150;
    }
    if (special=="filomeats") {
        if (choice == 1 && p1.coins >= 100) {
            // option 1: +50 max health, fs for 5 battles
            p1.maxhealth += 50;
            p1.health += 50;
            addItem("p1","fullstomach",5);
            p1.coins -= 100;
        } else if (choice == 2 && p1.coins >= 100) {
            // option 2: +75 max health, fs for 3 battles
            p1.maxhealth += 75;
            p1.health += 75;
            addItem("p1","fullstomach",3);
            p1.coins -= 100;
        } else if (choice == 3 && p1.coins >= 50) {
            // option 3: -50 max health, fs 
            p1.maxhealth -= 50;
            p1.health -= 50;
            addItem("p1","flaming",10);
            p1.coins -= 50;
            checkDead();
        }
    }
    element.style.border = "7px solid black";
    
    if (Object.hasOwn(data,"choices") && Object.hasOwn(data.choices[choice],"actiontext")) {
        byId("aftertext").innerHTML += data.choices[choice].actiontext;
        annotateText(byId("aftertext"));
    }
    if (Object.hasOwn(data,"actiontext")) {
        byId("aftertext").innerHTML += data.actiontext;
        annotateText(byId("aftertext"));
    }
    if (con1) {
        byId("aftertext").innerHTML += curlocation.actiontext;
        annotateText(byId("aftertext"));
    }
    if (con2) {
        enterAdventureScreen();
    }
    updateAdventureScreen();
}
Array.from(document.getElementsByClassName("specialcard")).forEach(function(element) {
    // SPECIALHANDLING BOOKMARK
    element.addEventListener('click', () => {
        handleSpecialCard(element);
    });
});
Array.from(document.getElementsByClassName("asp-main")).forEach(function(element) {
    element.addEventListener("click",function() {
        if (element.hasAttribute("data-specialset")) {
            curspecial1 = element.getAttribute("data-specialset");
        }

        if (Object.keys(curspecials).includes("choosecard") && element.hasAttribute("data-card")) {
            if (curlocation.name == "cosmeticshop" && speciallock2 == 2) {
                return false;
            }
            let num = Object.keys(curspecials).includes("choosecard");
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
        if (Object.keys(curspecials).includes("buycard") == true && element.hasAttribute("data-card") && element.hasAttribute("data-cost")) {
            let card = element.getAttribute("data-card");
            if (p1.coins >= Number(element.getAttribute("data-cost")) || startmod=="greg") {
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
    skipped = false;
    speciallock = false;
    speciallock2 = false;
    let specialdiv = specialEvent.createWrapper(special);
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
            p1.coins -= 600;
            fullSD(adventurescreen,menuscreen,"none","block");
            sob = 2;
            //window.setTimeout(enterAdventureScreen,200);
            gametitle.innerHTML = "Coda At Last!";
            playbtn.innerHTML = "CONTINUE";
            byId("changelog-btn").style.display = "none";
            nextLoc();
            
            currenttext = "";
            textfinished = false;
            currenttextnum = 0;
            rerolls = 5;
            return false;
            if (p1.coins < 600) {
                resetBattleUI();
                fullSD(adventurescreen,menuscreen,"none","block");
                sob = 2;
                //window.setTimeout(enterAdventureScreen,200);
                gametitle.innerHTML = "You Lose..";
                playbtn.innerHTML = "RESTART";
                byId("changelog-btn").style.display = "none";
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
        textfinished = false;
        currenttext = "";
        currenttextnum = 0;
        rerolls = 5;
        cardoffer.setAttribute("data-taken","no");
        relicoffer.setAttribute("data-taken","no");
        // reset offers
        offerwrapper.style.display = "none";
        offeredCard = {};
        offeredRelic = "";
        cardoffer.classList.add("hide");
        relicoffer.classList.add("hide");
         
    }
    if (travelbtn.innerHTML == "Begin Fight") {
        startBattle(curlocation.proceedspecial.split("|")[1]);
        fullSD(adventurescreen,gamescreen,"none","block");
        currenttext = "";
        textfinished = false;
        currenttextnum = 0;
        rerolls = 5;
    }
    if (travelbtn.innerHTML == "Next") {
        if (curlocation.loretext.includes("||") && textfinished == false) {
            let texts = curlocation.loretext.split("||");
            let text = texts[currenttextnum];
            if (currenttextnum > 0) {
                text = "<br>"+text;
            }
            if (currenttextnum-texts.length >= -1) {
                console.log("hi");
                textfinished = true;
                currenttextnum = 0;
            } else {
                currenttextnum += 1;
            }
            currenttext += text;
            enterAdventureScreen();
        }
        
    }
}
travelbtn.addEventListener("click", function() {
    skipped = false;
    speciallock = false;
    speciallock2 = false;
    let specialdiv = specialEvent.createWrapper(special);
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
            p1.coins -= 600;
            fullSD(adventurescreen,menuscreen,"none","block");
            sob = 2;
            //window.setTimeout(enterAdventureScreen,200);
            gametitle.innerHTML = "Coda At Last!";
            playbtn.innerHTML = "CONTINUE";
            byId("changelog-btn").style.display = "none";
            nextLoc();
            
            currenttext = "";
            textfinished = false;
            currenttextnum = 0;
            rerolls = 5;
            return false;
            if (p1.coins < 600) {
                resetBattleUI();
                fullSD(adventurescreen,menuscreen,"none","block");
                sob = 2;
                //window.setTimeout(enterAdventureScreen,200);
                gametitle.innerHTML = "You Lose..";
                playbtn.innerHTML = "RESTART";
                byId("changelog-btn").style.display = "none";
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
        textfinished = false;
        currenttext = "";
        currenttextnum = 0;
        rerolls = 5;
        cardoffer.setAttribute("data-taken","no");
        relicoffer.setAttribute("data-taken","no");
        // reset offers
        offerwrapper.style.display = "none";
        offeredCard = {};
        offeredRelic = "";
        cardoffer.classList.add("hide");
        relicoffer.classList.add("hide");
         
    }
    if (travelbtn.innerHTML == "Begin Fight") {
        startBattle(curlocation.proceedspecial.split("|")[1]);
        fullSD(adventurescreen,gamescreen,"none","block");
        currenttext = "";
        textfinished = false;
        currenttextnum = 0;
        rerolls = 5;
    }
    if (travelbtn.innerHTML == "Next") {
        if (curlocation.loretext.includes("||") && textfinished == false) {
            let texts = curlocation.loretext.split("||");
            let text = texts[currenttextnum];
            if (currenttextnum > 0) {
                text = "<br>"+text;
            }
            if (currenttextnum-texts.length >= -1) {
                console.log("hi");
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
        textfinished = false;
        adventurescreen.style.opacity = 0;
        currenttext = "";
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
cardoffer.addEventListener("click",function() {
    if (cardoffer.getAttribute("data-taken") == "no") {
        cardoffer.setAttribute("data-taken","yes");
        drawCard("p1",true,offeredCard,["setcard","addToDeck"]);
        updateAdventureScreen();
    }
});
relicoffer.addEventListener("click",function() {
    if (relicoffer.getAttribute("data-taken") == "no") {
        relicoffer.setAttribute("data-taken","yes");
        addRelic("p1",offeredRelic);
        updateAdventureScreen();
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
var annot_in = [".text-yell{",".text-blue{",".text-purp{",".text-green{",".text-red{",".text-highlight~~{",".text-linedeco~~{",".text-custom~~{",".text-woah{",".text-skewdash{",".text-italic{",".text-bold{",".text-maxi{",".text-positive{",".text-negative{",".text-number{",".text-quote{",".text-large{",".text-mini{",".text-small{",".text-white-hi{",".text-yell-hi{",".text-purp-hi{",".text-black-hi{",".text-code{",".text-feebolum{"
];
var annot_out = ["<span class='text-yell'>|||</span>","<span class='text-blue'>|||</span>","<span class='text-purp'>|||</span>","<span class='text-green'>|||</span>","<span class='text-red'>|||</span>","<mark style='background-color:zespecial;'>|||</mark>","<span style='text-decoration:zespecial;'>|||</span>","<span style='zespecial'>|||</span>","<span class='text-woah'>|||</span>","<div class='text-skewdash'><span>|||</span></div>","<span style='font-style:italic;'>|||</span>","<span style='font-weight:bolder;'>|||</span>","<span class='text-maxi'>|||</span>","<span class='text-positive'>|||</span>","<span class='text-negative'>|||</span>","<span class='text-number'>|||</span>","<span class='text-quote'>|||</span>","<span class='text-large'>|||</span>","<span class='text-mini'>|||</span>","<span class='text-small'>|||</span>","<mark class='text-white-hi'>|||</mark>","<mark class='text-yell-hi'>|||</mark>","<mark class='text-purp-hi'>|||</mark>","<mark class='text-black-hi'>|||</mark>","<span class='text-code'>|||</span>","<span class='text-feebolum'>|||</span>"];
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
    backpackToggle();
});
function backpackToggle() {
    if (backpackactive == true) {
        backpackactive = false;
        byId("a1").style.width = "100%";
        byId("a2").style.width = "0px";
    } else {
        backpackactive =true;
        byId("a1").style.width = "50%";
        byId("a2").style.width = "50%";
    }
}
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
        let val = byId("cheat-input").value;
        if (zecheat == 1) {
            p2.health = 0;
            update();
        }
        if (zecheat == 2) {
            drawCard("p1",true,val,["addToDeck"]);
        }
        if (zecheat == 3) {
            p1.coins += Number(val);
        }
        if (zecheat == 4) {
            p1.deck[val] = lib.levelUp(p1.deck[val],1);
        }
        if (zecheat == 5) {
            addRelic("p1",val);
        }
        if (zecheat == 6) {
            if (locationsarr.includes(val)) {
                curlocationindex = locationsarr.indexOf(val)-1;
                travelbtn.innerHTML = "Travel";
                travel();
                enterAdventureScreen();
            } else {
                locationsarr.splice(curlocationindex,0,val);
                curlocationindex--;
                travelbtn.innerHTML = "Travel";
                travel();
                enterAdventureScreen();
            }
        }
        updateAdventureScreen();
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
function addUnlock(unlock) {
    if (currentUnlocks.includes(unlock) == false && loadedUnlocks.includes(unlock) == false && Object.keys(unlocks).includes(unlock)) {
        currentUnlocks += unlock+";";
        byId("unlocks-txt").value = currentUnlocks;
        
        byId("unlock-notif").classList.remove("hide");
        byId("unlock-notif").style.top = "50%";
        byId("unlock-notif").style.background = "ghostwhite";
        byId("unlock-title").innerHTML = unlocks[unlock].formal;
        byId("unlock-desc").innerHTML = unlocks[unlock].desc;
    }
}
function hasUnlock(unlock) {
    let text = loadedUnlocks.split(";");
    return text.includes(unlock);
}
function loadUnlocks() {
    unlocksLoaded = true;
    loadedUnlocks = byId("unlocks-txt").value;
    handleUnlocks(loadedUnlocks);
    currentUnlocks = loadedUnlocks;
}
byId("load-unlocks").addEventListener("click", () => {
    loadUnlocks();
    
});
byId("save-unlocks").addEventListener("click",() => {
    let copyText = byId('unlocks-txt');
    copyText.select();
    copyText.setSelectionRange(0,99999);
    navigator.clipboard.writeText(copyText.value);
    alert("Copied text!");
});

function handleUnlocks(unlockText) {
    let unlockArr = unlockText.split(";");
    for (let i =0; i < unlockArr.length; i++) {
        let unlock = unlockArr[i];
        
        if (Object.keys(unlocks).includes(unlock) == false) {
            continue;
        }
    }
    for (let i =0; i<Object.keys(unlocks).length;i++) {
        let unlock = Object.keys(unlocks)[i];
        if (unlockArr.includes(unlock)) {
            continue
        }
        if (unlock == "a1") delete cardLootTables.standard.bloodstainedspear;
        if (unlock == "d1") document.querySelectorAll("[data-character='greg']")[0].classList.add("hide");
    }
}