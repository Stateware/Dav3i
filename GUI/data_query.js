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

// File Name:               data_query.js
// Description:             takes CC2 codes and sends them to lookup_table.js, receives CIDs, queries the database,
//                          parses the JSON and returns the array
// Date Created:            3/5/2015
// Contributors:            Paul Jang, Vanajam Soni, Kyle Nicholson
// Date Last Modified:      3/26/2015
// Last Modified By:        Vanajam Soni
// Dependencies:            lookup_table.js, byCountry.php, parser.js
// Additional Notes:        N/A

// Author: Vanajam Soni, Kyle Nicholson
// Date Created: 3/24/15
// Last Modified: 3/26/15 Vanajam Soni
// Description: adds or removes a node to the g_DataList to reflect the chosen regions on the map
// PRE:  selectedRegions is a 1D array of CC2 codes output from map.getSelectedRegions in map.js
// POST: the current data list is replaced with a list containing the relevant data for all countries
//       whose CC2s are in selectedRegions which have data available
function BuildList(selectedRegions) 
{
    var index;			// index in g_LookupTable for a given entry, hashed based on CC2
    var node;			// new node to be added to list

    if (g_DataList == null)					// create list if it does not exist
    {
	g_DataList = new c_List();
    }

    g_DataList.clear();						// clear list

    for(var i = 0; i < selectedRegions.length; i++)			// iterate through list of selected countries
    {									//  and prepend it to list
        if (g_Data[selectedRegions[i]] !== undefined && g_Data[selectedRegions[i]][g_StatId] !== undefined)
        {
            node = new t_AsdsNode(selectedRegions[i],
                                  g_Countries[selectedRegions[i]],
                                  g_Data[selectedRegions[i]]);
            g_DataList.add(node);
        }
    }
}
