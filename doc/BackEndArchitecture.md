#Back End Architecture Document


#####Introduction to the back end

The back end is a web server which will serve up the HTML5 and data for the front end. The server will send the HTML5 when the domain is visited, and will send the data when the front end requests it.
We decided to install a LAMP stack on our server. This choice was made for a few reasons, namely that it is what we are most familiar with and that we know its capabilities extend farther than our requirements for this project. We know that the LAMP stack is a time-tested standard for web servers.

#####What is a LAMP stack?

The LAMP stack is made up of four components, each communicating with only one or two of the others, to create an assembly-line type system for outputting dynamic data to websites. 

The L stands for Linux, which is quite self explanatory. Alternate versions of this architecture can of course substitute in other operating systems for the server, including WAMP for Windows. As the server we were provided with is a “bare-bones” Linux server, and as servers typically run Linux so they are not required to expend resources into additional things like GUI's, we have decided to stick with Linux. 

The A stands for Apache. Apache is the tool we will be using to communicate with the Linux OS on the server. Essentially Apache is a sorting utility. Once the server receives a request, it will forward it to Apache who will decide where it should go next. If it just requires a pre-made static web page it will ship it out; however, if it finds different requests, such as things with PHP, it will forward them elsewhere to be dealt with, then when the page is returned to Apache it will return it to the server to be returned to the client. 

The P stands for PHP. Although the acronym is LAMP, the next “machine” in our assembly line is PHP. PHP is how we will be giving variable data to the webpages. It is also how we will be accessing our database, which is the next and final step.

The M stands for MySQL. This is our database. We have done the calculations and, unless this software will be in use for nearly a thousand more years, MySQL, with our configured tables described below, will most certainly be able to hold all of our data as well as providing a fast and easy way to return data to PHP. Another benefit of using PHP and MySQL is how well they mesh together, allowing for incredibly intuitive design and code.

#####Requirements
The server must
* Display the website when the domain is visited
* Upon connection, deliver a descriptor table of the contents of the database, along with the year range within the database, and the data for the default year of the default stat for the heatmap
* Upon receipt of a CountryID or comma delimited list of CountryID's, deliver all data for that country or countries
* Upon receipt of a StatID with year, deliver all data for that stat in that year(if no year is provided, the current year is given)


#####Database Setup
#Needs updated when database is filled

Now that we have the architecture of our back end planned out, it's time to dictate the table setup for our MySQL database. The configuration we decided on involves 4 table types.

All tables will be linked via country id (CID).

**meta_stats:** This table provides an easy way to search our list of data tables. It has a columns: Stat table ID, Stat id Name, and SQL table name.

**meta_countries:** This table provides a list of all countries identifiers, common name, 2-digit country code, and 3-digit country code. This will be called when a call to "descriptor" is made, and when new data is being uploaded.

**data_?:** There will be an individual table for each different data statistic (e.g. deaths, births, vaccinations) for each different country. Each of these tables will have columns: CID and as many years columns as needed. This format was chosen to make it more efficient to grab all years of data from a single country by just grabbing a row of data. The other way of doing this would be to have three columns: CID, Year, and Value. This way would be considered the “correct” way, however would take a significantly longer time to query for mass quantities of yearly data. This way has the advantage of having a much greater amount of years, however, the chosen way of creating this table allows for a maximum of 1024 columns, hence 1023 years and it is inconceivable that this program will be used for longer than that span of time. 

#####PHP Files
#Needs more detail

**descriptor.php:** API call to get descriptor table, year range, and list of stats, takes no arguments

**by_country.php:** API call to get all data for a country or several countries, takes CountryID or comma delimited list of CountryID's

**by_stat.php:** API call to get data for all countries for a stat and a year, takes a StatID and a year as arguments, if no year argument is given it defaults to the current year

**connect.php** establishes a connection to the MySQL database, takes no arguments

**toolbox.php** library of functions that are useful in multiple places within the back end

**api_library.php** library of functions that do the calculations for all of the API calls

**test_lib.php** library of unit tests for the functions within the back end



#####Design Decisions

**SQL vs NoSQL:** SQL offers a database management platform that is easy to learn and already known by several team members.  NoSQL offers increased functionality and expandability.  SQL will be used because of the relatively small scale of our back end.  It was ultimately decided that if there comes a time when the backend needs to be scaled up on a large scale that it can be replaced as a whole without affecting the front end, so the design decision can be revisited later.

**Server Decision: PSU Server vs. Microsoft Azure vs. Server4You.com:** We ultimately decided on the Server4You server because it offered the flexibility of a plain virtual LAMP server at a reasonable monthly cost. The PSU server was only accessible via VPN to Penn State's network. Microsoft Azure would give us a dependence on Microsoft software that we did not want to create. With the Server4You server, we are able to pick up and move to a new server if necessary since it is just a plain LAMP server.

**Moving Calculations Out of API Calls:** Originally, the API calls and functions were one and the same. We decided to move the calculations to functions that are called by API calls because we needed to call the calculations elsewhere. If the calculations were done in the API calls, then when the calculations were needed in other functions as well, the data would be sent to the front end as well as used within the back end.

