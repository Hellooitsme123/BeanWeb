byId("submit").addEventListener("click",function() {
    color1 = byId("color1").value.split(",");
    color2 = byId("color2").value.split(",");
    color3 = [];
    for (let i = 0; i < 3; i++) {
        color3.push(Math.round((Number(color1[i])+Number(color2[i]))/2));
    }
    color3 = color3.join(",");
    byId("box").style.background = "rgb("+color3+")";
    byId("colorval").innerHTML = color3;

});