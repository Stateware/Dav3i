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
 * 3.4 : Input Handling

Section 4
 * 4.0 : Major Design Decisions
 * 4.1 : Bug History

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

**country/region data** refers to the data set (all stats for all possible times) for a single country/region, in JSON format.

**area selection** refers to a country/region or list of countries/regions which the user selects, using either the map or search bar, for which stats must be graphed.

**area selection data** refers to the entire set of stat data for an area selection contained in the ASDS.

**ASDS** or **area selection data structure** refers to the data structure used to store area selection data on the client side (defined in section 2.4).

**ASDS node** refers to one of the nodes of the ASDS corresponding to a single country/region data set.

**parsed data** refers to country/region data parsed to fit within an ASDS node.

**CID** refers to the unique integer ID used to refer to a country/region.

**data query** refers to the process of querying the server for area selection data. The client makes an API call to by_country.php using a single CID and returns country/region data.

**stat reference list** refers to an array of stat names and names corresponding to upper and lower bounds of stats (Births, Deaths, Estimated Cases Upper, Estimated Cases, Estimated Cases Lower etc.) which are enumerated based on the order in which the stats are returned when a data query is made.

**stat ID** refers to the enumerated value of a stat in the stat reference list.

**CC2** refers to the unique 2 character code used to refer to a country/region.

**name** refers to the name of a country/region.

**heat map stat** or **HMS** refers to the current stat being used to color the map, with each country/region's color based on the magnitude of its HMS value, on a scale from green to yellow to red. HMS is dependent on which stat is selected to represented, and from what year the HMS is pulled. HMS includes all data for all countries/regions from 1 stat from 1 year.

**lookup table** refers to the table created when the page is loaded, that includes CC2, name, and a default HMS for each country/region, indexed by CID. If a new HMS is selected, the HMS values are replaced with the new selection.

**timespan** refers to the 2 integers that represent the first and last year for which data exists.

**selected timespan** refers to the 2 integers that represent the first and last year for which data is desired by the user to be represented.

**settings toggles** refers to an array of booleans that represents all boolean settings values, including bounds on/off, and an on/off corresponding to each stat ID that is not a bound.

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

Our front end is a web page, which will communicate with a LAMP stack server using AJAX php function calls.

###1.2 : Languages Used

Our front end web page is built using HTML5, CSS, and JavaScript.

###1.3 : Third Party Resources

In building the front end, we utilize Google Charts API to generate graphs, and jVectorMap to generate the map.

#Section 2

###2.0 : Files

**index.html**

index.html is the markup for the main page, including a loading screen, an HTML5 canvas that shows the map, another that shows the graphs, and sections that include the search bar and settings menu. There is also a footer which includes contact information and legal notices linking to a copy of the GPL.

**style.css**

style.css includes style for main page and loading screen.

**data.js**

data.js is a JavaScript data module that contains all global variables needed across the program. It includes:  
 * `g_LookupTable` : variable containing lookup table
 * `g_StatList` : variable containing stat reference list
 * `g_FirstYear` : variable containing earliest year for which data exists
 * `g_LastYear` : variable containing latest year for which data exists
 * `g_YearStart` : variable containing earliest year for which the user wants to see data
 * `g_YearEnd` : variable containing latest year for which the user wants to see data
 * `g_Data` : variable containing area selection data (in ASDS format)
 * `g_Toggles` : variable containing settings toggles
 * `g_HMSID` : stat ID representing which stat is heat mapped
 * `g_HMSYear` : variable representing the year for which HMS data is desired
 * `g_isSum` : boolean variable that represents whether graph is to be sum or individualized data (true if user wants sum)

**lookup_table.js**

lookup_table.js is a JavaScript module that includes functions to:  
 * Call descriptor.php and return response text (including CC2s, names, stat reference list, and timespan)
 * Call by_stat.php with some statID and return HMS
 * Generate lookup table from CC2s, names, and 0's for HMS (stored as g_LookupTable)
 * Set stat reference list (stored as g_StatList)
 * Set timespan (stored as g_FirstYear and g_LastYear)
 * Replace HMS values in lookup table with new HMS data (will happen just after lookup table generation for default HMS)
 * Translate CC2 to CID using g_LookupTable
 * Translate CC2 to name using g_LookupTable
 * Get HMS value using CC2 as argument using g_LookupTable

**loading_script.js**

loading_script.js is a container module with a function that runs during the loading screen. It calls functions from lookup_table.js, settings.js, map.js, and graphs.js to:  
 * Generate lookup table from CC2s, names, and default HMS (using functions from lookup_table.js)
 * Set stat reference list (using functions from lookup_table.js)
 * Set timespan (using functions from lookup_table.js)
 * Generate map colored by default HMS (using functions from lookup_table.js and map.js)
 * Hide loading screen when the user advances to the main page

**settings.js**

settings.js is a JavaScript module that takes user mouse clicks as input to a list of checkboxes (toggle bounds on/off, toggle for showing each stat) and to a 2 ended slider that defines the timespan for graph generation. It includes functions to:  
 * Take an index into g_Toggles and flip that value
 * Set g_YearStart and g_YearEnd
 * Set g_HMSID

**map.js**

map.js is a JavaScript module that includes functions to:  
 * Generate map colored by default HMS (getting HMS using lookup_table.js)
 * Reset map in the case of HMS change (getting HMS using lookup_table.js)
 * Make country/region selection and append new ASDS node to area selection data (using data_query.js)

**data_query.js**

data_query.js is a JavaScript module that includes a function to:  
 * Prototype ASDS node (defined in section 2.4)
 * Take a CC2, translate it to CID and get name, make call to by_country.php using CID, parse returned data (using client_parser.js) and create and return new ASDS node
 * Take CID, name, and parsed data and return ASDS node including that data

**client_parser.js**

parser.js is a JavaScript module that includes a function to:  
 * Take country/region data, and return parsed data

**graphs.js**

graphs.js is a JavaScript module includes functions to:  
 * Take first ASDS node of area selection data, and generate graphs for whole list (with stat name over each graph), based on settings toggles and selected timespan (including names in legend)
 * Take first ASDS node of area selection data, and generate graphs for sum of list (with stat name over each graph), based on settings toggles and selected timespan (including names in legend)

###2.1 : Client/Server Interface

The front end interacts with the back end using 3 distinct AJAX php calls:  
 * descriptor.php : gets data for lookup table, timespan, and stat reference list
 * by_country.php : gets area selection data based on CID reference list
 * by_stat.php    : gets HMS data

###2.2 : API Call Syntax

 * descriptor.php    
Query:       `http://[server-domain]/API/descriptor.php`    
 * by_country.php  
Query:       `http://[server-domain]/API/by_country.php?CID=[CID]`, where [CID] is the CID corresponding to the desired country/region.  
 * by_stat.php  
Query:       `http://[server-domain]/API/by_stat.php?statID=[ID]&year=[year]`, where [ID] is the enumerated value from the stat reference list, and [year] is the year desired.  

###2.3 : Module Architecture

The module architecture is defined in section 2.0 : Files. It can be seen visually in the diagram in FrontEndBlockDiagram.png.

###2.4 : Data Structure Specifications

The area selection data structure is defined below:

When a country/region's data is returned from by_country.php, it is sent to the ParseData(json) function of client_parser.js. When parsed data is returned from client_parser.js, it is returned as a 2D array, indexed as a 2D array `A[x][y]`.

For data `A[x][y]`,  
 * `x =` stat ID, where each row stat values in `y` indexed by `x` is the time series for the stat corresponding to stat ID in the stat reference list.
 * `y =` stat value for the stat corresponding to statID at time `t = y + 1980`.

This 2D array is a data member of an ASDS node, which also includes CID and name of the relevant country/region. It is declared in data_query.js as:  
`function data_node(cid, name, data)`  
`{`  
&nbsp;&nbsp;&nbsp;&nbsp;`this.cid=cid;`  
&nbsp;&nbsp;&nbsp;&nbsp;`this.name=name;`  
&nbsp;&nbsp;&nbsp;&nbsp;`this.data=data;`  
&nbsp;&nbsp;&nbsp;&nbsp;`this.next=null;`  
`}`  

The ASDS is a singly-linked list of ASDS nodes.

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

###3.4 : Input Handing

The front end receives 2 types of input:  
 * Mouse input, in the form of country/region selection, settings changes, and various minor actions
 * Keyboard input in the search box

Mouse input is handled differently in each context. In country/region selection, each country/region is selected by clicking it once, toggling the country/region to selected. After a country/region is selected, one can deselect it either by clicking the individual country/region again, or by deselecting the whole area selection by clicking the "clear selection" button in the settings. Settings changes are primarily checkboxes, which function in the way conventionally seen on a website. They can be toggled on and off by a click of the mouse. In certain contexts, some boxes will be grayed out and uncheckable (e.g. including bounds when multiple countries' data is displayed). There are also radio buttons for selecting HMS, which function in such a way that only one of a set is selectable at a time. There is also a slider for selecting timespan, with either end draggable by the mouse, and a second slider with 1 draggable part that selects HMS year.

Keyboard input requires a more secure approach. Input is parsed and sanitized before it is used, to avoid malicious or otherwise unpredictable behavior. *section to be expanded as test plan is developed*.

#Section 4

###4.0 : Major Design Decisions

#####Architecture  
 * Platform: We chose a web platform both due to the client's vision of the product, and its inherent accessibility across many platforms. In future releases, we plan to extend functionality to mobile platforms.
 * Languages: HTML5/CSS/JavaScript were obvious choices, as they are the de facto technologies of the world wide web. HTML5 was chosen in particular for its ability to generate complex functionality quickly, though it potentially will limit functionality in older browser versions. We saw this as a manageable risk, particularly due to the well equipped nature of our target market.
 * Third Party Resources: Google Charts API and jVectorMap were chosen for their performance and feature sets, as well as their ease of use under the terms of the GPL.

#####Data Structures  

ASDS:

The ASDS was redone in the new scheme (discarded ASDS below) because it gave us the following advantages:  
 * Can store bounds for all countries
 * Can add to or remove from area selection without modifying existing data structures
 * Single structure fits all cases without varying meaning in different contexts
 * More flexible structure that is not single-purpose built; the data structure is built to store data, rather than built to be operated upon in a specific way, and will thus have high utility in adding new functionality.

*Discarded ASDS Design*  
ASDS:

The ASDS was chosen as the ideal setup for parsed data, as it is a uniform structure that serves all of our unique use cases for parsed data. This way, the parser can run as a single function with low cyclomatic complexity. Additionally, in the event that we may want to display a single time series of a sum of multiple countries, the ASDS will adequately serve that purpose under the single country/region scheme, as it receives the summed data from the server.  

When parsed data is returned from client_parser.js, it is returned as a 3D array, with each index meaning a different thing, based on context.  

For data `A[x][y][z]`, `x` always refers to the stat that matches its enumerated value in stat reference list.  

**Scheme 0:** `A[x][y][z]`: Used for single country/region area selection, for stats that do not include bounds.  
 * `y` is unused, but still exists in the data structure to ensure a uniform return type from the parser. The stat value exists in the row `y = 1`, for uniformity with scheme 1.  
 * `z` corresponds to the stat value at time `t = 1980 + z`.  

**Scheme 1:** `A[x][y][z]`: Used for single country/region area selection, for stats that include bounds.  
 * `y` corresponds to upper bound when y = 0, the stat's value when `y = 1`, and lower bound when `y = 2`.  
 * `z` corresponds to the value of the upper bound, stat value, and value of the lower bound at time `t = 1980 + z`.  

**Scheme 2:** `A[x][y][z]`: Used for multiple country/region area selection.  
 * `y` corresponds to country, enumerated based on the order in which it was queried.  
 * `z` corresponds to the stat value at time `t = 1980 + z`.  

For a single country/region area selection, both schemes 0 and 1 will be used, with each being used dependent on whether the stat has upper and lower bounds. This is checked using the stat reference list.  
For multiple country/region area selection, scheme 2 will be used for all stats.  
*end of discarded design*  

Lookup Table Structure:

The lookup table structure was chosen for its simplicity in being able to index CC2, name, and HMS value for each country/region by its CID.

Stat Reference List:

The stat reference list's setup as a 1D array is ideal as it is easily used to enumerate the x indices of the ASDS, allowing each module to correctly interpret the parsed data.

CID Reference List:

The CID reference list's setup as a 1D array is ideal because it can easily be used to retrieve names from the lookup table and generate an accurate legend for the graphs.

#####UX  
 * Checkboxes, radio buttons, and a slider were chosen for the settings menu, as they are a simple interface to toggling, selection of one from a set, and selecting a timespan, which are the fundamental requirements of the menu.
 * Toggle selecting country/region was chosen as a bit of an accident. Originally, we had the idea to select one country/region by clicking, and ctrl+click to add to the list, or simply click to start a new one. However, we saw in implementing map.js that toggling was a much better experience in interfacing with the map, so we used that. To remove the hassle of untoggling every country when selecting a new area selection, we added a "clear selection" button.
 * Based on eyetracking studies, most of the user's attention focuses to the left side of the page. Thus, we decided to put the graphs on that side, and put the easily viewable map on the right. This way, the user is able to focus on the data as it is presented, rather than being distracted by the map being overprominent.

###4.1 : Bug History

 * \#1: Map does not work correctly in Firefox  
First Reported: March 5, 2015  
Status: Fixed March 15, 2015  
Description: When the map is made visible, only a small unselectable vector image appears in the section, rather than the full selectable map.  
Reason for bug: Firefox doesn't process jVectorMap correctly when the map container is initially hidden. As the main page is hidden before the loading screen is removed, this triggered the bug.  
Description of fix: Set up main page to be visible initially, by layering the loading screen on top of the main page and simply hiding the loading screen to show the main page when needed.  

