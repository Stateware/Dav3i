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

/* File Name:           connectTest.php
 * Description:         This file tests the functions of connect.php using PHP Unit.
 * 
 * Date Created:        4/11/2016
 * Contributors:        William Bittner
 * Date Last Modified:  4/11/2016
 * Last Modified By:    William Bittner
 * Dependencies:        connect.php
 * Input:               NONE
 * Output:              NONE
 */
 
require_once (".\..\..\src\api\connect.php");
class connectTest extends \PHPUnit_Framework_TestCase
{
	
	function testGetDatabaseConnection()
	{
		$dbc = GetDatabaseConnection(".\..\..\src\CONF\backend_connection_strings.conf");
		
		$this->assertTrue($dbc->connect_error == NULL);
	}
	
    function testGetDatabaseConnectionErrorHost()
    {
        try{
        $dbc = GetDatabaseConnection(".\backend_connection_strings_bad_host.conf");
        $this->assertTrue(false);

        }
        catch (Exception $e) {
            $errorMessage = $e->getMessage();
            $this->assertTrue(true);        
        }
    }

    function testGetDatabaseConnectionErrorUser()
    {
        try{
        $dbc = GetDatabaseConnection(".\backend_connection_strings_bad_user.conf");
        $this->assertTrue(false);

        }
        catch (Exception $e) {
            $errorMessage = $e->getMessage();
            $this->assertTrue(true);        
        }
    }

    function testGetDatabaseConnectionErrorPassword()
    {
        try{
        $dbc = GetDatabaseConnection(".\backend_connection_strings_bad_password.conf");
        $this->assertTrue(false);

        }
        catch (Exception $e) {
            $errorMessage = $e->getMessage();
            $this->assertTrue(true);        
        }
    }
	function testGetDatabaseConnectionErrorEnvironment()
    {
        try{
        $dbc = GetDatabaseConnection(".\backend_connection_strings_bad_environment.conf");
        $this->assertTrue(false);

        }
        catch (Exception $e) {
            $errorMessage = $e->getMessage();
            $this->assertTrue(true);        
        }
    }

    function testGetDatabaseConnectionErrorDatabase()
    {
        try{
        $dbc = GetDatabaseConnection(".\backend_connection_strings_bad_name.conf");
        $this->assertTrue(false);

        }
        catch (Exception $e) {
            $errorMessage = $e->getMessage();
            $this->assertTrue(true);        
        }
    }
}

?>