<?php
/* File Name:           Descriptor.php
 * Description:         This file queries the database for the country names, 
 *                      year range, two character country code (cc2), and the stats
 * 
 * Date Created:        2/7/2015
 * Contributors:        Kyle Nicholson, Berty Ruan
 * Date Last Modified:  2/8/2015
 * Last Modified By:    Kyle Nicholson, Berty Ruan
 * Dependencies:        connect.php
 * Input:               NONE
 * Output:              Formatted JSON String containing the countryName,
 *                      yearRange, cc2, and stats arrays
 * Additional Notes:    Before completion of this file we need a populated
 *                      database on the correct server
 */

require_once("Connect.php");
require_once("Toolbox.php");
require_once("api_library.php");
$conn = GetDatabaseConnection();

$cc2 = array();
$cc3 = array();
$countryName = array();
$yearRange = array();

// TODO: Create method to gather stats data from database
$stats = array('-1','births','deaths','vaccinations');

$cc2[0] = 'KS';
$cc3[0] = 'KYS';
$countryName[0] = 'Kylestan';

 
 //TODO: unhardcode table name
 $yearRange = GetYearRange($conn, "data_births");
 

// fill cc2 and country name into array
$query = "SELECT * FROM meta_countries ORDER BY country_id";
$result = $conn->query($query);
if($result->num_rows > 0)
{ 
    // fetch the rows from the query result, place them in their respective arrays
    for($id = 1; $row = $result->fetch_assoc(); $id++)
    {   
        $cc2[$id] = $row['cc2'];
        $cc3[$id] = $row['cc3'];
        $countryName[$id] = $row['common_name'];
    }
} else 
{
    echo "ERROR: Zero results";
}

$preJsonDescriptor = array("yearRange" => $yearRange, "cc2" => $cc2, "cc3"=> $cc3, "common_name" => $countryName, "stats" => $stats);

// Merge all arrays into single array, then export to json
$descriptor = json_encode($preJsonDescriptor);
// return descriptor json string
echo $descriptor;

?>