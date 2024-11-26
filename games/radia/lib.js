var idList = {};
function genId() {
    // since object.keys returns string values, must convert to numbers first
    let takenIds = typeArr(Number,Object.keys(idList));
    let range = [1,INF];
    for (let i = 1; i < 1000; i++) {
        if (takenIds.includes(i) == false) {
            return i;
        }
    }
}
function lookAt(currentPos,lookPos) {
    // set variables
    let oX = currentPos[0];
    let oY = currentPos[1];
    let lX = lookPos[0];
    let lY = lookPos[1];
    // set sides
    let leg1 = oX-lX; // adjacent, as it is the x side
    let leg2 = oY-lY; // opposite, as it is the y side
    // find angle using arctan2 (full 180 degrees usage) y/x
    let angle = Math.atan2(leg2,leg1) * 180 / Math.PI; // convert to degrees
    angle = stepRound(angle,0.01);
    return angle;
}
class Player {
    constructor() {
        this.id = 0;
        idList[this.id] = this;
        // collision box
        this.collidesWith = ["enemy","projectile","structure"];
        this.currentCollision = [];
        // shape
        this.height = 30;
        this.width = 30;
        this.rotation = 0;
        
        this.x = (canvas.width - this.width) / 2;
        this.y = (canvas.height - this.height) / 2;
        // game attributes
        this.speed = 4;
        this.health = 100;
        this.maxHealth = 100;
        this.currentWeapon = null;
        // special abilities
        this.dashCD = 200;
        this.dashAvailable = true;
        this.dashActive = false;

    }
    draw() {
        ctx.beginPath();
        ctx.rect(player.x, player.y, charWidth, charHeight);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();
    }

}
/**
 * Creates a Projectile object
 */
class Projectile {
    /**
     * @param {string} type - The type of projectile
     * @param {Array | []} changes - Changes to the projectile's attributes
     * @example Projectile("orb",["speed",100]) - Spawns an orb that has a speed of 100
     */
    constructor(x,y,type,changes=[]) {
        // generate id and add to item list
        this.id = genId();
        idList[this.id] = this;
        projectileList.push(this.id);
        // access data
        this.projectileData = structuredClone(projectiles[type]);
        //console.log(this.projectileData);
        // start pos
        this.x = x;
        this.y = y;
        this.type = type;
        // makes shape rotated
        this.rotation = 0;
        // movement
        this.speed = this.projectileData.speed;
        this.aim = tryAccess(this.projectileData,"aim");
        this.angle = 0;
        this.dx = this.speed;
        this.dy = this.speed;
        
        // collision vars
        this.collision = this.projectileData.collision;
        this.currentCollision = [];
        this.rebound = this.projectileData.rebound;
        // shape
        this.width = this.projectileData.width;
        this.height = this.projectileData.height;
        this.img = tryAccess(this.projectileData,"img");
        this.imgSize = tryAccess(this.projectileData,"imgSize");
        // projectile attributes
        this.lifespan = this.projectileData.lifespan;
        this.age = 0;
        this.disappearOnHit = this.projectileData.disappearOnHit;
        this.damage = this.projectileData.damage;
        // special attribute changes
        for (let i = 0; i < changes.length; i++) {
            this[changes[i][0]] = changes[i][1];
        }
        // update trajectory to angle
        this.updateTrajectory();
    }
    updateTrajectory() {
        //this.angle = lookAt([this.x,this.y],[player.x,player.y]);
        let angleInRadians = (this.angle * Math.PI) / 180; // Convert to radians
        this.dx = this.speed * Math.cos(angleInRadians); // X Velocity
        this.dy = this.speed * Math.sin(angleInRadians); // Y Velocity
        if (this.aim) {this.dx=-this.dx;this.dy=-this.dy;} // since dx,dy makes projectile go away, this.aim makes projectile go towards
    }
    draw() {
        this.rotation = lookAt([this.x,this.y],[player.x,player.y]);
        // save canvas state
        ctx.save();
        
        ctx.beginPath();
        // move origin to center of object
        ctx.translate(this.x,this.y);
        // rotate canvas according to rotation
        ctx.rotate(degToRad(this.rotation+preloadImages[this.img].rotate));
        // set rect with origin
        //ctx.rect(-this.width/2,-this.height/2,this.width,this.height);
        // draw image with origin
        ctx.drawImage(images[this.img],-this.imgSize.width/2,-this.imgSize.height/2,this.imgSize.width,this.imgSize.height);
        ctx.rect(-this.imgSize.width/2,-this.imgSize.height/2,this.imgSize.width,this.imgSize.height);
        /*ctx.fillStyle = "white";
        ctx.fill();*/
        // reset canvas
        //ctx.setTransform(1,0,0,1,0,0);
        // draw image
        
        ctx.closePath();
        ctx.restore();
        //this.updateTrajectory();
    }
    destroy() {
        // remove projectile from idLists
        projectileList.splice(projectileList.indexOf(this.id),1);
        delete idList[this.id];
    }
}
/**
 * Creates an Enemy object
 */
class Enemy {
    /**
     * @param {string} type - The type of projectile
     * @param {Array | []} changes - Changes to the projectile's attributes
     * @example new Enemy("spidlor",["speed",100]) - Spawns a spidlor that has a speed of 100
     */
    constructor(x,y,type,changes=[]) {
        // generate id and add to item list
        this.id = genId();
        idList[this.id] = this;
        enemyList.push(this.id);
        // access data
        this.enemyData = structuredClone(enemies[type]);
        //console.log(this.enemyData);
        // start pos
        this.type = type;
        this.x = x;
        this.y = y;
        // makes shape rotated
        this.rotation = 0;
        this.lookAt = tryAccess(this.enemyData,"lookAt");
        // movement
        this.speed = this.enemyData.speed;
        this.angle = 0;
        this.dx = 0;
        this.dy = 0;
        
        // collision vars
        this.collision = this.enemyData.collision;
        this.collisionActive = false;
        this.currentCollision = [];
        this.rebound = false;
        // shape
        this.width = this.enemyData.width;
        this.height = this.enemyData.height;
        this.img = tryAccess(this.enemyData,"img");
        this.imgSize = tryAccess(this.enemyData,"imgSize");
        // enemy attributes
        this.lifespan = accessDefault(this.enemyData,"lifespan",INF);
        this.age = 0;
        this.state = "default";
        this.statetimer = 0;
        this.damage = this.enemyData.damage;
        // special attribute changes
        for (let i = 0; i < changes.length; i++) {
            this[changes[i][0]] = changes[i][1];
        }
        // update trajectory to angle
        this.updateTrajectory();
        initializeEnemy(this.id);
    }
    updateTrajectory() {
        let angleInRadians = (this.angle * Math.PI) / 180; // Convert to radians
        this.dx = this.speed * Math.cos(angleInRadians); // X Velocity
        this.dy = this.speed * Math.sin(angleInRadians); // Y Velocity
    }
    draw() {
        if (this.lookAt) this.rotation = lookAt([this.x,this.y],[player.x,player.y]);
        // save canvas state
        ctx.save();
        
        ctx.beginPath();
        // move origin to center of object
        ctx.translate(this.x,this.y);
        // rotate canvas according to rotation
        if (this.img != false) {
            ctx.rotate(degToRad(this.rotation+preloadImages[this.img].rotate));
        } else {
            ctx.rotate(degToRad(this.rotation));
        }
        
        
        // draw image with origin
        if (this.img != false) {
            ctx.drawImage(images[this.img],-this.imgSize.width/2,-this.imgSize.height/2,this.imgSize.width,this.imgSize.height);
        }
        if (this.type == "beam") {
            if (this.state == "warn") {
                // set rect with origin
                ctx.rect(-this.width/2,-this.height/2,this.width,this.height+this.statetimer/20);
                ctx.fillStyle = "rgb(150,150,150)";
                ctx.fill();
            }
            if (this.state == "blast") {
                // set rect with origin
                ctx.rect(-this.width/2,-this.height/2,this.width,this.height);
                ctx.fillStyle = "white";
                ctx.fill();
            }
            
        }

        
        // reset canvas
        //ctx.setTransform(1,0,0,1,0,0);
        // draw image
        
        ctx.closePath();
        ctx.restore();
    }
    shootProjectile(type,changes=[]) {
        console.log(this.angle,this.rotation);
        let projectile = new Projectile(this.x,this.y,type,[["angle",this.angle],...changes]);
    }
    destroy() {
        // remove projectile from idLists
        enemyList.splice(enemyList.indexOf(this.id),1);
        delete idList[this.id];
    }
}
// COLLISION FUNCTIONS
function rotatePoint(x, y, cx, cy, rad) {
    // rotatePoint formula is x' = xcos($theta)-ysin($theta), y' = ycos($theta)+xsin($theta)
    // cx,cy is origin. dx,dy is the new position if cx,cy is counted as origin
    let dx = x - cx;
    let dy = y - cy;
    return {
        // fix precision errors
        x: cx + dx * Math.cos(rad) - dy * Math.sin(rad),
        y: cy + dx * Math.sin(rad) + dy * Math.cos(rad),
    };
}
function getRotatedCorners(rect) {
    let cx = rect.x; // center x
    let cy = rect.y; // center y
    let w = rect.width / 2;
    let h = rect.height / 2;
    let rad = degToRad(rect.rotation);

    // Calculate corners relative to center
    return [
        rotatePoint(cx - w, cy - h, cx, cy, rad), // Top-left
        rotatePoint(cx + w, cy - h, cx, cy, rad), // Top-right
        rotatePoint(cx + w, cy + h, cx, cy, rad), // Bottom-right
        rotatePoint(cx - w, cy + h, cx, cy, rad)  // Bottom-left
    ];
}
function projectRectangle(corners, axis) {
    let min = Infinity;
    let max = -Infinity;

    for (let corner of corners) {
        let projection = (corner.x * axis.x + corner.y * axis.y)
        min = Math.min(min, projection);
        max = Math.max(max, projection);
    }
    return [min, max];
}
function getAxes(corners) {
    let axes = [];
    for (let i = 0; i < corners.length; i++) {
        let p1 = corners[i];
        let p2 = corners[(i + 1) % corners.length];
        // Normal to edge
        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;
        let length = Math.sqrt(dx ** 2 + dy ** 2);
        axes.push({ x: -dy / length, y: dx / length });
    }
    return axes;
}
function isColliding(rectA, rectB) {
    // Get all corners of both rectangles
    let cornersA = getRotatedCorners(rectA);
    let cornersB = getRotatedCorners(rectB);
    // Get axes to test (normals to edges of both rectangles)
    let axes = getAxes(cornersA).concat(getAxes(cornersB));

    for (let axis of axes) {
        let [minA, maxA] = projectRectangle(cornersA, axis);
        let [minB, maxB] = projectRectangle(cornersB, axis);
        if (maxA < minB - EPSILON || maxB < minA - EPSILON) {
            // Gap found, no collision
            return false;
        }
    }

    // No gaps found, collision exists
    return true;
}