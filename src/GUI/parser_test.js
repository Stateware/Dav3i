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
    // flags that indicates whether or not the JSON and output arrays match
    var match1 = true; var match2 = true; var match3 = true;
    var data1 =                         // JSON of random    numbers
    {
    1:
    {
       1: [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
       2: [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
       3: [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)]
    },
    };

    var data2 =                         // JSON of random numbers
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

    var data3 =                         // JSON of random numbers
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
    },
    3:
    {
        1: [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
        2: [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)],
        3: [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)]
    }
    };
    var cids1 = [1]; var cids2 = [2,1]; var cids3 = [3,1,2];
    
    var outputArray1 = ParseData(data1,cids1); // fills outputArray with parsed JSON data
    var outputArray2 = ParseData(data2,cids2);
    var outputArray3 = ParseData(data3,cids3);

    // checks through the JSON and output array to see if all the elements match
    //Loops through the countries in the JSON
    for (var cid = 0; cid < cids1.length ; cid++) {
        //Loops through the stats in the JSON
        for (var stat = 1; data1[cids1[cid]].hasOwnProperty(stat) ; stat++) {
            if (outputArray1[stat - 1][cid] != data1[cids1[cid]][stat]) {
                match1 = false;
            }
        }
    }

    for (var cid = 0; cid < cids2.length ; cid++) {
        //Loops through the stats in the JSON
        for (var stat = 1; data2[cids2[cid]].hasOwnProperty(stat) ; stat++) {
            if (outputArray2[stat - 1][cid] != data2[cids2[cid]][stat]) {
                match2 = false;
            }
        }
    }

    for (var cid = 0; cid < cids3.length ; cid++) {
        //Loops through the stats in the JSON
        for (var stat = 1; data3[cids3[cid]].hasOwnProperty(stat) ; stat++) {
            if (outputArray3[stat - 1][cid] != data3[cids3[cid]][stat]) {
                match3 = false;
            }
        }
    }
    // outputs the array and "true" if match and "false" if no match
    document.getElementById("outputArrayDisplay1").value = JSON.stringify(outputArray1, "\n", 4);  
    document.getElementById("matchDisplay1").value = match1;
    document.getElementById("outputArrayDisplay2").value = JSON.stringify(outputArray2, "\n", 4);
    document.getElementById("matchDisplay2").value = match2;
    document.getElementById("outputArrayDisplay3").value = JSON.stringify(outputArray3, "\n", 4);
    document.getElementById("matchDisplay3").value = match3;
}

