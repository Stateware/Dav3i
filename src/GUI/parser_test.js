// File Name:               parser_test.js
// Description:             automated test program for the parser module
// Date Created:            2/15/2015
// Contributors:            Paul Jang
// Date Last Modified:      2/24/2015
// Last Modified By:        Paul Jang
// Dependencies:            parser.js, parser_test_markup.html (loosely)
// Additional Notes:        N/A

// Author:          Paul Jang
// Date Created:    2/15/15
// Last Modified:   2/24/15 by Paul Jang
// Description:     Generates a JSON with random numbers and parses the data into an array. Proceeds to check
//                  the array against the original JSON to make sure the data values match.
//                  Input: N/A
//                  Output: Outputs the parsed array and whether or not it matches the original JSON.
function RunParserTest()
{
    var match = true;                   // flag that indicates whether or not the JSON and output array match
    var data1 =                         // JSON of random numbers
    {
    1:
    {
       1: [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
       2: [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
       3: [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)]
    },
    2:
    {
       1: [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
       2: [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
       3: [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)]
    }
};
    
    var outputArray = ParseData(data1); // fills outputArray with parsed JSON data            

    // checks through the JSON and output array to see if all the elements match
    for (var country = 1; data1.hasOwnProperty(country) ; country++)
    {
        //Loops through the stats in the JSON
        for (var stat = 1; data1[country].hasOwnProperty(stat) ; stat++)
        {
            if (outputArray[stat - 1][country - 1] != data1[country][stat])
            {
                match = false;
            }
        }
    }

    // outputs the array and "true" if match and "false" if no match
    document.getElementById("outputArrayDisplay").value = JSON.stringify(outputArray, "\n", 4);  
    document.getElementById("matchDisplay").value = match;
}

