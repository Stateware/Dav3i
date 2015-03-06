// File Name:               parser.js
// Description:             Parses JSON, in the format of {stat,country/bound,data}, into a 3D array, to be
//                          used by the graphs
// Date Created:            2/12/2015
// Contributors:            Nicholas Denaro, Vanajam Soni, Paul Jang
// Date Last Modified:      3/4/2015
// Last Modified By:        Nicholas Denaro
// Dependencies:            None
// Additional Notes:        N/A

// Author:          Nicholas Denaro
// Date Created:    2/12/15
// Last Modified:   3/5/15 by Nicholas Denaro
// Description:     Parses the object that is passed in and returns data array.
//                  Input: json - Assumed to be in the proper format, but checked later in function, and sets a flag
//                                if the JSON is invalid
//                         cids - An array of country IDs in the same order that were sent to the server.
//                  Output: data - A 3D array in the format of [stat][country/bound][values];
function ParseData(json, cids)
// PRE: json is valid JSON and cids is an array with the same size as the countries in json
// POST: FCTVAL == a 3d array containing stat, country/bound, data
{
    var data = new Array(); //Creates the array for the data to be returned

    //Loops through the countries in the JSON
    for (var cid=0; cid<cids.length ; cid++)
    {
        //Loops through the stats in the JSON
        for (var stat = 1; json[cids[cid]].hasOwnProperty(stat) ; stat++)
        {
            if (data[stat - 1] == null) //Checks if the array has been initilaized, if not, create new Array at index
                data[stat - 1] = new Array();
            data[stat - 1][cid] = json[cids[cid]][stat]; //Sets the data for the specified stat,country/bound to 
                                                         //the array in the json.
        }
    }

    return (data);
}


// Author:          Nicholas Denaro
// Date Created:    2/12/15
// Last Modified:   2/24/15 by Nicholas Denaro
// Description:     Passes fake data from the textfields, jsonInput and arrayInput, into the parser and outputs the
//                  result into the textfield, dataOutput.
//                  Input: N/A
//                  Output: N/A
function ParseFakeData()
// PRE: This function is called from parser_markup.html
// POST: FCTVAL == null
{
    //This is how we think the JSON looks.
    /*var data =
    {
        "1"://country 1
	    {
	        1: [1, 2, 3],//array1
	        2: [3, 4, 4],//array2
	        3: [5, 6, 7]
	    },
        "34"://country 2
	    {
	        1: [5, 6, 7],
	        2: [5, 7, 9],
	        3: [5, 8, 11]
	    }
    };*/

    //{"1":{"1":[1,2,3]}}

    var data = JSON.parse(document.getElementById("jsonInput").value);
    var array = JSON.parse(document.getElementById("arrayInput").value);

    var retval = ParseData(data, array);

    document.getElementById("dataOutput").value = JSON.stringify(retval, "\n", 4);
}