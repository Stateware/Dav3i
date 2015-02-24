<?php
/* File Name:           descriptor.php
 * Description:         This file queries the database for the country names, 
 *                      year range, two character country code (cc2), and the stats
 * 
 * Date Created:        2/7/2015
 * Contributors:        Kyle Nicholson, Berty Ruan
 * Date Last Modified:  2/22/2015
 * Last Modified By:    Will Bittner 
 * Dependencies:        connect.php
 * Input:               NONE
 * Output:              Formatted JSON String containing the countryName,
 *                      yearRange, cc2, and stats arrays
 * Additional Notes:    Before completion of this file we need a populated
 *                      database on the correct server
 */

require_once("api_library.php");

// enable foreign access in testing
if (TESTING)
{
	header("Access-Control-Allow-Origin: *");
}

$descriptorArray = Descriptor();

//encode results of Descriptor() into json
$descriptor = json_encode($descriptorArray);

// return descriptor json string
echo $descriptor;

?>
