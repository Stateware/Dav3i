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
    g_DataList.add(newNode);
    // draw graph with new node
    GenerateSubDivs();
    GenerateGraphs();
}

/*
 *  Function: AddRegion
 *  
 *  This function is called when a region is selected on the map
 *
 *  Parameters:
 *      cid - The country id of the region selected from the JVectorMap
 *
 *  Pre:
 *      getSession and getInstance functions are defined
 *
 *  Post:
 *      Makes a call to GetData to grab the data and graph it
 *
 *  Authors:
 *      William Bittner
 *
 *  Date Created:
 *      2/22/2016
 *
 *  Last Modified:
 *      2/22/2016 by William Bittner
 */
function AddRegion( cid )
{
	GetData( getSession(), getInstance(), cid );
}

/*
 *  Function: RemoveRegion
 *  
 *  This function is called when a region is deselected on the map
 *
 *  Parameters:
 *      cc2 - The cc2 of the region deselected from the JVectorMap
 *
 *  Pre:
 *      GenerateSubDivs and GenerateGraph functions are defined, g_DataList is defined
 *
 *  Post:
 *      Deletes the node with the cc2 regions data from the global list of nodes and redraws the charts
 *
 *  Authors:
 *      William Bittner
 *
 *  Date Created:
 *      2/22/2016
 *
 *  Last Modified:
 *      2/22/2016 by William Bittner
 */
function RemoveRegion( cc2 )
{
    g_DataList.delete(cc2);
    // redraw graphs
    GenerateSubDivs();
    GenerateGraphs();
}
