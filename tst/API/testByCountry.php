
<?php
/* File Name:           testByCountry.php
 * Description:         This file tests the by_country.php test ,using phpnit
 * 
 * Date Created:        2/22/2015
 * Contributors:        Drew Lopreiato, Will Bittner, Arun Kumar, Dylan Fetch
 * Date Last Modified:  9/27/2015
 * Last Modified By:    zekun yang  
 * Dependencies:        by_country.php
 */
//require_once (".\..\..\src\api\by_country.php");
class by_countryTest extends \PHPUnit_Framework_TestCase
{


	
		public function testByStatInvalidCountryID()
		{
			$country_id = "1,3,300";
			
			try
			{
				$ret = country_exe($country_id);
				$this->assertTrue(false);
			}
			catch(Exception $e)
			{
				$this->assertTrue("{\"error\" : \"Input is invalid: CountryID\"}" == $e->getMessage());
			}
		
		}
		
      



	
	




}
?>