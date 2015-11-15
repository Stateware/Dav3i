<?php
/*
 * Copyright 2015 Stateware Team: William Bittner, Nicholas Denaro, 
 * Dylan Fetch, Paul Jang, Brent Mosier, Zekun Yang
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

/* File Name:           data_parsersTest.php
 * Description:         This file tests the functions of connect.php using PHP Unit.
 * 
 * Date Created:        11/3/2015
 * Contributors:        Brent Mosier
 * Date Last Modified:  11/3/2015
 * Last Modified By:    Brent Mosier
 * Dependencies:        data_parsers.php, connect.php
 * Input:               NONE
 * Output:              NONE
 * Additional Notes:    In its current iteration, this document has security vulnerabilities
 *                      that could seriously damage the database. Keeping this file uploaded
 *                      while not actively being developed is NOT recommended.
 */

require_once '.\..\..\src\Upload\data_parsers.php';

class data_parsersTest extends \PHPUnit_Framework_TestCase{	
	function testParseFailBadZipFD()
	{
		//$expected = 3;
		$zipFD = 1;
		$sessionName = "sesTest";
		$instanceName = "instTest";

		$results = parse($zipFD, $sessionName, $instanceName);
		//$this->assertEquals($results, $expected);
	}

	//test cases for parse
		//file lists error
		//file is not a zip file
		//$zipFD is not a resource
		//$datafilename is not a csv
		//$output[0][0] == ""
		//$output[0][0] != ""

	
	function testGetStatNameFromFileNameInputBirths()
	{
		//search requires slash because file is stored in some directory on computer
		$fname = "/input-births.csv";
		$expected = "births";
		$results = getStatNameFromFileName($fname);
		$this->assertEquals($results, $expected);
	}
	
	function testGetStatNameFromFileNameInputDeaths()
	{
		$fname = "/input-deaths-5.csv";
		$expected = "deaths";
		$results = getStatNameFromFileName($fname);
		$this->assertEquals($results, $expected);	
	}
	
	function testGetStatNameFromFileNameInputCases()
	{
		$fname = "/input-cases.csv";
		$expected = "cases";
		$results = getStatNameFromFileName($fname);
		$this->assertEquals($results, $expected);
	}
	
	function testGetStatNameFromFileNameInputPopulations()
	{
		$fname = "/input-populations.csv";
		$expected = "populations";
		$results = getStatNameFromFileName($fname);
		$this->assertEquals($results, $expected);
	}
	
	function testGetStatNameFromFileNameInputMcv1()
	{
		$fname = "/input-mcv1.csv";
		$expected = "mcv1";
		$results = getStatNameFromFileName($fname);
		$this->assertEquals($results, $expected);
	}
	
	function testGetStatNameFromFileNameInputMcv2()
	{
		$fname = "/input-mcv2.csv";
		$expected = "mcv2";
		$results = getStatNameFromFileName($fname);
		$this->assertEquals($results, $expected);
	}
	
	function testGetStatNameFromFileNameOutputEstimatedIncidence()
	{
		$fname = "/output-estimated-incidence.csv";
		$expected = "e_cases";
		$results = getStatNameFromFileName($fname);
		$this->assertEquals($results, $expected);
	}
	
	function testGetStatNameFromFileNameOutputLbEstimatedIncidence()
	{
		$fname = "/output-lb-estimated-incidence.csv";
		$expected = "lbe_cases";
		$results = getStatNameFromFileName($fname);
		$this->assertEquals($results, $expected);	
	}
	
	function testGetStatNameFromFileNameOutputUbEstimatedIncidence()
	{
		$fname = "/output-ub-estimated-incidence.csv";
		$expected = "ube_cases";
		$results = getStatNameFromFileName($fname);
		$this->assertEquals($results, $expected);
	}
	
	function testGetStatNameFromFileNameOutputEstimatedMortality()
	{
		$fname = "/output-estimated-mortality.csv";
		$expected = "e_mortality";
		$results = getStatNameFromFileName($fname);
		$this->assertEquals($results, $expected);
	}
	
	function testGetStatNameFromFileNameOutputLbEstimatedMortality()
	{
		$fname = "/output-lb-estimated-mortality.csv";
		$expected = "lbe_mortality";
		$results = getStatNameFromFileName($fname);
		$this->assertEquals($results, $expected);
	}
	
	function testGetStatNameFromFileNameOutputUbEstimatedMortality()
	{
		$fname = "/output-ub-estimated-mortality.csv";
		$expected = "ube_mortality";
		$results = getStatNameFromFileName($fname);
		$this->assertEquals($results, $expected);
	}
	
	function testGetStatNameFromFileNameOutputSiaCoverage()
	{
		$fname = "/output-sia-coverage.csv";
		$expected = "sia";
		$results = getStatNameFromFileName($fname);
		$this->assertEquals($results, $expected);
	}
	
	function testGetStatNameFromFileNameDefault()
	{
		$fname = "notAFile";
		$expected = "oops";
		$results = getStatNameFromFileName($fname);
		$this->assertEquals($results, $expected);
	}
	
	function testCleanIsNumeric()
	{
		$data = 1;
		$expected = 1;
		$this->assertTrue(clean($data) == $expected);
	}

	function testCleanNotNumeric()
	{
		$data = true;
		$expected = -1;
		$this->assertTrue(clean($data) == $expected);
	}
}
?>