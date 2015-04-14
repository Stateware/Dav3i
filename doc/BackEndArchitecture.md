#Back End Architecture Document

###Table of Contents
* Introduction to the Back End
* Definitions
* Requirements
* PHP Files
* Syntax for API Calls
* Error Handling
* Security
* Database Setup
* Format of Data Sent to Front End
* Design Decisions

###Introduction to the Back End

The back end is a web server which will host the website for the Spring 2015 iteration of the Stateware Project and the database which contains all of the data that the website will be displaying. The server will send the HTML5 page when the domain is visited, and will send the data to be displayed when the front end requests it. The server will use the LAMP stack to accomplish all of this(see design decisions section).

###Definitions
1. **descriptor table** JSON object sent to the front end containing the list of countries in the database with their CC2 and CC3 country codes and assigned countryIDs
2. **countryID** integer assigned in the descriptor table to identify a country for fast communication between the front and back end
3. **statID** integer assigned in the descriptor table to identify a stat for fast communication between the front and back end
4. **heatmap** the map displayed on the website will color code the countries according to the magnitude of one stat in one year
5. **sanitary data** data that is in the correct format to be processed
6. **valid data** data that is "correct", i.e. within the bounds with which processing will produce meaningful output


###Requirements
The server must
* Display the website when the domain is visited
* Upon connection, deliver a descriptor table of the contents of the database, along with the year range within the database
* Upon receipt of a countryID  deliver all data for that country
* Upon receipt of a statID with year, deliver all data for that stat in that year(if no year is provided, the current year is given)
* Be able to receive updated database tables via a secure login

###PHP Files


**descriptor.php:** API call to get descriptor table, year range, and list of stats, encodes data in arrays given by Descriptor library function into JSON, takes no arguments

**by_country.php:** API call to get all data for a country or several countries, takes a countryID or comma delimited list of countryIDs

**by_stat.php:** API call to get data for all countries for a stat and a year, takes a statID and a year as arguments, if no year argument is given it defaults to the current year

**connect.php** establishes a connection to the MySQL database, takes no arguments

**toolbox.php** library of functions and global variables that are useful in multiple places within the back end, when the global variable TESTING is set to TRUE ThrowFatalError doesn't kill the page and API calls can be made from foreign hosts

**test_lib.php** library of unit tests for the helper functions within the back end

**api_library.php** library of functions that do the calculations for all of the API calls, includes:
* **ByStat** takes a statIDr and a year as arguments and returns the data of the input stat for all countries in the input year, if no input year is given it defaults to the current year
* **ByCountry** takes a countryID or comma delimited list of countryIDs and returns all data for the input countries
* **Descriptor** takes no arguments and returns the year range, list of stats, list of cc2, cc3, and country names in the database currently


###Syntax for API Calls
**descriptor.php**  url/API/descriptor.php

**by_stat.php**  url/API/by_stat.php?statID=x&year=y
x must be a single valid statID, y must be a single valid year, if no year is given the current year is used as default

**by_country.php**  url/API/by_country.php?countryIDs=z
z must be a single valid countryID or a comma delimited list of countryID's; the front end only sends single countryIDs

###Error Handling
All error checking will use the ThrowFatalError and ThrowInconvenientError functions from toolbox.php to handle errors.
* **ThrowFatalError** will kill the page, and print a concise error message stating the nature and location of the error.
*  **ThrowInconvenientError** will be used in cases where it isn't necessary for the page to be killed, it will print a concise error message stating the nature and location of the error.  For each function the error message is an argument to the function.

All functions within api_library.php will validate and sanitize their input data.  In the case of unsanitary or invalid data, the standard error handling procedure is followed.

###Security
Functions that receive input from the front end will sanitize and validate their data. This insures that no unforeseen data can be used to attack the system.

The program pixy(https://github.com/oliverklee/pixy) was used to scan for cross site scripting(XSS) and SQL injection vulnerabilities. Pixy found several XSS vulnerabilities in the form of echoing a variable without first sanitizing the variable highlighted in the document NoteablePixyResults. These vulnerabilities were determined to be unimportant because no user input could make it to these vulnerabilities without being sanitized and validated beforehand.

We plan to use PHP-IDS(https://github.com/PHPIDS/PHPIDS) to deal with server attacks.

New data and updates to data will be submitted via a secure login(not added yet).

###Database Setup

All tables will be linked via country id (CID).

**meta_stats:** This table provides an easy way to search our list of data tables. It has a columns: Stat table ID, Stat id Name, and SQL table name.

**meta_countries:** This table provides a list of all countries identifiers, common name, 2-digit country code, and 3-digit country code. This will be called when a call to "descriptor" is made, and when new data is being uploaded.

**data_?:** There is an individual table for each different data statistic 
* births = data_births
* reported cases =  data_cases
* deaths = data_deaths
* estimated cases = data_estcases
* estimated mortality rate = data_estmortal
* lower bound for estimated cases = data_lbecases
* lower bound for estimated mortality = data_lbemortal
* MCV1(first dose of measles containing vaccine) = data_mcv1
* MCV2(second dose of measles containing vaccine) = data_mcv2
* population = data_popula
* upper bound for estimated cases = data_ubecases
* upper bound for estimated mortality = data_ubemortal

The tables have columns: CID and as many years columns as needed. This format was chosen to make it more efficient to grab all years of data from a single country by just grabbing a row of data. The other way of doing this would be to have three columns: CID, Year, and Value. This way would be considered the “correct” way, however would take a significantly longer time to query for mass quantities of yearly data. The "correct" way has the advantage of having a much greater amount of years, however, the chosen way of creating this table allows for a maximum of 1024 columns, hence 1023 years and it is inconceivable that this program will be used for longer than that span of time. 

###Format of Data Sent to Front End
The data will be encoded in JSON(see design decisions section). This is how it will be formatted:


	var Descriptor =
	{
    	"yearRange" : 
    	{
        	1980, 
        	2014
    	},
    	"cc2" :
    	{
        	"US",
        	"MX",
        	"HU"
    	},
		"common_name" : 
    	{
        	"United States of America",
        	"Mexico",
        	"Hungary"
    	},
    	"stats" : 
    	{
        	"births",
        	"deaths",
        	"vaccinations"
    	}
	};


	var ByStat =
	{
		"1":
		[
			"123",
			"134534",
			"123534647"
		],
        "force":"object"
	}

	var ByCountry =
	{
    	1 :
    	[
        	[ "1337", "1338", ... ],
        	[ "5", "1338", ... ],
        	[ "5", "1338", ... ]
    	],
        "force":"object"
   	};

ByStat is a key-value pair with the key being the StatID and the value being an array containing the value of the stat in the requested year indexed by CountryID. ByCountry returns a key-value pair with the key being the CountryID and the value being an array indexed by StatID, each index being the data for that stat for the requested country indexed by years after 1980(1980+index=year of data). Both sets of data have the key-value pair "force":"object" as a second entry. The purpose of this key-value pair is to force the JSON encoding function in PHP to output the data as an object rather than an array. When only one key-value pair is output, the whole thing is converted to an array which affects the ability to parse it.

###Design Decisions

**Server Software Decision**
We decided to install a LAMP stack on our server. This choice was made for a few reasons, namely that it is what we are most familiar with and that we know its capabilities extend farther than our requirements for this project. We know that the LAMP stack is a time-tested standard for web servers.
The LAMP stack is made up of four components, each communicating with only one or two of the others, to create an assembly-line type system for outputting dynamic data to websites. 

* The **L** stands for Linux, which is quite self explanatory. Alternate versions of this architecture can of course substitute in other operating systems for the server, including WAMP for Windows. As the server we were provided with is a “bare-bones” Linux server, and as servers typically run Linux so they are not required to expend resources into additional things like GUI's, we have decided to stick with Linux. 

* The **A** stands for Apache. Apache is the tool we will be using to communicate with the Linux OS on the server. Essentially Apache is a sorting utility. Once the server receives a request, it will forward it to Apache who will decide where it should go next. If it just requires a pre-made static web page it will ship it out; however, if it finds different requests, such as things with PHP, it will forward them elsewhere to be dealt with, then when the page is returned to Apache it will return it to the server to be returned to the client. 

* The **P** stands for PHP. Although the acronym is LAMP, the next “machine” in our assembly line is PHP. PHP is how we will be giving variable data to the webpages. It is also how we will be accessing our database, which is the next and final step.

* The **M** stands for MySQL. This is our database. We have done the calculations and, unless this software will be in use for nearly a thousand more years, MySQL, with our configured tables described below, will most certainly be able to hold all of our data as well as providing a fast and easy way to return data to PHP. Another benefit of using PHP and MySQL is how well they mesh together, allowing for incredibly intuitive design and code.

**SQL vs NoSQL:** SQL offers a database management platform that is easy to learn and already known by several team members.  NoSQL offers increased functionality and expandability.  SQL will be used because of the relatively small scale of our back end.  It was ultimately decided that if there comes a time when the backend needs to be scaled up on a large scale that it can be replaced as a whole without affecting the front end, so the design decision can be revisited later.

**Server Decision: PSU Server vs. Microsoft Azure vs. Server4You.com:** We ultimately decided on the Server4You server because it offered the flexibility of a plain virtual LAMP server at a reasonable monthly cost. The PSU server was only accessible via VPN to Penn State's network. Microsoft Azure would give us a dependence on Microsoft software that we did not want to create. With the Server4You server, we are able to pick up and move to a new server if necessary since it is just a plain LAMP server.

**Moving Calculations Out of API Calls:** Originally, the API calls and functions were one and the same. We decided to move the calculations to functions that are called by API calls because we needed to call the calculations elsewhere. If the calculations were done in the API calls, then when the calculations were needed in other functions as well, the data would be sent to the front end as well as used within the back end.

**JSON:** Javascript Object Notation is easy for humans to read and easy for computers to parse. It is just notation, so a format that is agreed upon between the front and back end so that data transfer is simplified. One of the team members had experience with JSON that he was able to pass on to the rest of the team.

**Using 1 as the First Index for data:** SQL is indexed starting at one, so all requests from the front end must have one added

**Docker** Docker was first introduced to us as a framework to make making multiplatform applications easier, but upon further investigation, it was actually a framework to make multiplatform development easier. It converts your application to a format that is stored on Docker's cloud that can run on a Docker virtual environment which makes it easier for large companies to all work on a project in different development environments. We determined that we did not need to use it. 

