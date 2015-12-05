<?php
//Class for the by stat packet to send data to front end
require_once("packet.php");

class by_stat_packet extends packet
{

	public $year;
	
	//Session,instance,stat_id strings, data an array of json objects, year an int
	function __construct($session, $instance, $stat_id, $data, $year)
	{
		//call the SUPER!
		parent::__construct($session, $instance, $stat_id, $data);
		
		$this->year = $year;
	}
	
}

?>