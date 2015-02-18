__PHP File names__: Haskell Case (e.g. MyVar) because our API is structured such that the filenames for us are the function calls for front end.

__PHP Variables__: Camel Case (e.g. myVar) as is typical variable naming convention.

__MySQL Column Names__: Snake Case (my_var) so that its easy to differentiate between PHP variables and MySQL variables, as they typically have similar names.

__File Form__:

 * Documentation
 ```php
	/* File Name:           FILENAME
	 * Description:         DESCRIPTION
	 * 
	 * Date Created:        DATE
	 * Contributors:        CONTRIBUTORS
	 * Date Last Modified:  DATE
	 * Last Modified By:    MODIFIER
	 * Dependencies:        DEPENDENCIES
	 * Input:               GET : VARIABLES THROUGH GET
	 *                      POST: VARIABLES THROUGH POST
	 * Output:              OUTPUT
	 */
```
 * Requireds
```php
// ===================== Variable Declaration =====================
// ========== Error Checking and Variable Initialization ==========
// ======================= Main Computation =======================
// ===================== Function Definitions =====================
```php

__Other Notes__: Queries often require multiple variables. Let *x* be the data you're attempting to query. This is the
necessary order in which the variables must be assigned.

*$xQuery* should contain the string that is the query.
*$xResults* should contain the results returned by the query
*$xRow* should contain each row of the query
*$x* should return the data