<?php
//Class for the by stat packet to send data to front end
require_once("packet.php");

class by_country_packet extends packet
{

	public $country;
	
	//Session,instance,stat_id strings, data an array of json objects, year an int
	function __construct($session, $instance, $stat_id, $data, $country)
	{
		//call the SUPER!
		parent::__construct($session, $instance, $stat_id, $data);
		
		$this->country = $country;
	}
	
}

?>