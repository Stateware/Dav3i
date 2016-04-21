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

/* File Name:           toolbox.php
 * Description:         This will be included in nearly every PHP file we write and it will hold commonly
 *                             used functions and any globals we may need.
 * Date Created:        2/12/2015
 * Contributors:        Drew Lopreiato, William Bittner, Kyle Nicholson, Berty Ruan, Arun Kumar
 * Date Last Modified:  5/1/2015
 * Last Modified By:    William Bittner
 * Dependencies:        none
 * Input:               none
 * Output:              none
 */ 
     
// ===================== Function Definitions =====================     
function ThrowFatalError($message = "An error has occured - the program has been terminated.") 
//PRE: string message - optional further description of error
//POST: This function will cause the program to close itself after echoing an error message.
{
    if(!TESTING)
    {
        echo "{\"error\" : \"" . $message . "\"}";
        die();
    }
    else
    {
        throw new Exception("{\"error\" : \"" . $message . "\"}");
    }
} // END ThrowFatalError

function ThrowInconvenientError($message = "An inconvenient error has occured - program flow will continue.") 
//PRE: string message - optional further description of error
//POST: This function will cause simply echo an error message, but unlike the above will not terminate the program.
{
    echo "Error: " . $message;
} // END ThrowInconvenientError


function flushedPrint($message)
//PRE: message is a valid string.
//POST: The message is printed followed by a line break to the web page.
{
    echo $message . "<br>";
    flush();
}

function GetArgumentValue( $input, $required=true ) 
//PRE: input is defined, required is optional, defaults to true
//POST: This function will return the arguments passed in on the $input parameter, or null if it is not set and not required
{
    if( !isset($_GET[ $input ]) )
	{
		if( $required )
			ThrowFatalError("Input is not defined: ".$input);
		
		return null;
	}
	else
	{
		return $_GET[ $input ];
	}
} // END GetArgumentValue


// ===================== Variable Declaration =====================
// These are global variables that describe our default values for data of the given types
define("DEFAULT_NUMBER", -1);
define("DEFAULT_STRING", "");
define("DEFAULT_SESSION", 1);
/*      EFFECTS OF TESTING == TRUE:
 * The ThrowFatalError doesn't kill the page
 */
define("TESTING", TRUE);
/*  EFFECTS OF EXTERNAL_ACCESS == TRUE:
 * All API calls are allowed to be accessed by non-server users
 */
define("EXTERNAL_ACCESS", FALSE);
?>
