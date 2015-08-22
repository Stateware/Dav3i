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

// File Name:               data.js
// Description:             This module holds all global data for the other modules of the project
// Date Created:            3/19/2015
// Contributors:            Joshua Crafts, Vanajam Soni, Paul Jang
// Date Last Modified:      4/23/2015
// Last Modified By:        Kyle Nicholson
// Dependencies:            index.html
// Additional Notes:        N/A

// constants
var g_BUCKETS = 676;				// number of hashable buckets in the lookup table

// global variables
var g_LookupTable;      			// CID, CC2, name, and HMS lookup table
var g_NumCountries;				// number of countries for which data exists
var g_StatList;         			// stat reference list, indexed by stat ID
var g_FirstYear;        			// first year for which data is available
var g_LastYear;         			// last year for which data is available
var g_YearStart;        			// first year for which user wants data
var g_YearEnd;          			// last year for which user wants data
var g_DataList;         			// data list for use in graphing
var g_StatID;           			// stat ID corresponding to selected HMS.
var g_HMSYear;          			// year for which HMS data is wanted
var g_ParsedStatList;   			// parsed stat reference list
var g_GraphType = 0;        			// represents the graph type, enumerated 0 to 2
var g_Clear = false;				// used by the clear selection function to avoid rebuilding data list on each deselect
var g_Expanded = false; 			// used to determine whether or not the graph section is expanded
var g_VaccHMS = 1;				// used to determine which vaccination stat to use when heat mapping
var g_TempSettings = new Array(5);  		// indicies are "first year, last year, Heat map year, graph type, vacc heat map"
var g_DataReady = false;			// true when all lookup table data is loaded
var g_HMSReady = false;				// true when init heat map data is loaded
var g_DataLoaded = 0;				// number of countries for which data is loaded
var ColorByHMS;					// function for recoloring map

// prototype (constructor) for ASDS node
function t_AsdsNode(cid, cc2, name, data)
// PRE:  0 <= cid <= g_NumCountries, cc2 is a 2 alpha character code corresponding to the country whose country id is cid,
//       name is the name of that country, and data is a 2D array of length (g_LastYear-g_FirstYear)+1, and depth g_StatList.length,
//       which contains the data points from g_FirstYear to g_LastYear for all stats (enumerated 0 to g_StatList.length-1)
// POST: FCTVAL == new ASDS node with the specified values for its data members, whose next pointer points to null
{
    this.cid = cid;
    this.cc2 = cc2;
    this.name = name;
    this.data = data;
    this.next = null;
}

// prototype for variable containing list of nodes
function c_List() 
// POST: FCTVAL == new empty list of size 0, whose start points to null
{
     
    this.size = 0;
    this.start = null;
    
    this.add = function(node) 
    // POST: node is appended at the start of the list
    {
        var temp;

        temp = this.start;		// insert node at head of list
        this.start = node;
        this.start.next = temp;
        this.size++;
    }; 

    this.clear = function()
    // POST: the list, if it has members, is cleared, and its size is reset to 0, and start pointer points to null
    { 
        this.size = 0;
        this.start = null;
    };
}
