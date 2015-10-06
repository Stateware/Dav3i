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
// Contributors:            Emma Roudabush, Paul Jang, Kyle Nicholson
// Date Last Modified:      4/23/2015
// Last Modified By:       	Kyle Nicholson
// Dependencies:            data.js, index.html
// Additional Notes:        N/A

// Author: Emma Roudabush
// Date Created: 4/14/2015
// Last Modified: 4/23/2015 by Kyle Nicholson
// Description: To set g_GraphType
// PRE: type is a number between 0-2
// POST: g_GraphType is set to the appropriate graph type
function SetGraphType(type)
{
    g_GraphType = type;
}

// Author: Joshua Crafts
// Date Created: 4/19/2015
// Last Modified: 4/23/2015 by Kyle Nicholson
// Description: To set g_VaccHMS
// PRE: new is a number between 0-2
// POST: g_VaccHMS is set to the appropriate stat, and the map is recolored/revalued accordingly
function SetVaccHMS(newVaccHMS)
{
    g_VaccHMS = newVaccHMS;
}

// Author: Kyle Nicholson
// Date Created: 4/23/2015
// Last Modified: 10/6/2015 by Nicholas Denaro
// Description: To set settings for the year ranges.
// PRE: See ApplySettings() and CloseSettings()
// POST: if apply settings fails nothing happens, else apply settings and close the menu. FCTVAL = true on successful close, false on failure to close.
function ApplyAndClose()
{
	if(ApplySettings())
	{
		CloseSettings();
        return(true);
	}
    return(false);
}

// Author: Kyle Nicholson
// Date Created: 4/23/2015
// Last Modified: 4/23/2015 by Kyle Nicholson
// Description: To set settings for the year ranges
// PRE: N/A
// POST: 
function CancelSettings()
{
	// remove box shadow and check marks or x marks	
	var startDiv=document.getElementById("year-range-start");
    var endDiv=document.getElementById("year-range-end");
    var heatmapYearDiv=document.getElementById("heatmap-year");
	
	startDiv.style["box-shadow"]="none";
    endDiv.style["box-shadow"]="none";
    heatmapYearDiv.style["box-shadow"]="none";
        
    document.getElementById(startDiv.id+"-error").innerHTML="";
    document.getElementById(endDiv.id+"-error").innerHTML="";
    document.getElementById(heatmapYearDiv.id+"-error").innerHTML="";
    
    // visually and globally set all values in the settings menu to the tempSettings array
 	ResetAllStatValues();
  	
    CloseSettings();
}

// Author: Kyle Nicholson
// Date Created: 4/23/2015
// Last Modified: 4/23/2015 by Kyle Nicholson
// Description: sets all of the settings based on the g_TempSettings array
// PRE: g_TempSettingsArray is initialized
// POST: all settings in the settings menu are visually set and their global variables are set
//       based on the g_TempSettings array
function ResetAllStatValues()
{
	var startDiv=document.getElementById("year-range-start");
    var endDiv=document.getElementById("year-range-end");
    var heatmapYearDiv=document.getElementById("heatmap-year");

	// set start end and heatmap div values
	startDiv.value = g_TempSettings[0];
    endDiv.value = g_TempSettings[1];
    heatmapYearDiv.value = g_TempSettings[2];
	
	// set radio buttons
    switch (g_TempSettings[3])
    {
    	case 0:
    		document.getElementById("graph-regional").checked = true;
    		break;
    	case 1:
    		document.getElementById("graph-combined").checked = true;
    		break;
    	case 2:
    		document.getElementById("graph-whole").checked = true;
    		break;
    }
    
    switch (g_TempSettings[4])
    {
    	case 0:
    		document.getElementById("vacc-sia").checked = true;
    		break;
    	case 1:
    		document.getElementById("vacc-mcv1").checked = true;
    		break;
    	case 2:
    		document.getElementById("vacc-mcv2").checked = true;
    		break;
    }
    
    // set the global settings stats
    g_YearStart = g_TempSettings[0];
    g_YearEnd = g_TempSettings[1];
    g_HMSYear = g_TempSettings[2];
    g_GraphType = g_TempSettings[3]; 
    g_VaccHMS = g_TempSettings[4];	
}

// Author: Kyle Nicholson
// Date Created: 4/23/2015
// Last Modified: 4/23/2015 by Kyle Nicholson
// Description: saves all current radio buttons and dates 
// PRE: there are values in each radio button and date div
// POST: saves all current radio buttons and dates and stores them in g_TempSettings array
function SaveCurrentStatValues()
{
	var startDiv=document.getElementById("year-range-start");
    var endDiv=document.getElementById("year-range-end");
    var heatmapYearDiv=document.getElementById("heatmap-year");
    
	g_TempSettings[0] = startDiv.value;
    g_TempSettings[1] = endDiv.value;
    g_TempSettings[2] = heatmapYearDiv.value;
    g_TempSettings[3] = g_GraphType;
    g_TempSettings[4] = g_VaccHMS;	
}

// Author: Nicholas Denaro
// Date Created: 4/18/2015
// Last Modified: 4/23/2015 by Kyle Nicholson
// Description: To set settings for the year ranges
// PRE: N/A
// POST: Assigns the global variables if ranges are valid, otherwise display error.
function ApplySettings()
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

    document.getElementById(startDiv.id+"-error").removeAttribute("tooltip");
    document.getElementById(endDiv.id+"-error").removeAttribute("tooltip");
    document.getElementById(heatmapYearDiv.id+"-error").removeAttribute("tooltip");
    document.getElementById(startDiv.id+"-error").className="";
    document.getElementById(endDiv.id+"-error").className="";
    document.getElementById(heatmapYearDiv.id+"-error").className="";


    if(startDiv.value==""||(Number(startDiv.value)<Number(startDiv.min)||Number(startDiv.value)>Number(startDiv.max))||isNaN(startDiv.value))
    {
        canContinue=false;
        startDiv.style["box-shadow"]="0px 0px 8px #F00";
        document.getElementById(startDiv.id+"-error").style["cursor"]="help";
        document.getElementById(startDiv.id+"-error").innerHTML="X";
        document.getElementById(startDiv.id+"-error").setAttribute("tooltip","Out of range: "+startDiv.min+"-"+startDiv.max);
        document.getElementById(startDiv.id+"-error").className="settings-error";
    }
    if(endDiv.value==""||(Number(endDiv.value)<Number(endDiv.min)||Number(endDiv.value)>Number(endDiv.max))||isNaN(endDiv.value))
    {
        canContinue=false;
        endDiv.style["box-shadow"]="0px 0px 8px #F00";
        document.getElementById(endDiv.id+"-error").style["cursor"]="help";
        document.getElementById(endDiv.id+"-error").innerHTML="X";
        document.getElementById(endDiv.id+"-error").setAttribute("tooltip","Out of range: "+endDiv.min+"-"+endDiv.max);
        document.getElementById(endDiv.id+"-error").className="settings-error";
    }
    if(heatmapYearDiv.value==""||(Number(heatmapYearDiv.value)<Number(heatmapYearDiv.min)||Number(heatmapYearDiv.value)>Number(heatmapYearDiv.max))||isNaN(heatmapYearDiv.value))
    {
        canContinue=false;
        heatmapYearDiv.style["box-shadow"]="0px 0px 8px #F00";
		document.getElementById(heatmapYearDiv.id+"-error").style["cursor"]="help";
        document.getElementById(heatmapYearDiv.id+"-error").innerHTML="X";
        document.getElementById(heatmapYearDiv.id+"-error").setAttribute("tooltip","Out of range: "+heatmapYearDiv.min+"-"+heatmapYearDiv.max);
        document.getElementById(heatmapYearDiv.id+"-error").className="settings-error";
    }
    if(endDiv.value<startDiv.value)
    {
        canContinue=false;
        startDiv.style["box-shadow"]="0px 0px 8px #F00";
        endDiv.style["box-shadow"]="0px 0px 8px #F00";
        document.getElementById(startDiv.id+"-error").style["cursor"]="help";
        document.getElementById(endDiv.id+"-error").style["cursor"]="help";
        document.getElementById(startDiv.id+"-error").innerHTML="X";
        document.getElementById(endDiv.id+"-error").innerHTML="X";
        document.getElementById(startDiv.id+"-error").setAttribute("tooltip","Year must be before End.");
        document.getElementById(endDiv.id+"-error").setAttribute("tooltip","Year must be after Start.");
        document.getElementById(startDiv.id+"-error").className="settings-error";
        document.getElementById(endDiv.id+"-error").className="settings-error";
    }

    if(canContinue)
    {
    	startDiv.style["box-shadow"]="0px 0px 8px #00FF00";
        endDiv.style["box-shadow"]="0px 0px 8px #00FF00";
        heatmapYearDiv.style["box-shadow"]="0px 0px 8px #00FF00";
        
        document.getElementById(startDiv.id+"-error").innerHTML="&#10003";
    	document.getElementById(endDiv.id+"-error").innerHTML="&#10003";
    	document.getElementById(heatmapYearDiv.id+"-error").innerHTML="&#10003";
    	
    	// set settings
        g_YearStart=startDiv.value;
        g_YearEnd=endDiv.value;
        g_HMSYear=heatmapYearDiv.value;
        
        GenerateSubDivs();
        GenerateGraphs();
        ColorByHMS();	
        
        // saves all radio buttions and dates in g_TempSettings array
        SaveCurrentStatValues();
        
        return(true);
    }
    else
    	return(false);
}