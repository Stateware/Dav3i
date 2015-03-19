// File Name:               data.js
// Description:             This module holds all global data for the other modules of the project
// Date Created:            3/19/2015
// Contributors:            Joshua Crafts
// Date Last Modified:      3/19/2015
// Last Modified By:        Joshua Crafts
// Dependencies:            index.html
// Additional Notes:        N/A

var g_DescriptorJSON; // Contains all from descriptor.php
var g_LookupTable; // CID, CC2, name, and HMS lookup table.
var g_StatList; // stat reference list, indexed by stat ID.
var g_FirstYear; // first year for which data is available.
var g_LastYear; // last year for which data is available.
var g_YearStart; // first year for which user wants data.
var g_YearEnd; // last year for which user wants data.
var g_Data; // first node of area selection data list; points to all other nodes. Is initially set on first area selection.
var g_Toggles; // array of booleans for settings toggles. Only set at 'true' or 'false', never numerically.
var g_HMSID; // stat ID corresponding to selected HMS.
var g_HMSYear; // year for which HMS data is wanted.

// prototype for ASDS node
function t_AsdsNode(cid, name, data)
{
    this.cid = cid;
    this.name = name;
    this.data = data;
    this.next = null;
}