// File Name:               dynamic_markup.js
// Description:             This module contains the code needed to dynamically create modules on the client
// Date Created:            3/26/2015
// Contributors:            Paul Jang, Nicholas Denaro
// Date Last Modified:      3/31/2015
// Last Modified By:        Emma Roudabush
// Dependencies:            index.html, lookup_table.js
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
	div.innerHTML="graph of "+stat;
	document.getElementById("graphs").appendChild(div);
}

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


function OpenSettings()
{
	 $(".settings-screen, .settings-overlay").fadeIn(400);
}

function CloseSettings()
{
	 $(".settings-screen, .settings-overlay").fadeOut(400);
}

function Expand()
{
	$(".control-panel").animate({width:"97.5%"}, 500);
	$("#expand").attr("onclick","Shrink()");
}

function Shrink()
{
	$(".control-panel").animate({width:"25%"}, 500);
	$("#expand").attr("onclick","Expand()");
}