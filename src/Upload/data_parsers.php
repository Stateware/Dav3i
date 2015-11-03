<?php
require_once("../api/connect.php");

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

function getStatNameFromFileName($fname)
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
}

function clean($data)
{
	if(is_numeric($data))
		return($data);
	return(-1);
}

?>
