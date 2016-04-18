/*
 * Copyright 2015 Stateware Team: William Bittner, Joshua Crafts, 
 * Nicholas Denaro, Dylan Fetch, Paul Jang, Arun Kumar, Drew Lopreiato,
 * Kyle Nicholson, Emma Roudabush, Berty Ruan, Vanajam Soni
 * 
 * This file is part of Dav3i.
 * 
 * Dav3i is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * Dav3i is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Dav3i.  If not, see <http://www.gnu.org/licenses/>.
 */

// File Name:               loading_script.js
// Description:             For loading screen
// Date Created:            3/5/2015
// Contributors:            Emma Roudabush, Joshua Crafts
// Date Last Modified:      11/13/2015
// Last Modified By:        Paul Jang
// Dependencies:            descriptor.php, by_stat.php, lookup_table.js, map.js, data.js, dynamic_markup.js, index.html
// Additional Notes:        N/A


/*
 * Function: ReadConfig
 * This function is called on page load of Dav3i. It reads the config file, then calls the initPage function
 * 
 *
 * Pre: initPage is a defined function
 * 
 *
 * Post: initPage is called with the json of the file located at CONF/frontend_connection_strings.conf
 * 
 *
 * Authors: William Bittner, Nicholas Denaro
 * 
 *
 * Date Created: 4/4/2016
 * 
 *
 * Last Modified: 4/4/2016 by William Bittner
 * 
 */
function ReadConfig()
{
	$.getJSON( "CONF/frontend_connection_strings.conf", initPage);
}

/*
 * Function: initPage
 * This page called all of the functions necessary to initialize the page
 * 
 *
 * Pre: functions LoadConfig, initMap, GetDescriptor, and RemoveSpinnerAndBegin are defined
 * 
 *
 * Post: LoadConfig is called with the configData, initMap is called, and GetDescriptor is called and passed with RemoveSpinnerAndBegin as a callback
 * 
 *
 * Authors: William Bittner, Nicholas Denaro
 * 
 *
 * Date Created: 4/4/2016 
 * 
 *
 * Last Modified: 4/4/2016 by William Bittner
 * 
 */
function initPage( configData ) 
{
	 LoadConfig( configData ); 
	 initMap(); 
	 GetDescriptor(null, RemoveSpinnerAddBegin);
	
};

/*
 * Function: RemoveSpinnerAndBegin
 * This function removes the loading screen spinner and shows the begin button
 * 
 *
 * Pre: spinner and begin classes defined
 * 
 *
 * Post: spinner is gone and begin has appeared
 * 
 *
 * Authors: William Bittner, Nicholas Denaro
 * 
 *
 * Date Created: 4/4/2016
 * 
 *
 * Last Modified: 4/4/2016 by William Bittner
 * 
 */
function RemoveSpinnerAddBegin()
{
    $(".spinner").fadeOut(1250, function() { $(".begin").fadeIn(1500); });
}

