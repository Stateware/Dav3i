// File Name:               loading_script.js
// Description:             For loading screen
// Date Created:            3/5/2015
// Contributors:            Emma Roudabush, Joshua Crafts
// Date Last Modified:      3/17/2015
// Last Modified By:        Joshua Crafts
// Dependencies:            lookup_table.js, map.js, data.js, index.html
// Additional Notes:        N/A

// Author: Emma Roudabush
// Date Created: 3/5/2015
// Last Modified: 3/17/2015 by Joshua Crafts
// Description: Generates lookup table and heat map while 
//              displaying loading screen
// PRE: N/A
// POST: lookup table is generated, generate map colored by default HMS
$(".loadingScreen").ready(function () {
// Generate lookup table and heat map
    CreateLookupTable();
// Do below process when heat map is generated
    $(".spinner").fadeOut(1250);
    setTimeout(function () {
        $(".begin").fadeIn(1500);
    }, 1250);
});

// Author: Emma Roudabush
// Date Created: 3/5/2015
// Last Modified: 3/17/2015 by Joshua Crafts
// Description: Fades the screen back to the main page
// PRE: N/A
// POST: Screen is switched to the main page
function SwitchToMain ()
{
    $(".loading-screen").fadeOut(750);
}

