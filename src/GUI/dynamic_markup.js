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
// Last Modified: 10/8/2015 by Nicholas Denaro
// Description: Retrieve stat values from the lookup_table,
//              Builds the tabs and inserts them into index.html
// PRE: lookup_table is filled correctly, index.html exists
// POST: index.html contains tabs of the correct stat data from the lookup_table. FCTVAL == Number of tabs created.
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
            div.innerHTML="Vaccinations";
        document.getElementById("tabsDiv").appendChild(div);

        BuildDiv(temp);

        if(g_ParsedStatList[1][i]==g_StatID)
        {
            document.getElementById("id-"+temp+"-graphs").style.display="block";
            div.className="graph-tab selected-tab";
        }
    }
    return(g_ParsedStatList[1].length);
}

// Author: Nicholas Denaro
// Date Created: 4/16/2015
// Last Modified: 9/28/2015 by Murlin Wei
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
    
    var tempSettings = [g_FirstYear, g_LastYear, g_LastYear, 0, 1];
    return tempSettings
}

// Author: Paul Jang, Nicholas Denaro
// Date Created: 3/26/2015
// Last Modified: 10/8/2015 by Nicholas Denaro
// Description: build divs where the graphs go in index.html
// PRE: Called from BuildTabs
// POST: appropriate divs are created. FCTVAL == The created div.
function BuildDiv(stat)
{
    var div=document.createElement("DIV");
    div.id="id-"+stat+"-graphs";
    div.style.display="none";
    div.style.top="8%";
    div.style.height="87%";
    div.className="graph";
    document.getElementById("graphs").appendChild(div);
    return(div);
}

// Author: Paul Jang, Nicholas Denaro
// Date Created: 3/26/2015
// Last Modified: 4/14/2015 by Nicholas Denaro
// Description: build divs where the graphs go in index.html
// PRE: Called from the onclick of a tab
// POST: previous tab is switched out, and now tab is switched in. FCTVAL == currently selected stat id.
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
    return(g_StatID);
}

// Author: Nicholas Denaro
// Date Created: 4/18/2015
// Last Modified: 10/8/2015 by Nicholas Denaro
// Description: Rotates the tabs left or right depending on the direction
// PRE: direction!=0
// POST: The first/last tab is moved to the last/first position. FCTVAL == The first tab.
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
    return(tabs.childNodes[0]);
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

// sample json in the format of the descriptor
var dataJSON = {
        "instances": {"1": "instance1", "3": "instance2", "4": "instance3", "7": "instance4"},
        "sessions": {"1": "session1", "2": "session2", "3": "session3"},
        "stats": {"1":"births","2":"deaths","3":"cases","4":"mcv1","5":"mcv2","6":"populations","7":"sia","8":"lbe_cases","9":"lbe_mortality","10":"ube_cases","11":"ube_mortality","12":"e_cases","13":"e_mortality"}
};

/* Function OpenNewTabMenu()
/*
/*      Causes the menu for creating new custom tabs to appear on the client
/*
/* Parameters: 
/*
/*      none
/*
/* Pre:
/*
/*      the html elements of the menu exists
/*
/* Post:
/*
/*      a popup menu with options to create a custom tab appears on the client
/*
/* Returns:
/*
/*      none
/*
/* Authors:
/*
/*      Paul Jang
/*
/* Date Created:
/*
/*      2/19/2016
/*
/* Last Modified:
/*
/*      2/19/2016 by Paul Jang
 */
function OpenNewTabMenu()
{
    $(".new-custom-tab-menu, .settings-black").fadeIn(400);
}

/* Function OpenNewTabMenu()
/*
/*      Closes the new custom tab creation menu
/*
/* Parameters: 
/*
/*      none
/*
/* Pre:
/*
/*      the custom tab menu is open
/*
/* Post:
/*
/*      the client goes back to the main page
/*
/* Returns:
/*
/*      none
/*
/* Authors:
/*
/*      Paul Jang
/*
/* Date Created:
/*
/*      2/19/2016
/*
/* Last Modified:
/*
/*      2/19/2016 by Paul Jang
 */
function CloseNewTabMenu()
{
    $(".new-custom-tab-menu, .settings-black").fadeOut(400);
} 

/* Function switchNewTabMenu()
/*
/*      Switches the new tab popup menu to either the stat menu or the instance menu
/*
/* Parameters: 
/*
/*      none
/*
/* Pre:
/*
/*      the elements of the new tab popup menu exist
/*
/* Post:
/*
/*      the new tab menu switches to the specified type
/*
/* Returns:
/*
/*      none
/*
/* Authors:
/*
/*      Paul Jang
/*
/* Date Created:
/*
/*      2/22/2016
/*
/* Last Modified:
/*
/*      2/22/2016 by Paul Jang
 */
function switchNewTabMenu(type)
{
    if(type == "stat")
    {
        $(".stat-custom-tab").fadeIn(0);
        $(".instance-custom-tab").fadeOut(0);
    }
    else if(type == "instance")
    {
        $(".instance-custom-tab").fadeIn(0);
        $(".stat-custom-tab").fadeOut(0);
    }
    else
    {
        alert("Something went wrong in the switching of the new tab menu");
    }
}

/* Function SetNewTabMenu()
/*
/*      Causes the menu for creating new custom tabs to appear on the client
/*
/* Parameters: 
/*
/*      type of tab (either stat or instance), descriptor to fill the stat/instance dropdowns
/*
/* Pre:
/*
/*      the html elements of the menu exists
/*
/* Post:
/*
/*      the menu changes to accomodate the type of tab the user wants
/*
/* Returns:
/*
/*      none
/*
/* Authors:
/*
/*      Paul Jang
/*
/* Date Created:
/*
/*      2/19/2016
/*
/* Last Modified:
/*
/*      2/19/2016 by Paul Jang
 */
function PopulateNewTabMenu(descriptor)
{
    // STAT MENU POPULATION
    // grab corresponding dropdown elements
    var stat1 = document.getElementById("stat_stat1");
    var stat2 = document.getElementById("stat_stat2");

    // clear stat menu dropdowns
    stat1.innerHTML = "";
    stat2.innerHTML = "";

    // retrieve the stat list from the global
    var statList = g_ParsedStatList;

    // loop through the keys and add the options to both the stat dropdowns
    for(var i = 0; i<statList.length; i++)
    {
        var curr = statList[i];
        var newOption = new Option(i,curr);
        stat1.appendChild(newOption);
    }

    // loop through the keys and add the options to both the stat dropdowns
    for(var i = 0; i<statList.length; i++)
    {
        var curr = statList[i];
        var newOption = new Option(i,curr);
        stat2.appendChild(newOption);
    }
    
    // INSTANCE MENU POPULATION
    // grab corresponding dropdown elements
    var instance = document.getElementById("instance_instance2");
    var stat = document.getElementById("instance_stat1");

    // clear instance menu dropdowns
    instance.innerHTML = "";
    stat.innerHTML = "";

    // retrieve the stat list from the global
    var statList = descriptor["stats"];//g_ParsedStatList;

    // retrieve the instance object from the descriptor
    var instances = descriptor["instances"];

    // retrieve the keys from the instance object
    var instanceKeys = Object.keys(instances);

    // loop through the keys of the stats and add them to the stat dropdown
    for(var i = 0; i<statList.length; i++)
    {
        var curr = statList[i];
        var newOption = new Option(i,curr);
        stat.appendChild(newOption);
    }

    // loop through the keys of the instances and add them to the instance dropdown
    for(var i = 0; i<instanceKeys.length; i++)
    {
        var curr = instanceKeys[i];
        var newOption = new Option(instances[curr],curr);
        instance.appendChild(newOption);
    }
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
        if(g_DataList != undefined && g_DataList.size != 0)
        {
            GenerateSubDivs();
            // if single graph, graph is expanded to whole section
            if(((g_GraphType == 1) && (g_StatList[g_StatID].indexOf("VACC") == -1)) || (g_GraphType == 2))
            {
                document.getElementById("region-graphs-1").style["width"] = "100%";
                document.getElementById("region-graphs-1").style["height"] = "100%";
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
        while(document.getElementById("tabsDiv").childNodes[0]!=document.getElementById("id-"+g_StatList[g_StatID]))
        {
            RotateTabs(-1);
        }
        GenerateSubDivs();
        GenerateGraphs();
    }, 500);  
}


// Author: Paul Jang, Kyle Nicholson
// Date Created: 4/2/2015
// Last Modified: 10/8/2015 by Nicholas Denaro
// Description: Calls CreateDiv to dynamically generate subgraph divs and generate graphs
// PRE: CreateDiv functions correctly, g_DataList is properly full
// POST: Divs are created based on how many countries are selected,
//       Correct graphs are filled in the appropriate divs. FCTVAL == number of sub divs generated, -1 if data list is undefined.
function GenerateSubDivs()
{
    // only if there are countries in the data list
    if(g_DataList != undefined)
    {
        var size = g_DataList.size;
        var parentTabDivName = "id-"+g_StatList[g_StatID]+"-graphs";
        var currentNumDivs = document.getElementById(parentTabDivName).childNodes.length;
        var children = document.getElementById(parentTabDivName).childNodes;
        var newNumDivs = size - currentNumDivs;
        // if we only need one graph for either combined lines or summation of lines
        if(((g_GraphType == 1) && (g_StatList[g_StatID].indexOf("VACC") == -1)) || (g_GraphType == 2))
        {
            document.getElementById(parentTabDivName).innerHTML = "";
            if(size != 0)
            {
                CreateSubDiv("region-graphs-1",parentTabDivName);
            }
            // if the graph section is expanded
            if(g_Expanded)
            {
                // expand graph
                document.getElementById("region-graphs-1").style["width"] = "100%";
                document.getElementById("region-graphs-1").style["height"] = "100%";    
            }
            return(1);
        }
        else
        {
            document.getElementById(parentTabDivName).innerHTML = "";
            for(var i = 1; i<=size; i++)
                CreateSubDiv("region-graphs-"+i,parentTabDivName);
            return(size);
        }
    }
    else
        return(-1);
    return(0);
}

// Author: Paul Jang
// Date Created: 4/2/2015
// Last Modified: 10/8/2015 by Nicholas Denaro
// Description: Creates a single div with an inputted id and
//              appends it to the specified parent div
// PRE: Parent div exists
// POST: Single div is appended to the parent div. FCTVAL == The sub div.
function CreateSubDiv(id,parent)
{
    var elem = document.createElement('div');
    elem.id = id;
    elem.className = "subgraph";
    var divs=document.getElementsByTagName("div");
    for(var i in divs)
    {
        if(divs[i].className=="control-panel")
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

    if((((g_GraphType != 1) && (g_GraphType != 2)) && g_Expanded) || 
        ((g_StatList[g_StatID].indexOf("VACC") != -1 && g_GraphType != 2 && g_Expanded)))
    {
        $(elem).click(function() {
            if(document.getElementById(id).style.width != "100%")
            {
            
                document.getElementById(elem.id).style["width"] = "100%";
                document.getElementById(elem.id).style["height"] = "100%";
            }
            else
            {
                document.getElementById(elem.id).style["width"] = "50%";
                document.getElementById(elem.id).style["height"] = "50%";
            }
            GenerateGraphs();
        });
    }
    return(elem);
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

/* 
 * Function: onSessionChange()
 *
 *      Called when a session is changed in the dropdown menu
 *
 * Parameters: 
 *
 *      none
 *
 * Pre: 
 *
 *      dropdown entitled "sessionSelect" exists, helper functions work correctly
 *
 * Post:
 *
 *      the selected session will show in the dropdown, the instances dropdown will be filled with the instances from that session, and the dataset is changed to the new session's data
 *
 * Returns: 
 *
 *      the id of the new selected session
 *
 * Authors: 
 *
 *      Paul Jang
 *
 * Date Created:
 *
 *      2/10/2016
 *
 * Last Modified:
 *
 *      2/10/2016 by Paul Jang
 */
function onSessionChange()
{
    // grab the id of the current session
    var currentSession = getSelectedSession("id");

    // recall the descriptor, which repopulates the dropdowns
    GetDescriptor(currentSession);
}

/* 
 * Function: onInstanceChange()
 *
 *      Called when an instance is changed in the dropdown menu
 *
 * Parameters: 
 *
 *      none
 *
 * Pre: 
 *
 *      none
 *
 * Post:
 *
 *      the dataset is changed to the new instance's data
 *
 * Returns: 
 *
 *      the id of the new selected instance
 *
 * Authors: 
 *
 *      Paul Jang
 *
 * Date Created:
 *
 *      2/10/2016
 *
 * Last Modified:
 *
 *      2/10/2016 by Paul Jang
 */
function onInstanceChange()
{
    // for now, alert the user that the instance has been changed, and that this function has been called
    // TODO: add functionality to change instance data set when instance is changed
    var newInstance = $('#instanceSelect').find(":selected").text();
    return newInstance;
}

/* 
 * Function: fillSessionDropDown()
 *
 *      Fills the session drop down menu with the sessions that currently have data in the database.
 *
 * Parameters: 
 *
 *      a JSON that is pulled from the descriptor
 *
 * Pre: 
 *
 *      dropdown entitled "sessionSelect" exists, json with data exists somewhere
 *
 * Post:
 *
 *      the dropdown menu on the graph menu is filled with all sessions currently in the database
 *
 * Returns: 
 *
 *      the name of the new selected session
 *
 * Authors: 
 *
 *      Paul Jang
 *
 * Date Created:
 *
 *      11/12/2015
 *
 * Last Modified:
 *
 *      2/8/2016 by Paul Jang
 */
function fillSessionDropDown(descriptor, init)
{
    var selected;
    // if it's the initial filling of the dropdown menus
    if(!init)
    {
        selected = getSelectedSession("text");
    }

    // retrieve the list of sessions from the descriptor
    var sessions = descriptor["sessions"];

    // retrieve the keys from the sessions object
    var keys = Object.keys(sessions);

    // clear the dropdown
    sessionSelect.innerHTML = "";

    // loop through the keys and add them to the dropdown
    for(var i = 0; i<keys.length; i++)
    {
        var curr = keys[i];
        var newOption = new Option(sessions[curr],curr);
        sessionSelect.appendChild(newOption);
        if(!init)
        {
            // check if the current element is selected, if so, select it
            if(sessions[curr] == selected)
            {
                $(newOption).attr("selected","selected");
            }
        }
    }

    // returns the name of the new selected session
    return getSelectedSession("text");
}

/* 
 * Function: fillInstanceDropDown()
 *
 *      Fills the instance drop down menu with the instances from the current session.
 *
 * Parameters: 
 *
 *      none
 *
 * Pre:
 *
 *      "sessionSelect" and "instanceSelect" exists
 *
 * Post:
 *
 *      instance drop down menu on graph menu fills with all instances in selected session
 *
 * Returns:
 *
 *      the name of the new selected instance
 *
 * Authors:
 *
 *      Paul Jang
 *
 * Date Created:
 *
 *      11/12/2015
 *
 * Last Modified:
 *
 *      11/13/2015 by Paul Jang
 */
function fillInstanceDropDown(descriptor)
{
    // clear instance drop down
    instanceSelect.innerHTML = "";
    
    // retrieve the instances object from the descriptor
    var instances = descriptor["instances"];

    // retrieve the keys from the instances object
    var keys = Object.keys(instances);

    // loop through the keys and add the options to the instance dropdown
    for(var i = 0; i<keys.length; i++)
    {
        var curr = keys[i];
        var newOption = new Option(instances[curr],curr);
        instanceSelect.appendChild(newOption);
    }

    // returns the name of new selected instance
    return $('#instanceSelect').find(":selected").text();
}

/* 
 * Function: getSelectedSession()
 *
 *      Retrieves the session that is currently selected in the dropdown menu of all sessions.
 *
 * Parameters: 
 *
 *      type: "id" if id should be returned, "text" if text value should be returned
 *
 * Pre:
 *
 *      A dropdown of sessions exist and one of the sessions is chosen.
 *
 * Post:
 *
 *      none
 *
 * Returns:
 *
 *      the id of the currently selected session
 *
 * Authors:
 *
 *      Paul Jang
 *
 * Date Created:
 *
 *      2/4/2016
 *
 * Last Modified:
 *
 *      2/22/2016 by Paul Jang
 */
function getSelectedSession(type)
{
    var value;
    if(type == 'id') // return the id of the selected session
    {
        // get the value by getting the selected index, and then using that index to get the selected session, and then getting the value
        value = document.getElementById("sessionSelect")[document.getElementById("sessionSelect").selectedIndex].value;
    }
    else if(type = 'text') // return the text of the selected session
    {
        value = $('#sessionSelect').find(":selected").text();
    }
    else
    {
        alert("Something went wrong in getting the selected session.")
    }
    return value;
}

/* 
 * Function: getSelectedInstance()
 *
 *      Retrieves the instance that is currently selected in the dropdown menu of instances.
 *
 * Parameters: 
 *
 *      none
 *
 * Pre:
 *
 *      A dropdown of instances exist and one of the instances is chosen.
 *
 * Post:
 *
 *      none
 *
 * Returns:
 *
 *      the id of the currently selected instance
 *
 * Authors:
 *
 *      Paul Jang
 *
 * Date Created:
 *
 *      2/4/2016
 *
 * Last Modified:
 *
 *      2/8/2016 by Paul Jang
 */
function getSelectedInstance(type)
{
    if(type == 'id') // return the id of the selected instance
    {
        // get the value by getting the selected index, and then using that index to get the selected session, and then getting the value
        value = document.getElementById("instanceSelect")[document.getElementById("instanceSelect").selectedIndex].value;
    }
    else if(type == 'text') // return the text of the selected instance
    {
        value = $('#instanceSelect').find(":selected").text();
    }
    else
    {
        alert("Something went wrong in getting the selected session.")
        value = 0;
    }
    return value;
}

 
