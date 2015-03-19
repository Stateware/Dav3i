// File Name:               data_query.js
// Description:             takes CC2 codes and sends them to lookup_table.js, receives CIDs, queries the database,
//                          parses the JSON and returns the array
// Date Created:            3/5/2015
// Contributors:            Paul Jang
// Date Last Modified:      3/5/2015
// Last Modified By:        Paul Jang
// Dependencies:            lookup_table.js, byCountry.php, parser.js
// Additional Notes:        N/A


// Author:          Paul Jang
// Date Created:    3/5/15
// Last Modified:   3/5/15 by Paul Jang
// Description:     Calls all of the functions to take the CC2 and output the array for the map
//                  Input: CC2 codes
//                  Output: array of data for the map
function GetData(cc2)
{
	var cid = GetCID(cc2);
	var dataJSON ;
	// the code to get data from server (block below) is going to change
	
	$.ajax({                                      
		url: 'http://usve74985.serverprofi24.com/API/by_country.php?CID='.concat(cid.toString()),                                                     
		dataType: 'JSON',                 
		async: false,
		success: function(data){     
			console.log("Successfully received descriptor.php");
			dataJSON = data;
		} 
	});
	  
	
	var parsedData = ParseJSON(dataJSON);
	
	var newNode = new t_AsdsNode(cid,g_LookupTable[cid][1],parsedData);
	
	
	return newNode;
}


function AddToData(var newNode) {
	
}


function RemoveFromData(var cid) {

}

function GetHMS(hmsId)
{
	var hmsData;
	// 1. Query by_stat.php
	
	$.ajax({                                      
		url: 'http://usve74985.serverprofi24.com/API/by_stat.php?statID='.concat(hmsID.toString()),                                                     
		dataType: 'JSON',                 
		async: false,
		success: function(data){     
			console.log("Successfully received descriptor.php");
			hmsData = data;
		} 
	});
	
	
	
	return hmsData;
}
