
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

// File Name: graph.js
// Description: This file generates graphs based on parsed data
// Date Created: 3/17/2015
// Contributors: Nicholas Dyszel, Berty Ruan, Arun Kumar, Paul Jang, Vanajam Soni
// Date Last Modified: 4/23/2015
// Last Modified By: Vanajam Soni
// Dependencies: client_parser.js, ..., [Google Charts API]
// Additional Notes: N/A

/*
 * Function: GenerateGraphs
 * Creates switch case to determine which function to call
 *
 * Pre: 
 * The divs for the graphs exist, and correct data is stored in g_DataList, g_GraphType and g_StatList 
 *
 * Post: 
 * Calls the appropriate graphing functions depending on the g_GraphType and whether the g_StatID selected is vaccination or not. FCTVAL == number of graphs generated, or -1 for failure.
 *
 * Authors: 
 * Arun Kumar
 *
 * Date Created: 
 * 4/14/2015
 *
 * Last Modified: 
 * 10/8/2015 by Nicholas Denaro
 */
function GenerateGraphs()
{
	if(g_DataList != undefined && g_DataList.size != 0)
	{
    	var curr=g_DataList.start;    
	    if (g_StatList[g_StatID].indexOf("VACC") > -1)
	    {
	        if (g_GraphType != g_GraphTypeEnum.SUM)
	        {
	            for(var i=1; i<=g_DataList.size; i++)
	            {
	                Graph(g_GraphTypeEnum.VACCINE, "region-graphs-"+i, curr);
	                curr=curr.next;
	            }
                return(g_DataList.size);
	        }
	        else
	        {
	            var sumNode = GenerateSumNode();
	            Graph(g_GraphTypeEnum.VACCINE, "region-graphs-"+1,sumNode);
                return(1);
	        }
	    }
	    else
	    {
	        switch(g_GraphType)
	        {
	            case g_GraphTypeEnum.REGIONAL:    
			        var max = FindMax();
			        for(var i=1; i<=g_DataList.size; i++)
			        {
			            if(Graph(g_GraphTypeEnum.REGIONAL, "region-graphs-"+i, curr, max) === -1 )
			            {
			                var element = document.getElementById("region-graphs-"+i);
			                element.parentNode.removeChild(element);
			            }
			            curr=curr.next;
			        }
			        return(g_DataList.size);
			    case g_GraphTypeEnum.COMBINED:
			    
			        if ( Graph(g_GraphTypeEnum.COMBINED, "region-graphs-"+1) === -1 )
			        {
			        	var element = document.getElementById("region-graphs-"+i);
			            element.parentNode.removeChild(element);
			            return 0;
			        }
			        return(1);
			    case g_GraphTypeEnum.SUM:
			        var sumNode = GenerateSumNode();
			        Graph( g_GraphTypeEnum.SUM, "region-graphs-"+1, sumNode);
			        return(1);
	        }
	    }
	}
    return(-1);
}


/*
 *  Function: Graph
 *  
 *  This function is called from GenerateGraphs once the type of the graph is determined
 *
 *  Parameters:
 *      graphType - the type of the graph as denoted by g_GraphTypeEnum
 * 		divID - the id of the div to put the graph in
 * 		node - the node containing the data to be charted
 *
 *  Pre:
 *      g_GraphTypeEnum is defined with the states SUM, REGIONAL, COMBINED, and VACCINE
 * 		Options class is defined
 * 		google charting package is included
 *
 *  Post:
 *		The graph of type graphType is output to the div of id divID with the data from node 
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
function Graph( graphType, divID, node )
{
	//Define variables that will be set based on graph type
    var nodes;
	var data;
    var dataArray; 
	var nodeName;
	var max;
	var formatter;
	var options;    
    
    nodes = GenerateGraphStatNodes(node.cid)
    dataArray = GenerateDataArray(nodes, g_YearStart, g_YearEnd);
    data = google.visualization.arrayToDataTable(dataArray, false);
    
	
	switch( graphType )
	{
		case g_GraphTypeEnum.SUM:
		case g_GraphTypeEnum.REGIONAL:
    		
    		//data = GenerateSingleData( node.data );
    		max = findMaxValue(nodes);
    		nodeName = node.name;  
    		formatter = new google.visualization.NumberFormat({pattern: '#,###.##'} ); 
			break;
		
	    case g_GraphTypeEnum.COMBINED:
	    
			//data = GenerateCombinedData();
			nodeName = null;
			max = null;
	    	formatter = new google.visualization.NumberFormat( {pattern: '#,###.##'} );
			break;
	    
	    case g_GraphTypeEnum.VACCINE:
	    
	    	//data = GenerateVaccineData( node.data );
	    	nodeName = node.name;
	    	max = null;
	    	formatter = new google.visualization.NumberFormat( {pattern: '##.##%'} );
			break;
			
		default:
			break;
	}
	
	if( data != null && (options = new Options( graphType, nodeName, max )) )
	{
			
		for( var i = 1; i < data.getNumberOfColumns(); i++ )
        {
        	formatter.format( data, i );
        }

        // instantiate and draw chart using prepared data
        var chart = new google.visualization.ComboChart( document.getElementById( divID ) );
        chart.draw( data, options );
        return 0;
	
	}
	else //error has occured and we have null data
		return -1;
	
	
	
}
 
/*
 * Function: FixMissingData
 * Checks for missing data and returns null, if data is missing.
 *
 * Parameters: 
 *     data - a number
 * Pre: 
 * data is an integer or float, missing data is represented as -1
 *
 * Post: 
 * FCTVAL == data if data is not -1, null otherwise
 *
 * Authors: 
 * Vanajam Soni, Berty Ruan
 *
 * Date Created: 
 * 4/16/2015
 *
 * Last Modified: 
 * 4/25/2015 by Berty Ruan
 */
function FixMissingData(data)
{
    if(data >= 0)
        return data;
    else
        return null;
}

/*
 * Function: GenerateSingleData
 * Prepares Data given for a single country (taken as argument) into data table, for the global statID, Also depends on graph type for bounded or unbounded data
 *
 * Parameters: 
 *     data - 
 *
 * Pre: 
 * data is a 2d array, containing all data for one country, or a sum of countries, g_ParsedStatList exists and contains valid data
 *
 * Post: 
 * FCTVAL == data table containing data from the year g_YearStart to g_YearEnd, for the given country's data so that we can graph
 *
 * Authors: 
 * Vanajam Soni, Joshua Crafts, Berty Ruan
 *
 * Date Created: 
 * 4/7/2015
 *
 * Last Modified: 
 * 4/25/2015 by Berty Ruan 
 */
function GenerateSingleData(data)
{
    // type = 0 => unbounded or only has 1 bound
    // type = 1 => both bounds exist
    var type = 0;
    var dataAvailable = 0;
    var dataTable = new google.visualization.DataTable(); // data table to be returned
    
    dataTable.addColumn('number','year');
    dataTable.addColumn('number', g_StatList[g_StatID]);

    // get the bound stats from parsed stat list
    var lowerBoundID = -1;
    var upperBoundID = -1;

    for(i=0;i<g_ParsedStatList[1].length;i++)
    {
        if(g_StatID == g_ParsedStatList[1][i])
        {
            lowerBoundID = g_ParsedStatList[2][i];
            upperBoundID = g_ParsedStatList[3][i];   
        }
    }

    // if both bounds exist, add columns for those
    if(lowerBoundID != -1 && upperBoundID != -1)
    {
        dataTable.addColumn('number', 'lower bound space'); // area under lower bound
        dataTable.addColumn('number', 'lower bound of confidence interval'); // additional line to outline confidence interval
        dataTable.addColumn('number', 'size of confidence interval'); // area between upper bound and lower bound
        dataTable.addColumn('number', 'upper bound of confidence interval'); // additional line to generate accurate upper bound tooltip, ow it would show size of confidence interval
        type = 1;
    }    

    // add data to table from start year to end year
    for(i=(g_YearStart-g_FirstYear);i<(g_YearEnd-g_FirstYear)+1;i++)
    {   

        //format numbers 
        var statIDNum = FixMissingData(Number(data[g_StatID][i])); // FixMissingData(parseFloat((data[g_StatID][i]).toString));//FixMissingData(parseFloat(Math.ceil())); //null or int

        
        switch(type) 
        {
            case 0: // unbounded
                if(dataAvailable == 0 && statIDNum != null)
                {
                    dataAvailable = 1;
                }
                dataTable.addRow([g_FirstYear+i, statIDNum]);
                break;

            case 1: // bounded
                var lowerBoundNum = FixMissingData(Number(data[lowerBoundID][i]));
                
                if(dataAvailable == 0 && statIDNum != null)
                {
                    dataAvailable = 1;
                }
                if (lowerBoundNum == null) // replace -1 with 0 when subtracting lower from upper for size of confidence interval
                {
                    var lower = 0;
                }
                else
                {
                    lower = lowerBoundNum;
                }

                dataTable.addRow([g_FirstYear+i,statIDNum,lowerBoundNum,lowerBoundNum,
                    FixMissingData(Number(data[upperBoundID][i])-lower),FixMissingData(Number(data[upperBoundID][i]))]);
                break;
        }
    }

    if(dataAvailable == 1)
        return dataTable;
    else 
        return null;
}

/*
 * Function: GenerateCombinedData
 * Prepares data in terms of the data type needed by graphing api
 *
 * Pre: 
 * g_DataList > 0, g_ParsedStatList exists and contains valid data.
 *
 * Post: 
 * FCTVAL == data table containing data from the year g_YearStart to g_YearEnd, for all countries on the g_DataList, so that we can graph all data on one graph
 *
 * Authors: 
 * Joshua Crafts
 *
 * Date Created: 
 * 3/27/2015
 *
 * Last Modified: 
 * 3/27/2015 by Joshua Crafts
 */
function GenerateCombinedData()
{
    // create array with indices for all years plus a header row
    var currentNode;
    var i, j;
    var dataTable = new google.visualization.DataTable();
    var type = 0;
    
    dataTable.addColumn('number','Year');
    
    currentNode = g_DataList.start;
    for (i = 0; i < g_DataList.size; i++)
    {
        dataTable.addColumn('number', currentNode.name);
        currentNode = currentNode.next;
    }

    for(i=0;i<g_ParsedStatList[1].length;i++)
    {
        if(g_StatID == g_ParsedStatList[1][i] && (g_ParsedStatList[2][i] != -1 || g_ParsedStatList[2][i] != -1))
        {
            type = 1;  
        }
    } 

    // filling the data table, iterate through each node, then through each year
    for(i=(g_YearStart-g_FirstYear);i<(g_YearEnd-g_FirstYear)+1;i++)
    {   
        var row = new Array(g_DataList.size + 1);
        row[0] = g_FirstYear+i;
        currentNode = g_DataList.start;
        for (j = 0; j < g_DataList.size; j++)
        {
            row[j+1] = FixMissingData(Number(currentNode.data[g_StatID][i]));
            currentNode = currentNode.next;
        }
        dataTable.addRow(row);
    }
    return dataTable;
}

/*
 * Function: GenerateSumNode
 * Generates an ASDS node with all data summed over selected regions
 *
 * Pre: 
 * g_DataList.size > 0, g_ParsedStatList, g_YearEnd and g_FirstYear exist and contain correct data
 *
 * Post: 
 * FCTVAL == t_AsdsNode with cid = -1, cc2 = "SUM", name = comma separated names of all countries in g_DataList, data = sum of all data of the countries in g_DataList
 *
 * Authors: 
 * Vanajam Soni
 *
 * Date Created: 
 * 4/7/2015
 *
 * Last Modified: 
 * 4/13/2015 by Vanajam Soni
 */
function GenerateSumNode(){
    
    var data = new Array(g_StatList.length);	// data for the new node
    var names = "";				// list of names of regions included
    var i,j;
    var currentNode = g_DataList.start;		// list iterator
    
    // get the associated stats from parsed stat list
    var ass1ID = -1;
    var ass2ID = -1;

    for(i=0;i<g_ParsedStatList[1].length;i++)
    {
        if(g_StatID == g_ParsedStatList[1][i])
        {
            ass1ID = g_ParsedStatList[2][i];
            ass2ID = g_ParsedStatList[3][i];   
        }
    }
    // create arrays for necessary data 
    data[g_StatID] = new Array((g_YearEnd-g_FirstYear)+1);
    if (ass1ID > -1)
        data[ass1ID] = new Array((g_YearEnd-g_FirstYear)+1);
    if (ass2ID > -1)
        data[ass2ID] = new Array((g_YearEnd-g_FirstYear)+1);

    // initialize arrays to 0
    for (j = 0; j < (g_YearEnd-g_FirstYear)+1; j++)
    {
        data[g_StatID][j] = -1;
        if (ass1ID > -1)
            data[ass1ID][j] = -1;
        if (ass2ID > -1)
            data[ass2ID][j] = -1;
    }

    // add and store data for whole list
    for (i = 0; i < g_DataList.size; i++)
    {
        for (j = g_YearStart-g_FirstYear; j < (g_YearEnd-g_FirstYear)+1; j++)
        {
            if (Number(currentNode.data[g_StatID][j]) > 0)
            {
                if (data[g_StatID][j] == -1 && Number(currentNode.data[g_StatID][j]) != -1)
                    data[g_StatID][j] = Number(currentNode.data[g_StatID][j]);
                else if (Number(currentNode.data[g_StatID][j]) != -1)
                    data[g_StatID][j] += Number(currentNode.data[g_StatID][j]);
            }
            if (ass1ID > -1 && Number(currentNode.data[ass1ID][j]) > 0)
            {
                if (data[ass1ID][j] == -1 && Number(currentNode.data[ass1ID][j]) != -1)
                    data[ass1ID][j] = Number(currentNode.data[ass1ID][j]);
                else if (Number(currentNode.data[ass1ID][j]) != -1)
                    data[ass1ID][j] += Number(currentNode.data[ass1ID][j]);
            }
            if (ass2ID > -1 && Number(currentNode.data[ass2ID][j]) > 0)
            {
                if (data[ass2ID][j] == -1 && Number(currentNode.data[ass2ID][j]) != -1)
                    data[ass2ID][j] = Number(currentNode.data[ass2ID][j]);
                else if (Number(currentNode.data[ass2ID][j]) != -1)
                    data[ass2ID][j] += Number(currentNode.data[ass2ID][j]);
            }
        }
        names += currentNode.name; // add name of current node to list of names
        if (currentNode != g_DataList.end)
            names += "; ";
        currentNode = currentNode.next;
    }
    // divide by size of list to maintain percentages if vaccines
    if (g_StatList[g_StatID].indexOf("VACC") > -1)
    {
        for (j = g_YearStart-g_FirstYear; j < (g_YearEnd-g_FirstYear)+1; j++)
        {
            data[g_StatID][j] = data[g_StatID][j] / g_DataList.size;
            data[ass1ID][j] = data[ass1ID][j] / g_DataList.size;
            data[ass2ID][j] = data[ass2ID][j] / g_DataList.size;
        }
    }
    
    var newNode = new t_AsdsNode(getSession(), getInstance(), -1, "SUM", names, data);

    return newNode;
}

/*
 * Function: GenerateVaccineData
 * Prepares data for vaccination stats, for a given country. Takes data of the country as input.
 *
 * Parameters: 
 *     data -
 *
 * Pre: 
 * data is a 2d array, containing all data for one country, or a sum of countries, g_ParsedStatList exists
 *
 * Post: 
 * FCTVAL == data table containing vaccination data from the year g_YearStart to g_YearEnd, in the right format so that we can graph it. 
 *
 * Authors: 
 * Vanajam Soni, Berty Ruan
 *
 * Date Created: 
 * 4/7/2015
 *
 * Last Modified: 
 * 4/25/2015 by Berty Ruan
 */
function GenerateVaccineData(data)
{
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('number','year');
    dataTable.addColumn('number', 'MCV1');
    dataTable.addColumn('number', 'MCV2');
    dataTable.addColumn('number', 'SIA');
    
    var mcv1ID, mcv2ID,siaID;

    // get associated stat ids
    siaID = g_StatID;

    for(i=0;i<g_ParsedStatList[1].length;i++)
    {
        if(g_StatID == g_ParsedStatList[1][i])
        {
            mcv1ID = g_ParsedStatList[2][i];
            mcv2ID = g_ParsedStatList[3][i];   
        }
    }

    // add data to table
    var i;
    var firstNum, secondNum, thirdNum;
    for(i=g_YearStart-g_FirstYear;i<(g_YearEnd-g_FirstYear)+1;i++)
    {
        firstNum  = parseFloat((data[mcv1ID][i]  * 1).toFixed(4));
        secondNum = parseFloat((data[mcv2ID][i] * 1).toFixed(4));
        thirdNum  = parseFloat((data[siaID][i]  * 1).toFixed(4));

        dataTable.addRow([1980+i, firstNum, secondNum, thirdNum]);
    }
    
    return dataTable;   
}

/*
 * Function: FindMax
 * Finds and returns maximum value of a stat for the entire list
 *
 * Pre: 
 * g_DataList.size > 0, g_ParsedStatList, g_YearFirst, g_FirstYear and g_YearEnd exist and contain correct data
 *
 * Post: 
 * FCTVAL == maximum value of the selected stat for the entire list
 *
 * Authors: 
 * Joshua Crafts
 *
 * Date Created: 
 * 4/7/2015
 *
 * Last Modified: 
 * 4/13/2015 by Vanajam Soni
 */
function FindMax()
{
    var max = Number.MIN_VALUE;
    var currentNode = g_DataList.start;
    
    var assID, ass2ID;

    // get associated stat ids
    for(i=0;i<g_ParsedStatList[1].length;i++)
    {
        if(g_StatID == g_ParsedStatList[1][i])
        {
            ass1ID = g_ParsedStatList[2][i];
            ass2ID = g_ParsedStatList[3][i];   
        }
    }

    // find max value of needed data set
    for (i = 0; i < g_DataList.size; i++)
    {
        for (j = g_YearStart-g_FirstYear; j < (g_YearEnd-g_FirstYear) + 1;j++)
        {
            if (Number(currentNode.data[g_StatID][j]) > max)
                max = Number(currentNode.data[g_StatID][j]);
            if (ass1ID != -1 && Number(currentNode.data[ass1ID][j]) > max)
                max = Number(currentNode.data[ass1ID][j]);
            if (ass2ID != -1 && Number(currentNode.data[ass2ID][j]) > max)
                max = Number(currentNode.data[ass2ID][j]);
        }
        currentNode = currentNode.next;
    }
    
    if (max < 0 || max == NaN || max === undefined || max == Number.MIN_VALUE)
        max = 10;

    return max;   
}

/*
 *  Class: Options
 *      A class to streamline the creation of the options for charting
 *
 *  Parameters:
 *      graphType - the type of the graph as denoted by g_GraphTypeEnum
 *      nodeName - the name to apply to the title of the chart, typically the names of the region(s)
 *      maxVal - the max value of the charts y axis
 *
 *  Members:
 *      https://developers.google.com/chart/interactive/docs/customizing_charts
 *      - This link and the subsequent links under the "Advanced Usage" section define all of the fields the options can hold and what values they may take.
 *
 */
function Options( graphType, nodeName, maxVal )
{
    //Set all of the common properties here
    this.vAxis = {};
    this.vAxis.viewWindow = {};
    this.vAxis.viewWindow.min = 0;
    this.vAxis.viewWindowMode = 'explicit';
    this.hAxis = {};
    this.hAxis.title = 'Year';
    this.hAxis.format = '####';
    this.backgroundColor = '#EAE7C2';
    this.tooltip = {trigger: 'both'};
    
    switch( graphType )
    {
        case g_GraphTypeEnum.SUM:
        case g_GraphTypeEnum.REGIONAL:
            
            this.title = nodeName;
            this.seriesType = "line";
            this.legend = "none";
            this.isStacked = true;
            this.series = { 1: {type: "area", color: "transparent"}, 
                            2: {color: "navy"}, 
                            3: {type: "area", color: "navy"}};
            this.vAxis.viewWindow.max = maxVal;
            break;
            
        case g_GraphTypeEnum.COMBINED:
            
            this.seriesType = "line";
            this.legend = {position: 'top'};
            break;

        case g_GraphTypeEnum.VACCINE:
        
            this.title = nodeName;
            this.seriesType = "bar";
            this.vAxis.viewWindow.max = 1;
            this.vAxis.format = '###%';
            break;  
        
        default://if graph type is not listed, then something is wrong..return null
            return null;    
    }
    
    return this;
}


/*
 * Function: GenerateDataArray
 * Generates a data array usable by the Google Charts API from an array of t_graphStat nodes
 *
 * Parameters:
 * nodeArray - An array of t_graphStat nodes that will be used to create a data array for Google Charts
 *
 * Pre: 
 * nodeArray is an array of t_graphStat nodes
 *
 * Post:
 * FCTVAL = data array containing   data[0] = ["Years"][Name from nodeArray[0]][Name from nodeArray[1]]..[Name from nodeArray[nodeArray.length-1]]
 *                                  data[1] = [Year1][Value for Year1 from nodeArray[0]][Value for Year1 from nodeArray[1]]..[Value for Year1 from nodeArray[nodeArray.length-1]]
 *                                  ...
 *                                  data[numYears] = [LastYear][Value for LastYear from nodeArray[0]][Value for LastYear from nodeArray[1]]..[Value for LastYear from nodeArray[nodeArray.length-1]]
 *
 * Authors:
 * John Matin
 *
 * Date Created:
 * 3/1/2016 by John Martin
 * 
 * Last Modified:
 * 4/8/2016 by John Martin
 */
function GenerateDataArray(nodeArray, startYear, endYear)
{
    var data = [];
    
    if(typeof startYear == 'undefined')
    {
        startYear = findMinStartYear(nodeArray);
    }
    
    if(typeof endYear == 'undefined')
    {
        endYear = findMaxEndYear(nodeArray);
    }
    
    //populate Years
    data[0] = [];
    data[0][0] = "Year";
    for(var i = startYear; i <= endYear; i++)
    {
        data[(i-startYear)+1] = [];
        data[(i-startYear)+1][0] = i;
    }
    
    //fill in data
    for(var i = 0; i < nodeArray.length; i++)
    {
        data[0][i+1] = nodeArray[i].name;
        var firstYear = nodeArray[i].years[0];
        var lastYear = nodeArray[i].years[nodeArray[i].years.length-1];
        var curIndex = 0;
        for(var j = startYear; j <= endYear; j++)
        {
            if(j - firstYear < 0 || j - lastYear > 0) //data point doesn't exist in data[] for this node
            {
                data[curIndex][i+1] = null;
            }
            else //data point exists in data[] for this node
            {
                var dataArr = nodeArray[i].data;
                data[curIndex+1][i+1] = dataArr[curIndex];
            }
            curIndex++;
        }
    }
    
    return data;
}