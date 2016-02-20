// ==UserScript==
// @name		FurkThat!
// @namespace	https://fpddl.link
// @description	Script for adding torrents to furk.net while being on other sites.
// @include		https://kat.cr/*
// @include		https://torrentz.eu/*
// @include		https://fpddl.link/*
// @require		http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js

// @version		1
// @grant		none
// ==/UserScript==


// Retrieves the info hash depending on which site it is.
if (location.hostname == "kat.cr") {
	var infoHash = $('#thnxLink').data('hash');
}
else if (location.hostname == "torrentz.eu") {
	var infoHash = $('.trackers > div:nth-child(1)').html().substring(11);
}

// For testing
console.log(location.hostname);
console.log(infoHash);

// Uses regex to test the info hash, if it doesnt match the conditions, the whole script stops
var regTest = /^[0-9a-fA-F]{40}$/;
if (!regTest.test(infoHash)) {
	console.log("Info hash doesnt match conditions");
	return;
}

// CSS which is later used
var furkButtonBarCSS = {
		padding: "10px 0px 10px 0px",
		position: "fixed",
		bottom: "0",
		left: "0",
		"z-index": "100",
		"background-color": "#F8F8F8",
		border: "1px solid #E7E7E7",
	}
var furkButtonCSS = {
		"text-decoration": 'none',
		"font-size": '12px',
		padding: '5px',
		margin: '0px 2px 0px 2px',
		"background-color": '#337AB7',
		"color": 'white',
		cursor: 'pointer',
		"border-radius": '4px',
	}
var furkNotificationCSS = {
		"font-size": '12px',
		"text-decoration": "none",
		position: "fixed",
		bottom: "40px",
		padding:"2px",
		left: "0px",
		"z-index": "100",
		"background-color": "#F8F8F8",
		border: "1px solid #E7E7E7",
	}
var furkReadyCSS = {
	color: "green",
}
var furkNotReadyCSS = {
	color: "red",
}

function furkInitHTML() {
	console.log("furkInitHTML called");

	$("body").append("<div id='furkButtonBar'><a class='furkButton' id='furkAddBtn'>Add</a><a class='furkButton' href='javascript:' id='furkFurkBtn'>Furk</a><a class='furkButton' href='javascript:' id='furkDwnBtn'>Download</a></div>");

	$("#furkButtonBar").css(furkButtonBarCSS);
	$(".furkButton").css(furkButtonCSS);
}

function furkAddClick() {
	console.log("The Furk button was clicked.");

	$("#furkNotification").html("...");

	$.ajax({
		url: "https://www.furk.net/api/dl/add",

		// The name of the callback parameter, as specified by the YQL service
		jsonp: "jsonp",

		// Tell jQuery we're expecting JSONP
		dataType: "jsonp",

		// Tell YQL what we want and that we want JSON
		data: {
			info_hash: infoHash,
		},

		// Work with the response
		success: function (response) {
			console.log(response.status);
			if (response.status != "ok") {
				$("#furkNotification").html("Error: " + response.error);
				$("#furkNotification").show();
				return;
			}
			var html = "Added. Status: ";
			if(response.dl.dl_status != "failed") {
				html += "<span class='furkReady'>" + response.dl.dl_status + "</span>";
			}
			else {
				html += "<span class='furkNotReady'>" + response.dl.dl_status + "</span>";
			}
			$("#furkNotification").html(html);
			$("#furkNotification").show();
			$(".furkReady").css(furkReadyCSS);
			$(".furkNotReady").css(furkNotReadyCSS);
			$(".furkReady").css(furkReadyCSS);
		}
	});
}

$("body").append("<div id='furkNotification'></div>");
$("#furkNotification").css(furkNotificationCSS);

$.ajax({
	url: "https://www.furk.net/api/file/info",

	// The name of the callback parameter, as specified by the YQL service
	jsonp: "jsonp",

	// Tell jQuery we're expecting JSONP
	dataType: "jsonp",

	// Tell YQL what we want and that we want JSON
	data: {
		info_hash: infoHash,
	},

	// Work with the response
	success: function (response) {
		console.log(response.status);

		$("#furkNotification").html("...");

		if(response.status != "ok") {
			$("#furkNotification").show();
			if (response.error == "access denied") {
				response.error += " (Please login to Furk.net in another window)"
			}
			$("#furkNotification").html("Error: " + response.error).css("bottom", "0px");
			return;
		}

		furkInitHTML();
		$("#furkAddBtn").click(furkAddClick);

		if(!response.files[0]) {
			console.log("No files found on furk");
			$('#furkDwnBtn, #furkFurkBtn').css({"background-color": "#8fc4f2", "cursor": "not-allowed"}).attr('title', "No files found");
			$("#furkNotification").html("No files found on furk");
			return;
		}
		console.log(response.files[0]);


		var html = "File status: ";
			if (response.files[0].is_ready) {
				html += "<span class='furkReady'>ready</span>";
			}
			else {
				html += "<span class='furkNotReady'>not ready</span>";
			}
		$("#furkNotification").html(html);
		$(".furkReady").css(furkReadyCSS);
		$(".furkNotReady").css(furkNotReadyCSS);
		$("#furkNotification").show();


		if (response.files[0].ss_urls_tn_all) {
			console.log("Screenshot url found.");
			$("body").append("<div id='furkScrnshots'></div>");
			$("body").append("<div style='height:150px;'></div>");
			var furkScrnshots = {
				"background-image": "url(" + response.files[0].ss_urls_tn_all + ")",
				height: response.files[0].ss_height/2,
				width: "100%",
				position: "fixed",
				bottom: "0",
				left: "0",
				"z-index": "99",
			};
			$("#furkScrnshots").css(furkScrnshots);
		}

		if(response.files[0].url_page) {
			$('#furkFurkBtn').attr('href', 'https://www.furk.net' + response.files[0].url_page);
		}

		if(response.files[0].url_dl) {
			console.log("Url_dl found.");
			$('#furkDwnBtn').attr('href', response.files[0].url_dl);
		}

		if (response.files[0].url_pls) {
			console.log("Url_pls found.");
			$('#furkButtonBar').append("<a class='furkButton' href='" + response.files[0].url_pls + "' id='furkPlayBtn'>Play</a>");
			$('.furkButton').css(furkButtonCSS);
			$('#furkPlayBtn').css("background-color", "#449D44");
		}
	}
});
