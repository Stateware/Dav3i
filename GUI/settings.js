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
// Contributors:            Emma Roudabush, Paul Jang, Kyle Nicholson, Joshua Crafts
// Date Last Modified:      9/1/2015
// Last Modified By:        Joshua Crafts
// Dependencies:            data.js, dynamic_markup.js, graph.js
// Additional Notes:        N/A

function SetGraphType(type)
// PRE: type is a number between 0-2
// POST: g_GraphType is set to the appropriate graph type
{
    g_GraphType = type;
}

function SetIntHms(newIntHms)
// PRE: new is a number between 0-2
// POST: g_IntHms is set to the appropriate stat, and the map is recolored/revalued accordingly
{
    g_IntHms = newIntHms;
}

function ApplyAndClose()
// PRE: See ApplySettings() and CloseSettings()
// POST: if apply settings fails nothing happens, else apply settings and close the menu
{
	if(ApplySettings())
	{
		CloseSettings();
	}
}

function CancelSettings()
// PRE:  N/A
// POST: All settings values are returned to g_TempSettings values
{
    // remove box shadow and check marks or x marks	
    var startDiv=document.getElementById("year-range-start"),
        endDiv=document.getElementById("year-range-end"),
        heatmapYearDiv=document.getElementById("heatmap-year");
	
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

function ResetAllStatValues()
// PRE: g_TempSettings is initialized
// POST: all settings in the settings menu are visually set and their global variables are set
//       based on the g_TempSettings array
{
    var startDiv=document.getElementById("year-range-start"),
        endDiv=document.getElementById("year-range-end"),
        heatmapYearDiv=document.getElementById("heatmap-year");

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
    		document.getElementById("int0").checked = true;
    		break;
    	case 1:
    		document.getElementById("int1").checked = true;
    		break;
    	case 2:
    		document.getElementById("int2").checked = true;
    		break;
    }
    
    // set the global settings stats
    g_YearStart = g_TempSettings[0];
    g_YearEnd = g_TempSettings[1];
    g_HmsYear = g_TempSettings[2];
    g_GraphType = g_TempSettings[3]; 
    g_IntHMS = g_TempSettings[4];	
}

function SaveCurrentStatValues()
// PRE: there are values in each radio button and date div
// POST: saves all current radio buttons and dates and stores them in g_TempSettings array
{
    var startDiv=document.getElementById("year-range-start"),
        endDiv=document.getElementById("year-range-end"),
        heatmapYearDiv=document.getElementById("heatmap-year");
    
    g_TempSettings[0] = startDiv.value;
    g_TempSettings[1] = endDiv.value;
    g_TempSettings[2] = heatmapYearDiv.value;
    g_TempSettings[3] = g_GraphType;
    g_TempSettings[4] = g_IntHms;	
}

// JS Hint throws errors on this function for high statement count and high cyclical complexity.
// Reccommend compartmentalizing some of this code when adding new features.
/* jshint ignore:start */
function ApplySettings()
// PRE: N/A
// POST: Assigns the global variables if ranges are valid, otherwise display error.
{
    var canContinue=true,
        startDiv=document.getElementById("year-range-start"),
        endDiv=document.getElementById("year-range-end"),
        heatmapYearDiv=document.getElementById("heatmap-year");

    startDiv.style["box-shadow"]="";
    endDiv.style["box-shadow"]="";
    heatmapYearDiv.style["box-shadow"]="";

    document.getElementById(startDiv.id+"-error").style.cursor="default";
    document.getElementById(endDiv.id+"-error").style.cursor="default";
    document.getElementById(heatmapYearDiv.id+"-error").style.cursor="default";

    document.getElementById(startDiv.id+"-error").innerHTML="&emsp;";
    document.getElementById(endDiv.id+"-error").innerHTML="&emsp;";
    document.getElementById(heatmapYearDiv.id+"-error").innerHTML="&emsp;";

    document.getElementById(startDiv.id+"-error").removeAttribute("tooltip");
    document.getElementById(endDiv.id+"-error").removeAttribute("tooltip");
    document.getElementById(heatmapYearDiv.id+"-error").removeAttribute("tooltip");
    document.getElementById(startDiv.id+"-error").className="";
    document.getElementById(endDiv.id+"-error").className="";
    document.getElementById(heatmapYearDiv.id+"-error").className="";

    if(startDiv.value===""||(Number(startDiv.value)<Number(startDiv.min)||Number(startDiv.value)>Number(startDiv.max))||isNaN(startDiv.value))
    {
        canContinue=false;
        startDiv.style["box-shadow"]="0px 0px 8px #F00";
        document.getElementById(startDiv.id+"-error").style.cursor="help";
        document.getElementById(startDiv.id+"-error").innerHTML="X";
        document.getElementById(startDiv.id+"-error").setAttribute("tooltip","Out of range: "+startDiv.min+"-"+startDiv.max);
        document.getElementById(startDiv.id+"-error").className="settings-error";
    }
    if(endDiv.value===""||(Number(endDiv.value)<Number(endDiv.min)||Number(endDiv.value)>Number(endDiv.max))||isNaN(endDiv.value))
    {
        canContinue=false;
        endDiv.style["box-shadow"]="0px 0px 8px #F00";
        document.getElementById(endDiv.id+"-error").style.cursor="help";
        document.getElementById(endDiv.id+"-error").innerHTML="X";
        document.getElementById(endDiv.id+"-error").setAttribute("tooltip","Out of range: "+endDiv.min+"-"+endDiv.max);
        document.getElementById(endDiv.id+"-error").className="settings-error";
    }
    if(heatmapYearDiv.value===""||(Number(heatmapYearDiv.value)<Number(heatmapYearDiv.min)||Number(heatmapYearDiv.value)>Number(heatmapYearDiv.max))||isNaN(heatmapYearDiv.value))
    {
        canContinue=false;
        heatmapYearDiv.style["box-shadow"]="0px 0px 8px #F00";
		document.getElementById(heatmapYearDiv.id+"-error").style.cursor="help";
        document.getElementById(heatmapYearDiv.id+"-error").innerHTML="X";
        document.getElementById(heatmapYearDiv.id+"-error").setAttribute("tooltip","Out of range: "+heatmapYearDiv.min+"-"+heatmapYearDiv.max);
        document.getElementById(heatmapYearDiv.id+"-error").className="settings-error";
    }
    if(endDiv.value<startDiv.value)
    {
        canContinue=false;
        startDiv.style["box-shadow"]="0px 0px 8px #F00";
        endDiv.style["box-shadow"]="0px 0px 8px #F00";
        document.getElementById(startDiv.id+"-error").style.cursor="help";
        document.getElementById(endDiv.id+"-error").style.cursor="help";
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
        g_HmsYear=heatmapYearDiv.value;

        GenerateSubDivs();
        GenerateGraphs();
        if (g_StatId !== 'custom')
        {
            ColorByHms();	
        }

        // saves all radio buttions and dates in g_TempSettings array
        SaveCurrentStatValues();
        
        return true;
    }
    else
    {
    	return false;
    }
}
/* jshint ignore:end */

function SelectIndex(id)
// PRE:  id is the id of a dropdown menu used to select a data set index
// POST: based on the use of the dropdown menu (select index for a selected stat, or
//       for one of the 2 custom stats), the appropriate global variable is set to the
//       newly selected value
{
    if (id !== 'stat1index' && id !== 'stat2index')
    {
        g_SelectedIndex = document.getElementById(id).value;
    }
    else
    {
        if (id === 'stat1Index')
        {
            g_SelectedIndex1 = document.getElementById(id).value;
        }
        else
        {
            g_SelectedIndex2 = document.getElementById(id).value;
        }
    }
    GenerateGraphs();
}

function SelectStat(id)
// PRE:  id is the id of a dropdown menu used to select a stat
// POST: based on the use of the dropdown menu (which custom stat is being selected), 
//       the appropriate global variable is set to the newly selected value
{
    var re = new RegExp('([a-z\_]+)\\+?(\\d+)?'),
        results;

    results = re.exec(document.getElementById(id).value);
    if (id === 'stat1')
    {
        g_StatId1 = results[1];
        if (results[2] !== undefined)
        {
            g_SubStat1 = results[2];
        }
        RefreshIndices('stat1index');
        g_SelectedIndex1 = 0;
    }
    else
    {
        g_StatId2 = results[1];
        if (results[2] !== undefined)
        {
            g_SubStat2 = results[2];
        }
        RefreshIndices('stat2index');
        g_SelectedIndex2 = 0;
    }
    GenerateGraphs();
}
