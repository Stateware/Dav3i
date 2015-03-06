// File Name:               data_query.js
// Description:             takes CC2 codes and sends them to lookup_table.js, receives CIDs, queries the database,
//                          parses the JSON and returns the array
// Date Created:            3/5/2015
// Contributors:            Paul Jang
// Date Last Modified:      3/5/2015
// Last Modified By:        Paul Jang
// Dependencies:            lookup_table.js, byCountry.php, parser.js
// Additional Notes:        N/A

// Author:          Paul Jang
// Date Created:    3/5/15
// Last Modified:   3/5/15 by Paul Jang
// Description:     Feeds CC2 codes into the lookup table and receives CIDs
//                  Input: CC2 codes
//                  Output: CID
function GetCID(cc2)
{
}

// Author:          Paul Jang
// Date Created:    3/5/15
// Last Modified:   3/5/15 by Paul Jang
// Description:     queries the database for the JSON using the CIDs
//                  Input: CIDs, from the getCID function
//                  Output: the JSON from the database
function QueryJSON(cids)
{
}

// Author:          Paul Jang
// Date Created:    3/5/15
// Last Modified:   3/5/15 by Paul Jang
// Description:     Takes a JSON and parses it into an array
//                  Input: JSON, queried from the database
//                  Output: the parsed array of data
function ParseJSON(json)
{
}

// Author:          Paul Jang
// Date Created:    3/5/15
// Last Modified:   3/5/15 by Paul Jang
// Description:     Calls all of the functions to take the CC2 and output the array for the map
//                  Input: CC2 codes
//                  Output: array of data for the map
function GetData(cc2)
{
	GetCID(// cc2s from ?);
	QueryJSON(// cids from GetCID);
	var outputArray = ParseJSON();
	return outputArray;
}



