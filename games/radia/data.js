let preloadImages = {
    facemissile: {name:"facemissile",src:"img/facemissile.png",rotate:90},
    spidlor: {name:"spidlor",src:"img/spidlor.png",rotate:90},
    spidlorweb: {name:"spidlorweb",src:"img/spidlorweb.png",rotate:0},
    star: {name:"star",src:"img/star.png",rotate:0,},
    octoborber: {name:"octoborber",src:"img/octoborber.png",rotate:0},
    borb: {name:"borb",src:"img/borb.png",rotate:0,},
    //beam: {src:"img/beam.png"},
}
var gameattr = {
    beam: {
        beamcharge: 150,
        beamcd: 5000,
        beamlife: 500,
    },
    spidlor: {
        spidlorcd: 15000,
    },
    facemissile: {
        facemissilecd: 5000,
        facemissilepack: 1,
    },
    octoborber: {
        octoborbercd: 22000,
    }
}
const images = {

}
const projectiles = {
    facemissile: {
        width: 30,
        height: 30,
        speed: 2,
        collision: ["player","boundaries"],
        disappearOnHit: true,
        rebound: true,
        lifespan: 2000, // 20 seconds
        damage: 10,
        img: "facemissile",
        imgSize: {width: 30,height:30},
    },
    spidlorweb: {
        width: 40,
        height: 40,
        speed: 1.5,
        collision: ["player"],
        disappearOnHit: true,
        rebound: false,
        lifespan: 500, // 5 seconds
        damage: 5,
        aim: true,
        img: "spidlorweb",
        imgSize: {width: 40,height: 40},
    },
    star: {
        width: 40,
        height: 40,
        speed: 0,
        collision: ["player"],
        disappearOnHit: true,
        rebound: false,
        lifespan: 1200, // 12 seconds
        damage: -30, // heal 30 hp
        img: "star",
        imgSize: {width: 50, height: 50},
    },
    borb: {
        width: 20,
        height: 20,
        speed: 3.5,
        collision: ["player"],
        disappearOnHit: false,
        rebound: true,
        lifespan: 200, // 2 seconds
        damage: 10,
        img: "borb",
        imgSize: {width: 25, height: 25},
    }
};
const enemies = {
    beam: {
        width: 2000,
        height: 30,
        speed: 0,
        damage: 20,
        collision: ["player"],
        //img: images.beam,
    },
    spidlor: {
        width: 53,
        height: 53,
        speed: 0.5,
        damage: 20,
        collision: ["player","boundaries"],
        projectile: "spidlorweb",
        lookAt: true,
        lifespan: 1200, // 12 seconds
        img: "spidlor",
        imgSize: {width: 80,height:80},
    },
    octoborber: {
        width: 40,
        height: 40,
        speed: 0.2,
        damage: 10,
        collision: ["player"],
        projectile: "borb",
        lookAt: true,
        lifespan: 2000, // 20 seconds
        img: "octoborber",
        imgSize: {width: 45,height: 45},
    }
};
const weapons = {};