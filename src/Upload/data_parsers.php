<?php
/*
 * Copyright 2015 Stateware Team: William Bittner, Nicholas Denaro, 
 * Dylan Fetch, Paul Jang, Brent Mosier, Zekun Yang
 * 
 * This file is part of Dav3i.
 * 
 * Dav3i is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * Dav3i is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Dav3i.  If not, see <http://www.gnu.org/licenses/>.
 */

/* File Name:           data_parsersTest.php
 * Description:         This file tests the functions of connect.php using PHP Unit.
 * 
 * Date Created:        10/29/2015
 * Contributors:        William Bittner, Nicholas Denaro
 * Date Last Modified:  11/3/2015
 * Last Modified By:    William Bittner
 * Dependencies:        connect.php
 * Input:               NONE
 * Output:              NONE
 * Additional Notes:    In its current iteration, this document has security vulnerabilities
 *                      that could seriously damage the database. Keeping this file uploaded
 *                      while not actively being developed is NOT recommended.
 */
require_once("../../src/api/connect.php");

parse();

// Author:        William Bittner, Nicholas Denaro, Brent Mosier 
// Date Created:  11/1/2015  
// Last Modified: 11/5/2015 by Brent Mosier  
// Description:   
function parse()
// PRE: 
// POST: 
{
if(isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST')
{
	$time = time();
	$g_sessionName = $_POST['session-name'];
	$g_instanceCount = $_POST['instance-count'];


	$databaseConnection = GetDatabaseConnection();

	$sessionInsertQuery = "INSERT INTO `meta_session` (`session_id`, `session_name`, `start_year`, `end_year`) VALUES (NULL, '".$g_sessionName."', '0', '0');";
	$sessionInsertResult = $databaseConnection->query($sessionInsertQuery);

	$sessionIDQuery = "SELECT session_id FROM meta_session WHERE session_name='".$g_sessionName."'";
	$sessionID = $databaseConnection->query($sessionIDQuery)->fetch_assoc()['session_id'];

	//loop through $g_instanceCount and grab each 'instance-name-(number)' named file called 'instance-file-(number)
	//	 and then extract/sanitize&validate/then send to db.
	for($i = 1; $i <= $g_instanceCount; $i++)
	{
		$instanceName = $_POST['instance-name-'.$i];
		$file = $_FILES['instance-file-'.$i];

		if($file['error'] != 0)
		{
			//TODO: error!!!
			echo "error code " . $file['error'] . "<br>";
			continue;
		}

		$isZip = substr($file['name'], -4) === ".zip";
		
		if(!$isZip)
		{
			//TODO: error!!!
			echo "not a zip<br>";
			continue;
		}

		$instanceInsertQuery = "INSERT INTO `meta_instance` (`instance_id`, `instance_name`) VALUES (NULL, '".$instanceName."');";
		$instanceInsertResult = $databaseConnection->query($instanceInsertQuery);

		$instanceIDQuery = "SELECT instance_id FROM meta_instance WHERE instance_name='".$instanceName."'";
		$instanceID = $databaseConnection->query($instanceIDQuery)->fetch_assoc()['instance_id'];

		//return;

		$zipFD = zip_open($file['tmp_name']);

		if(is_resource($zipFD))
		{
			$numRows = 0;
			while($resourceID = zip_read($zipFD))
			{
				$datafileName = zip_entry_name($resourceID);
				$datafile = zip_entry_read($resourceID,zip_entry_filesize($resourceID));

				if(substr($datafileName,-4) === ".csv")
				{
					$tempDatafile  = tmpfile();
					fwrite($tempDatafile, $datafile);
					fseek($tempDatafile, 0);

					//Read in entire file
					$testData = "";
					while(!feof($tempDatafile))
						$testData .= fread($tempDatafile, 1);

					//replace bothersome quotes and new lines
					$testData = preg_replace("/\"/", "", $testData);
					$testData = trim(preg_replace('~\R~', "|", $testData));

					//parse data into 2D array
					$rows = explode( "|", $testData);
					$output = array();
					for($row = 0; $row < sizeof($rows); $row++)
					{
						array_push($output, explode("," , $rows[$row]));
					}

					fclose($tempDatafile);

					//echo json_encode($output) . "<br>";

					//echo $datafileName . "<br>";

					//Add data to database
					$startYear = $output[0][1];
					$endYear = $output[0][sizeof($output[0])-1];

					//update database to set start and end
					$sessionStartAndEndQuery = "UPDATE meta_session SET `start_year`='".$startYear."', `end_year`='".$endYear."' WHERE session_id='".$sessionID."'";
					$databaseConnection->query($sessionStartAndEndQuery);

					$statIDQuery = "SELECT stat_id FROM meta_stats WHERE stat_name='".getStatNameFromFileName($datafileName)."'";
					$statID = $databaseConnection->query($statIDQuery)->fetch_assoc()['stat_id'];

					if($output[0][0] != "")
						array_unshift($output[0], "");
					//echo $datafileName .  "<br>";
					//echo " 0 ". json_encode(array_keys($output[0])) . "<br>";
					for($country = 1; $country < sizeof($output); $country++)
					{
						$countryIDQuery = "SELECT country_id FROM meta_countries WHERE cc3='".$output[$country][0]."'";
						$countryID = $databaseConnection->query($countryIDQuery)->fetch_assoc()['country_id'];

						$dataInsertQuery = "INSERT INTO data (`session_id`, `instance_id`, `country_id`, `stat_id`, `year`, `value`) VALUES ";
								//."VALUES ('".$sessionID."', '".$instanceID."', '".$countryID."', '".$statID."', '".$dataYear."', '".clean($output[$country][$year])."' )";
						//echo json_encode(array_keys($output[$country])) . "<br>";



						for($year = 1; $year < sizeof($output[$country]); $year++)
						{
							set_time_limit(30);
							$dataYear = $output[0][$year];							
							$dataInsertQuery.="('".$sessionID."', '".$instanceID."', '".$countryID."', '".$statID."', '".$dataYear."', '".clean($output[$country][$year])."'), ";
							$numRows++;
						}
						$dataInsertQuery=substr($dataInsertQuery,0,-2);
						$dataInsertQuery.=";";
						//echo $dataInsertQuery . "<br>";
						$databaseConnection->query($dataInsertQuery);
						ob_flush();
						flush();
					}

					//echo $datafileName . "<br>" . json_encode($output) . "<br>";
				}
			}
		}
	}

	//echo $g_sessionName;
	//echo $g_instanceCount;
	echo "There were " . $numRows . " inserted.";
	echo "It took ". (time() - $time) . " seconds to upload.";
}
}//END parse

// Author:        William Bittner, Nicholas Denaro, Brent Mosier 
// Date Created:  11/1/2015  
// Last Modified: 11/5/2015 by William Bittner   
// Description: This function checks the name of the file being passed in to return the name of the stat that will be assigned to the data contained in the file
function getStatNameFromFileName($fname)
// PRE: fname is a name of a particular file found in a directory on the server
// POST: a string containing the stat name for the designated file being checked
{
	$fname = substr($fname, stripos($fname, "/") + 1);
	switch($fname)
	{
		case "input-births.csv":
			return "births";
		case "input-deaths-5.csv":
			return "deaths";
		case "input-cases.csv":
			return "cases";
		case "input-populations.csv":
			return "populations";
		case "input-mcv1.csv":
			return "mcv1";
		case "input-mcv2.csv":
			return "mcv2";
		case "output-estimated-incidence.csv":
			return "e_cases";
		case "output-lb-estimated-incidence.csv":
			return "lbe_cases";
		case "output-ub-estimated-incidence.csv":
			return "ube_cases";
		case "output-estimated-mortality.csv":
			return "e_mortality";
		case "output-lb-estimated-mortality.csv":
			return "lbe_mortality";
		case "output-ub-estimated-mortality.csv":
			return "ube_mortality";
		case "output-sia-coverage.csv":
			return "sia";
		default:
			return "oops";
	}
}//END getStatNameFromFileName

// Author:        William Bittner, Nicholas Denaro, Brent Mosier 
// Date Created:  11/1/2015  
// Last Modified: 11/5/2015 by William Bittner 
// Description: This function checks that the data is a number or a numerical string
function clean($data)
// PRE: data is a number or numerical string
// POST: returns the data if it is numerical or a -1 if the data is not numeric
{
	if(is_numeric($data))
		return($data);
	return(-1);
}//END clean

?>
