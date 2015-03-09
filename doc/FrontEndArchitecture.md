#Front End Design

###Table of Contents

Section 0  
 * 0.0 : Introduction
 * 0.1 : Definitions

Section 1  
 * 1.0 : Requirements
 * 1.1 : Platform/Architecture
 * 1.2 : Languages Used
 * 1.3 : Third Party Resources

Section 2  
 * 2.0 : Files
 * 2.1 : Client/Server Interface
 * 2.2 : API Call Syntax
 * 2.3 : Module Architecture
 * 2.4 : Data Structure Specifications

Section 3  
 * 3.0 : Use cases
 * 3.1 : How to Satisfy Use Cases in the UI
 * 3.2 : Features of the UI
 * 3.3 : User Experience and Paths of Action

#Section 0

###0.0 : Introduction

This document describes the overall design of the front end components of the Stateware project begun in the Spring 2015 semester of Stateware. 

The following section defines commonly used language in the document, as a reference to ensure that the document is as concise as possible.

Section 1 defines the requirements of the project, and high level constructs that will be used to meet these requirements, including the platform, high level architecture, languages used, and any third party plugins, APIs, or other resources.

Section 2 defines the low level architecture of the project, including the necessary files for the front end, the interface to the server, the specification of interaction between modules, and specific data structures that are needed.

Section 3 defines the use cases and how we satisfy them, features of the user interface, and the possible paths of action a user may take in interacting with the program

###0.1 : Definitions

**front end** refers to the program's user interface, as well as any background processes that take place on the user's machine, as opposed to on the server.

**back end** refers to any program processes that take place on the server or database as opposed to on the user's machine.

**stat** refers to any of the measured statistics graphed by the program.

**stat value** refers to the value of a stat for 1 country/region at a particular time t.

**bounds** refers to the upper and lower bounds of stats whose stat values are estimated.

**country/region** refers to 1 distinct and indivisible region for which a single set of stats exists in the database.

**area selection** refers to a country/region or list of countries/regions which the user selects, using either the map or search bar, for which stats must be graphed.

**area selection data** refers to the entire set of stat data for an area selection, in JSON format. If the area selection includes more than 1 country/region, the data object is composed of each individual country/region's data, concatenated in the order in which they were queried.

**ASDS** or **area selection data structure** refers to the organization of a 3D array used to store area selection data on the client side.

**parsed data** refers to area selection data parsed to fit ASDS.

**CID** refers to the unique integer ID used to refer to a country/region.

**data query** refers to the process of querying the server for area selection data. The client makes an API call to by_country.php using a comma delimited list of CIDs indicating the area selection, and the server returns the area selection data.

**CID reference list** refers to an array of CIDs used in a data query, in the order in which they were queried. This is used to get names from the lookup table to compose a legend for the corresponding graphs.

**stat reference list** refers to an array of stat names (births, deaths, estimated cases, etc.) which are enumerated based on the order in which the stats are given when a data query is made.

**CC2** refers to the unique 2 character code used to refer to a country/region.

**name** refers to the name of a country/region.

**heat map stat** or **HMS** refers to the current stat being used to color the map, with each country/region's color based on the magnitude of its HMS value, on a scale from green to yellow to red. HMS is dependent on which stat is selected to represented, and from what year the HMS is pulled. HMS includes all data for all countries/regions from 1 stat from 1 year.

**lookup table** refers to the table created when the page is loaded, that includes CC2, name, and a default HMS for each country/region, indexed by CID. If a new HMS is selected, the HMS values are replaced with the new selection.

**timespan** refers to the 2 integers that represent the first and last year for which data exists.

#Section 1

###1.0 : Requirements

Each year, the World Health Organization makes strategic decisions for the deployment of Measles vaccines worldwide. At present, these decisions are based on the comparison of large data sets on statistics associated with the Measles virus worldwide. At present, these data sets are compared by generating graphs in a slow and error prone case by case process. This project aims to address the inefficiencies and inaccuracies of this approach by providing an accessible and transparent platform with which to visualize this data, the results of which will be a more effective approach to vaccination strategy worldwide.

In the process of accomplishing this, we utilize a front end interface that interacts with a back end server.

The front end must:

 * Provide an easy to use interface for displaying desired area selection data
 * Upon area selection, make needed data query to back end and retrieve area selection data
 * Use area selection data to generate easily readable and comparable graphs

Necessary data for each area selection:

 * Birth Rate
 * Death Rate
 * Population
 * Vaccinations (routine and periodic mass vaccinations)
 * Observed Measles Cases
 * Estimated Measles Cases
 * Estimated Mortality Rate

###1.1 : Platform/Architecture

Our front end is a web page, which will communicate with a LAMP stack server using AJAX php function calls. We chose a web platform both due to the client's vision of the product, and its inherent accessibility across many platforms. In future releases, we plan to extend this functionality to mobile platforms.

###1.2 : Languages Used

Our front end web page is built using HTML5, CSS, and JavaScript. These were obvious choices, as they are the de facto technologies of the world wide web. HTML5 was chosen in particular for its ability to generate complex functionality quickly, though it potentially will limit functionality in older browser versions.

###1.3 : Third Party Resources

In building the front end, we utilize Google Charts API to generate graphs, and jVectorMap to generate the map. These were chose for their performance and feature sets, as well as their ease of use under the terms of the GPL.

#Section 2

###2.0 : Files

**index.html**

index.html is the markup for the main page, including a loading screen, an HTML5 canvas that shows the map, another that shows the graphs, and sections that include the search bar and settings menu. There is also a footer which includes contact information and legal notices linking to a copy of the GPL.

**style.css**

style.css includes style for main page and loading screen.

**lookup_table.js**

lookup_table.js is a JavaScript module that includes functions to:  
 * Call descriptor.php to get CC2s, names, stat reference list, and set timespan (using settings.js)
 * Call by_stat.php to get default HMS
 * Generate lookup table from CC2s, names, and default HMS
 * Call by_stat.php with non-default HMS value and replace stat values in HMS field of lookup table
 * Translate CC2s to CIDs
 * Translate CIDs to names

**loading_script.js**

loading_script.js is a container module that runs during the loading screen. It calls functions from lookup_table.js and map.js to:
 * Generate lookup table with default HMS
 * Set stat reference list
 * Set timespan
 * Generate map colored by default HMS

**settings.js**

settings.js is a JavaScript module that takes user mouse clicks as input to a list of checkboxes (toggle bounds on/off, toggle for showing each stat) and to a 2 ended slider that defines the timespan for graph generation. It includes functions to:
 * Return the values of the settings as an array of booleans, and 2 ints for timespan.
 * Set timespan (timespan is argument)
 * Reset the HMS to a newly selected one

**map.js**

map.js is a JavaScript module that includes functions to:
 * Generate map
 * Reset map in the case of HMS change
 * Make area selection and and get parsed data using CC2s (using data_query.js)
 * Call functions from graphs.js using parsed data

**data_query.js**

data_query.js is a JavaScript module that includes a function to:
 * Take a list of CC2s, translate to CIDs (using lookup_table.js), fills CID reference list, make call to by_country.php using CID reference list to get area selection data, parse area selection data into ASDS (using client_parser.js), and return parsed data

**client_parser.js**

parser.js is a JavaScript module that includes a function to:
 * Take area selection data, and return parsed data

**graphs.js**

graphs.js is a JavaScript module includes functions to:
 * Remove displayed graphs if there are any, and generate graphs based on parsed data, and which graphs/timespan are desired based on settings
 * Translate CIDs into names (using lookup_table.js) and generate graph legend using names and stat reference list

###2.1 : Client/Server Interface

The front end interacts with the back end using 3 distinct AJAX php calls:
 * descriptor.php : gets data for lookup table, timespan, and stat reference list
 * by_country.php : gets area selection data based on CID reference list
 * by_stat.php    : gets HMS data

###2.2 : API Call Syntax

 * descriptor.php    
Query:       `http://[server-domain]/API/descriptor.php`    
 * by_country.php  
Query:       `http://[server-domain]/API/by_country.php?CID=[CIDs]`, where [CIDs] is the CID reference list.  
 * by_stat.php  
Query:       `http://[server-domain]/API/by_stat.php?statID=[ID]&year=[year]`, where [ID] is the enumerated value from the stat reference list, and [year] is the year desired.  

###2.3 : Module Architecture

The module architecture is defined in section 2.0 : Files. It can be seen visually in the diagram in FrontEndBlockDiagram.png.

###2.4 : Data Structure Specifications

The area selection data structure is defined below:

When parsed data is returned from client_parser.js, it is returned as a 3D array, with each index meaning a different thing, based on context.

For data A[x][y][z], x always refers to the stat that matches its enumerated value in stat reference list.

**Scheme 0:** A[x][y][z]: Used for single country/region area selection, for stats that do not include bounds.
 * y is unused, but still exists in the data structure to ensure a uniform return type from the parser. The stat value exists in the row y = 1, for uniformity with scheme 1.
 * z corresponds to the stat value at time t = 1980 + z.

**Scheme 1:** A[x][y][z]: Used for single country/region area selection, for stats that include bounds. 
 * y corresponds to upper bound when y = 0, the stat's value when y = 1, and lower bound when y = 2.
 * z corresponds to the value of the upper bound, stat value, and value of the lower bound at time t = 1980 + z.

**Scheme 2:** A[x][y][z]: Used for multiple country/region area selection.
 * y corresponds to country, enumerated based on the order in which it was queried. 
 * z corresponds to the stat value at time t = 1980 + z.

For a single country/region area selection, both schemes 0 and 1 will be used, with each being used dependent on whether the stat has upper and lower bounds. This is checked using the stat reference list.
For multiple country/region area selection, scheme 2 will be used for all stats.

#Section 3

###3.0 : Use cases

The obvious use case of this program is for the purposes of composing vaccine deployment strategies. As our target audience, making sure WHO can effectively use our platform to inform policy decisions is our most important goal.

Secondary, but perhaps no less important, is the utility of our platform as a research tool. Researchers in epidemiology and the study of infectious diseases can benefit greatly from the ability to transparently visualize and compare this data.

As an external use case, we may also consider that as a public platform, the availability of this data in an unprecedented clarity can be a valuable tool for informing public perception of disease and the spread of epidemics, as well as increasing public awareness of the state of the problem worldwide.

Luckily, these three use cases are not mutually exclusive, and won't require much in the way of specific attention to one that would not satisfy all at once.

###3.1 : How to Satisfy Use Cases in the UI

To satisfy these use cases and deliver the ideal user experience, we must:

 * Deliver an easy to use and easy to understand interface
 * Allow the user to quickly and easily make an area selection
 * Quickly display graphs of area selection data in a way that makes the area selection and graph generation feel strongly connected, to avoid confusion
 * Allow the user to easily understand which stats are being displayed, for which countries, over what period of time
 * Display graphs in a way where the data is easily understood, without giving the ability for the user or the program itself to misrepresent data for political, malicious, or otherwise negative purposes

###3.2 : Features of the UI

 Our UI includes a loading screen, during which the loading script is run. Once this is done, the user can click a button to begin, and the loading screen slides down to reveal the main screen, which includes:
 * A map of the world, from which a user can make an area selection.
 * A search bar, which provides a secondary way for the user to make an area selection.
 * A settings menu, which provides an interface to select displayed stats, HMS, and a desired timespan, as well as toggling bounds on and off.
 * A section on which graphs are generated, based on parsed data from area selection and settings.
 * A footer, which includes links to contact information and a legal notice with a link to a copy of the GPL.

###3.3 : User Experience and Paths of Action

At the entry point to the program, the user is greeted with a loading screen, including the program logo, a Stateware logo, and a logo for The Ferrari Lab.

Once the loading script is finished, the user advances to the main page. At this point, the user can make an area selection, either with the search bar or the map. The user can also change the settings.

When an area selection is made, graphs are generated based on area selection data. It is not yet known how we will choose to implement the timeline of area selection to data query, but it is our goal to make the interface as responsive as possible.

Once the area selection data is graphed, the user may make additional selections and append them to the displayed data set, or the user may make a new selection. The user may also change settings for the current area selection. The result is always a refresh of the graph section in light of changes made by the user.