var mathTypeInput = byId("math-type")
var submit = byId("submit");
var result = byId("result");
var inputDivs = byId("inputs");
var mathTypes = {
    "coolround": {
        fields: [["number","number"],["roundTo","number"]]
    },
};
var inputResults = {

};
var currentMathType = "";

function getInputs() {
    inputResults = {};
    let arguments = document.getElementsByClassName("arg-input");
    for (let i =0; i < arguments.length; i++) {
        elem = arguments[i];
        elemField = elem.getAttribute("input-id");
        elemValue = elem.value;
        inputResults[elemField] = elemValue;
    }
}
function calculate() {
    if (currentMathType == "coolround") {
        roundTo = Number(inputResults.roundTo);
        num = Number(inputResults.number);
        quotient = num/roundTo;
        rounded = Math.round(quotient);
        console.log(roundTo,num,quotient,rounded);
        return rounded * roundTo;
    }
}

mathTypeInput.addEventListener("change",() => {
    let mathType = mathTypeInput.value;
    if (Object.keys(mathTypes).includes(mathType)) {
        currentMathType = mathType;
        clearChildren(byId("inputs"));
        console.log(mathTypes[currentMathType]);
        for (let i =0; i < mathTypes[currentMathType].fields.length; i++) {
            currentField = mathTypes[currentMathType].fields[i];
            let input = document.createElement("input");
            input.setAttribute("input-id",currentField[0]);
            input.setAttribute("placeholder",currentField[0]);
            input.setAttribute("type",currentField[1]);
            input.classList.add("arg-input");
            byId("inputs").appendChild(input);
        }

    }
});
submit.addEventListener("click",() => {
    getInputs();
    result.innerHTML = calculate();
});