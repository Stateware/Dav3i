// File Name:               parser_test.js
// Description:             automated test program for the parser module
// Date Created:            2/15/2015
// Contributors:            Paul Jang, Nicholas Denaro
// Date Last Modified:      3/19/2015
// Last Modified By:        Nicholas Denaro
// Dependencies:            client_parser.js, parser_test_markup.html (loosely)
// Additional Notes:        N/A

// Author:          Paul Jang
// Date Created:    2/15/15
// Last Modified:   3/19/15 by Nicholas Denaro
// Description:     Generates a JSON with random numbers and parses the data into an array. Proceeds to check
//                  the array against the original JSON to make sure the data values match.
//                  Input: N/A
//                  Output: Outputs the parsed array and whether or not it matches the original JSON.
function RunParserTest()
{
    // flags that indicates whether or not the JSON and output arrays match
    var match1 = true; var match2 = true; var match3 = true;

    var cid1 = Math.floor(Math.random() * 100);
    var data1 = { cid: new Array() };
    var expectedOutput1=new Array();
    for (var stat = 0; stat < 10; stat++)
    {
        data1.cid[stat]=new Array();
        expectedOutput1[stat]=new Array();
        for (var year = 1980-1980; year < 2015-1980; year++)
        {
            var randomValue = Math.floor(Math.random() * 100000);
            data1.cid[stat][year] = randomValue;
            expectedOutput1[stat][year] = randomValue;
        }
    }
    
    var outputArray1 = ParseData(data1); // fills outputArray with parsed JSON data

    for (var stat = 0; match1 && stat < 10; stat++)
    {
        for(var year = 0; match1 && year < 2015 - 1980; year++)
        {
            if(expectedOutput1[stat][year]!=outputArray1[stat][year])
            {
                match1 = false;
            }
        }
    }

    // outputs the array and "true" if match and "false" if no match
    document.getElementById("outputArrayDisplay1").value = JSON.stringify(outputArray1, "\n", 4);  
    document.getElementById("matchDisplay1").value = match1;
}

