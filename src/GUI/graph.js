// File Name: graph.js
// Description: This file generates graphs based on parsed data
// Date Created: 3/17/2015
// Contributors: Nicholas Dyszel, Berty Ruan, Arun Kumar, Paul Jang
// Date Last Modified: 4/1/2015
// Last Modified By: Nicholas Denaro
// Dependencies: client_parser.js, ..., [Google Charts API]
// Additional Notes: N/A

// Author: Arun Kumar
// Date Created: 4/14/2015
// Last Modified:
// Description: Creates switch case to determine which function to call
// PRE: N/A
// POST: N/A
function GenerateGraphs()
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
                for(var i=1; i<=g_DataList.size; i++)
                {
                    GraphRegional("region-graphs-"+i, curr);
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

// Author: Arun Kumar
// Date Created:4/2/2015
// Last Modified: 4/14/2015
// Description: Takes stat data and divID to generate a graph for a single country and stat
// PRE:
// POST:
function GraphRegional(divID, node) {
    var data= GenerateSingleData(node.data);
    var options = {
        title: node.name,
        seriesType: "line",
        legend: 'none',
        vAxis: {
            viewWindowMode:'explicit',
            viewWindow: {
                min:0
            }
        },
        hAxis: {title: 'Year', format: '####'},
        backgroundColor: '#EAE7C2'
    };
	
    // instantiate and draw chart using prepared data
    var chart = new google.visualization.LineChart(document.getElementById(divID));
    chart.draw(data, options);
}

// Authors: Josh Crafts, Arun Kumar
// Date Created: 3/27/2015
// Last Modified: 4/14/2015
// Description: Takes stat data from multiple countries and generates a graph
// using data from multiple countries combined
// PRE:
// POST:
function GraphCombined(divID) {
    var data = GenerateCombinedData(data);
    var options = {
        seriesType: "line",
        legend: {position: 'bottom'},
        vAxis: {
            viewWindowMode:'explicit',
            viewWindow: {
                min:0
            }
        },
        hAxis: {title: 'Year', format: '####'},
        backgroundColor: '#EAE7C2'
    };
    // instantiate and draw chart using prepared data
    var chart = new google.visualization.LineChart(document.getElementById(divID));
    chart.draw(data, options);
}

// Author: Arun Kumar
// Date Created: 4/14/2015
// Last Modified:
// Description: Takes stat data from multiple countries and generates a graph for vaccinations
// creating bars with mass vaccinations and line graphs with periodic vaccinations
// PRE:
// POST:
function GraphVaccine(divID, node) {
    var data = GenerateVaccineData(node.data);
    var options = {
        title: node.name,
        vAxis: {
            viewWindowMode:'explicit',
            viewWindow: {
                min:0
            }
        },
        hAxis: {title: 'Year', format: '####'},
        backgroundColor: '#EAE7C2',
        seriesType: "bars",
        series: {
            0: {type: "line"}, 1: {type: "line"}
        }
    };

    var chart = new google.visualization.ComboChart(document.getElementById(divID));
    chart.draw(data, options);
}

// Author: Vanajam Soni
// Date Created: 4/16/2015
// Last Modified: 4/16/2015 by Vanajam Soni
// Description: Checks for missing data and returns null, if data is missing.
// PRE: N/A
// POST: N/A
function FixMissingData(data)
{
    if(data != -1)
        return data;
    else
        return null;
}

// Author: Vanajam Soni
// Date Created: 4/7/2015
// Last Modified: 4/13/2015 by Vanajam Soni
// Description: Prepares Data given for a single country (taken as argument) into data table, for the global statID, 
//              Also depends on graph type for bounded or unbounded data
// PRE: N/A
// POST: N/A
function GenerateSingleData(data)
{
    var type = 0;

    // type = 0 => unbounded
    // type = 1 => only lower bound exists
    // type = 2 => only upper bound exists
    // type = 3 => bounded

    var dataTable = new google.visualization.DataTable();
    
    dataTable.addColumn('number','year');
    
    dataTable.addColumn('number', 'value');
    dataTable.addColumn({type: 'boolean', role: 'certainty', id: 'isStat'});   // false for dotted line, true for solid line

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

    if(lowerBoundID != -1)
    {
        dataTable.addColumn('number','lower bound');
        dataTable.addColumn({type: 'boolean', role: 'certainty', id: 'isStat'});   // false for dotted line, true for solid line
        type = 1;
    }

    if(upperBoundID != -1)
    {
        dataTable.addColumn('number', 'upper bound');
        dataTable.addColumn({type: 'boolean', role: 'certainty', id: 'isStat'});
        type = type + 2;
    }    

    // filling the data table
    for(i=g_YearStart-g_FirstYear;i<(g_YearEnd-g_YearStart)+1;i++)
    {   
        if (type == 0 && i == 0)
            dataTable.addRow([1980,FixMissingData(Number(data[g_StatID][i])),true]);
        else
        {
            switch(type) 
            {
                case 0:
                    dataTable.addRow([1980+i,FixMissingData(Number(data[g_StatID][i])),true]);
                    break;
                case 1:
                    dataTable.addRow([1980+i,FixMissingData(Number(data[g_StatID][i])),true,FixMissingData(Number(data[lowerBoundID][i])),false]);
                    break;
                case 2:
                    dataTable.addRow([1980+i,FixMissingData(Number(data[g_StatID][i])),true,FixMissingData(Number(data[upperBoundID][i])),false]);
                    break;
                case 3:
                    dataTable.addRow([1980+i,FixMissingData(Number(data[g_StatID][i])),true,FixMissingData(Number(data[lowerBoundID][i])),false,
                        FixMissingData(Number(data[upperBoundID][i])),false]);
                    break;
            }
        }
    }

    return dataTable;
}

// Author: Joshua Crafts
// Date Created: 3/27/2015
// Last Modified: 3/27/2015 by Joshua Crafts
// Description: Prepares data in terms of the data type needed by graphing api
// PRE: N/A
// POST: N/A
function GenerateCombinedData()
{
    // create array with indices for all years plus a header row
    var dataArray = new Array((g_YearEnd-g_YearStart)+2);
    var dataTable;
    var currentNode;
    var i, j;
    // fill array
    for (i = g_YearStart-g_FirstYear; i < (g_YearEnd-g_YearStart)+2; i++)
    {
        // create array in each index the length of the data list, plus a column for year
        dataArray[i] = new Array(g_DataList.size + 1);
        currentNode = g_DataList.start;
        // fill header row with region names
        if (i == 0)
        {
            dataArray[i][0] = 'Region';
            for (j = 1; j < g_DataList.size + 1; j++)
            {
                dataArray[i][j] = currentNode.name;
                currentNode = currentNode.next;
            }
        }
        // fill first column with years and the rest with data
        else
        {
            dataArray[i][0] = i + 1979;
            for (j = 1; j < g_DataList.size + 1; j++)
            {
                // data is set using currently selected stat ID
                dataArray[i][j] = Number(currentNode.data[g_StatID][i-1]);
                currentNode = currentNode.next;
            }
        }
    }
    // turns 2D array into data table for graph, second argument denotes that 0 indices are headers, see documentation for more info
    dataTable = google.visualization.arrayToDataTable(dataArray, false);
    console.log(dataTable);
    return dataTable;
}

// Author: Vanajam Soni
// Date Created: 4/7/2015
// Last Modified: 4/13/2015 by Vanajam Soni
// Description: Generates an ASDS node with all data summed over selected regions
// PRE: N/A
// POST: N/A
function GenerateSumNode(){
    
    var data = new Array(g_StatList.length);   // data for the new node
    var names = "";
    var i,j;
    var currentNode = g_DataList.start;    // list iterator
    
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

    console.log(g_StatID);
    console.log(ass1ID);
    console.log(ass2ID);

    data[g_StatID] = new Array((g_YearEnd-g_YearStart)+1);
    if (ass1ID > -1)
        data[ass1ID] = new Array((g_YearEnd-g_YearStart)+1);
    if (ass2ID > -1)
        data[ass2ID] = new Array((g_YearEnd-g_YearStart)+1);

    for (j = 0; j < (g_YearEnd-g_YearStart)+1; j++)
    {
        data[g_StatID][j] = 0;
        if (ass1ID > -1)
            data[ass1ID][j] = 0;
        if (ass2ID > -1)
            data[ass2ID][j] = 0;
    }

    for (i = 0; i < g_DataList.size; i++)
    {
        for (j = g_YearStart-g_FirstYear; j < (g_YearEnd-g_YearStart)+1; j++)
        {
            if (Number(currentNode.data[g_StatID][j]) > 0)
                data[g_StatID][j] += Number(currentNode.data[g_StatID][j]);
            if (ass1ID > -1 && Number(currentNode.data[ass1ID][j]) > 0)
                data[ass1ID][j] += Number(currentNode.data[ass1ID][j]);
            if (ass2ID > -1 && Number(currentNode.data[ass2ID][j]) > 0)
                data[ass2ID][j] += Number(currentNode.data[ass2ID][j]);
        }
        names += currentNode.name;
        if (currentNode != g_DataList.end)
            names += ", ";
        currentNode = currentNode.next;
    }
    
    var newNode = new t_AsdsNode(-1, "SUM", names, data);

    return newNode;
}


// Author: Vanajam Soni
// Date Created: 4/7/2015
// Last Modified: 4/13/2015 by Vanajam Soni
// Description: Prepares data for vaccination stats, for a given country
//              Takes data of the country as input.
// PRE: N/A
// POST: N/A
function GenerateVaccineData(data)
{
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('number','year');
    dataTable.addColumn('number', 'MCV1');
    dataTable.addColumn('number', 'MCV2');
    dataTable.addColumn('number', 'SIA');
    
    var mcv1ID, mcv2ID,siaID;

    siaID = g_StatID;

    for(i=0;i<g_ParsedStatList[1].length;i++)
    {
        if(g_StatID == g_ParsedStatList[1][i])
        {
            mcv1ID = g_ParsedStatList[2][i];
            mcv2ID = g_ParsedStatList[3][i];   
        }
    }
    // use parsed stat list to find mcv1 and mcv2 ids

    console.log(siaID);
    console.log(mcv1ID);
    console.log(mcv2ID);

    var i,j;
    for(i=g_YearStart-g_FirstYear;i<(g_YearEnd-g_YearStart)+1;i++)
    {
        dataTable.addRow([1980+i,parseFloat(data[mcv1ID][i])*100,parseFloat(data[mcv2ID][i])*100,parseFloat(data[siaID][i])*100]);
    }
    
    return dataTable;   
}

