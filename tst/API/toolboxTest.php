<?php
/* File Name:           toolboxTest.php
 * Description:         This file test the toolbox.php ,using phpunit test
 * Date Created:        2/12/2015
 * Contributors:        Drew Lopreiato, William Bittner, Kyle Nicholson, Berty Ruan, Arun Kumar
 * Date Last Modified:  9/28/2015
 * Last Modified By:    zekun yang
 * Dependencies:        toolbox.php
 * Input:               none
 * Output:              none
 */ 
require_once(".\..\..\src\api\\toolbox.php");

class toolboxTest extends \PHPUnit_Framework_TestCase
{



public function testFatalError(){
	 $message="everything work properly";
	 
	 try
	 {
		 $ret=  ThrowInconvenientError($message);
		 
		 $this-> assertTrue(False); 
		 
		 
	 }	 
	 catch(Exception $e)
	{
		$this->assertTrue("{\"error\" : \"" . $message . "\"}"== $e-> getMessage());

	}	 
 }

 public function testFlushedPrint()
 {
 	flushedPrint("echo");
 	$this->assertTrue(true);
 }

 public function testGetArgumentValueIsset()
 {
 	$_GET["test"] = true;
 	$ret = GetArgumentValue("test");

 	$this->assertTrue($ret);
 }

 public function testGetArgumentValueNotIssetRequired()
 {
 	try
 	{
	 	$ret = GetArgumentValue("test");

	 	$this->assertTrue(false); // Function should throw an error.
	 }
	 catch(Exception $e)
	 {
	 	$this->assertTrue(true); // Error should be caught.
	 }
 }

 public function testGetArgumentValueNotIssetNotRequired()
 {
 	$ret = GetArgumentValue("test",false);

 	$this->assertTrue($ret == null);
 }


public function testInconvenientError(){
	$message= "An inconvenient error has occured - program flow will continue.";
	try {
		
		$ret = ThrowInconvenientError($message);
		$this-> assertTrue(False); 
		
		
		
	    }
	catch(Exception $e){
		 
		 
		 $this->assertTrue("Error: " . $message == $e->getMessage());
		 
		 
		 
		 
	                   }
}
	
}
 
 




?>
