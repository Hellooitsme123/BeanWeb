var worlds = {
    "owarp_plains": {
        name: "Owarp Plains",
        lsid: 1,
    },
};
var blocks = {
    "dirt": {
        name: "Dirt",
        css: "background-image:url('img/dirt.png');",
        replaceable: true,
    },
    "stone": {
        name: "Stone",
        css: "background-image:url('img/stone.png');",
        replaceable: true,
    },
    "portal": {
        name: "Portal",
        css: "background-image:url('img/portal.png');",
        replaceable: true,
    },
    "path": {
        name: "Path",
        css: "background: red;",
        replaceable: true,
    },
    "path1": {
        name: "Path",
        css: "background: rgb(200,0,0);",
        replaceable: true,
    },
    "path2": {
        name: "Path",
        css: "background: rgb(150,0,0);",
        replaceable: true,
    },
    "path3": {
        name: "Path",
        css: "background: rgb(100,0,0);",
        replaceable: true,
    },
    "pressure_plate": {
        name: "Pressure Plate",
        css: "background-image:url('img/pressure_plate.png');",
        replaceable: true,
    },
    "metal": {
        name: "Metal",
        css: "background-image:url('img/metal.png');",
        replaceable: true,
    },
    "open_metal": {
        name: "Open Metal",
        css: "background-image:url('img/open_metal.png');",
        replaceable: true,
    },
    "limbo": {
        name: "Limbo",
        css: "background:white;",
        replaceable: true,
    },
    "beezone": {
        name: "Beezone",
        css: "background-image:url('img/beezone.png');",
        oldcss: "background:repeating-linear-gradient(45deg,yellow, yellow 10px,black 10px, black 20px) 50px 50px;",
        replaceable: true,
    },
    "hostile_beezone": {
        name: "Hostile Beezone",
        css: "background-image:url('img/hostile_beezone.png');",
        replaceable: true,
    },
    "key": {
        name: "Key",
        css: "background-image:url('img/key.png');",
        replaceable: true,
    },
    "door": {
        name: "Door",
        css: "background-image:url('img/door.png');",
        replaceable: true,
    },
    "open_door": {
        name: "Open Door",
        css: "background-image:url('img/dirt.png');",
        replaceable: true,
    },
    "still_water": {
        name: "Still Water",
        css: "background-image:url('img/still_water.png');",
        replaceable: true,
    }
};
const translations = {
    '0':"dirt",
    '1':"stone",
    '2':"path",'2.1':"path1",'2.2':"path2",'2.3':"path3",
    '3':"portal",
    '4':"pressure_plate",
    '5':"metal",'5.1':"open_metal",
    '6':"beezone",'6.1':"hostile_beezone",
    "7":"key",
    "8":"door","8.1":"open_door",
    "9":"still_water",
    "-7":"limbo",
};
const characters = {
    "nephew": {
        name: "nephew",
        paths: [[0,1],[1,0],[-1,0],[0,-1]],
        "traversable": ["dirt","path","path1","path2","path3","portal","pressure_plate","open_metal","beezone","hostile_beezone","open_door","key","still_water"],
    },
    "croolybooter": {
        name: "croolybooter",
        paths: [[0,1],[0,-1],[-1,-1],[-1,1],[1,0]],
        "traversable": ["dirt","path","path1","path2","path3","portal","pressure_plate","open_metal","beezone","hostile_beezone","open_door","key","still_water"],
    },
    "knighty": {
        name: "knighty",
        paths: [[2,1],[1,2],[-2,1],[-2,-1],[-1,2],[-1,-2],[2,-1],[1,-2]],
        "traversable": ["dirt","path","path1","path2","path3","portal","pressure_plate","open_metal","beezone","hostile_beezone","open_door","key","still_water"],
    },
    "phaser": {
        name: "phaser",
        paths: [[-1,-1],[1,1],[-1,1],[1,-1]],
        "traversable": ["dirt","path","path1","path2","path3","portal","pressure_plate","open_metal","beezone","hostile_beezone","open_door","key","still_water"],
    }
}
var levelset = {
    1: {
        level0: {
            map: [
                [0,0,0,0,0,0],
                [1,1,1,1,1,0],
                [0,5,4,0,0,3],
                [5,5,1,1,0,0],
                [1,1,0,4,0,0],
                [3,0,0,4,0,0]
            ],
            start: [0,0],
            end: [2,0],
            replaceable: [],
            blocks: [["dirt",INF],["stone",INF],["portal",INF],["pressure_plate",INF],["metal",INF]],
            character: "nephew",
            scores: [10,15,20],
            pathing_point: [3,3],
            title: "Tutorial (That I made in 2 minutes)",
            leveltext: "Observe and see what each block does. Click run to see the current path.",
        },
        level1: {
            map: [
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0]],
            start: [3,0],
            end: [0,0],
            replaceable: ["dirt","path"],
            blocks: [["dirt",INF],["stone",INF],["portal",INF],["pressure_plate",INF],["metal",INF]],
            character: "nephew",
            scores: [10,15,18],
            pathing_point: [1,1],
            title: "Small Beginnings",
            leveltext: "Create the longest fastest solution with these current blocks. Extremely long solutions (computing time > 6000) will not be counted.",
        },
        level2: {
            map: [
                [0,0,0,0,0,0],
                [0,0,0,0,0,0],
                [0,0,1,0,1,0],
                [0,0,0,0,0,0],
                [0,0,1,0,1,0],
                [0,0,0,0,0,0]
            ],
            start: [0,0],
            end: [3,3],
            replaceable: ["dirt","path"],
            blocks: [["dirt",INF],["stone",INF],["portal",INF],["pressure_plate",INF],["metal",INF]],
            character: "croolybooter",
            scores: [16,23,32],
            pathing_point: [1,3],
            title: "Pillars",
            leveltext: "The stone cannot be replaced. With the new character, try to make the longest path.",
        },
        level3: {
            map: [
                [0,0,0,0,0,0,1,0],
                [0,0,0,1,0,0,0,1],
                [0,0,0,1,0,0,0,0],
                [0,0,0,1,3,0,0,0],
                [0,0,0,1,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,3,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
            ],
            start: [0,0],
            end: [0,7],
            replaceable: ["dirt","path"],
            blocks: [["dirt",INF],["stone",7],["portal",7],["pressure_plate",2],["metal",2]],
            character: "knighty",
            scores: [10,13,16],
            pathing_point: [2,2],
            title: "Hopper",
            leveltext: "Try to make a slow solution for the knight.",
        },
        level4: {
            map: [
                [0,0,0,0,0,0],
                [0,0,0,0,0,0],
                [0,0,0,0,0,0],
                [6,1,1,1,0,1],
                [0,0,0,0,6,0],
                [0,0,0,0,0,0],
            ],
            start: [0,0],
            end: [4,4],
            replaceable: ["dirt","path"],
            blocks: [["dirt",INF],["stone",7],["portal",2],["pressure_plate",2],["metal",2]],
            character: "nephew",
            scores: [24,28,32],
            pathing_point: [2,2],
            title: "Beezone",
            leveltext: "Oh no! You can't edit in beezone blocks! (They're hazard blocks but that doesn't matter)",
        },
        level5: {
            map: [
                [0,0,0,0,0,0],
                [0,0,0,0,0,0],
                [0,0,6.1,6.1,6.1,0],
                [0,0,6.1,0,6.1,0],
                [0,0,6.1,6.1,6.1,0],
                [0,0,0,0,0,0],
            ],
            start: [3,3],
            end: [5,0],
            replaceable: ["dirt","path"],
            blocks: [["dirt",INF],["stone",7],["portal",2],["pressure_plate",2],["metal",2]],
            character: "croolybooter",
            scores: [16,21,26],
            pathing_point: [2,2],
            title: "Orang",
            leveltext: "Hostile beezone blocks make it so that characters go one extra in the direction they just went without using a turn. If the next cell is untraversable, they will be stunned and the path will gain 2 length. They also cannot be edited.",
        },
        level6: {
            map: [
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,1,0,1,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
            ],
            start: [4,4],
            end: [0,0],
            replaceable: ["dirt","path"],
            blocks: [["dirt",INF],["stone",7],["portal",2],["pressure_plate",1],["metal",2],["key",1],["door",1]],
            character: "phaser",
            scores: [14,17,20],
            pathing_point: [2,2],
            title: "Lightsleeper",
            leveltext: "The phaser can teleport back to its starting point.",
        },
        level7: {
            map: [
                [0,0,0,0,0,0],
                [0,0,0,0,0,0],
                [0,0,9,9,0,0],
                [0,0,9,9,0,0],
                [0,0,0,0,0,0],
                [0,0,0,0,0,0],
            ],
            start: [0,0],
            end: [5,5],
            replaceable: ["dirt","path"],
            blocks: [["dirt",INF],["stone",10],["portal",2],["key",1],["door",1],["hostile_beezone",10]],
            character: "nephew",
            scores: [28,40,52],
            pathing_point: [2,2],
            title: "Still Water",
            leveltext: "Moves you back.",
        },
    },
};