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

function BuildTabs()
// PRE:  .control-panel is loaded in the document, g_Stats is initialized with server data
// POST: .control-panel contains all stat tabs, including 'custom'
{
    var i;

    // create stat tabs and divs
    for(i in g_Stats)
    {
	if (g_Stats.hasOwnProperty(i)) {
            document.getElementById("tabsDiv").appendChild(CreateTab(g_Stats[i].name, i));
        }
    }

    // create custom tab and div
    document.getElementById("tabsDiv").appendChild(CreateTab('Custom', 'custom'));
}

function CreateTab(name, id)
// PRE:  name is a text string representing the name to put on the tab
//       id is a text string to be used to create that tab's id
// POST: FCTVAL == a tab with text name and id id,
//       and a div to go with this tab is created in the control panel
{
    var div;

    div=document.createElement("div");
    div.id="id-"+id;
    div.setAttribute("stat", id);
    div.className="graph-tab";
    div.setAttribute("onclick","ChooseTab(this)");
    div.innerHTML=name;

    BuildDiv(id);

    if(id === g_StatId)
    {
        document.getElementById("id-"+id+"-graphs").style.display="block";
        div.className="graph-tab selected-tab";
    }

    return div;
}

function UpdateInputs()
// PRE:  .settings-screen is loaded in the document, g_FirstYear and g_LastYear are initialized
//       with server data
// POST: default settings values are set and g_TempSettings array is initialized with original settings
{
    var startDiv=document.getElementById("year-range-start"),
        endDiv=document.getElementById("year-range-end"),
        heatmapYearDiv=document.getElementById("heatmap-year");
	
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
    g_TempSettings[4]=0;
}

function BuildDiv(statId)
// PRE: Called from BuildTabs
// POST: appropriate divs are created
{
    var div=document.createElement("DIV");
    div.id="id-"+statId+"-graphs";
    div.style.display="none";
    div.style.top="18%";
    div.style.height="77%";
    div.className="graph";
    document.getElementById("graphs").appendChild(BuildDropDown(statId));
    document.getElementById("graphs").appendChild(div);
}

function BuildDropDown(statId)
// PRE:  statId is the name of some data table from the database
//       ParseData() has been called and all globals have been set successfully
// POST: FCTVAL == a div object which contains a dropdown menu with indices of all
//       data sets relevant to statId and their tags if they exist
{
    var div=document.createElement("DIV"),
        menu = "";
        div.id="id-"+statId+"-dropdown";
        div.style.display="none";
        div.style.top="8%";
        div.style.height="10%";
        div.className="graph";

    if (g_StatId === 'custom')
    {
        menu += "<p class='open-sans'>Select Data Set</p><select name='stat1' onchange='SelectIndex(this)'>";
        for (i in g_Stats)
        {
	    if (g_StatshasOwnProperty(i))
            {
                menu += "<option value='" + i + "'>" + i + " - ";
            }
        }
    }
    else
    {
        menu += "<p class='open-sans'>Select Data Set</p><select name='index' onchange='SelectIndex(this)'>";
        for (i in g_Stats[g_StatId]['tags'])
        {
	    if (g_Stats[g_StatId].tags.hasOwnProperty(i))
            {
                menu += "<option value='" + i + "'>" + i + " - ";
                if (g_Stats[g_StatId].tags[i] === "")
                {
                    menu += "untagged";
                }
                else
                {
                    menu += g_Stats[g_StatId].tags[g_SelectedIndex];
                }
                menu += "</option></br>";
            }
        }
        menu += "</select>";
    }

    div.innerHTML = menu;

    return div;
}

function ChooseTab(element)
// PRE: Called from the onclick of a tab
// POST: previous tab is switched out, and now tab is switched in
{
    var parentTabDivName,
        prevTab,
        menu = "";

    g_SelectedIndex = 0;
    // remove divs in previous tab
    parentTabDivName = "id-"+g_StatId+"-graphs";
    document.getElementById(parentTabDivName).innerHTML = "";
    prevTab=document.getElementById("id-"+g_StatId);
    // sets class names of tabs
    prevTab.className="graph-tab";
    element.className="graph-tab selected-tab";
    document.getElementById("id-"+g_StatId+"-graphs").style.display="none";
    document.getElementById("id-"+g_StatId+"-dropdown").style.display="none";
    document.getElementById(element.id+"-graphs").style.display="block";
    document.getElementById(element.id+"-dropdown").style.display="block";
    g_StatId=element.getAttribute("stat");

    if (g_StatId !== 'custom')
    {
        ColorByHms();	
    }

    document.getElementById(element.id+"-graphs").innerHTML=menu;
    GenerateSubDivs();
    if (g_GraphType === 0 || g_GraphType === 1 && g_Stats[g_StatId].type === 'int')
    {
        FixDivSize();
    }
    GenerateGraphs();
}

function RotateTabs(direction)
// PRE: direction!=0
// POST: The first/last tab is moved to the last/first position
{
    var div,
    tabs=document.getElementById("tabsDiv"),
    children=tabs.childNodes;

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

function SwitchToMain ()
// PRE: N/A
// POST: Screen is switched to the main page
{
    $(".loading-screen").fadeOut(750);
}

function OpenSettings()
// PRE: N/A
// POST: Settings overlay is showing with black backing mask and all stat values are reset
{
     ResetAllStatValues();
	 
     $(".settings-screen, .settings-black").fadeIn(400);
     
}

function CloseSettings()
// PRE: Settings overlay is currently showing on screen
// POST: Settings overlay and mask is gone
{
    $(".settings-screen, .settings-black").fadeOut(400);
        
    var startDiv=document.getElementById("year-range-start"),
        endDiv=document.getElementById("year-range-end"),
        heatmapYearDiv=document.getElementById("heatmap-year");
     
    startDiv.style["box-shadow"]="";
    endDiv.style["box-shadow"]="";
    heatmapYearDiv.style["box-shadow"]="";
       
    document.getElementById(startDiv.id+"-error").innerHTML="";
    document.getElementById(endDiv.id+"-error").innerHTML="";
    document.getElementById(heatmapYearDiv.id+"-error").innerHTML="";
}

function OpenHelp()
// PRE: N/A
// POST: Settings overlay is showing with black backing mask
{
     $(".help-screen, .help-black").fadeIn(400);
}

function CloseHelp()
// PRE: Settings overlay is currently showing on screen
// POST: Settings overlay and mask is gone
{
    $(".help-screen, .help-black").fadeOut(400);
}

function Expand()
// PRE: N/A
// POST: Control panel is expanded and black mask is in place behind
{
    $(".control-panel").animate({width:"97.5%"}, 500);
    $("#expand").attr("onclick","Shrink()");
    $("#expand").attr("src","res/arrow_left.png");
    $("#scroll-left").fadeOut(400);
    $("#scroll-right").fadeOut(400);
    $(".expand-black").fadeIn(400);
    setTimeout(function () 
    {
        if(g_DataList !== undefined && g_DataList.size !== 0)
        {
	        g_Expanded = true;
	        GenerateSubDivs();
	        // if single graph, graph is expanded to whole section
	        if(g_GraphType === 1 && g_StatList[g_StatId].type !== 'int' || g_GraphType === 2)
	        {
	            document.getElementById("region-graphs-1").style.width = "100%";
	            document.getElementById("region-graphs-1").style.height = "100%";
	        }
                else
                {
                    FixDivSize();
                }
	        GenerateGraphs();
	    }
    }, 500);
}

function Shrink()
// PRE: Control panel is currently expanded
// POST: Control panel shrinks back to original size and black mask is gone
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
        GenerateSubDivs();
        FixDivSize(); 
        GenerateGraphs();
    }, 500);
}

function GenerateSubDivs()
// PRE: g_DataList is initialized
// POST: Divs are created based on how many countries are selected,
//       Correct graphs are filled in the appropriate divs based on graph type
{
    var i,
        parentTabDivName,
        currentNumDivs,
        children,
        newNumDivs;

    // only if there are countries in the data list
    if(g_DataList !== undefined)
    {
        parentTabDivName = "id-"+g_StatId+"-graphs";
        currentNumDivs = document.getElementById(parentTabDivName).childNodes.length;
        children = document.getElementById(parentTabDivName).childNodes;
        // if we only need one graph for either combined lines or summation of lines
        if(g_GraphType === 1 && g_Stats[g_StatId].type !== 'int' || g_GraphType === 2)
        {
            if(g_DataList.size !== 0)
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
            FixDivNum(currentNumDivs, parentTabDivName);
        }
    }
}

function FixDivNum(numDivs, parent)
// PRE:  numDivs is the current number of divs available for graphing, and the g_GraphType
//       is 1 or g_GraphType is 2 and the selected stat type is 'int'
//       parent is the parent element into which any new divs must be appended
// POST: numDivs == g_DataList.size
{
   while (g_DataList.size < numDivs)
   {
       $("#region-graphs-"+numDivs).remove();
       numDivs--;
   }
   while (g_DataList.size > numDivs)
   {
       CreateSubDiv("region-graphs-"+(numDivs+1), parent);
       numDivs++;
   }
}

function CreateSubDiv(id,parent)
// PRE: div parent with id id exists
// POST: Single div is appended to parent
{
    var elem = document.createElement('div'),
        divs,
        i;
    elem.id = id;
    elem.className = "subgraph";
    divs=document.getElementsByTagName("div");

    document.getElementById(parent).appendChild(elem);

    if(g_Expanded  && (g_GraphType === 0 || 
        (g_Stats[g_StatId].type === 'int' && g_GraphType === 1)))
    {
        $(elem).click(function() {
            if(document.getElementById(id).style.width !== "100%")
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

function FixDivSize()
// PRE:  g_GraphType == 0 or g_GraphType == 1 and the stat being graphed is of type 'int'
//       graph divs "region-graphs-1" through "region-graphs-" + g_DataList.size+1 exist in the document
//       g_DataList is initialized and contains relevant data
// POST: the size of the graph divs is adjusted to fit the view, either to fit a quarter of the expanded view, or half
//       of the collapsed view (vertically)
{
    var i;

    for (i = 0; i < g_DataList.size; i++)
    {
        if(!g_Expanded)
        {
            document.getElementById("region-graphs-"+(i+1)).style.width = "100%";
        }
        else
        {
            document.getElementById("region-graphs-"+(i+1)).style.width = "50%";
        }
        document.getElementById("region-graphs-"+(i+1)).style.height = "50%";
    }
}

function teamPopup()
// PRE: none
// POST: Alert box pops up with info about project contributors
{
    window.alert("Stateware Team\nSpring 2015:\nWilliam Bittner," + 
        " Joshua Crafts, Nicholas Denaro, Dylan Fetch, Paul Jang," + 
        " Arun Kumar, Drew Lopreiato, Kyle Nicholson, Emma " + "Roudabush, Berty Ruan, Vanajam Soni");
}

function bugPopup()
// PRE: none
// POST: Alert box pops up with info about and instructions for 
//       reporting a bug
{
    window.alert("If you would like to report a bug, please send " + "an email to stateware@acm.psu.edu with the following " + 
        "details included in your message:\n1. Description of the " + "bug\n2. Steps for reproducing the bug\n3. What browser and" + 
        " operating system you experienced the bug on\n4. Any " + "additional relevant information.");
}
