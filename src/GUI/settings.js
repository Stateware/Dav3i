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

// File Name:               settings.js
// Description:             Module to modify and work with settings
// Date Created:            3/26/2015
// Contributors:            Emma Roudabush, Paul Jang
// Date Last Modified:      4/16/2015
// Last Modified By:        Paul Jang
// Dependencies:            data.js, index.html
// Additional Notes:        N/A

// Author: Emma Roudabush
// Date Created: 4/14/2015
// Last Modified: 4/14/2015 by Emma Roudabush
// Description: To set g_GraphType
// PRE: type is a number between 0-2
// POST: g_GraphType is set to the appropriate graph type
function SetGraphType(type)
{
    g_GraphType = type;
    if (g_DataList != undefined)
    {
        // redraw divs and graphs
        GenerateSubDivs();
        GenerateGraphs();
    }
}

// Author: Nicholas Denaro
// Date Created: 4/18/2015
// Last Modified: 4/18/2015 by Nicholas Denaro
// Description: To set settings for the year ranges
// PRE: N/A
// POST: Assigns the global variables if ranges are valid, otherwise display error.
function SetYearRange()
{
	var canContinue=true;
	var startDiv=document.getElementById("year-range-start");
    var endDiv=document.getElementById("year-range-end");
    var heatmapYearDiv=document.getElementById("heatmap-year");

    startDiv.style["box-shadow"]="";
    endDiv.style["box-shadow"]="";
    heatmapYearDiv.style["box-shadow"]="";

     document.getElementById(startDiv.id+"-error").style["cursor"]="default";
     document.getElementById(endDiv.id+"-error").style["cursor"]="default";
     document.getElementById(heatmapYearDiv.id+"-error").style["cursor"]="default";

    document.getElementById(startDiv.id+"-error").innerHTML="&emsp;";
    document.getElementById(endDiv.id+"-error").innerHTML="&emsp;";
    document.getElementById(heatmapYearDiv.id+"-error").innerHTML="&emsp;";

    document.getElementById(startDiv.id+"-error").removeAttribute("title");
    document.getElementById(endDiv.id+"-error").removeAttribute("title");
    document.getElementById(heatmapYearDiv.id+"-error").removeAttribute("title");


	if(startDiv.value==""||(Number(startDiv.value)<Number(startDiv.min)||Number(startDiv.value)>Number(startDiv.max)))
    {
        canContinue=false;
        startDiv.style["box-shadow"]="0px 0px 8px #F00";
        document.getElementById(startDiv.id+"-error").style["cursor"]="help";
        document.getElementById(startDiv.id+"-error").innerHTML="!";
        document.getElementById(startDiv.id+"-error").setAttribute("title","Out of range: "+startDiv.min+"-"+startDiv.max);
    }
    if(endDiv.value==""||(Number(endDiv.value)<Number(endDiv.min)||Number(endDiv.value)>Number(endDiv.max)))
    {
        canContinue=false;
        endDiv.style["box-shadow"]="0px 0px 8px #F00";
        document.getElementById(endDiv.id+"-error").style["cursor"]="help";
        document.getElementById(endDiv.id+"-error").innerHTML="!";
        document.getElementById(endDiv.id+"-error").setAttribute("title","Out of range: "+endDiv.min+"-"+endDiv.max);
    }
    if(heatmapYearDiv.value==""||(Number(heatmapYearDiv.value)<Number(heatmapYearDiv.min)||Number(heatmapYearDiv.value)>Number(heatmapYearDiv.max)))
    {
        canContinue=false;
        heatmapYearDiv.style["box-shadow"]="0px 0px 8px #F00";
		document.getElementById(heatmapYearDiv.id+"-error").style["cursor"]="help";
        document.getElementById(heatmapYearDiv.id+"-error").innerHTML="!";
        document.getElementById(heatmapYearDiv.id+"-error").setAttribute("title","Out of range: "+heatmapYearDiv.min+"-"+heatmapYearDiv.max);
    }
    if(endDiv.value<startDiv.value)
    {
        canContinue=false;
        startDiv.style["box-shadow"]="0px 0px 8px #F00";
        endDiv.style["box-shadow"]="0px 0px 8px #F00";
        document.getElementById(startDiv.id+"-error").style["cursor"]="help";
        document.getElementById(endDiv.id+"-error").style["cursor"]="help";
        document.getElementById(startDiv.id+"-error").innerHTML="!";
        document.getElementById(endDiv.id+"-error").innerHTML="!";
        document.getElementById(startDiv.id+"-error").setAttribute("title","Must be before End.");
        document.getElementById(endDiv.id+"-error").setAttribute("title","Must be after Start.");
    }

    if(canContinue)
    {
        g_YearStart=startDiv.value;
        g_YearEnd=endDiv.value;
        g_HMSYear=heatmapYearDiv.value;
        return(true);
    }
    else
    	return(false);
}