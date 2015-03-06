// File Name:               lookup_table.js
// Description:             Generates lookup table
// Date Created:            3/5/2015
// Contributors:            Emma Roudabush
// Date Last Modified:      3/5/2015
// Last Modified By:        Emma Roudabush
// Dependencies:            Descriptor.php
// Additional Notes:        N/A

var g_DescriptorJSON;

function CreateLookupTable ()
{
    GetDescriptor();
    GetHMS();
    GenerateLookupTable();
    GenerateStatReferenceList();
}

function GetDescriptor ()
{
	g_DescriptorJSON = $.ajax({                                      
		type: 'post',
		url: 'http://usve74985.serverprofi24.com/API/descriptor.php',                                                     
		dataType: 'JSON',                     
		success: function(data){     
			console.log("Successfully received descriptor.php");
			console.log(JSON.stringify(data));
		} 
	});  
}

function GetHMS ()
{
}

function GenerateLookupTable ()
{
}

function GenerateStatReferenceList()
{

}