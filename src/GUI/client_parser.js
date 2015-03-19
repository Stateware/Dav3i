// File Name:               parser.js
// Description:             Parses JSON, in the format of {stat,country/bound,data}, into a 3D array, to be
//                          used by the graphs
// Date Created:            2/12/2015
// Contributors:            Nicholas Denaro, Vanajam Soni, Paul Jang
// Date Last Modified:      3/19/2015
// Last Modified By:        Nicholas Denaro
// Dependencies:            None
// Additional Notes:        N/A

// Author:          Nicholas Denaro
// Date Created:    2/12/15
// Last Modified:   3/19/15 by Nicholas Denaro
// Description:     Parses the object that is passed in and returns data array.
//                  Input: json - Assumed to be in the proper format
//                                if the JSON is invalid
//                  Output: data - A 2D array in the form [stat][year]
function ParseData(json)
// PRE: json is valid JSON with data for only one country
// POST: FCTVAL == a 2d array containing stat, year
{
    var data = new Array(); // Creates the array for the data to be returned
    data = json[Object.keys(json)[0]];// Since there will only be one country in each json,
                                      // we can simply get the first key, and use that to
                                      // get the value for the data.

    return (data);
}


// Author:          Nicholas Denaro
// Date Created:    2/12/15
// Last Modified:   3/19/15 by Nicholas Denaro
// Description:     Passes fake data from the textfield, jsonInput, into the parser and outputs the
//                  result into the textfield, dataOutput.
//                  Input: N/A
//                  Output: N/A
function ParseFakeData()
// PRE: This function is called from parser_markup.html
// POST: FCTVAL == null
{
    var data = JSON.parse(document.getElementById("jsonInput").value);

    var retval = ParseData(data);

    document.getElementById("dataOutput").value = JSON.stringify(retval, "\n", 4);
}