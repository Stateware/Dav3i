﻿// File Name:               loadingScreen.js
// Description:             Actions of the loading screen, including creating the initial lookup table and heat map
// Date Created:            2/19/2015
// Contributors:            Emma Roudabush
// Date Last Modified:      2/23/2015
// Last Modified By:        Emma Roudabush
// Dependencies:            loadingScreen.html, loadingScreen.css
// Additional Notes:        N/A

$(document).ready(function () {
	// Generate heat map
	var jqxhr = $.ajax({
		type: "get",
		url: "http://usve74985.serverprofi24.com/API/descriptor.php",
		dataType: "json",
		success:function(data) {
			alert("success");
			console.log(JSON.Stringify(data));
		},
		error:function(error) {
			alert("error");
			console.log(error);
		}
	});
	// Do below process when heat map is generated
    setTimeout(function () {
        $(".spinner").fadeOut(1250);
    }, 3000);
    setTimeout(function () {
        $(".begin").fadeIn(1500);
    }, 4250);
});

$(".begin").click(function(){
    // Go to main page
});