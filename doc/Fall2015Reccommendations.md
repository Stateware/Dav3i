#Reccommendations for Fall 2015 Release

###Testing and Debugging

 * Known bug in back end function `ScientificConversion()`, relevant comments on bug are written above the function in `API/api_library.php`
 * Manually test all client functionality using available team members
 * Write QUnit tests for front end library; initially, writing test data will be best, but you should look into setting up the php/mysql backend on the build server and actually testing the data query
 * Integrate back end tests into build script
 * Remove jshint ignores in front end library modules and reduce cyclomatic complexity and number of statements for those functions

###Functionality and UI

 * Current display of custom graphs is tentative, and needs input from Matt on how he wants it to display. Much of the needed functionality is there, but verify with Matt how he would like it displayed and modify the functions accordingly.
 * Figure out how we would like to display HMS and tooltips when the custom tab is selected
 * Refactor stylesheet and restore css linting in build scripts
 * `res/reset.css` was added to both pages in order to increase cross-browser portability; all browsers instantiate some default css for broad DOM element classes, and these vary between browsers, so reset.css standardizes this. When refactoring the stylesheet, you must account for the changes that this has made to the look of the UI.
 * You must change the popup windows in the footer to reflect the contributions of the new team, as well as that the university itself owns the work I did this Summer.
 * Add logos to loading page (PSU, Stateware, Ferrari Lab, possibly sponsors, will advise on this later)

###Data Pull

 * If you would like to implement tentative data pulls (which may provide useful later on as the project architecture develops), I reccommend implementing a dynamic programming solution. That is, pull the full data object, with each country's field in `g_Data.data` set to `null`, then when a country is selected, if the data does not exist, pull for that country. This would require minimal effort as far as implementation in the back end.

###Refactoring

 * I suggest refactoring the construction of the data object on the back end. In retrospect, it was rushed and could be improved considerably. It is functional, and (as far as I can tell) bug free, but its readability and cyclomatic complexity could be greatly improved.
 * All of the upload functions instantiate their own database connection instead of having it passed in from `API/data_parser.php`. This doesn't seem to provide a huge performance lag, but the backend scripts should only have to instantiate one database connection, so this should be changed.

###Database/Security

 * Give `data_parser.php` and `api_library.php` a serious security analysis. Depend on Will's experience from the Spring for cleaning up security holes in the API functions.
