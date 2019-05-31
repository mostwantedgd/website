/*	JavaScript 6th Edition
 *	Chapter 10
 *  Case Project
 *
 *	MostWantedGD Map Location
 * 	Author: Nick Flowers
 *	Date: 11/11/18
 
 *	Filename: locationScript.js
 */
 
// Google Maps - Show user position on map

// named timeout that can be canceled
var waitForUser;
		
// test that geolocation can be used 
function geoTest() {
	// Timeout, if the user doesn't allow location after 10 seconds it will fail
	waitForUser = setTimeout(fail, 10000);
	// Test the geolocation
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(createDirections, fail, {timeout: 10000});
	} else {
		// Geolocation failed
		fail();
	}
}
			
function createDirections(position) {
	// Updates text of position
	showPosition(position);
	// clear the timeout because it succeeded
	clearTimeout(waitForUser);
		// console.log("Longitude: " + position.coords.longitude);
		// console.log("Latitude: " + position.coords.latitude);

	// Save the lat and lng to variables
	var currPosLat = position.coords.latitude;
	var currPosLng = position.coords.longitude;
	// map options
	var mapOptions = {
		center: new google.maps.LatLng(currPosLat, currPosLng),
		zoom: 12
	};
	var map = new google.maps.Map(document.getElementById("map"), mapOptions);
}
		
// goelocation failed
function fail(){
	// console.log("Geolocation information not available or not authorized.");
	document.getElementById("map").innerHTML = "Unable to access your current location.";
}			