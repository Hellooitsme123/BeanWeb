const INF = Number.MAX_VALUE;
const EPSILON = Number.EPSILON;
function byId(id) {
    return document.getElementById(id);
}
function stepRound(num,step) {
    let step_count = Math.round(num/step);
    return step*step_count;
}
function randNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }
function randArr(arr) {
    return arr[Math.floor(Math.random()*arr.length)];
}
function roundToPlace(val,digit) {
    return Math.round((val + Number.EPSILON) * (10**digit)) / 100;
}
function getNestedProperty(obj, props) {
    props = structuredClone(props);
    if (props.length === 1) {
        return obj[props[0]];
    }
    let prop = props.shift();
    return getNestedProperty(obj[prop], props);
}
function splitTwo(str,dl1,dl2) {
    return str.split(dl1)[1].split(dl2)[0];
}
function replaceSplitTwo(str,rep,dl1,dl2) {
    return str.split(dl1)[0]+rep+str.split(dl1)[1].substring(str.split(dl1)[1].indexOf(dl2)+dl2.length);
}
function includeSubIndex(val,index,inc) {
    let includes = false;
    for (let i = 0; i < val.length; i++) {
        if (val[i][index] == inc) {
            includes = true;
        }
    }
    return includes;
}
function tryAccess(obj,key) {
    if (obj.hasOwnProperty(key)) {
        return obj[key];
    } else {
        return false;
    }
}
function accessDefault(obj,key,before) {
    if (obj.hasOwnProperty(key)) {
        return obj[key];
    } else {
        return before;
    }
}
function clearChildren(myNode) {
    while (myNode.firstChild) {
        myNode.removeChild(myNode.lastChild);
    }
}
function typeArr(type,arr) {
    for (let i =0; i < arr.length; i++) {
        arr[i] = type(arr[i]);
    }
    return arr;
}
function arrEqual(arr1,arr2) {
    if (arr1.length != arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        for (let j = 0; j < arr1[i].length; j++) {
            if (arr2[i][j] != arr1[i][j]) {
                return false;
            }
        }
    }
    return true;
}
function objectToArray(object) {
    let arr = [];
    for (let i =0; i < Object.keys(object).length; i++) {
        arr.push(object[Object.keys(object)[i]]);
    }
    return arr;
}
function arrRemove(arr,value) {
    return arr.filter(item => item !== value);
}
/**
 * setAdd() -> adds a new value to an array at the last index. if it is already in the array, it does not add it.
 * @param {array} arr - array
 * @param {*} value - value to add to array
 * @example
 * array = [1,2,3]
 * setAdd(array,2) -> returns [1,2,3]
 * setAdd(array,4) -> returns [1,2,3,4]
 */
function setAdd(arr,value) {
    if (arr.includes(value) == false) {
        arr.push(value);
        return arr;
    }
    return arr
}
function degToRad(deg) {
    return deg * Math.PI / 180;
}
function radToDeg(rad) {
    return rad * 180 / Math.PI;
}
function objExtract(obj,extract) {
    for (let subobj in obj) {
        console.log(`${subobj}: ${obj[subobj][extract]}`);
    }
}