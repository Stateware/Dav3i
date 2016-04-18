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
        	//subtract first year from year value to make sure our data is in order
        	//	even if the yearKeys array is not sorted
            arr[i][yearKeys[j]-g_FirstYear] = statData.get(statKeys[i]).get(yearKeys[j]);
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
	//check if country is still selected after we retrieve the data since async retrieval
	if( IsRegionSelected(cid,g_Map, g_LookupTable) )
	{
		var newNode = new t_AsdsNode(getSession(), getInstance(), cid, g_LookupTable[cid][0], g_LookupTable[cid][1], null);
		var parsedData = FormatStatData(data);
	    newNode.data = parsedData;
	    g_DataList.add(newNode);
	    // draw graph with new node
	    GenerateSubDivs();
	    GenerateGraphs();
	}
}

/*
 *  Function: IsRegionSelected
 *  
 *  This function checks whether the specified region is selected
 *
 *  Parameters:
 *      cid - The country id of the region for which to check 
 *
 *  Pre:
 *      map is defined and has a function getSelectedRegions which will return the CC2 of all selected regions
 * 		lookupTable is defined and as described in the documentation
 *
 *  Post:
 *      Returns true if region is selected, false if region is not
 *
 *  Authors:
 *      William Bittner
 *
 *  Date Created:
 *      3/28/2016
 *
 *  Last Modified:
 *      3/28/2016 by William Bittner
 */
function IsRegionSelected( cid, map, lookupTable )
{
	var selectedRegions = map.getSelectedRegions();
	var index = selectedRegions.indexOf(lookupTable[cid][0]);
	
	return (index != -1);
}

/*
 * Function: GenerateGraphStatNodes
 *      Generates an array of t_graphStat nodes based upon g_GraphType
 *          - VACCINE: generates 3 grapStat nodes for the country with countryid = cid
 *          - REGIONAL: generates a graphStat node for each selected stat for the country
 *                  with countryid = cid
 *          - COMBINED: generates a graphStat node for each country in g_DataList
 *          - SUM: generates 1 graphStat node with the sum of data values for each
 *                  country in g_DataList
 *
 * Parameters:
 *      - cid - The country ID of the newly added country (only relevant when g_GraphType = VACCINE or REGIONAL)
 *
 * Pre: 
 *      - g_graphType is set to VACCINE, REGIONAL, COMBINED or SUM
 *      - cid is a valid country id when g_graphType is VACCINE or REGIONAL
 *      - g_cache contains valid entries for a country with cid and all countries
 *          in g_DataList
 *
 * Post:
 *      FCTVAL = array of graphStat nodes based upon the following values for g_GraphType:
 *          - VACCINE: generates 3 grapStat nodes for the country with countryid = cid
 *          - REGIONAL: generates a graphStat node for each selected stat for the country
 *                  with countryid = cid
 *          - COMBINED: generates a graphStat node for each country in g_DataList
 *          - SUM: generates 1 graphStat node with the sum of data values for each
 *                  country in g_DataList
 * 
 * Authors:
 * John Matin
 *
 * Date Created:
 * 4//2016 by John Martin
 * 
 * Last Modified:
 * 4//2016 by John Martin
 */
function GenerateGraphStatNodes(cid, graphType)
{
    var multiInstance;
    var selectedStats = [];
    var newNodes = [];
    var tempNodes = [];
    var selectedTabs;

    //call to get selected tabs
    selectedTabs = GetSelectedTabInfo();
    multiInstance = (String(selectedTabs["multi-instance"]) == "true");
    selectedStats[0] = parseInt(selectedTabs["stat1_id"]);
    if(selectedTabs["stat2_id"] != "null")
    {
        selectedStats[1] = parseInt(selectedTabs["stat2_id"]);    
    }
    
    switch(graphType) 
    {
        case g_GraphTypeEnum.VACCINE:
            //for vaccines set the selected stats
            selectedStats = [];
            selectedStats[0] = g_ParsedStatList[1][0]; //siaIndex
            selectedStats[1] = g_ParsedStatList[2][0]; //mcv1Index
	        selectedStats[2] = g_ParsedStatList[3][0]; //mcv2Index

            //loop through every selectedStat and create a graphStat node for it
            for(var i = 0; i < selectedStats.length; i++)
            {
                newNodes[i] = new t_graphStat(g_cache.get(getSession()).get(getInstance()).get(cid).get(selectedStats[i]), g_LookupTable[cid][1] + " - " + g_StatList[selectedStats[i]]);
            } 
            
            //can only graph for one instance because there are multiple stats
            multiInstance = false;
        case g_GraphTypeEnum.REGIONAL:
            //Regional - Many graphs - one for each country
            if(multiInstance)   //if multiInstance is set, create chart_nodes for all instances of stat1 of cid
            {
                //loop for all instances
                for(var i = 0; i < g_cache.get(getSession()).keys.length; i++)
                {
                    newNodes[i] = new t_graphStat(g_cache.get(getSession()).get(i).get(cid).get(selectedStats[0]), g_LookupTable[cid][1] + " - " + g_cache.get(getSession()).get(getInstance()).name);
                }
            }
            else
            {
                //loop through every selectedStat and create a graphStat node for it
                for(var i = 0; i < selectedStats.length; i++)
                {
                    newNodes[i] = new t_graphStat(g_cache.get(getSession()).get(getInstance()).get(cid).get(selectedStats[i]), g_LookupTable[cid][1] + " - " + g_StatList[selectedStats[i]]);
                } 
            }
            break;
        case g_GraphTypeEnum.COMBINED:
            //Combined - One graph where each country has its own line
            for(var i = 0; i < g_DataList.length; i++) //iterate through all of the selected countries
            {
                newNodes[i] = new t_graphStat(g_cache.get(getSession()).get(getInstance()).get(g_DataList[i].cid).get(selectedStats[0]), g_LookupTable[g_DataList[i].cid][1]);
            }
            break;
        case g_GraphTypeEnum.SUM:
            //Whole - One graph with the sum of all values for a selection
            for(var i = 0; i < g_DataList.length; i++) //iterate through all of the selected countries
            {
                tempNodes[i] = new t_graphStat(g_cache.get(getSession()).get(getInstance()).get(g_DataList[i].cid).get(selectedStats[0]), g_LookupTable[g_DataList[i].cid][1]);
            }
            newNodes[0] = sumGraphStatNodes(tempNodes);
            break;
    }
    
    return newNodes;
}

/*
 * Function: sumGraphStatNodes
 *      Generates a graph stat node (of type t_graphStat) with the sum of data values for
 *      each year in nodeArray 
 *
 * Parameters:
 *      - nodeArray - An array of t_graphStat nodes indexed from 0..nodeArray.length-1
 * 
 * Pre: 
 *      nodeArray contains objects of type t_graphStat indexed from 0..nodeArray.length-1
 *
 * Post:
 *      FCTVAL = t_graphStat node where FCTVAL.data is the sum of data for all nodes in 
 *      nodeArray[0..length-1]
 * 
 * Authors:
 * John Matin
 *
 * Date Created:
 * 4/4/2016 by John Martin
 * 
 * Last Modified:
 * 4/8/2016 by John Martin
 */
function sumGraphStatNodes(nodeArray)
{
    var name = nodeArray[0].name;                   //common name for the data of the first object?
    var data = [];                                  //new summed data array
    var startYear = findMinStartYear(nodeArray);    //min start year for all years in nodeArray
    var endYear = findMaxEndYear(nodeArray);        //max end year for all years in nodeArray
    var years = [];                                 //new years array
    var min = Number.MAX_SAFE_INTEGER;              //minimum value fo summed data
    var max = Number.MIN_SAFE_INTEGER;              //maximum value of summed data
    var sumNode = nodeArray[0];                     //need a t_graphStat object
    
    //generate years array && init data[]
    for(var i = 0; i <= (endYear - startYear); i++)
    {
        years[i] = startYear + i;
        data[i] = 0;
    }
    
    //generate data array
    for(var i = 0; i < nodeArray.length; i++) //interate through each node
    {
        for(var j = 0; j < nodeArray[i].data.length; j++) //iterate through each data point
        {
            //add to data array 
            data[nodeArray[i].years[j] - startYear] += nodeArray[i].data[j];
        }
    }
    
    //find min & max
    for (var i = 0; i < data.length; i++)
    {
        if(data[i] < min)
        {
            min = data[i];
        }
        if(data[i] > max)
        {
            max = data[i];
        }
    }
        
    //set sumNode fields
    sumNode.name = name;
    sumNode.data = data;
    sumNode.years = years;
    sumNode.min = min;
    sumNode.max = max;
    
    return sumNode;
}

/*
 * Function: findMinStartYear
 *      Returns the minimum year from all t_graphStat nodes in nodeArray
 *
 * Parameters:
 *      - nodeArray - An array of t_graphStat nodes indexed from 0..nodeArray.length-1
 * 
 * Pre: 
 *      nodeArray contains objects of type t_graphStat indexed from 0..nodeArray.length-1
 *
 * Post:
 *      FCTVAL = minimum year value from all of the t_graphStat nodes in nodeArray
 * 
 * Authors:
 * John Matin
 *
 * Date Created:
 * 4/4/2016 by John Martin
 * 
 * Last Modified:
 * 4/8/2016 by John Martin
 */
function findMinStartYear(nodeArray)
{
    var startYear = Number.MAX_SAFE_INTEGER;
    
    for(var i = 0; i < nodeArray.length; i++)
    {
        if(nodeArray[i].years[0] < startYear) //start year of this node is less than the previous start year
        {
            startYear = nodeArray[i].years[0]; //first year in data series
        }
    }
    
    if(startYear == Number.MAX_SAFE_INTEGER)
    {
        startYear = undefined;
    }
    
    return startYear;
}

/*
 * Function: findMaxEndYear
 *      Returns the maximum year from all t_graphStat nodes in nodeArray
 *
 * Parameters:
 *      - nodeArray - An array of t_graphStat nodes indexed from 0..nodeArray.length-1
 * 
 * Pre: 
 *      nodeArray contains objects of type t_graphStat indexed from 0..nodeArray.length-1
 *
 * Post:
 *      FCTVAL = maximum year value from all of the t_graphStat nodes in nodeArray
 * 
 * Authors:
 * John Matin
 *
 * Date Created:
 * 4/4/2016 by John Martin
 * 
 * Last Modified:
 * 4/8/2016 by John Martin
 */
function findMaxEndYear(nodeArray)
{
    var endYear = Number.MIN_SAFE_INTEGER;
    
    for(var i = 0; i < nodeArray.length; i++)
    {
        if(nodeArray[i].years[nodeArray[i].years.length-1] > endYear) //end year of this node is greater than the previous end year
        {
            endYear = nodeArray[i].years[nodeArray[i].years.length-1]; //last year in data series
        }
    }
    
    if(endYear == Number.MIN_SAFE_INTEGER)
    {
        endYear = undefined;
    }
    
    return endYear;
}

/*
 * Function: findMaxValue
 *      Returns the maximum data value from all t_graphStat nodes in nodeArray
 *
 * Parameters:
 *      - nodeArray - An array of t_graphStat nodes indexed from 0..nodeArray.length-1
 * 
 * Pre: 
 *      nodeArray contains objects of type t_graphStat indexed from 0..nodeArray.length-1
 *
 * Post:
 *      FCTVAL = maximum data value from all of the t_graphStat nodes in nodeArray
 * 
 * Authors:
 * John Matin
 *
 * Date Created:
 * 4/4/2016 by John Martin
 * 
 * Last Modified:
 * 4/8/2016 by John Martin
 */
function findMaxValue(nodeArray)
{
    var curMax = Number.MIN_SAFE_INTEGER;
    
    for(var i = 0; i < nodeArray.length; i++)
    {
        if(nodeArray[i].max > curMax) //end year of this node is greater than the previous end year
        {
            curMax = nodeArray[i].max; //last year in data series
        }
    }
    
    if(curMax == Number.MIN_SAFE_INTEGER)
    {
        curMax = undefined;
    }
    
    return curMax;
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
