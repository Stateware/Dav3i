<?php
/*
 * Copyright 2015 Stateware Team: William Bittner, Joshua Crafts, 
 * Nicholas Denaro, Dylan Fetch, Paul Jang, Arun Kumar, Drew Lopreiato,
 * Brent Mosier, Kyle Nicholson, Emma Roudabush, Berty Ruan, Vanajam Soni, 
 * Murlin Wei, Zekun Yang
 * 
 * This file is part of Dav3i.
 * 
 * Dav3i is free software: you can redistribute it and/or modify
 * it under the terms of the MIT Software License.
 * 
 * Dav3i is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * MIT Software License for more details.
 * 
 * You should have received a copy of the MIT Software License along 
 * with Dav3i.  If not, see <https://opensource.org/licenses/MIT/>.
 */

/* File Name:           data_uploader.php
 * Description:         This file provides an interface for a user to upload data to the database.
 * 
 * Date Created:        3/18/2015
 * Contributors:        Drew Lopreiato, William Bittner
 * Date Last Modified:  4/23/2015
 * Last Modified By:    Drew Lopreiato
 * Dependencies:        NONE
 * Input:               NONE
 * Output:              NONE
 * Additional Notes:    In its current iteration, this document has security vulnerabilities
 *                      that could seriously damage the database. Keeping this file uploaded
 *                      while not actively being developed is NOT recommended.
 */
?>
<html><head><title>Dav3i Data Uploader</title></head>
<body>
    <!-- The data encoding type, enctype, MUST be specified as below -->
    <form enctype="multipart/form-data" action="data_parser.php" method="POST">
        <!-- This should be a MySQL datatype (e.g. FLOAT, or INT(10)) -->
        Type:<input type="text" name="data_type" /><br />
        <!-- This will be the table name in the MySQL Database -->
        Table Name:<input type="text" name="table_name" /><br />
        <!-- This will be the human readable name in the MySQL Database-->
        Statistic Name:<input type="text" name="stat_name" /><br />
        <!-- MAX_FILE_SIZE must precede the file input field -->
        <input type="hidden" name="MAX_FILE_SIZE" value="300000" /><br />
        <!-- Name of input element determines name in $_FILES array -->
        Send this file: <input name="userfile" type="file" /><br />
        <input type="submit" value="Send File" />
    </form>
</body>
</html>