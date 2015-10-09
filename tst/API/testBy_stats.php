<?php
/* File Name:          testBy_stats.php
 * Description:         This file queries the database for data from every country for 1 specific year and 1 specifc
 *                      statistic.
 * 
 * Date Created:        2/7/2015
 * Contributors:        Will Bittner, Arun Kumar, Drew Lopreiato
 * Date Last Modified:  9/28/2015
 * Last Modified By:    Zekun Yang
 * Dependencies:        by_stat.php
 */
//require_once (".\..\..\src\api\by_country.php");
class testby_stat extends \PHPUnit_Framework_TestCase
{


	
		public function testByStatInvalidStatID()
		{
			$statID = 1202;
			
			try
			{
				$ret = stat_exe ($statID);
				$this->assertTrue(false);
			}
			catch(Exception $e)
			{
				$this->assertTrue("{\"error\" : \"Input is invalid: statID\"}" == $e->getMessage());
			}
		
			
		}
		
		
 



	
	




}
?>