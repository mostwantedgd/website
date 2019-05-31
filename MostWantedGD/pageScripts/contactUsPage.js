/* MostWantedGD
 * 
 * Contact Us Page Js
 *
 *
 * Author: Nick Flowers
 * Date: 4/24/18
 */

function verifyInput(evt){
	evt.preventDefault();
	var validInputs = true;
	var validEmail = true;
	var name = "";
	var email = "";
	var message = "";
	var contactSubject = document.getElementById("formSubject").value;
	
	/*  IE8 Placholder support can be found in mwgdscript.js
	 *  It was moved there so it can be used site-wide
	 */
	
	// Name validation
	try{
		var formName = document.getElementById("formName").value;
		var letterOnly = /^[A-Za-z\s]+$/; // Letters and spaces only
		formName = formName.substring(0, 20);
		if(formName === ""){
			throw "We don't know who you are, please enter your name!";
		}else if(!formName.match(letterOnly) || formName.includes(".") || formName.includes("!") || formName.includes("(") || formName.includes(")") || formName.includes(";")){ //Make sure it is only letters
			throw "Please use letters A through Z"
		} else {
			name = document.getElementById("formName").value;
		}
		document.getElementById("formNameMessage").innerHTML = "";
	}
	catch(message){
		document.getElementById("formNameMessage").innerHTML = message;
		validInputs = false;
	}
	finally{
		if(!validInputs)
			document.getElementById("formName").value = "";
	}
	
	// Email Validation
	try{
		var formEmail = document.getElementById("formEmail");
		// Check the email is in valid email format and not placeholder text
		if(!(formEmail.value.includes("@") && formEmail.value.includes(".") && !formEmail.value.includes("(") && !formEmail.value.includes(")") && !formEmail.value.includes(",") && !formEmail.value.includes(";") && !formEmail.value.includes("!") && !formEmail.value.includes("$")) || formEmail.value === formEmail.placeholder){
			throw "Please enter a valid email address. You're pretty cool and we would like to respond to you.";
		}
		else {
			email = document.getElementById("formEmail").value;
		}
		document.getElementById("formEmailMessage").innerHTML = "";
	}
	catch(message){
		document.getElementById("formEmailMessage").innerHTML = message;
		validInputs = false;
		validEmail = false;
	}
	finally{
		if(!validEmail)
			document.getElementById("formEmail").value = "";
	}
	
	// message validation
	try{
		var formMessage = document.getElementById("formMessage");
		// validate the message is not blank or the placeholder text
		if(formMessage.value === "" || formMessage.value === formMessage.placeholder){
			throw "Please enter a message. I mean, you're on this page for a reason right?";
		} else {
			message = document.getElementById("formMessage").value;
			message.replace("()", ""); // Remove possibility of functions in answer
			message.replace(");", "),"); // Remove possibility of functions
			message.replace("$(", ""); // Remove possibility of jQuery
			message.replace(".js", ""); // Break any links to .js files
			message.substring(0, 300); // Limit to 300 characters
		}
		document.getElementById("formMessageMessage").innerHTML = "";
	}
	catch(message){
		document.getElementById("formMessageMessage").innerHTML = message;
		validInputs = false;
	}
	finally{
		// Nothing yet
	}
	
	// Validation successful message
	if(validInputs){
		document.getElementById("cu_h3").innerHTML = "";
		document.getElementById("cu_wrapper").innerHTML = 'Thank you, <span class="cu_sent">' + name + '</span>. We will respond to you at <span class="cu_sent">' + email + "</span> shortly. You can review your message here: <br><br>";
		document.getElementById("cu_wrapper").innerHTML += '<span id="formSent"> Subject: ' + contactSubject + "<br><br>" + message + "</span>";
	}	
}

// array of selected
var list = [];
// options that will be selectable
var listOptions = ["Freezes","Crashes","Server connection","Performance","Other"];

// creates the list from the listOptions
function setUpList(){
	// adds event listeners to buttons
	var itemList = document.getElementById("itemList");
	for(var i = 0; i < listOptions.length; i++){
		// In a closure because of the event listener at the end. Without it, all event listeners would trigger using the last loop number
		(function(){
			var itemNumber = i;
			// create options and buttons
			var newListOptionItem = document.createElement("li");
			newListOptionItem.innerHTML = "<button type='button' class='addButton'>ADD</button>    " + listOptions[i];
			itemList.appendChild(newListOptionItem);
			// Buttons will tell addListItem what button they were
			newListOptionItem.querySelector("button").onclick = (function(){addListItem(itemNumber)});
		}());
	}
}	

// turns the selected list array into a string
function updateSelected(){
	var ss = document.getElementById("selectedString");
	ss.innerHTML = "";
	for(var i = 0; i < list.length; i++){
		ss.innerHTML += listOptions[list[i]] + ", ";
	}
}

function addListItem(clickedItem){
	// add the selection
	list.push(clickedItem);
	// remove add button
	document.getElementById("itemList").querySelectorAll("li")[clickedItem].innerHTML = "(added)" + listOptions[clickedItem];
	// add the selection to the selected list
	var newItem = "<button type='button'>REMOVE</button> " + listOptions[clickedItem];
	var newListItem = document.createElement("li");
	newListItem.innerHTML = newItem;
	document.getElementById("selectedItemList").appendChild(newListItem);
	var removeButton = newListItem.querySelector("button");
	removeButton.onclick = (function(){removeFromList(clickedItem)});
	updateSelected();
}

function removeFromList(clickedItem){
	var fromList = document.getElementById("itemList").querySelectorAll("li")[clickedItem];
	fromList.innerHTML = "<button type='button' class='addButton'>ADD</button>" + listOptions[clickedItem];
	fromList.querySelector("button").onclick = (function(){addListItem(clickedItem)});
	// remove the selection using the reference array	
	var selectedList = document.getElementById("selectedItemList");
	var selectedItem = selectedList.getElementsByTagName("li")[list.indexOf(clickedItem)];
	selectedItem.parentNode.removeChild(selectedItem);
	list.splice(list.indexOf(clickedItem), 1);
	updateSelected();
}

// Called on page load
function contactPageStart() {	
	contactPageEventListeners();
}

// page specific event listeners
function contactPageEventListeners() {
	eventListener(document.getElementById("formButton"),"click", verifyInput);
}

//mwgdScript.js - eventListener(target, event, function) creates modern and IE8 event listeners
eventListener(window, "load", contactPageStart);	
eventListener(window, "load", setUpList);