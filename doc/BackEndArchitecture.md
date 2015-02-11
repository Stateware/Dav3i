#Back End Architecture Document


#####Introduction to the back end

We decided to install a LAMP stack on our server. This choice was made for a few reasons, namely that it is what we are most familiar with and that we know its capabilities extend farther than our requirements for this project. We know that the LAMP stack is a time-tested standard for web servers.

#####What is a LAMP stack?

The LAMP stack is made up of four components, each communicating with only one or two of the others, to create an assembly-line type system for outputting dynamic data to websites. 

The L stands for Linux, which is quite self explanatory. Alternate versions of this architecture can of course substitute in other operating systems for the server, including WAMP for Windows. As the server we were provided with is a “bare-bones” Linux server, and as servers typically run Linux so they are not required to expend resources into additional things like GUI's, we have decided to stick with Linux. 

The A stands for Apache. Apache is the tool we will be using to communicate with the Linux OS on the server. Essentially Apache is a sorting utility. Once the server receives a request, it will forward it to Apache who will decide where it should go next. If it just requires a pre-made static web page it will ship it out; however, if it finds different requests, such as things with PHP, it will forward them elsewhere to be dealt with, then when the page is returned to Apache it will return it to the server to be returned to the client. 

The P stands for PHP. Although the acronym is LAMP, the next “machine” in our assembly line is PHP. PHP is how we will be giving variable data to the webpages. It is also how we will be accessing our database, which is the next and final step.

The M stands for MySQL. This is our database. We have done the calculations and, unless this software will be in use for nearly a thousand more years, MySQL, with our configured tables described below, will most certainly be able to hold all of our data as well as providing a fast and easy way to return data to PHP. Another benefit of using PHP and MySQL is how well they mesh together, allowing for incredibly intuitive design and code.




#####Database Setup

Now that we have the architecture of our back end planned out, it's time to dictate the table setup for our MySQL database. The configuration we decided on involves 4 table types.

All tables will be linked via country id (CID).

**Stats:** This table provides an easy way to search our list of data tables. It has a columns: Stat table ID, Stat id Name, and SQL table name.

**Country:** This table allows us to convert from a variable character name or a two character standardized country code to our country id for use in our database. This will be relevant for the API as having the requests include the MySQL specific CID would not be very portable if we needed to change something, as well as making things less intuitive and harder to read/write. This table has columns: CC2, Name, and CID.

**Data:** There will be an individual table for each different data statistic (e.g. deaths, births, vaccinations) for each different country. Each of these tables will have columns: CID and as many years columns as needed. This format was chosen to make it more efficient to grab all years of data from a single country by just grabbing a row of data. The other way of doing this would be to have three columns: CID, Year, and Value. This way would be considered the “correct” way, however would take a significantly longer time to query for mass quantities of yearly data. This way has the advantage of having a much greater amount of years, however, the chosen way of creating this table allows for a maximum of 1024 columns, hence 1023 years and it is inconceivable that this program will be used for longer than that span of time. 

**CountryID:** This table will only be used in the input of the data from the original CSV files as these files use the 3 character country code and the graphing API we will be using uses the 2 character country code. This table will used to tie the country to its ID which will be how we will be tying individual countries to each other in each table

#####PHP Functions

**Descriptor.php:** This function constructs a JSON descriptor table from the MySQL tables.

**ByCountry.php:** This function takes a CountryID as an argument and delivers all of the data for that country to the front end.  This data will be used for the graphs.

**ByStat.php:** This function takes a StatID and a year as arguments and delivers all of the data for that stat in that year to the front end.  This data will be used for the heatmap.

#####Design Decisions

**SQL vs NoSQL:** SQL offers a database management platform that is easy to learn and already known by several team members.  NoSQL offers increased functionality and expandability.  SQL will be used because of the relatively small scale of our back end.  It was ultimately decided that if there comes a time when the backend needs to be scaled up on a large scale that it can be replaced as a whole without affecting the front end, so the design decision can be revisited later.

**Server Decision:**

