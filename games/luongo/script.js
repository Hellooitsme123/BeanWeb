function byId(id) {
	return document.getElementById(id);
}
function randItem(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}
function randNum(min, max) {
	return Math.ceil(Math.random() * (max - min)) + min - 1;
}
function splitTwo(str, delim1, delim2) {
	return str.split(delim1)[1].split(delim2)[0];
}
function accSplitTwo(str, delim1, delim2) {
	let amount = str.split(delim1).length - 1;
	let amount2 = str.split(delim2).length - 1;
}
String.prototype.replaceAt = function (index, replacement) {
	return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}
//IMPORTANT
var submitBtn = document.getElementById('submit');
var submitInput = document.getElementById('answer');
var backBtn = document.getElementById('back');
var nextBtn = document.getElementById('next');
var hintBtn = document.getElementById('hint');
var problemP = byId("curProblem");
var sectionP = byId("curSection");
var eventP = byId("event-p");
var omegaDiv = byId("omega-text");
var omegaP = byId("omega-p");
var omegaBtn = byId("exit-omega");
var textP = byId("text-p");
var currentAnswer = "";
var currentProblem = 1;
var currentSection = 0;
var boxes = [];
var sub_boxes = [];
//helpvar
var alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
var numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
var inputFill = "-- -";
var completed = [];
var completedSections = [];
var nextAvailable = false;
var hasSecret = false;
var path;
var fullPath = [];
var currentPD = 0;
/* ALT CODES

use <sep> to separate reveal from color hint

l8-p4: 'open sesame'id1 -> opens l8a

*/








const formats = {
	"&apos;": "'",
	"&com;": ",",
	"&a-up;": "↑",
	"&a-down;": "↓",
	"&a-left;": "←",
	"&a-right;": "→",
	"&da-ul": "↖",
	"&da-ur": "↗",
	"&da-dl": "↙",
	"&da-dr": "↘",
}

const correctBypass = ["text"];

for (let i =0; i < Object.keys(puzzles).length; i++) {
	for (let j = 0; j < Object.keys(puzzles[Object.keys(puzzles)[i]]).length; j++) {
		let cur = Object.keys(puzzles[Object.keys(puzzles)[i]])[j];
		if (cur.includes("text")) {
			curCode = i+":"+j;
			completed.push(curCode);
		}

	}
}

function format(text) {
	for (let i =0; i < Object.keys(formats).length; i++) {
		// replaces all values of format key with result
		replace = Object.keys(formats)[i];
		result = Object.values(formats)[i];
		text = text.replaceAll(replace,result);
	}
	return text;
}
function genAnswer(section, problem) {
	// not problem, now pd
	sectionP.innerHTML = "The ???";
	if (completedSections.includes(currentSection)) {
		sectionP.innerHTML = Object.keys(puzzles)[currentSection];
	}
	currentCode = currentSection + ":" + (currentProblem);
	console.log(currentCode);
	if (completed.includes(currentCode)) {
		nextBtn.classList.remove("hide");
	} else {
		nextBtn.classList.add("hide");
	}
	if (currentProblem > 1) {
		backBtn.classList.remove("hide");
	} else {
		backBtn.classList.add("hide");
	}
	if (Object.hasOwn(puzzles[Object.keys(puzzles)[currentSection]],"path")) {
		path = puzzles[Object.keys(puzzles)[currentSection]]["path"];
		fullPath = path.split("->");
		zelen = fullPath.length;
		for (let i =0; i < zelen; i++) {
			curItem = fullPath[i];
			if (curItem.includes("problem[")) {
				range = splitTwo(curItem,"[","]");
				range1 = Number(range.split("-")[0]);
				range2 = Number(range.split("-")[1]);
				newProblems = [];
				for (let i = range1; i <= range2; i++) {
					fullPath.splice(fullPath.indexOf(curItem),0,"problem"+i);
				}
				fullPath.splice(fullPath.indexOf(curItem),1);
				console.log(fullPath);
			}
		}
		directions = ""
	}
	if (boxes) {
		currentAnswer = "";
		boxes.forEach(function (item) {
			item.remove();
		});
		sub_boxes.forEach(function (item) {
			item.remove();
		});
	}
	// TABLE RESET
	let table = byId("target-div");
	while (table.firstChild) {
		table.removeChild(table.lastChild);
	}
	zelen = 3;
	zeheight = 3;
	for (let i = 0; i < zeheight; i++) {
		zerow = document.createElement("tr");
		for (let j = 0; j < zelen; j++) {
			zetd = document.createElement("td");
			zetd.setAttribute("id", j + ":" + i);
			zerow.appendChild(zetd);
		}
		table.appendChild(zerow);
	}
	// END TABLE RESET

	//
	if (fullPath.length > 1) {
		given = puzzles[section][fullPath[currentProblem-1]]; 
		let pathType = fullPath[currentProblem-1];
		if (pathType.includes("text")) {
			textP.innerHTML = given;
			table.classList.add("hide");
			console.log(fullPath);
			problemP.innerHTML = "Text " + fullPath[currentProblem-1].substring(4);
		}
		console.log(fullPath[currentProblem-1].substring(-1,7));
		if (fullPath[currentProblem-1].substring(-1,7) == "problem") {
			table.classList.remove("hide");
			if (given.includes("title[") == false) {
				problemP.innerHTML = "Problem " + fullPath[currentProblem-1].substring(7);
			}
		}
	} else {
		given = puzzles[section]["problem" + problem];
		if (given.includes("title[") == false) {
			problemP.innerHTML = "Problem " + Object.keys(puzzles[section])[currentProblem-1].substring(7);
		}
		table.classList.remove("hide");
	}
	
	givensplit = given.split("||");
	parts = [];
	givensplit.forEach(function (item) {
		parts.push(item.split("[")[0]);
		if (item.substring(0,5) == "title") {
			problemP.innerHTML = splitTwo(splitTwo(item,"[","]").split("title=")[1],"'","'");

		}
		if (item.substring(0, 5) == "table") {
			let table = byId("target-div");
			while (table.firstChild) {
				table.removeChild(table.lastChild);
			}
			args = splitTwo(item, "[", "]").split(",");
			args1 = args[0].split("=");
			args2 = args[1].split("=");
			zelen = 3;
			zeheight = 3;
			if (args1[0] == "length") {
				zelen = args1[1];
				zeheight = args2[1];
			} else {
				zelen = args2[1];
				zeheight = args1[1];
			}
			zelen = Number(splitTwo(zelen,"'","'"));
			zeheight = Number(splitTwo(zeheight,"'","'"));
			for (let i = 0; i < zeheight; i++) {
				zerow = document.createElement("tr");
				for (let j = 0; j < zelen; j++) {
					zetd = document.createElement("td");
					zetd.setAttribute("id", j + ":" + i);
					zerow.appendChild(zetd);
					console.log(zetd);
				}
				table.appendChild(zerow);
			}
		}
		if (item.substring(0,6) == "secret") {
			secretspan = document.createElement("span");
			secretspan.classList.add("secret-span");
			zeattributes = splitTwo(item, "[", "]").split(",");
			arg1 = zeattributes[0].split("=");
			arg2 = zeattributes[1].split("=");
			secretspan.setAttribute("data-secret",splitTwo(arg1[1],"'","'"));
			secretspan.setAttribute("data-secret-id",splitTwo(arg2[1],"'","'"));
			table.appendChild(secretspan);
			hasSecret = true;
		}
		if (item.substring(0, 3) == "box") {
			box = document.createElement("div");
			box.classList.add("normal-box");
			sub_box = document.createElement("div");
			sub_box.classList.add("sub-box");
			para = document.createElement("p");
			zeattributes = splitTwo(item, "[", "]").split(",");
			position = "";
			speciallist = [];
			zeattributes.forEach(function (item2) {
				arg1 = item2.split("=")[0];
				arg2 = item2.split("=")[1];
				if (arg1 == "class") {
					box.classList.add(splitTwo(arg2, "'", "'"));
					console.log(arg2);
					if (splitTwo(arg2, "'", "'") == "box-large") {
						speciallist.push('box-large');
					}
				}
				// replaces = &apos; = " ' "
				if (arg1 == "given") {
					para.innerHTML = format(splitTwo(arg2, "'", "'"));
				}
				if (arg1 == "answer") {
					currentAnswer = format(splitTwo(arg2, "'", "'"));
				}
				if (arg1 == "pos") {
					position = splitTwo(arg2, "'", "'");
				}
			});
			if (speciallist.includes("box-large")) {
				byId(position).setAttribute("colspan", 2);
				byId(position).setAttribute("rowspan", 2);
			}
			console.log(position,box);
			byId(position).appendChild(box);
			box.appendChild(sub_box);
			sub_box.appendChild(para);
			boxes.push(box);
			sub_boxes.push(sub_box);
		}
	});
	if (parts.includes("secret") == false) {
		hasSecret = false;
	}
	inputFill = "";
	for (let i = 0; i < currentAnswer.length; i++) {
		if (currentAnswer.charAt(i) != " ") {
			inputFill += "-";
		} else {
			inputFill += " ";
		}
	}
	submitInput.value = inputFill;
	// Set input length;
	if (currentAnswer.length > 15) {
		submitInput.size = 20+Math.ceil((currentAnswer.length-15)/3);
	} else {
		submitInput.size = 20;
	}
}
genAnswer("The Transparent", 1);
function clearP() {
	eventP.innerHTML = "";
}
function checkInput() {
	let curvalue = submitInput.value;
	let result = inputFill.split('');
	let cursorPosition = submitInput.selectionStart;

	// Replace dashes with user input characters
	for (let i = 0, j = 0; i < result.length && j < curvalue.length; i++) {
		if ((result[i] === '-' && curvalue[j] !== ' ') || (i == 0 && result[i] == currentAnswer.charAt(0))) {
			result[i] = curvalue[j];
			j++;

		} else if (result[i] === ' ') {
			if (curvalue[j] != '-') {
				result[i] = curvalue[j];
				j++;
			}
			continue;
		} else if (curvalue[j] === ' ') {
			// Skip over spaces in the user input
			j++;
			i--; // Recheck the current position in the next loop iteration
		}
	}

	// Join the array back into a string
	result = result.join('');

	// Update the input value and set the cursor position
	submitInput.value = result;
	submitInput.setSelectionRange(cursorPosition, cursorPosition);

};
submitInput.addEventListener("click", function () {
	if (submitInput.value == inputFill) {
		submitInput.setSelectionRange(0, 0);
	}
});
function revealSecret(id) {
	let secret = document.querySelectorAll("[data-reveal-id='"+id+"']")[0];
	secret.classList.replace("level-link-disabled","level-link");
	secret.classList.remove("hide");
	let sep = secret.innerHTML.split("<sep>")[1];
	if (sep == undefined) {
		sep = "";
	}
	secret.innerHTML = secret.getAttribute("data-reveal") + " " + sep;
	secret.addEventListener("click", () => {enterLevel(secret)});
}
submitBtn.addEventListener("click", function () {
	curvalue = submitInput.value;
	if (curvalue.toLowerCase() == currentAnswer) {
		eventP.innerHTML = "<b style='color:green;'>Correct Answer!</b>";
		completedCode = currentSection + ":" + currentProblem;
		if (completed.includes(completedCode) == false) {
			completed.push(completedCode);
		}
		nextBtn.classList.remove("hide");
	} else {
		if (hasSecret) {
			let secrets = document.querySelectorAll(".secret-span");
			let secretlist = [];
			secrets.forEach((elem) => {
				secretlist.push(elem.getAttribute("data-secret"));
			});
			if (secretlist.includes(curvalue.toLowerCase().replaceAll("-"," ").trim())) {
				let zesecret = document.querySelectorAll(".secret-span[data-secret='"+curvalue.toLowerCase().replaceAll("-"," ").trim()+"']")[0];
				revealSecret(zesecret.getAttribute("data-secret-id"));
				eventP.innerHTML = "<b style='color:navy;'>Secret Revealed!</b>";
			}
		} else {
			eventP.innerHTML = "<b style='color:red;'>Wrong Answer!</b>";
		}
		
	}
	setTimeout(clearP, 2000);
});
backBtn.addEventListener("click", function () {
	if (currentProblem > 1) {
		currentProblem -= 1;
		nextBtn.classList.remove("hide");
		genAnswer(Object.keys(puzzles)[currentSection], currentProblem);
		//problemP.innerHTML = "Problem " + currentProblem;
		if (currentProblem == 1) {
			backBtn.classList.add("hide");
		}
		submitInput.value = currentAnswer;
	}
});
nextBtn.addEventListener("click", function () {
	next = puzzles[Object.keys(puzzles)[currentSection]]["problem" + (currentProblem + 1)];
	completedCode = currentSection + ":" + (currentProblem);
	if (completed.includes(completedCode)) {
		currentProblem += 1;
		backBtn.classList.remove("hide");
		if (currentProblem - 1 == Object.keys(puzzles[Object.keys(puzzles)[currentSection]]).length) {
			omegaDiv.classList.remove("hide");
			omegaP.innerHTML = Object.keys(puzzles)[currentSection].toUpperCase();
			document.querySelectorAll("[data-level='" + Object.keys(puzzles)[currentSection] + "']").forEach(function (element) {
				element.innerHTML = element.innerHTML.replace("The ???", Object.keys(puzzles)[currentSection]);
			});
			if (completedSections.includes(currentSection) == false) {
				completedSections.push(currentSection);
			}
			currentSection = 0;
			currentProblem = 1;
			byId("problems").classList.add("hide");
			backBtn.classList.add("hide");
			nextBtn.classList.add("hide");
			

		} else {
			//problemP.innerHTML = "Problem " + currentProblem;
			genAnswer(Object.keys(puzzles)[currentSection], currentProblem);
			completedCode2 = currentSection + ":" + (currentProblem);
			if (completed.includes(completedCode2)) {
				submitInput.value = currentAnswer;
			}
		}

	}
});
hintBtn.addEventListener("click", function () {
	if (inputFill.charAt(0) == "-") {
		inputFill = currentAnswer.charAt(0) + inputFill.substring(1);
	}
	submitInput.value = inputFill;

});
function enterLevel(element) {
	if (isNaN(element) == false) {
		level = element;
	} else {
		level = element.getAttribute("data-level");
	}
	byId("problems").classList.remove("hide");
		currentProblem = 1;
		if (isNaN(level)) {
			for (let i = 0; i < Object.keys(puzzles).length; i++) {
				if (Object.keys(puzzles)[i] == level) {
					currentSection = i;
				}
			}
			genAnswer(level, 1);

		} else {
			currentSection = level;
			genAnswer(Object.keys(puzzles)[Number(level)], 1);

		}
		//problemP.innerHTML = "Problem 1";
		backBtn.classList.add("hide");
}
document.addEventListener('click', function(e) {
    // Check if the clicked element has the class 'my-class'
	element = e.target;
    /*if (e.target.classList.contains('level-link')) {
        // Your code here, e.g., call a function or manipulate the element
		enterLevel(element);
        console.log('Element with class "my-class" was clicked!');
    }*/
});
document.querySelectorAll(".level-link").forEach((element) => {
	element.addEventListener("click", () => {
		fullPath = [];
		textP.innerHTML = "";
		enterLevel(element);
	});
});
omegaBtn.addEventListener("click", () => {
	omegaDiv.classList.add("hide");
});
function start() {
	for (let i =0; i < startfunc.length; i++) {
		func = startfunc[i].split("::")[0];
		args = startfunc[i].split("::")[1];
		if (func == "dev") {
			revealSecret("dev");
		}
		if (func == "reveal") {
			args = args.split(",");
			for (let j =0; j< args.length; j++) {
				revealSecret(Number(args[j]));
			}
		}
	}
}
start();