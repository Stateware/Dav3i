<?php
function ThrowFatalError($message = "An Error has occured.") 
{
    echo "{\"error\" : \"" . $message . "\"}";
    die();
} // END throwFatalError

// These are global variables that we can use as ways to start variables as types.
define("DEFAULT_NUMBER", -1);
define("DEFAULT_STRING", "");
?>