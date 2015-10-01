<?php
/*
 * Copyright 2015 Stateware Team: William Bittner, Joshua Crafts, 
 * Nicholas Denaro, Dylan Fetch, Paul Jang, Arun Kumar, Drew Lopreiato,
 * Kyle Nicholson, Emma Roudabush, Berty Ruan, Vanajam Soni
 * 
 * This file is part of Dav3i.
 * 
 * Dav3i is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * Dav3i is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Dav3i.  If not, see <http://www.gnu.org/licenses/>.
 */

/* File Name:           data_parser_test.php
 * Description:         This file tests the functions of data_parser.php using PHP Unit.
 * 
 * Date Created:        9/11/2015
 * Contributors:        Brent Mosier
 * Date Last Modified:  9/11/2015
 * Last Modified By:    Brent Mosier
 * Dependencies:        connect.php, data_parser.php
 * Input:               NONE
 * Output:              NONE
 * Additional Notes:    In its current iteration, this document has security vulnerabilities
 *                      that could seriously damage the database. Keeping this file uploaded
 *                      while not actively being developed is NOT recommended.
 */


 //Below is a basic list of functions to test in the code
 //creating the table
 //foreach($tableArray as $value)
 //foreach ($columnsArray as $column)
 //if ($createTableQuery === false)
 //while($countryLookupRow = $countryLookupResults->fetch_assoc())
 //foreach($queryArray as $country => $query)
 //
 //function ScientificConversion
require_once '.\..\..\src\api\data_parser.php';

class data_parserTest extends \PHPUnit_Framework_TestCase
{
	function testStandard()
	{
		standard run through with no deviations
		$test = parser();
		$this->assertTrue($test == NULL);
	}
	
	/*
	function testTableResultsFalse()
	{
		//echo then die
	}
	*/
	/*
	function testIsSet()
	{
		//put into key value array
	}
	*/
	/*
	function testCreateTableQueryFalse()
	{
		//echo then die

	}
	*/
	/*
	function testSpecificResultsFalse()
	{
		//echo and continue
	}
	*/
	function testScientificConversion()
	{
		//test if pos === false
		$in = 5;
		$result = ScientificConversion($in);

		$this->assertTrue($result === 5.0);
	}

	function testScientificConversionElse()
	{
		//test if needs to be converted	
		$in = 7E2;
		$result = ScientificConversion($in);
		$expected = 700;

		$this->assertTrue($result == $expected);
	}
}

?>