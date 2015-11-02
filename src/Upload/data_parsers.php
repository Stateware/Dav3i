<?php

if(isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST')
{
	$g_sessionName = $_POST['session-name'];
	$g_instanceCount = $_POST['instance-count'];
	
	//loop through $g_instanceCount and grab each 'instance-(number)' named file called 'instance-file-(number)
	//	 and then extract/sanitize&validate/then send to db.

	echo $g_sessionName;
	echo $g_instanceCount;
}

?>
