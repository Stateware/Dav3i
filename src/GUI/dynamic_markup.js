// File Name:               dynamic_markup.js
// Description:             This module contains the code needed to dynamically create modules on the client
// Date Created:            3/26/2015
// Contributors:            Paul Jang, Nicholas Denaro, Emma Roudabush
// Date Last Modified:      4/12/2015
// Last Modified By:        Nicholas Denaro
// Dependencies:            index.html, lookup_table.js, data.js
// Additional Notes:        N/A

// Author: Paul Jang, Nicholas Denaro
// Date Created: 3/26/2015
// Last Modified: 3/26/2015 by Paul Jang
// Description: Retrieve stat values from the lookup_table,
//              Builds the tabs and inserts them into index.html
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
            div.id="id-"+temp;
            div.setAttribute("stat",""+i);
            div.className="graph-tab";
            div.setAttribute("onclick","ChooseTab(this)");
            div.innerHTML=temp;
            document.getElementById("tabsDiv").appendChild(div);

            BuildDiv(temp);

            if(i==0)
            {
                //g_ActiveTab=div;
                g_StatID=i;
                document.getElementById("id-"+temp+"-graphs").style.display="block";
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
    div.id="id-"+stat+"-graphs";
    div.style.display="none";
    div.className="graph";
    document.getElementById("graphs").appendChild(div);
}

// Author: Paul Jang, Nicholas Denaro
// Date Created: 3/26/2015
// Last Modified: 4/12/2015 by Nicholas Denaro
// Description: build divs where the graphs go in index.html
// PRE: Called from the onclick of a tab
// POST: previous tab is switched out, and now tab is switched in
function ChooseTab(element)
{
    // remove divs in previous tab
    var parentTabDivName = "id-"+g_StatList[g_StatID]+"-graphs";
    document.getElementById(parentTabDivName).innerHTML = "";
    
    document.getElementById("id-"+g_StatList[g_StatID]+"-graphs").style.display="none";
    document.getElementById(element.id+"-graphs").style.display="block";
    g_StatID=element.getAttribute("stat");
    
    GenerateSubDivs();
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
    setTimeout(function () {
        GenerateSubDivs();
    }, 500);
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
    setTimeout(function () {
        GenerateSubDivs();
    }, 500);
}

// Author: Paul Jang
// Date Created: 4/2/2015
// Last Modified: 4/14/2015 by Paul Jang
// Description: Calls CreateDiv to dynamically generate subgraph divs and generate graphs
// PRE: CreateDiv functions correctly, g_DataList is properly full
// POST: Divs are created based on how many countries are selected,
//       Correct graphs are filled in the appropriate divs
function GenerateSubDivs()
{
    var size = g_DataList.size;
    var parentTabDivName = "id-"+g_StatList[g_StatID]+"-graphs";
    var currentNumDivs = document.getElementById(parentTabDivName).childNodes.length;
    var children = document.getElementById(parentTabDivName).childNodes;
    var newNumDivs = size - currentNumDivs;
    // if we are adding divs
    if(newNumDivs > 0)
    {
        for(var i = 1; i<=newNumDivs; i++)
            CreateSubDiv("region-graphs-"+(currentNumDivs+i),parentTabDivName);
    }
    // if we are removing divs
    else if(newNumDivs < 0)
    {
        // delete all the elements and remake all the divs
        newNumDivs *= (-1);
        document.getElementById(parentTabDivName).innerHTML = "";
        for(var i=1; i<=(currentNumDivs - newNumDivs); i++)
            CreateSubDiv("region-graphs-"+i,parentTabDivName);
    }   
}

// Author: Paul Jang
// Date Created: 4/2/2015
// Last Modified: 4/12/2015 by Nicholas Denaro
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
        if(divs[i].className=="control-panel")
        {
            elem.style="max-width: "+divs[i].clientWidth+"px;";
        }
    }
    document.getElementById(parent).appendChild(elem);
}