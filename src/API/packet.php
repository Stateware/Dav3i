<?php
//Class for the packet to send data to front end

class Packet
{

	public $session;
	public $instance;
	public $stat_id;
	public $data = array();
	
	//Session,instance,stat_id strings, data an array of json objects
	function __construct($session, $instance, $stat_id, $data)
	{
		$this->session = $session;
		$this->instance = $instance;
		$this->stat_id = $stat_id;
		$this->data = $data;		
	}
	
	function send( $readable = false )
	{	
		if( $readable )
			echo "<pre>".json_encode($this, JSON_PRETTY_PRINT)."</pre>";
		else
			echo json_encode($this);
	}
}

?>