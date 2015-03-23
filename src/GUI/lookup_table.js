// File Name:			lookup_table.js
// Description:			Generates lookup table
// Date Created:		3/5/2015
// Contributors:		Emma Roudabush, Vanajam Soni, Paul Jang, Joshua Crafts
// Date Last Modified:		3/19/2015
// Last Modified By:		Emma Roudabush
// Dependencies:		descriptor.php, by_stat.php, data.js
// Additional Notes:		N/A

// Author: Emma Roudabush, Joshua Crafts
// Date Created: 3/5/2015
// Last Modified: 3/23/2015 by Joshua Crafts
// Description: Fills g_DescriptorJSON with the contents of descriptor.php,
//				fills g_LookupTable and g_StatList with their corresponding data
//				and logs the resulting variables to the console.
// PRE: DescriptorJSON, g_StatList, and g_LookupTable exist,
//		GenerateLookupTable and GenerateStatReferenceList function correctly
// POST: DescriptorJSON, g_StatList, g_LookupTable contain their correct data.
function ParseDescriptor()
{
    var DescriptorJSON;
    var hmsData;

    $.when(GetDescriptor()).done(function(DescriptorJSON){
        GenerateLookupTable(DescriptorJSON);
        $.when(GetHMS(1)).done(function(hmsData){
            SetHMS(hmsData)
        });
        g_HMSID=1;
        GenerateStatReferenceList(DescriptorJSON);
        console.log(g_LookupTable);
        console.log(g_StatList); 
    });
}

// Author: Emma Roudabush
// Date Created: 3/5/2015
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
// Date Created: 3/5/2015
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
// Date Created: 3/5/2015
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

// Author: Emma Roudabush, Joshua Crafts
// Date Created: 3/17/2015
// Last Modified: 3/23/2015 by Joshua Crafts
// Description:Replace HMS values in lookup table with new HMS data (will happen just after lookup table generation for default HMS)
// PRE: hms contains valid heat map values and hms is of size g_LookupTable.length
// POST: g_LookupTable has heat map values of hms
function SetHMS(hmsData)
{
    for (i = 0; i < g_LookupTable.length; i++)
    {
        g_LookupTable[i][2] = Number(hmsData[i]);
    }
}

// Author: Vanajam Soni, Kyle Nicholson, Joshua Crafts
// Date Created: 3/19/2015
// Last Modified: 3/23/2015 by Joshua Crafts
// Description: Returns HMS data based on hmsID
// PRE: hms contains valid heat map values and hms is of size g_LookupTable.length
// POST: FCTVAL == HMS data corresponding to stat enumerated by hmsID in the stat reference list, in JSON format
function GetHMS(hmsID)
{
    return $.ajax({                                      
        url: 'http://usve74985.serverprofi24.com/API/by_stat.php?statID='.concat(hmsID.toString()),                                                     
        dataType: 'JSON',
        success: function(data){     
            console.log("Successfully received by_stat.php?statID=".concat(hmsID.toString()));
        } 
    });
}

// Author: Emma Rouabush, Joshua Crafts
// Date Created: 3/17/2015
// Last Modified: 3/22/2015 by Joshua Crafts
// Description: Translate CC2 to CID using g_LookupTable
// PRE: cc2 is a string that is a valid CC2 code corresponding to a country/region in the lookup table
// POST: FCTVAL = cid (CID corresponding to the input CC2 in the lookup table)
function GetCID(cc2)
{
    var length = g_LookupTable.length;
    var cid;
    
    for (var i in g_LookupTable)
    {
        if (g_LookupTable[i][0] === cc2)
        {
            cid = i;
        }
    }

    return cid;	
}