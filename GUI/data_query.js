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


// Author:          Nicholas Denaro
// Date Created:    2/12/15
// Last Modified:   3/19/15 by Nicholas Denaro
// Description:     Parses the object that is passed in and returns data array.
// PRE: json is valid JSON with data for only one country, assumed to be in the proper format
// POST: FCTVAL == a 2d array containing stat, year in the form [stat][year]
function ParseData(json)
{
    var data = new Array(); // Creates the array for the data to be returned
    data = json[Object.keys(json)[0]];// Since there will only be one country in each json,
                                      // we can simply get the first key, and use that to
                                      // get the value for the data.

    return (data);
}


// Author:          Vanajam Soni, Paul Jang
// Date Created:    3/5/15
// Last Modified:   3/26/15 by Vanajam Soni
// Description:     Makes Ajax call to get country data from server
// PRE: cid is a valid country-id
// POST: FCTVAL == Ajax object that makes the API call with the given cid
function GetData(cid)
{
    return $.ajax({                                      
        url: "API/by_country.php?countryIDs=".concat(cid.toString()),                                                    
        dataType: "JSON",
        success: function(data){     
            console.log("Successfully received by_country.php?countryIDs=".concat(cid.toString()));
        } 
    });

}

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
         g_DataList = new c_List();

    g_DataList.clear();						// clear list

    for(i = 0; i < selectedRegions.length; i++)			// iterate through list of selected countries
    {
        index = Hash(selectedRegions[i]);			// index into hash table using CC2
        if (g_LookupTable[index] !== undefined)			// if data exists for country, create node
        {							//  and prepend it to list
            node = new t_AsdsNode(g_LookupTable[index][0],
                                  g_LookupTable[index][1],
                                  g_LookupTable[index][2],
                                  g_LookupTable[index][3]);
            g_DataList.add(node);
        }
    }
}
