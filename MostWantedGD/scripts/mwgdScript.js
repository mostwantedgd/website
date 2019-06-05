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

function loadNewsSlideShowXML(){
    dots = $(".dot");
		$.get("xml/newsPosts.xml", function(data){
			var newsPost = $(data).find("newsPosts").find("newsPost");
			for(var i = 0; i < 3;i++){
				newsPostHeadlines[i] = $(newsPost[i]).find("headline").text();
				newsPostSubHeadings[i] = $(newsPost[i]).find("subheading").text();
				newsPostMainImages[i] = $(newsPost[i]).find("mainImage").text();
				newsPostColors[i] = $(newsPost[i]).find("mainColor").text();
				newsPostSecColors[i] = $(newsPost[i]).find("secondaryColor").text();
				$(dots[i]).css("backgroundColor", newsPostSecColors[i]);
			}
			showHomeSlide();
			$("#imgText").css({"opacity":"1", "transition":".3s"});
			$("#imgTextSub").css({"opacity":"1","transition":".3s"});
		}, "XML");
		$("mainImageSlide").on("swiperight",(function(e){
			homeSlideUp();
		}));
		$("mainImageSlide").on("swipeleft",(function(e){
			homeSlideDown();
		}));
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
// Called by buttons to open a window. The button's ID is the their target path
function openButtonLink(clickedButton){
  var link = clickedButton.id.toString();
  if(link.includes("http") || link.includes("https")){
    window.open(link,"_blank");
  }
  else{
    openGamePopup(clickedButton.id);
   }
}

// Opens a popup window given a path
function openGamePopup(buttonTarget)
{
	if(!popupLoaded){
		// Insert Popup markup into page
		$("main").prepend("<div id='popupWrapper'><div id='popupRelative' style='position:relative;'><button id='popupCloseView'>X</button><iframe id='popupContent'></iframe></div><div id='popupBackground'></div></div>");
		// popup window
		eventListener(document.getElementById("popupCloseView"),"click",closePopupWindow);
		eventListener(document.getElementById("popupBackground"),"click",closePopupWindow);
		popupLoaded = true;
	}
	var pageToOpen = buttonTarget;
	$("#popupContent").attr("src",pageToOpen);
	$("#popupWrapper").css("display","block");
  $("#popupBackground").fadeIn();
	$("body").css({"overflow":"hidden","margin-right":"1%"});
}

function closePopupWindow() {
	$("#popupWrapper").css("display","none");
  $("#popupBackground").fadeOut();
	$("body").css({"overflow":"auto","margin":"auto"});
}

//}

//{ mobile menu open/close functions
// Opens and closes the mobile menu when called
function openMobileMenu(){
	mobileMenuOpen = !mobileMenuOpen;
	if(mobileMenuOpen){
		$("#menu-items").slideDown();
		$("#dropdownMenu").id("dropdownMenu-open");
		$("body").css({"overflow":"hidden","margin-right":"1%"});

	} else {
		$("#menu-items").slideUp();
		$("#dropdownMenu").id("dropdownMenu");
		$("body").css({"overflow":"auto","margin":"auto"});
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
  if($("#mainImage-slideshow").exists()){
	   loadNewsSlideShowXML();
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
	createEventListeners();
}

// Create listeners, called from pageStart()
function createEventListeners(){
	// Pop-up buttons
	if (document.getElementsByClassName("block-item")){
		var gameButtons = document.getElementsByClassName("block-item");
		for (var i = 0; i < gameButtons.length; i++){
			eventListener(gameButtons[i],"click",function(){openButtonLink(this);});
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

jQuery.fn.exists = function(){ return this.length > 0; }
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
