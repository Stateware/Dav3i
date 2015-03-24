// File Name:               data_query.js
// Description:             takes CC2 codes and sends them to lookup_table.js, receives CIDs, queries the database,
//                          parses the JSON and returns the array
// Date Created:            3/5/2015
// Contributors:            Paul Jang, Vanajam Soni, Kyle Nicholson
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
			console.log("Successfully received data.php");
			dataJSON = data;
		} 
	});
	  
	
	var parsedData = ParseJSON(dataJSON);
	
	var newNode = new t_AsdsNode(cid,g_LookupTable[cid][0],g_LookupTable[cid][1],parsedData);
	
	return newNode;
}

// Author:          Vanajam Soni, Kyle Nicholson
// Date Created:    3/24/15
// Last Modified:   3/24/15 Kyle Nicholson
// Description:     adds or removes a node to the list
// Input: Selected regions string array
// Output: adds or removes a node to the list
function ModifyData(selectedRegions) {
	if(g_DataList == null)
		g_DataList = new c_List();

	if(selectedRegions.length > g_DataList.length) 
	{
		// look for cc2 to add
		var CC2Found = false; 
		for(var i; i <= selectedRegions.length && CC2Found === false; i++)
		{
			if(CC2Found = g_DataList.contains(selectedRegions[i]))
			{
				// call getdata with cc2 && call g_dataList.add with the node
				g_DataList.add(GetData(selectedRegions[i]));
			}
		}
	}
	else
	{
		// look for cc2 to remove
		for(var i = 0; i<g_DataList.length;i++)
		{	
			cc2ToRemove = g_DataList.item(i).cc2;
			if(selectedRegions.indexOf(cc2ToRemove) == -1)
				g_DataList.delete(cc2ToRemove);
		}		
	}

}

