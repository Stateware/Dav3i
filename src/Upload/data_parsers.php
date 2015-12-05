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
require_once("../../src/api/toolbox.php");

parse();

// Author:        William Bittner, Nicholas Denaro, Brent Mosier 
// Date Created:  11/1/2015  
// Last Modified: 11/5/2015 by Brent Mosier  
// Description:   
function parse()
// PRE: All $_POST and $_FILES variables are defined and valid.
// POST: Data is uploaded to the database
{
if(isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST')
{
	$time = time();
	$g_sessionName = $_POST['session-name'];
	$g_instanceCount = $_POST['instance-count'];

	flushedPrint("Number of instances: " . $g_instanceCount);

	$databaseConnection = GetDatabaseConnection();

	flushedPrint("Connected to database: " . $databaseConnection->query("SELECT DATABASE()")->fetch_row()[0]);

	//Insert null into session_id so it auto increments. 0s for the years to be filled in later.
	$sessionInsertQuery = "INSERT INTO `meta_session` (`session_id`, `session_name`, `start_year`, `end_year`) VALUES (NULL, '".$g_sessionName."', '0', '0');";
	$sessionInsertResult = $databaseConnection->query($sessionInsertQuery);

	//Get the ID of the session we just added.
	$sessionIDQuery = "SELECT session_id FROM meta_session WHERE session_name='".$g_sessionName."'";
	$sessionID = $databaseConnection->query($sessionIDQuery)->fetch_assoc()['session_id'];

	//loop through $g_instanceCount and grab each 'instance-name-(number)' named file called 'instance-file-(number)
	//	 and then extract/sanitize&validate/then send to db.
	for($i = 1; $i <= $g_instanceCount; $i++)
	{
		flushedPrint("Starting instance " . $i);

		$instanceName = $_POST['instance-name-'.$i];
		$file = $_FILES['instance-file-'.$i];

		flushedPrint("Instance name: " . $instanceName);
		flushedPrint("Reading from file: " . $file['name']);

		if($file['error'] != 0)
		{
			flushedPrint("error code " . $file['error']);
			continue; // Continue to the next instance
		}

		$isZip = substr($file['name'], -4) === ".zip"; // check if file is a zip.
		//TODO: Check if the encoding of the file to see if the file is actually a zip.
		
		if(!$isZip)
		{
			flushedPrint("Not a zip file.");
			continue; // Continue to the next instance
		}

		$instanceInsertQuery = "INSERT INTO `meta_instance` (`instance_id`, `instance_name`) VALUES (NULL, '".$instanceName."');";
		$instanceInsertResult = $databaseConnection->query($instanceInsertQuery);

		//Get the ID of the instance we just added.
		$instanceIDQuery = "SELECT instance_id FROM meta_instance WHERE instance_name='".$instanceName."'";
		$instanceID = $databaseConnection->query($instanceIDQuery)->fetch_assoc()['instance_id'];

		$zipFD = zip_open($file['tmp_name']);

		if(is_resource($zipFD))
		{
			$numRows = 0;
			$affectedRows = 0;
			//Repeat of each of the files in the zip.
			while($resourceID = zip_read($zipFD))
			{
				$datafileName = zip_entry_name($resourceID);
				$datafile = zip_entry_read($resourceID,zip_entry_filesize($resourceID));

				flushedPrint("Reading file: " . $datafileName);
				flushedPrint("Stat: " . getStatNameFromFileName($datafileName));

				//Check if the file is a CSV
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

					//Add data to database
					$startYear = $output[0][1];
					$endYear = $output[0][sizeof($output[0])-1];

					//update database to set start and end years
					$sessionStartAndEndQuery = "UPDATE meta_session SET `start_year`='".$startYear."', `end_year`='".$endYear."' WHERE session_id='".$sessionID."'";
					$databaseConnection->query($sessionStartAndEndQuery);

					$statIDQuery = "SELECT stat_id FROM meta_stats WHERE stat_name='".getStatNameFromFileName($datafileName)."'";
					$statID = $databaseConnection->query($statIDQuery)->fetch_assoc()['stat_id'];

					//If for some reason the first row is shifted by 1 to the left, add and empty cell.
					if($output[0][0] != "")
						array_unshift($output[0], "");

					//Add data for each country
					for($country = 1; $country < sizeof($output); $country++)
					{
						$countryIDQuery = "SELECT country_id FROM meta_countries WHERE cc3='".$output[$country][0]."'";
						$countryID = $databaseConnection->query($countryIDQuery)->fetch_assoc()['country_id'];

						//Base query, add values in later loop
						$dataInsertQuery = "INSERT INTO data (`session_id`, `instance_id`, `country_id`, `stat_id`, `year`, `value`) VALUES ";

						//Add all of the years data for a country to the query						
						for($year = 1; $year < sizeof($output[$country]); $year++)
						{
							set_time_limit(30);
							$dataYear = $output[0][$year];							
							$dataInsertQuery.="('".$sessionID."', '".$instanceID."', '".$countryID."', '".$statID."', '".$dataYear."', '".clean($output[$country][$year])."'), ";
							$numRows++;
						}
						$dataInsertQuery=substr($dataInsertQuery,0,-2); // We have a trailing comma, remove it.
						$dataInsertQuery.=";";//Add the semi-colon to the end of the query
						$databaseConnection->query($dataInsertQuery);

						$affectedRows += $databaseConnection->affected_rows;

						ob_flush();
						flush();
					}

					flushedPrint("Finished file " . $datafileName . ": ");
				}
			}
		}

		flushedPrint("Finished instance: " . $instanceName);
		flushedPrint( "Read " . $numRows . " rows from CSVs.");
		flushedPrint( "Inserted " . $affectedRows . " rows.");
		if($numRows != $affectedRows)
		{
			flushedPrint( "Error: failed to upload all data.");
		}
	}
	flushedPrint( "It took ". (time() - $time) . " seconds to upload.");
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
	$posOfSlash = stripos($fname, "/") == false ? -1 : stripos($fname, "/");// stripos returns false if not found, so if not found, we want want the entire string
																			// which -1 implies that not found, and plus 1 will be 0.
	$fname = substr($fname, $posOfSlash + 1); 
	switch($fname)
	{
		case "input-births.csv":
			return "births";
		case "input-deaths.csv":
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
