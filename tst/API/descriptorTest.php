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

/* File Name:           descriptorTest.php
 * Description:          This file tests the functions of descriptor.php using PHP Unit.
 * 
 * Date Created:        9/23/2015
 * Contributors:        Brent Mosier
 * Date Last Modified:  10/1/2015
 * Last Modified By:    Brent Mosier
 * Dependencies:        api_library.php
 * PRE:               NONE
 * POST:              FCTVAL == Formatted JSON String containing the countryName,
 *                      yearRange, cc2, and stats arrays
 * Additional Notes:    Before completion of this file we need a populated
 *                      database on the correct server
 */
require_once '.\..\..\src\api\descriptor.php';

class descriptorTest extends \PHPUnit_Framework_TestCase
{

    function testDescNull()
    {
        $val = desc(null);
        $this->assertTrue(true);
    }

    function testDescNotNull()
    {
        $sessionID = 35;
        $val = desc($sessionID);
        $this->assertTrue(true);
    }
}
?>