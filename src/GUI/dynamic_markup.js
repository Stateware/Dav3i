// File Name:               dynamic_markup.js
// Description:             This module contains the code needed to dynamically create modules on the client
// Date Created:            3/26/2015
// Contributors:            Paul Jang, Nicholas Denaro, Emma Roudabush
// Date Last Modified:      4/2/2015
// Last Modified By:        Paul Jang
// Dependencies:            index.html, lookup_table.js, data.js
// Additional Notes:        N/A

// Author: Paul Jang, Nicholas Denaro
// Date Created: 3/26/2015
// Last Modified: 3/26/2015 by Paul Jang
// Description: Retrieve stat values from the lookup_table,
//				Builds the tabs and inserts them into index.html
// PRE: lookup_table is filled correctly, index.html exists
// POST: index.html contains tabs of the correct stat data from the lookup_table
function BuildTabs()
{
	var i;
	for(i=0;i<g_StatList.length;i++)
	{
		if(g_StatList[i].indexOf("Bound")==-1)
		{
			var temp=g_StatList[i];
			var div=document.createElement("DIV");
			div.id="id"+temp;
			//div.class="graph-tab";
			//div.setAttribute("class","graph-tab");
			div.className="graph-tab";
			//div.onclick=ChooseTab;
			div.setAttribute("onclick","ChooseTab(this)");
			div.innerHTML=temp;
			document.getElementById("tabsDiv").appendChild(div);

			BuildDiv(temp);

			if(i==0)
			{
				g_ActiveTab=div;
				document.getElementById("id"+temp+"Graphs").style.display="block";
			}
		}
	}
}

// Author: Paul Jang, Nicholas Denaro
// Date Created: 3/26/2015
// Last Modified: 3/26/2015 by Paul Jang
// Description: build divs where the graphs go in index.html
// PRE: Called from BuildTabs
// POST: appropriate divs are created
function BuildDiv(stat)
{
	var div=document.createElement("DIV");
	div.id="id"+stat+"Graphs";
	div.style.display="none";
	div.className="graph";
	div.innerHTML="graph of "+stat;
	document.getElementById("graphs").appendChild(div);
}

// Author: Paul Jang, Nicholas Denaro
// Date Created: 3/26/2015
// Last Modified: 3/31/2015 by Nicholas Denaro
// Description: build divs where the graphs go in index.html
// PRE: Called from the onclick of a tab
// POST: previous tab is switched out, and now tab is switched in
function ChooseTab(element)
{
	//alert("clicked: "+element.id);
	document.getElementById(g_ActiveTab.id+"Graphs").style.display="none";
	document.getElementById(element.id+"Graphs").style.display="block";
	g_ActiveTab=element;
}

// Author: Emma Roudabush
// Date Created: 3/5/2015
// Last Modified: 3/31/2015 by Emma Roudabush
// Description: Fades the screen back to the main page
// PRE: N/A
// POST: Screen is switched to the main page
function SwitchToMain ()
{
    $(".loading-screen").fadeOut(750);
}

// Author: Emma Roudabush
// Date Created: 3/30/2015
// Last Modified: 3/31/2015 by Emma Roudabush
// Description: Opens the settings overlay
// PRE: N/A
// POST: Settings overlay is showing with black backing mask
function OpenSettings()
{
	 $(".settings-screen, .settings-black").fadeIn(400);
}

// Author: Emma Roudabush
// Date Created: 3/5/2015
// Last Modified: 3/31/2015 by Emma Roudabush
// Description: Closes the settings overlay
// PRE: Settings overlay is currently showing on screen
// POST: Settings overlay and mask is gone
function CloseSettings()
{
	 $(".settings-screen, .settings-black").fadeOut(400);
}

// Author: Emma Roudabush
// Date Created: 3/5/2015
// Last Modified: 4/1/2015 by Nicholas Denaro
// Description: Expands the control panel
// PRE: N/A
// POST: Control panel is expanded and black mask is in place behind
function Expand()
{
	$(".control-panel").animate({width:"97.5%"}, 500);
	$("#expand").attr("onclick","Shrink()");
	$("#graph-tab-tooltip").fadeOut(400);
	$(".expand-black").fadeIn(400);
}

// Author: Emma Roudabush
// Date Created: 3/5/2015
// Last Modified: 4/1/2015 by Nicholas Denaro
// Description: Shrinks the control panel
// PRE: Control panel is currently expanded
// POST: Control panel shrinks back to original size and black mask is gone
function Shrink()
{
	$(".control-panel").animate({width:"25%"}, 500);
	$("#expand").attr("onclick","Expand()");
	$("#graph-tab-tooltip").fadeIn(400);
	$(".expand-black").fadeOut(400);
}

// Author: Paul Jang
// Date Created: 4/2/2015
// Last Modified: 4/2/2015 by Paul Jang
// Description: Calls CreateDiv to dynamically generate subgraph divs and generate graphs
// PRE: CreateDiv functions correctly, g_DataList is properly full
// POST: Divs are created based on how many countries are selected
function GenerateSubDivs()
{
	var head = g_DataList;
	var statIndex = g_ActiveTab.getAttribute("stat");
	var chart;
	var data;
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
	while(head != NULL)
	{
		CreateSubDiv("id-"+head.name+'-'+g_StatList[statIndex]+"-subgraphs", "id-"+g_StatList[statIndex]+"-graphs");
		head = head.next;
		chart = new google.visualization.LineChart(document.getElementById("id-"+head.name+'-'+g_StatList[statIndex]+"-subgraphs"));
		chart.draw(data,options);
	}
}

// Author: Paul Jang
// Date Created: 4/2/2015
// Last Modified: 4/2/2015 by Paul Jang
// Description: Creates a single div with an inputted id and
//              appends it to the specified parent div
// PRE: Parent div exists
// POST: Single div is appended to the parent div
function CreateSubDiv(id,parent)
{
	var elem = document.createElement('div');
	elem.id = id;
	document.getElementById(parent).appendChild(elem);
	document.body.appendChild(elem);
}