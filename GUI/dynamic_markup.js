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

// File Name:               dynamic_markup.js
// Description:             This module contains the code needed to dynamically create modules on the client
// Date Created:            3/26/2015
// Contributors:            Paul Jang, Nicholas Denaro, Emma Roudabush
// Date Last Modified:      4/20/2015
// Last Modified By:        Paul Jang
// Dependencies:            index.html, lookup_table.js, data.js
// Additional Notes:        N/A

// Author: Paul Jang, Nicholas Denaro
// Date Created: 3/26/2015
// Last Modified: 4/14/2015 by Nicholas Denaro
// Description: Retrieve stat values from the lookup_table,
//              Builds the tabs and inserts them into index.html
// PRE: lookup_table is filled correctly, index.html exists
// POST: index.html contains tabs of the correct stat data from the lookup_table
function BuildTabs()
{
    var i;
    for(i=0;i<g_ParsedStatList[1].length;i++)
    {
        var temp=g_StatList[g_ParsedStatList[1][i]];
        var div=document.createElement("DIV");
        div.id="id-"+temp;
        div.setAttribute("stat",""+g_ParsedStatList[1][i]);
        div.className="graph-tab";
        div.setAttribute("onclick","ChooseTab(this)");
        div.innerHTML=temp;
        if (temp.indexOf("VACC") > -1)
	{
            div.innerHTML="Vaccinations";
	}
        document.getElementById("tabsDiv").appendChild(div);

        BuildDiv(temp);

        if(g_ParsedStatList[1][i]===g_StatID)
        {
            document.getElementById("id-"+temp+"-graphs").style.display="block";
            div.className="graph-tab selected-tab";
        }
    }
}

// Author: Nicholas Denaro
// Date Created: 4/16/2015
// Last Modified: 4/23/2015 by Kyle Nicholson
// Description: Assigns values to the year ranges
// PRE: lookup_table is filled correctly, index.html exists
// POST: appropriate input tags are modified and g_TempSettings array is initialized
function UpdateInputs()
{
    var startDiv=document.getElementById("year-range-start");
    var endDiv=document.getElementById("year-range-end");
    var heatmapYearDiv=document.getElementById("heatmap-year");
	
	// set min and max for the settings input boxes
    startDiv.max=g_LastYear;
    startDiv.min=g_FirstYear;	
	
    endDiv.max=g_LastYear;
    endDiv.min=g_FirstYear;

    heatmapYearDiv.max=g_LastYear;
    heatmapYearDiv.min=g_FirstYear;
    
    // initialize TempSettings array
    g_TempSettings[0]=g_FirstYear;
    g_TempSettings[1]=g_LastYear;   
    g_TempSettings[2]=g_LastYear;
    g_TempSettings[3]=0;
    g_TempSettings[4]=1;
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
    div.id="id-"+stat+"-graphs";
    div.style.display="none";
    div.style.top="8%";
    div.style.height="87%";
    div.className="graph";
    document.getElementById("graphs").appendChild(div);
}

// Author: Paul Jang, Nicholas Denaro
// Date Created: 3/26/2015
// Last Modified: 4/14/2015 by Nicholas Denaro
// Description: build divs where the graphs go in index.html
// PRE: Called from the onclick of a tab
// POST: previous tab is switched out, and now tab is switched in
function ChooseTab(element)
{
    // remove divs in previous tab
    var parentTabDivName = "id-"+g_StatList[g_StatID]+"-graphs";
    document.getElementById(parentTabDivName).innerHTML = "";
    var prevTab=document.getElementById("id-"+g_StatList[g_StatID]);
    // sets class names of tabs
    prevTab.className="graph-tab";
    element.className="graph-tab selected-tab";
    document.getElementById("id-"+g_StatList[g_StatID]+"-graphs").style.display="none";
    document.getElementById(element.id+"-graphs").style.display="block";
    g_StatID=Number(element.getAttribute("stat"));
    ColorByHMS();

    GenerateSubDivs();
    GenerateGraphs();
}

// Author: Nicholas Denaro
// Date Created: 4/18/2015
// Last Modified: 4/18/2015 by Nicholas Denaro
// Description: Rotates the tabs left or right depending on the direction
// PRE: direction!=0
// POST: The first/last tab is moved to the last/first position
function RotateTabs(direction)
{
    var div;
    var tabs=document.getElementById("tabsDiv");
    var children=tabs.childNodes;
    if(direction>0)
    {
        div=children[0];
        tabs.removeChild(div);
        tabs.appendChild(div);
    }
    else
    {
        div=children[children.length-1];
        tabs.removeChild(div);
        tabs.insertBefore(div,children[0]);
    }
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
// Last Modified: 4/23/2015 by Kyle Nicholson
// Description: Opens the settings overlay
// PRE: N/A
// POST: Settings overlay is showing with black backing mask and all stat values are reset
function OpenSettings()
{
	 ResetAllStatValues();
	 
     $(".settings-screen, .settings-black").fadeIn(400);
     
}

// Author: Emma Roudabush
// Date Created: 3/5/2015
// Last Modified: 4/23/2015 by Kyle Nicholson
// Description: Closes the settings overlay and assigns global values
// PRE: Settings overlay is currently showing on screen
// POST: Settings overlay and mask is gone
function CloseSettings()
{
    $(".settings-screen, .settings-black").fadeOut(400);
        
    var startDiv=document.getElementById("year-range-start");
    var endDiv=document.getElementById("year-range-end");
    var heatmapYearDiv=document.getElementById("heatmap-year");
     
    startDiv.style["box-shadow"]="";
    endDiv.style["box-shadow"]="";
    heatmapYearDiv.style["box-shadow"]="";
       
    document.getElementById(startDiv.id+"-error").innerHTML="";
    document.getElementById(endDiv.id+"-error").innerHTML="";
    document.getElementById(heatmapYearDiv.id+"-error").innerHTML="";
}

// Author: Emma Roudabush
// Date Created: 3/30/2015
// Last Modified: 3/31/2015 by Emma Roudabush
// Description: Opens the settings overlay
// PRE: N/A
// POST: Settings overlay is showing with black backing mask
function OpenHelp()
{
     $(".help-screen, .help-black").fadeIn(400);
}

// Author: Emma Roudabush
// Date Created: 3/5/2015
// Last Modified: 4/16/2015 by Nicholas Denaro
// Description: Closes the settings overlay and assigns global values
// PRE: Settings overlay is currently showing on screen
// POST: Settings overlay and mask is gone
function CloseHelp()
{
    $(".help-screen, .help-black").fadeOut(400);
}

// Author: Emma Roudabush
// Date Created: 3/5/2015
// Last Modified: 4/20/2015 by Kyle Nicholson
// Description: Expands the c ontrol panel
// PRE: N/A
// POST: Control panel is expanded and black mask is in place behind
function Expand()
{
    $(".control-panel").animate({width:"97.5%"}, 500);
    $("#expand").attr("onclick","Shrink()");
    $("#expand").attr("src","res/arrow_left.png");
    $("#scroll-left").fadeOut(400);
    $("#scroll-right").fadeOut(400);
    $(".expand-black").fadeIn(400);
    setTimeout(function () 
    {
        if(g_DataList !== undefined && g_DataList.size != 0)
        {
	        GenerateSubDivs();
	        // if single graph, graph is expanded to whole section
	        if((g_GraphType === 1 && g_StatList[g_StatID].indexOf("VACC") === -1) || (g_GraphType == 2))
	        {
	            document.getElementById("region-graphs-1").style.width = "100%";
	            document.getElementById("region-graphs-1").style.height = "100%";
	        }
	        g_Expanded = true;
	        GenerateSubDivs();
	        GenerateGraphs();
	    }
    }, 500);
}

// Author: Emma Roudabush
// Date Created: 3/5/2015
// Last Modified: 4/16/2015 by Paul Jang
// Description: Shrinks the control panel
// PRE: Control panel is currently expanded
// POST: Control panel shrinks back to original size and black mask is gone
function Shrink()
{
    $(".control-panel").animate({width:"25%"}, 500);
    $("#expand").attr("onclick","Expand()");
    $("#expand").attr("src","res/arrow_right.png");
    $("#scroll-left").fadeIn(400);
    $("#scroll-right").fadeIn(400);
    $(".expand-black").fadeOut(400);
    setTimeout(function()
    {
        g_Expanded = false;
        while(document.getElementById("tabsDiv").childNodes[0]!==document.getElementById("id-"+g_StatList[g_StatID]))
        {
            RotateTabs(-1);
        }
        GenerateSubDivs();
        GenerateGraphs();
    }, 500);  
}


// Author: Paul Jang
// Date Created: 4/2/2015
// Last Modified: 4/20/2015 by Kyle Nicholson
// Description: Calls CreateDiv to dynamically generate subgraph divs and generate graphs
// PRE: CreateDiv functions correctly, g_DataList is properly full
// POST: Divs are created based on how many countries are selected,
//       Correct graphs are filled in the appropriate divs
function GenerateSubDivs()
{
    // only if there are countries in the data list
    if(g_DataList !== undefined)
    {
        var size = g_DataList.size;
        var parentTabDivName = "id-"+g_StatList[g_StatID]+"-graphs";
        var currentNumDivs = document.getElementById(parentTabDivName).childNodes.length;
        var children = document.getElementById(parentTabDivName).childNodes;
        var newNumDivs = size - currentNumDivs;
        var div;
        // if we only need one graph for either combined lines or summation of lines
        if((g_GraphType === 1 && g_StatList[g_StatID].indexOf("VACC") === -1) || g_GraphType == 2)
        {
            document.getElementById(parentTabDivName).innerHTML = "";
            if(size !== 0)
            {
            	CreateSubDiv("region-graphs-1",parentTabDivName);
	        }
            // if the graph section is expanded
            if(g_Expanded)
            {
                // expand graph
                document.getElementById("region-graphs-1").style.width = "100%";
                document.getElementById("region-graphs-1").style.height = "100%";    
            }
        }
        else
        {
            document.getElementById(parentTabDivName).innerHTML = "";
            for(var i = 1; i<=size; i++)
                CreateSubDiv("region-graphs-"+i,parentTabDivName);
            while (g_DataList.size < currentNumDivs)
            {
                $("#region-graphs-"+currentNumDivs).remove();
                currentNumDivs--;
            }
            while (g_DataList.size > currentNumDivs)
            {
                CreateSubDiv("region-graphs-"+(currentNumDivs+1), parentTabDivName);
                currentNumDivs++;
            }
        }
    }
}

// Author: Paul Jang
// Date Created: 4/2/2015
// Last Modified: 4/20/2015 by Paul Jang
// Description: Creates a single div with an inputted id and
//              appends it to the specified parent div
// PRE: Parent div exists
// POST: Single div is appended to the parent div
function CreateSubDiv(id,parent)
{
    var elem = document.createElement('div');
    elem.id = id;
    elem.className = "subgraph";
    var divs=document.getElementsByTagName("div");
    for(var i in divs)
    {
        if(divs[i].className==="control-panel")
        {
            elem.style="max-width: "+divs[i].clientWidth+"px;";
        }
    }
    document.getElementById(parent).appendChild(elem);
    
    if(!g_Expanded)
        document.getElementById(elem.id).style["width"] = "100%";
    else
        document.getElementById(elem.id).style["width"] = "50%";

    document.getElementById(elem.id).style["height"] = "50%";

    if(((g_GraphType !== 1 && g_GraphType !== 2) && g_Expanded) || 
        ((g_StatList[g_StatID].indexOf("VACC") !== -1 && g_GraphType !== 2 && g_Expanded)))
    {
        $(elem).click(function() {
            if(document.getElementById(id).style.width != "100%")
            {
            
                document.getElementById(elem.id).style.width = "100%";
                document.getElementById(elem.id).style.height = "100%";
            }
            else
            {
                document.getElementById(elem.id).style.width = "50%";
                document.getElementById(elem.id).style.height = "50%";
            }
            GenerateGraphs();
        });
    }
}

// Author: Joshua Crafts
// Date Created: 4/17/2015
// Last Modified: 4/17/2015 by Joshua Crafts
// Description: Pops up team info
// PRE: none
// POST: Alert box pops up with info about project contributors
function teamPopup()
{
    window.alert("Stateware Team\nSpring 2015:\nWilliam Bittner,"
        + " Joshua Crafts, Nicholas Denaro, Dylan Fetch, Paul Jang,"
        + " Arun Kumar, Drew Lopreiato, Kyle Nicholson, Emma "
        + "Roudabush, Berty Ruan, Vanajam Soni");
}

// Author: Joshua Crafts
// Date Created: 4/17/2015
// Last Modified: 4/17/2015 by Joshua Crafts
// Description: Pops up info on reporting a bug
// PRE: none
// POST: Alert box pops up with info about and instructions for 
//       reporting a bug
function bugPopup()
{
    window.alert("If you would like to report a bug, please send "
        + "an email to stateware@acm.psu.edu with the following "
        + "details included in your message:\n1. Description of the "
        + "bug\n2. Steps for reproducing the bug\n3. What browser and"
        + " operating system you experienced the bug on\n4. Any "
        + "additional relevant information.");
}
