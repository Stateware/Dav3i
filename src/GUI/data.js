// File Name:               data.js
// Description:             This module holds all global data for the other modules of the project
// Date Created:            3/19/2015
// Contributors:            Joshua Crafts
// Date Last Modified:      3/19/2015
// Last Modified By:        Joshua Crafts
// Dependencies:            index.html
// Additional Notes:        N/A

var g_LookupTable;
var g_StatList;
var g_FirstYear;
var g_LastYear;
var g_YearStart;
var g_YearEnd;
var g_Data;
var g_Toggles;
var g_HMSID;
var g_HMSYear;
var g_isSum;

function t_AsdsNode(cid, name, data)
{
    this.cid = cid;
    this.name = name;
    this.data = data;
    this.next = null;
}