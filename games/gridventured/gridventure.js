const gameContainer = document.getElementById('grid');
const levelContainer = document.getElementById('level-container');
var map = [];
var oldMap = [];
var currentLevel = levelset[1].level1;
var currentBlock = "stone";
var availableBlocks = [];
var runBtn = byId('runBtn');
var stopBtn = byId('stopBtn');
var clearBtn = byId('clearBtn');
var currentCharacter = characters[currentLevel.character];
var start = [];
var end = [];
var pathLength = [];
var stars = 0;
var levelSelect = byId('level-select');
var showPathBtn = byId('pathBtn');
var backBtn = byId('backBtn');
var levelText = byId('level-text');
var solComp = 0; // solution complexity
/* SPECIAL ENUMS */
function Enum(data) {
    return Object.freeze(data);
}
bools = Enum({
    TRUE: 1,
    FALSE: 0,
    FREE: 2,
});

class Character {

}



/**
 * renderLevel gets the current level and sets the current variables based off of the attributes
*/
function updateBlockCount() {
    // set available blocks
    clearChildren(byId("blocks"));
    for (let i = 0; i < availableBlocks.length; i++) {
        // add new block to block list
        let blockDiv = document.createElement("div");
        let block = availableBlocks[i];
        let blockName = block[0];
        let blockAmount = block[1];
        blockDiv.classList.add("block");
        blockDiv.setAttribute("data-block",blockName);
        blockDiv.style = blocks[blockName].css;
        blockDiv.style.display = "inline-block";
        if (blockAmount > 100) {
            blockAmount = "INF";
        }
        blockDiv.innerHTML = blockAmount;
        byId("blocks").appendChild(blockDiv);
        blockDiv.addEventListener("click", () => {
            currentBlock = blockDiv.getAttribute("data-block");
        });
    }
}

function renderLevel(level) {
    
    let arr = level.split(".");
    for (let i = 0; i < arr.length; i++) {
        if (isNaN(arr[i]) == false) {
            arr[i] = Number(arr[i]);
        }
    }
    console.log(arr);
    let chosenLevel = levelset[arr[0]][arr[1]];
    currentLevel = chosenLevel;
    currentCharacter = characters[currentLevel.character];
    console.log(chosenLevel);
    map = structuredClone(chosenLevel.map);
    oldMap = structuredClone(map);
    start = chosenLevel.start;
    end = chosenLevel.end;
    gameContainer.style.gridTemplateRows = `repeat(${map.length},50px)`;
    gameContainer.style.gridTemplateColumns = `repeat(${map[0].length},50px)`;
    levelText.innerHTML = chosenLevel.leveltext;
    byId("title").innerHTML = chosenLevel.title;
    byId("score").innerHTML = "No Score";
    // set available blocks
    availableBlocks = structuredClone(chosenLevel.blocks);
    clearChildren(byId("blocks"));
    for (let i = 0; i < availableBlocks.length; i++) {
        // add new block to block list
        let blockDiv = document.createElement("div");
        let block = availableBlocks[i];
        let blockName = block[0];
        let blockAmount = block[1];
        blockDiv.classList.add("block");
        blockDiv.setAttribute("data-block",blockName);
        blockDiv.style = blocks[blockName].css;
        blockDiv.style.display = "inline-block";
        if (blockAmount > 100) {
            blockAmount = "INF";
        }
        blockDiv.innerHTML = blockAmount;
        byId("blocks").appendChild(blockDiv);
        blockDiv.addEventListener("click", () => {
            currentBlock = blockDiv.getAttribute("data-block");
        });
    }
    renderMap(map);
}
renderLevel("1.level1");

// Create grid cells based on the map array
function renderMap(map) {
    gameContainer.innerHTML = ''; // Clear the grid
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            
            let cellData = map[row][col];
            if (Object.keys(translations).includes(String(cellData))) {
                cellData = translations[cellData];
            }
            cell.style = blocks[cellData]["css"];

            // Add content based on the type of cell (0: empty, 1: block, 2: obstacle)
            /*if (map[row][col] === 1) {
                cell.style.backgroundColor = 'gray'; // Block
            } else if (map[row][col] === 2) {
                cell.style.backgroundColor = 'red'; // Obstacle
            }*/

            // Set position and append to the grid container
            gameContainer.appendChild(cell);
        }
    }
}

function printMap(map) {
    map_str = ""
    for (let i = 0; i < map.length; i++) {
        map_str += map[i].join(" ");
        map_str += "\n"
    }
    console.log(map_str);
}


function translate(arr,side=null,type=null) {
    // translates the array/value, defaults translating to other side. if given side, will translate to that side.
    if (Array.isArray(arr) == false) {
        arr = [arr];
    }
    if (side == "num" || (Object.values(translations).includes(arr[0]) && side != "text")) {
        for (let i =0; i < arr.length; i++) {
            if (typeArr(Number,Object.keys(translations)).includes(arr[i])) {
                continue
            }
            arr[i] = Number(Object.keys(translations)[Object.values(translations).indexOf(arr[i])]);
        }
    } else if (side == "text" || (Object.keys(translations).includes(arr[0]) && side != "num")) {
        for (let i =0; i < arr.length; i++) {
            if (Object.values(translations).includes(arr[i])) {
                continue;
            }
            arr[i] = translations[arr[i]];
        }
    }
    if (type=="array") {
        return arr;
    }
    if (arr.length == 1) {
        return arr[0];
    } else {
        return arr;
    }
    
}
function replaceAllWith(map,replace,replacement,strict=false) {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map.length; j++) {
            // replaces all blocks within the current replace variation -> e.g. 2.1, 2.2, 2.3
            // FREE MODE
            if (strict == "free" && map[i][j] == replace) {
                map[i][j] = replacement;
                continue;
            }
            // strict mode
            if (map[i][j] == translate(replace,"num") && strict) {
                map[i][j] = replacement;
            }
            // default
            if (!strict && Math.floor(map[i][j] - translate(replace,"num")) == 0) {
                map[i][j] = replacement;
            }
        }
    }
    return map;
}
function findAll(map,find) {
    let pos_list = [];
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map.length; j++) {
            if (map[i][j] == translate(find,"num")) {
                pos_list.push([i,j]);
            }
        }
    }
    return pos_list;
}
function findFarthestOfType(map,position,find) {
    let farthest = [];
    let farthest_distance = 0;
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map.length; j++) {
            if (map[i][j] == translate(find,"num")) {
                let distance = Math.abs(position[0]-i)+Math.abs(position[1]-j);
                if (distance > farthest_distance) {
                    farthest_distance = distance;
                    farthest = [i,j];
                }
            }
        }
    }
    return farthest;
}
gameContainer.addEventListener('click', function (event) {
    if (!arrEqual(map,oldMap) && oldMap.length > 0) {
        console.log(map,oldMap);
        map = structuredClone(oldMap);
        renderMap(map);
        return;
    }
    
    if (event.target.classList.contains('cell')) {
        
        // Get the index of the clicked cell
        const cellIndex = Array.from(gameContainer.children).indexOf(event.target);
        const row = Math.floor(cellIndex / map[0].length);
        const col = cellIndex % map[0].length;
        // Update the map array (e.g., place a block in the clicked cell)
        if (typeArr(Number,translate(currentLevel.replaceable,"num",Array)).includes(currentLevel.map[row][col])) {
            // Check if block is unavailable
            if (availableBlocks.find((x) => x[0] == currentBlock)[1] < 1) {
                return false;
            } else {
                // subtract block when added
                if (map[row][col] != translate(currentBlock)) {
                    availableBlocks.find((x) => x[0] == currentBlock)[1] -= 1;
                }
            }
            if (map[row][col] != currentLevel.map[row][col] && map[row][col] != translate(currentBlock)) {
                if (availableBlocks.filter((x) => x[0] == translate(map[row][col],"text")).length > 0) {
                    availableBlocks.find((x) => x[0] == translate(map[row][col],"text"))[1] += 1;
                }
            }
            map[row][col] = translate(currentBlock,"num"); // Place a block
            oldMap = structuredClone(map);
            renderMap(map); // Re-render the grid
        }
        updateBlockCount();
    }
});
stopBtn.addEventListener("click",function() {
    if (!arrEqual(map,oldMap) && oldMap.length > 0) {
        map = structuredClone(oldMap);
        renderMap(map);
        return;
    }
});
clearBtn.addEventListener("click",function() {
    map = structuredClone(currentLevel.map);
    renderMap(map);
});
gameContainer.addEventListener('contextmenu', function (event) {
    if (!arrEqual(map,oldMap) && oldMap.length > 0) {
        map = structuredClone(oldMap);
        renderMap(map);
        return;
    }
    event.preventDefault();
    if (event.target.classList.contains('cell')) {
        // Get the index of the clicked cell
        const cellIndex = Array.from(gameContainer.children).indexOf(event.target);
        const row = Math.floor(cellIndex / map[0].length);
        const col = cellIndex % map[0].length;

        // Replace block
        if (map[row][col] == translate(currentBlock,"num")) {
            if (currentLevel.map[row][col] != translate(currentBlock,"num")) {
                // add back block if it isnt the default
                availableBlocks.find((x) => x[0] == currentBlock)[1] += 1;
            }
            console.log(currentBlock);
            map[row][col] = currentLevel.map[row][col]; // Reset block
            oldMap = structuredClone(map);
            renderMap(map); // Re-render the grid
        }
        updateBlockCount();
    }
});
function relPos(oldPos,change) {
    return [oldPos[0]+change[0],oldPos[1]+change[1]];
}
function showPathing(grid,level,character) {
    let origin_point = level.pathing_point;
    let character_directions = character.paths;
    for (let i = 0; i < character_directions.length; i++) {
        // set each path to red
        let path = relPos(origin_point, character_directions[i]);
        grid[path[0]][path[1]] = 2;
    }
    // highlight origin
    grid[origin_point[0]][origin_point[1]] = 2.3;
    return grid;
}
function shortestPathWithPoints(grid, start, end) {
    let rows = grid.length;
    let cols = grid[0].length;
    grid = structuredClone(grid);
    let curgrid = grid;
    

    // Directions for moving up, down, left, and right
    let directions = [
        [-1, 0],  // up
        [1, 0],   // down
        [0, -1],  // left
        [0, 1]    // right
    ];
    let visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    // Initialize a queue for BFS and visited set
    let queue = [[...start, structuredClone(curgrid), visited, [[...start]]]]; // each element is [row, col, path]
    
    let queue_visited = [];
    visited[start[0]][start[1]] = true;
    while (queue.length > 0) {
        let [r, c, pathgrid, visited, path] = queue.shift();
        // Check if we've reached the end position
        pathgrid = structuredClone(pathgrid);
        visited = structuredClone(visited);
        if (r == 0 && c == 7) {
            console.log("WHYY");
        }
        if (r === end[0] && c === end[1]) {
            solComp = queue_visited.length;
            return path;  // Return the path to the destination
        }
        //console.log(`Visiting: (${r}, ${c})`);
        // handle teleportation
        if (pathgrid[r][c] == 3) {
            let farthest = findFarthestOfType(pathgrid,[r,c],3);
            // PREVENTS ALL PATHS LONGER THAN 12000
            if (queue_visited.length > 12000) {
                break;
            }
            // Condition disables all visited teleporters from being used again
            if (farthest && queue_visited.some(pos => pos[0] == r && pos[1] == c) == false && queue_visited.some(pos => pos[0] == farthest[0] && pos[1] == farthest[1]) == false) {
                // create clone of the pathgrid
                let tempPathgrid = structuredClone(pathgrid);
                // sets the second portal to dirt
                tempPathgrid[farthest[0]][farthest[1]] = 0;
                // sets the first portal to dirt
                tempPathgrid[r][c] = 0;
                // makes it so you can revisit the portal
                for (let i = 0; i < visited.length; i++) {
                    for (let j = 0; j < visited[i].length; j++) {
                        if ([i,j] != [r,c]) {
                            visited[i][j] = false;
                        }
                        
                    }
                }
                visited[r][c] = false;
                queue.push([...farthest,tempPathgrid,visited,[...path,[farthest[0],farthest[1]]]]);
                //queue_visited.push([r,c]);
                
                continue;
            }
            continue;
        }
        if (pathgrid[r][c] == 4) {
            // RESET VISITED
            visited = replaceAllWith(visited,true,false,"free");
            pathgrid = replaceAllWith(pathgrid,5,-7,true);
            pathgrid = replaceAllWith(pathgrid,5.1,5,true);
            pathgrid = replaceAllWith(pathgrid,-7,5.1);
            pathgrid[r][c] = 0;
            //queue_visited.push([r,c]);
        }
        if (pathgrid[r][c] == 7) {
            // RESET VISITED
            visited = replaceAllWith(visited,true,false,"free");
            pathgrid = replaceAllWith(pathgrid,8,8.1,true);
            pathgrid[r][c] = 0;
            //queue_visited.push([r,c]);
        }
        if (pathgrid[r][c] == 9 && path.length > 3) {
            // For still water, send the player 2 back
            let oldPath = path[path.length - 3];
            for (let i =0; i < path.length-3; i++) {
                let step  = path[path.length - i - 1];
                console.log(path[path.length - i],step,visited);
                visited[step[0]][step[1]] = false;
            }
            pathgrid[r][c] = 0;
            r = oldPath[0];
            c = oldPath[1];
            
        }

        // Explore neighbors
        for (let [dr, dc] of currentCharacter.paths) {
            let nr = r + dr;
            let nc = c + dc;
            
            // Check bounds and if cell is traversable and not visited
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && typeArr(Number,translate(currentCharacter.traversable)).includes(pathgrid[nr][nc]) && !visited[nr][nc]) {
                // prioritizes solution first
                if (nr === end[0] && nc === end[1]) {
                    queue[0] = [nr, nc, pathgrid, visited, [...path, [nr, nc]]];
                    continue;
                }
                visited[nr][nc] = true;
                if (pathgrid[nr][nc] == 6.1) {
                    // check for bounds
                    if (nr+dr >= 0 && nr+dr < rows && nc+dc >= 0 && nc+dc < cols && typeArr(Number,translate(currentCharacter.traversable)).includes(pathgrid[nr+dr][nc+dc]) && !visited[nr+dr][nc+dc]) {
                        // go one extra block after going through hostile beezone
                        visited[nr+dr][nc+dc] = true;
                        queue.push([nr+dr,nc+dc,pathgrid,visited,[...path,[nr+dr,nc+dc]]]);
                        continue;
                    } else {
                        path.push([nr,nc]);
                        path.push([nr,nc]);
                    }
                }
                queue.push([nr, nc, pathgrid, visited, [...path, [nr, nc]]]); // Append new point to path
            }
        }
        if (currentCharacter.name == "phaser" && typeArr(Number,translate(currentCharacter.traversable)).includes(pathgrid[currentLevel.start[0]][currentLevel.start[1]]) && path.includes([currentLevel.start[0],currentLevel.start[1]]) == false) {
            queue.push([currentLevel.start[0],currentLevel.start[1],pathgrid,visited,[...path,[currentLevel.start[0],currentLevel.start[1]]]]);
        }
        queue_visited.push([r,c]);
        // prevent infinite loops
        if (queue_visited.length > 12000) {
            break;
        }
    }
    // If no path is found, return an empty array
    return [];
}




/** 
 * RunBtn -> onclick()
 * @return shortest path 
*/
runBtn.addEventListener("click", function() {
    // if oldMap doesn't exist, set oldMap to a copy of map
    if (oldMap.length == 0) {
        oldMap = structuredClone(map);
    }
    // set map to a copy of oldMap
    map = structuredClone(oldMap);
    // set oldMap to a copy of map. this will ensure that once map is updated to show path, it can return to oldMap afterwards.
    oldMap = structuredClone(map);
    let path = shortestPathWithPoints(map, start, end);
    // show path, with increasingly darker gradient to show the start and end
    for (let i =0; i < path.length; i++) {
        if (i/(path.length/4) < 1) {
            map[path[i][0]][path[i][1]] = 2;
        }
        if (i/(path.length/4) >= 1 && i/(path.length/4) < 2) {
            map[path[i][0]][path[i][1]] = 2.1;
        }
        if (i/(path.length/4) >= 2 && i/(path.length/4) < 3) {
            map[path[i][0]][path[i][1]] = 2.2;
        }
        if (i/(path.length/4) >= 3 && i/(path.length/4) < 4) {
            map[path[i][0]][path[i][1]] = 2.3;
        }
        renderMap(map);
    }
    renderMap(map);
    console.log("Path:", path); // Output: List of points in the shortest path or an empty array if no path
    if (path.length > 0) {
        pathLength = path.length;
        starstr = "";
        for (i = 0; i < currentLevel.scores.length; i++) {
            if (pathLength >= currentLevel.scores[i]) {
                stars += 1
                starstr += "⭐"
            } 
        }
        byId("score").innerHTML = `${pathLength} - ${starstr} <i style='font-size:10px;'>[${solComp}c]</i>`;
    }
});
showPathBtn.addEventListener("click", function() {
    // if oldMap doesn't exist, set oldMap to a copy of map
    if (oldMap.length == 0) {
        oldMap = structuredClone(map);
    }
    // set map to a copy of oldMap
    map = structuredClone(oldMap);
    // set oldMap to a copy of map. this will ensure that once map is updated to show path, it can return to oldMap afterwards.
    oldMap = structuredClone(map);
    // update map
    map = showPathing(map,currentLevel,currentCharacter);
    renderMap(map);
});
document.querySelectorAll(".level-button").forEach(function(elem) {
    elem.addEventListener("click", function() {
        levelSelect.classList.add("hide");
        levelContainer.classList.remove("hide");
        renderLevel(elem.getAttribute("data-level"));
    });
})
backBtn.addEventListener("click", function() {
    levelSelect.classList.remove("hide");
    levelContainer.classList.add("hide");
});