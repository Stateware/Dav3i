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
	var sumNode,
            max,
            element,
            cur,
            i;

	if(g_DataList !== undefined && g_DataList.size !== 0)
	{
            cur = g_DataList.start;
            if (g_Stats[g_StatId]['type'] !== 'int')
            {
	        switch(g_GraphType)
	        {
	            case 0:    
                        max = FindMax();
	                for(i=1; i<=g_DataList.size; i++)
	                {
	                    if(GraphRegional("region-graphs-"+i, cur, max) === -1)
                            {
                                element = document.getElementById("region-graphs-"+i);
                                element.parentNode.removeChild(element);
                            }
	                    cur=cur.next;
	                }
	                break;
	            case 1:
	                GraphCombined("region-graphs-"+1);
	                break;
	            case 2:
	                sumNode = GenerateSumNode();
	                GraphRegional("region-graphs-"+1, sumNode);
	                break;
	        }
            }
            else
            {
	        switch(g_GraphType)
	        {
	            case 0:    
                        max = FindMax();
	                for(i=1; i<=g_DataList.size; i++)
	                {
	                    if(GraphIntegrated("region-graphs-"+i, cur, max) === -1)
                            {
                                element = document.getElementById("region-graphs-"+i);
                                element.parentNode.removeChild(element);
                            }
	                    cur=cur.next;
	                }
	                break;
	            case 1:
	                for(i=1; i<=g_DataList.size; i++)
	                {
	                    if(GraphIntegrated("region-graphs-"+i, cur, max) === -1)
                            {
                                element = document.getElementById("region-graphs-"+i);
                                element.parentNode.removeChild(element);
                            }
	                    cur=cur.next;
	                }
	                break;
	            case 2:
	                sumNode = GenerateSumNode();
	                GraphIntegrated("region-graphs-"+1, sumNode);
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
    var data = GenerateSingleData(node['data'][g_StatId]['data']),
        options = {
            title: node.name,
            seriesType: "line",
            legend: 'none',
            vAxis: {
                viewWindowMode:'explicit',
                viewWindow: {min: 0, max: maxVal}
            },
            hAxis: {title: 'Year', format: '####'},
            series: {0: {color: "white" }, 1: {type: "area", color: "transparent"}, 2: {color: "navy"}, 3: {type: "area", color: "navy"}},
            isStacked: true,
            backgroundColor: '#EAE7C2',
            tooltip: {trigger: 'both'}
        },
    formatter,
    chart,
    i;

    if (g_Stats[g_StatId]['type'] !== 'est')
    {
        options['series'][0]['color'] = "navy";
    }
    	
    if(data !== null)
    {
        formatter = new google.visualization.NumberFormat({pattern: '#,###.##'} );
        for(i=1; i < data.getNumberOfColumns(); i++)
        {
            if(data !== null)
            {
                formatter.format(data, i);
            }
        }

        // instantiate and draw chart using prepared data
        chart = new google.visualization.ComboChart(document.getElementById(divID));
        chart.draw(data, options);
        return 0;
    }
    else
    {
        return -1;
    }
}

// Authors: Josh Crafts, Arun Kumar, Berty Ruan
// Date Created: 3/27/2015
// Last Modified: 4/25/2015 by Berty Ruan
// Description: Takes stat data from multiple countries and generates a graph
// using data from multiple countries combined
// PRE: divID is a div in the graphing section, GenerateCombinedData function is defined
// POST: generates a single Google LineChart on divID for all regions on g_DataList
function GraphCombined(divID) {
    var data = GenerateCombinedData(),
        options = {
        seriesType: "line",
        legend: {position: 'top'},
        vAxis: {
            viewWindowMode:'explicit',
            viewWindow: {min:0}
        },
        hAxis: {title: 'Year', format: '####'},
        backgroundColor: '#EAE7C2',
        tooltip: {trigger: 'both'}
    },
    num,
    formatter,
    chart,
    i;
	
    num = [];
	
    //console.log(num);
    formatter = new google.visualization.NumberFormat({pattern: '#,###.##'});
    for(i=1; i<data.getNumberOfColumns(); i++)
    {
        formatter.format(data, i);
    }
	
	
    // instantiate and draw chart using prepared data
    chart = new google.visualization.LineChart(document.getElementById(divID));
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
function GraphIntegrated(divID, node, maxVal) {
    var data = GenerateSingleData(node['data'][g_StatId]['data']),
        dataSeries = {0: {type: "bar"}, 1: {type: "bar"}, 2: {type: "bar"}},
        options = {
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
            tooltip: {trigger: 'both'}
        },
        formatter,
        chart,
        i;

    if (maxVal > 1)
    {
        options['vAxis']['viewWindow']['max'] = maxVal;
    }

    for (i = 0; i < g_Stats[g_StatId]['subType'].length; i++)
    {
        if (g_Stats[g_StatId]['subType'][i] === 'lin')
        {
             dataSeries[i]['type'] = 'line'; 
        }
    }

    options['series'] = dataSeries;
	
    formatter = new google.visualization.NumberFormat({pattern: '##.##%'});
    for(i=1; i<data.getNumberOfColumns(); i++)
    {
        formatter.format(data,i);
    }
	
    chart = new google.visualization.ComboChart(document.getElementById(divID));
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
    if(data != -1)
    {
        return data;
    }
    else
    {
        return null;
    }
}

function GetYears(values)
{
    var years = [],
        re = new RegExp("y_(\\d+)");

    for (i in values)
    {
        if (i !== 'country_id' && i !== 'data_set_index')
        {
            year = re.exec(i);
            years.push(Number(year[1]));
        }
    }

    return years;
}

function GetValues(values)
{
    var row = [];

    for (i in values)
    {
        if (i !== 'country_id' && i !== 'data_set_index')
        {
            row.push(FixMissingData(Number(values[i])));
        }
    }

    return row;
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
    var dataTable = new google.visualization.DataTable(),
        i,
        temp = new Array(4);

    if (g_Stats[g_StatId]['type'] === 'est')
    {
        temp[0] = GetYears(data[g_SelectedIndex]['values'][0]);
        temp[1] = GetValues(data[g_SelectedIndex]['values'][0]);
        temp[2] = GetValues(data[g_SelectedIndex]['values'][1]);
        temp[3] = GetValues(data[g_SelectedIndex]['values'][2]);
        dataTable.addColumn('number','year');
        dataTable.addColumn('number', g_Stats[g_StatId]['subName'][1]);
        dataTable.addColumn('number', 'lower bound space'); // area under lower bound
        dataTable.addColumn('number', g_Stats[g_StatId]['subName'][2]); // additional line to outline confidence interval
        dataTable.addColumn('number', 'size of confidence interval'); // area between upper bound and lower bound
        dataTable.addColumn('number', g_Stats[g_StatId]['subName'][0]); // additional line to generate accurate upper bound tooltip, ow it would show size of confidence interval
        for (i = 0; i < temp[0].length; i++)
        {
            dataTable.addRow([temp[0][i],temp[2][i],temp[3][i],
                    temp[3][i],temp[1][i] - temp[3][i], temp[1][i]]);
        }
        
    }
    else if (g_Stats[g_StatId]['type'] === 'int')
    {
        temp[0] = GetYears(data[g_SelectedIndex]['values'][0]['values']);
        temp[1] = GetValues(data[g_SelectedIndex]['values'][0]['values']);
        temp[2] = GetValues(data[g_SelectedIndex]['values'][1]['values']);
        temp[3] = GetValues(data[g_SelectedIndex]['values'][2]['values']);
        dataTable.addColumn('number','year');
        dataTable.addColumn('number', g_Stats[g_StatId]['subName'][0]);
        dataTable.addColumn('number', g_Stats[g_StatId]['subName'][1]);
        dataTable.addColumn('number', g_Stats[g_StatId]['subName'][2]);
        for (i = 0; i < temp[0].length; i++)
        {
            dataTable.addRow([temp[0][i],temp[1][i],temp[2][i],temp[3][i]]);
        }
    }
    else
    {
        dataTable.addColumn('number','year');
        dataTable.addColumn('number', g_Stats[g_StatId]['name']);
        temp[0] = GetYears(data[g_SelectedIndex]['values']);
        temp[1] = GetValues(data[g_SelectedIndex]['values']);
        for (i = 0; i < temp[0].length; i++)
        {
            dataTable.addRow([temp[0][i],temp[1][i]]);
        }
    }

    return dataTable;
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
    var dataTable = new google.visualization.DataTable(),
        i, j,
        cur,
        temp = new Array(g_DataList.size + 1),
        row;

    dataTable.addColumn('number','year');
    cur = g_DataList.start;
    for (i = 0; i < g_DataList.size; i++)
    {
        dataTable.addColumn('number', cur.name);
        cur = cur.next;
    }

    cur = g_DataList.start;
    if (g_Stats[g_StatId]['type'] === 'est')
    {
        temp[0] = GetYears(cur['data'][g_StatId]['data'][g_SelectedIndex]['values'][1]);
        for (i = 0; i < g_DataList.size; i++)
        {
            temp[i + 1] = GetValues(cur['data'][g_StatId]['data'][g_SelectedIndex]['values'][1]);
            cur = cur.next;
        }
    }
    else
    {
        temp[0] = GetYears(cur['data'][g_StatId]['data'][g_SelectedIndex]['values']);
        for (i = 0; i < g_DataList.size; i++)
        {
            temp[i + 1] = GetValues(cur['data'][g_StatId]['data'][g_SelectedIndex]['values']);
            cur = cur.next;
        }
    }

    for (i = 0; i < temp[0].length; i++)
    {
        row = [];
        for (j = 0; j < temp.length; j++)
        {
            row.push(temp[j][i]);
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
function GenerateSumNode()
{
    var clone,
        data,
        cur,
        i, j,
        name = "",
        temp;

    cur = g_DataList.start;
    // MUST clone initial object or you will modify country's data when summing
    clone = jQuery.extend(true, {}, g_Data[cur.cc2]);
    data = clone[g_StatId]['data'];
    name += cur.name;
    cur = cur.next;
    for (i = 1; i < g_DataList.size; i++)
    {
        name += ", " + cur.name;
        if (g_Stats[g_StatId]['type'] === 'est')
        {
            for (j = g_Data[cur.cc2][g_StatId]['firstYear']; j <= g_Data[cur.cc2][g_StatId]['lastYear']; j++)
            {
		data[g_SelectedIndex]['values'][0]['y_' + j] = Number(data[g_SelectedIndex]['values'][0]['y_' + j]);
                if (Number(g_Data[cur.cc2][g_StatId]['data'][g_SelectedIndex]['values'][0]['y_' + j]) != -1)
                {
                    data[g_SelectedIndex]['values'][0]['y_' + j] += Number(g_Data[cur.cc2][g_StatId]['data'][g_SelectedIndex]['values'][0]['y_' + j]);
                }
		data[g_SelectedIndex]['values'][1]['y_' + j] = Number(data[g_SelectedIndex]['values'][1]['y_' + j]);
                if (Number(g_Data[cur.cc2][g_StatId]['data'][g_SelectedIndex]['values'][1]['y_' + j]) != -1)
                {
                    data[g_SelectedIndex]['values'][1]['y_' + j] += Number(g_Data[cur.cc2][g_StatId]['data'][g_SelectedIndex]['values'][1]['y_' + j]);
                }
		data[g_SelectedIndex]['values'][2]['y_' + j] = Number(data[g_SelectedIndex]['values'][2]['y_' + j]);
                if (Number(g_Data[cur.cc2][g_StatId]['data'][g_SelectedIndex]['values'][2]['y_' + j]) != -1)
                {
                    data[g_SelectedIndex]['values'][2]['y_' + j] += Number(g_Data[cur.cc2][g_StatId]['data'][g_SelectedIndex]['values'][2]['y_' + j]);
                }
            }
        }
        else if (g_Stats[g_StatId]['type'] === 'int')
        {
            for (j = g_Data[cur.cc2][g_StatId]['firstYear']; j <= g_Data[cur.cc2][g_StatId]['lastYear']; j++)
            {
		data[g_SelectedIndex]['values'][0]['values']['y_' + j] = Number(data[g_SelectedIndex]['values'][0]['values']['y_' + j]);
                if (Number(g_Data[cur.cc2][g_StatId]['data'][g_SelectedIndex]['values'][0]['values']['y_' + j]) != -1)
                {
                    data[g_SelectedIndex]['values'][0]['values']['y_' + j] += Number(g_Data[cur.cc2][g_StatId]['data'][g_SelectedIndex]['values'][0]['values']['y_' + j]);
                }
		data[g_SelectedIndex]['values'][1]['values']['y_' + j] = Number(data[g_SelectedIndex]['values'][1]['values']['y_' + j]);
                if (Number(g_Data[cur.cc2][g_StatId]['data'][g_SelectedIndex]['values'][1]['values']['y_' + j]) != -1)
                {
                    data[g_SelectedIndex]['values'][1]['values']['y_' + j] += Number(g_Data[cur.cc2][g_StatId]['data'][g_SelectedIndex]['values'][1]['values']['y_' + j]);
                }
                if (data[g_SelectedIndex].length === 3)
                {
		    data[g_SelectedIndex]['values'][2]['values']['y_' + j] = Number(data[g_SelectedIndex]['values'][2]['values']['y_' + j]);
                    if (Number(g_Data[cur.cc2][g_StatId]['data'][g_SelectedIndex]['values'][2]['y_' + j]) != -1)
                    {
                        data[g_SelectedIndex]['values'][2]['values']['y_' + j] += Number(g_Data[cur.cc2][g_StatId]['data'][g_SelectedIndex]['values'][2]['values']['y_' + j]);
                    }
                }
            }
        }
        else
        {
            for (j = g_Data[cur.cc2][g_StatId]['firstYear']; j <= g_Data[cur.cc2][g_StatId]['lastYear']; j++)
            {
		data[g_SelectedIndex]['values']['y_' + j] = Number(data[g_SelectedIndex]['values']['y_' + j]);
                if (Number(g_Data[cur.cc2][g_StatId]['data'][g_SelectedIndex]['values']['y_' + j]) != -1)
                {
                    data[g_SelectedIndex]['values']['y_' + j] += Number(g_Data[cur.cc2][g_StatId]['data'][g_SelectedIndex]['values']['y_' + j]);
                }
            }
        }
        cur = cur.next;
    }

    if (g_Stats[g_StatId]['type'] === 'int')
    {
        for (j = g_Data[g_DataList.start.cc2][g_StatId]['firstYear']; j <= g_Data[g_DataList.start.cc2][g_StatId]['lastYear']; j++)
        {
            data[g_SelectedIndex]['values'][0]['values']['y_' + j] = data[g_SelectedIndex]['values'][0]['values']['y_' + j] / g_DataList.size;
            data[g_SelectedIndex]['values'][1]['values']['y_' + j] = data[g_SelectedIndex]['values'][0]['values']['y_' + j] / g_DataList.size;
            data[g_SelectedIndex]['values'][2]['values']['y_' + j] = data[g_SelectedIndex]['values'][0]['values']['y_' + j] / g_DataList.size;
        }
    }
    
    sumNode = new t_AsdsNode('sum', name, clone);

    return sumNode;
}

function GetMaxFromValueRow(values)
{
    var max = Number.MIN_VALUE,
        re = new RegExp("y_(\\d+)"),
        temp;

    for (i in values)
    {
        if (i !== 'country_id' && i !== 'data_set_index')
        {
            temp = re.exec(i);
            year = Number(temp[1]);
            if (year >= g_YearStart && year <= g_YearEnd && Number(values[i]) > max)
            {
                max = Number(values[i]);
            }
        }
    }

    return max;
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
    var max = Number.MIN_VALUE,
        cur = g_DataList.start,
        i,
        thisNodeMax;

    // find max value of needed data set
    for (i = 0; i < g_DataList.size; i++)
    {
        // get max of current node for current stat
        if (g_Stats[g_StatId]['type'] === 'est')
        {
            thisNodeMax = Math.max.apply(Math, [GetMaxFromValueRow(cur['data'][g_StatId]['data'][g_SelectedIndex]['values'][0]), GetMaxFromValueRow(cur['data'][g_StatId]['data'][g_SelectedIndex]['values'][1]), GetMaxFromValueRow(cur['data'][g_StatId]['data'][g_SelectedIndex]['values'][2])]);
        }
        else if (g_Stats[g_StatId]['type'] === 'int')
        {
            thisNodeMax = Math.max.apply(Math, [GetMaxFromValueRow(cur['data'][g_StatId]['data'][g_SelectedIndex]['values'][0]['values']),GetMaxFromValueRow(cur['data'][g_StatId]['data'][g_SelectedIndex]['values'][1]['values']),GetMaxFromValueRow(cur['data'][g_StatId]['data'][g_SelectedIndex]['values'][2]['values'])]);
        }
        else
        {
            thisNodeMax = GetMaxFromValueRow(cur['data'][g_StatId]['data'][g_SelectedIndex]['values']);
        }

        if (thisNodeMax > max)
        {
            max = thisNodeMax;
        }
        cur = cur.next;
    }
    
    if (max < 0 || max === undefined || max === Number.MIN_VALUE)
    {
        return -1;
    }

    return max;   
}

