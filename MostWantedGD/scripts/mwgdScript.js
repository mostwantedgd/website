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

    $("#nav").load("constantPages/navMenu.html");

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

//{ Load Footer
$(function() {
    $("#footerContent").load("constantPages/footerContent.html");
});
//}

//{Home Slideshow

(function (){
	if(document.getElementById("mainImage-slideshow")){
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
		xmlhttp.open("GET", "xml/newsPosts.xml", true);
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

// Progress bar showing time until next slideshow content
function progressBar(){
	progressBarFill += (progressBarInterval / homeSlideInterval);
	document.getElementById("ipb_fill").style.width = (progressBarFill * 100) + "%"; 
	if(progressBarFill > 1){
		progressBarFill = 0;
	}
}

// Forces slideshow to the next slide
function homeSlideUp(){
	currentHomeSlide++;
	clearInterval(homeSlideTimer);
	clearInterval(homeProgressTimer);
	homeSlideTimer = setInterval(homeSlideUp, homeSlideInterval);
	homeProgressTimer = setInterval(progressBar, progressBarInterval);
	showHomeSlide();
}

// Forces slideshow to the previous slide
function homeSlideDown(){	
	currentHomeSlide--;
	clearInterval(homeSlideTimer);
	clearInterval(homeProgressTimer);
	homeSlideTimer = setInterval(homeSlideUp, homeSlideInterval);
	homeProgressTimer = setInterval(progressBar, progressBarInterval);
	showHomeSlide();
}

function currentSlide(n){
	clearInterval(homeSlideTimer);
	clearInterval(homeProgressTimer);
	homeSlideTimer = setInterval(homeSlideUp, homeSlideInterval);
	homeProgressTimer = setInterval(progressBar, progressBarInterval);
	currentHomeSlide = n;
	showHomeSlide();
}

// Slideshow of news images, content, and colors loaded from XML document
function showHomeSlide(){
	var imageFader = $("#mainNewsImageFader");
	progressBarFill = 0;
	var homeSlide = $("#mainImageSlide");
	if(currentHomeSlide > newsPostHeadlines.length - 1){
		currentHomeSlide = 0;
	}
	if(currentHomeSlide < 0){
		currentHomeSlide = newsPostHeadlines.length - 1;
	}
	imageFader.stop();
	imageFader.css({"display":"block","opacity":"100"});
	$("#mainNewsImage").attr("src", newsPostMainImages[currentHomeSlide]);	
	$("#mainImage-slideshow").css({"backgroundColor": newsPostColors[currentHomeSlide], "transition":".3s"});
	$("#imgNumberText").html((currentHomeSlide + 1) + "/" + newsPostHeadlines.length);	
	$("#imgText").html(newsPostHeadlines[currentHomeSlide]);
	$("#imgTextSub").html(newsPostSubHeadings[currentHomeSlide]);
	for(var i = 0; i < dots.length; i++){
		dots[i].className = "dot";
	}
	dots[currentHomeSlide].className += " dotActive";
	imageFader.fadeOut(300,(function(){
		imageFader.attr("src",newsPostMainImages[currentHomeSlide]);
	}));
}

//}

//{Pop up window
var popupLoaded = false;
// Called by buttons to open a window. The button's ID is the their target path for the window
function openGamePopupFromButton(clickedButton){
	// button ids are paths to their respective html files
	openGamePopup(clickedButton.id);
}

// Opens a popup window given a path
function openGamePopup(buttonTarget)
{	
	if(!popupLoaded){
		// Insert Popup markup into page
		$("main").prepend("<div id='popupWrapper'><button id='popupCloseView'>X</button><iframe id='popupContent'></iframe><div id='popupBackground'></div></div>");
		// popup window
		eventListener(document.getElementById("popupWrapper"),"click",closePopupWindow);
		popupLoaded = true;	
	}
	var pageToOpen = buttonTarget;
	// creating jquery objects
	var wrapper = $("#popupWrapper");
	var fader = $("#popupFader");
	var content = $("#popupFaderContent");
	var closeButton = $("#popupCloseView");
	/*
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
				
	}*/
	content.slideDown("slow");
	content.attr("src",pageToOpen);
}

function closePopupWindow() {
	var popupWrapper = $("popupWrapper");
	var popupFader = $("popupBackground");
	var popupContent = $("popupContent");
	var popupCloseButton = $("popupCloseView");
	if(popupContent.css("top") != "-100%"){
		popupContent.css("top","15%");
		popupCloseButton.css("top","13%");
		setTimeout(function(){
			popupFader.css("opacity", "0");
			popupContent.css("top","-100%");
			popupCloseButton.css("top","-100%");
		},10);
		setTimeout(function(){
			popupWrapper.css("display", "none");	
			popupContent.attr("src","");
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
	
	/* Welcome popup Currently disabled because of HubSpot popup
	// check if this is a new user
	if (!sessionStorage.getItem('returnUser')){
		// they are new, so set session storage so they are treated as returning
		sessionStorage.setItem('returnUser', 'true');
		// since they are new, show them a popup		
		setTimeout(function() {openGamePopup("games/pages/template.html");}, 5000);
	}
	*/
	
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
	createEventListeners();
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
	