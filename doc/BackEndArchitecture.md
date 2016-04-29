# Back End Architecture Document

### Table of Contents
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

### Introduction to the Back End

The back end is a web server which will host the website for the Fall 2015 iteration of the Stateware Project and the database which contains all of the data that the website will be displaying. The server will send the HTML5 page when the domain is visited, and will send the data to be displayed when the front end requests it. The server will use the LAMP stack to accomplish all of this(see design decisions section).

### Definitions
1. **descriptor table** JSON object sent to the front end containing the list of sessions in the database along with the year range, list of countries(cc2, cc3, and common name), list of stats, and list of instances for a specific session
2. **instance** a collection of data on various countries, there can be data on one or more statistics pertaining to one or more countries
3. **session** a collection of instances
4. **countryID** integer assigned in the descriptor table to identify a country for fast communication between the front and back end
5. **statID** integer assigned in the descriptor table to identify a stat for fast communication between the front and back end
6. **sessionID** integer assigned in the descriptor table to identify a session for fast communication between the front and back end
7. **instanceID** integer assigned in the descriptor table to identify an instance for fast communication between the front and back end
6. **heatmap** the map displayed on the website will color code the countries according to the magnitude of one stat in one year
7. **sanitary data** data that is in the correct format to be processed
8. **valid data** data that is "correct", i.e. within the bounds with which processing will produce meaningful output



### Requirements
The server must
* Upon connection, deliver a descriptor table for the default session, containing the names of all sessions in the database, the list of instances contained in the default session, and the list of stats in each of those instances
* Upon receipt of a countryID, sessionID, and instanceID deliver all data for that country in that instance of that session
* Upon receipt of a statID, year, sessionID and instanceID, deliver data of all countries in that session and isntance for that stat in that year(if no year is provided, the current year is given)
* Be able to receive updated database tables via a secure login

### PHP Files


**descriptor.php:** API call to get descriptor table for a specific sesssion, takes data in arrays given by Descriptor library function and encodes them into JSON, takes a sessionID as an argument, if none provided default value is used

**by_country.php:** API call to get all data for a country in a specific instance and session, takes a countryID, instanceID, and sessionID

**by_country_packet.php** class to hold the data an individual country being sent to the front end

**by_stat.php:** API call to get data for all countries for a stat and a year in a given instance and session, takes a statID, year, instanceID, and sessionID as arguments, if no year argument is given it defaults to the current year

**by_stat_packet.php** class to hold the data for the heatmap being sent to the front end

**connect.php:** establishes a connection to the MySQL database, takes no arguments

**toolbox.php:** library of functions and global variables that are useful in multiple places within the back end, when the global variable TESTING is set to TRUE ThrowFatalError doesn't kill the page and API calls can be made from foreign hosts

**api_library.php:** library of functions that do the calculations for all of the API calls, includes:
* **ByStat** takes a statID, year, instanceID, and sessionID as arguments and returns the data of the input stat for all countries in the input year in the given session and instance, if no input year is given it defaults to the current year
* **ByCountry** takes a countryID, instanceID, and sessionID and returns all data for the input country in the given session and instance
* **Descriptor** takes a sessionID as argument and returns the list of sessions in the database along with the year range, list of countries(cc2, cc3, and common name), list of stats, and list of instances for the requested session

**data_parser.php:** takes data from a zipped folder of .csv's and inputs it to the database as an instance in a session, multiple instances can be uploaded at once and sessions can be updated as well

**packet.php** parent class of both by_stat_packet.php and by_country_packet.php


### Syntax for API Calls
**descriptor.php**  url/API/descriptor.php

**by_stat.php**  url/API/by_stat.php?statID=x&year=y&sessionID=z&instanceID=a
x must be a single valid statID, y must be a single valid year, if no year is given the current year is used as default,z must be a single valid sessionID, and a must be a single valid instanceID that represents an instance in the given session z

**by_country.php**  url/API/by_country.php?countryID=x&sessionID=y&instanceID=z
x must be a single valid countryID, y must be a single vaid sessionID, and z must be a single valid instanceID representing an instance in that session

### Error Handling
The two error handling functions are ThrowFatalError and ThrowInconvenientError from toolbox.php
* **ThrowFatalError** will kill the page, and print a concise error message stating the nature and location of the error.
*  **ThrowInconvenientError** will be used in cases where it isn't necessary for the page to be killed, it will print a concise error message stating the nature and location of the error.  For each function the error message is an argument to the function.

All functions within api_library.php will validate and sanitize their input data.  In the case of unsanitary or invalid data, ThrowFatalError is called.


### Security
Functions that receive input from the front end will sanitize and validate their data using regular expressions. This insures that no unforeseen data can be used to attack the system.

The upload feature is only available on the developer version, which is password protected.

### Database Setup

**meta_stats:** This table provides an easy way to search our list of data tables. It has a columns: Stat table ID, Stat id Name, and SQL table name.

**meta_countries:** This table provides a list of all countries identifiers, common name, 2-digit country code, and 3-digit country code. This will be called when a call to "descriptor" is made, and when new data is being uploaded.

**meta_session:** This table provides a list of all the sessions and their corresponding id's that currently have data stored in the database. It also contains the start and end year for the data that that particular session contains.

**meta_instance:** This table provides a list of all the instances and their corresponding id's that currently have data stored in the database.

**data:** This table contains all of the data for all of the instances and sessions in the database.

The data in the data table can be accessed through the following foreign keys: session_id, instance_id, country_id, stat_id, year.

We chose this format over dynamically creating tables for each stat in each session because this resulted in one table, where as if we created a table for each stat of each session, the tables would grow disorderly and out of control very quickly. 

### Format of Data Sent to Front End
The data will be encoded in JSON(see design decisions section). This is how it will be formatted:


	var Descriptor =
	{
        "yearRange":
        {
            "startYear": "1981",
            "endYear": "2012"
        },
        "countries":
        {
            "1": {
                "cc2": "AF",
                "cc3": "AFG",
                "common_name": "Afghanistan"
            },
            "2": {
                "cc2": "AO",
                "cc3": "AGO",
                "common_name": "Angola"
            }
        },
    	"stats":
        {
            "1": "births",
            "2": "deaths",
            "3": "cases"
        },
        "instances" :
        {
        	"1": "Base",
            "2": "No Vacc"
        },
        "sessions":
        {
            "1": "Original",
            "2": "Multi-Instance"
        }
	};


	var ByStat =
	{
        "year": "2012",
        "session": "1",
        "instance": "1",
        "stat_id": 1,
        "data": [
            {
                "1": "1053370"
            },
            {
                "2": "934096"
            },
            {
                "3": "40416"
            }
        ]
    }

	var ByCountry =
	{
    	"0":
        {
            "country": "1",
            "session": "1",
            "instance": "1",
            "stat_id": 1,
            "data": [
                {
                    "1980": "405187"
                },
                {
                    "1981": "418898"
                },
                {
                    "1982": "432971"
                }
            ]
        },
        "1":
        {
            "country": "1",
            "session": "1",
            "instance": "1",
            "stat_id": 1,
            "data": [
                {
                    "1980": "405187"
                },
                {
                    "1981": "418898"
                },
                {
                    "1982": "432971"
                }
            ]
        }

   	};

ByStat is a key-value pair with the key being the StatID and the value being an array containing the value of the stat in the requested year indexed by CountryID. ByCountry returns a key-value pair with the key being the CountryID and the value being an array indexed by StatID, each index being the data for that stat for the requested country indexed by years after 1980(1980+index=year of data). Both sets of data have the key-value pair "force":"object" as a second entry. The purpose of this key-value pair is to force the JSON encoding function in PHP to output the data as an object rather than an array. When only one key-value pair is output, the whole thing is converted to an array which affects the ability to parse it.

### Design Decisions

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

**Docker:** Docker was first introduced to us as a framework to make making multiplatform applications easier, but upon further investigation, it was actually a framework to make multiplatform development easier. It converts your application to a format that is stored on Docker's cloud that can run on a Docker virtual environment which makes it easier for large companies to all work on a project in different development environments. We determined that we did not need to use it.

**Pixy:** Pixy is a Java program that scans PHP code for SQL injection and cross site scripting vulnerabilities. Its build and use instructions were clear and it was easy to use. It also actually found some vulnerabilities so it was a good choice.

**PHP-IDS:** PHP-IDS is a php program that is included in each of your php files and detects, reacts to, and logs server attacks. We determined that it was difficult to learn and not worth the time because it was mainly a tool to log attacks to learn how to better defensively code. It's main reaction to attacks was to log it, or email you about it. Since we already coded defensively, we felt it's only benefit was to possibly prevent DDOS attacks, but we're going to rely on our server provider to prevent that.

**Testing Framework** Many frameworks and programs were researched for testing such as: Selenium, dBug, SimpleTest, PHPUnit, JMeter, JUnit, and DBUnit. It was ultimately decided to use none of these and write our own framework using JSoup and JDBC. There is more information about these programs in BackEndTestPlan.md
