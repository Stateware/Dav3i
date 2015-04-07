#Davvvi Back End Test Plan

This document covers the black box testing of the back end of project Davvvi. These tests will cover the two function calls that will be made by the front end: by_stat.php and by_country.php. For each of these function calls, there will be two types of tests: normal operation tests and pathological tests. The "normal operation" tests will make a series of calls to the back end in a way that mimics the way calls from the front end are expected to be made. The pathological tests will see how the back end responds to bad input, and test the error handling ability of the back end. All tests will be timed to ensure that there are no performance issues.

The tests will be constructed using JUnit, JSoup, and an extension to JUnit called DBUnit. JUnit is a testing framework which will give more functionality than simply writing unit tests. DBUnit is an extension to JUnit which will pull data from a database and put it into XML format. DBUnit will be used to validate the output of the tests. JSoup is a java library that adds HTML functionality to java. JSoup will be used to make function calls mimicing the front end.

##by_country.php
####Normal Operation Tests
by_country takes a CountryID as input and returns the data for all stats and all years for the specified country. Under normal operation, this function will be called whenever the user clicks on a country. Each test will be comprised of a call to the function, and a subsequent validation of data. The test must be run with enough input combinations to be confident in the operation.

####Pathological Tests
The function is designed to take integers from 1 to 193 as arguments. During these tests the function will be called with as many bad inputs as possible. Examples of bad input include: no input, negative integers, integers outside of the useable range, real numbers, fractions, characters, null operators, etc. During these tests error handling and error response must be noted and assessed.

##by_stat.php
####Normal Operation Tests
by_stat takes a StatID and a year as input and returns the data for the specified stat in the specified year for all countries. If a year is not given, the year is defaulted to the most recent year. Under normal operation, this function will be called when a new heatmap is generated. There will be two varieties of test: tests where a year argument is given, and tests without a year argument. During the tests without an argument, it must be ensured that the function is properly defaulting to the most recent year. Each test will consist of calling the function with a StatID, and either with or without a year, plus the subsequent data validation. The test nust be run with enough input combinations to be confident in the operation.

####Pathological Tests
The function is designed to take integers between 1 and *max StatID* as arguments for StatID and integers between 1980 and 2012(*most recent year*). During these tests, the function will be called with bad input for StatID and no year, bad input for StatID and good input for year, bad input for StatID and bad input for year, and good input for StatID, bad input for year. Examples of bad input for StatID are: no input, negative integers, integers outside of the useable range, real numbers, fractions, characters, null operators, etc. Examples of bad input for year are:  negative integers, integers outside of the useable range, real numbers, fractions, characters, null operators, etc. During these tests, error handling and error response must be noted and assessed.