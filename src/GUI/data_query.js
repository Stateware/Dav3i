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


/*
 * Function: FormatStatData
 * Takes a cache stats object for a particular country and returns a
 * 2D array of the values
 * 
 * Parameters: 
 * statData
 * 
 * Pre: 
 * statData contains valid stat data for a particular country in the
 * cache storage format
 * 
 * Post: 
 * FCTVAL == a 2d array containing [stat][year]
 * 
 * Returns: 
 * 2d array [stat][year]
 * 
 * Authors: 
 * Kyle Yost, John Martin
 * 
 * Date Created: 
 * 2/8/16 
 * 
 * Last Modified: 
 * 2/12/16 by Kyle Yost, John Martin
 */
function FormatStatData(statData)
{
    var arr = [];
    var statKeys = statData.keys; 

    for(var i = 0; i < statKeys.length; i++)
    {
        var yearKeys = statData.get(statKeys[i]).keys;
        arr[i] = [];
        for(var j = 0; j < yearKeys.length; j++)
        {
            arr[i][j] = statData.get(statKeys[i]).get(yearKeys[j]);
        }
    }

    return arr;
}


/*
 *  Function: GetData
 *  
 *  Grabs country data from the cache then passes GenerateCountryCharts as a callback to be called once
 * 			the cache is filled 
 *
 *  Parameters:
 * 		sessionid - The session to get the data from
 * 		instanceid - The instance to get the data from
 *      countryid - The country to get the data from
 *
 *  Pre:
 *      sessionid is a valid session id
 * 		instanceid is a valid instance id
 * 		countryid is a valid country id
 *
 *  Post:
 *      FCTVAL == the cache object rooted at the countryid is returned (all objects inside the country id)
 *
 *  Authors:
 *      William Bittner
 *
 *  Date Created:
 *      2/8/2016
 *
 *  Last Modified:
 *      2/8/2016 by William Bittner
 */
function GetData( sessionid, instanceid, countryid )
{
    retrieveByCountryData( sessionid, instanceid, countryid, GenerateCountryCharts );
} 

/*
 *  Function: GenerateCountryCharts
 *  
 *  Makes a new node for the given countryid with the given data
 * 		then adds that node to the list nodes and calls the functions to generate subdivs and charts for that node
 *
 *  Parameters:
 * 		data - The cache data for the country
 * 		cid - The country id
 *
 *  Pre:
 *      cid is a valid country-id
 * 		data is valid cache data
 *
 *  Post:
 *      A new node will be created for the country with the proper fields and added to the global list of nodes
 * 			The charts will be properly formatted and generated.
 *
 *  Authors:
 *      Vanajam Soni, Kyle Nicholson, William Bittner
 *
 *  Date Created:
 *      2/8/2016 
 *
 *  Last Modified:
 *      2/8/2016 by William Bittner
 */
function GenerateCountryCharts( data, cid )
{
	var newNode = new t_AsdsNode(getSession(), getInstance(), cid, g_LookupTable[cid][0], g_LookupTable[cid][1], null);
	var parsedData = FormatStatData(data);
    newNode.data = parsedData;
    //console.log(newNode);
    g_DataList.add(newNode);
    // draw graph with new node
    GenerateSubDivs();
    GenerateGraphs();
}


/*
 *  Function: ModifyData
 *  
 *  Adds or removes a node to the g_DataList to reflect the chosen regions on the map
 *
 *  Parameters:
 *      selectedRegions - The regions selected from the JVectorMap
 *
 *  Pre:
 *      selectedRegions is a string array of regions selected on the map
 *
 *  Post:
 *      modifies g_DataList if there is a mismatch between regions selected, and regions stored in the g_DataList.
 *
 *  Returns:
 *      linked list of currently selected countries on map.
 *
 *  Authors:
 *      Vanajam Soni, Kyle Nicholson, Nicholas Denaro
 *
 *  Date Created:
 *      3/24/15
 *
 *  Last Modified:
 *      2/8/2016 by William Bittner
 */
function ModifyData(selectedRegions) 
{
    if(g_DataList == null)
        g_DataList = new c_List();

    for(i=0;i<selectedRegions.length;i++)
    {
            if(GetCID(selectedRegions[i]) == -1) 
            {
                selectedRegions.splice(i, 1);
            }
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

                GetData( getSession(), getInstance(), cid );
                 /*var newNode = new t_AsdsNode(cid,g_LookupTable[cid][0],g_LookupTable[cid][1],null);
               $.when(GetData(cid)).done(function(data){
                    var parsedData = ParseData(data);
                    newNode.data = parsedData;
                    //console.log(newNode);
                    g_DataList.add(newNode);
                    // draw graph with new node
                    GenerateSubDivs();
                    GenerateGraphs();
                });*/
            }
        }
    }
    else if(selectedRegions.length < g_DataList.size)
    {

        var currentNode = g_DataList.start;

        // look for cc2 to remove
        for(var i = 0; i<g_DataList.size;i++)
        {
            if(g_DataList != null) 
            {
                cc2ToRemove = currentNode.cc2;
                cid = GetCID(cc2ToRemove);
                if(selectedRegions.indexOf(cc2ToRemove) == -1 && cid != -1)
                {
                    g_DataList.delete(cc2ToRemove);
                    // redraw graphs
                    GenerateSubDivs();
                    GenerateGraphs();
                }

            }
            currentNode = currentNode.next;
        }
    }
    return g_DataList;
}

