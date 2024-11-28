const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const ballRadius = 10;

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let alreadyColliding = false;

const player = new Player();

const charHeight = 30;
const charWidth = 30;


let rightPressed = false;
let leftPressed = false;
let downPressed = false;
let upPressed = false;

let interval = 0;
var score = 0;

const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const collisionLayers = ["player","enemy","projectile","structure","scenery","boundaries",1,2,3,4,5,6,7,8];
// load assets
for (let i = 0; i < Object.keys(preloadImages).length; i++) {
    let image = preloadImages[Object.keys(preloadImages)[i]];
    images[image.name] = new Image();
    images[image.name].src = image.src;
}

// game items

/**
 * @type Array
 * A list of all projectiles' ids in game. Is a subset of the {@link idList}
 */
var projectileList = [];

var enemyList = [];

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// key handler functions
function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    } else if (e.key == "Up" || e.key == "ArrowUp") {
        upPressed = true;
    } else if (e.key == "Down" || e.key == "ArrowDown") {
        downPressed = true;
    }
    if (e.key == "q" && player.dashAvailable == true) {
        player.dashActive = true;
    }
}
function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    } else if (e.key == "Up" || e.key == "ArrowUp") {
        upPressed = false;
    } else if (e.key == "Down" || e.key == "ArrowDown") {
        downPressed = false;
    }
}
function initializeEnemy(id) {
    let enemy = idList[id];
    if (enemy.type == "beam") {
        enemy.state = "warn";
    }
    if (enemy.type == "spidlor") {
        enemy.state = "caution";
    }
    if (enemy.type == "octoborber") {
        enemy.state = "traverse";
        enemy.angle = lookAt([enemy.x,enemy.y],[player.x,player.y]);
        enemy.updateTrajectory();
        enemy.dx = -enemy.dx;
        enemy.dy = -enemy.dy;
    }
}
function handleEnemy(id) {
    let enemy = idList[id];
    if (enemy.type == "beam") {
        if (enemy.state == "warn") {
            enemy.width = 2000;
            enemy.height = 20;
            enemy.statetimer += 1;
            if (enemy.statetimer >= gameattr.beam.beamcharge) {
                enemy.state = "blast";
                enemy.statetimer = 0;
            }
        }
        if (enemy.state == "blast") {
            enemy.collisionActive = true;
            enemy.width = 2000;
            enemy.height = 30;
            enemy.statetimer += 1;
            if (enemy.statetimer >= gameattr.beam.beamlife) {
                enemy.destroy();
            }
        }
    }
    if (enemy.type == "spidlor") {
        if (enemy.state == "caution") {
            enemy.angle = lookAt([enemy.x,enemy.y],[player.x,player.y]);
            enemy.updateTrajectory();
            enemy.dx = -enemy.dx;
            enemy.dy = -enemy.dy;
            enemy.statetimer += 1;
            if (enemy.statetimer >= 100) {
                enemy.collisionActive = true;
            }
            if (enemy.statetimer % 200 == 0) {
                enemy.shootProjectile("spidlorweb");
            }
        }
        if (enemy.state == "panic") {
            enemy.angle = lookAt([enemy.x,enemy.y],[player.x,player.y]);
            enemy.updateTrajectory();
            enemy.dx = enemy.dx;
            enemy.dy = enemy.dy;
            enemy.statetimer += 1;
            if (enemy.statetimer % 100 == 0) {
                for (let i = 0; i < 3; i++) {
                    let rel_angle = -30+(i*30);
                    enemy.shootProjectile("spidlorweb",[["angle",enemy.angle+rel_angle]]); // shoot 3 spidlorwebs each with a 30 degree difference
                }
            }
        }
    }
    if (enemy.type == "octoborber") {
        if (enemy.state == "traverse") {
            enemy.statetimer += 1;
            if (enemy.statetimer % 400 == 0) {
                for (let i = 0; i < 8; i++) {
                    let rel_angle = i*45;
                    enemy.shootProjectile("borb",[["angle",rel_angle]]); // shoot 8 borbs everywhere
                }
            }
        }
    }
}
/**
 * Handles the projectiles that have collided with the player.
 */
function handleProjectileCollisions() {
    player.currentCollision = [...new Set(player.currentCollision)];
    for (let i = 0; i < player.currentCollision.length; i++) {
        // check if the id is in the projectiles list
        if (projectileList.includes(player.currentCollision[i])) {
            // get projectile
            let projectile = idList[player.currentCollision[i]];
            // handle damage
            player.health -= projectile.damage;
            console.log(projectile);
            if (projectile.type == "spidlorweb") {
                if (player.speed-1 >= 0) {
                    player.speed -= 1;
                    window.setTimeout(() => {player.speed += 1;},5000);
                }
            }
            // destroy projectile
            if (tryAccess(projectile,"disappearOnHit")) {
                console.log("hi");
                player.currentCollision = arrRemove(player.currentCollision,projectile.id);
                projectile.destroy();
                continue;
            }
            // remove projectile from collision list
            player.currentCollision = arrRemove(player.currentCollision,projectile.id);
        }
    }
}
function handleEnemyCollisions() {
    player.currentCollision = [...new Set(player.currentCollision)];
    for (let i = 0; i < player.currentCollision.length; i++) {
        // check if the id is in the enemies list
        if (enemyList.includes(player.currentCollision[i])) {
            // get enemy
            let enemy = idList[player.currentCollision[i]];
            // handle damage
            player.health -= enemy.damage;
            if (enemy.type == "spidlor" && enemy.state != "panic") {
                enemy.state = "panic";
                enemy.speed *= 2;
            }
            // destroy enemy {disabled}
            /*if (tryAccess(projectile,"disappearOnHit")) {
                console.log("hi");
                player.currentCollision = arrRemove(player.currentCollision,projectile.id);
                projectile.destroy();
                continue;
            }*/
            // remove projectile from collision list
            player.currentCollision = arrRemove(player.currentCollision,enemy.id);
        }
    }
}
function collisionDetection() {
    for (let i = 0; i < projectileList.length; i++) {
        // projectile list is a list of ids of projectiles, so must get the idList[id] first
        let projectile = idList[projectileList[i]];
        // projectile pos values
        let projLeft = projectile.x - projectile.width / 2;
        let projRight = projectile.x + projectile.width / 2;
        let projTop = projectile.y - projectile.height / 2;
        let projBottom = projectile.y + projectile.height / 2;
        // player pos values (MAKE GLOBAL WITH DRAW FUNCTION)
        let playerLeft = player.x - charWidth / 2;
        let playerRight = player.x + charWidth / 2;
        let playerTop = player.y - charHeight / 2;
        let playerBottom = player.y + charHeight / 2;
        // check if projectile is colliding with player
        // uses projectile.x/y + (projectile.width/height)/2 to count for the edges
        if (projectile.collision.includes("player") && projRight > playerLeft && projLeft < playerRight && projBottom > playerTop && projTop < playerBottom) {
            if (projectile.y + (projectile.height/2) > player.y - (charHeight/2) && projectile.y - (projectile.height/2) < player.y + (charHeight/2)) {
                if (projectile.currentCollision.includes("player") == false) {
                    projectile.currentCollision = setAdd(projectile.currentCollision,"player");
                    player.currentCollision = setAdd(player.currentCollision,projectile.id);
                    if (projectile.rebound) {
                        let overlapX = Math.min(projRight - playerLeft, playerRight - projLeft);
                        let overlapY = Math.min(projBottom - playerTop, playerBottom - projTop);
                        // horizontal/vertical collision;
                        if (overlapX < overlapY) {
                            projectile.dx = -projectile.dx;
                        } else {
                            projectile.dy = -projectile.dy;
                        }
                    }
                    
                } 
                
            } else {
                projectile.currentCollision = arrRemove(projectile.currentCollision,"player");
            }
        } else {
            projectile.currentCollision = arrRemove(projectile.currentCollision,"player");
        }
        // check if projectile is colliding with boundaries
        if (projectile.collision.includes("boundaries") && (projectile.x + projectile.dx > canvas.width - projectile.width/2 || projectile.x + projectile.dx < projectile.width/2 )) {
            projectile.dx = -projectile.dx;
        }
        if (projectile.collision.includes("boundaries") && (projectile.y + projectile.dy > canvas.height - projectile.height/2 || projectile.y + projectile.dy < projectile.height/2 )) {
            projectile.dy = -projectile.dy;
        }
    } 
    for (let i = 0; i < enemyList.length; i++) {
        // enemy list is a list of ids of enemys, so must get the idList[id] first
        let enemy = idList[enemyList[i]];
        if (!enemy.collisionActive) {
            continue;
        }
        // enemy pos values
        let enemyLeft = enemy.x - enemy.width / 2;
        let enemyRight = enemy.x + enemy.width / 2;
        let enemyTop = enemy.y - enemy.height / 2;
        let enemyBottom = enemy.y + enemy.height / 2;
        // player pos values (MAKE GLOBAL WITH DRAW FUNCTION)
        let playerLeft = player.x - charWidth / 2;
        let playerRight = player.x + charWidth / 2;
        let playerTop = player.y - charHeight / 2;
        let playerBottom = player.y + charHeight / 2;
        // check if enemy is colliding with player
        // uses enemy.x/y + (enemy.width/height)/2 to count for the edges
        // use Separating Axis Theorem
        console.log(enemy.type,isColliding(enemy,player))
        if (enemy.collision.includes("player") && isColliding(enemy,player)) {
            if (enemy.currentCollision.includes("player") == false) {
                enemy.currentCollision = setAdd(enemy.currentCollision,"player");
                player.currentCollision = setAdd(player.currentCollision,enemy.id);
                console.log(player.currentCollision);
                if (enemy.rebound) {
                    let overlapX = Math.min(enemyRight - playerLeft, playerRight - enemyLeft);
                    let overlapY = Math.min(enemyBottom - playerTop, playerBottom - enemyTop);
                    // horizontal/vertical collision;
                    if (overlapX < overlapY) {
                        enemy.dx = -enemy.dx;
                    } else {
                        enemy.dy = -enemy.dy;
                    }
                }
                
            } 
        } else {
            enemy.currentCollision = arrRemove(enemy.currentCollision,"player");
        }
        /*if (enemy.collision.includes("player") && enemyRight > playerLeft && enemyLeft < playerRight && enemyBottom > playerTop && enemyTop < playerBottom) {
            if (enemy.y + (enemy.height/2) > player.y - (charHeight/2) && enemy.y - (enemy.height/2) < player.y + (charHeight/2)) {
                if (enemy.currentCollision.includes("player") == false) {
                    enemy.currentCollision = setAdd(enemy.currentCollision,"player");
                    player.currentCollision = setAdd(player.currentCollision,enemy.id);
                    console.log(player.currentCollision);
                    if (enemy.rebound) {
                        let overlapX = Math.min(enemyRight - playerLeft, playerRight - enemyLeft);
                        let overlapY = Math.min(enemyBottom - playerTop, playerBottom - enemyTop);
                        // horizontal/vertical collision;
                        if (overlapX < overlapY) {
                            enemy.dx = -enemy.dx;
                        } else {
                            enemy.dy = -enemy.dy;
                        }
                    }
                    
                } 
                
            } else {
                enemy.currentCollision = arrRemove(enemy.currentCollision,"player");
            }
        } else {
            enemy.currentCollision = arrRemove(enemy.currentCollision,"player");
        }*/
        // check if enemy is colliding with boundaries
        if (enemy.collision.includes("boundaries") && (enemy.x + enemy.dx > canvas.width - enemy.width/2 || enemy.x + enemy.dx < enemy.width/2 )) {
            enemy.dx = -enemy.dx;
        }
        if (enemy.collision.includes("boundaries") && (enemy.y + enemy.dy > canvas.height - enemy.height/2 || enemy.y + enemy.dy < enemy.height/2 )) {
            enemy.dy = -enemy.dy;
        }
    } 
    
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status == 1) {
                if (
                    x > b.x &&
                    x < b.x + brickWidth &&
                    y > b.y &&
                    y < b.y + brickHeight
                ) {
                    dy = -dy;
                    b.status = 0;
                }
            }
        }
    }
    handleProjectileCollisions();
    handleEnemyCollisions();
}
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
function drawChar() {
    ctx.beginPath();
    ctx.rect(player.x, player.y, charWidth, charHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
function difficultyRamp() {
    // BEAM
    if (score % 50 == 0 && gameattr.beam.beamcharge > 49) {
        gameattr.beam.beamcharge -= 10;
    }
    if (score % 50 == 0 && gameattr.beam.beamcd > 1000) {
        gameattr.beam.beamcd -= 150;
        gameattr.beam.beamlife -= 10;
    }
    // SPIDLOR
    if (score % 250 == 0 && gameattr.spidlor.spidlorcd > 5000) {
        gameattr.spidlor.spidlorcd -= 150;
    }
    // FACEMISSILE
    if (score % 400 == 0 && gameattr.facemissile.facemissilepack < 20) {
        gameattr.facemissile.facemissilepack += 1;
    } 
}
function occasionalEvents() {
    // SPAWN HEALING
    if (score % 250 == 0) {
        let tempx = x+randNum(-100,100);
        let tempy = y+randNum(-200,20);
        let projectile = new Projectile(tempx,tempy,"star",[["angle",lookAt([player.x,player.y],[tempx,tempy])],["speed",0]]);
    }
}
function draw() {
    // END GAME WHEN HEALTH < 1
    if (player.health <= 0) {
        window.clearInterval(interval);
        byId("gameOver").style.display = "block";
        byId("scoreHeader").innerHTML = `Final Score: ${Math.round(score)}`;
    }
    let dashImpact = 1; // currently make dash impact speed by x1
    // COOLDOWN DASH
    // cooldown is 15 seconds
    if (player.dashAvailable == false) {
        player.dashActive = false;
        player.dashCD -= 1;
    }
    if (player.dashCD == 0) {
        player.dashCD = 750;
        player.dashAvailable = true;
    }
    if (player.dashActive == true) {
        player.dashCD = 750;
        player.dashAvailable = false;
        dashImpact = 40; // make dash impact speed by x40
    }
    score += 0.05; // 5 score per second
    score = stepRound(score,0.01);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "32px serif";
    ctx.fillText(`${player.health} 💖`,10,30);
    ctx.fillText(Math.round(score),380,30);
    //drawBricks();
    //drawBall();
    player.draw();
    collisionDetection();
    // draw all projectiles and calculate movemnet
    for (let i = 0; i < projectileList.length; i++) {
        let projectile = idList[projectileList[i]];
        projectile.draw();
        projectile.x += projectile.dx;
        projectile.y += projectile.dy;
        projectile.age += 1;
        if (projectile.age > projectile.lifespan) {
            projectile.destroy();
        }
    }
    for (let i = 0; i < enemyList.length; i++) {
        let enemy = idList[enemyList[i]];
        enemy.draw();
        enemy.x += enemy.dx;
        enemy.y += enemy.dy;
        enemy.age += 1;
        if (enemy.age > enemy.lifespan) {
            enemy.destroy();
        }
    }
    // handle enemies
    for (let i = 0; i < enemyList.length; i++) {
        handleEnemy(enemyList[i]);
    }

    /*if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y > canvas.height - ballRadius) {
        dy = -dy;
    }*/

    // handle player movement
    if (rightPressed && player.x < canvas.width - charWidth) {
        player.x += player.speed*dashImpact;
    } if (leftPressed && player.x > 0) {
        player.x -= player.speed*dashImpact;
    } if (downPressed && player.y < canvas.height - charHeight) { // down and up must be swapped for some reason
        player.y += player.speed*dashImpact;
    } if (upPressed && player.y > 0) {
        player.y -= player.speed*dashImpact;
    }
    // make sure player is not out fo boudns
    if (player.x > canvas.width - charWidth) {
        player.x = canvas.width - charWidth;
    }
    if (player.x < 0) {
        player.x = 0;
    }
    if (player.y > canvas.height - charHeight) {
        player.y = canvas.height - charHeight;
    }
    if (player.y < 0) {
        player.y = 0;
    }
    /* change positioning to random
    x += dx;
    y += dy;*/
    // handle difficulty ramping
    difficultyRamp();
    occasionalEvents();
}

function summonEnemy(type,changes=[]) {
    let tempx = x+randNum(-100,100);
    let tempy = y+randNum(-200,20);
    let enemy = new Enemy(tempx,tempy,type,changes);
}
function loop(fn,anchor) {
    window.setTimeout(() => {
        fn();
        loop(fn,anchor);
    },getNestedProperty(gameattr,anchor));
}

summonEnemy("beam");


function startGame() {
    interval = setInterval(draw, 10);
    window.setTimeout(() => {
        for (let i = 0; i < 10; i++) {
            let tempx = x+randNum(-100,100);
            let tempy = y+randNum(-200,20);
            let projectile = new Projectile(tempx,tempy,"facemissile",[["angle",lookAt([player.x,player.y],[tempx,tempy])],["rotation",100]]);
        }
    },4000);
    beamInterval = window.setTimeout(loop,gameattr.beam.beamcd,() => {summonEnemy("beam",[["rotation",randNum(-360,360)]])}, ["beam","beamcd"]);
    spidlorInterval = window.setTimeout(loop,gameattr.spidlor.spidlorcd,() => {if (score > 0) summonEnemy("spidlor",[["rotation",randNum(-360,360)]])}, ["spidlor","spidlorcd"]);
    faceMissileInterval = window.setTimeout(loop,gameattr.facemissile.facemissilecd,() => {
        if (score > 300) {
            for (let i = 0; i<gameattr.facemissile.facemissilepack;i++){
                let tempx = x+randNum(-100,100);
                let tempy = y+randNum(-200,20);
                new Projectile(tempx,tempy,"facemissile",[["angle",lookAt([player.x,player.y],[tempx,tempy])],["rotation",randNum(-360,360)]])
            }
        }
    }, ["facemissile","facemissilecd"]); // facemissile pack allows more than 1 spawning
    octoBorberInterval = window.setTimeout(loop,gameattr.octoborber.octoborbercd,() => {if (score > 450) summonEnemy("octoborber",[["rotation",randNum(-360,360)]])}, ["octoborber","octoborbercd"]);
}
function testCollision() {
    player.x = x;
    player.y = y;
    summonEnemy("beam");
    let enemy = idList[2];
    enemy.x = x;
    enemy.y = -200;
    console.log(isColliding(enemy,player));
}

document.getElementById("runButton").addEventListener("click", function () {
    startGame();
    this.disabled = true;
});
byId("reload").addEventListener("click", function () {
    window.location.reload();
});