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

// File Name:          graph.js
// Description:        This file generates graphs based on server data
// Date Created:       3/17/2015
// Contributors:       Berty Ruan, Arun Kumar, Paul Jang, Vanajam Soni, Joshua Crafts
// Date Last Modified: 9/1/2015
// Last Modified By:   Joshua Crafts
// Dependencies:       data.js, data_pull.js, dynamic_markup.js
// Additional Notes:   N/A

function BuildList(selectedRegions)
// PRE:  selectedRegions is a 1D array of CC2 codes output from g_Map.getSelectedRegions in map.js
// POST: the current data list is replaced with a list containing the relevant data for all countries
//       whose CC2s are in selectedRegions which have data available
{
    var i,			// index in selectedRegions
        node;			// new node to be added to list

    if (g_DataList == null)					// create list if it does not exist
    {
	g_DataList = new c_List();
    }

    g_DataList.clear();						// clear list

    for(i = 0; i < selectedRegions.length; i++)			// iterate through list of selected countries
    {								//  and prepend it to list
        if (g_Data[selectedRegions[i]] !== undefined && (g_Data[selectedRegions[i]][g_StatId] !== undefined || g_StatId === 'custom' && g_Data[selectedRegions[i]][g_StatId1] !== undefined && g_Data[selectedRegions[i]][g_StatId2] !== undefined))
        {
            node = new t_AsdsNode(selectedRegions[i],
                                  g_Countries[selectedRegions[i]],
                                  g_Data[selectedRegions[i]]);
            g_DataList.add(node);
        }
    }
}
 
function GenerateGraphs()
// PRE:  The divs for the graphs exist, and correct data is stored in g_DataList,
//       g_GraphType and g_StatList 
// POST: Calls the appropriate graphing functions depending on the g_GraphType and 
//       whether the g_StatID selected is vaccination or not
{
	var sumNode,		// temp node for use in 'whole selection' option
            max,		// max value between regional graphs
            cur,		// points to nodes as we iterate through list
            i;			// indexing variable

	if(g_DataList !== undefined && g_DataList.size !== 0)
	{
            if (g_StatId === 'custom')
            {
                GenerateCustomGraphs();
            }
            else if (g_Stats[g_StatId].type === 'int')
            {
                GenerateIntegratedGraphs();
            }
            else
            {
                GenerateOtherGraphs();
            }
	}
}

function GenerateCustomGraphs()
// PRE:  g_DataList is initialized with server data and the document is ready
// POST: appropriate graphs are drawn for the 'custom' tab according to the stats
//       to be graphed and the data type (est, int, lin, or bar)
{
    var i,
        cur = g_DataList.start,
        max;

    switch(g_GraphType)
    {
        case 0:
            for(i=1; i<=g_DataList.size; i++)
            {
                GraphCustom("region-graphs-"+i, cur);
                cur=cur.next;
            }
            break;
        case 1:
            for(i=1; i<=g_DataList.size; i++)
            {
                GraphCustom("region-graphs-"+i, cur);
                cur=cur.next;
            }
            break;
        case 2:
            sumNode = GenerateSumNode();
            GraphCustom("region-graphs-"+1, sumNode);
            break;
    }
}

function GenerateIntegratedGraphs()
// PRE:  g_DataList has been initialized with server data g_Stats[g_StatId] is of type 'int'
// POST: graphs of the appropriate number and type are rendered in the graph section of the
//       control panel
{
    var i,
        cur = g_DataList.start,
        max;

    switch(g_GraphType)
    {
        case 0:    
            max = FindMax();
            for(i=1; i<=g_DataList.size; i++)
            {
                GraphIntegrated("region-graphs-"+i, cur, max);
                cur=cur.next;
            }
            break;
        case 1:
            max = FindMax();
            for(i=1; i<=g_DataList.size; i++)
            {
                GraphIntegrated("region-graphs-"+i, cur, max);
                cur=cur.next;
            }
            break;
        case 2:
            sumNode = GenerateSumNode();
            GraphIntegrated("region-graphs-"+1, sumNode);
            break;
    }
}

function GenerateOtherGraphs()
// PRE:  g_DataList has been initialized with server data g_Stats[g_StatId] is not of type 'int'
// POST: graphs of the appropriate number and type are rendered in the graph section of the
//       control panel
{
    var i,
        cur = g_DataList.start,
        max;

    switch(g_GraphType)
    {
        case 0:    
            max = FindMax();
            for(i=1; i<=g_DataList.size; i++)
            {
                GraphRegional("region-graphs-"+i, cur, max);
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


function GraphRegional(divID, node, maxVal)
// PRE:  divID is a div of class "region-graphs-\d", node is a valid t_AsdsNode containing data for a country or 
//       a sum of countries, and maxVal is the max is maximum value of the selected stat for the entire list
// POST: generates a single Google ComboChart for g_Stats[g_StatId] for the given node on the divID
{
    var data = GenerateSingleData(node.data[g_StatId].data),
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

    // default options are for 'est'
    // if single line, make navy
    if (g_Stats[g_StatId].type !== 'est')
    {
        options.series[0].color = "navy";
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

function GraphCombined(divID)
// PRE:  divID is a div of class "region-graphs-\d", g_DataList is initialized with server data
// POST: generates a single Google LineChart on divID for all regions in g_DataList
{
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

function GraphIntegrated(divID, node, maxVal)
// PRE:  divID is a div of class "region-graphs-\d", node is a valid t_AsdsNode containing data for a country or 
//       a sum of countries, and maxVal is the max is maximum value of the selected stat for the entire list
// POST: generates a single Google ComboChart for integrated stat g_Stats[g_StatId] for the given node on the divID
{
    var data = GenerateSingleData(node.data[g_StatId].data),
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
        options.vAxis.viewWindow.max = maxVal;
    }

    for (i = 0; i < g_Stats[g_StatId].subType.length; i++)
    {
        if (g_Stats[g_StatId].subType[i] === 'lin')
        {
             dataSeries[i].type = 'line'; 
        }
    }

    options.series = dataSeries;
	
    formatter = new google.visualization.NumberFormat({pattern: '##.##%'});
    for(i=1; i<data.getNumberOfColumns(); i++)
    {
        formatter.format(data,i);
    }
	
    chart = new google.visualization.ComboChart(document.getElementById(divID));
    chart.draw(data, options);
}

function GraphCustom(divID, node)
// PRE:  node is a pointer to a particular node in g_DataList
//       divID is the id of a particular div in which to graph
// POST: a graph of the 2 stats indicated by g_StatId1 and g_StatId2 from node is created in div divID
{
    var data = GenerateCustomData(node),
        options = {
            title: node.name,
            hAxis: {title: 'Year', format: '####'},
            backgroundColor: '#EAE7C2',
            seriesType: "line",
            tooltip: {trigger: 'both'}
        },
        formatter,
        chart,
        i;
	
    chart = new google.visualization.ComboChart(document.getElementById(divID));
    chart.draw(data, options);
}

function FixMissingData(data)
// PRE: data is an integer or float, missing data is represented as -1
// POST: FCTVAL == data if data is not -1, null otherwise
{
    if(data !== -1)
    {
        return data;
    }
    else
    {
        return null;
    }
}

function GetYears(values)
// PRE:  values is an object with its keys being column ids from the source database table,
//       and the values matched to them being the data values from the table for a particular
//       country
// POST: FCTVAL == an array of years as Numbers with the prefix "y_" stripped from the column name
{
    var years = [],
        re = new RegExp("y_(\\d+)"),
        i;

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
// PRE:  values is an object with its keys being column ids from the source database table,
//       and the values matched to them being the data values from the table for a particular
//       country
// POST: FCTVAL == an array of the data values from values as Numbers
{
    var row = [],
        i;

    for (i in values)
    {
        if (i !== 'country_id' && i !== 'data_set_index')
        {
            row.push(FixMissingData(Number(values[i])));
        }
    }

    return row;
}

function GenerateSingleData(data)
// PRE:  data == g_Data[{{country}}][g_StatId]['data']
// POST: FCTVAL == data table containing data from the year g_YearStart to g_YearEnd, for the given country's data
//       so that we can graph
{
    var dataTable,
        i,
        temp = new Array(4);

    if (g_Stats[g_StatId].type === 'est')
    {
        dataTable = GenerateSingleEstData(data);
    }
    else if (g_Stats[g_StatId].type === 'int')
    {
        dataTable = GenerateSingleIntData(data);
    }
    else
    {
        dataTable = GenerateSingleOtherData(data);
    }

    return dataTable;
}

function GenerateSingleEstData(data)
// PRE:  data is initialized with server data, and g_Stats[g_StatId]['type] == 'est'
//       g_SelectedIndex and g_StatId are initialized
// POST: FCTVAL == a data table of data with the appropriate format
{
    var temp = [],
        dataTable = new google.visualization.DataTable(),
        i;

    temp.push(GetYears(data[g_SelectedIndex].values[0]));
    temp.push(GetValues(data[g_SelectedIndex].values[0]));
    temp.push(GetValues(data[g_SelectedIndex].values[1]));
    temp.push(GetValues(data[g_SelectedIndex].values[2]));
    dataTable.addColumn('number','year');
    dataTable.addColumn('number', g_Stats[g_StatId].subName[1]);
    dataTable.addColumn('number', 'lower bound space'); // area under lower bound
    dataTable.addColumn('number', g_Stats[g_StatId].subName[2]); // additional line to outline confidence interval
    dataTable.addColumn('number', 'size of confidence interval'); // area between upper bound and lower bound
    dataTable.addColumn('number', g_Stats[g_StatId].subName[0]); // additional line to generate accurate upper bound tooltip, ow it would show size of confidence interval
    for (i = 0; i < temp[0].length; i++)
    {
        dataTable.addRow([temp[0][i],temp[2][i],temp[3][i],
                temp[3][i],temp[1][i] - temp[3][i], temp[1][i]]);
    }

    return dataTable;
}

function GenerateSingleIntData(data)
// PRE:  data is initialized with server data, and g_Stats[g_StatId]['type] == 'int'
//       g_SelectedIndex and g_StatId are initialized
// POST: FCTVAL == a data table of data with the appropriate format
{
    var temp = [],
        dataTable = new google.visualization.DataTable(),
        i;

    temp.push(GetYears(data[g_SelectedIndex].values[0].values));
    temp.push(GetValues(data[g_SelectedIndex].values[0].values));
    temp.push(GetValues(data[g_SelectedIndex].values[1].values));
    temp.push(GetValues(data[g_SelectedIndex].values[2].values));
    dataTable.addColumn('number','year');
    dataTable.addColumn('number', g_Stats[g_StatId].subName[0]);
    dataTable.addColumn('number', g_Stats[g_StatId].subName[1]);
    dataTable.addColumn('number', g_Stats[g_StatId].subName[2]);
    for (i = 0; i < temp[0].length; i++)
    {
        dataTable.addRow([temp[0][i],temp[1][i],temp[2][i],temp[3][i]]);
    }

    return dataTable;
}

function GenerateSingleOtherData(data)
// PRE:  data is initialized with server data, and g_Stats[g_StatId]['type] != 'est' or 'int'
//       g_SelectedIndex and g_StatId are initialized
// POST: FCTVAL == a data table of data with the appropriate format
{
    var temp = [],
        dataTable = new google.visualization.DataTable(),
        i;

    dataTable.addColumn('number','year');
    dataTable.addColumn('number', g_Stats[g_StatId].name);
    temp.push(GetYears(data[g_SelectedIndex].values));
    temp.push(GetValues(data[g_SelectedIndex].values));
    for (i = 0; i < temp[0].length; i++)
    {
        dataTable.addRow([temp[0][i],temp[1][i]]);
    }

    return dataTable;
}

//TODO: reduce cyclomatic complexity to below jshint threshold
/* jshint ignore:start */
function GenerateCustomData(node)
// PRE:  node is a pointer to a particular node in g_DataList
// POST: FCTVAL == a google charts DataTable object containing all necessary data from 2 stats
//       from node
{
    var temp1 = [],
        temp2 = [],
        dataTable = new google.visualization.DataTable(),
        i, j;

    console.log(g_StatId1);
    console.log(g_SelectedIndex1);
    dataTable.addColumn('number','year');
    if (g_Stats[g_StatId1].type !== 'int')
    {
        dataTable.addColumn('number', g_Stats[g_StatId1].name);
    }
    else
    {
        dataTable.addColumn('number', g_Stats[g_StatId1].subName[g_SubStat1]);
    }
    if (g_Stats[g_StatId2].type !== 'int')
    {
        dataTable.addColumn('number', g_Stats[g_StatId2].name);
    }
    else
    {
        dataTable.addColumn('number', g_Stats[g_StatId2].subName[g_SubStat2]);
    }
    if (g_Stats[g_StatId1].type === 'est')
    {
        temp1.push(GetYears(node.data[g_StatId1].data[g_SelectedIndex1].values[1]));
        temp1.push(GetValues(node.data[g_StatId1].data[g_SelectedIndex1].values[1]));
    }
    else if (g_Stats[g_StatId1].type === 'int')
    {
        temp1.push(GetYears(node.data[g_StatId1].data[g_SelectedIndex1].values[g_SubStat1].values));
        temp1.push(GetValues(node.data[g_StatId1].data[g_SelectedIndex1].values[g_SubStat1].values));
    }
    else
    {
        temp1.push(GetYears(node.data[g_StatId1].data[g_SelectedIndex1].values));
        temp1.push(GetValues(node.data[g_StatId1].data[g_SelectedIndex1].values));
    }
    console.log(g_StatId2);
    console.log(g_SelectedIndex2);
    if (g_Stats[g_StatId2].type === 'est')
    {
        temp2.push(GetYears(node.data[g_StatId2].data[g_SelectedIndex2].values[1]));
        temp2.push(GetValues(node.data[g_StatId2].data[g_SelectedIndex2].values[1]));
    }
    else if (g_Stats[g_StatId2].type === 'int')
    {
        temp2.push(GetYears(node.data[g_StatId2].data[g_SelectedIndex2].values[g_SubStat2].values));
        temp2.push(GetValues(node.data[g_StatId2].data[g_SelectedIndex2].values[g_SubStat2].values));
    }
    else
    {
        temp2.push(GetYears(node.data[g_StatId2].data[g_SelectedIndex2].values));
        temp2.push(GetValues(node.data[g_StatId2].data[g_SelectedIndex2].values));
    }

    j = 0;
    i = 0;
    while (temp1[0][i] !== temp2[0][j])
    {
        j++;
    }
    if (temp1[0][i] !== temp2[0][j])
    {
        j = 0;
        while (temp1[0][i] !== temp2[0][j])
        {
            i++;
        }
    }
    for (i = i; i < temp1[0].length; i++)
    {
        dataTable.addRow([temp1[0][i],temp1[1][i],temp2[1][j]]);
        j++;
    }
    return dataTable;
}
/* jshint ignore:end */

function GenerateCombinedData()
// PRE:  g_DataList, g_StatId, and g_SelectedIndex are initialized with server data
// POST: FCTVAL == data table containing data from the year g_YearStart to g_YearEnd, for all countries on the 
//       g_DataList, so that we can graph all data on one graph
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
    if (g_Stats[g_StatId].type === 'est')
    {
        temp[0] = GetYears(cur.data[g_StatId].data[g_SelectedIndex].values[1]);
        for (i = 0; i < g_DataList.size; i++)
        {
            temp[i + 1] = GetValues(cur.data[g_StatId].data[g_SelectedIndex].values[1]);
            cur = cur.next;
        }
    }
    else
    {
        temp[0] = GetYears(cur.data[g_StatId].data[g_SelectedIndex].values);
        for (i = 0; i < g_DataList.size; i++)
        {
            temp[i + 1] = GetValues(cur.data[g_StatId].data[g_SelectedIndex].values);
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

function GenerateSumNode()
// PRE:  g_DataList, g_StatId, and g_SelectedIndex are initialized with server data
// POST: FCTVAL == t_AsdsNode with cc2 = 'sum', name = comma delimited list of country names,
//       and data being a partial data set that includes summed values for only the needed stats
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
    name += cur.name;
    cur = cur.next;
    for (i = 1; i < g_DataList.size; i++)
    {
        name += ", " + cur.name;
        // add all data values for stat and substats to the copied node, effectively creating a sum node with respect to the needed stat
        if (g_StatId === 'custom')
        {
            clone[g_StatId1].data = AddValuesFromNode(clone[g_StatId1].data, cur, g_StatId1, g_SelectedIndex1);
            if (g_StatId1 !== g_StatId2)
            {
                clone[g_StatId2].data = AddValuesFromNode(clone[g_StatId2].data, cur, g_StatId2, g_SelectedIndex2);
            }
        }
        else
        {
            clone[g_StatId].data = AddValuesFromNode(clone[g_StatId].data, cur, g_StatId, g_SelectedIndex);
        }
        cur = cur.next;
    }

    if (g_StatId !== 'custom' && g_Stats[g_StatId].type === 'int')
    {
        for (j = g_Data[g_DataList.start.cc2][g_StatId].firstYear; j <= g_Data[g_DataList.start.cc2][g_StatId].lastYear; j++)
        {
            data[g_SelectedIndex].values[0].values['y_' + j] = data[g_SelectedIndex].values[0].values['y_' + j] / g_DataList.size;
            data[g_SelectedIndex].values[1].values['y_' + j] = data[g_SelectedIndex].values[0].values['y_' + j] / g_DataList.size;
            data[g_SelectedIndex].values[2].values['y_' + j] = data[g_SelectedIndex].values[0].values['y_' + j] / g_DataList.size;
        }
    }
    
    sumNode = new t_AsdsNode('sum', name, clone);

    return sumNode;
}

//TODO: reduce cyclomatic complexity to below jshint threshold
/* jshint ignore:start */
function AddValuesFromNode(data, node, statId, index)
// PRE:  data is a pointer to the 'data' field of the output node's node[cc2][statId] object
//       node is the current node in the list being traversed
//       statId is the id of the stat whose values are being added to the output node
//       index is the index of the stat data set whose values are being added to the output node
// POST: FCTVAL == a data object with the values of the current node added to the desired stat
//       and data set index
{
    if (g_Stats[statId].type === 'est')
    {
        for (j = g_Data[node.cc2][statId].firstYear; j <= g_Data[node.cc2][statId].lastYear; j++)
        {
            data[index].values[0]['y_' + j] = Number(data[index].values[0]['y_' + j]);
            if (Number(g_Data[node.cc2][statId].data[index].values[0]['y_' + j]) !== -1)
            {
                data[index].values[0]['y_' + j] += Number(g_Data[node.cc2][statId].data[index].values[0]['y_' + j]);
            }
            data[index].values[1]['y_' + j] = Number(data[index].values[1]['y_' + j]);
            if (Number(g_Data[node.cc2][statId].data[index].values[1]['y_' + j]) !== -1)
            {
                data[index].values[1]['y_' + j] += Number(g_Data[node.cc2][statId].data[index].values[1]['y_' + j]);
            }
            data[index].values[2]['y_' + j] = Number(data[index].values[2]['y_' + j]);
            if (Number(g_Data[node.cc2][statId].data[index].values[2]['y_' + j]) !== -1)
            {
                data[index].values[2]['y_' + j] += Number(g_Data[node.cc2][statId].data[index].values[2]['y_' + j]);
            }
        }
    }
    else if (g_Stats[statId].type === 'int')
    {
        for (j = g_Data[node.cc2][statId].firstYear; j <= g_Data[node.cc2][statId].lastYear; j++)
        {
            data[index].values[0].values['y_' + j] = Number(data[index].values[0].values['y_' + j]);
            if (Number(g_Data[node.cc2][statId].data[index].values[0].values['y_' + j]) !== -1)
            {
                data[index].values[0].values['y_' + j] += Number(g_Data[node.cc2][statId].data[index].values[0].values['y_' + j]);
            }
            data[index].values[1].values['y_' + j] = Number(data[index].values[1].values['y_' + j]);
            if (Number(g_Data[node.cc2][statId].data[index].values[1].values['y_' + j]) !== -1)
            {
                data[index].values[1].values['y_' + j] += Number(g_Data[node.cc2][statId].data[index].values[1].values['y_' + j]);
            }
            if (data[index].length === 3)
            {
		data[index].values[2].values['y_' + j] = Number(data[index].values[2].values['y_' + j]);
                if (Number(g_Data[node.cc2][statId].data[index].values[2]['y_' + j]) !== -1)
                {
                    data[index].values[2].values['y_' + j] += Number(g_Data[node.cc2][statId].data[index].values[2].values['y_' + j]);
                }
            }
        }
    }
    else
    {
        for (j = g_Data[node.cc2][statId].firstYear; j <= g_Data[node.cc2][statId].lastYear; j++)
        {
            data[index].values['y_' + j] = Number(data[index].values['y_' + j]);
            if (Number(g_Data[node.cc2][statId].data[index].values['y_' + j]) !== -1)
            {
                data[index].values['y_' + j] += Number(g_Data[node.cc2][statId].data[index].values['y_' + j]);
            }
        }
    }
    return data;
}
/* jshint ignore:end */

function GetMaxFromValueRow(values)
// PRE:  values is an object with its keys being column ids from the source database table,
//       and the values matched to them being the data values from the table for a particular
//       country
// POST: FCTVAL == maximum value from values
{
    var max = Number.MIN_VALUE,
        re = new RegExp("y_(\\d+)"),
        temp,
        i;

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

function FindMax()
// PRE:  g_DataList, g_StatId, and g_SelectedIndex are initialized with server data
//       g_ParsedStatList, g_YearFirst, g_FirstYear and g_YearEnd exist and contain correct data
// POST: FCTVAL == maximum value of the selected stat for the entire list
{
    var max = Number.MIN_VALUE,
        cur = g_DataList.start,
        i,
        thisNodeMax;

    // find max value of needed data set
    for (i = 0; i < g_DataList.size; i++)
    {
        // get max of current node for current stat
        thisNodeMax = GetMaxThisNode(cur);
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

function GetMaxThisNode(node)
// PRE:  g_DataList, g_StatId, and g_SelectedIndex are initialized with server data
//       g_ParsedStatList, g_YearFirst, g_FirstYear and g_YearEnd exist and contain correct data
//       node is a particular node of g_DataList
// POST: FCTVAL == the max value of stat g_StatId for node node
{
    var max;

    if (g_Stats[g_StatId].type === 'est')
    {
        max = Math.max.apply(Math, [GetMaxFromValueRow(node.data[g_StatId].data[g_SelectedIndex].values[0]), GetMaxFromValueRow(node.data[g_StatId].data[g_SelectedIndex].values[1]), GetMaxFromValueRow(node.data[g_StatId].data[g_SelectedIndex].values[2])]);
    }
    else if (g_Stats[g_StatId].type === 'int')
    {
        max = Math.max.apply(Math, [GetMaxFromValueRow(node.data[g_StatId].data[g_SelectedIndex].values[0].values),GetMaxFromValueRow(node.data[g_StatId].data[g_SelectedIndex].values[1].values),GetMaxFromValueRow(node.data[g_StatId].data[g_SelectedIndex].values[2].values)]);
    }
    else
    {
        max = GetMaxFromValueRow(node.data[g_StatId].data[g_SelectedIndex].values);
    }

    return max;
}
