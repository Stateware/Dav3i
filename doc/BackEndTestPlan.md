# Davvvi Back End Test Plan



This document covers the black box testing of the back end of project Davvvi. These tests will cover the three function calls that will be made by the front end: by_stat.php, by_country.php, and descriptor.php. For each of these function calls except descriptor, there will be three types of tests: normal operation tests, pathological tests, and tests of corrupted/lost data. The "normal operation" tests will make a series of calls to the back end in a way that mimics the way calls from the front end are expected to be made. The pathological tests will see how the back end responds to bad input, and test the error handling ability of the back end. The tests of lost/corrupted data will make function calls after dropping various parts of the database to see if the functions can gracefully handle the event of the database getting corrupted. descriptor.php will only have corrupt/lost data tests



The tests framework was constructed using JSoup, a Java extension that provides HTML functionality. This was used to make calls to the php functions of the website, then the JSON output was parsed using Java functions. Once the data was parsed, it was then compared to data that was retrieved by connecting directly to the database using Java and making queries with Java.



## by_country.php

#### Normal Operation Tests

by_country takes a CountryID as input and returns the data for all stats and all years for the specified country. Under normal operation, this function will be called whenever the user clicks on a country. Each test will be comprised of a call to the function, and a subsequent validation of data. The test was run with all countryIDs for by_country and all tests were successful



#### Pathological Tests

The function is designed to take integers from 1 to 193 as arguments. During these tests the function will be called with as many bad inputs as possible. Examples of bad input include: no input, negative integers, integers outside of the useable range, real numbers, fractions, characters, null operators, etc. During these tests error handling and error response must be noted and assessed.



| Case | Expected Result |  Type |
|:----:|:---------------:|:-------:|
|0|P|Integer in Range|
|193|F|Integer Outside of Range|
|194|F|Integer Outside of Range|
|195|F|Integer Outside of Range|
|inject'); DROP TABLE meta_stats;|F|SQL Injection Attack|
|string|F|String|
|W31RD|F|String with Integer|
|-1|F|Negative Integer|
|-2|F|Negative Integer|
|-3|F|Negative Integer|
|-4|F|Negative Integer|
|-5|F|Negative Integer|
|-6|F|Negative Integer|
|-7|F|Negative Integer|
|-8|F|Negative Integer|
|9.12|F|Real Number|
|1/5|F|Fraction|
|0.000|F|Real Number, Outside of Range if Cast to Integer|
|1.000|F|Real Number, Inside of Range if Cast to Integer|
|+()*|F|Symbols|
|=1|F|Variable Assignment|
|&var=2|F|Additional Variable|
|?var=1|F|Additional Variable|
|4294967297|F|Large Integer|
|18446744073709551617|F|Integer One Larger Than 64 Bits|
|1WE|F|String Beginning with Integer|
|??=|F|Symbols|
|!|F|Symbol|
|&#49;|F|Symbols and Integers|
|AND I SAY HEEEEEEEEEEEEEYEAAAAAAYEEAAAAAH HEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEYYEEEEEEEYEEEAAAH I SAID HEY WHATS GOING ON AND HE TRIES OH MY GOD DO I TRY I TRY ALL THE TIME IN THIS INSTITUTION AND HE PRAYS OH MY GOD DO I PRAY I PRAY EVERY SINGLE DAY MEEEHHHH FOR REVOLLLUUUTION|F|Long String|
|one|F|String Representation of Integer|
|two|F|String Representation of Integer|
|negative one|F|String Representation of Negative Integer|
| 5|F|Space Followed by Integer in Range |
|12549|F|Integer Out of Range|
| |F|Space|
|illuminati|F|String|
|G2|F|Character and Integer|
|R3D-Shirt|F|String with Integer and Symbol|
|0_0|F|Integers with Symbol|
|o|F|Character|
|...|F|Periods|
|o|F|Character|
|http://www.duckduckgo.com/|F|URL|
|https://duckduckgo.com/?q=how+to+test+php+code&ia=qa|F|URL with Search Query|
|<|F|Symbol|
|>|F|Symbol|
|>_<|F|Symbols|
|<(o.o<)|F|Symbols|
|(>o.o)>|F|Symbols with Characters|
|015|F|Integer in Range with Leading Zero|
|zero15|F|String Representation of Integer Followed by Integer|
|O15|F|Character followed by Integer in Range|
|true|F|Boolean|
|false|F|Boolean|
|DJPmyHERO|F|String|
|<a href="http://www.matmartinez.net/nsfw/">LOL</a>|F|Cross Site Scripting Attack|
|dQw4w9WgXcQ|F|Random Characters and Numbers|
|ZZ5LpwO-An4|F|Characters, Numbers, and Symbol|
|theydon'tthinkitbelikeitisbutitdo|F|String with Symbol|



All tests performed as expected.



#### Tests of Corrupted/Lost Data

by_country.php will be called after dropping each of these from the database individually:

* **stat table** - all data for a specific stat is missing 

* **stat table column** - all data for a specific year in a stat table is missing

* **stat table row** - all data for a specific country in a stat table is missing

* **meta stat table** - the table used to reference which stats are which tables is missing

* **meta country table** - the table used to reference which countries are which rows is missing



Not all of these tests handled the event successfully, so additional error handling was added to the function. For more info on the error handling see BackEndArchitecture.md







## by_stat.php

#### Normal Operation Tests

by_stat takes a StatID and a year as input and returns the data for the specified stat in the specified year for all countries. If a year is not given, the year is defaulted to the most recent year. Under normal operation, this function will be called when a new heatmap is generated. There will be two varieties of test: tests where a year argument is given, and tests without a year argument. During the tests without an argument, it must be ensured that the function is properly defaulting to the most recent year. Each test will consist of calling the function with a StatID, and either with or without a year, plus the subsequent data validation. The test was run with all combinations of years and statIDs and all tests were successful.



#### Pathological Tests

The function is designed to take integers between 1 and *max StatID* as arguments for StatID and integers between 1980 and 2012(*most recent year*). During these tests, the function will be called with bad input for StatID and no year, bad input for StatID and good input for year, bad input for StatID and bad input for year, and good input for StatID, bad input for year. Examples of bad input for StatID are: no input, negative integers, integers outside of the useable range, real numbers, fractions, characters, null operators, etc. Examples of bad input for year are:  negative integers, integers outside of the useable range, real numbers, fractions, characters, null operators, etc. During these tests, error handling and error response must be noted and assessed.



| Case | Expected Result |  Type |
|:----:|:---------------:|:-------:|
|0|P|Integer in Range|
|13|F|Integer Outside of Range|
|14|F|Integer Outside of Range|
|15|F|Integer Outside of Range|
|inject'); DROP TABLE meta_stats;|F|SQL Injection Attack|
|string|F|String|
|W31RD|F|String with Integer|
|-1|F|Negative Integer|
|-2|F|Negative Integer|
|-3|F|Negative Integer|
|-4|F|Negative Integer|
|-5|F|Negative Integer|
|-6|F|Negative Integer|
|-7|F|Negative Integer|
|-8|F|Negative Integer|
|9.12|F|Real Number|
|1/5|F|Fraction|
|0.000|F|Real Number, Outside of Range if Cast to Integer|
|1.000|F|Real Number, Inside of Range if Cast to Integer|
|+()*|F|Symbols|
|=1|F|Variable Assignment|
|&var=2|F|Additional Variable|
|?var=1|F|Additional Variable|
|4294967297|F|Large Integer|
|18446744073709551617|F|Integer One Larger Than 64 Bits|
|1WE|F|String Beginning with Integer|
|??=|F|Symbols|
|!|F|Symbol|
|&#49;|F|Symbols and Integers|
|AND I SAY HEEEEEEEEEEEEEYEAAAAAAYEEAAAAAH HEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEYYEEEEEEEYEEEAAAH I SAID HEY WHATS GOING ON AND HE TRIES OH MY GOD DO I TRY I TRY ALL THE TIME IN THIS INSTITUTION AND HE PRAYS OH MY GOD DO I PRAY I PRAY EVERY SINGLE DAY MEEEHHHH FOR REVOLLLUUUTION|F|Long String|
|one|F|String Representation of Integer|
|two|F|String Representation of Integer|
|negative one|F|String Representation of Negative Integer|
| 5|F|Space Followed by Integer in Range |
|12549|F|Integer Out of Range|
| |F|Space|
|illuminati|F|String|
|G2|F|Character and Integer|
|R3D-Shirt|F|String with Integer and Symbol|
|0_0|F|Integers with Symbol|
|o|F|Character|
|...|F|Periods|
|o|F|Character|
|http://www.duckduckgo.com/|F|URL|
|https://duckduckgo.com/?q=how+to+test+php+code&ia=qa|F|URL with Search Query|
|<|F|Symbol|
|>|F|Symbol|
|>_<|F|Symbols|
|<(o.o<)|F|Symbols|
|(>o.o)>|F|Symbols with Characters|
|015|F|Integer in Range with Leading Zero|
|zero15|F|String Representation of Integer Followed by Integer|
|O15|F|Character followed by Integer in Range|
|true|F|Boolean|
|false|F|Boolean|
|DJPmyHERO|F|String|
|<a href="http://www.matmartinez.net/nsfw/">LOL</a>|F|Cross Site Scripting Attack|
|dQw4w9WgXcQ|F|Random Characters and Numbers|
|ZZ5LpwO-An4|F|Characters, Numbers, and Symbol|
|theydon'tthinkitbelikeitisbutitdo|F|String with Symbol|

All tests performed as expected. Unfortunately, the year parameter of by_stat.php was neglected in testing.


#### Tests of Corrupted/Lost Data

by_stat.php will be called after dropping each of these from the database individually:

* **stat table** - all data for a specific stat is missing 

* **stat table column** - all data for a specific year in a stat table is missing

* **stat table row** - all data for a specific country in a stat table is missing

* **meta stat table** - the table used to reference which stats are which tables is missing

* **meta country table** - the table used to reference which countries are which rows is missing



Not all of these tests handled the event successfully, so additional error handling was added to the function. For more info on the error handling see BackEndArchitecture.md





## descriptor.php

#### Tests of Corrupted/Lost Data

descriptor.php will be called after dropping each of these from the database individually:

* **stat table** - all data for a specific stat is missing 

* **stat table column** - all data for a specific year in a stat table is missing

* **stat table row** - all data for a specific country in a stat table is missing

* **meta stat table** - the table used to reference which stats are which tables is missing

* **meta country table** - the table used to reference which countries are which rows is missing



Not all of these tests handled the event successfully, so additional error handling was added to the function. For more info on the error handling see BackEndArchitecture.md

