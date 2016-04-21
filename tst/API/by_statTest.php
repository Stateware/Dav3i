<?php
/* File Name:          testBy_stats.php
 * Description:         
 * 
 * Contributors:        Zekun Yang
 * Date Last Modified:  9/28/2015
 * Last Modified By:    Zekun Yang
 * Dependencies:        by_stat.php
 */
require_once (".\..\..\src\api\by_stat.php");
class testby_stat extends \PHPUnit_Framework_TestCase
{

	public function testByStatMissingStatID()
	{
		$year = 2012;
		$sessionID = 1;
		$instanceID = 1;
		$statID = null;
		
		try
		{
			$ret = stat_exe ($statID,$year,$sessionID,$instanceID);

			$this->assertTrue(false);//The function should throw an error and therefore never reach this assert.
		}
		catch(Exception $e)
		{
			$this->assertTrue("{\"error\" : \"Input is not defined: statID\"}" == $e->getMessage());
		}
	}

	public function testByStatMissingInstanceID()
	{
		$year = 1;
		$sessionID = 1;
		$instanceID = null;
		$statID = 1;
		
		try
		{
			$ret = stat_exe ($statID,$year,$sessionID,$instanceID);

			$this->assertTrue(false);//The function should throw an error and therefore never reach this assert.
		}
		catch(Exception $e)
		{
			$this->assertTrue("{\"error\" : \"Input is not defined: instanceID\"}" == $e->getMessage());
		}
	}	

	public function testByStatMissingSessionID()
	{
		$year = 2012;
		$sessionID = null;
		$instanceID = 1;
		$statID = 1;
		
		try
		{
			$ret = stat_exe ($statID,$year,$sessionID,$instanceID);

			$this->assertTrue(false);//The function should throw an error and therefore never reach this assert.
		}
		catch(Exception $e)
		{
			$this->assertTrue("{\"error\" : \"Input is not defined: sessionID\"}" == $e->getMessage());
		}
	}

	public function testByStatPass()
	{
		$year = 2012;
		$sessionID = 35;
		$instanceID = 46;
		$statID = 1;
		
		try
		{
			$ret = stat_exe ($statID,$year,$sessionID,$instanceID);

			$this->assertTrue(true);//The function should exit without any exceptions.
		}
		catch(Exception $e)
		{
			$this->assertTrue(false);//The function should throw any errors.
		}
	}
}
?>