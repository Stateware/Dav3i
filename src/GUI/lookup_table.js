// File Name:               lookup_table.js
// Description:             Generates lookup table
// Date Created:            3/5/2015
// Contributors:            Emma Roudabush
// Date Last Modified:      3/5/2015
// Last Modified By:        Emma Roudabush
// Dependencies:            none
// Additional Notes:        N/A

var g_DescriptorJSON;

function CreateLookupTable ()
{
    getDescriptor();
    GetHMS();
    createLookupTable();
    createStatReferenceList();
}

function GetDescriptor ()
{
    g_DescriptorJSON = $.ajax({
        type: "get",
        url: "http://usve74985.serverprofi24.com/API/descriptor.php",
        dataType: "json",
        success:function(data) {
            console.log("success");
            console.log(JSON.Stringify(data));
        },
        error:function(error) {
            alert("error");
            console.log(error);
        }
    });
}

function GetHMS ()
{
}

function CreateLookupTable()
{
}

function CreateStatReferenceList()
{
}
