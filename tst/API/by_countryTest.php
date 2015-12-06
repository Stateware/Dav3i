
<?php
/* File Name:           testByCountry.php
 * 
 * Contributors:        zekun yang
 * Date Last Modified:  9/27/2015
 * Last Modified By:    zekun yang  
 * Dependencies:        by_country.php
 */
require_once (".\..\..\src\api\by_country.php");
class by_countryTest extends \PHPUnit_Framework_TestCase
{
		public function testByCountryMissingCountryID()
		{
			$country_id = null;
			$sessionID = 1;
			$instanceID = 1;
			
			try
			{
				$ret = country_exe($country_id,$sessionID,$instanceID);

				$this->assertTrue(false); // The function should throw an error, so this should not be reached.
			}
			catch(Exception $e)
			{
				$this->assertTrue("{\"error\" : \"Input is not defined: countryIDs\"}" == $e->getMessage());
			}
		
		}

		public function testByCountryMissingSessionID()
		{
			$country_id = 2;
			$sessionID = null;
			$instanceID = 1;
			
			try
			{
				$ret = country_exe($country_id,$sessionID,$instanceID);

				$this->assertTrue(false); // The function should throw an error, so this should not be reached.
			}
			catch(Exception $e)
			{
				$this->assertTrue("{\"error\" : \"Input is not defined: sessionID\"}" == $e->getMessage());
			}
		
		}

		public function testByCountryMissingInstanceID()
		{
			$country_id = 2;
			$sessionID = 1;
			$instanceID = null;
			
			try
			{
				$ret = country_exe($country_id,$sessionID,$instanceID);

				$this->assertTrue(false); // The function should throw an error, so this should not be reached.
			}
			catch(Exception $e)
			{
				$this->assertTrue("{\"error\" : \"Input is not defined: instanceID\"}" == $e->getMessage());
			}
		
		}

		public function testByCountryPass()
		{
			$country_id = 1;
			$sessionID = 35;
			$instanceID = 46;
			
			try
			{
				$ret = country_exe($country_id,$sessionID,$instanceID);

				$this->assertTrue(true); // The function should complete without any exceptions
			}
			catch(Exception $e)
			{
				echo $e->getMessage();
				echo $sessionID;
				$this->assertTrue(false); // No exceptions should be thrown.
			}
		
		}
}
?>