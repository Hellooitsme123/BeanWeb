var roomP = byId("roomP");
var roomH = byId("roomH");
var eventP = byId("eventP");
var actionList = byId("actionlist");
var invList = byId("inventory");
var curPlace = places.spawn;
var inventory = [];
function start() {
    update();
}
function update() {
    roomH.innerHTML = curPlace.formal;
    roomP.innerHTML = curPlace.viewtext;
    clearChildren(actionList);
    for (let i = 0; i < Object.keys(curPlace.actions).length; i++) {
        let li = document.createElement("li");
        action_name = Object.keys(curPlace.actions)[i];
        action_data = curPlace.actions[action_name];
        if (Object.hasOwn(action_data,"available") && action_data.available == false) {
            continue;
        }
        li.innerHTML = action_data.formal;
        li.setAttribute("data-action", action_name);
        li.addEventListener("click",function() {
            doAction(li);
        });
        actionList.appendChild(li);
    }
    clearChildren(invList);
    for (let i = 0; i < inventory.length; i++) {
        let li = document.createElement("li");
        item_name = inventory[i];
        item_data = items[item_name];
        li.innerHTML = item_data.formal;
        li.setAttribute("data-item", item_name);
        li.addEventListener("click",function() {
            doAction(li);
        });
        invList.appendChild(li);
    }
}
function doAction(elem) {
    action_data = curPlace.actions[elem.getAttribute("data-action")];
    spec_action = action_data[action_data.type]
    if (Object.hasOwn(spec_action,"con") == false || spec_action.con() == true) {
        eventP.innerHTML = spec_action.success.text;
        if (Object.hasOwn(spec_action.success,"result")) {
            spec_action.success.result();
        }   
    } else {
        eventP.innerHTML = spec_action.failure.text;
        if (Object.hasOwn(spec_action.failure,"result")) {
            spec_action.failure.result();
        }   
        
    }
    update();
}
function eventOptions(choicearr) {
    /* for each of choicearr as i: [btn-text,function,result-text]*/
    clearChildren(byId("choices"));
    for (let i =0; i < choicearr.length; i++) {
        let btn = document.createElement("button");
        btn.innerHTML = choicearr[i][0];
        btn.addEventListener("click",() => {choicearr[i][1]();eventP.innerHTML = choicearr[i][2];update();clearChildren(byId("choices"))});
        byId("choices").appendChild(btn);
    }
}
start();