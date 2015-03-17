// File Name:               lookup_table.js
// Description:             Generates lookup table
// Date Created:            3/5/2015
// Contributors:            Emma Roudabush
// Date Last Modified:      3/5/2015
// Last Modified By:        Emma Roudabush
// Dependencies:            Descriptor.php
// Additional Notes:        N/A

var g_DescriptorJSON;
var g_LookupTable;
var g_Stats;

function LookupTable(cc2, countryName, hms) {
    this.CC2 = cc2;
    this.CountryName = countryName;
    this.HMS = hms;
}

function CreateLookupTable ()
{
    GetDescriptor();
	console.log(g_DescriptorJSON);
    GenerateLookupTable();
	console.log(g_LookupTable);
    GenerateStatReferenceList();
	console.log(g_Stats); 
}

function GetDescriptor ()
{
	$.ajax({                                      
		url: 'http://usve74985.serverprofi24.com/API/descriptor.php',                                                     
		dataType: 'JSON',                 
		async: 'false',
		success: function(data){     
			console.log("Successfully received descriptor.php");
			console.log(JSON.stringify(data));
			g_DescriptorJSON = JSON.stringify(data);
		} 
	});
}

function GetHMS ()
{
	
}

function SetHMS ()
{
}

// Generate with HMS column as 0
function GenerateLookupTable ()
{
	var CC2 = [];
	var CountryName = [];
	var HMS = []; 
	for (i = 0; i < 194; i++)
	{
		CC2[i] = g_DescriptorJSON.cc2[i];
		CountryName[i] = g_DescriptorJSON.common_name[i];
		HMS[i] = 0;
	}
	
	g_LookupTable = new LookupTable(CC2, CountryName, HMS);
}

function GenerateStatReferenceList()
{
	g_Stats = []; 
	for (i = 0; i < 194; i++)
	{
		g_Stats[i] = g_DescriptorJSON.stats[i];
	}
}

