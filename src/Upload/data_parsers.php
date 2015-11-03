<?php

if(isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST')
{
	$g_sessionName = $_POST['session-name'];
	$g_instanceCount = $_POST['instance-count'];

	//loop through $g_instanceCount and grab each 'instance-name-(number)' named file called 'instance-file-(number)
	//	 and then extract/sanitize&validate/then send to db.
	for($i = 1; $i <= $g_instanceCount; $i++)
	{
		$instanceName = $_POST['instance-name-'.$i];
		$file = $_FILES['instance-file-'.$i];

		if($file['error'] != 0)
		{
			//TODO: error!!!
			echo "error code " . $file['error'];
			return;
		}

		$isZip = substr($file['name'], -4) === ".zip";
		
		if(!$isZip)
		{
			//TODO: error!!!
			echo "not a zip";
			return;
		}

		$zipFD = zip_open($file['tmp_name']);

		if(is_resource($zipFD))
		{
			while($resourceID = zip_read($zipFD))
			{
				$datafileName = zip_entry_name($resourceID);
				$datafile = zip_entry_read($resourceID,zip_entry_filesize($resourceID));

				$tempDatafile  = tmpfile();
				fwrite($tempDatafile, $datafile);
				fseek($tempDatafile, 0);

				$testData = "";
				while(!feof($tempDatafile))
					$testData .= fread($tempDatafile, 1);

				$testData = preg_replace("/\"/", "", $testData);
				$testData = trim(preg_replace('~\R~', "|", $testData));
				$rows = explode( "|", $testData);

				$output = array();

				for($row = 0; $row < sizeof($rows); $row++)
				{
					array_push($output, explode("," , $rows[$row]));
				}

				fclose($tempDatafile);

				echo $datafileName . "<br>" . json_encode($output) . "<br>";

			}
		}
	}

	echo $g_sessionName;
	echo $g_instanceCount;
}

?>
