// File Name:               parser.js
// Description:             Parses JSON, in the format of {country,stat,data}, into a 3D array, to be
//                          used by the graphs
// Date Created:            2/12/2015
// Contributors:            Nicholas Denaro
// Date Last Modified:      2/19/2015
// Last Modified By:        Nicholas Denaro
// Dependencies:            parser_markup.js(loosely)
// Additional Notes:        N/A

// Author:          Nicholas Denaro
// Date Created:    2/12/15
// Last Modified:   2/17/15 by Nicholas Denaro
// Description:     Parses the object that is passed in and returns data array.
//                  Input: json - Assumed to be in the proper format, but checked later in function, and sets a flag
//                                if the JSON is invalid
//                  Output: data - a 3D array in the format of [stat][country/bound][values];
function ParseData(json)
{
    var data = new Array(); //Creates the array for the data to be returned
    var valid = true; //Set flag to true, and chagne to false if the JSON is not valid.

    //Loops through the countries in the JSON
    for (var country = 1; json.hasOwnProperty(country) ; country++) //Uses hasOwnProperty because properties aren't in
                                                                    //a form to check for a length.
    {
        //Loops through the stats in the JSON
        for (var stat = 1; json[country].hasOwnProperty(stat) ; stat++)
        {
            if (data[stat - 1] == null) //Checks if the array has been initilaized, if not, create new Array at index
                data[stat - 1] = new Array();
            data[stat - 1][country - 1] = json[country][stat]; //Sets the data for the specified stat,country/bound to 
                                                               //the array in the json.
        }
    }

    if (!valid) //The JSON was not valid
    {
        alert("The data recieved by server is invalid,\n" +
            "please refresh the page and try again.");
        return (null);
    }

    return (data);
}


// Author:          Nicholas Denaro
// Date Created:    2/12/15
// Last Modified:   2/17/15 by Nicholas Denaro
// Description:     Passes fake data from the textfield, jsonInput, into the parser and outputs the result into
//                  the textfield, dataOutput.
//                  Input: N/A
//                  Output: N/A
function ParseFakeData()
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
        "2"://country 2
	    {
	        1: [5, 6, 7],
	        2: [5, 7, 9],
	        3: [5, 8, 11]
	    }
    };*/

    //{"1":{"1":[1,2,3]}}

    var data = JSON.parse(document.getElementById("jsonInput").value);

    var retval = ParseData(data);

    document.getElementById("dataOutput").value = JSON.stringify(retval, "\n", 4);
}