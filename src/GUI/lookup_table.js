// File Name:               lookup_table.js
// Description:             Generates lookup table
// Date Created:            3/5/2015
// Contributors:            Emma Roudabush, Vanajam Soni, Paul Jang, Joshua Crafts
// Date Last Modified:      3/19/2015
// Last Modified By:        Emma Roudabush
// Dependencies:            descriptor.php, data.js
// Additional Notes:        N/A

// Author: Emma Roudabush
// Date Created: 
// Last Modified: 3/19/2015 by Emma Roudabush
// Description: Fills g_DescriptorJSON with the contents of descriptor.php,
//				fills g_LookupTable and g_StatList with their corresponding data
//				and logs the resulting variables to the console.
// PRE: DescriptorJSON, g_StatList, and g_LookupTable exist,
//		GenerateLookupTable and GenerateStatReferenceList function correctly
// POST: DescriptorJSON, g_StatList, g_LookupTable contain their correct data.
function CreateLookupTable ()
{	
	$.when(GetDescriptor()).done(function(DescriptorJSON){
		GenerateLookupTable(DescriptorJSON);
		GenerateStatReferenceList(DescriptorJSON);
		console.log(g_StatList); 
		console.log(g_LookupTable);
	});
}

// Author: Emma Roudabush
// Date Created:
// Last Modified: 3/19/2015 by Emma Roudabush
// Description: Retrieves descriptor.php from the server				
// PRE: descriptor.php exists on the server.
// POST: returns the contents of descriptor.php
function GetDescriptor()
{
	return $.ajax({                                      
		url: 'http://usve74985.serverprofi24.com/API/descriptor.php',                                                     
		dataType: 'JSON',                 
		success: function(data){     
			console.log("Successfully received descriptor.php");
		} 
	});
}

// Author: Emma Roudabush
// Date Created: 
// Last Modified: 3/19/2015 by Emma Roudabush
// Description: Fills the contents of g_LookupTable with data from
//				DescriptorJSON. This includes the CC2 codes, the 
//				names, and the HMS values are set to 0.
// PRE: DescriptorJSON exists with the correct data from descriptor.php,
//		g_LookupTable exists
// POST: g_LookupTable has the correct CC2, name, and HMS values
function GenerateLookupTable(DescriptorJSON)
{
    g_LookupTable = new Array(DescriptorJSON.cc2.length);
    for (i = 0; i < DescriptorJSON.cc2.length; i++)
    {
		g_LookupTable[i] = new Array(3);
        g_LookupTable[i][0] = DescriptorJSON.cc2[i];
        g_LookupTable[i][1] = DescriptorJSON.common_name[i];
        g_LookupTable[i][2] = 0;
    }
}

// Author: Emma Roudabush
// Date Created: 
// Last Modified: 3/19/2015 by Emma Roudabush
// Description: Fills the contents of g_StatList with the stats
//				data from DescriptorJSON			
// PRE: g_DescriptorJSON exists with the correct data from descriptor.php,
//		g_StatList exists
// POST: g_StatList has the correct stat values

function GenerateStatReferenceList(DescriptorJSON)
{
	g_StatList = new Array(DescriptorJSON.stats.length); 
	for (i = 0; i < DescriptorJSON.stats.length; i++)
	{
		g_StatList[i] = DescriptorJSON.stats[i];
	}
}

// Author: Emma Rouabush
// Date Created:
// Last Modified: 3/19/2015
// Description:
// PRE: 
// POST:
function SetHMS(hms)
{
	for (i = 0; i < g_LookupTable.length; i++)
	{
		g_LookupTable[i][2] = hms[i];
	}
}

// Author: Emma Rouabush
// Date Created:
// Last Modified: 3/19/2015
// Description:
// PRE: 
// POST:
function GetCID(cc2)
{
	var cids = new Array();
	var lookUpIndex = 0;
	
	for(var currentCc2 in cc2)
	{
		while(currentCc2 > g_LookupTable[lookUpIndex][1]) 
		{
			lookUpIndex++;
		}
		
		if(currentCc2 == g_LookupTable[lookUpIndex][1])
		{
			cids[cids.length] = lookUpIndex;
		}
		lookUpIndex++;
	}
	
	return cids;	
}

