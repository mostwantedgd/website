/* MostWantedGD
 *
 * MAIN SCRIPT
 *
 *
 * Case Project 2
 * Author: Nick Flowers
 * Date: 4/24/18
 */

/* Code for age check on Games page */
var age;
var ageCheck = false;
// Checks age input using buttons or direct text
function checkAge(){
	(age.value > 99) ? age.value = 99 : null;
	(age.value < 1) ? age.value = 1 : null;
}
function increaseAge(){
	age.value++;
	checkAge();
}
function decreaseAge(){
	age.value--;
	checkAge();
}
function confirmAge(evt){
	evt.preventDefault();
	var dateCheckWindow = document.getElementById("birthDateCheck");
	var dateResponse = document.getElementById("birthdayResponse");
	var gamesWindow = document.getElementById("gamesWindow");
	// Make sure this only happens once unless the page is reloaded
	if(!ageCheck){
		var matureGames = document.getElementsByClassName("mature");
		if(isNaN(age.value)){
			dateCheckWindow.style.display = "none";
			dateResponse.innerHTML = "<div id='birthdayFail'><p>Please enter a number.</p></div>";
			dateResponse.style.display = "block";
			gamesWindow.style.display = "block";
		} else {
			if(age.value >= 18){
				dateCheckWindow.style.display = "none";
				gamesWindow.style.display = "block";
				for(var i = 0; i < matureGames.length; i++){
					matureGames[i].style.display = "inline-block";
				}
			} else if(age.value >= 13){
				dateCheckWindow.style.display = "none";
				dateResponse.innerHTML = "<div id='birthdayFail'><p>Some games were hidden based on your age.</p></div>";
				dateResponse.style.display = "block";
				gamesWindow.style.display = "block";
				for(var i = 0; i < matureGames.length; i++){
					matureGames[i].style.display = "none";
				}
			}
			else{
				gamesWindow.style.display = "none";
				dateCheckWindow.style.display = "none";
				dateResponse.style.display = "block";
				dateResponse.innerHTML = "<div id='birthdayFail'><p>You must be 13 years or older to view this content.</p></div>";
			}
		}
		ageCheck = true;
	}
}

// creates event listeners for Our Games page using mwgdScript.eventListener(target, event, function)
// this is used to simplify creating backwards compatible event listeners
function gamesPageEventListeners(){
	eventListener(document.getElementById("input-age"),"change", checkAge);
	eventListener(document.getElementById("input-age"),"keydown",function(e){if(e.keyCode === 13) confirmAge(e);});
	eventListener(document.getElementById("age-minus"),"click",decreaseAge);
	eventListener(document.getElementById("age-plus"),"click",increaseAge);
	eventListener(document.getElementById("age-confirm"),"click",confirmAge,false);
}

// sets up Our Games page
function gpSetup() {
	document.getElementById("gamesWindow").style.display = "none";
	age = document.getElementById("input-age");
	age.value = 1;
	age.focus();
	gamesPageEventListeners();
}

//mwgdScript.js - eventListener(target, event, function) creates modern and IE8 event listeners
eventListener(window, "load", gpSetup);
