var classes = {
    "LossDefense": {
        lossimpact:0.5,
        gain: 0.7,
    }
};
var currentClass = classes.LossDefense;
var betInput = byId("bet_amount");
var betBtn = byId("bet");
var scoreP = byId("score");
// CASINO
var score = 100;
var aimode = 50;

function update() {
    scoreP.innerHTML = score + " | "+aimode;
}

betBtn.addEventListener("click", function() {
    let betAmount = Number(betInput.value);
    if (betInput.value != 0 && betInput.value <= score) {
        
        betInput.value = 0;
        let airoll = randNum(aimode*0.5,aimode*1.5);
        let aidiff = 0;
        let returnAmount = (betAmount*airoll)/50;
        console.log(betAmount,returnAmount);
        if (returnAmount > betAmount) {
            returnAmount = betAmount+((returnAmount-betAmount)*currentClass.gain);
            aidiff = betAmount/returnAmount;
        } else {
            returnAmount = betAmount-((betAmount-returnAmount)*currentClass.lossimpact);
            aidiff = betAmount/returnAmount;
        }
        aimode *= aidiff;
        score -= betAmount;
        score += returnAmount;
        update();
    }
});
