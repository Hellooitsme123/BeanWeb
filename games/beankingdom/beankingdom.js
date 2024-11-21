var kingdom = {
    resources: 50,
    maxResources: 100,
    people: 50,
    maxPeople: 100,
    morale: 50,
    maxMorale: 100,
    money: 50,
    maxMoney: 100,
    defense: 0,
}
var events = {
    "asylum_seekers": {
        person: "Ragged People",
        text: "Please.. can we join your kingdom? We won't do anything wrong!",
        yesResults:2,
        noResults:1,
        yesResponse: ["Thank you! We will defend you with our lives!","You really fell for that? Your kingdom will crumble to Loda!"],
        noResponse: ["Really? What a heartless ruler.."],
        yesEffect: [[0,10,0,0],[-10,-10,-10,-10]],
        noEffect: [[0,0,-10,0]],
    },
    "trade_post": {
        person: "Entrepreneur",
        text: "I think we should build a trade post. It might make a few people angry, but it'll make us lots of money.",
        yesResults: 2,
        noResults: 1,
        yesResponse: ["Great! A few people lost their homes, but business is booming!","Uh oh, the trade post hasn't been going well. It was all for nothing."],
        noResponse: ["Seriously? People these days don't care about innovation."],
        yesEffect: [[-5,-5,-5,12],[-5,-5,-10,0]],
        noEffect: [[0,0,-5,0]],
    },
    "trapped_magicfly": {
        person: "Trapped Magicfly",
        text: "Can you let me out? I want to explore the world!",
        yesResults: 1,
        noResults: 1,
        yesResponse: ["Yay!"],
        noResponse: ["Aw man.."],
        yesEffect: [[0,1,10,0,"magicfly_mess"]],
        noEffect: [[0,0,-5,0]],
    },
    "food_storage": {
        person: "Advisor",
        text: "Your Highness, I think we should create a food storage. It will cost 10 gold and 10 materials, but it will be much better for us in the long run.",
        yesResults: 1,
        noResults: 1,
        yesResponse: ["Amazing choice. This will greatly benefit our kingdom."],
        noResponse: ["I predict a dark future.."],
        yesEffect: [[-10,0,0,-10,"food_storage"]],
        noEffect: [[0,0,0,0]],
    },
    "greater_defense": {
        person: "Army General",
        text: "Sir, the kingdom is under attack! We must defend our kingdom!",
        yesResults: 2,
        noResults: 1,
        yesResponse: ["Thank you! We shall be protected for the next few weeks.","It failed! It wasn't enough to fend off the invaders.."],
        noResponse: ["This is a mission of death.."],
        yesEffect: [[-5,0,10,-5],[-5,-10,-10,-5]],
        noEffect: [[0,-15,-15,0]],
    },
    "circus": {
        person: "Clown",
        text: "Can I host a circus? It'll take some materials, but it'll be super fun!",
        yesResults: 1,
        noResults: 1,
        yesResponse: ["It was amazing!"],
        noResponse: ["This isn't the last time I'll ask.."],
        yesEffect: [[-5,5,10,-5]],
        noEffect: [[0,0,-7,0]],
    },
    "rolli_trade_1": {
        person: "Rolli King",
        text: "If you give me some of your people, I'll offer 20 materials. Deal?",
        yesResults: 1,
        noResults: 1,
        yesResponse: ["A trade is a trade."],
        noResponse: ["You should really manage your relationships with other kingdoms."],
        yesEffect: [[20,-10,0,0]],
        noEffect: [[0,0,0,0]],
    },
    "sage_1": {
        person: "Sage",
        text: "May I test out one of my spells on your people?",
        yesResults: 2,
        noResults: 1,
        yesResponse: ["It went amazing! Gold is everywhere!","Umm.. I might have turned a few people into goblins.."],
        noResponse: ["Fine. I'll go get some test subjects myself."],
        yesEffect: [[0,0,8,15],[0,-7,-10,0]],
        noEffect: [[0,0,-7,0]],
    },
    "miner": {
        person: "Mining Captain",
        text: "Hey, can I take a few people to help me in the mines? We'll get a lot of resources!",
        yesResults: 1,
        noResults: 1,
        yesResponse: ["Here it is!"],
        noResponse: ["Seriously?"],
        yesEffect: [[12,-7,0,5]],
        noEffect: [[0,0,-8,0]],
    },
    "increased_production": {
        person: "Entrepreneur.",
        text: "We should start producing more stuff. The smoke might make a few angry, but we need this money now.",
        yesResults: 1,
        noResults: 1,
        yesResponse: ["They're pretty mad, but who cares?"],
        noResponse: ["Rulers hate efficiency."],
        yesEffect: [[7,-4,-8,10]],
        noEffect: [[0,0,-6,0]],
    },
    "bear_migrants": {
        person: "Bear",
        text: "Can I bring my family to leave here? People won't like it.",
        yesResults: 1,
        noResults: 1,
        yesResponse: ["Thanks!"],
        noResponse: ["Man, I wanted to meet them."],
        yesEffect: [[0,10,-6,0]],
        noEffect: [[0,0,-6,0]],
    },
    "kick_out": {
        person: "Angry Citizen",
        text: "We should kick out everyone above the age of 50. They're using too many resources!",
        yesResults: 1,
        noResults: 1,
        yesResponse: ["Good! Now I don't have to deal with them."],
        noResponse: ["YOU DON'T CARE ABOUT ME???"],
        yesEffect: [[7,-10,8,0]],
        noEffect: [[0,0,-6,0]],
    },
    "its_claus": {
        person: "Claus",
        text: "Do you want to become a grunch, or a sainte?",
        options: ["Grunch","Sainte"],
        yesResults: 1,
        noResults: 1,
        yesResponse: ["Grunch it is."],
        noResponse: ["Sainte it is."],
        yesEffect: [[10,10,10,10,"grunch"]],
        noEffect: [[-10,-10,-10,-10,"sainte"]],
    },
    // research
    "research_investment": {
        person: "Scientist",
        text: "Your Majesty, it would be a great idea to invest in research and science. Innovation is key.",
        yesResults: 1,
        noResults: 1,
        yesResponse: ["Good. In time, you will see researchers come in with inventions."],
        noResponse: ["How did Rome fall?"],
        yesEffect: [[-10,0,0,-20,"research_1"]],
        noEffect: [[0,0,0,0]],
    },
    "pogo_stick": {
        person: "Engineer",
        text: "I have come up with this amazing pogo-stick idea! Please, if you give me resources and money, I'll make it super popular!",
        unlock: ["research_1"],
        yesResults: 1,
        noResults: 1,
        yesResponse: ["Thank you!"],
        noResponse: ["Man, this was all for nothing."],
        yesEffect: [[-5,0,0,-5,"pogo_stick"]],
        noEffect: [[0,0,-5,0]],
    },
    "army_research": {
        person: "Army General",
        text: "We should invest in the army. It will protect us in the future.",
        unlock: ["research_1"],
        yesResults: 1,
        noResults: 1,
        yesResponse: ["I will get to work immediately."],
        noResponse: ["People will invade soon! This kingdom is not protected by the imaginary shield you think it is!"],
        yesEffect: [[-5,0,0,-5,"defense_1"]],
        noEffect: [[0,0,0,0]]
    }
};
var specialEvents = {
    "taxes": {
        person: "Tax Collector",
        text: "It's that time of the month again. Give me your taxes!",
        yesResults:1,
        noResults:1,
        yesResponse:["Good. See you soon!"],
        noResponse:["Well, you asked for it."],
        yesEffect:[[0,0,0,-10]],
        noEffect:[[-30,-30,-30,0]],
    },
    "magicfly_mess": {
        person: "Magic Fly",
        text: "Um.. I kind of made a big mess.",
        type: "nochoice",
        results: 1,
        effects: [[-10,-5,0,0]],
    },
    "grunch": {
        person: "You",
        text: "As your kingdom slowly crumbles, you mutter to yourself: 'Have I really become a monster?'. A wonder it is, the illusion of choice.",
        type: "nochoice",
        results: 1,
        effects: [[-20,-20,-20,-20]],
    },
    "sainte": {
        person: "You",
        text: "Your good deeds have had a good effect. You may have had to give, but all that you have given has ricocheted back to you.",
        type: "nochoice",
        results: 1,
        effects: [[20,20,20,20]],
    },
};
var allEvents = Object.assign({}, events,specialEvents);
var occupied = [];
var permEffects = [];
var eventNum = 0;
var eventP = byId("eventP")
var eventNumP = byId("eventNumP");
var resourcesP = byId("resourcesP");
var peopleP = byId("peopleP");
var moraleP = byId("moraleP");
var moneyP = byId("moneyP");
var yesBtn = byId("yesBtn");
var noBtn = byId("noBtn");
var btnAvailable = true;
var noChoice = false;
var curEvent;
window.setInterval(update,1000);
for (let i =0; i < 10; i++) {
    occupied.push([(i+1)*7,"taxes"]);
}
function nextEvent() {
    eventNum++;
    if (includeSubIndex(occupied,0,eventNum)) {
        curEvent = occupied[occupied.findIndex(function(sub) {
            return sub.indexOf(eventNum) !== -1;
        })][1];
        occupied.splice(occupied.findIndex(function(sub) {
            return sub.indexOf(eventNum) !== -1;
        }),1);
    } else {
        let LootTable = Object.keys(events);
        let trueTable = [];
        for (let i = 0; i < LootTable.length; i++) {
            console.log(LootTable[i],events[LootTable]);
            let unlock = tryAccess(events[LootTable[i]],"unlock"); 
            let eligible = false;
            if (unlock) {
                for (let j = 0; j < permEffects.length; j++) {
                    if (unlock.includes(permEffects[j])) {
                        eligible = true;
                    }
                }
            } else {
                eligible = true;
            }
            if (eligible == true) {
                trueTable.push(LootTable[i]);
            }
        }
        console.log(trueTable);
        curEvent = randArr(trueTable);
    }
    let eventData = allEvents[curEvent];
    eventP.innerHTML = eventData.person+": "+eventData.text;
    if (tryAccess(eventData,"options")) {
        let options = tryAccess(eventData,"options");
        yesBtn.innerHTML = options[0];
        noBtn.innerHTML = options[1];
    } else {
        yesBtn.innerHTML = "Yes";
        noBtn.innerHTML = "No";
    }
    if (tryAccess(eventData,"type") == "nochoice") {
        noChoice = true;
        yesBtn.style.display = "none";
        noBtn.style.display = "none";
        window.setTimeout(() => {
            yesBtn.style.display = "inline";
            yesBtn.innerHTML = "Okay";
        }, 1000)
    }
    if (permEffects.length > 0) {
        if (permEffects.includes("food_storage") && eventNum % 5 == 0) {
            kingdom.resources += 5;
        }
    }
}
function allow(event) {
    let eventData = allEvents[event];
    let result = randNum(1,eventData.yesResults);
    let response = eventData.yesResponse[result-1];
    let effect = eventData.yesEffect[result-1];
    if (effect.length == 5) {
        triggerEvent(effect[4]);
    }
    eventDo(effect,response);
}
function acceptEvent(event) {
    let eventData = allEvents[event];
    let result = randNum(1,eventData.results);
    let effect = eventData.effects[result-1];
    kingdom.resources += effect[0];
    kingdom.people += effect[1];
    kingdom.morale += effect[2];
    kingdom.money += effect[3];
    window.setTimeout(nextEvent,2500);
}
function eventText(type,text) {
    let color;
    if (type == 'good') {
        color = 'rgb(0,255,0)';
    } else {
        color = 'rgb(255,0,0)';
    }
    let p = document.createElement('p');
    p.innerHTML = text;
    p.style.color = color;
    byId("eventAddons").appendChild(p);
    p.classList.add('disappearing');
    p.style.fontWeight = 'bolder';
    p.style.opacity = 1;
    window.setTimeout(() => {p.style.opacity = 0;},1000);
    window.setTimeout(() => {p.remove()},3000);
}
function reject(event) {
    let eventData = allEvents[event];
    let result = randNum(1,eventData.noResults);
    let response = eventData.noResponse[result-1];
    let effect = eventData.noEffect[result-1];
    if (effect.length == 5) {
        triggerEvent(effect[4]);
    }
    eventDo(effect,response);
}
function eventDo(effect,response) {
    kingdom.resources += effect[0];
    kingdom.people += effect[1];
    kingdom.morale += effect[2];
    kingdom.money += effect[3];
    eventP.innerHTML = response;
    let attributes = ["Resources","People","Morale","Money"];
    for (let i = 0; i < effect.length; i++) {
        let attribute = attributes[i];
        if (effect[i] > 0) {
            eventText("good",`+${effect[i]} ${attribute}`);
        } else if (effect[i] < 0) {
            eventText("bad",`${effect[i]} ${attribute}`);
        }
    }
    window.setTimeout(nextEvent,2500);
}
function waitOccupied(prefer) {
    do {
        prefer++;
    } while (includeSubIndex(occupied,0,prefer));
    return prefer;
}
function triggerEvent(event) {
    let eventTime = 0;
    // STAT CHANGING
    if (event == "food_storage") {
        kingdom.maxResources += 10;
        if (permEffects.includes("food_storage") == false) {
            permEffects.push("food_storage");
        }
    }
    if (event == "research_1") {
        permEffects.push("research_1");
    }
    // EVENT CAUSING
    if (event == "magicfly_mess") {
        eventTime = waitOccupied(eventNum+4);
        occupied.push([eventTime,"magicfly_mess"]);
    }
    if (event == "sainte") {
        eventTime = waitOccupied(eventNum+7);
        occupied.push([eventTime,"sainte"]);
    }
    if (event == "grunch") {
        eventTime = waitOccupied(eventNum+7);
        occupied.push([eventTime,"grunch"]);
    }
}
function debounce() {
    btnAvailable = false;
    yesBtn.style.display = 'none';
    noBtn.style.display = 'none';
    yesBtn.innerHTML = "Yes";
    noBtn.innerHTML = "No";
    window.setTimeout(() => {
        btnAvailable = true;
        if (noChoice == false) {
            yesBtn.style.display = 'inline';
            noBtn.style.display = 'inline';
        }
        
    },
    3500);
}
nextEvent();
function update() {
    if (kingdom.resources > kingdom.maxResources) {
        kingdom.resources = kingdom.maxResources;
    }
    if (kingdom.people > kingdom.maxPeople) {
        kingdom.people = kingdom.maxPeople;
    }
    if (kingdom.morale > kingdom.maxMorale) {
        kingdom.morale = kingdom.maxMorale;
    }
    if (kingdom.money > kingdom.maxMoney) {
        kingdom.money = kingdom.maxMoney;
    }
    eventNumP.innerHTML = "Events: "+eventNum;
    resourcesP.innerHTML = `Resources: ${kingdom.resources}/${kingdom.maxResources}`;
    peopleP.innerHTML = `People: ${kingdom.people}/${kingdom.maxPeople}`;
    moraleP.innerHTML = `Morale: ${kingdom.morale}/${kingdom.maxMorale}`;
    moneyP.innerHTML = `Money: ${kingdom.money}/${kingdom.maxMoney}`;
}
yesBtn.addEventListener('click', function() {
    if (btnAvailable == false) {
        return false;
    }
    if (noChoice == true) {
        noChoice = false;
        acceptEvent(curEvent);
        yesBtn.innerHTML = 'Yes';
    } else {
        allow(curEvent);
    }
    
    
    
    debounce();
});
noBtn.addEventListener('click', function() {
    if (btnAvailable == false) {
        return false;
    }
    reject(curEvent);
    debounce();
});