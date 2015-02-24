// File Name:               parsertest.js
// Description:             automated test program for the parser module
// Date Created:            2/15/2015
// Contributors:            Paul Jang
// Date Last Modified:      2/18/2015
// Last Modified By:        Paul Jang
// Dependencies:            parser.js
// Additional Notes:        N/A

// Author:          Paul Jang
// Date Created:    2/15/15
// Last Modified:   2/18/15 by Paul Jang
// Description:     Generates a JSON with random numbers and parses the data into an array. Proceeds to check
//                  the array against the original JSON to make sure the data values match.
//                  Input: N/A
//                  Output: Outputs the parsed array and whether or not it matches the original JSON.
function testing()
{
    var match = true;                                                               // flag that indicates whether or not the JSON and output array match
    var Data1 =                                                                     // JSON of random numbers
    {
        1 :
        {
            1: [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
            2: [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
            3: [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)]
        },
        2 :
        {
            1: [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
            2: [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
            3: [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)]
        }
    };

    var t_parser = new Parser(Data1);                                               // creates a parser using the Data1 JSON as input
    var retval = t_parser.getParsedData;                                            // parses the data and stores it in retval

    for (var country = 1; Data1.hasOwnProperty(country); country++)                 // checks through the JSON and output array to see if all the elements match
    {
        for (var stat = 1; Data1.hasOwnProperty(stat) ; stat++)
        {
            if(retval[country-1][stat-1] != Data1[country][stat])
            {
                match = false;
            }
        }
    }

    document.getElementById("myTextArea").value = JSON.stringify(retval, "\n", 4);  // outputs the array and "true" if match and "false" if no match
    document.getElementById("matchArea").value = match;
}

