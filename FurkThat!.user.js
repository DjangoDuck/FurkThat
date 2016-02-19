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

// TESTS FOR GITHUB, 2

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


/*jQuery19109385222132081391_1455362268452({
	"files": [],
	"messages": [],
	"found_files": "0",
	"torrent": {
		"have": "0.00",
		"up_bytes": "0",
		"id_files": null,
		"info_hash": "95A942D1498D030464E7CDB7D74B6FEA76011A2C",
		"speed": "0",
		"id": "12150356020053458163",
		"up_speed": "0",
		"dl_status": "active",
		"is_linked": "1",
		"fail_reason": "",
		"leeching_dt": "0000-00-00 00:00:00",
		"post_proc_status": "",
		"peers": "0",
		"mtime": "2016-02-13 11:16:27",
		"avail": "0.00",
		"adding_dt": "2016-02-13 11:16:27",
		"name": "ProPlus14.x64.SP2.en-US-2016.02.zip",
		"active_status": "adding",
		"size": "1651112936",
		"seeders": "0",
		"bytes": "1",
		"finish_dt": "0000-00-00 00:00:00"
	},
	"dl": {
		"peers": "0",
		"leeching_dt": "0000-00-00 00:00:00",
		"post_proc_status": "",
		"adding_dt": "2016-02-13 11:16:27",
		"avail": "0.00",
		"mtime": "2016-02-13 11:16:27",
		"active_status": "adding",
		"name": "ProPlus14.x64.SP2.en-US-2016.02.zip",
		"bytes": "1",
		"finish_dt": "0000-00-00 00:00:00",
		"size": "1651112936",
		"seeders": "0",
		"id_files": null,
		"up_bytes": "0",
		"have": "0.00",
		"speed": "0",
		"info_hash": "95A942D1498D030464E7CDB7D74B6FEA76011A2C",
		"is_linked": "1",
		"fail_reason": "",
		"id": "12150356020053458163",
		"up_speed": "0",
		"dl_status": "active"
	},
	"status": "ok"
})*/



/*jQuery19104215575748025491_1454679668571({
	"status": "ok",
	"messages": [],
	"files": [{
		"url_dl": "https://3582soma8co1mjo7qbk17iau8oqhebfrpdfgkjo.fpddl.link/d/p/KPJJ85cVir783TN1K7pG24jDbFUylUFDK8924T_lHww1Fy37y18KTw/Jarhead.3.The.Siege.2016.FRENCH.BDRip.XviD-ViVi",
		"ss_width": "300",
		"size": "793695403",
		"video_info": "Duration: 01:28:59.27, start: 0.000000, bitrate: 1189 kb/s\n    Stream #0:0: Video: mpeg4 (Simple Profile) (xvid / 0x64697678), yuv420p, 720x306 [SAR 1:1 DAR 40:17], 1048 kb/s, 25 fps, 25 tbr, 25 tbn, 25 tbc\n    Metadata:\n      title           : FRF\n    Stream #0:1: Audio: mp3 (U[0][0][0] / 0x0055), 44100 Hz, stereo, s16p, 128 kb/s\n    Metadata:\n      title           : FR",
		"id": "8789532666757360475",
		"name": "Jarhead.3.The.Siege.2016.FRENCH.BDRip.XviD-ViVi",
		"ss_num": "9",
		"ss_urls": ["//e5huo240oi5svl4adkvoqi8njgqhebfrpdfgkjo.fpddl.link/ss/6526084/1", "//e5huo240oi5svl4adkvoqi8njgqhebfrpdfgkjo.fpddl.link/ss/6526084/2", "//e5huo240oi5svl4adkvoqi8njgqhebfrpdfgkjo.fpddl.link/ss/6526084/3", "//e5huo240oi5svl4adkvoqi8njgqhebfrpdfgkjo.fpddl.link/ss/6526084/4", "//e5huo240oi5svl4adkvoqi8njgqhebfrpdfgkjo.fpddl.link/ss/6526084/5", "//e5huo240oi5svl4adkvoqi8njgqhebfrpdfgkjo.fpddl.link/ss/6526084/6", "//e5huo240oi5svl4adkvoqi8njgqhebfrpdfgkjo.fpddl.link/ss/6526084/7", "//e5huo240oi5svl4adkvoqi8njgqhebfrpdfgkjo.fpddl.link/ss/6526084/8", "//e5huo240oi5svl4adkvoqi8njgqhebfrpdfgkjo.fpddl.link/ss/6526084/9"],
		"id_labels": [],
		"ss_urls_tn_all": "//e5huo240oi5svl4adkvoqi8njgqhebfrpdfgkjo.fpddl.link/ss/6526084/tn_all",
		"av_time": "0000-00-00 00:00:00",
		"files_num_video_player": "0",
		"files_num_image": "0",
		"media_proc_status": "done",
		"status": "",
		"url_pls": "https://3582soma8co1mjo7qbk17iau8oqhebfrpdfgkjo.fpddl.link/pls/DkIWmplvFZ8qB_QuNF1pGIjDbFUylUFDK8924T_lHww1Fy37y18KTw/Jarhead.3.The.Siege.2016.FRENCH.BDRip.XviD-ViVi.xspf",
		"url_page": "/df/a6cda84e36a8baef",
		"files_num_audio": "0",
		"info_hash": "70D259F24F16BDE70B5B9881686AC1644BA43CE2",
		"files_num_audio_player": "0",
		"type": "video",
		"av_info": "",
		"is_ready": "1",
		"ss_urls_tn": ["//e5huo240oi5svl4adkvoqi8njgqhebfrpdfgkjo.fpddl.link/ss/6526084/tn_1", "//e5huo240oi5svl4adkvoqi8njgqhebfrpdfgkjo.fpddl.link/ss/6526084/tn_2", "//e5huo240oi5svl4adkvoqi8njgqhebfrpdfgkjo.fpddl.link/ss/6526084/tn_3", "//e5huo240oi5svl4adkvoqi8njgqhebfrpdfgkjo.fpddl.link/ss/6526084/tn_4", "//e5huo240oi5svl4adkvoqi8njgqhebfrpdfgkjo.fpddl.link/ss/6526084/tn_5", "//e5huo240oi5svl4adkvoqi8njgqhebfrpdfgkjo.fpddl.link/ss/6526084/tn_6", "//e5huo240oi5svl4adkvoqi8njgqhebfrpdfgkjo.fpddl.link/ss/6526084/tn_7", "//e5huo240oi5svl4adkvoqi8njgqhebfrpdfgkjo.fpddl.link/ss/6526084/tn_8", "//e5huo240oi5svl4adkvoqi8njgqhebfrpdfgkjo.fpddl.link/ss/6526084/tn_9"],
		"av_result": "error",
		"files_num_video": "1",
		"ss_height": "128"
	}]
}) */




/*jQuery19107224175489249275_1454760144153({"status":"error","error":"access denied"})*/
