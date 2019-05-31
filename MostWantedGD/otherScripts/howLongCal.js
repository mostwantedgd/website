/*	JavaScript 6th Edition
 *	Chapter 7
 *  Case Project
 *
 *	MostWantedGD Membership
 * 	Author: Nick Flowers
 *	Date: 4/18/18
 
 *	Filename: howLongCal.js
 */
 
"use strict"; // interpret contents in JavaScript strict mode

var monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// calculates time of membership from date entered to today
function doSubmit(evt) {
	// prevent form submit
	evt.preventDefault();
	
	var since = document.getElementById("since");
	var length = document.getElementById("length");
	var date = document.getElementById("memberDate").value;
	var startDate = new Date(date);
	var cDate = new Date();
	var currentDate = Date.UTC(cDate.getFullYear(), cDate.getMonth(), cDate.getDate());
	var memberDate = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
	
	// days
	var memberDays = Math.floor((currentDate - memberDate) / 86400000);
	if(memberDays <= 0){
		alert("Please select a day before today.");
		return;
	} else if(isNaN(memberDays)){
		alert("Please enter a date.");
		return;
	} else {
		since.innerHTML = monthArray[startDate.getMonth()] + " " + (startDate.getDate() + 1) + ", " + startDate.getFullYear() + ".";
	}
	// months 
	var memberMonths = Math.floor(memberDays / 31);
	// get remainder days
	memberDays = Math.floor(memberDays % 31);
	// years
	var memberYears = Math.floor(memberMonths / 12);
	// get remainder months
	memberMonths = Math.floor(memberMonths % 12);
	
	var finalString = "";
	if(memberYears === 1){
		finalString += memberYears + " year";
	}
	if(memberYears > 1){
		finalString += memberYears + " years";
	}
	if(memberMonths === 0){ // years and days
		if(memberYears !== 0){ //has years
			if(memberDays !== 0){  //has days
				finalString += " and ";
			} else { //only years
				finalString += ".";
			}
		}
	} else{ // years, months...
		if(memberDays === 0){ // years and months
			finalString += " and ";
		} else if(memberYears !== 0){ // years, months, and days
			finalString += ", ";
		}
	}
	if(memberMonths === 1){
		finalString += memberMonths + " month";
	}
	if(memberMonths > 1){
		finalString += memberMonths + " months";
	}
	if(memberYears === 0){ //months and days
		if(memberMonths !== 0){
			if(memberDays !== 0){ //months and days
				finalString += " and ";
			} else { // just months.
				finalString += ".";
			}
		}
	} else{ //years, months, and days
		if(memberMonths !== 0){ // years, months
			if(memberDays !== 0){ // years, months, and days
				finalString += ", and ";
			} else{ // years and months
				finalString += ".";
			}
		}
	}
	if(memberDays === 1){
		finalString += memberDays + " day.";
	}
	if(memberDays > 1){
		finalString += memberDays + " days."
	}
	length.innerHTML = finalString;
}

function createEventListeners(){
	var submitButton = document.getElementById("submitButton");
	if(submitButton.addEventListener) {
		submitButton.addEventListener("click", doSubmit, false);
	} else if (submitButton.attachEvent) {
		submitButton.attachEvent("onclick", doSubmit);
	}
}

if (window.addEventListener) {
	window.addEventListener("load", createEventListeners, false);
} else if (window.attachEvent) {
	window.attachEvent("onload", createEventListeners);
}