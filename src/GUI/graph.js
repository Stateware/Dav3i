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