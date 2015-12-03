/*
 * Copyright 2015 Stateware Team: William Bittner, Joshua Crafts, 
 * Nicholas Denaro, Dylan Fetch, Paul Jang, Arun Kumar, Drew Lopreiato,
 * Brent Mosier, Kyle Nicholson, Emma Roudabush, Berty Ruan, Vanajam Soni, 
 * Murlin Wei, Zekun Yang
 * 
 * This file is part of Dav3i.
 * 
 * Dav3i is free software: you can redistribute it and/or modify
 * it under the terms of the MIT Software License.
 * 
 * Dav3i is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * MIT Software License for more details.
 * 
 * You should have received a copy of the MIT Software License along 
 * with Dav3i.  If not, see <https://opensource.org/licenses/MIT/>.
 */

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
// PRE: divs with class "spinner" and "begin" exist, and the function ParseDescriptor is defined
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


