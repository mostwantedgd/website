/* MostWantedGD
 * 
 * MAIN SCRIPT
 *
 *
 * Case Project 2
 * Author: Nick Flowers
 * Date: 4/24/18
 */

/* //{ and //} are used throughout this document in the comments.
 * Doing so allows you to minimize everything in between in Notepad++
 * It helps make the code easier to work with
 * It may work with other programs too, but I've only used Notepad++ for this
 */

var addEvtLst = true;
var mobileMenuOpen = false;

//{ Load Nav
$(function() {

    $("#nav").load("navMenu.html");

    function activeNav() {
        var pgurl = window.location.href.substr(window.location.href.lastIndexOf("/")+1);
         $("#nav ul li a").each(function(){
              if($(this).attr("href") == pgurl || $(this).attr("href") == '' )
              $(this).addClass("active");
         });
    }

    setTimeout(function() {
        activeNav();
		eventListener(document.getElementById("dropdownMenu"),"click",openMobileMenu);
    }, 100);

});
//}

//{Home Slideshow

(function (){
	if(document.getElementById("page_home")){
		var xmlhttp;
		if (window.XMLHttpRequest) {
			xmlhttp = new XMLHttpRequest();
		} else {
			// code for older browsers
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				loadXMLContent(xmlhttp);
			}
		};
		xmlhttp.open("GET", "pageContent.xml", true);
		xmlhttp.send();
	}
})()

// Home page slideshow
var currentHomeSlide = 0;
var homeSlideInterval = 5000;
var progressBarInterval = 50;
var progressBarFill = 0.0;
var newsPostHeadlines = [];
var newsPostSubHeadings = [];
var newsPostMainImages = [];
var newsPostColors = [];
var newsPostSecColors = [];
var homeSlideTimer;
var progressTimer;
var dots;

function loadXMLContent(xml){
	
	var response = xml.responseXML;
	dots = document.getElementsByClassName("dot");
	for(var i = 0; i < response.getElementsByTagName("newsPost").length; i++){
		var nPH = response.getElementsByTagName("headline");
		var nPSH = response.getElementsByTagName("subheading");
		var nPMI = response.getElementsByTagName("mainImage");
		var nPC = response.getElementsByTagName("mainColor");
		var nPSC = response.getElementsByTagName("secondaryColor");
	}
	for(var i = 0; i < nPH.length; i++){
		newsPostHeadlines[i] = nPH[i].childNodes[0].nodeValue;
		newsPostSubHeadings[i] = nPSH[i].childNodes[0].nodeValue;
		newsPostMainImages[i] = nPMI[i].childNodes[0].nodeValue;
		newsPostSecColors[i] = nPSC[i].childNodes[0].nodeValue;
		dots[i].style.backgroundColor = newsPostSecColors[i];
		newsPostColors[i] = nPC[i].childNodes[0].nodeValue;
	}
	document.getElementById("mainNewsImageFader").src = newsPostMainImages[currentHomeSlide];	
	showHomeSlide();
	
	homeSlideTimer = setInterval(homeSlideUp, homeSlideInterval);
	homeProgressTimer = setInterval(progressBar, progressBarInterval);
}

function progressBar(){
	progressBarFill += (progressBarInterval / homeSlideInterval);
	document.getElementById("ipb_fill").style.width = (progressBarFill * 100) + "%"; 
	if(progressBarFill > 1){
		progressBarFill = 0;
	}
}

function homeSlideUp(){
	imgOpacity = .8;
	fadeOut = setInterval(fadeImageOut, 50);
	currentHomeSlide++;
	clearInterval(homeSlideTimer);
	clearInterval(homeProgressTimer);
	homeSlideTimer = setInterval(homeSlideUp, homeSlideInterval);
	homeProgressTimer = setInterval(progressBar, progressBarInterval);
	showHomeSlide();
}

function homeSlideDown(){
	imgOpacity = .8;
	fadeOut = setInterval(fadeImageOut, 50);
	currentHomeSlide--;
	clearInterval(homeSlideTimer);
	clearInterval(homeProgressTimer);
	homeSlideTimer = setInterval(homeSlideUp, homeSlideInterval);
	homeProgressTimer = setInterval(progressBar, progressBarInterval);
	showHomeSlide();
}

function currentSlide(n){
	fadeOut = setInterval(fadeImageOut, 50);
	clearInterval(homeSlideTimer);
	clearInterval(homeProgressTimer);
	currentHomeSlide = n;
	showHomeSlide();
}

var imgOpacity = 1.0;
var fadeOut;

function showHomeSlide(){
	progressBarFill = 0;
	var homeSlide = document.getElementById("mainImageSlide");
	if(currentHomeSlide > newsPostHeadlines.length - 1){
		currentHomeSlide = 0;
	}
	if(currentHomeSlide < 0){
		currentHomeSlide = newsPostHeadlines.length - 1;
	}
	document.getElementById("mainNewsImage").src = newsPostMainImages[currentHomeSlide];	
	document.getElementById("mainImage-slideshow").style.backgroundColor = newsPostColors[currentHomeSlide];
	document.getElementById("imgNumberText").innerHTML = (currentHomeSlide + 1) + "/" + newsPostHeadlines.length;	
	document.getElementById("imgText").innerHTML = newsPostHeadlines[currentHomeSlide];
	document.getElementById("imgTextSub").innerHTML = newsPostSubHeadings[currentHomeSlide];
	for(var i = 0; i < dots.length; i++){
		dots[i].className = "dot";
	}
	dots[currentHomeSlide].className += " dotActive";
	// faderTimer = setTimeout(setFaderImage, 1000);
}

function fadeImageOut(){	
	document.getElementById("mainNewsImageFader").style.opacity = imgOpacity;
	imgOpacity -= .12;
	if(imgOpacity <= 0){
		clearInterval(fadeOut);
		imgOpacity = .8;
		document.getElementById("mainNewsImageFader").style.opacity = .8;
		document.getElementById("mainNewsImageFader").src = newsPostMainImages[currentHomeSlide];
	}
}

//}

//{Pop up window
function openGamePopupFromButton(clickedButton){
	// button ids are paths to their respective html files
	openGamePopup(clickedButton.id);
}
function openGamePopup(buttonTarget)
{	
	var pageToOpen = buttonTarget;
	/* ORIGINAL CODE
	var wrapper = document.getElementById("popupWrapper");
	var fader = document.getElementById("fader");
	var content = document.getElementById("faderContent");
	var closeButton = document.getElementById("closeView");
	if(content.style.top != "15%"){
		closeButton.style.top = "-100%";
		content.style.top = "-100%";
		setTimeout(function(){
			fader.style.opacity = ".7";
			content.style.top = "15%";
			closeButton.style.top = "13%";
		},10);
		wrapper.style.display = "block";	
		content.src = pageToOpen;
	}
	*/
	
	// JQUERY CODE
	// creating jquery objects
	var wrapper = $("#popupWrapper");
	var fader = $("#fader");
	var content = $("#faderContent");
	var closeButton = $("#closeView");
	// check to see if the window is hidden off screen
	if(content.css("top") != "15%"){
		// Reset the offscreen positions for the css transition
		closeButton.css("top", "-100%");
		content.css("top", "-100%");
		// Move the window in to the screen
		setTimeout(function(){
			fader.css("opacity", ".7");
			content.css("top", "15%");
			closeButton.css("top", "13%");
		},10);
		// show the window
		wrapper.show();	
		// load the html page in the popup iframe based on the
		// id of the button that was clicked
		// (button ids are paths to their respective html files)
		content.attr("src",pageToOpen);
	}
}

function closePopupWindow() {
	var wrapper = document.getElementById("popupWrapper");
	var fader = document.getElementById("fader");
	var content = document.getElementById("faderContent");
	var closeButton = document.getElementById("closeView");
	if(content.style.top != "-100%"){
		content.style.top = "15%";
		closeButton.style.top = "13%";
		setTimeout(function(){
			fader.style.opacity = "0";
			content.style.top = "-100%";
			closeButton.style.top = "-100%";
		},10);
		setTimeout(function(){
			wrapper.style.display = "none";	
			content.src="";
		},200);
	}
}

//}

//{ mobile menu open/close functions
// Opens and closes the mobile menu when called
function openMobileMenu(){
	mobileMenuOpen = !mobileMenuOpen;
	var menuItems = document.getElementById("menu-items");
	var dropdownButton = (document.getElementById("dropdownMenu")) ? document.getElementById("dropdownMenu") : document.getElementById("dropdownMenu-open");
	if(mobileMenuOpen){
		menuItems.style.display = "block";
		dropdownButton.id = "dropdownMenu-open";
		
	} else {
		menuItems.style.display = "none";
		dropdownButton.id = "dropdownMenu";
	}
}
// if the screen was resized but the mobile menu is still open, close it
function checkMobileMenu(){
	var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
	var menuItems = document.getElementById("menu-items");
	var dropdownButton = (document.getElementById("dropdownMenu")) ? document.getElementById("dropdownMenu") : document.getElementById("dropdownMenu-open");
	if(width > 700) {
		if(mobileMenuOpen) {
			dropdownButton.id = "dropdownMenu";
			mobileMenuOpen = false;
		} 
		menuItems.style.display = "block";
	} else if (!mobileMenuOpen) {
		dropdownButton.id = "dropdownMenu";
		menuItems.style.display = "none";
	}
}
//}

// Page Load
// Things to do when the page loads
function pageStart(){
	createEventListeners();
	
	// check if this is a new user
	if (!sessionStorage.getItem('returnUser')){
		// they are new, so set session storage so they are treated as returning
		sessionStorage.setItem('returnUser', 'true');
		// since they are new, show them a popup		
		setTimeout(function() {openGamePopup("games/pages/template.html");}, 5000);
	}
	
	// make all text inputs IE8 compatible
	if (document.querySelectorAll("input[type=text]")) {
		var textInputs = document.querySelectorAll("input[type=text]");
		for (var i = 0; i < textInputs.length; i++){
			generatePlaceholder(textInputs[i]);
		}
	}
	// make all textareas IE8 compatible
	if (document.getElementsByTagName("textarea")) {
		var textAreas = document.getElementsByTagName("textarea");
		for (var i = 0; i < textAreas.length; i++) {
			generatePlaceholder(textAreas[i]);
		}
	}
}

// Create listeners, called from pageStart()
function createEventListeners(){
	// Pop-up buttons	
	if (document.getElementsByClassName("home-item")){
		var gameButtons = document.getElementsByClassName("home-item");
		for (var i = 0; i < gameButtons.length; i++){
			eventListener(gameButtons[i],"click",function(){openGamePopupFromButton(this);});
		}
	}
	
	// popup window
	if (document.getElementById("popupWrapper")) {
		eventListener(document.getElementById("popupWrapper"),"click",closePopupWindow);
	}
}


//{ General functions

// IE8 compatible placeholder text
function checkPlaceholder(target) {
	if (target.value === "") {
		target.style.color = "rgb(178,184,183)";
		target.value = target.placeholder;
		//Uncomment to test in modern browsers
		//target.value = "Placeholder was set";
	}
}
// input placeholder text
function generatePlaceholder(target) {
	if(!Modernizr.input.placeholder) {
		target.value = target.placeholder;
		target.style.color = "rgb(178,184,183)";
		eventListener(target, "focus", function(){zeroPlaceholder(this);});
		eventListener(target, "blur", function(){checkPlaceholder(this);});
	}
}
// remove placeholder text
function zeroPlaceholder(target) {
	target.style.color = "black";
	if(target.value === target.placeholder) {
		target.value = "";
		//Uncomment to test in modern browsers
		//target.value = "The placeholder was removed";
	}
}

// creates an event listener that is IE8 compatible if necessary
// target = attach listener to, evt = event to listen for, funct = function to call
function eventListener(target,evt,funct){
	// addEvtLst is set to true on page load if .addEventListener can be used
	// it is set to false if attachEvent must be used
	if(addEvtLst){
		target.addEventListener(evt, funct, false);
	} else {
		target.attachEvent("on" + evt, funct);
	}
}
//}


// On page load
if(window.addEventListener){
	window.addEventListener("load", pageStart, false);
	window.addEventListener("resize", checkMobileMenu);
	addEvtLst = true;
} else if (window.attachEvent){
	window.attachEvent("onload", pageStart, false);
	window.attachEvent("onresize", checkMobileMenu);
	addEvtLst = false;
}	
	