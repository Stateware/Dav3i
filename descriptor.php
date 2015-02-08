<?php
require 'connect.php'; 

$cc2 = array();
$countryName = array();
$yearRange = array();
$stats = array('-1','births','deaths','vaccinations');

$cc2[0] = 'KS';
$countryName[0] = 'Kylestan';
$yearRange = range(1980,2014);

// fill cc2 and country name into array
$query = "SELECT * FROM descriptor ORDER BY id";
$result = $conn->query($query);
if($result->num_rows > 0)
{ 
    // fetch the rows from the query result, place them in their respective arrays
    for($id = 1; $row = $result->fetch_assoc(); $id++)
    {  
        $cc2[$id] = $row['cc2'];
        $countryName[$id] = $row['CountryName'];
    }
}

// Merge all arrays into single array, then export to json
$descriptor = json_encode(array("yearRange" => $yearRange, "cc2" => $cc2, "countryName" => $countryName, "stats" => $stats),JSON_PRETTY_PRINT);

// return descriptor json string
echo $descriptor;
?>