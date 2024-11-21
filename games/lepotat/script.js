var currentDiv = byId("menu");
var changeGUIDebounce = false;
function changeGUI(div,div2) {
    if (changeGUIDebounce == true) {
        return false;
    }
    changeGUIDebounce = true;
    window.setTimeout(() => changeGUIDebounce=false,1400);
    savedStyle = [div.style.position,div.style.transition,div2.style.transition];
    div2.style.opacity = 0;
    div.style.transition = '1s opacity ease-in-out';
    div2.style.transition = '1s opacity ease-in-out';
    
    div.style.position = 'absolute';
    div2.style.display = "block";
    currentDiv = div2;
    window.setTimeout(function() {
        div.style.opacity = 0;
        div2.style.opacity = 1;
        
    },100);
    window.setTimeout(function() {
        div.style.display = "none";
        div.style.position = savedStyle[0];
        div.style.transition = savedStyle[1];
    },1000);
    
    window.setTimeout(function() {
        div2.style.transition = savedStyle[2];
    },1200);
}
function initialize() {
   /* HIDE GUI */ 
    excludeHide = ["menu"]
    document.querySelectorAll(".main-div").forEach((elem) => {
        if (excludeHide.includes(elem.getAttribute("id")) == false) {
            elem.style.display = "none";
        }
            
    });
    document.querySelectorAll(".widget, .redirect-block").forEach((elem) => {
        elem.addEventListener("click",() => {
                changeGUI(currentDiv,byId(elem.getAttribute("data-div")));
        })
    });
}
byId("play").addEventListener("click",function() {
    changeGUI(byId("menu"),byId("orders"));
});
initialize();

var inventory = {};
var unlocked = {};

