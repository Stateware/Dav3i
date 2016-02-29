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
// Date Last Modified:      2/29/2016
// Last Modified By:        Paul Jang
// Dependencies:            index.html, lookup_table.js, data.js
// Additional Notes:        N/A


/* Function BuildTabs()
/*
/*      Fills in the tab selection dropdown menu
/*
/* Parameters: 
/*
/*      none
/*
/* Pre:
/*
/*      lookup_table is filled correctly, index.html exists, tabDropdown element exists
/*
/* Post:
/*
/*      the tab selection dropdown is populated with the correct stats
/*
/* Returns:
/*
/*      the number of stats that populated the dropdown menu
/*
/* Authors:
/*
/*      Paul Jang, Nicholas Denaro
/*
/* Date Created:
/*
/*      3/26/2015
/*
/* Last Modified:
/*
/*      2/29/2016 by Paul Jang
 */
function BuildTabs()
{
    var i;
    var tabDropdown = document.getElementById("tabDropdown");
    tabDropdown.innerHTML = "";

    for(i=0;i<g_ParsedStatList[1].length;i++)
    {
        var temp=g_StatList[g_ParsedStatList[1][i]];
        var newOption = new Option(temp,g_ParsedStatList[1][i]);

        newOption.id="id-"+temp;

        if (temp.indexOf("VACC") > -1)
        {
            newOption.text="Vaccinations";
        }
        
        tabDropdown.appendChild(newOption);

        BuildDiv(temp);
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

/* Function ChooseTab()
/*
/*      Build divs where the graphs go in index.html
/*
/* Parameters: 
/*
/*      none
/*
/* Pre:
/*
/*      called from the changing of the selected option in the tab dropdown menu
/*
/* Post:
/*
/*      previous tab is switched out, and now tab is switched in
/*
/* Returns:
/*
/*      the number of stats that populated the dropdown menu
/*
/* Authors:
/*
/*      Paul Jang, Nicholas Denaro
/*
/* Date Created:
/*
/*      3/26/2015
/*
/* Last Modified:
/*
/*      2/29/2016 by Paul Jang
 */
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
    g_StatID=GetSelectedDropdown("tabDropdown", "id");
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

/* Function PopulateNewTabMenu()
/*
/*      Fills the elements of the new tab menu popup
/*
/* Parameters: 
/*
/*      descriptor to fill the stat dropdowns exists
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
/*      2/26/2016 by Paul Jang
 */
function PopulateNewTabMenu(descriptor)
{
    // grab corresponding dropdown elements
    var stat1 = document.getElementById("stat_stat1");
    var stat2 = document.getElementById("stat_stat2");

    // clear stat menu dropdowns
    stat1.innerHTML = "";
    stat2.innerHTML = "";

    // retrieve the stat list from the global
    var statList = GetHeadStatList();

    // loop through the keys and add the options to both the stat dropdowns
    for(var i = 0; i<statList.length; i++)
    {
        var curr = statList[i];
        var newOption = new Option(curr,i);
        stat1.appendChild(newOption);
    }

    // loop through the keys and add the options to both the stat dropdowns
    for(var i = 0; i<statList.length; i++)
    {
        var curr = statList[i];
        var newOption = new Option(curr,i);
        stat2.appendChild(newOption);
    }
    
}

/* Function OKNewTabMenu()
/*
/*      When user clicks ok from new tab menu, create new custom tab
/*
/* Parameters: 
/*
/*      none
/*
/* Pre:
/*
/*      user clicks the ok button in new tab menu
/*
/* Post:
/*
/*      the new tab menu closes and a new tab is created in the tabs menu
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
/*      2/27/2016
/*
/* Last Modified:
/*
/*      2/29/2016 by Paul Jang
 */
function OkNewTabMenu()
{
    // grab stats and name from new tab menu
    var stat1 = $("#stat_stat1").find(":selected").text();
    var stat2 = $("#stat_stat2").find(":selected").text();
    var name = document.getElementById("new-tab-name").value;

    // add option to dropdown
    var newOption = new Option(name, 1);
    document.getElementById("tabDropdown").appendChild(newOption);

    // return back to main page
    CloseNewTabMenu();
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
 * Function: OnSessionChange()
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
function OnSessionChange()
{
    // grab the id of the current session
    var currentSession = GetSelectedDropdown("sessionSelect","id");

    // recall the descriptor, which repopulates the dropdowns
    GetDescriptor(currentSession);
}

/* 
 * Function: OnInstanceChange()
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
function OnInstanceChange()
{
    // for now, alert the user that the instance has been changed, and that this function has been called
    // TODO: add functionality to change instance data set when instance is changed
    var newInstance = $('#instanceSelect').find(":selected").text();
    return newInstance;
}

/* 
 * Function: FillSessionDropDown()
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
function FillSessionDropDown(descriptor, init)
{
    var selected;
    // if it isn't the initial filling of the dropdown menus
    if(!init)
    {
        selected = GetSelectedDropdown("sessionSelect", "text");
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
    return GetSelectedDropdown("selectSession", "text");
}

/* 
 * Function: FillInstanceDropDown()
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
function FillInstanceDropDown(descriptor)
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
 * Function: GetSelectedDropdown()
 *
 *      Retrieves the id or value of the currently selected option in a dropdown menu
 *
 * Parameters: 
 *
 *      name - name of the dropdown element
 *      type - either "value" or "id" of the selected option
 *
 * Pre:
 *
 *      The specified dropdown exists in the page
 *
 * Post:
 *
 *      none
 *
 * Returns:
 *
 *      the id/value of the currently selected option
 *
 * Authors:
 *
 *      Paul Jang
 *
 * Date Created:
 *
 *      2/29/2016
 *
 * Last Modified:
 *
 *      2/29/2016 by Paul Jang
 */
function GetSelectedDropdown(name,type)
{
    var elem = document.getElementById(name);
    var value;

    if(type == 'id')
    {
        // get the value by getting the selected index, and then using that index to get the selected option, and then getting the value
        value = elem[elem.selectedIndex].value;
    }
    else if(type == 'text')
    {
        value = $(elem).find(":selected").text();
    }
    else if(type == 'elem')
    {
        value = elem[elem.selectedIndex];
    }
    else
    {
        alert("Something went wrong in getting the selected option in " + name + ".");
        value = 0;
    }

    return value;
}
 
