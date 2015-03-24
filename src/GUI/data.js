// File Name:               data.js
// Description:             This module holds all global data for the other modules of the project
// Date Created:            3/19/2015
// Contributors:            Joshua Crafts, Vanajam Soni
// Date Last Modified:      3/24/2015
// Last Modified By:        Vanajam Crafts
// Dependencies:            index.html
// Additional Notes:        N/A

var g_LookupTable; // CID, CC2, name, and HMS lookup table.
var g_StatList; // stat reference list, indexed by stat ID.
var g_FirstYear; // first year for which data is available.
var g_LastYear; // last year for which data is available.
var g_YearStart; // first year for which user wants data.
var g_YearEnd; // last year for which user wants data.
var g_DataList; // first node of area selection data list; points to all other nodes. Is initially set on first area selection.
var g_Toggles; // array of booleans for settings toggles. Only set at 'true' or 'false', never numerically.
var g_HMSID; // stat ID corresponding to selected HMS.
var g_HMSYear; // year for which HMS data is wanted.

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
function c_List() {
  this.start = null; 
  this.end = null; 
  this.length = 0;
  
  this.add = function(node) { 
    if (this.start === null) { 
      this.start = node; 
      this.end = this.start; 
    } 
    else {
      this.end.next = node; 
      this.end = this.end.next; 
    }  
    this.length++;
 }; 

  this.delete = function(cc2) { 
    var current = this.start; 
    var previous = this.start; 
    while (current !== null) { 
      if (cc2 === current.cc2) {
        this.length--;
        if (current === this.start) { 
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

  this.item = function(i) { 
    var current = this.start; 
    while (current !== null) { 
       
      if (i === 0) return current; 
      current = current.next; 
      i--;
    } 
    return null; 
  }; 

  this.contains = function(cc2) {

  	for(var i=0;i<length;i++) {
  		if(this.item(i).cc2 == cc2)
  			return true;
  	}
  	return false;

  }

} 
