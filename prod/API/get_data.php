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

/* File Name:           get_data.php
 * Description:         This file serves the data object in JSON to the client
 * Date Created:        8/18/2015
 * Contributors:        Joshua Crafts
 * Date Last Modified:  9/1/2015
 * Last Modified By:    Joshua Crafts
 * Dependencies:        api_library.php, connect.php, toolbox.php
 * Additional Notes:    N/A
 */

require_once('api_library.php');

$databaseConnection = GetDatabaseConnection();

echo json_encode(new Data($databaseConnection));
?>
