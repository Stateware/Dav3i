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
//                  Input: json - Assumed to be in the proper format
//                                if the JSON is invalid
//                  Output: data - A 2D array in the form [stat][year]
function ParseData(json)
// PRE: json is valid JSON with data for only one country
// POST: FCTVAL == a 2d array containing stat, year
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
//                  Input: CID
//                  Output: data from the server for the specific country
function GetData(cid)
{
    return $.ajax({                                      
        url: 'http://usve74985.serverprofi24.com/API/by_country.php?countryIDs='.concat(cid.toString()),                                                    
        dataType: 'JSON',
        success: function(data){     
            console.log("Successfully received by_country.php?countryIDs=".concat(cid.toString()));
        } 
    });

}


// Author: Vanajam Soni, Kyle Nicholson
// Date Created: 3/24/15
// Last Modified: 3/26/15 Vanajam Soni
// Description: adds or removes a node to the list
// Input: Selected regions string array
// Output: adds or removes a node to the list
function ModifyData(selectedRegions) {
    if(g_DataList == null){
        g_DataList = new c_List();
    }
    if(selectedRegions.length > g_DataList.size)
    {
        // look for cc2 to add
        var CC2Found = false;
        for(var i=0; i <= selectedRegions.length && !CC2Found; i++)
        {
            if(selectedRegions[i]!= null && !g_DataList.contains(selectedRegions[i]))
            {
                CC2Found = true;
                var cid = GetCID(selectedRegions[i]);
                if(cid != -1)
                {
                    var newNode = new t_AsdsNode(cid,g_LookupTable[cid][0],g_LookupTable[cid][1],null);
                    $.when(GetData(cid)).done(function(data){
                        var parsedData = ParseData(data);
                        newNode.data = parsedData;
                        console.log(newNode);
                        g_DataList.add(newNode);
                        // draw graph with new node
                        GenerateSubDivs();
                        GenerateGraphs();
                    });
                }
                else 
                {   
                    var index = selectedRegions.indexOf(selectedRegions[i]);
                    if (index > -1) {
                        selectedRegions.splice(index, 1);
                        ModifyData(selectedRegions);
                    }
                }
            }
        }
    }
    else if(selectedRegions.length < g_DataList.size)
    {
        // look for cc2 to remove
        for(var i = 0; i<g_DataList.size;i++)
        {
            if(g_DataList != null) {
                cc2ToRemove = g_DataList.item(i).cc2;
                if(selectedRegions.indexOf(cc2ToRemove) == -1)
                {
                    g_DataList.delete(cc2ToRemove);
                    // redraw graphs
                    GenerateSubDivs();
                    GenerateGraphs();
                }
            }
        }
    }
    else
        return;
}