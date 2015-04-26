
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

// Author: Arun Kumar
// Date Created: 4/14/2015
// Last Modified: 4/23/2015 by Vanajam Soni
// Description: Creates switch case to determine which function to call
// PRE: The divs for the graphs exist, and correct data is stored in g_DataList,
//      g_GraphType and g_StatList 
// POST: Calls the appropriate graphing functions depending on the g_GraphType and 
//       whether the g_StatID selected is vaccination or not 
function GenerateGraphs()
{
	if(g_DataList != undefined && g_DataList.size != 0)
	{
    	var curr=g_DataList.start;    
	    if (g_StatList[g_StatID].indexOf("VACC") > -1)
	    {
	        if (g_GraphType != 2)
	        {
	            for(var i=1; i<=g_DataList.size; i++)
	            {
	                GraphVaccine("region-graphs-"+i, curr);
	                curr=curr.next;
	            }
	        }
	        else
	        {
	            var sumNode = GenerateSumNode();
	            GraphVaccine("region-graphs-"+1,sumNode);
	        }
	    }
	    else
	    {
	        switch(g_GraphType)
	        {
	            case 0:    
                        var max = FindMax();
	                for(var i=1; i<=g_DataList.size; i++)
	                {
	                    if(GraphRegional("region-graphs-"+i, curr, max) == -1)
                        {
                            var element = document.getElementById("region-graphs-"+i);
                            element.parentNode.removeChild(element);
                        }
	                    curr=curr.next;
	                }
	                break;
	            case 1:
	                GraphCombined("region-graphs-"+1);
	                break;
	            case 2:
	                var sumNode = GenerateSumNode();
	                GraphRegional("region-graphs-"+1, sumNode);
	                break;
	        }
	    }
	}
}

// Author: Arun Kumar, Berty Ruan, Vanajam Soni
// Date Created:4/2/2015
// Last Modified: 4/25/2015 By Berty Ruan
// Description: Takes stat data and divID to generate a graph for a single country and stat
// PRE: divID is a div in the graphing section, node is a valid t_AsdsNode containing data for a country or 
//      a sum of countries, and maxVal is the max is maximum value of the selected stat for the entire list
// POST: generates a single Google ComboChart for the given node on the divID
function GraphRegional(divID, node, maxVal) {
    var data = GenerateSingleData(node.data);
    var options = {
        title: node.name,
        seriesType: "line",
        legend: 'none',
        vAxis: {
            viewWindowMode:'explicit',
            viewWindow: {min: 0, max: maxVal}
        },
        hAxis: {title: 'Year', format: '####'},
        series: {1: {type: "area", color: "transparent"}, 2: {color: "navy"}, 3: {type: "area", color: "navy"}},
        isStacked: true,
        backgroundColor: '#EAE7C2',
        tooltip: {trigger: 'both'}
    };
    	
    if(data != null)
    {
        var formatter = new google.visualization.NumberFormat({pattern: '#,###.##'} );
        for(var i=1; i < data.getNumberOfColumns(); i++)
        {
            if(data != null)
                formatter.format(data, i);
        }

        // instantiate and draw chart using prepared data
        var chart = new google.visualization.ComboChart(document.getElementById(divID));
        chart.draw(data, options);
        return 0;
    }
    else
        return -1;
}

// Authors: Josh Crafts, Arun Kumar, Berty Ruan
// Date Created: 3/27/2015
// Last Modified: 4/25/2015 by Berty Ruan
// Description: Takes stat data from multiple countries and generates a graph
// using data from multiple countries combined
// PRE: divID is a div in the graphing section, GenerateCombinedData function is defined
// POST: generates a single Google LineChart on divID for all regions on g_DataList
function GraphCombined(divID) {
    var data = GenerateCombinedData();
    var options = {
        seriesType: "line",
        legend: {position: 'top'},
        vAxis: {
            viewWindowMode:'explicit',
            viewWindow: {min:0}
        },
        hAxis: {title: 'Year', format: '####'},
        backgroundColor: '#EAE7C2',
        tooltip: {trigger: 'both'}
    };
	
	var num = [];
	
	//console.log(num);
	var formatter = new google.visualization.NumberFormat({pattern: '#,###.##'});
	for(var i=1; i<data.getNumberOfColumns(); i++)
	{
		formatter.format(data, i);
	}
	
	
    // instantiate and draw chart using prepared data
    var chart = new google.visualization.LineChart(document.getElementById(divID));
    chart.draw(data, options);
}

// Author: Arun Kumar, Berty Ruan
// Date Created: 4/14/2015
// Last Modified: 4/25/2015 by Berty Ruan
// Description: Takes stat data from multiple countries and generates a graph for vaccinations
// creating bars with mass vaccinations and line graphs with periodic vaccinations
// PRE: divID is a div in the graphing section, node is a valid t_AsdsNode containing data for a country or 
//      a sum of countries, GenerateVaccineData function is defined
// POST: generates a single Google ComboChart for the given node's vaccination data on the divID 
//       SIA data is shown in bars, whereas MCV1 and MCV2 data is shown in lines.
function GraphVaccine(divID, node) {
    var data = GenerateVaccineData(node.data);
    var options = {
        title: node.name,
        vAxis: {
            viewWindowMode:'explicit',
            viewWindow: {
                min: 0,
                max: 1
            },
            format: '###%'
        },
        hAxis: {title: 'Year', format: '####'},
        backgroundColor: '#EAE7C2',
        seriesType: "bars",
        series: {
            0: {type: "line"}, 1: {type: "line"}
        },
        tooltip: {trigger: 'both'}
    };
	
	var formatter = new google.visualization.NumberFormat({pattern: '##.##%'});
    for(var i=1; i<data.getNumberOfColumns(); i++)
    {
        formatter.format(data,i);
    }
	
    var chart = new google.visualization.ComboChart(document.getElementById(divID));
    chart.draw(data, options);
}

// Author: Vanajam Soni, Berty Ruan
// Date Created: 4/16/2015
// Last Modified: 4/25/2015 by Berty Ruan
// Description: Checks for missing data and returns null, if data is missing.
// PRE: data is an integer or float, missing data is represented as -1
// POST: FCTVAL == data if data is not -1, null otherwise
function FixMissingData(data)
{
    if(data >= 0)
        return data;
    else
        return null;
}

// Author: Vanajam Soni, Joshua Crafts, Berty Ruan
// Date Created: 4/7/2015
// Last Modified: 4/25/2015 by Berty Ruan 
// Description: Prepares Data given for a single country (taken as argument) into data table, for the global statID, 
//              Also depends on graph type for bounded or unbounded data
// PRE: data is a 2d array, containing all data for one country, or a sum of countries,
//      g_ParsedStatList exists and contains valid data
// POST: FCTVAL == data table containing data from the year g_YearStart to g_YearEnd, for the given country's data
//       so that we can graph
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

        console.log(statIDNum);
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


// Author: Joshua Crafts
// Date Created: 3/27/2015
// Last Modified: 3/27/2015 by Joshua Crafts
// Description: Prepares data in terms of the data type needed by graphing api
// PRE: g_DataList > 0, 
//      g_ParsedStatList exists and contains valid data.
// POST: FCTVAL == data table containing data from the year g_YearStart to g_YearEnd, for all countries on the 
//       g_DataList, so that we can graph all data on one graph
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

// Author: Vanajam Soni
// Date Created: 4/7/2015
// Last Modified: 4/13/2015 by Vanajam Soni
// Description: Generates an ASDS node with all data summed over selected regions
// PRE: g_DataList.size > 0, 
//      g_ParsedStatList, g_YearEnd and g_FirstYear exist and contain correct data
// POST: FCTVAL == t_AsdsNode with cid = -1, cc2 = "SUM", 
//       name = comma separated names of all countries in g_DataList,
//       data = sum of all data of the countries in g_DataList
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
    
    var newNode = new t_AsdsNode(-1, "SUM", names, data);

    return newNode;
}


// Author: Vanajam Soni, Berty Ruan
// Date Created: 4/7/2015
// Last Modified: 4/25/2015 by Berty Ruan
// Description: Prepares data for vaccination stats, for a given country
//              Takes data of the country as input.
// PRE: data is a 2d array, containing all data for one country, or a sum of countries,
//      g_ParsedStatList exists
// POST: FCTVAL == data table containing vaccination data from the year g_YearStart to g_YearEnd, in the right format
//       so that we can graph it. 
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

// Author: Joshua Crafts
// Date Created: 4/7/2015
// Last Modified: 4/13/2015 by Vanajam Soni
// Description: Finds and returns maximum value of a stat for the entire list
// PRE: g_DataList.size > 0, 
//      g_ParsedStatList, g_YearFirst, g_FirstYear and g_YearEnd exist and contain correct data
// POST: FCTVAL == maximum value of the selected stat for the entire list
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

