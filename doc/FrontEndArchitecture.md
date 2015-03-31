#Front End Design

###Table of Contents

Section 0  
 * 0.0 : Introduction
 * 0.1 : Definitions  
&nbsp;&nbsp;&nbsp;&nbsp; 0.1.0 : Components  
&nbsp;&nbsp;&nbsp;&nbsp; 0.1.1 : Objects  
&nbsp;&nbsp;&nbsp;&nbsp; 0.1.2 : Processes  
&nbsp;&nbsp;&nbsp;&nbsp; 0.1.3 : Identifiers  
&nbsp;&nbsp;&nbsp;&nbsp; 0.1.4 : Data  

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
&nbsp;&nbsp;&nbsp;&nbsp;2.4.0 : ASDS  
&nbsp;&nbsp;&nbsp;&nbsp;2.4.1 : Lookup Table Structure  

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

##0.0 : Introduction

This document describes the overall design of the front end components of Dav3i, the Stateware project begun in the Spring 2015 semester. 

The following subsection defines commonly used language in the document, as a reference to ensure that the document is as concise as possible.

Section 1 defines the requirements of the project, and high level constructs that will be used to meet these requirements, including the platform, high level architecture, languages used, and any third party plugins, APIs, or other resources.

Section 2 defines the low level architecture of the project, including the necessary files for the front end, the interface to the server, the specification of interaction between modules, and specific data structures that are needed.

Section 3 defines the use cases and how we satisfy them, features of the user interface, and the possible paths of action a user may take in interacting with the program.

Section 4 defines major design decisions, including previously specification of discarded design components and rationale for discarding them, as well as keeps a bug history for the front end.

##0.1 : Definitions

###0.1.0 : High-level Components

**back end** refers to all code in /API/ or any program processes that take place on the server or database as opposed to on the user's machine.

**front end** refers to index.html, all code in /GUI/, the program's user interface, and any background processes that take place on the user's machine, as opposed to on the server or database.

**loading screen** refers to the entry point of the program, during which the loading script is run.

**main screen** refers to screen advanced to from the loading screen after completion of the loading script.

**UI** refers to the organization of screen elements and setup of user interaction processes to facilitate interaction with data.

**UX** or **user experience** refers to user interaction with screen elements as a way of interacting with data. To differentiate from UI, this more accurately refers to *how* the user interacts with the UI.

###0.1.1 : Elements

**area selection** refers to the complete list of selected regions for which graphs are desired.

**bounds** refers to the upper and lower bounds of stats whose values are estimated.

**control panel** refers to the section of the page which includes graphs, stat selection tabs, and the search bar.

**graphs** refers to the graph or graphs drawn to represent the values of the selected stat for an area selection over the selected timespan.

**heat mapped stat** or **HMS** refers to the data set for which values are used to color the heat map. This is equivalent to the data for all countries for the selected stat for a single year.

**HMS year** refers to the year for which HMS is desired.

**hover tip** refers to the text area that shows up when the user hovers over a region, containing the region's name, the currently selected stat, and the stat value.

**map** refers to the region-selectable map component of the UI.

**region** refers to 1 distinct and indivisible region for which a single set of stats exists in the database.

**search bar** refers to the text input box where a user can search for a country to add to the ASDS.

**selected stat** refers to the currently selected stat whose values are used to draw the graphs and color the map.

**selected timespan** refers to the currently selected time interval for which graphs are wanted.

**stat** refers to any of the measured statistics graphed by the program.

**timespan** refers to the time interval for which data is available.

###0.1.2 : Processes

**data query** refers to the process of querying the server for region data.

**front end scripts** refers to all files in /GUI/ ending in .js, excluding dynamic_markup.js, which facilitate map drawing, facilitation and preparation of data from the server, and graph drawing.

**loading script** refers to the front end script in loading_script.js which loads the lookup table, draws the map, and initializes the dynamically generated portions of the UI.

**UI script** refers to dynamic_markup.js, which is used to drive tab selection and UI elements which require javascript (excluding third party APIs, which have their own UI scripts).

###0.1.3 : Identifiers

**CC2** refers to a unique 2 character code used to refer to a region.

**CID** refers to the unique integer ID used to refer to a region.

**graph type** refers to the type of graph desired by the user. The graph type can fall under any of the 3 following types:  
 * each region graphed in separate graphs with bounds
 * each region graphed together on a single graph without bounds
 * each region graphed together as a sum (representing stat for whole area selection) with bounds

**name** refers to the name of a region.

**stat ID** refers to a stat's index in the stat reference list.

**stat name** refers to the name of a given stat, also used as a label for graphs and as part of the hover tip when that stat is the selected stat.

###0.1.4 : Data

**area selection data** refers to the entire set of data stored for an area selection.

**area selection data structure** or **ASDS** refers to the list structure used to store area selection data (defined in section 2.4).

**ASDS node** refers to a single node of the ASDS list, containing region data, metadata, and a pointer to the next node of the list.

**lookup table** refers to the table containing CC2, name, and the value of a default selected stat for each region, indexed by CID.

**parsed data** refers to region data parsed to fit the specification of the ASDS node.

**region data** refers to the data set (all stats for all possible times) for a single region, in JSON format.

**stat reference list** refers to the array of stat names, indexed in the order in which they are received from descriptor.php.

**stat value** refers to the value of a stat for 1 region at a particular time t.

#Section 1

##1.0 : Requirements

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

##1.1 : Platform/Architecture

Our front end is a web page, which will communicate with a LAMP stack server using AJAX PHP function calls. Due to the varying nature of web platforms, we define that our target will be functionality on the following browsers:  
 * Firefox 3.0 and up
 * Chrome 5.0 and up
 * Internet Explorer 8 and up

##1.2 : Languages Used

Our front end web page is built using HTML, CSS, and JavaScript, including some JavaScript libraries like jQuery.

###1.3 : Third Party Resources

In building the front end, we utilize Google Charts API to generate graphs, and jVectorMap to generate the map.

#Section 2

##2.0 : Files

**index.html**

index.html is the markup for the main page (detailed in section 3.2)

**style.css**

style.css includes style for the main screen and loading screen.

**data.js**

data.js is a JavaScript data module that contains all global variables needed across the program. It includes:  
 * `g_LookupTable` : variable containing lookup table
 * `g_StatList` : variable containing stat reference list
 * `g_FirstYear` : variable containing earliest year for which data exists
 * `g_LastYear` : variable containing latest year for which data exists
 * `g_YearStart` : variable containing earliest year for which the user wants to see data
 * `g_YearEnd` : variable containing latest year for which the user wants to see data
 * `g_DataList` : variable containing area selection data (in ASDS format)
 * `g_statID` : stat ID representing selected stat
 * `g_HMSYear` : variable representing the year for which HMS data is stored
 * `g_GraphType` : variable representing the graph type, enumerated 0 to 2 (same as order defined in section 1.1.2)

It also includes the function prototype for the ASDS nodes and list, as well as insertion to and deletion from the list. (defined in section 2.4)

**lookup_table.js**

lookup_table.js is a front end script that includes functions to:  
 * Call descriptor.php and return response text (including CC2s, names, stat reference list, and timespan)
 * Call by_stat.php with some stat ID and year and return HMS
 * Generate lookup table from CC2s, names, and 0's for HMS (stored as g_LookupTable)
 * Set stat reference list (stored as g_StatList)
 * Set timespan (stored as g_FirstYear and g_LastYear)
 * Replace HMS values in lookup table with new HMS (will happen just after lookup table generation for default HMS and whenever selected stat changes)
 * Translate CC2 to CID using g_LookupTable

**loading_script.js**

loading_script.js is a container front end script with a function that runs during the loading screen. It calls functions from lookup_table.js, settings.js, map.js, and graphs.js to:  
 * Generate lookup table from CC2s, names, and default HMS (using functions from lookup_table.js)
 * Set stat reference list (using functions from lookup_table.js)
 * Set timespan (using functions from lookup_table.js)
 * Generate map colored by default HMS (using functions from lookup_table.js and map.js)
 * Hide loading screen when the user advances to the main page

**settings.js**

settings.js is a front end script that takes user mouse clicks as input to a list of checkboxes (toggle bounds on/off, toggle for showing each stat) and to a 2 ended slider that defines the timespan for graph generation. It includes functions to:  
 * Set g_YearStart and g_YearEnd
 * Set g_HMSYear
 * Set g_GraphType

**map.js**

map.js is a front end script that includes functions to:  
 * Generate map
 * Generate HMS value array indexed by CC2 (using g_LookupTable)
 * Reset HMS and map when selected stat changes (using data_query.js)
 * Reset map in the case of HMS change (getting HMS using lookup_table.js)
 * Make region selection and append new ASDS node to area selection data (using data_query.js)

**data_query.js**

data_query.js is a front end script that includes a function to:  
 * Take a CC2, translate it to CID and get name, make call to by_country.php using CID, parse returned data and create and return new ASDS node
 * Check size of map selection list and size of ASDS list, and either add node for new selection or remove node from list
 * Take HMS ID and call by_stat.php, return array of HMS data
 * Take region data(JSON), and return parsed data

**graphs.js**

graphs.js is a front end script that includes functions to:  
 * Prepare area selection data for each case of g_GraphType
 * Draw graphs

**dynamic_markup.js**

dynamic_markup.js is a front end script that includes functions to:
 * generate html to display a tab for each member of g_StatReferenceList, used to choose selected stat and display graphs based on selected stat and graph type

##2.1 : Client/Server Interface

The front end interacts with the back end using 3 distinct AJAX php calls:  
 * descriptor.php : gets data for lookup table, timespan, and stat reference list
 * by_country.php : gets area selection data based on CID
 * by_stat.php : gets HMS data

##2.2 : API Call Syntax

 * descriptor.php    
Query:       `http://[server-domain]/API/descriptor.php`    
 * by_country.php  
Query:       `http://[server-domain]/API/by_country.php?countryIDs=[CID]`, where [CID] is the CID corresponding to the desired country/region.  
 * by_stat.php  
Query:       `http://[server-domain]/API/by_stat.php?statID=[ID]&year=[year]`, where [ID] is the enumerated value from the stat reference list, and [year] is the year desired.  

##2.3 : Module Architecture

The module architecture is defined in section 2.0 : Files. It can be seen visually in the diagram in FrontEndBlockDiagram.png.

##2.4 : Data Structure Specifications

###2.4.0 : ASDS

The area selection data structure is defined below:

When a country/region's data is returned from by_country.php, it is sent to the ParseData(json) function of client_parser.js. When parsed data is returned from client_parser.js, it is returned as a 2D array, indexed as a 2D array `node.data[x][y]` (member `data` of `node`).

For data `node.data[x][y]`,  
 * `x =` stat ID, where each row stat values in `y` indexed by `x` is the time series for the stat corresponding to stat ID in the stat reference list.
 * `y =` stat value for the stat corresponding to statID at time `t = y + 1980`.

This 2D array is a data member of an ASDS node, which also includes CID, CC2, and name of the relevant country/region. It is defined in data.js as:  
`function t_AsdsNode(cid, cc2, name, data)`  
`{`  
&nbsp;&nbsp;&nbsp;&nbsp;`this.cid = cid;`  
&nbsp;&nbsp;&nbsp;&nbsp;`this.cc2 = cc2;`  
&nbsp;&nbsp;&nbsp;&nbsp;`this.name = name;`  
&nbsp;&nbsp;&nbsp;&nbsp;`this.data = data;`  
&nbsp;&nbsp;&nbsp;&nbsp;`this.next = null;`  
`}`  

The ASDS is a singly-linked list of ASDS nodes. It is defined in data.js as:  
`function t_DataList()`  
`{`  
&nbsp;&nbsp;&nbsp;&nbsp;`this.size = 0;`  
&nbsp;&nbsp;&nbsp;&nbsp;`this.start = null;`  
&nbsp;&nbsp;&nbsp;&nbsp;`this.end = null;`  
`}`  
Each member pointer is initialized to null, but will point to ASDS nodes as they are added to the list.

###2.4.1 : Lookup Table Structure

The structure of the lookup table is a 2D array, defined in lookup_table.js by the table generation function as:  
`function CreateTable(cc2, name, size)`  
`{`  
&nbsp;&nbsp;&nbsp;&nbsp;`g_LookupTable = new Array(size);`  
&nbsp;&nbsp;&nbsp;&nbsp;`for (i = 0; i < size; i++)`  
&nbsp;&nbsp;&nbsp;&nbsp;`{`  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`g_LookupTable[i] = newArray(3);`  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`g_LookupTable[i][0] = cc2[i];`  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`g_LookupTable[i][1] = name[i];`  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`g_LookupTable[i][2] = 0;`  
&nbsp;&nbsp;&nbsp;&nbsp;`}`  
`}`  

After the lookup table is initially created, its HMS values are replaced by real HMS data.

For `g_LookupTable[x][y]`:
 * `x =` CID
 * `y =` CC2 if `y = 0`, name if `y = 1`, or HMS value if `y = 2`.

#Section 3

##3.0 : Use cases

The obvious use case of this program is for the purposes of composing vaccine deployment strategies. As our target audience, making sure WHO can effectively use our platform to inform policy decisions is our most important goal.

Secondary, but no less important, is the utility of our platform as a research tool. Researchers in epidemiology and the study of infectious diseases can benefit greatly from the ability to transparently visualize and compare this data.

As an external use case, we may also consider that as a public platform, the availability of this data in an unprecedented clarity can be a valuable tool for informing public perception of disease and the spread of epidemics, as well as increasing public awareness of the state of the problem worldwide.

Luckily, these three use cases are not mutually exclusive, and won't require much in the way of specific attention to one that would not satisfy all at once.

##3.1 : How to Satisfy Use Cases in the UI

To satisfy these use cases and deliver the ideal user experience, we must:

 * Deliver an easy to use and easy to understand interface
 * Allow the user to quickly and easily make an area selection
 * Quickly display graphs of area selection data in a way that makes the area selection and graph generation feel strongly connected, to avoid confusion
 * Allow the user to easily understand which stats are being displayed, for which countries, over what period of time
 * Display graphs in a way where the data is easily understood, without giving the ability for the user or the program itself to misrepresent data for political, malicious, or otherwise negative purposes

##3.2 : Features of the UI

 Our UI includes a loading screen, during which the loading script is run. Once this is done, the user can click a button to begin, and the loading screen slides down to reveal the main screen, which includes:  
 * A map of the world, from which a user can make an area selection.  
 * A control panel, which contains the following:  
&nbsp;&nbsp;&nbsp;&nbsp;- The Dav3i logo  
&nbsp;&nbsp;&nbsp;&nbsp;- A search bar for finding individual regions and adding them to the area selection  
&nbsp;&nbsp;&nbsp;&nbsp;- A tab for each stat, generated from dynamic_markup.js  
&nbsp;&nbsp;&nbsp;&nbsp;- A section on which graphs are generated  
&nbsp;&nbsp;&nbsp;&nbsp;- A button to extend the graph section  
 * A footer, which includes links to contact information and a legal notice with a link to a copy of the GPL.  

##3.3 : User Experience and Paths of Action

The UX is defined in UserExperience.png. The 'default' block points to default settings values.

##3.4 : Input Handing

The front end receives 2 types of input:  
 * Mouse input, in the form of country/region selection, settings changes, and various minor actions
 * Keyboard input in the search box

Mouse input is handled differently in each context. In country/region selection, each country/region is selected by clicking it once, toggling the country/region to selected. After a country/region is selected, one can deselect it either by clicking the individual country/region again, or by deselecting the whole area selection by clicking the "clear selection" button in the settings. Settings changes are primarily checkboxes, which function in the way conventionally seen on a website. They can be toggled on and off by a click of the mouse. In certain contexts, some boxes will be grayed out and uncheckable (e.g. including bounds when multiple countries' data is displayed). There are also radio buttons for selecting HMS, which function in such a way that only one of a set is selectable at a time. There is also a slider for selecting timespan, with either end draggable by the mouse, and a second slider with 1 draggable part that selects HMS year.

Keyboard input requires a more secure approach. Input is parsed and sanitized before it is used, to avoid malicious or otherwise unpredictable behavior. *section to be expanded as test plan is developed*.

#Section 4

##4.0 : Major Design Decisions

###4.0.0 : Architecture  
 * Platform: We chose a web platform both due to the client's vision of the product, and its inherent accessibility across many platforms. In future releases, we plan to extend functionality to mobile platforms.
 * Languages: HTML5/CSS/JavaScript were obvious choices, as they are the de facto technologies of the world wide web. HTML5 was chosen in particular for its ability to generate complex functionality quickly, though it potentially will limit functionality in older browser versions. We saw this as a manageable risk, particularly due to the well equipped nature of our target market.
 * Third Party Resources: Google Charts API and jVectorMap were chosen for their performance and feature sets, as well as their ease of use under the terms of the GPL.

###4.0.1 : Data Structures  

####4.0.1.0 : ASDS:

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

####4.0.1.1 : Lookup Table Structure:

The lookup table structure was chosen for its simplicity in being able to index CC2, name, and HMS value for each region by its CID.

####4.0.1.2 : Stat Reference List:

The stat reference list's setup as a 1D array is ideal as it is easily used to enumerate the indices of parsed data contained in ASDS nodes, allowing each module to correctly interpret the data.

####4.0.1.3 : CID Reference List:

The CID reference list's setup as a 1D array is ideal because it can easily be used to retrieve CC2's and names from the lookup table to create ASDS nodes.

### 4.0.2 : UX  

*discarded UX design*  
 * Checkboxes, radio buttons, and a slider were chosen for the settings menu, as they are a simple interface to toggling, selection of one from a set, and selecting a timespan, which are the fundamental requirements of the menu.  
 * Toggle selecting country/region was chosen as a bit of an accident. Originally, we had the idea to select one country/region by clicking, and ctrl+click to add to the list, or simply click to start a new one. However, we saw in implementing map.js that toggling was a much better experience in interfacing with the map, so we used that. To remove the hassle of untoggling every country when selecting a new area selection, we added a "clear selection" button.  
 * Based on eyetracking studies, most of the user's attention focuses to the left side of the page. Thus, we decided to put the graphs on that side, and put the easily viewable map on the right. This way, the user is able to focus on the data as it is presented, rather than being distracted by the map being overprominent.  
*end of discarded design*  

###4.1 : Bug History

 * \#2: Map objects do not set data correctly  
First Reported: March 23, 2015  
Status: Fixed March 25, 2015  
Description: When map object values are set using map.series.regions[0].setValues(), values are uniformly set as NaN, making heat map coloring and hover tip impossible.  
Reason for bug: jVectorMap seems to need at least a few regions to have initial input values set at map initialization as attributes (map{series{regions{values:{}}}}) for dynamic value setting and recoloring to work.  
Description of fix: Added initial values for a few countries at map initialization.  
Additional Notes: It seems maps.series.params.min is set using the initial values, causing some regions to color the same as if their values are NaN. To alleviate this, min is set manually to 0. It is unclear if max shares the same problem, but eventually it may be best to manually set both min and max based on each new HMS data set. Still unsure of predicted behavior when values are reset using map.series.regions[0].setValues(), though it should work.  

 * \#1: Map does not work correctly in Firefox  
First Reported: March 5, 2015  
Status: Fixed March 15, 2015  
Description: When the map is made visible, only a small unselectable vector image appears in the section, rather than the full selectable map.  
Reason for bug: Firefox doesn't process jVectorMap correctly when the map container is initially hidden. As the main page is hidden before the loading screen is removed, this triggered the bug.  
Description of fix: Set up main page to be visible initially, by layering the loading screen on top of the main page and simply hiding the loading screen to show the main page when needed.  
Additional Notes: N/A
