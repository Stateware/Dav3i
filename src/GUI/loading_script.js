// File Name:               loading_script.js
// Description:             For loading screen
// Date Created:            3/5/2015
// Contributors:            Emma Roudabush, Joshua Crafts
// Date Last Modified:      3/31/2015
// Last Modified By:        Emma Roudabush
// Dependencies:            descriptor.php, by_stat.php, lookup_table.js, map.js, data.js, index.html
// Additional Notes:        N/A

// Author: Emma Roudabush
// Date Created: 3/5/2015
// Last Modified: 3/23/2015 by Joshua Crafts
// Description: Generates lookup table and heat map while 
//              displaying loading screen
// PRE: N/A
// POST: lookup table is generated, generate map colored by default HMS
$(".loading-screen").ready(function () {
// Generate lookup table and heat map
    ParseDescriptor();
// Do below process when heat map is generated
    $(".spinner").fadeOut(1250);
    setTimeout(function () {
        $(".begin").fadeIn(1500);
    }, 1250);
});


