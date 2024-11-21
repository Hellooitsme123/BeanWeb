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
// adventure screen vars
var enemies = {
    "andreas": {
        name: "andreas",
        formal: "Andreas",
        managain: 4,
        maxdiscards: 0,
        coinsgive: 30,
        // battle stats
        health: 100,
        mana: 6,
        discards: 0,
        inventory: {},
        simpledeck: ["spearman","turret"],
        deck: {},
        mods: [],
        fightimg: "",
    },
    "goldslime": {
        name: "goldslime",
        formal: "Golden Slime",
        managain: 4,
        maxdiscards: 0,
        coinsgive: 50,
        // battle stats
        health: 300,
        mana: 7,
        discards: 0,
        inventory: {},
        simpledeck: ["etherealguardian","froster","jester"],
        deck: {},
        mods: ["Strength{20}","QuickUse{1}"],
        fightimg: "goldenslimefight.png",
    },
    "magicapprentice": {
        name: "magicapprentice",
        formal: "Magic Apprentice",
        managain: 6,
        maxdiscards: 0,
        coinsgive: 70,
        // battle stats
        health: 70,
        mana: 5,
        discards: 0,
        inventory: {},
        simpledeck: ["wizard","froster","soulkeeper","reaper","bubblemancer"],
        deck: {},
        mods: ["Strength{20}","Tank{-20}"],
        fightimg: "",
    },
    "taverngroup": {
        name: "taverngroup",
        formal: "Tavern Regulars",
        managain: 5,
        maxdiscards: 1,
        coinsgive: 60,
        // battle stats
        health: 140,
        mana: 6,
        discards: 1,
        inventory: {},
        simpledeck: ["spearman","atkpotion","weakener","turret"],
        deck: {},
        mods: [],
    },
    "potato": {
        name: "potato",
        formal: "Potato",
        managain: 7,
        maxdiscards: 1,
        coinsgive: 40,
        // battle stats
        health: 170,
        mana: 7,
        discards: 1,
        inventory: {},
        simpledeck: ["juggernaut","hotpotato"],
        deck: {},
        mods: ["Tank{50}"],
    },
    "janjo": {
        name: "janjo",
        formal: "Janjo, Tavern Owner",
        managain: 5,
        maxdiscards: 1,
        coinsgive: 120,
        // battle stats
        health: 200,
        mana: 7,
        discards: 1,
        inventory: {},
        simpledeck: ["flamethrower","healbubble","weakener","soulkeeper","etherealguardian"],
        deck: {},
        mods: ["FlameTouch{3,2}","QuickUse{1}"],
    },
    "helloitsme": {
        name: "helloitsme",
        formal: "'Helloitsme123'",
        managain: 6,
        maxdiscards: 1,
        coinsgive: 150,
        // battle stats
        health: 250,
        mana: 0,
        discards: 1,
        inventory: {},
        simpledeck: ["teslacoil","bandit","weakener","wizard","bus"],
        deck: {},
        mods: ["Tank{20}","QuickUse{1}","SoulLantern{20}"],
    },
    "fakecoins": {
        name: "fakecoins",
        formal: "Fake Coins",
        managain: 5,
        maxdiscards: 1,
        coinsgive: 200,
        // battle stats
        health: 300,
        mana: 7,
        discards: 1,
        inventory: {},
        simpledeck: ["cannoneer","juggernaut","wizard","solarprism","bandit","cultist"],
        deck: {},
        mods: ["Tank{20}","QuickUse{1}","FlameTouch{3,2}"],
    },
    "djneon": {
        name: "djneon",
        formal: "DJ Neon",
        managain: 5,
        maxdiscards: 1,
        coinsgive: 50,
        // battle stats
        health: 250,
        mana: 8,
        discards: 1,
        inventory: {},
        simpledeck: ["solarprism","wizard","weakener","soulkeeper","managenerator","healorb"],
        deck: {},
        mods: ["Tank{20}","Strength{20}","Healing{20}"],
        fightimg: "djneon.png",
    },
    "cheesedino": {
        name: "cheesedino",
        formal: "Cheese Dino",
        managain: 5,
        maxdiscards: 1,
        coinsgive: 0,
        // battle stats
        health: 320,
        mana: 12,
        discards: 1,
        inventory: {},
        simpledeck: ["solarprism","oblivion","wizard","spearman","managenerator","healbubble"],
        deck: {},
        mods: ["FlameTouch{2,1}"],
    },
    "bandits": {
        name: "bandits",
        formal: "Bandits",
        managain: 6,
        maxdiscards: 1,
        coinsgive: 0,
        // battle stats
        health: 300,
        mana: 10,
        discards: 1,
        inventory: {},
        simpledeck: ["bandit","wizard","spearman","managenerator","healbubble","turret","flamethrower","bank"],
        deck: {},
        mods: ["Strength{50}"],
    },
    "leafos": {
        name: "leafos",
        formal: "Leafos",
        managain: 10,
        maxdiscards: 1,
        coinsgive: 0,
        // battle stats
        health: 100,
        mana: 5,
        discards: 1,
        inventory: {},
        simpledeck: ["charger","cannoneer","factory","juggernaut","oblivion","bubblemancer"],
        deck: {},
        mods: ["Tank{20}","Healing{200}","QuickUse{1}"],
    },
    "wisespirits": {
        name: "wisespirits",
        formal: "Three Wise Spirits: Adov, Lappur, and Praskim",
        managain: 6,
        maxdiscards: 1,
        coinsgive: 0,
        // battle stats
        health: 300,
        mana: 12,
        discards: 1,
        inventory: {},
        simpledeck: ["wizard","weakener","reaper","soulkeeper","oblivion","healorb"],
        deck: {},
        mods: ["Tank{-10}","Healing{200}","Strength{50}","QuickUse{1}","SoulLantern{40}"],
    },
    "lordk": {
        name: "lordk",
        formal: "Lord K",
        managain: 7,
        maxdiscards: 1,
        coinsgive: 50,
        // battle stats
        health: 500,
        mana: 10,
        discards: 1,
        inventory: {},
        simpledeck: ["bandit","wizard","spearman","flamethrower","ninja"],
        deck: {},
        mods: ["Strength{250}","QuickUse{-1}"],
    },
    "trafficlord": {
        name: "trafficlord",
        formal: "Traffic Lord",
        managain: 6,
        maxdiscards: 1,
        coinsgive: 200,
        // battle stats
        health: 650,
        mana: 10,
        discards: 1,
        inventory: {},
        simpledeck: ["bandit","wizard","spearman","flamethrower","ninja","managenerator","solarprism"],
        deck: {},
        mods: ["Strength{50}","QuickUse{1}","Tank{20}","Healing{20}"],
    },
    "cursedtome": {
        name: "cursedtome",
        formal: "Cursed Tome",
        managain: 12,
        maxdiscards: 1,
        coinsgive: 200,
        // battle stats
        health: 400,
        mana: 10,
        discards: 1,
        inventory: {},
        simpledeck: ["atkpotion","wizard","clonebox","bubblemancer","charger","managenerator","solarprism"],
        deck: {},
        mods: ["Strength{100}","QuickUse{1}","Tank{20}","Healing{100}"],
    },
    "owllibrarian": {
        name: "owllibrarian",
        formal: "Owl Librarian",
        managain: 6,
        maxdiscards: 1,
        coinsgive: 200,
        // battle stats
        health: 500,
        mana: 10,
        discards: 1,
        inventory: {},
        simpledeck: ["atkpotion","wizard","weakener","bubblemancer","reaper","managenerator","solarprism"],
        deck: {},
        mods: ["Strength{50}","QuickUse{1}","Tank{20}"],
    },
}
var locations = {
    "home": {
        name: "home",
        formal: "Home",
        desc: "Your humble house. Where everything all starts.",
        loretext: "A few days ago, UncleMan threatened to evict you, saying that you're a lazy couch potato that does nothing. Since becoming a homeless beggar is the last thing you want to do, you ask him for ways to stay in the house. || You: What can I do to stay here? || UncleMan: You have to earn your keep! I'll give you one simple task: Find the Bean Duplicator. If you can get that relic, then I'll give you lifelong permission to stay here. || A rare relic found only in the dangerous mountains, visible shaking started. You knew that protesting would do nothing, so, starting with only 20 coda coins and 2 spearmen, you began your journey to prevent yourself from getting evicted.",
        proceedtext: "Start your journey by taking the road to Coda.",
        nextloc: "roadtocoda",
        locimg: "owarpcenter.png",
    },
    "roadtocoda": {
        name: "roadtocoda",
        formal: "Road To Coda",
        desc: "The long path to Coda, one of the biggest cities in the world. There, you'll be able to stock up on cards to continue your journey.",
        loretext: "You start the trip to Coda, journeying along the path with your cards and some money. The sun has risen, and the birds are now chirping. It's still relatively quiet, so you keep walking.",
        proceedtext: "Continue along the road.",
        nextloc: "andreasappear",
        locimg: "roadtocoda.png",
    },
    "andreasappear": {
        name: "andreasappear",
        formal: "Road To Coda",
        desc: "The long path to Coda, one of the biggest cities in the world. There, you'll be able to stock up on cards to continue your journey.",
        loretext: "On the road, a man comes up to you, noticing your cards. He says name is Andreas, and he offers to give you powerful cards if you can beat him, along with 30 coda coins. However, if you lose, you have to give him all of your cards. It seems sketchy, but some better cards would be very useful.",
        proceedtext: "Battle it out with Andreas for a chance of getting some special cards.",
        proceedspecial: "fight|andreas",
        nextloc: "andreasvictory",
        skipallowed: true,
        locimg: "roadtocoda.png",
    },
    "andreasvictory": {
        name: "andreasvictory",
        formal: "Road To Coda",
        desc: "Andreas defeated!",
        altdesc: "Too good to be true!",
        loretext: "You win against Andreas, who enters a foul mood after losing. His want to scam you is clearly visible, but he reluctantly pulls out his card pack. You get to choose one of three cards: ",
        alttext: "'Powerful' cards? That doesn't seem right. What if he's hogging them all for himself, and if he somehow loses, he'll just give out one of his weaker cards? You decline the suspicious offer.",
        special: "gaincard",
        proceedtext: "Get back up and make your way to the center of Owarp, where the trading hubs reside.",
        nextloc: "owarpcenter",
        locimg: "roadtocoda.png",
    },
    "goldslimeappear": {
        name: "goldslimeappear",
        formal: "Road To Coda",
        desc: "The long path to Coda, one of the biggest cities in the world. There, you'll be able to stock up on cards to continue your journey.",
        loretext: "You kept walking, until you started hearing a faint splashing noise. || PLOP. PLOP. PLOP. || Something shiny was in the distance, shiny and golden. It was slowly bouncing towards you. || PLOP. SPLAP. PLOP. || Eventually, you could make out what it was. It was a golden slime going after you. Seems like there's only one way out of this..",
        proceedtext: "End the golden slime.",
        proceedspecial: "fight|goldslime",
        nextloc: "andreasvictory",
        locimg: "roadtocoda.png",
    },
    "goldslimevictory": {
        name: "goldslimevictory",
        formal: "Road To Coda",
        desc: "Golden slime defeated!",
        loretext: "You saw the mushy blob melt into smaller globs, now fading away. Once it died away, it left behind traces of gold (approximately 50 coda coins) and one card.",
        special: "gaincard",
        proceedtext: "Continue and make your way to the center of Owarp, where the trading hubs reside.",
        nextloc: "owarpcenter",
        locimg: "roadtocoda.png",
    },
    "magicapprenticeappear": {
        name: "magicapprenticeappear",
        formal: "Road To Coda",
        desc: "The long path to Coda, one of the biggest cities in the world. There, you'll be able to stock up on cards to continue your journey.",
        loretext: "On the road, you saw a weird dude in the distance doing what you thought were kung fu moves. He had a black hat and was in robes, and he was dancing around moving his arms and legs in a strange manner. Was he crazy? Had he overdosed on beans? You couldn't really tell what he was doing until he got closer. || It turns out that he was actually a mage in training, who was just flexing off his spells. He was pretty obnoxious, casting random spells everywhere, like shrinking some poor guy's cat or blasting random stuff. He came up to you, wanting to show off his skills. || Magic Apprentice: Hey bro! I'm going to be the next master of magic! Wanna see my spells? || You: No.. || Magic Apprentice: Fine then, you'll be able to see them in the fight.",
        proceedtext: "Fight the magic apprentice.",
        proceedspecial: "fight|magicapprentice",
        nextloc: "andreasvictory",
        locimg: "roadtocoda.png",
    },
    "magicapprenticevictory": {
        name: "magicapprenticevictory",
        formal: "Road To Coda",
        desc: "Obnoxious mage defeated!",
        loretext: "Bro really thought he was him 💀💀💀💀. Anyways, the magic apprentice was pretty sad when he lost. || Magic Apprentice: Lil' bro! Why'd you have to do me like that? I just wanted to show off my skills! || You: I have things to do! || Magic Apprentice: Womp womp. Fine, here's a free card. Just don't tell anyone you defeated me, okay?",
        special: "gaincard",
        proceedtext: "Continue and make your way to the center of Owarp, where the trading hubs reside.",
        nextloc: "owarpcenter",
        locimg: "roadtocoda.png",
    },
    "owarpcenter": {
        name: "owarpcenter",
        formal: "Center of Owarp",
        desc: "Further down the road, the center of Owarp contains marketplaces and buildings, with tons of opportunities to increase your deck of cards and get special upgrades to aid yourself in battle.",
        loretext: "After getting back up and continuing your journey, you reached the center of Owarp. Here, resides one of the biggest plazas in Boraps, so you decide that you must make the most of your time here. One of the stores in the plaza, known as Tallmart, contains a lot of useful cards. However, you don't have enough to buy them. So, you decided that it would be best to enter Janjo's Tavern, a place where you can battle other people with your cards and earn coda coins.",
        proceedtext: "Continue walking.",
        nextloc: "cosmeticshop",
        locimg: "owarpcenter.png",
    },
    "cosmeticshop": {
        name: "cosmeticshop",
        formal: "Cosmetic Shop",
        desc: "A relaxing store smothered with pink, aesthetic vibes that provide a variety of cosmetics, just happening to offer free card upgrades on Monday afternoons.",
        loretext: "Walking down the road, you saw a pink, cottage store named 'Lavender's Cosmetic Shop'. Next to the entrance, you saw a sign that said that free card upgrades were offered on Monday afternoons. It just happened to be a Monday afternoon, so you decided it would be best to get a free card upgrade before fighting against others with possibly better decks in the tavern. || You entered the store, and all of a sudden your stress was gone. It was just too relaxing. You came in to the person at the cash register, and you began talking with her. || You: So, is it true that there are free card upgrades on Mondays? || Lavender: Yeah. Only the first 10 people get it though. Fortunately, you are one of the first 10 people here. || You: Cool! So, how do I get it? || Lavender: Just give me 2 cards, and I can upgrade them. You can also get 1 card and 1 card upgrade instead. || Click a card to upgrade its stats by 10%, or choose a card to get for free. ",
        special: "shop|gaincard|upgcard",
        proceedtext: "Leave the store and go visit the tavern.",
        nextloc: "tavern",
        locimg: "owarpcenter.png",
    },
    "tavern": {
        name: "tavern",
        formal: "Janjo's Tavern",
        desc: "A tavern made by the one and only Janjo, allowing people to talk about cards and drink at the same time.",
        loretext: "You enter the tavern, instantly getting greeted by a loud cacophony of chatter and glass clinking and card drawing. You find a group that is willing to battle with you, offering a prize of 60 coda coins if you win. However, if you lose, you'll have to pay 50 coda coins. Wouldn't it be nice to have some better cards?",
        proceedtext: "Fight the group for a chance to earn some money.",
        proceedspecial: "fight|taverngroup",
        nextloc: "taverngroupvictory",
        skipallowed: true,
    },
    "potato": {
        name: "potato",
        formal: "Janjo's Tavern",
        desc: "A tavern made by the one and only Janjo, allowing people to talk about cards and drink at the same time.",
        loretext: "After entering the tavern and exploring, you suddenly got hit in the face by some strange, warm object. Once you recovered from the shock, you realied that.. you got hit by a potato? Oh no! Hot potato!!",
        proceedtext: "Hot potatoto!!",
        proceedspecial: "fight|potato",
        nextloc: "potatovictory",
    },
    "potatovictory": {
        name: "potatovictory",
        formal: "Janjo's Tavern",
        desc: "A tavern made by the one and only Janjo, allowing people to talk about cards and drink at the same time.",
        loretext: "Finally! That potato was almost about to explode on you! Fortunately, you safely disposed of it. Unfortunately, an even stronger enemy came up to you, taking notice of the great ruckus you caused in the previous fight. It was Janjo, the Tavern Owner. || Janjo: Hey man, what's all this noise you're making? || You: Um.. It's celebration!! My net worth just tripled because of Beanmelon stocks today! || Janjo: Oh really? Maybe I should invest.. || You: Yeah... || Janjo: About that, are you good at card battling? || You: What? No? I don't battle with cards. I just thought that everybody should know about what happened today! || Sadly, Janjo didn't take the bait.",
        proceedtext: "Battle Janjo.",
        proceedspecial: "fight|janjo",
        nextloc: "janjovictory",
    },
    "taverngroupvictory": {
        name: "taverngroupvictory",
        formal: "Janjo's Tavern",
        desc: "The taverngoers have been defeated!",
        altdesc: "You decided to not fight the taverngoers.",
        loretext: "You gained about 50 coins from your victory, despite having only a few cards. Word spread around the tavern about your skill, and before you could leave, you were confronted by the tavern owner, Janjo. He's well known for is powerful skills, which include setting attacked cards on fire and using a flame blast every few moves, which burns all of your cards. He also has a quick use ability, which ignores card cooldowns. || He proposed a bet of 120 coda coins and a special upgraded card, saying that whoever lost has to pay the winner. It's risky, but the reward is much more than enough to get a few things at Tallmart. Do you accept the bet?",
        alttext: "You decided to not fight the tavern group, intimidated by their cards. However, you soon stumble upon an even stronger opponent. The tavern owner himself. He's well known for is powerful skills, which include setting attacked cards on fire and using a flame blast every few moves, which burns all of your cards. He also has a quick use ability, which ignores card cooldowns. || You talked with him, telling him about your card adventures. Eventually, he proposed a bet of 120 coda coins and a special upgraded card, saying that whoever lost has to pay the winner. He said it'll be a helpful reward for you, but you'll only get it if you're worthy enough. However, the prize money is undoubtedly handsome sum. Do you accept the bet?",
        proceedtext: "Battle Janjo for a chance to get 100 coda coins.",
        proceedspecial: "fight|janjo",
        nextloc: "janjovictory",
        skipallowed: true,
    },
    "janjovictory": {
        name: "janjovictory",
        formal: "Janjo's Tavern",
        desc: "You won against Janjo!",
        altdesc: "You decided to not take Janjo's proposal.",
        loretext: "In a miraculous turn of events, you defeated the tavern owner himself! Chatter bursted throughout the building, but you dashed out before any other challengers could appear. Now, with the amount of coins you have, there's no doubt you'll be able to purchase a few aids for your adventure.",
        alttext: "Too scared to take the deal, you decided that it'll be better to play it safe. You're worried about whether or not you'll have enough to purchase a sufficient amount of items for your journey, but you decide to go to Tallmart anyways.",
        special: "gaincard",
        proceedtext: "Leave the tavern.",
        nextloc: "tallmart",
    },
    "cloakedhuman": {
        name: "cloakedhuman",
        formal: "Cloaked Human",
        desc: "A strange, cloaked human breathing heavily, leaving a chilly feeling in the air with each breath.",
        loretext: "You went about on your way. Eventually, an ominous person covered in ragged cloaks came up to you. The night mist grew, and it felt like everything around you disappeared || ???: Do you want power? Do you want to become the ruler of the world? || Why, yes! Wait.. no! No.. || ???: I can lead you to the highest of statuses. The small world can be in your controlling hands. || You: What? What's happening? || It calls to you. To YOU. || ???: All you have to do is tell me. Yes or no. If you don't want to, it'll be fine. || The world will finally be mine.. I'll be able to do whatever I want.. No! NO!! || What are your desires?",
        special: "gainpower",
        proceedtext: "Leave.",
        nextloc: "tallmart",
    },
    "speedingcar": {
        name: "speedingcar",
        formal: "Speeding Car",
        desc: "They lurk along the roads.",
        loretext: "Hey, what's that strange, blue blip? || Why's it getting bigger? Is it going towards me? Is this my calling? || Wait.. what's that noise? || Hold up. IT'S COMING FOR- || Whew. That was close. What kind of person would drive that recklessly? They almost killed me! || They? Was there even a person in that car? || Hmmm.. Maybe..",
        proceedtext: "Continue. That car was nothing.",
        nextloc: "tallmart",
        locimg: "speedingcar.png",
    },
    "tallmart": {
        name: "tallmart",
        formal: "Tallmart",
        desc: "A tall store that contains a wide range of items to buy, from food to nukes to cards.",
        loretext: "You step into the store, the faint, generic shopping music playing. Struggling to breathe the thick night air, tired from all of your traveling, you look at the aisles.",
        proceedtext: "Leave the store and continue your trek along the road.",
        special: "store|buycard|buyrelic",
        nextloc: "behindtallmart",
        locimg: "tallmart.png",
    },
    "suddenurge": {
        name: "suddenurge",
        formal: "Tallmart",
        desc: "A tall store that contains a wide range of items to buy, from food to nukes to cards.",
        loretext: "After looking at the aisles and seeing what there was to buy, you felt something strange. It called to you. || ???: Come on, Quincy's asleep. Steal something. It's the perfect opportunity.. || You: No.. || Do you submit to the strange power?",
        actiontext: "Quincy was still as a stone, sleeping on the chair. Wanting another upgrade, you decided to secretly take another, making as little sound as possible. You slowly tiptoed out.. until.. VRRRRRR!!! Quincy was standing behind you, with a chainsaw at full power. You ran away as fast as possible dropping the stolen item and a few coda coins, with a few injuries. Maybe don't steal next time.",
        proceedtext: "Leave the store and continue your trek along the road.",
        special: "suddenurge",
        nextloc: "behindtallmart",
        locimg: "tallmart.png",
    },
    "tallmartroof": {
        name: "tallmartroof",
        formal: "Tallmart Roof",
        desc: "A tall store that contains a wide range of items to buy, from food to nukes to cards.",
        loretext: "Before leaving, you suddenly thought about going upstairs and looking at other things. You went all the way up to the roof, not seeing anything of relative value. Still, you relished the nice view, looking at the great forest surrounding the city. It recalled a faint memory from long ago.. || UncleMan: You know nephew, no one really knows how this place came to be. At some point in time, there was no Owarp. And then there was Owarp. There's not much information, but some do say that Owarp has been a small village town for hundreds of years. || You: What about outside of Owarp? || UncleMan: Well, right now, Boraps and the other islands are mostly just big chunks of land full of big central trade hubs and long, big roads. Owarp itself is surrounded by hundreds of extremely tall trees, hiding who knows what. The forests are full of undiscovered wildlife, but no one really wants to go in there and document it. This place is very mysterious as a whole. Who knows what happened in the past? || The conversation faded away, and then you realized that you were on the verge of falling off the 10 story building, with its roof being completely devoid of any guard rails. You saw a broken wooden plank right before you started your way down, suspicious of what it was there for.",
        proceedtext: "Leave the store and continue your trek along the road.",
        nextloc: "behindtallmart",
        locimg: "",
    },
    "behindtallmart": {
        name: "behindtallmart",
        formal: "Grimy Corner",
        desc: "A dirty, forgotten corner inhabited by the one and only Greg.",
        loretext: "Having a few scraps left over from the tavern that you forgot to throw away, you decided to go to the back of Tallmart after finishing your order. Expecting to see a normal dumpster, you jumped back in surprise after a man came out of a cardboard box. He said his name was Greg, and, after seeing your cards, he offered you a deal of 15 coda coins for every card you give him. Do you accept?<br>Click a card in your inventory to delete it.",
        proceedtext: "Leave Greg's place and continue along the road.",
        special: "destroycard",
        specialmax: 2,
        nextloc: "roadtocoda3",
        locimg: "grimycorner.png",
    },
    "roadtocoda3": {
        name: "roadtocoda3",
        formal: "Road To Coda",
        desc: "A busy road taken by many, some with the intent of adventure, of success, of happiness.",
        loretext: "After leaving the corner and going further throughout the city, you came to a club called 'Deric's Dance Club', dazzled by a blast of chromatic, flashing lights. Fortunately for you, there was a Dance Card that just happened to be lying on the bench that you were just about to sit on.",
        proceedtext: "Enter the Dance Club and see what you can do there.",
        nextloc: "danceclub",
        locimg: "owarpcenter.png",
    },
    "danceclub": {
        name: "danceclub",
        formal: "Deric's Dance Club",
        desc: "A wild and frivolous club where people can vibe, shout, and dance in a vivid array of lights.",
        loretext: "Walking up to the receptionist, you were asked the question of where your Dance Card was. You quickly pulled it out, giving it to the receptionist and jumping on the floating elevator before any further questioning could begin. Once you reached the dance floor, you were met with yet another blast of intense noise and lights. You were left staggered, weakened by your long journey without any sleep. So, you decided that it would be best to make your time here quick.",
        proceedtext: "Look around.",
        nextloc: "helloitsmeappear",
    },
    "helloitsmeappear": {
        name: "helloitsmeappear",
        formal: "Deric's Dance Club",
        desc: "A wild and frivolous club where people can vibe, shout, and dance in a vivid array of lights.",
        loretext: "The first thing that caught your attention was the DJ's set of prismatic cards, all of them being rare. However, you were unable to talk to the DJ, as just then, a challenger, who went by the name of 'Helloitsme123', approached. || Helloitsme123: I bet 150 coda coins I'll win! || You: What? || Helloitsme123: Come on, battle! || The enigmatic figure provided only one option, and with the moon at its peak, it didn't seem like you could do anything else.",
        proceedtext: "Do the only thing you can, accept the challenge.",
        proceedspecial: "fight|helloitsme",
        nextloc: "helloitsmevictory",
    },
    "helloitsmevictory": {
        name: "helloitsmevictory",
        formal: "Deric's Dance Club",
        desc: "A wild and frivolous club where people can vibe, shout, and dance in a vivid array of lights.",
        loretext: "That battle.. was strange. Who was that person? Why such a quick appearance and demanding tone? Before you could question the cloaked.. thing, they walked away, quickly disappearing in the crowd. After the battle, you decided to see if there was anything that could aid you.",
        proceedtext: "Explore more of the club.",
        nextloc: "danceclub2",
    },
    "danceclubsign": {
        name: "danceclubsign",
        formal: "Deric's Dance Club",
        desc: "A wild and frivolous club where people can vibe, shout, and dance in a vivid array of lights.",
        loretext: "You walked around the dance club, dazzled by the flashing floor tiles, which were changing colors every second. You gazed at the walls, accidentally bumping into people every so often. || It was really not fun being exposed to such loud noises and bright displays when what you really needed was sleep. After some time, you came to a sign on the wall that read, 'ARE YOU POOR? JUST GET RICH. - DJ NEON'. It was a rather wise quote, but quite useless. It is quite unfortunate that money is one of the largest impediments to fulfilling peoples' dreams these days. It is not easy to get rich. || Just as you were pondering about money and riches, you came across a miracle! It was a bunch of coda coins stacked on a table, worth ~50 coda coins if you estimated right. Do you take it?",
        proceedtext: "Leave.",
        special: "fakecoins",
        nextloc: "fakecoinsvictory",
    },
    "fakecoinsvictory": {
        name: "fakecoinsvictory",
        formal: "Deric's Dance Club",
        desc: "A wild and frivolous club where people can vibe, shout, and dance in a vivid array of lights.",
        loretext: "It was all a lie! The coins were fake and evil! The question is, was it worth it? Is the cost of healing up more expensive than the amount of money you gained from the fight? Who knows.. || Sigh.. You got up and continued exploring the club, only more tired than before. Hopefully the night will be over soon..",
        proceedtext: "Explore more of the club.",
        nextloc: "danceclub2",
    },
    "beancandispenser": {
        name: "beancandispenser",
        formal: "Bean Can Dispenser",
        desc: "A wild and frivolous club where people can vibe, shout, and dance in a vivid array of lights.",
        loretext: "Eventually, you found a bean can dispenser, which can increase your health by 50 (also increases max health), but at the cost of 30 coda coins. Do you think it's worth it?",
        proceedtext: "Continue touring the dance club.",
        special: "beancandispenser",
        nextloc: "danceclub2",
    },
    "neonrobot": {
        name: "neonrobot",
        formal: "Neon Robot",
        desc: "A clanky, ol' robot full of neon lights and 1980s-esque design.",
        loretext: "Walking throughout the club, you stumbled upon a neon robot strolling around. || Robot: I. AM. RO. BOT! || You: A robot? || Robot: YES. I. AM. HEL. PER. || You: What do you do? || Robot: DO. YOU. WANT. A. DRINK? || You: Is it free? || Robot: NO. || You: Hmm.. Maybe I do need one. || Choose a drink. Or not.",
        proceedtext: "Continue touring the dance club.",
        special: "drinkrobot",
        nextloc: "danceclub2",
    },
    "slotmachine": {
        name: "slotmachine",
        formal: "Slot Machine",
        desc: "A blue slot machine with coins all over, attempting to attract dazzled people.",
        loretext: "After a few minutes of trying to navigate through the rainbow tiles, which time and time again left you lost in all of the changing lights, you found yourself in front of a slot machine. || It was like a slot machine that one would find in a casino, except it was all alone in a faint corner. Its slight blue and white paint looked rather dim in the midst of all of the lights, but it still attracted you. || It read: 'BEAN SLOT MACHINE - CHOOSE A CARD AND DEPOSIT 50 CODA COINS, 50/50 CHANCE OF GETTING YOUR CARD EATEN OR UPGRADED'. A massive lever was on the machine, giving off an aura that made you want to gamble. It's only 50 coda coins.. Is it worth the risk? || Do you want to gamble? Click a card in your inventory. May or may not get destroyed.",
        proceedtext: "Continue touring the dance club.",
        special: "gamble",
        nextloc: "danceclub2",
    },
    "danceclub2": {
        name: "danceclub2",
        formal: "Deric's Dance Club",
        desc: "A wild and frivolous club where people can vibe, shout, and dance in a vivid array of lights.",
        loretext: "After some exploration, you decided to finally meet the DJ, who went by the name of DJ Neon (according to the massive, glowing letters displayed on the wall). For a few minutes you observed him spinning those strange discs that you never really understood, wondering what they even did. How do they even impact the music? They're just circles! Eventually, you asked him who he was. || DJ Neon: My name's DJ Neon! I'm the best DJ in the world! || You: Oh. Well, what about your cards? Why are they rainbow? || DJ Neon: Well, it's because they're special! They're upgraded cards that have better stats than usual. For example, their attack and health is higher. || After a few more minutes of talking, he said that if you can beat him, he'll give you one of his cards and 50 coda coins on top of that. An upgraded card? For free? And 50 coda coins? It's a deal that has to be taken!",
        proceedtext: "Hopefully get an upgraded card from DJ Neon.",
        proceedspecial: "fight|djneon",
        nextloc: "djneonvictory",
        locimg: "djneon.png",
    },
    "djneonvictory": {
        name: "djneonvictory",
        formal: "Deric's Dance Club",
        desc: "The best DJ in the world? Is that so?",
        loretext: "You defeated DJ Neon! He did what he promised to, offering 50 coda coins, and a card of your choice (shown below). However, one question still remains: If he's the DJ, and he was just battling you, then how was the music still playing? Is he really a DJ? Whatever, it's fine. What else is here to see of this club?",
        proceedtext: "Explore more.",
        nextloc: "danceclubexit",
    },
    "danceclubroof": {
        name: "danceclubroof",
        formal: "Dance Club Roof",
        desc: "The loud screaming and partying now dying out, all you see is the city view.",
        loretext: "You went back to the floaty elevators, where you saw a staircase that you had missed before. It was blue and had a neon aesthetic, leading to some strange place upstairs. || You went up the stairs, being greeted with a dark, night sky. There were boxy, metal railings that prevented dazed people from falling off. There were tall, tall trees surrounding the city walls, marking the start of the great forest that was outside the city. You could see one of your uncle's bean factories behind a few buildings, made up of big, white boxes and whatnot. Again it came across your mind, the question of whether or not you would become as great as your uncle. || There was not much more to see, so you decided to go down the stairs and back to the dance floor.",
        proceedtext: "Explore more.",
        nextloc: "danceclubexit",
    },
    "danceclubspill": {
        name: "danceclubspill",
        formal: "Dance Club",
        desc: "A wild and frivolous club where people can vibe, shout, and dance in a vivid array of lights.",
        loretext: "You walked away from DJ Neon, looking around the club to see if there was anything else. You were feeling quite happy about your victory, until.. .text-woah{SLIP!} You slipped on a puddle of spilled Coda Cola and fell, just narrowly missing a faceplant. You couldn't see well, and all of your cards had fallen out of your backpack. A crowd is slowly forming, so you need to think fast.",
        proceedtext: "Explore more.",
        special: "danceclubspill",
        nextloc: "danceclubexit",
        forceaction: true,
    },
    "danceclubexit": {
        name: "danceclubexit",
        formal: "Dance Club Exit",
        desc: "The dark, night streets give off an eerie vibe, with the echoes of the faint, flickering street lights bouncing off the ground.",
        loretext: "After exploring the dance club for quite some time, you decided it was best to leave. You slowly made your way out, jumping down the floaty blue elevator pads, swinging the glass doors open. You haven't slept in a while..",
        proceedtext: "Go to the hotel across the street to rest.",
        special: "gaincard",
        nextloc: "hotel",
    },
    "hotel": {
        name: "hotel",
        formal: "Hotel",
        desc: "A hotel. Literally. It's name is just 'Hotel'. It's fine. All that matters is that the hotel is good.",
        loretext: "After making sure that there were no speeding cars, you crossed the road and entered the hotel. You can either buy a room for 50 coda coins for one night and heal 70 health, or sleep in the ULTRA-CHEAP beds for free, healing only 20 health. Do you want to save money, or choose the option that'll be the best for you?",
        special: "rest",
        proceedtext: "Wake up and continue your journey.", 
        nextloc: "beanfactory",
    },
    "beanfactory": {
        name: "beanfactory",
        formal: "Bean Factory Entrance",
        desc: "The entrance to a Beanmelon Factory. Hopefully you'll be able to enter. After all, you are the owner's nephew.",
        loretext: "It was nice to have some sleep after more than a day of none at all. Feeling better, you left the hotel to get to visit the Beanmelon Factory. At the entrance, you met a strange dinosaur-humanoid, with a block of cheese with googly eyes as their head. You thought it was a statue, until the dinosaur thing started talking to you. || Cheese Dino: Are you here to talk about Lord K? || You: No.. who's that? || Cheese Dino: You see that guy on the poster? || The picture on the poster showed a ginormous, green dude wearing a crown and a cape, at least double the height of the hotel you were just in, if you looked at the trees in the background of the photo. || You: So.. Who is this Lord K? || Cheese Dino: Well, he's this giant fellow that's been causing a lot of disruption, destroying cities and whatnot. There's a bounty on him. Anyone who can defeat him will get 1000 coda coins. Just bring his crown here, and I'll use the Artifact Confirmation Expert machine to confirm it. || You: 1000? || Cheese Dino: Yep. If you're want to get the prize, you'll have to be able to get cards strong enough to deal with Lord K. Won't be easy. || You: Where can I find him? || Cheese Dino: Oh, somewhere in the forests that follow. || 1000 coda coins seems like a lot, and it'll surely be enough to buy a variety of things. Lord K doesn't seem that bad of enemy, considering the foes you've faced so far. || Cheese Dino: You know what? I'll give you a deal. If you beat me in a card battle, I'll give you a special boost: +50 max health. If you lose, you have to give me all of your coda coins. Come on, it's practically free.",
        proceedtext: "Battle Cheese Dino for more max health.",
        proceedspecial: "fight|cheesedino", 
        nextloc: "cheesedinovictory",
    },
    "cheesedinovictory": {
        name: "cheesedinovictory",
        formal: "Bean Factory",
        desc: "One of the great Beanmelon Corp. factories that produces the food that is eaten by everyone around the world.",
        loretext: "After beating Cheese Dino, he gave you a relic. Check your inventory to see it. After that, you were let into the factory. He gave you access into the factory, where you remembered that you had to go through a long maze to get into it. It was pretty disorienting, but using small fragments of your memory, you managed to make your way through.",
        proceedtext: "Look around.", 
        nextloc: "unclerictorappear",
    },
    "unclerictorappear": {
        name: "unclerictorappear",
        formal: "Bean Factory",
        desc: "One of the great Beanmelon Corp. factories that produces the food that is eaten by everyone around the world.",
        loretext: "Following a lot of walking, you met your uncle, Rictor, who was chilling on a plastic chair that looked like it was going to collapse unexpectedly. || Uncle Rictor: Yo, wassup nephew! How have you been doing? What did UncleMan say? || Nephew: Uhh.. He made me go on adventure to find the lost bean duplicator, saying that he'll kick me out if I don't find it. || Uncle Rictor: Oh, that seems bad. Hopefully you'll find it. Do you want some aid? I can upgrade your cards, it'll just cost 30 coda coins per card.|| Nephew: Sure! || Click one of your cards to increase their health by 20%, and their attack/heal by 20%.",
        proceedtext: "Continue exploring the factory.",
        special: "upgcard", 
        nextloc: "securityguard",
    },
    "securityguard": {
        name: "securityguard",
        formal: "Bean Factory",
        desc: "One of the great Beanmelon Corp. factories that produces the food that is eaten by everyone around the world.",
        loretext: "You went deeper into the factory, seeing the hundreds of conveyor belts and bean cans, with loud noises bouncing off the metal walls. Looking at your left, you saw a room marked with big, bold letters, saying - 'SECURITY'. You decided to enter the room despite its label, and saw a sleeping security guard in front of a computer that showed everything throughout the facility. You could see Uncle Rictor standing in the cool, lush section of the factory with grass and trees. You could see Cheese Dino standing by the entrance, his heavy gaze unending. You wondered what wandered about within his strange mind, and why he seemed so mysterious compared to the others. The red star on his arm glistened as he sharpened his cleaver, still looking serious and blank as ever. || You switched focus to another camera, where you could see trucks and boxes full of beans. There was no one there at the moment, so you switched cameras again. || This time, the camera was looking at the bean conveyors. There were several bulky, metal structures that had big labels on them, likely marking there purpose in the bean refining process. One read, .text-bold{'BEAN ENCHANTING MACHINE'}, dispensing purply, glowy bean cans that likely came from another conveyor. It was getting quite boring, so you decided to leave before the security guard woke up.",
        proceedtext: "Leave the factory.",
        nextloc: "roadtocoda4",
    },
    "shippingsector": {
        name: "shippingsector",
        formal: "Bean Factory",
        desc: "One of the great Beanmelon Corp. factories that produces the food that is eaten by everyone around the world.",
        loretext: "A clacking sound echoed throughout the facility as you walked by the conveyors, entering the shipping sector. Here, you saw a bunch of boxes on metal racks, with a truck containing a few of them. It had not left yet, as it was the middle of the night and no one was awake. You went through one of the doors, seeing an employee crouching in a corner. || Adoba: Get me out of here! This place is terrible! || You: Why? || Adoba: It's all lies! I know the secret of Beanmelon. UncleMan has been lying all along. || You: What do you mean? Beanmelon Corp. is the best company in the world and nothing will ever change that! || Adoba: That's what you oblivious folk all think. I've seen the process, and it's not like what UncleMan has told the public. There's a reason why factory employees can never leave. UncleMan can't let the world know. || You: Know what? You have to explain to me the truth man! I've tried beans all my life and I don't see anything wrong. || Adoba: The beans.. are artificial. Fake. || You: Wh- what?? What- what do you mean? || .text-custom~~font-size:20px;font-weight:bolder{Leave. Now.}",
        proceedtext: "Leave the factory.",
        nextloc: "roadtocoda4",
    },
    "tastetestingsector": {
        name: "tastetestingsector",
        formal: "Bean Factory",
        desc: "One of the great Beanmelon Corp. factories that produces the food that is eaten by everyone around the world.",
        loretext: "You could hear the loud sounds of the machines pumping out cans of beans, with hundreds of different varieties of flavors. While walking past the conveyors, you noticed that there was a small walkway that led to a strange corner that you hadn't seen before, so you decided to see what was there. || Walking past the conveyors, you saw a big sign that read, 'TASTE TESTERS'. There was a group of people that looked extremely tired, endlessly testing out different bean cans. They seemed to be pleading for help deep inside, but you couldn't tell. You spotted one, who was named XSnipe11. || XSnipe11: Get us out of here! || You: Why? || XSnipe11: We have been forced to try out these beans for the last 3 years! I need to leave! || You: Can't you leave anytime you want? || XSnipe11: We can't! The doors are locked with keycards that none of us have! All we can do is review the beans and tell UncleMan what he should do to improve them! We need help! || You walked away before you could hear anymore screaming, confused. Why did they want to leave? Being a Beanmelon Corp. employee must be an insanely privileged status! Fools.. they're probably too lazy to work. ",
        proceedtext: "Leave the factory.",
        nextloc: "roadtocoda4",
    },
    "strangealtar": {
        name: "strangealtar",
        formal: "Strange Altar",
        desc: "A road filled with old tire tracks from trucks and cars that traversed through here. Unfortunately, cars are quite expensive these days. ",
        loretext: "You left the factory, searching for Lord K. The road was silent as usual, the trees rustling as the loud wind blew. It was getting quite cold. || After some walking, you met a strange altar. Its strange, red aura. You could hear whispers. Must.. go.. closer.. || It was talking to you. Something was in your head. What did that mean? Something was off.. || ???: Are you willing to take a risk, young mortal? || You: Wh- what? What's happening || ???: I won't say this again. Are you prepared to lose everything? || You: No.. get me out of here!",
        special: "risk",
        proceedtext: "Leave the altar and continue your search.", 
        nextloc: "roadtocoda4",
    },
    "unclemanstatue": {
        name: "unclemanstatue",
        formal: "UNCLE MAN STATUE",
        desc: "A large, stone statue depicting your own uncle. Hopefully you will achieve success as great as his one day.",
        loretext: "It had not been long sing you got back on the road. It'd been maybe 30 minutes or so, but now you'd need to stop again. You must admire your uncle and his achievements, as you were just at one of his factories an hour or so ago. You gaze at the statue, pondering about whether or not you will ever achieve a level of greatness equal to your uncle. || Will you? A question that even the greatest mathematicians can't solve. || Woosh. Woooosh. || What was that? It must be a sign. But what sign? Eventually, you saw it. There was something, a card on UncleMan's head. You'll have to climb quite a bit to get it. But is it really worth it? || Choose wisely.",
        special: "unclemanstatue",
        proceedtext: "Leave the statue.", 
        nextloc: "roadtocoda4",
    },
    "flamebean": {
        name: "flamebean",
        formal: "Strange Bean Can",
        desc: "A bean can, but strange. Different than normal..",
        loretext: "You were walking along the road when you started smelling smoke. It was coming from somewhere, you just couldn't tell what direction. You looked around, and saw tiny sparks of fire in the distance. Following more walking, you came to a bean can.. on fire. Should you take it?",
        special: "flamebean",
        proceedtext: "Leave.", 
        nextloc: "roadtocoda4",
    },
    "roadtocoda4": {
        name: "roadtocoda4",
        formal: "Road To Coda",
        desc: "A road filled with old tire tracks from trucks and cars that traversed through here. Unfortunately, cars are quite expensive these days. ",
        loretext: "Surely Lord K can't be that hard to beat, right? He's just a giant green dude with a fake cape and a fake crown. It's probably made of bronze or something, with some special gold paint to make it look cool. With these cards, he'll be easily destroyed! Yeah, hopefully he's somewhere in these woods.. Wait, why does that tree feel familiar? || After some time you found an altar, with a sign saying: 'DISPOSE OF CARDS HERE'. What could it be? Click a card to destroy it.",
        special: "destroycard",
        specialmax: 2,
        proceedtext: "Continue searching for Lord K.", 
        nextloc: "forest1",
    },
    "forest1": {
        name: "forest1",
        formal: "Mysterious Forest",
        desc: "An unexplored forest that allegedly contains the legendary Lord K, a giant known for destroying everything.",
        loretext: "Lord K is somewhere in this forest. For sure. You've been searching here for at least an hour, but there's no-<br>Bandits! They're everywhere!",
        proceedtext: "Fight the bandits, it's the only way to live!",
        proceedspecial: "fight|bandits",
        nextloc: "banditsvictory",
    },
    "banditsvictory": {
        name: "banditsvictory",
        formal: "Mysterious Forest",
        desc: "An explored forest that allegedly contains the legendary Lord K, a giant known for destroying everything.",
        loretext: "Whew. Those bandits were pretty annoying. Maybe they had information on Lord K. Should've asked them before they fled. Whatever, it's fine. All that matters is that you're alive.",
        proceedtext: "Keep exploring the forest.",
        nextloc: "lordkarena",
    },
    "leafos": {
        name: "leafos",
        formal: "Leafos",
        desc: "Something that fills the world.",
        loretext: "As you went along the road, trying to find Lord K, you found many things. A comically large crowbar. An unnecessarily large amount of coda coins scattered across the ground (unfortunately, they weren't real, so they were worthless). And, two strange creatures. || They were strange beings from the undocumented forest. Mysterious, you decided to look at them for a dangerously long amount of time. It was all fine, until, .text-woah{BOOM!} Their dead stare was broken, and now they were running straight out you. You didn't have enough time to think, and was forced to start a battle.",
        proceedtext: "Fight the Leafos.",
        proceedspecial: "fight|leafos",
        nextloc: "leafosvictory",
    },
    "leafosvictory": {
        name: "leafosvictory",
        formal: "Boraps Path",
        desc: "The road to Coda, formally known as the Boraps Path, as it technically goes through all of Boraps.",
        loretext: "They really thought! They may be monsters, but your cards are simply too powerful! They crumbled into the dust, rightfully so. || The forest where Lord K resided was very large. You could not distinguish rock from rock. Tree from tree. You still knew that you were making progress, however. || Wasn't that rock there before? Or is it a different rock? Hmm... || Hey, that tree looks familiar. ",
        proceedtext: "Continue exploring the forest.",
        nextloc: "lordkarena",
    },
    "forestclearing": {
        name: "forestclearing",
        formal: "Gloomy Forest Clearing",
        desc: "A dim, silent clearing bringing light to the dark forest that contains Lord K.",
        loretext: "At an old, overgrown and fallen log, you met a slow path to what you thought was a forest clearing. A minute or so later, you were in it. The sun's fading rays shone ever so slightly, now making only a faint difference between the experience under the thick canopies of the trees. || It was both full of life and devoid of it at the same time, with glowing fireflies and crickets chirping filling up the background. You kept continuing across the clearing, seeing a small, grey structure in the distance.",
        proceedtext: "Continue across the forest clearing.",
        nextloc: "forestcastle",
    },
    "forestcastle": {
        name: "forestcastle",
        formal: "Ancient Castle",
        desc: "Once full of life, this crippling, stony structure represents what once was a blooming village.",
        loretext: "There were ruins everywhere. Old stone bricks now sinking into the ground, pieces of wood and stone scattered across the ground. You could make out a few houses. || You made your way to the structure that mattered most to you: the castle. The great, wooden door that was meant to protect had now decayed, so you made your way through the thick vines that took up parts of the door. In the castle were very castly things, with castly doors and castly torches. You made a beeline to the throne room, where you saw an old, grand chair in the middle. There were tiny shreds of fabric, presumably carpet. || You went back, and navigated your way through a series of hallways with fallen roofs and broken walls. After many lefts and rights, you wound up in an old room with a wood surface mounted on a wall, and a broken mirror that was lavishly bordered sitting on it. || You looked into a it, and then three glowing orbs came out. || ???: What do you seek? || You: I seek.. rare relics. || ???: The equivalent of power. Do not make the same mistake that our ruler did. || You: What do you mean by that? || ???: Power corrupts. Absolute power corrupts absolutely. || You: But, I have good intentions! || ???: That is what they all say. They go on for a few years, making the village prosper with great amounts of wealth never seen before, and then it all burns. || The hoarse voice coughed, and continued. || ???: We are the three wise spirits, Avod, Lappur, and Praskim. We were once some of the greatest wizards in the world. || Praskim: Yes, yes, until that stupid king captured us for our powers. || Lappur: We are here to ensure that you don't do the same. || You: But, it's necessary. I have to get the duplication relic! || Avod: And? Destroy the world? It seems like you simply are too unwilling to believe what your inner motives are. || But.. You have gained so much. You defeated some of the best card battlers in town. What is stopping you from continuing? || Wise Spirits: We must end it here. We may not defeat you, but at least we can impede your progress. || You: You guys don't understand..",
        proceedtext: "End the stupid spirits.",
        proceedspecial: "fight|wisespirits",
        nextloc: "wisespirits",
    },
    "wisespiritsvictory": {
        name: "wisespiritsvictory",
        formal: "Ancient Castle",
        desc: "Once full of life, this crippling, stony structure represents what once was a blooming village.",
        loretext: "The spirits howled for a moment, and then slowly went back into their mirror. You explored the rest of the castle, but found nothing. It was all a waste. It aches your mind, not knowing what secrets lie in that ominous castle. But time is of the essence. You must continue your journey.",
        proceedtext: "Continue looking for Lord K.",
        nextloc: "lordkarena",
    },
    "banditsvictory": {
        name: "banditsvictory",
        formal: "Mysterious Forest",
        desc: "An explored forest that allegedly contains the legendary Lord K, a giant known for destroying everything.",
        loretext: "Whew. Those bandits were pretty annoying. Maybe they had information on Lord K. Should've asked them before they fled. Whatever, it's fine. All that matters is that you're alive.",
        proceedtext: "Keep exploring the forest.",
        nextloc: "lordkarena",
    },
    "lostcave": {
        name: "lostcave",
        formal: "Lost Cave",
        desc: "The entrance to an old, overgrown cave being slowly consumed by vines and flowers.",
        loretext: "You kept walking along the grass and flowers, until you saw a hidden cave shrouded by trees and vines. It was not easy to see, but your curious mind just happened to set sight on it. You moved the old vines and went forth to the cave, where you saw old logs and stones covered with life, including frogs and bugs. || Wondering about what was in the cave, you decided to enter, despite its entrance being rather unwelcoming and dark. There were faint sounds of water dripping, and the sounds of the cave life echoed throughout its stony walls. It was quite a challenge going deeper, as every stalagmites and hidden crevices filled the ground. Fortunately, you managed to make your way deeper into the cave without falling face first at all. || After walking into the cave quite a bit, you came up to what looked like an old kingdom. There were logs and big, stony structures, but there was no life. You could almost hear a bustling village echoing throughout the cave, slowly fading away. It became apparent after some time that there was absolutely no one there, but it brought to your mind the question of where everyone went. || The place was nothing much, the only thing that really stood out was a rusted metal door that contained big, bold letters reading: 'MARCO LABS'. You wanted to see what was in there, but it was locked and you didn't want to spend hours trying to open it. Eventually, you slowly walked out and went back to the forest.",
        proceedtext: "Keep exploring the forest.",
        nextloc: "lordkarena",
    },
    "lordkarena": {
        name: "lordkarena",
        formal: "Lord K Arena",
        desc: "An explored forest that allegedly contains the legendary Lord K, a giant known for destroying everything.",
        loretext: "After searching for some time, you found an arrow made of sticks on the ground, pointing to an area heavily covered by trees. By following the line of sticks, you managed to find a clearing that led to a ginormous circle of large trees. Past the trees was a ginormous circle made of some stone, with lights dotting it. In the center was a tall, green figure, just standing there. It was too late.. || Lord K: Who goes there? I will destroy you, for you have disturbed my peace! || If you run, he'll kill you. This is the only way.",
        proceedtext: "Battle Lord K for a chance of survival.",
        proceedspecial: "fight|lordk",
        nextloc: "lordkvictory",
    },
    "lordkvictory": {
        name: "lordkvictory",
        formal: "Mysterious Forest",
        desc: "An explored forest that allegedly contains the legendary Lord K, a giant known for destroying everything.",
        loretext: "After defeating Lord K, you started to slowly drag his giant cape and crown back to the factory, which was at least an hour away. The sun went down, and before midnight you reached the factory, as tired as you were when you went to the dance club. Cheese Dino looked surprised, getting even more shocked when the ACE machine confirmed its authenticity. He gave you the 1000 CC bounty that he promised, and he bode you farewell. You left and continued along the road.", 
        proceedtext: "Make your way to Coda.",
        nextloc: "roadtocoda5",
        locimg: "roadtocoda.png",
    },
    "roadtocoda5": {
        name: "roadtocoda5",
        formal: "Road to Coda",
        desc: "A road. Too tired to finish description.",
        loretext: "Continuing along the road, you eventually made a hammock from leaves, and fell asleep. Waking up, you continued, not seeing a single person on the desolate, barren road. Why was no one here? Anyways, it's fine. There's not that much of the road to go. You came to a billboard that said, 'CODA - 53 MILES | FILO - 182 MILES | FEEBOLE - 270 MILES'. At least Coda's the closest of the three. || An hour or two later, you came upon a machine that said, 'RANDOM STUFF BUY HERE'. It seemed strange for such thing to be in the middle of the desolate woods, but you were fine with it anyways. What should you get?",
        special: "shop|buycard|buyrelic", 
        proceedtext: "Continue your journey.",
        nextloc: "roadtocoda6",
        locimg: "roadtocoda.png",
    },
    "roadtocoda6": {
        name: "roadtocoda6",
        formal: "Road to Coda",
        desc: "A road.",
        loretext: "Hours passed as you slowly walked, your legs begging for mercy. Eventually, you came to a rest stop, which was a small wooden stand that offered a few items. || Shopowner: Going about on your way to Coda, huh? It's strange, not many people here this season. I usually get a lot of customers. Wasn't even able to stock up through some trading. Hopefully you'll buy one of the few items I have. || You: What are they? || Shopowner: Well, I'm offering a mystery card with DOUBLE stats for 120 coda coins and an energizer foil (makes card's starting cooldown 1 less) on a card for 150. On sale so people can buy them! Barely any business these past days.. I wonder why..", 
        proceedtext: "Continue your journey.",
        special: "store|mystery|energizer",
        nextloc: "trafficlordappear",
        locimg: "roadtocoda.png",
    },
    "crowattack": {
        name: "crowattack",
        formal: "Road to Coda",
        desc: "A road.",
        loretext: "You were walking down the road to Coda, bored and tired, when suddenly loud squawking appeared. A flurry of squawks and flaps left you stunned as a murder of crows started flying towards you. You didn't have enough time to think.. || Do something! Quick! ", 
        proceedtext: "Continue your journey.",
        special: "crowattack",
        nextloc: "trafficlordappear",
        forceaction: true,
        locimg: "roadtocoda.png",
    },
    "cardtornado": {
        name: "cardtornado",
        formal: "Road to Coda",
        desc: "A road.",
        loretext: "Buzz. Buzz. What's that strange noise? You tried going closer to it, seeing a slowly growing crowd of moving dots, like a wild hive of bees. Still curious, you continued to run closer to it. BZZ. BZZ. It was getting louder, now sounding like static noise. || Oh no! It turns out that the strange crowd of dots was actually a card tornado, speeding towards you faster than ever. What will you do?", 
        proceedtext: "Continue your journey.",
        special: "cardtornado",
        nextloc: "trafficlordappear",
        forceaction: true,
        locimg: "roadtocoda.png",
    },
    "trafficlordappear": {
        name: "trafficlordappear",
        formal: "Road to Coda",
        desc: "A ro.",
        loretext: "One question that you were still dying to know the answer for was: Where is everyone? Sure, there was that one rest stop, but else than that, you haven't met a single person on the road. What must be the cause of this? If so, how can this stop millions of people from traveling? || After some time, you felt a difference in the air. It was as if.. it was even more lonely. Lonelier than it was when you were already at max lonely. How is that possible? You kept walking, hoping to cover as many miles as possible. Why do cars have to be so expensive? || Eventually, you saw a big.. thing. It was entirely made of traffic cones, with big, mad eyes in the front. It was almost as large as Lord K, but there was something about it that didn't make you feel good.. || Traffic Lord: I am the Traffic Lord, and I you are not going to be allowed to continue along this road! || You: What? Why? I've walked like 60 miles already! It's been days! || Traffic Lord: Who asked? Who cares? I am here to take all of your belongings, so I can become the richest being in the world! || You: I'm sorry, but that title belongs to my uncle. || Traffic Lord: Are you sure? I can tell your uncle is struggling. Beanmelon may be the current largest company in the world, but will it last? He gets more and more unhinged everyday. Don't you know that there's something wrong? || You: What? No! What do you mean! Just start this battle already!", 
        proceedtext: "Battle Traffic Lord, the final obstacle blocking you from getting to Coda.",
        proceedspecial: "fight|trafficlord",
        nextloc: "trafficlordvictory",
    },
    "trafficlordvictory": {
        name: "trafficlordvictory",
        formal: "Road to Coda",
        desc: "A.",
        loretext: "The Traffic Lord was defeated. Now there was an answer to why the unending silence, which will soon be gone. While the final impediment to your journey to Coda may have been defeated, the lack of endurance and willpower may be your ultimate demise. There are still at least 40 miles left, and it has been more than a week now. Everything in terrible pain, tired and fatigued. 10 miles more and you might as well collapse and die. Hey.. is that.. a motorcycle? || You stumbled upon a man with spiky, black hair in a black and white coat. He was leaning on his motorcycle, which was leaning on a brown wooden fence. He appeared to be idle, just staring off into the distance, until you caught his eye. || ???: What can I do for you, sir? || You: Uh, can I use that motorcycle to ride along the road? || ???: You can't take it for yourself, but I can drive you to Coda for 600 coda coins. || You: 600 coda coins? || ???: Hey, it's not often I get someone who pays. I can't make money off of one drive a month. || It was the only way to go. 600 coda coins may be a lot, but it's much less than the cost of dying. || Interstate: My name's Interstate, by the way. It's best we leave now, it's an hour long drive.",
        proceedtext: "Hop on the motorcycle and pay Interstate the 600 coda coin fee.",
        nextloc: "coda",
    },
    "coda": {
        name: "coda",
        formal: "Coda",
        desc: "What many know as the largest city in the world, home to millions of people.",
        loretext: "Interstate: Okay, I'll leave you here. || You: Thanks for the ride! || Interstate left you just a few miles before Coda street, by far the busiest road in Coda. It was the road where all of the business happened, where all of the large penthouses and office towers and tourist attractions resided. Twilight would begin soon, so you decided it'd be best to go to another hotel for rest. You walked on the Boraps road until you found a map station, that showed you a layout of the city.  After some time, you found the hotel on the map. It was a 5 mile walk away, and between where your current location and the hotel there was a popular card store. You decided it'd be better to go there later. || During your walk, you spotted many buildings, like the tall BEAN TOWER, the corporate headquarters of Beanmelon Corp. It was just at the intersection between the Boraps Path and Coda Street, overshadowing many buildings with its large size, standing at above 1000 feet. The green light turned on, and you crossed the street, now seeing a large, 9-floor mall in front of you. It was enormous, stretching for more than 3 miles. You decided it'd be better to not enter the real life backrooms, so you crossed the street again, now only a few hundred meters from the hotel. || Almost at the hotel, you spotted the popular card store, Jamodar's Cards, which was very large. Tired, you made your way to the tall hotel, seeing a beautiful display of glossy, mottled marble tiles and fine chandeliers.",
        proceedtext: "Walk up to the register and book a room.",
        nextloc: "hotel2",
    },
    "hotel2": {
        name: "hotel2",
        formal: "Hotel",
        desc: "What many know as the largest city in the world, home to millions of people.",
        loretext: "Surprisingly, there weren't that many people at the hotel. It was a relatively calm day, so most people were probably working or doing their usual business. At the register, you were offered 2 choices, similar to those you got previously. You can book a room for 50 coda coins and gain 70 health, or get a free but low quality room, only healing 20 hp. What do you do?",
        special: "rest",
        proceedtext: "Sleep until the next day.",
        nextloc: "jamodarcards",
    },
    "jamodarcards": {
        name: "jamodarcards",
        formal: "Jamodar's Cards",
        desc: "The greatest hub for trading cards and upgrading them!",
        loretext: "A new day, a new thing to do! You woke up at 9am, tired and sleepy, but you decided to get out of bed anyways. You brushed your teeth, looked at your cards, and did all of the stuff that normal people do. After some time, you went downstairs and bought some food, making sure that you'll have a full stomach for the entire day. After eating, you walked to the building where cards were carded. || You opened the door and heard loud chattering, like Janjo's Tavern, except much more busy. Walking around the first floor, you saw lots of people talking and showing off their cool cards and whatnot. You made your way to a lonely machine with no one nearby, and looked at it closely. It had a big, yellow, neon sign that read, 'DUPLIC-O MACHINE: DUPLICATE A CARD HERE!' If you do, you'll get 50 coda coins. That's an amazing deal, right?",
        special: "duplicatecard",
        proceedtext: "Go up to the next floor.",
        nextloc: "jamodarcards2",
    },
    "jamodarcards2": {
        name: "jamodarcards2",
        formal: "Jamodar's Cards",
        desc: "The greatest hub for trading cards and upgrading them!",
        loretext: "After exploring the first floor, you decided to go check out the second. Walking up the stairs, you were presented with a cool forge with many people. There was a massive, feebolum and steel anvil covered in flames at the center, with a ginormous hammer hammer on the side. Here, you can choose to either apply a 30% boost to your card or an infernal foil, which: <br>1) Heals your card instead of damages it when given burn effect.<br>2)Has a 1/5 chance of burning opponent card, which deals 25 damage and applies level 5 burn.<br>Click the upgrade button and a card to upgrade it, or click the infernal button and a card to apply the foil. One card upgrade costs 50 coda coins, one infernal foil costs 150 coda coins.",
        special: "showopt|upgcard|infernalfoil",
        proceedtext: "Go up to the next floor.",
        nextloc: "jamodarcards3",
    },
    "jamodarcardsvendingmachine": {
        name: "jamodarcardsvendingmachine",
        formal: "Vending Machine",
        desc: "A bright, neon vending machine giving out random drinks.",
        loretext: "You were just about to go up to the next floor, when, out of the corner of your eye, you spotted a vending machine. 50 coda coins for a random drink. Is it worth it?",
        special: "jamodarcardsvendingmachine",
        proceedtext: "Go up to the next floor.",
        nextloc: "jamodarcards3",
    },
    "jamodarcardsdealer": {
        name: "jamodarcardsdealer",
        formal: "Jamodar's Cards",
        desc: "The greatest hub for trading cards and upgrading them!",
        loretext: "You walked around the building, where you spotted a table with a crowd around it. After some time, a few people left and you managed to talk with the guy at the table. || Dealer: Do you want to play a game? || You: What game? || Dealer: You can choose a number from 1-3. If you get it right, you get 100 coda coins. If you get it wrong, you lose 100 coda coins. || The odds are not in your favor.. But will luck be?",
        special: "jamodarcardsdealer",
        proceedtext: "Go up to the next floor.",
        nextloc: "jamodarcards3",
    },
    "jamodarcards3": {
        name: "jamodarcards3",
        formal: "Jamodar's Cards",
        desc: "The greatest hub for trading cards and upgrading them!",
        loretext: "You finally got up to the third floor, where a large crowd was gathered around one specific guy: Jamodar. You couldn't really tell what was happening, but after some asking around, it turned out that he was selling a special card foil: a .text-blue{Diamond} Foil. From what you've learned from your observations, it multiplies a card's health by 5 and attack by 2, but, if the card dies, there's a 1/5 chance it'll be .text-bold{PERMANENTLY} removed from your deck. It seems pretty cool.. Do you think it'll be pretty useful for a while? || Click a card to apply a diamond foil, which costs 200 coda coins.",
        special: "diamondfoil",
        proceedtext: "Go up to the next floor.",
        nextloc: "jamodarcardsroof",
    },
    "jamodarcardsroof": {
        name: "jamodarcardsroof",
        formal: "Jamodar's Cards Roof",
        desc: "The greatest hub for trading cards and upgrading them!",
        loretext: "After going up a few more floors, you made your way up to the roof. There was a large telescope surrounded at one corner, which was disabled due to it being daytime, peering at the sky. It was pretty cloudy today, and you were quite cold with all of the wind blowing. You could see a lot of the city with your view, observing the cars on the road and the people walking on the streets, conducting business and whatnot. || After some time, you went downstairs and back on to the streets. Where to next?",
        proceedtext: "Walk around the city and see what else there is to do.",
        nextloc: "ancientlibrary",
    },
    "ancientlibrary": {
        name: "ancientlibrary",
        formal: "Ancient Library",
        desc: "An old library full of ancient manuscripts and texts dating back to hundreds of years ago.",
        loretext: "After about half an hour of walking around the city, you came up to a library, which contained thousands of important texts that might be helpful for your journey. You made your way up the marble stairs, amazed by the slick and smooth, glossy design. You went up to the entrance, seeing a wide array of books, it was almost endless. Should you enter the library?",
        proceedtext: "Keep walking.",
        special: "setpart",
        setpart: ["1a"],
        specialopt: true,
        //excludegui: true,
        specialheader: "Enter the Library",
        specialdesc: "Who knows what knowledge it holds..",
        nextloc: "cursedtome",
    },
    "ancientlibrary1": {
        name: "ancientlibrary1",
        formal: "Ancient Library",
        desc: "An old library full of ancient manuscripts and texts dating back to hundreds of years ago.",
        loretext: "You decided to enter the library, going up and down many stairs and walking past tons of aisles. It seemed like there was no end to the library..",
        proceedtext: "Keep exploring.",
        nextloc: "cursedtome",
    },
    "cursedtome": {
        name: "cursedtome",
        formal: "Strange Tome",
        desc: "A book full of vile, dark spells that should not be unveiled.",
        loretext: "You walked around the library, coming up to a strange area where multiple aisles circled around one large, wooden and cylindrical pedestal, with a purple book lying on it. Its title was in some strange language you didn't understand, but nevertheless, it piqued your interest. The massiveness and lifelessness of the library only made the experience more strange. You decided to see what was in the book. || The book immediately sprang up into a jumble of pages and random stuff, with a purple glow surrounding it. There's so many twists and turns, where's the exit??",
        proceedtext: "Battle the Cursed Tome",
        proceedspecial: "fight|cursedtome",
        nextloc: "cursedtomevictory",
    },
    "cursedtomevictory": {
        name: "cursedtomevictory",
        formal: "Cursed Tome",
        desc: "A book full of vile, dark spells that should not be unveiled.",
        loretext: "Whew! That was close.. The Cursed Tome almost defeated you. After besting the tome, it slowly closed and fell back to its pedestal, where it lay still, unmoving and lifeless, looking like nothing had ever happened. It's been almost an hour now..",
        proceedtext: "Explore more of the library.",
        nextloc: "knowledge",
    },
    "owllibrarian": {
        name: "owllibrarian",
        formal: "Owl Librarian",
        desc: "A strange, cloaked librarian with a circular owl mask.",
        loretext: "Looking at the carpet floor of the library, you started to hear a faint clacking noise, the noise that footsteps make. As you kept walking it got louder, until you came up to a strange figure in a dark cloak with owl mask, who just happened to be the librarian. || Owl Librarian: What brings you here? || You: I don't know, I was looking for some cool books. || Owl Librarian: You seek knowledge? || You: Yes..? || Owl Librarian: Or do you seek power? || You: Uhhh.. Both? || Owl Librarian: And what will you do with it? Will you rule the world? Or will you destroy it? || You: I'll.. I'll do something... || Owl Librarian: Only those who deserve it may be in this library. What makes you worthy, different from every other power-seeking mortal? || You: Hmmm..",
        proceedtext: "You should not be here.",
        proceedspecial: "fight|owllibrarian",
        nextloc: "owllibrarian",
    },
    "owllibrarianvictory": {
        name: "owllibrarianvictory",
        formal: "Owl Librarian",
        desc: "A strange, cloaked librarian with a circular owl mask.",
        loretext: "After some time, the owl librarian fleed, running into the hundreds of aisles and twists and turns that made up the library. It's very likely that you're never going to see them again, but that's not what matters now. Where is the exit? This place is too big..",
        proceedtext: "Explore more of the library.",
        nextloc: "knowledge",
    },
    "knowledge": {
        name: "knowledge",
        formal: "Knowledge",
        desc: "An all-powerful thing.",
        loretext: "After a few more minutes of walking, you noticed two different books. One was blue and one was green. Which one should you read?",
        proceedtext: "Continue.",
        special: "knowledge",
        nextloc: "zeend",
    },
    "codastreets2": {
        name: "codastreets2",
        formal: "Streets of Coda",
        desc: "The thousands of walkways that lead people from place to place throughout the great city of Coda.",
        loretext: "It took you another 30 minutes after finding the books to get to the exit. There were so many different aisles and layouts and floors that you kept getting lost, not knowing where was where. Fortunately, you saw a familiar place and managed to get back to the entrance. Now you're back on the streets, looking for some other place to explore.",
        proceedtext: "Keep exploring.",
        special: "constructionsite",
        nextloc: "zeend",
    },
    "constructionsite": {
        name: "constructionsite",
        formal: "Construction Site",
        desc: "Something that will eventually be something else.",
        loretext: "After a few minutes, you came by a small construction site. There was a small crane building up a structure that was 3-floors tall, well in its current state. You decided to ask about what was being built, wondering about the various stairways and hallways that you saw. || Construct: Hey, my name's Construct. You say you're wondering about what we're building, huh? || You: Yeah. || Construct: Well, it's an office building. You know, to improve the economy. || You: A square office building? Boring. || Construct: Hey! It's not like I have a choice about what to build. I just follow whatever the engineer says. || You: Maybe you shouldn't. || Construct: Hmm.. you might be on to something.. || There was not much to see of that boring office building, so you decided to keep walking. ",
        proceedtext: "Keep exploring.",
        special: "constructionsite",
        nextloc: "zeend",
    },
    "maskedpeople": {
        name: "maskedpeople",
        formal: "Masked Group",
        desc: "A strange group of people in eerie masks and cloaks.",
        loretext: "You were walking down the city streets when a group of people in strange masks and dark, black cloaks started going towards you. Once they were up close, one of the masked people started talking in a rough, hoarse voice. || ???: The stars will align in a few weeks. Join us. || You: What do you mean? ||| ???: Join the cause. || When you took a closer look at them, you saw an awfully familiar object: A glistening red star medallion. Afer a long silence, they spoke again. || ???: We can make an offer. One special card for your membership. Choose wisely. || What do you do?",
        proceedtext: "Keep exploring.",
        special: "celestial",
        nextloc: "zeend",
    },
    "greenhouse": {
        name: "greenhouse",
        formal: "Greenhouse",
        desc: "A glass building housing hundreds and hundreds of wild plants.",
        loretext: "Following a long walk along the streets, you came by an interesting greenhouse. You could see a mesmerizing, glass structure and hundreds of plants in pots and whatnot. You decided to come in and see what was going on. || ???: Howdy, whatcha doin' here? Want to buy some plants? || You: What plants are there? || Clover: Well, my name's Clover. There's a bunch of different plants here, from blazing hot Horned Ember Melons to chaotic Death Beets. You know what, I'll give you an offer. One .text-italic{Horned Ember Melon} for 60 coda coins. It'll increase your maximum health and health by 50, and you will inflict double damage for the next 2 fights, but you will take 3x more damage during that duration.",
        proceedtext: "Keep exploring.",
        special: "hornedembermelon",
        nextloc: "zeend",
    },
    "bridge": {
        name: "bridge",
        formal: "Coda Bridge",
        desc: "An old, interstate bridge.",
        loretext: "Following some walking, you came up to a section of the road where a bridge went over. There was lots of graffiti all over, with random texts writting on the various pillars of the bridge. You looked closer, trying to make out the faded, dusty text on one of the pillars. This is what you saw:<br><div style='width:120px;height:120px;clip-path: polygon(22% 52%, 15% 18%, 15% 0%, 63% 14%, 85% 15%, 64% 48%, 100% 85%, 85% 85%, 85% 100%, 44% 80%, 15% 85%, 0% 85%);background:rgb(115,110,100);font-weight:bolder;'>DON'T FORGET! The code is 'STAR OF RED', okay? Be there tmr at 7pm.</div><br>What could it possibly mean?",
        proceedtext: "Keep exploring.",
        nextloc: "zeend",
    },
    /*"bridge": {
        name: "bridge",
        formal: "Coda Bridge",
        desc: "An old, interstate bridge.",
        loretext: "Following some walking, you came up to a section of the road where a bridge went over. There was lots of graffiti all over, with random texts writting on the various pillars of the bridge. You looked closer, trying to make out the faded, dusty text on one of the pillars. This is what you saw:<br><div style='width:120px;height:120px;clip-path: polygon(22% 52%, 15% 18%, 15% 0%, 63% 14%, 85% 15%, 64% 48%, 100% 85%, 85% 85%, 85% 100%, 44% 80%, 15% 85%, 0% 85%);background:rgb(115,110,100);font-weight:bolder;'>DON'T FORGET! The code is 'STAR OF RED', okay? Be there tmr at 7pm.</div><br>What could it possibly mean?",
        proceedtext: "Keep exploring.",
        nextloc: "zeend",
    },*/
    /*"pathnorth": {
        name: "pathnorth",
        formal: "The Path North",
        desc: "A path to the north.",
        loretext: "Eventually, you found yourself out of Coda, now walking towards the north.",
        proceedtext: "Keep exploring.",
        nextloc: "zeend",
    },*/
    "zeend": {
        name: "zeend",
        formal: "THE END",
        desc: "You have beaten the demo. Good job!",
        loretext: "You see a laid down 8 in front of you, with a strange aura surrounding it. The end is never the end is never the end is never the end is never the end is never the end is never the end is never ....",
        proceedtext: "This is your destiny..",
        special: "shop|buycard|buyrelic",
        nextloc: "home",
    },
};
var specials = {
    "buycard": {
        name: "buycard",
        formal: "Buy Card",
        desc: "Spend money to buy cards.",
    },
    "upgcard": {
        name: "upgcard",
        formal: "Upgrade Card",
        desc: "Upgrade a card's stats, like health and attack.",
    },
    "destroycard": {
        name: "destroycard",
        formal: "Destroy Card",
        desc: "Remove a card from your deck.",
    },
    "gaincard": {
        name: "gaincard",
        formal: "Gain Card",
        desc: "Get a card for free.",
    },
    "buyrelic": {
        name: "buyrelic",
        formal: "Buy Relic",
        desc: "Spend money to buy relics.",
    },
    "mystery": {
        name: "mystery",
        formal: "Mystery Card",
        desc: "Get a random card.",
    },
    "energizer": {
        name: "energizer",
        formal: "Energizer Foil",
        desc: "Apply energizer foil, that decreases starting cooldown.",
    },
    "infernalfoil": {
        name: "infernalfoil",
        formal: "Infernal Foil",
        desc: "Apply infernal foil, that gives fire resistance and damage.",
    },
};
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
var relics = {
    // rarity 1 == common, 2 == uncommon, 3 == rare
    emberring: {
        name: "emberring",
        formal: "Ember Ring",
        desc: "A strange ring that gives all of the beholder's cards an enchanted flame touch.",
        advdesc: "This ring gives flame touch, with a base value of 3,2. Flame touch makes it so all of your attacking cards inflict burn. Flamethrowers will deal +7 damage.",
        rarity: 1,
        attr: [3,2],
        attrincrease: [0.5,1],
        attrtype: "arrup",
        img: "emberring.png",
    },
    grandfatheroak: {
        name: "grandfatheroak",
        formal: "Grandfather Oak",
        desc: "A wise and majestic oak that has seen everything.",
        advdesc: "Having lived for so long, this tree grants your cards a base +10% health.",
        rarity: 2,
        attr: 10,
        attrincrease: 2,
        attrtype: "int",
        img: "grandfatheroak.png",
    },
    lifecapsule: {
        name: "lifecapsule",
        formal: "Life Capsule",
        desc: "A neon, futuristic capsule containing life essence.",
        advdesc: "The life capsule contains life essence that increases a player's max health. The base increase is 60, and then 9 for every additional capsule bought.",
        rarity: 1,
        attr: 60,
        attrincrease: 20,
        attrtype: "int",
        img: "lifecapsule.png",
    },
    redstarmedallion: {
        name: "redstarmedallion",
        formal: "Red Star Medallion",
        desc: "Pledge your loyalty to the star, and gain ultimate power.",
        advdesc: "Deal extra damage for every 10 health you are missing. Cultists will get double this amount, use 0.5 less mana, and will heal you one eighth of their damage.",
        rarity: 3,
        attr: 1,
        attrincrease: 0.25,
        attrtype: "int",
        img: "lifecapsule.png",
    },
    partyhat: {
        name: "partyhat",
        formal: "Party Hat",
        desc: "It's time for some big celebration!!",
        advdesc: "Heal 5% of your max health every time you win a battle.",
        rarity: 2,
        attr: 5,
        attrincrease: 5,
        attrtype: "int",
        img: "partyhat.png",
    },
    trashcan: {
        name: "trashcan",
        formal: "Trash Can",
        desc: "What a wasteful person.",
        advdesc: "Gain an extra discard. If you buy this enough times you'll be able to get more discards.",
        rarity: 1,
        attr: 1,
        attrincrease: 0.5,
        attrtype: "int",
        img: "trashcan.png",
    },
    coinsack: {
        name: "coinsack",
        formal: "Coin Sack",
        desc: "A big, leather sack made to hold as many coins as possible.",
        advdesc: "After a battle, gain double the amount of coins that you usually do. This increases by 15% for every duplicate you have. The '1' in this relic's stat value means that you earn 100% more coins than usual.",
        rarity: 1,
        attr: 1,
        attrincrease: 0.15,
        attrtype: "int",
        img: "coinsack.png",
    },
    mammothtusk: {
        name: "mammothtusk",
        formal: "Mammoth Tusk",
        desc: "An ancient tusk belonging to a mammoth uncovered near the Jarj Mountain Ranges.",
        advdesc: "If your board has 3 or more spearmen, they will deal 65% more damage. Otherwise, they will deal 25% less damage.",
        rarity: 2,
        attr: [65,25],
        attrincrease: [4,-2],
        attrtype: "arrup",
        img: "mammothtusk.png",
    },
    gamblersdice: {
        name: "gamblersdice",
        formal: "Gambler's Dice",
        desc: "A pair of dice that was once used by top gamblers.",
        advdesc: "Mana gain now goes from 60-150% of the standard amount. These stats slowly increase as you buy more of this relic.",
        rarity: 2,
        attr: [60,150],
        attrincrease: [5,5],
        attrtype: "arrup",
        img: "gamblersdice.png",
    },
    soullantern: {
        name: "soullantern",
        formal: "Soul Lantern",
        desc: "An arcane lantern with a radiating faint, blue glow.",
        advdesc: "Weakeners, wizards, soul keepers, and reapers all deal 20% more damage, your starting mana is also increased by 1 (fixed value).",
        rarity: 2,
        attr: 20,
        attrincrease: 3,
        attrtype: "int",
        img: "soullantern.png",
    },
    thundercrate: {
        name: "thundercrate",
        formal: "Thunder Crate",
        desc: "A supply crate that zaps out flashes of thunder.",
        advdesc: "Supply crates also energize cards, and vice versa.",
        rarity: 1,
        attr: 0,
        attrincrease: 0,
        attrtype: "int",
        img: "thundercrate.png",
    },
    hammerhammer: {
        name: "hammerhammer",
        formal: "Hammer Hammer",
        desc: "Hammer but two.",
        advdesc: "Factories and dyson spheres create 2 cards, but cost 1 more mana.",
        rarity: 1,
        attr: 0,
        attrincrease: 0,
        attrtype: "int",
        img: "hammerhammer.png",
    },
    frostyhorn: {
        name: "frostyhorn",
        formal: "Frosty Horn",
        desc: "An old, cold horn that calls to the beasts of frost.",
        advdesc: "When a card is used, the first Froster (on cooldown) on board loses its cooldown. The card used cannot be a Froster.",
        rarity: 2,
        attr: 0,
        attrincrease: 0,
        attrtype: "int",
        img: "frostyhorn.png",
    },
    quincyspillar: {
        name: "quincyspillar",
        formal: "Quincy's Pillar",
        desc: "A tall pillar standing out in the ambient distance.",
        advdesc: "Attacks that deal less than 45 damage give you 15 coda coins.",
        rarity: 1,
        attr: 15,
        attrincrease: 5,
        attrtype: "int",
        img: "quincyspillar.png",
    },
    orbmix: {
        name: "orbmix",
        formal: "Orb Mix",
        desc: "A special mix of substances to further enhance healing orbs.",
        advdesc: "Healing orbs heal 10 more hp.",
        rarity: 1,
        attr: 10,
        attrincrease: 4,
        attrtype: "int",
        img: "orbmix.png",
    },
    morningglory: {
        name: "morningglory",
        formal: "Morning Glory",
        desc: "A bright, blooming flower giving off a rich, aromatic scent.",
        advdesc: "Deal double damage on the first turn of every battle, but lose 15 coda coins if the attacked enemy doesn't die.",
        rarity: 1,
        attr: 1,
        attrincrease: 0.25,
        attrtype: "int",
        img: "morningglory.png",
    },
    blueprint: {
        name: "blueprint",
        formal: "Blueprint",
        desc: "Planning.. planning.. planning...",
        advdesc: "Gain 1 extra starting mana.",
        rarity: 3,
        attr: 1,
        attrincrease: 1,
        attrtype: "int",
        img: "blueprint.png",
    },
    watch: {
        name: "watch",
        formal: "Rusty Watch",
        desc: "An old, rusty watch. You might need to dust it off.",
        advdesc: "This watch gives an awareness of time to its users. Right now, it is .EXEC{new Date().getHours()}:.EXEC{new Date().getMinutes()}.",
        rarity: 2,
        attr: 0,
        attrincrease: 0,
        attrtype: "int",
        img: "watch.png",
    },
    knowledgejar: {
        name: "knowledgejar",
        formal: "Jar of Knowledge",
        desc: "An dusty jar containing great knowledge and wisdom.",
        advdesc: "You may only gain knowledge once you have bought this jar. <br>.EXEC{if (Object.keys(p1.relics).includes('knowledgejar')) randItem(importantoknowledgo)}",
        rarity: 2,
        attr: 0,
        attrincrease: 0,
        attrtype: "int",
        img: "knowledgejar.png",
    },
    quincychainsaw: {
        name: "quincychainsaw",
        formal: "Quincy's Chainsaw of Omega Doom",
        desc: "Once active, no one will survive..",
        advdesc: "You deal a base 50% more damage once death mode is activated.",
        rarity: 3,
        attr: 50,
        attrincrease: 10,
        attrtype: "int",
        img: "quincychainsaw.png",
    },
    redstarstaff: {
        name: "redstarstaff",
        formal: "Red Star Staff",
        desc: "A bloody, scarred staff with a red star in the center.",
        advdesc: "Every 5 turns, sacrifice 20 health but double the attack and health of all of your cards on board. Does not activate under 61 health.",
        rarity: 4,
        attr: 1,
        attrincrease: 0.2,
        attrtype: "int",
        img: "redstarstaff.png",
    },
    beamturret: {
        name: "beamturret",
        formal: "SXR-500",
        desc: "A metal turret that can shoot powerful plasma rays.",
        advdesc: "A secret creation from Marco. Every 4 turns, sacrifice 1 mana to deal 50 damage to the first opponent card.",
        rarity: 3,
        attr: 50,
        attrincrease: 15,
        attrtype: "int",
        img: "beamturret.png",
    },
    flamebean: {
        name: "flamebean",
        formal: "Flame Bean",
        desc: "A  legendary bean can containing fiery powers.",
        advdesc: "When attacking, have a 1/4 chance of dealing explosive damage, which deals 25 damage to 3 random opponent cards and applies extreme burn to them.",
        rarity: 5,
        attr: 0,
        attrincrease: 0,
        attrtype: "int",
        img: "flamebean.png",
    },
}
var cards = {
    spearman: {
        name: "spearman",
        formal: "Spearman",
        atk: 35,
        hp: 30,
        ammo: 1,
        maxammo: 1,
        manause: 1,
        cool: 1,
        coolleft: 0,
        desc:"A simple soldier with a spear, dealing high damage with quick movements.",
        funnyname: "SPEARMANITY",
        type: "Attack",
        img: "spearman.png",
        sound: "sword.mp3",
    },
    wizard: {
        name: "wizard",
        formal: "Wizard",
        atk: 50,
        hp: 20,
        ammo: 2,
        maxammo: 2,
        manause: 1,
        cool: 2,
        coolleft: 0,
        desc:"An apprentice in magic, shooting deadly arcane blasts while using low mana.",
        funnyname: "WIZARDY",
        type: "Attack",
        img: "wizard.png",
        sound:"spell1.mp3",
    },
    turret: {
        name: "turret",
        formal: "Turret",
        atk: 20,
        hp: 65,
        ammo: 3,
        maxammo: 3,
        manause: 1,
        cool: 2,
        coolleft: 0,
        stat: 6,
        statincrease: 1,
        desc:"A turret that deals lethal bursts of damage, assuring that no cards get destroyed.",
        funnyname: "TURRETATION",
        type: "Attack",
        img: "turret.png",
        sound: "shoot.mp3",
    },
    sniper: {
        name: "sniper",
        formal: "Sniper",
        atk: 120,
        hp: 50,
        ammo: 1,
        maxammo: 1,
        manause: 2,
        cool: 3,
        coolleft: 2,
        desc:"Precise shots that can take down the biggest, at a cost of time and mana.",
        funnyname: "SNIPERICIOUS",
        type: "Attack",
        img: "sniper.png",
        sound: "shoot.mp3",
    },
    soulkeeper: {
        name: "soulkeeper",
        formal: "Soul Keeper",
        atk: 35,
        hp: 40,
        ammo: 1,
        maxammo: 2,
        manause: 1.5,
        cool: 1,
        coolleft: 1,
        stat: 3,
        statincrease: 0.5,
        desc:"A creature that harvests the dead, growing stronger with each kill.",
        funnyname: "SOUL KEEPERINITY",
        type: "Attack",
        img: "soulkeeper.png",
    },
    healorb: {
        name: "healorb",
        formal: "Healing Orb",
        hp: 20,
        heal: 35,
        uses: 1,
        cool: 0,
        coolleft: 0,
        manause: 1,
        desc:"A simple orb, giving decent health when used.",
        funnyname: "HEALORBACIOUS",
        type: "Healing",
        img: "healorb.png",
    },
    healbubble: {
        name: "healbubble",
        formal: "Heal Bubble",
        hp: 30,
        heal: 15,
        uses: -1,
        ammo: 2,
        maxuses: 2,
        cool: 2,
        coolleft: 0,
        manause: 1,
        desc:"A bubble that continuously heals those around it when activated.",
        funnyname: "HEAL BUBBLONIUM",
        type: "Healing",
        img: "healbubble.png",
    },
    juggernaut: {
        name: "juggernaut",
        formal: "Juggernaut",
        atk: 70,
        hp: 100,
        ammo: 1,
        maxammo: 1,
        manause: 2,
        cool: 4,
        coolleft: 2,
        desc:"A robust and tanky fellow with slow but strong attacks.",
        funnyname: "JUGGERNAUTIOUS",
        type: "Attack",
        img: "juggernaut.png",
        sound: "bash.mp3",
    },
    flamethrower: {
        name: "flamethrower",
        formal: "Flamethrower",
        atk: 13,
        hp: 40,
        ammo: 8,
        maxammo: 8,
        manause: 0.5,
        cool: 3,
        coolleft: 2,
        desc:"Spews hot flames at a speedy rate, disintegrating those that aren't wary.",
        funnyname: "FLAMETHROWERY",
        type: "Attack",
        img: "flamethrower.png",
        sound: "burn.mp3",
    },
    charger: {
        name: "charger",
        formal: "Charger",
        atk: 50,
        hp: 30,
        ammo: 1,
        maxammo: 1,
        manause: 2,
        cool: 2,
        coolleft: 0,
        desc:"A card that slowly charges up damage, and uses all of it in one attack.",
        funnyname: "CHARGERINEKIT",
        type: "Attack",
        img: "charger.png",
    },
    solarprism: {
        name: "solarprism",
        formal: "Solar Prism",
        atk: 20,
        hp: 40,
        ammo: 1,
        maxammo: 1,
        manause: 0,
        cool: 2,
        coolleft: 0,
        desc:"A prism that harnesses the power from the sun, shooting beams at no cost.",
        funnyname: "SOLAR PRISMISM",
        type: "Attack",
        img: "solarprism.png",
        sound: "laser.mp3",
    },
    weakener: {
        name: "weakener",
        formal: "Weakener",
        atk: 20,
        hp: 30,
        ammo: 1,
        maxammo: 1,
        manause: 2,
        stat: 10,
        statincrease: 3,
        cool: 1,
        coolleft: 1,
        desc:"An evil sorcerer that learned the dark ways, weakening its enemies.",
        funnyname: "WEAKENERIUM",
        type: "Attack",
        img: "weakener.png",
        sound: "curse1.mp3",
    },
    supplycrate: {
        name: "supplycrate",
        formal: "Supply Crate",
        hp: 30,
        manause: 1,
        cool: 0,
        coolleft: 0,
        desc:"Provides ammo for allies, assuring that they will eliminate their opponents.",
        funnyname: "SUPPLY CRATORIANITE",
        type: "Support",
        img: "supplycrate.png",
    },
    atkpotion: {
        name: "atkpotion",
        formal: "Attack Potion",
        hp: 15,
        manause: 0,
        cool: 0,
        coolleft: 0,
        stat: 50,
        statincrease: 10,
        desc:"A strong potion that boosts an ally's attack by 50%.",
        funnyname: "ATTACK POTIONORIONIO",
        type: "Support",
        img: "atkpotion.png",
    },
    factory: {
        name: "factory",
        formal: "Factory",
        hp: 80,
        manause: 2,
        ammo: 1,
        maxammo: 1,
        coolleft: 0,
        cool: 2,
        desc:"An old factory known for producing efficient and deadly robots.",
        funnyname: "FACTORIDIGEN",
        type: "Support",
        img: "factory.png",
    },
    robot: {
        name: "robot",
        formal: "Robot",
        atk: 60,
        hp: 60,
        ammo: 1,
        maxammo: 1,
        manause: 1,
        cool: 1,
        coolleft: 1,
        desc:"A machine with a programming unlike others', with high and cheap damage.",
        funnyname: "ROBOTOMY",
        type: "Attack",
        obtainable: false,
        img: "robot.png",
    },
    managenerator: {
        name: "managenerator",
        formal: "Mana Generator",
        hp: 40,
        manause: 0, 
        ammo: 1,
        maxammo: 1,
        coolleft: 0,
        cool: 1,
        stat: 1,
        statincrease: 0.5,
        desc:"A janky old generator that creates mana for free.",
        funnyname: "MANA GENERATICONIC",
        type: "Support",
        img: "managenerator.png",
    },
    energycapsule: {
        name: "energycapsule",
        formal: "Energy Capsule",
        hp: 30,
        manause: 1, 
        ammo: 1,
        maxammo: 1,
        coolleft: 0,
        cool: 2,
        desc:"A capsule that holds enough energy to immediately activate any card.",
        funnyname: "ENERGY CAPSULIBANULI",
        type: "Support",
        img: "energycapsule.png",
    },
    dysonsphere: {
        name: "dysonsphere",
        formal: "Dyson Sphere",
        hp: 50,
        manause: 3,
        ammo: 1,
        maxammo: 1,
        coolleft: 0,
        cool: 2,
        desc:"Swirling around the sun, it creates solar prisms that consume its life force.",
        funnyname: "DYSON SPHERINICAL",
        type: "Support",
        img: "dysonsphere.png",
    },
    etherealguardian: {
        name: "etherealguardian",
        formal: "Ethereal Guardian",
        atk: 60,
        hp: 40,
        ammo: 1,
        maxammo: 1,
        manause: 1,
        cool: 1,
        coolleft: 1,
        desc:"A guardian that protects those with all its might, even preventing death.",
        funnyname: "ETHEREAL GUARDIANOSOS",
        type: "Attack",
        img: "etherealguardian.png",
    },
    jester: {
        name: "jester",
        formal: "Jester",
        atk: 20,
        hp: 10,
        ammo: 1,
        maxammo: 1,
        manause: 1,
        cool: 1,
        coolleft: 1,
        desc:"Dancing around, enemies will get confused, not knowing what to do.",
        funnyname: "JESTERIPIDES",
        type: "Attack",
        img: "jester.png",
    },
    cultist: {
        name: "cultist",
        formal: "Cultist",
        atk: 45,
        hp: 30,
        ammo: 1,
        maxammo: 1,
        manause: 2,
        cool: 2,
        coolleft: 0,
        desc:"One of the hidden conspirers that get stronger the more allies they have.",
        funnyname: "CULTISHTIDIAN",
        type: "Attack",
        img: "cultist.png",
    },
    reaper: {
        name: "reaper",
        formal: "Reaper",
        atk: 50,
        hp: 40,
        ammo: 1,
        maxammo: 1,
        manause: 2,
        cool: 1,
        coolleft: 1,
        desc:"A lethal reaper, sentencing cards to an inevitable death.",
        funnyname: "REAPERITIATE",
        type: "Attack",
        img: "reaper.png",
        sound: "scythe.mp3"
    },
    froster: {
        name: "froster",
        formal: "Froster",
        atk: 70,
        hp: 40,
        ammo: 1,
        maxammo: 1,
        manause: 2,
        cool: 1,
        coolleft: 1,
        desc:"An ice spirit that wields a powerful frost spear, freezing enemies.",
        funnyname: "FROSTERILICAL",
        type: "Attack",
        img: "froster.png",
        sound: "freeze.mp3",
    },
    ninja: {
        name: "ninja",
        formal: "Ninja",
        atk: 30,
        hp: 40,
        ammo: 4,
        maxammo: 4,
        manause: 1,
        cool: 1,
        coolleft: 1,
        desc:"Swift and precise, this ninja hides itself as it silently kills those around it.",
        funnyname: "NINJAMITY",
        type: "Attack",
        img: "ninja.png",
    },
    oblivion: {
        name: "oblivion",
        formal: "The Oblivion",
        atk: 200,
        hp: 70,
        ammo: 1,
        maxammo: 1,
        manause: 3,
        cool: 3,
        coolleft: 3,
        desc:"A monster from the darkness, its only will to murder.",
        funnyname: "OBLIVIONATED",
        type: "Attack",
        obtainable: false,
        img: "oblivion.png",
    },
    bus: {
        name: "bus",
        formal: "Transportation Bus",
        hp: 50,
        manause: 2,
        ammo: 1,
        maxammo: 1,
        coolleft: 0,
        cool: 3,
        desc:'"WE RIDE THE BUS, WE RIDE THE BUS, WE RIDE THE BUS!"',
        funnyname: '"WE RIDE THE BUS, WE RIDE THE BUS, WE RIDE THE BUS!"',
        type: "Support",
        img: "bus.png",
    },
    clonebox: {
        name: "clonebox",
        formal: "Clone Box",
        hp: 40,
        manause: 1,
        ammo: 1,
        maxammo: 1,
        coolleft: 0,
        cool: 2,
        desc:"A simple box that clones the first card.",
        funnyname: "CLONE BOXIHEMENTLY",
        type: "Support",
        img: "clonebox.png",
    },
    drawback: {
        name: "drawback",
        formal: "Drawback",
        hp: 10,
        manause: 2,
        ammo: 1,
        maxammo: 1,
        coolleft: 0,
        cool: 100,
        desc:"Everyone makes mistakes.",
        funnyname: "DRAWBACKIMIJIMI",
        type: "Action",
        img: "drawback.png",
    },
    bank: {
        name: "bank",
        formal: "Mana Bank",
        hp: 50,
        manause:0,
        ammo: 1,
        maxammo: 1,
        storedmana: 0,
        coolleft: 0,
        cool: 1,
        desc:"Slowly stores mana. Use to destroy this card and gain all stored mana.",
        funnyname: "BANKOBULATOR",
        type: "Support",
        img: "bank.png",
    },
    bandit: {
        name: "bandit",
        formal: "Mountain Bandit",
        atk: 50,
        hp: 40,
        ammo: 1,
        maxammo: 1,
        manause: 2,
        cool: 1,
        coolleft: 1,
        desc:"A traveler that goes from hill to hill, searching for someone to plunder.",
        funnyname: "BANDITODOBI",
        type: "Attack",
        img: "bandit.png",
    },
    armageddon: {
        name: "armageddon",
        formal: "Armageddon",
        hp: 50,
        manause:4,
        ammo: 1,
        maxammo: 1,
        coolleft: 0,
        cool: 1,
        desc:"The final day has come..",
        funnyname: "ARMAGEDDONCI",
        type: "Action",
        img: "armageddon.png",
    },
    ritual: {
        name: "ritual",
        formal: "Dark Ritual",
        hp: 30,
        manause:3,
        ammo: 1,
        maxammo: 1,
        coolleft: 0,
        cool: 1,
        desc:"The cloaked shadows gather around the altar, and they begin..",
        funnyname: "RITUALIMITY",
        type: "Action",
        img: "ritual.png",
    },
    teslacoil: {
        name: "teslacoil",
        formal: "Tesla Coil",
        atk: 60,
        hp: 40,
        ammo: 2,
        maxammo: 2,
        manause: 2.5,
        cool: 2,
        coolleft: 2,
        desc:"ZAP! ZAP!! Deal damage to every enemy card, not just the first one.",
        funnyname: "TESLA COILONOSCOPY",
        type: "Attack",
        img: "teslacoil.png",
    },
    cannoneer: {
        name: "cannoneer",
        formal: "Cannoneer",
        atk: 40,
        hp: 40,
        ammo: 2,
        maxammo: 2,
        manause: 2,
        cool: 2,
        coolleft: 1,
        desc:"BOOM!! KABLOOSH!! Send explosive cannonballs to enemies, doing big stunning damage.",
        funnyname: "CANNONICALLY",
        type: "Attack",
        img: "cannoneer.png",
        sound: "cannon.mp3",
    },
    bubblemancer: {
        name: "bubblemancer",
        formal: "Bubblemancer",
        hp: 40,
        heal: 20,
        uses: -1,
        ammo: 2,
        maxammo: 2,
        cool: 2,
        coolleft: 0,
        manause: 2.5,
        desc:"Purifying ally cards with bubbles and rainbows, negative effects will be completely wiped.",
        funnyname: "BUBBLEMANCER UNITED",
        type: "Healing",
        img: "bubblemancer.png",
        sound: "bubbles.mp3",
    },
    celestialstriker: {
        name: "celestialstriker",
        formal: "Celestial Striker",
        hp: 35,
        atk: 20,
        ammo: 4,
        maxammo: 4,
        stat: 10,
        cool: 3,
        coolleft: 0,
        manause: 4,
        desc:"Strikes enemies with powerful blasts from space.",
        funnyname: "CELESTIAL STRIKER'S PEAK",
        type: "Attack",
        obtainable: false,
        img: "celestialstriker.png",
        sound: "stars.mp3",
    },
    comet: {
        name: "comet",
        formal: "Comet",
        hp: 30,
        timer: 2,
        atk: 50,
        desc:"Goes boom.",
        discardable: false,
        funnyname: "COMETOMETRY",
        type: "Spawn",
        //obtainable: false,
        img: "comet.png",
        sound: "cannon.mp3",
    },
    hotpotato: {
        name: "hotpotato",
        formal: "Hot Potato",
        hp: 30,
        timer: 4,
        manause: 1,
        desc:"Make sure it's not in your inventory!",
        funnyname: "HOT POTATOLOGY",
        type: "Action",
        //obtainable: false,
        img: "hotpotato.png",
        sound: "potato.mp3",
    },
}
var modifiers = {
    "flametouch": {
        formal: "FlameTouch",
        name: "flametouch",
        desc: "All cards apply burning effect. The stat represents the intensity (x*8 dmg per turn) and the duration.",
        img: "FlameTouch.png",
    },
    "quickuse": {
        formal: "QuickUse",
        name: "quickuse",
        desc: "All cards have a decreased starting cooldown.",
        img: "QuickUse.png",
    },
    "soullantern": {
        formal: "SoulLantern",
        name: "soullantern",
        desc: "All wizardy cards have increased damage. (Weakener, wizard, reaper, etc.)",
        img: "soullantern.png",
    },
    /*"tank": {
        formal: "tank",
        name: "Tank",
        desc: "Cards have increased health.",
        img: "tank.png",
    },
    "strength": {
        formal: "strength",
        name: "Strength",
        desc: "Cards have increased attack.",
        img: "strength.png",
    },
    "healing": {
        formal: "healing",
        name: "Healing",
        desc: "Healing cards have increased healing power.",
        img: "healing.png",
    },*/
}

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
                set: ["home","roadtocoda","mysteryfight","owarpcenter","anyshops","tavern","taverngroupvictory","janjovictory","mysteryloc","tallmart","mysteryloc2","behindtallmart"],
                anyshops: ["cosmeticshop"],
                mysteryloc: ["cloakedhuman","speedingcar","none"],
                mysteryloc2: ["tallmartroof","suddenurge"],
                mysteryfight: ["andreasappear,andreasvictory","goldslimeappear,goldslimevictory","magicapprenticeappear,magicapprenticevictory"],
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
                set: ["mysteryloc","roadtocoda4","mysteryfight","lordkarena","lordkvictory","roadtocoda5","roadtocoda6","mysteryloc2","trafficlordappear","trafficlordvictory"],
                mysteryloc: ["strangealtar","unclemanstatue","none"],
                mysteryloc2: ["crowattack","cardtornado","none"],
                mysteryfight: ["forest1,banditsvictory","leafos,leafosvictory","forestclearing,forestcastle,wisespiritsvictory","forest1,banditsvictory","leafos,leafosvictory","forestclearing,forestcastle,wisespiritsvictory","lostcave"],
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
                name: "CodaCitodo",
                set: ["ancientlibrary1","mysteryfight","knowledge"],
                mysteryfight: ["cursedtome,cursedtomevictory","owllibrarian","owllibrarianvictory"],
            },
        },
    }
};
var keywords = ["anyshops","mysteryloc","mysteryloc2","mysteryloc3","mysteryfight","mysteryfight2"];
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
    var keys = Object.keys(obj);
    if (con) {
        for (let i =0; i < keys.length; i++) {
            let key = keys[i];
            // subobj?val=false
            // prop?val=false
            // prop?=false;
            let conditions = con.split(";");
            for (let j = 0; j < conditions.length; j++) {
                let tempcon = conditions[j].split("?");
                let secondary = tempcon[1].split("=");
                secondary[1] = morphType(secondary[1]);
                if (tempcon[0] == "subobj") {
                    if (obj[key][secondary[0]] == secondary[1]) {
                        keys.splice(keys.indexOf(key),1);
                    }
                }
                if (tempcon[0] == "prop") {
                    if (obj[key] == secondary[0]) {
                        keys.splice(keys.indexOf(key),1);
                    }
                }
            }
        }
    }
    
    return obj[keys[ keys.length * Math.random() << 0]];
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
    p1.drawarr = sample(Object.keys(p1.deck),Object.keys(p1.deck).length);
    let extraarr = sample(Object.keys(p1.deck),Math.min(Math.round(Object.keys(p1.deck).length/2),1));
    p1.drawarr.concat(extraarr);
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
            elem.style.mask = "url(#"+elem.maskeffect+")";
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
    let table = "inventory";
    if (otherargs.includes("addToDeck")) {
        table = "deck";
    } 
    if (Object.keys(Game[player][table]).length >= 10) {
        return "Too many cards!";
    }

    let chosenkey;
    chosenkey = randKey(Game[player].deck);
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
    if (otherargs.includes("addToDeck")) {
        chosenkey = randKey(shopcards);

        
    }
    if (specific == true) {
        chosenkey = cards[choice];
        if (otherargs.includes("addToDeck")) {
            chosenkey = shopcards[choice];
        }
        if (Object.keys(Game[player].deck).includes(choice) && otherargs.includes("addToDeck") == false) {
            chosenkey = Game[player].deck[choice];
        }
    }
    let key = {};
    assign(key,chosenkey);
    key.effects = [];
    if (otherargs.includes("addToDeck")) {
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
    console.log(otherargs);
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
            zecard.storedmana += 2;
        }
        if (Object.hasOwn(zecard,"timer")) {
            zecard.timer -= 1;
        }
        if (zecard.name == "hotpotato" && zecard.timer == 0) {
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
        p2.mana -= 3;
        if (randNum(0,1) == 1) {
            window.setTimeout(oppAttack,350);
        }   
        return true;
    } else {
        let feeling1 = randNum(1,3);
        if (feeling1 >1 && p2.mana > 7)  {
            aimode = 3;
        } else {
            aimode = 2;
        }
        console.log("YOOO");
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
    // var aimodes = 1,2,3 | 1: default, spend random amounts, select random cards | 2: save up, when many cards are on board, save up for more | 3: siege, attack with all force | 4: stock up, draw more cards
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
        if (aimode == 1) {
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
        console.log(card.effects);
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
                element.style.border = "3px solid maroon";
                window.setTimeout(unborder,500,id);
            }
            if (user == p1 && Object.hasOwn(p1.relics,"frostyhorn") && card.name != "froster") {
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
                    console.log(card.effects.filter(str => str.includes("ExtraAtk")).length,extracount)
                    if (card.effects.filter(str => str.includes("ExtraAtk")).length > extracount) {
                        let cm = cleanseModifier("Norm",card.effects.filter(str => str.includes("ExtraAtk"))[extracount]);
                        console.log(cm);
                        extraatk += Math.round(card.atk*(cm[0]/100));
                        extracount++;
                    }
                }
                if (arrHas(card.effects,"Bubbly")) {
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
                if (attacked == "Opp") {
                    opponent.health -= card.atk+extraatk;
                    if (card.name == "cultist") {
                        let add = 0;
                        let chosen;
                        for (let i = 0; i < Object.keys(user.inventory).length; i++) {
                            let tempchosen = user.inventory[Object.keys(user.inventory)[i]];
                            if (tempchosen.name == "cultist") {
                                add += 30;
                            }
                        }
                        opponent.health -= add;
                    }
                } else {
                    let zeattacked = opponent.inventory[attacked];
                    if (fmain == "p2") {
                        zeattacked = selected;
                        attacked = Object.keys(opponent.inventory)[findex];
                    }
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
                    if (card.name == "turret") {
                        card.atk += card.stat;
                    }
                    if (card.name == "cannoneer") {
                        if (arrHas(zeattacked.effects,"Stunned") == false) {
                            zeattacked.effects.push("Stunned{1,2}");
                        }
                        
                        for (let i = 0; i < 3; i++) {
                            let chosencard;
                            if (Object.keys(opponent.inventory).length < 4) {
                                chosencard = randKey(opponent.inventory);
                            } else {
                                chosencard = opponent.inventory[Object.keys(opponent.inventory)[i]];
                            }
                            chosencard.hp -= Math.round(card.atk*0.7);
                            if (arrHas(chosencard.effects,"Stunned") == false) {
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
                    if (card.name == "celestialstriker") {
                        drawCard(opponent,true,"comet");
                    }
                    if (card.cardmods.includes("infernalfoil") && arrHas(zeattacked.effects,"Burning") == false) {
                        if (randNum(1,5) == 5) {
                            extraatk += 25;
                            zeattacked.effects.push("Burning{3,1}");
                        }
                    }
                    /* MAIN DAMAGE */
                    zeattacked.hp -= card.atk+extraatk;
                    if (arrHas(zeattacked.effects,"Bubbly")) {
                        zeattacked.hp += card.atk+extraatk;
                    }
                    
                    if (card.name == "solarprism") {
                        opponent.health -= card.atk;
                    }
                    /* UNMAIN DAMAGE */
                    if (card.name == "charger") {
                        card.atk = 40;
                        for (let i = 0; i < 4; i++) {
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
                            } else {
                                opponent.health -= 20;
                            }
                        }
                    }
                    if (card.name == "weakener") {
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
                            let tempchosen = opponent.inventory[Object.keys(opponent.inventory)[i]];
                            tempchosen.hp -= Math.ceil(card.atk/7);
                            if (tempchosen.effects.some(str => str.includes("Shock")) == true) {
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
                            }
                        }
                        
                    }
                    if (card.name == "oblivion" && index != null && index == 0) {
                        zeattacked += card.atk;
                        user.mana += card.manause;
                        card.ammo += 1;
                    }
                    if (card.name == "oblivion" && index != 0 && zeattacked.hp - card.atk <= 0) {
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
                        if (arrHas(user.mods,"FlameTouch")) {
                            zeattacked.hp -= 7;
                        }
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
                        }
                        
                    }
                    if (card.name == "ninja") {
                        if (card.effects.some(str => str.includes("Camouflaged")) == false) {
                            card.effects.push("Camouflaged{1,2}");
                        }
                    }
                    if (card.name == "juggernaut" || card.name == "sniper") {
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
                        let tries = 0;
                        // rare error found here, reason stil unknown
                        do {
                            mosthp = 0;
                            chosen = null;
                            for (let i = 0; i < Object.keys(opponent.inventory).length; i++) {
                                let tempchosen = opponent.inventory[Object.keys(opponent.inventory)[i]];
                                if (tempchosen.hp > mosthp && tempchosen.effects.some(str => str.includes(substr)) == false) {
                                    chosen = tempchosen;
                                    mosthp = chosen.hp;
                                }
                            }
                            tries++;
                        } while (tries < 50)
                        if (chosen == null) {
                           
                        } else {
                            if (chosen.effects.some(str => str.includes(substr)) == false) {
                                chosen.effects.push("Death{1,1}");
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
                        if (zeattacked.cardmods.includes("diamondfoil") && randNum(1,5) == 5){
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
    if (user.inventory[Object.keys(user.inventory)[index]] != undefined) {
        if (Object.hasOwn(card,"discardable") && card.discardable == false) {
            console.log("Card is not discardable!");
            return false
        }
        let card = user.inventory[Object.keys(user.inventory)[index]];
        delete user.inventory[Object.keys(user.inventory)[index]];
        user.mana += 1;
        user.discards -= 1;
        update();
    }
    
}
function setStartMod(mod) {
    
    if (mod == "nephew") {
        drawCard("p1",true,"spearman","addToDeck");
        drawCard("p1",true,"spearman","addToDeck");
    }
    if (mod == "uncleman") {
        drawCard("p1",true,"factory","addToDeck");
        p1.maxhealth = 500;
        p1.health = 500;
        p1.maxdiscards = 2;
        p1.discards = 2;
        p1.managain = 7;
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
    let zelist = ["destroycard","upgcard","energizer","duplicatecard","infernalfoil","diamondfoil","gaincard","buycard"];
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
        if (curlocation.special.includes("|") == false) {
            curspecial1 = curlocation.special;
        } else {
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
                let chance = randNum(1,3);
                if (chance > 2) {
                    let chance2 = randNum(1,10);
                    if (chance2 > 0) {
                        if (Object.hasOwn(card,"atk")) {
                            card.atk *= randNum(7,20)/10;
                            card.atk = Math.round(card.atk);
                        }
                        if (Object.hasOwn(card,"heal")) {
                            card.heal *= randNum(7,20)/10;
                            card.heal = Math.round(card.heal);
                        }
                    } 
                    if (chance2 > 4) {
                        let prevcool = card.cool;
                        card.cool -= randNum(1,3);
                        if (card.cool < 1 && prevcool != 0) {
                            card.cool = 1;
                        }
                        if (card.cool < 0) {
                            card.cool = 0;
                        }
                        card.hp *= randNum(7,20)/10;
                        card.hp = Math.round(card.hp);
                    }
                    if (chance2 > 7) {
                        let prevuse = card.manause;
                        card.manause -= randNum(1,6)/2;
                        if (card.manause < 0.5 && prevuse >= 0.5) {
                            card.manause = 0.5;
                        }
                        if (card.manause < 0) {
                            card.manause = 0;
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
                if (chance >= 4) {
                    let chance2 = randNum(1,10);
                    if (chance2 > 0) {
                        if (Object.hasOwn(card,"atk")) {
                            card.atk *= randNum(10,20)/10;
                            card.atk = Math.round(card.atk);
                        }
                        if (Object.hasOwn(card,"heal")) {
                            card.heal *= randNum(10,20)/10;
                            card.heal = Math.round(card.heal);
                        }
                    } 
                    if (chance2 > 4) {
                        let prevcool = card.cool;
                        card.cool -= randNum(1,3);
                        if (card.cool < 1 && prevcool != 0) {
                            card.cool = 1;
                        }
                        card.hp *= randNum(10,20)/10;
                        card.hp = Math.round(card.hp);
                    }
                    if (chance2 > 7) {
                        let prevuse = card.manause;
                        card.manause -= randNum(1,6)/2;
                        if (card.manause < 0.5 && prevuse >= 0.5) {
                            card.manause = 0.5;
                        }
                        if (card.manause < 0) {
                            card.manause = 0;
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
                let relic = randKey(relics,"subobj?obtainable=false");
                console.log(relic);
                let chance = randNum(1,10);
                element.innerHTML = `<h2>${relic.formal}</h2>`;
                element.setAttribute("data-relic",relic.name);
                let cost = 2;
                cost *= (relic.rarity+1)**2;
                cost *= 20;
                cost = Math.round(Math.log(cost)*10);
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
        if (curspecial1 == "beancandispenser") {
            specialdiv.style.display = "block";
            byId("sc2").style.display = "none";
            byId("sc3").style.display = "none";
            byId("sc1").innerHTML = "<h2>Bean Dispenser</h2><p>+50 health, but at the cost of 20 coda coins. Capped at max health.</p>";
        }
        if (curspecial1 == "drinkrobot") {
            specialdiv.style.display = "block";
            byId("sc3").style.display = "none";
            byId("sc1").innerHTML = "<h2>FEEBOLE COLA</h2><p>A cola that many Feebolians drink. Sounds like ebola. 25 cost.</p>";
            byId("sc1").setAttribute("data-cost",25);
            byId("sc1").setAttribute("data-heal",40);
            byId("sc2").innerHTML = "<h2>NEON ENERGY</h2><p>NEON ENERGY! AMAZING FOR THE MIND! ULTIMATE ENERGY! 100 cost.</p>";
            byId("sc2").setAttribute("data-cost",100);
            byId("sc2").setAttribute("data-heal",-70);
        }
        if (curspecial1 == "fakecoins") {
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
            card.setAttribute("data-card",Object.keys(p1.deck)[(j*4)+i]);
            card.setAttribute("data-usetimes",0);
            card.className = "inventorytablecard";
            
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
            if (Object.hasOwn(curcard,"tempuses")) {
                card.innerHTML += curcard.tempuses+" AMMO | ";
            }
            if (Object.hasOwn(curcard,"uses") && Object.hasOwn(curcard,"tempuses") == false) {
                card.innerHTML += curcard.uses+" USES | ";
            }
            if (Object.hasOwn(curcard,"storedmana")) {
                card.innerHTML += curcard.storedmana+" STORED MANA | ";
            }
            if (Object.hasOwn(curcard,"manause")) {
                card.innerHTML += curcard.manause+" MU";
            }
            card.innerHTML += "<br><hr><span class='desc'>"+curcard.desc+"</span>";
            let tempimg;
            if (curcard.img != "") {
                tempimg = "url(img/cards/"+curcard.name+".png)";  
                card.style.backgroundSize = "140px 160px";
            } else {
                tempimg = "url()";
                card.style.backgroundSize = "140px 160px";
            }
            /*if (Object.hasOwn(curcard,"maskeffect")) {
                card.style.mask = "url(#"+curcard.maskeffect+")";
            }*/
            card.style.backgroundSize = "140px 160px";
            card.style.backgroundImage = tempimg;
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
                        if (p1.coins < 30) {
                            invspecial.innerHTML = "INSUFFICIENT FUNDS";
                            return false;
                        } else {
                            p1.coins -= 30;
                        }
                        if (typeof speciallock == "boolean") {
                            speciallock = 1;
                        } else {
                            speciallock++;
                        }
                        let card = p1.deck[element.getAttribute("data-card")];
                        card.hp *= 1.2;
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
                        }
                        updateAdventureScreen();
                    } else {
                        invspecial.innerHTML = "MAX CARD UPGRADES REACHED";
                    }
                }
                if (curlocation.name == "cosmeticshop") {
                    if (curspecial2 == "upgcard" && speciallock2 < 2) {
                        if (speciallock == true && speciallock2 == 1) {
                            return false;
                        } 
                        if (typeof speciallock2 == "boolean") {
                            speciallock2 = 1;
                        } else {
                            speciallock2++;
                        }
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
                            card.stat += card.statincrease;
                        }
                        updateAdventureScreen();
                    } else {
                        invspecial.innerHTML = "MAX CARD UPGRADES REACHED";
                    }
                }
                if (curlocation.name == "jamodarcards2") {
                    if (curspecial1 == "upgcard" && speciallock < 2) {
                        if (speciallock === true) { // very important; keyword 'true' is often converted to 1, so 1 == 1
                            return false;
                        }
                        if (typeof speciallock == "boolean") {
                            speciallock = 1;
                        } else {
                            speciallock++;
                        }
                        p1.coins -= 50;
                        let card = p1.deck[element.getAttribute("data-card")];
                        card.hp *= 1.3;
                        card.hp = Math.round(card.hp);
                        if (Object.hasOwn(card,"atk")) {
                            card.atk *= 1.3;
                            card.atk = Math.round(card.atk);
                        }
                        if (Object.hasOwn(card,"heal")) {
                            card.heal *= 1.3;
                            card.heal = Math.round(card.heal);
                        }
                        if (Object.hasOwn(card,"stat")) {
                            card.stat += card.statincrease*3;
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
    // DRACLAICEPS BOOKMARK
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
            p1.coins = 2000;
            for (let z = 0; z < Object.keys(p1.deck).length; z++) {
                let chosencard = p1.deck[Object.keys(p1.deck)[z]];
                chosencard.hp *= 3;
                if (Object.hasOwn(chosencard,"atk")) {
                    chosencard.atk *= 3;
                }
                if (Object.hasOwn(chosencard,"heal")) {
                    chosencard.heal *= 3;
                }
                if (Object.hasOwn(chosencard,"stat")) {
                    chosencard.stat += chosencard.statincrease*4;
                }
            }
            updateAdventureScreen();
        }
        if (sCondition("risk")[0] == true && Object.keys(p1.deck).length > 1) {
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
            if (Object.hasOwn(card,"coolleft")) {
                card.coolleft = 0;
            }
            if (Object.hasOwn(card,"manause") && card.manause > 1) {
                card.manause-=0.5;
            }
            p1.health += 100;
            p1.maxhealth += 100;
            updateAdventureScreen();
        }
        if (sCondition("unclemanstatue")[0] == true) {
            speciallock = true;
            let card = randKey(cards);
            drawCard("p1",true,card.name,"addToDeck");
            p1.health -= 100;
            if (p1.health < 1) {
                p1.health = 1;
            }
            updateAdventureScreen();
        }
        if (sCondition("flamebean")[0] == true) {
            speciallock = true;
            p1.health -= 50;
            let key = {};
            assign(key,relics.flamebean);
            p1.relics["flamebean"] = key;
            updateAdventureScreen();
        }
        if (sCondition("celestial")[0] == true) {
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
