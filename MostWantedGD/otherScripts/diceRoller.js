/*	JavaScript 6th Edition
 *	Chapter 11
 *  Case Project
 *
 *	MostWantedGD Dice Roller
 * 	Author: Nick Flowers
 *	Date: 11/17/18
 
 *	Filename: diceRoller.js
 */
 
var numberOfDice;
var diceSides;
var rollButton;
var results;
 
var httpRequest = false;


// Ajax request
function getRequestObject(){
	try{
		httpRequest = new XMLHttpRequest();
	}
	catch(requestError) {
		return false;
	}
	return httpRequest;
}
 
// Called when the roll button is clicked
function rollDice(){
	//grabbing the values
	numberOfDice = document.getElementById("numberOfDice").value;
	diceSides = document.getElementById("numberOfSides").value;
	
	// request
	getRequestObject();
	 
	if(!httpRequest){
		httpRequest = getRequestObject();
	}
	httpRequest.abort();
	// requesting using the dice values
	httpRequest.open("get", "https://rolz.org/api/?" + numberOfDice + "d" + diceSides + ".json");
	httpRequest.send(null);
	httpRequest.onreadystatechange = fillDiceRoll;
}

// displays the response data
function fillDiceRoll(){
	if(httpRequest.readyState === 4 && httpRequest.status === 200){
		results = JSON.parse(httpRequest.responseText);
		var rollResultDiv = document.getElementById("diceRollResult");
		// setting up the response to look nice
		var resultsString = "<div id='resultsString' style='border:1px solid black;padding:10px;'>";
		// shows the data sent to the api
		resultsString += "You rolled <span style='color:red;'>" + numberOfDice + "</span>" + ((numberOfDice == 1) ? " die" : " dice") + ", each with <span style='color:red;'>" + diceSides + "</span>" + ((diceSides == 1) ? " side." : " sides.");
		resultsString +=  "<br><br>";
		// shows the result
		resultsString += "<span style='border:2px dotted green;padding:10px;'>Your result is: <span style='background-color:green;padding:5px;color:white;border-radius:15px'>" + results.result + "</span></span><br><br>";
		// details of the result (what die rolled what)
		resultsString += "Details: " + results.details;		
		resultsString += "<br><br><br>Powered By: <a href='https://rolz.org/'>rolz.org</a> <br> API: <a href='https://rolz.org/help/api'>rolz.org API</a></div>";
		rollResultDiv.innerHTML = resultsString;
	}	
}
 
// Setting up listener for the roll button
function setUpListeners(){
	rollButton = document.getElementById("rollDiceButton");
	//mwgdScript.js - eventListener(target, event, function) creates modern and IE8 event listeners
	eventListener(rollDiceButton, "click", rollDice);
}
 
//mwgdScript.js - eventListener(target, event, function) creates modern and IE8 event listeners
eventListener(window, "load", setUpListeners);
 
 