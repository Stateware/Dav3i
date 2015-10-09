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
//require_once(".\..\..\src\api\toolbox.php");

class toolboxTest extends \PHPUnit_Framework_TestCase
{



public function testFatalError(){
	 $message="everything work properly";
	 
	 try{
		 $ret=  ThrowInconvenientError($message);
		 
		 $this-> assertTrue(False); 
		 
		 
	 }
	 
	 catch(Exception $e)
		{
			$this->assertTrue("{\"error\" : \"" . $message . "\"}"== $e-> getMessage());

		}
	

	 
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
	
	
public function testGetFirstRowFromColumn(){
     $tableName = "data_births";
	
	 $columnName=table_name ;
	 $expected ="{\"1\":\"SELECT table_name  FROM data_births\"}";
	 $ret=  GetFirstRowFromColumn(new mysqli("localhost","root","","dav3iphpunittest"), $tableNmae ,  $columnName, $filter = false );
	 $this-> assertTrue($ret == $expected) ;
	 
	 
	
	
	
	
	
                                            }
	
}
 
 




?>
