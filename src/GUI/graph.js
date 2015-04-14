
// File Name: graph.js
// Description: This file generates graphs based on parsed data
// Date Created: 3/17/2015
// Contributors: Nicholas Dyszel, Berty Ruan, Arun Kumar, Paul Jang
// Date Last Modified: 4/1/2015
// Last Modified By: Nicholas Denaro
// Dependencies: client_parser.js, ..., [Google Charts API]
// Additional Notes: N/A

// Author: Joshua Crafts
// Date Created: 3/27/2015
// Last Modified: 4/2/2015 by Nicholas Denaro
// Description: Gets stat data and generates a graph (Google Charts API)
// PRE: N/A
// POST: N/A
function GenerateGraph()
{
    var data = PrepareData();
    var options = {
		vAxis: {
			minValue: 0
		},
		hAxis: {
			format: '####'
		},
		legend: {
			position: 'bottom'
		},
		backgroundColor: '#EAE7C2'
	};
    // instantiate and draw chart using prepared data
    //for(var stat in g_StatList)
    {
        
        //var tab=document.getElementById("tabsDiv").children[stat];
        var tab=document.getElementById("id-"+g_StatList[g_StatID]);
        if(tab!=undefined)
        {
            var chart = new google.visualization.LineChart(document.getElementById(tab.id+"-graphs"));//Rather than using the active tab, we need to find out which graph the data is for?
            chart.draw(data, options);
        }
    }
	
}

// Author: Joshua Crafts
// Date Created: 3/27/2015
// Last Modified: 3/27/2015 by Joshua Crafts
// Description: Prepares data in terms of the data type needed by graphing api
// PRE: N/A
// POST: N/A
function PrepareData()
{
    // create array with indices for all years plus a header row
    var dataArray = new Array(34);
    var dataTable;
    var currentNode;
    var i, j;
    // fill array
    for (i = 0; i < 34; i++)
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
    console.log(dataArray);
    // turns 2D array into data table for graph, second argument denotes that 0 indices are headers, see documentation for more info
    dataTable = google.visualization.arrayToDataTable(dataArray, false);
    return dataTable;
}

// Author: Arun Kumar
// Date Created:
// Last Modified: 4/2/2015
// Description: Takes stat data and divID to generate a graph
// using the Google Charts API
// PRE:
// POST:
function GraphSingle(divID) {
}

// Author:
// Date Created:
// Last Modified:
// Description: Takes stat data from multiple countries and generates a graph
// using data from multiple countries
// PRE:
// POST:
function GraphMultipleCountries(divID) {
	var data= PrepareData();
	var options = {
		vAxis: {
			minValue: 0
		},
		hAxis: {
			format: '####'
		},
		legend: {
			position: 'bottom'
		},
		backgroundColor: '#EAE7C2'
	};
    // instantiate and draw chart using prepared data
    var tab=document.getElementById("divID").children[g_HMSID];
    var chart = new google.visualization.LineChart(document.getElementById(tab.id+"GenSingle"));
    chart.draw(data, options);
}

// Author:
// Date Created:
// Last Modified:
// Description: Takes stat data from multiple countries and generates multiple graphs
// depending on the countries selected
// PRE:
// POST:
function GenerateMultipleGraphs(divID) {
}

// Author:
// Date Created:
// Last Modified:
// Description: Takes stat data from multiple countries and generates a graph
// using data from multiple countries
// PRE:
// POST:
function GraphVaccine(divID) {
	var options = {
		vAxis: {
			minValue: 0
		},
		hAxis: {
			title: "Years", format: '####'
		},
		seriesType: "bars",
		series: {
			0: {type: "line"}
		}
	};
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

    var data = new google.visualization.DataTable();
    
    data.addColumn('number','year');
    
    data.addColumn('number', 'statistic');
    data.addColumn({type: 'boolean', role: 'certainty'});   // false for dotted line, true for solid line

    // get the bound stats from parsed stat list
    var lowerBoundID = -1;
    var upperBoundId = -1;

    for(i=0;i<g_ParsedStatList[1].length;i++)
    {
        if(g_StatID == g_ParsedStatList[1][i])
        {
            lowerBoundID = g_ParsedStatList[2][i];
            lowerBoundID = g_ParsedStatList[3][i];   
        }
    }


    if(lowerBoundID != -1 && g_GraphType == 1)
    {
        data.addColumn('number','lower bound');
        data.addColumn({type: 'boolean', role: 'certainty'});   // false for dotted line, true for solid line
        type = 1;
    }

    if(upperBoundId != -1 && g_GraphType == 1)
    {
        data.addColumn('number', 'upper bound');
        data.addColumn({type: 'boolean', role: 'certainty'});
        type = type + 2;
    }    

    // filling the data table
    for(i=0;i<33;i++)
    {   
        switch(type) 
        {
            case 0:
                data.addRow([1980+i,Number(data[g_StatID][i]),true]);
                break;
            case 1:
                data.addRow([1980+i,Number(data[g_StatID][i]),true,Number(data[lowerBoundId][i]),false]);
                break;
            case 2:
                data.addRow([1980+i,Number(data[g_StatID][i]),true,Number(data[upperBoundId][i]),false]);
                break;
            case 3:
                data.addRow([1980+i,Number(data[g_StatID][i]),true,Number(data[lowerBoundId][i]),false,Number(data[upperBoundId][i]),false]);
                break;
        }
    }


}

// Author: Vanajam Soni
// Date Created: 4/7/2015
// Last Modified: 4/13/2015 by Vanajam Soni
// Description: Generates an ASDS node with all data summed over selected regions
// PRE: N/A
// POST: N/A
function GenerateSumNode(){
    
    var data = new Array(10);   // data for the new node

    var i,j;
    var currentNode;    // list iterator
    
    for(i=0;i<10;i++)   // for each stat
    {
        data[i] = new Array(33);    //  create array to contain data for all years
        for(j=0;j<33;j++)   // for each year
        {   
            currentNode = g_DataList.start;
            for(k=0;k<g_DataList.size;k++)  // for each year, go through all nodes in data list
            {
                if(currentNode.data[i][j] != -1)    // checking for missing data
                        data[i][j] += currentNode.data[i][j];

                currentNode = currentNode.next;
            }
        }
    }
    
    var newNode = new t_AsdsNode(-1,"SUM","SUM",data);

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
    var data = new google.visualization.DataTable();
    data.addColumn('number','year');
    data.addColumn('number', 'MC1');
    data.addColumn('number', 'MC2');
    data.addColumn('number', 'SIA');
    
    var mcv1ID, mcv2ID,siaID;

    mcv1ID = g_StatID;
    mcv2ID = g_ParsedStatList[2][0];
    siaID = g_ParsedStatList[3][0];
    // use parsed stat list to mcv2 and sia ids

    var i,j;
    for(i=0;i<33;i++)
    {
        data.addRow([1980+i,parseFloat(data[mcv1ID][i])*100,parseFloat(data[mcv2ID][i])*100,parseFloat(data[siaID][i])*100]);
    }
    
    return data;   
}

