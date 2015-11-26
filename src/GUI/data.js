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

var g_LookupTable;      			// CID, CC2, name, and HMS lookup table.
var g_CountriesNoData;				// list of countries without data, ie. not selectable
var g_StatList;         			// stat reference list, indexed by stat ID.
var g_FirstYear;        			// first year for which data is available.
var g_LastYear;         			// last year for which data is available.
var g_YearStart;        			// first year for which user wants data.
var g_YearEnd;          			// last year for which user wants data.
var g_DataList;         			// data list
var g_StatID;           			// stat ID corresponding to selected HMS.
var g_HMSYear;          			// year for which HMS data is wanted.
var g_ParsedStatList;   			// parsed stat reference list
var g_GraphType;        			// variable representing the graph type, enumerated 0 to 2
var g_Clear = false;				// variable used by the clear selection function to avoid n^3 slowdown
var g_Expanded = false; 			// variable used to determine whether or not the graph section is expanded
var g_VaccHMS = 1;					// variable used to determine which vaccination stat to use when heat mapping
var g_TempSettings = new Array(5);  // indicies are "first year, last year, Heat map year, graph type, vacc heat map"
var g_Map;

//key:value as region:div
var g_mapSelectedRegionsToDivs = {};
var g_cache = new data_cache();


//Object to store the cache
function data_cache()
{
	this.get = function(prop) {
	    this[prop] = this[prop] || new data_cache();
	    return this[prop];
	};
	
	this.set = function(prop, value) {
	    this[prop] = value;
	};
}

function getFirstInstance()
{
	return 10;
}

function getSecondInstance()
{
	return 10;
}

function getSession()
{
	return 4;
}


// prototype for ASDS node
function t_AsdsNode(cid, cc2, name, data)
{
    this.cid = cid;
    this.cc2 = cc2;
    this.name = name;
    this.data = data;
    this.next = null;
}

// prototype for variable containing list of nodes
function c_List() 
{
     
    this.size = 0;
    this.start = null;
    this.end = null;
    
    this.add = function(node) 
    {
        if (this.start == null) 
        { 
            this.start = node; 
            this.end = node;
        } 
        else 
        {
            this.end.next = node; 
            this.end = this.end.next; 
        }  
        this.size++;
    }; 

    this.delete = function(cc2) 
    { 
        var current = this.start; 
        var previous = this.start; 
        while (current !== null) 
        { 
            if (cc2 === current.cc2) 
            {
                this.size--;
                if (current === this.start) 
                { 
                    this.start = current.next; 
                    return; 
                } 
                if (current === this.end) 
                    this.end = previous;
                previous.next = current.next; 
                return; 
            }
            previous = current; 
            current = current.next; 
        }
    }; 

    this.item = function(i) 
    { 
        var current = this.start; 
        while (current !== null) 
        { 

            if (i === 0) 
                return current; 
            current = current.next; 
            i--;
        } 
        return null; 
    }; 

    this.contains = function(cc2) 
    {

        for(var i=0;i<this.size;i++) 
        {
            if(this.item(i)!= null && this.item(i).cc2 == cc2)
                return true;
        }
        return false;

    };
}
