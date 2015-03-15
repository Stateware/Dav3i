// File Name:               loading_script.js
// Description:             For loading screen
// Date Created:            3/5/2015
// Contributors:            Emma Roudabush, Joshua Crafts
// Date Last Modified:      3/15/2015
// Last Modified By:        Joshua Crafts
// Dependencies:            lookup_table.js, map.js, index.html
// Additional Notes:        N/A

//
$(".loadingScreen").ready(function () {
    // Generate lookup table and heat map
    CreateLookupTable();
    // Do below process when heat map is generated
    setTimeout(function () {
    $(".spinner").fadeOut(1250);
    }, 3000);
    setTimeout(function () {
        $(".begin").fadeIn(1500);
    }, 4250);
});

//
function switchToMain ()
{
    $(".loading-screen").hide();
}

