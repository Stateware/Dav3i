#Project Architecture

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
 * 1.2 : Third Party Resources  
 * 1.3 : Build Infrastructure  

Section 2  
 * 2.0 : Files  
 * 2.1 : Database Schema  
 * 2.2 : Upload  
 * 2.3 : Data Pull  

Section 3  
 * 3.0 : Files  
 * 3.1 : Client/Server Interface  
 * 3.2 : API Call Syntax  
 * 3.3 : Module Architecture  
 * 3.4 : Data Structure Specifications  
&nbsp;&nbsp;&nbsp;&nbsp;3.4.0 : ASDS  

Section 4  
 * 4.0 : Use cases  
 * 4.1 : How to Satisfy Use Cases in the UI  
 * 4.2 : Features of the UI  
 * 4.3 : User Experience and Paths of Action  
 * 4.4 : Input Handling  

Section 5  
 * 5.0 : Major Design Decisions  
&nbsp;&nbsp;&nbsp;&nbsp;5.0.0 : Architecture  
&nbsp;&nbsp;&nbsp;&nbsp;5.0.1 : Data Structures  
&nbsp;&nbsp;&nbsp;&nbsp;5.0.2 : UX  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5.0.2.0 : Control Panel  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5.0.2.1 : Map  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5.0.2.2 : Main Screen Layout  
 * 5.1 : Changes From v1.0  
 * 5.2 : Bug History  

#Section 0

##0.0 : Introduction

This document describes the overall project design of Dav3i, the Stateware project begun in the Spring 2015 semester. 

The following subsection defines commonly used language in the document, as a reference to ensure that the document is as concise as possible.

Section 1 defines the requirements of the project, and high level constructs that will be used to meet these requirements, including the platform, high level architecture, languages used, build infrastructure, and any third party plugins, APIs, or other resources.

Section 2 defines the low level architecture of the back end, including the necessary files for the back end, the database schema, the specification of interaction between modules, specific data structures that are used, and available methods of performing CRUD operations on the database.

Section 3 defines the low level architecture of the front end, including the necessary files for the front end, the interface to the server, the specification of interaction between modules, and specific data structures that are needed.

Section 4 defines the use cases and how we satisfy them, features of the user interface, and the possible paths of action a user may take in interacting with the program.

Section 5 defines major design decisions, including previously specification of discarded design components since the last release and rationale for discarding them, a change log from the previous release, and a bug history for the front end.

##0.1 : Definitions

###0.1.0 : High-level Components

**back end** refers to all code in /API/ or any program processes that take place on the server or database as opposed to on the endpoint user's machine.

**build insfrastructure** refers to all scripts and behavior executed by SemaphoreCI when a new commit is pushed to the repo.

**compact view** refers to the default state of the UI, where the control panel takes up the left ~30% of the page.

**expanded view** refers to the state of the UI when the control panel is expanded to take up the whole page.

**front end** refers to index.html, all code in /GUI/, all assets and stylesheets in /res/, the program's user interface, and any background processes that take place on the user's machine, as opposed to on the server or database.

**loading screen** refers to the entry point of the program at index.html, during which the intitial data pull is run.

**main screen** refers to screen advanced to from the loading screen after completion of the intitial data pull.

**UI** refers to the organization of screen elements and setup of user interaction processes to facilitate interaction with data.

**upload utility** refers to the database upload utility at upload.html.

**UX** or **user experience** refers to user interaction with screen elements as a way of interacting with data. To differentiate from UI, this more accurately refers to *how* the user interacts with the UI.

###0.1.1 : Elements

**area selection** refers to the complete list of selected regions for which graphs are desired.

**bounds** refers to the upper and lower bounds of stats whose values are estimated.

**control panel** refers to the section of the page which includes graphs, stat selection tabs, and the settings button.

**graphs** refers to the graph or graphs drawn to represent the values of the selected stat for an area selection over the selected timespan.

**heat mapped stat** or **HMS** refers to the data set for which values are used to color the heat map. This is equivalent to the data for all countries for the selected stat for a single year.

**HMS year** refers to the year for which HMS is desired.

**hover tip** refers to the text area that shows up when the user hovers over a region, containing the region's name, the currently selected stat, and the stat value.

**map** refers to the region-selectable map component of the UI.

**region** refers to 1 distinct and indivisible region for which a single set of stats exists in the database.

**selected stat** refers to the currently selected stat whose values are used to draw the graphs and color the map.

**selected timespan** refers to the currently selected time interval for which graphs are wanted.

**stat** refers to any of the measured statistics graphed by the program.

**subdiv** refers to any of the divs generated in the control panel to accomodate graphs.

**timespan** refers to the time interval for which data is available.

###0.1.2 : Processes

**back end scripts** refers to all .php files in /API/.

**data pull** refers to the process of querying the server for region data.

**data preparation** refers to the process of using the global data object to populate a data table that is graphable.

**data upload** refers to the process of uploading new data to the server.

**expand/shrink** refers to the expansion or shrinking of the control panel between expanded and compact view.

**front end scripts** refers to all .js files in /GUI/.

**graphing** refers to the process of displaying the data contained in a prepared data table.

**HMS refresh** refers to the process of replacing the values tied to each vector object on the map and recoloring them accordingly.

**index selection** refers to the process of selecting a data set index from a given stat's menu (or selecting a stat or index from the custom tab menu), and the way the application handles this action.

**region selection** refers to the process of selecting a region from the map, and the way the application handles this action.

**tab population** refers to the process of iterating through the stat list and populating a list of tabs based on the information presented.

**tab selection** refers to the process of selecting a tab from the menu, and the way the application handles this action.

###0.1.3 : Identifiers

**CC2** refers to a unique 2 character code used to refer to a region.

**CC3** refers to a unique 3 character code used to refer to a region.

**CID** refers to the unique integer ID used to refer to a region.

**data set index** refers to the numeric index which tags a single uploaded data set for a particular stat. For example, if you have a single stat, for which 4 separate sets of data exist for the same disease, then you will have data with data set indices 0 through 3 in your table.

**disease** refers to the disease data set for which a stat is relevant. If relevant for all stats, an input data set's disease is 'shared'.

**graph type** refers to the type of graph desired by the user. The graph type can fall under any of the 3 following types:  
 * each region graphed in separate graphs with bounds
 * each region graphed together on a single graph without bounds
 * each region graphed together as a sum (representing stat for whole area selection) with bounds

**name** refers to the name of a region.

**stat ID** refers to a stat's index in the stat reference list.

**stat name** refers to the name of a given stat, also used as a label for graphs and as part of the hover tip when that stat is the selected stat.

**stat type** refers to the type of a given stat, with each possible value corresponding to a particular approach when manipulating the data and graphing. The possible values are:  
 * 'lin' : line graph (known or recorded values)
 * 'bar' : bar graph (known or recorded values)
 * 'est' : estimated graph (estimated values; renders as line graph with confidence interval)
 * 'int' : integrated stats (2 or 3 stats which have a tab specifically devoted to graphing them together)

###0.1.4 : Data

**area selection data** refers to the entire set of data stored for an area selection.

**area selection data structure** or **ASDS** refers to the list structure used to store area selection data (defined in section 2.4.0).

**ASDS node** refers to a single node of the ASDS list, containing region data, metadata, and a pointer to the next node of the list.

**data set tag** refers to a text tag that is attached to a data set when it is being inputted

**region data** refers to the data set (all stats for all possible times for all possible data set indices) for a single region and the associated metadata, in JSON format.

**stat list** refers to the 'stats' value of the object returned from get_data.php

**stat value** refers to the value of 1 stat for 1 region for 1 data set index at 1 particular time.

###0.1.5 Build Related Terms

**app-wide css** refers to any stylesheets that apply over the entire application, and not just one page.

**automatic push** refers to the automatic github push that takes place at the end of the build that replaces logs and production files.

**cleaning** refers to the removal of old versions of log and production files.

**concatenating** refers to the end to end joining of css and js files with their counterparts specified in package.json.

**external css** refers to stylesheets linked from externally created sources stored locally.

**external libraries** refers to scripts linked from externally created sources stored locally.

**gruntfile** refers to the file that specifies configurations for Grunt.

**inline scripts** refers to scripts which are written inline in the document (but inside the link module).

**internal libraries** refers to any script files that apply over the entire application, and not just one page.

**linting** refers to static code analysis for js and css modules.

**link module** refers to the block of js, css, and other resource linkages written into the document.

**logging** refers to the recording of output from linting, minifying, testing, and production building into the log folder during a build.

**minifying** refers to the process of reducing file size for js and css files by removing whitespace and replacing variable names with shorter ones.

**package.json** refers to the file the holds all metadata for use by the gruntfile and production building scripts.

**page-specific css** refers to any stylesheets that relate only to a particular page.

**page-specific scripts** refers to any script files that relate only to a particular page.

**production building** refers to the reading of sources in the link module, the creation of production ready resources from those sources, and the creation of a page that links to the production ready resources. The end result of production building is a /prod/ folder that contains the application in its entirety, ready to be ported to the appropriate document root on the server.

**remote linkages** refers to any resources linked into the document from outside URLs.

**testing** refers to the automatic test scripts that are run during a build.

#Section 1

##1.0 : Requirements

Each year, the World Health Organization makes strategic decisions for the deployment of Measles vaccines worldwide. At present, these decisions are based on the comparison of large data sets on statistics associated with the Measles virus worldwide. At present, these data sets are compared by generating graphs in a slow and error prone case by case process. This project aims to address the inefficiencies and inaccuracies of this approach by providing an accessible and transparent platform with which to visualize this data, the results of which will be a more effective approach to vaccination strategy worldwide.

In the process of accomplishing this, we utilize a front end interface that interacts with a back end server.

The front end must:

 * Provide an easy to use interface for displaying desired area selection data
 * Upon area selection, render graphs of that area's relevant data quickly and responsively
 * Allow user multiple ways to interface with and compare data

Necessary data for each area selection:

 * Birth Rate
 * Death Rate
 * Population
 * Vaccinations (routine and periodic mass vaccinations)
 * Observed Measles Cases
 * Estimated Measles Cases
 * Estimated Mortality Rate

##1.1 : Platform/Architecture

The client side application is a web page (HTML/CSS document), which runs JavaScript and communicates with our server using AJAX PHP function calls. Due to the varying nature of web platforms, we define that our target will be functionality on the following browsers:  
 * Firefox 3.0 and up
 * Chrome 5.0 and up
 * Internet Explorer 8 and up

On the back end, our software is PHP scripts utilizing a MySQL database. The server itself runs Ubuntu and Apache 2. The database administration is accomplished using phpmyadmin.

We also have the upload utility, which allows en masse data uploads.

##1.2 : Third Party Resources

In building the front end, we utilized Google Charts API to generate graphs, and jVectorMap to generate the map.

##1.3 : Build Infrastructure

Our build infrastructure is supported by SemaphoreCI. On each push to the github repository, a web hook allows SemaphoreCI to pull our files, and automatically run some scripts that we define. If any of these scripts return with a value other than 0, the build fails. This simple property allows us to powerfully and agilely unit test, perform static code analysis, and create production versions of the software frequently.

We automate most tasks using Grunt, a task automater created using Node.js, server side javascript. The rest are primarily build modules written in Python.

###1.3.0 : Static Code Analysis

The build starts by performing static code analysis on all of the js and css files, including the gruntfile. If these pass, control passes to testing. Lint logs are placed in the /log/ folder.

###1.3.1 : Testing

As of now, testing is entirely composed of front end javascript testing using QUnit, a javascript assertion library. It is recommended that the team integrate back end tests, and actually include build scripts to set up the back end on Semaphore's build machine, along with a test DB, in order to test the MySQL CRUD operations, as well as integrating the existing back end tests written by the v1.0 team. Test logs are placed in the /log/ folder.

###1.3.2 : Production Building

Production building starts by processing the link module of each page (list of pages specified in package.json), and then pulling out all relevant sections in order to perform concatenating and minifying of relevant sources, and placing the results in the /prod/ folder. The scripts then replace the link module with links to the production ready files and place the output page files into the /prod/ folder. Production building logs are placed in the /log/ folder.

#Section 2

##2.0 : Files

**toolbox.php**

toolbox.php contains basic atomic functions for error handling and relevant constants for the backend.

**connect.php**

connect.php contains the function used to instantiate a connection to the database.

**api_library.php**

api_library.php contains all relevant functions for processing CRUD operations to the database.

**data_parser.php**

data_parser.php contains the runtime code for processing the input to any of the forms from upload.js. More pointedly, this file parses input data and places it in the database.

**get_data.php**

get_data.php contains the runtime code for creating and returning a fully formed data object, containing an organized JSON dump of the database.

##2.1 : Database Schema

Our database schema consists of 5 metadata tables, as well as a data table for each individual stat created by the uploader.

###2.1.0 : Metadata

**meta\_stats**

This table contains metadata for all stats in the database. Each row contains the following fields:

 * table_id : this field is a numeric key representing the stat
 * display_name : this field is a string which reflects how the stat is written client side
 * table\_name : this field is a string which is the same as the name of the table in which this stat's data resides. If the stat type is 'int', a table with this table name does not actually exist, but its data is composed of 3 other stats, specified in meta\_int.
 * type : specifies stat type, as defined in section 0.0.3
 * disease : specifies disease, as defined in section 0.0.3
 * indices : specifies data set index, as defined in section 0.0.3

**meta\_countries**

This table contains metadata for all countries. Each row contains the following fields:

 * country_id : CID
 * cc2 : cc2
 * cc3 : cc3
 * common_name : name

**meta\_int**

This table contains metadata for all integrated stats, linking together their combined data sets. Each row contains the following fields:

 * data\_set\_index : data set index for the combined data set
 * display_name : stat name for the combined data set
 * disease : disease for this stat
 * stat1id : table_id for the first linked stat
 * stat2id : table_id for the second linked stat
 * stat3id : table_id for the third linked stat. -1 if only 2 stats are integrated this row.
 * stat1index : this stat's data set index for the first linked stat
 * stat2index : this stat's data set index for the second linked stat
 * stat3index : this stat's data set index for the third linked stat. -1 if only 2 stats are integrated this row.

**meta\_indices**

This table links particular data sets to their text tags specified by the user. Each row contains the following fields:

 * stat\_index : table\_id for this stat
 * data\_set\_index : data set index for this stat data set
 * tag : uploader specified text tag for this stat data set

**meta\_diseases**

Simply a list of all diseases. There is one field per row, 'disease'.

###2.1.1 : Data Tables

Each data table has rows containing the following fields:

data\_set\_index : data set index for this particular row
country_id : CID for this particular row

Each table will also contain fields for each year for which data exists, with the field names containing a prefix, 'y\_' (e.g. y\_1980, y\_1981, etc.). The values of these fields are the stat values for those years.

The names of these tables all start with 'data_', then are followed by up to the first 5 characters of the stat's disease, then another underscore, then the display name in lowercase without spaces.

##2.2 : Upload

Data uploading is handled client side by the page upload.html, and the accompanying menu script upload.js. By selecting a stat type to upload, the menu changes to fit the specifications of that particular stat. By filling in the required fields, we then pass those on to data_parser.php, which then reads, normalizes, and writes the data to the database.

##2.3 : Data Pull

The data pull is considerably more complex. In order to deliver a sensibly organized data set to the client with some level of versatility, there is some redundancy in the returned object.

The returned object includes the following fields:

 * firstYear : first year for which data is available
 * lastYear : last year for which data is available
 * diseases : list of diseases
 * stats : list of stats (all objects, defined later in this section)
 * countries : list of region names, indexed by their cc2
 * country_data : list of data objects, index by each country's cc2 (all objects, defined later in this section)

The stat objects are indexed by their table names, (including int stats, but excluding their component stats) and contain the following fields:

 * name : stat name
 * subName : names of component stats for int stats, or upper/estimated/lower for est stats, else 'none'
 * disease : disease for this stat
 * indices : number of data sets for this stat
 * type : stat type
 * subType : types of component stats for int stats
 * tags : text tags for all data sets for this stat

The data objects are indexed by cc2, which in turn have each stat indexed by their table names, (including int stats, but excluding their component stats) which themselves include all metadata from the corresponding stats objects, in addition to:

 * firstYear : first year for which data is available for this stat
 * lastYear : last year for which data is available for this stat
 * data : data for this stat, itself an object (specified later in this section)

Each country stat's data object is an array of row objects. Each row object has an "index" field and a "values" field. index is the data set index for this particular set of values.

The values field can be simply a row pulled from the database (lin and bar stats), an array of 3 rows (est stats), or an array of 3 additional row objects (int stats, each index field is attached to the component stat)

#Section 3

##3.0 : Files

**index.html**

index.html is the markup for the main page.

**upload.html**

upload.html is the markup for the upload utility.

**reset.css**

reset.css standardizes all program defined style across browsers and platforms.

**forms.css**

forms.css is the stylesheet for the upload utility.

**style.css**

style.css includes style for the main page.

**data.js**

data.js is a JavaScript data module that contains all global variables needed across the program.

It also includes the function prototype for the ASDS nodes and list, as well as insertion to and deletion from the list. (defined in section 2.4)

**data_pull.js**

data_pull.js is a front end script that includes functions for HMS refreshing, data pulling, and building the ASDS list.

**settings.js**

settings.js is a front end script that controls timespan, HMS year, index selection, and custom stat selection.

**map.js**

map.js is a runtime front end script specific to index.html, which instantiates g_Map as a jvectormap object with some options specified in the file.

**graph.js**

graph.js is a front end script that includes functions for data preparation and graphing.

**dynamic_markup.js**

dynamic_markup.js is a front end script that includes functions for tab population, subdiv population, and other small data driven markup related things.

##3.1 : Client/Server Interface

The front end interacts with the back end using 2 AJAX php calls:  
 * get_data.php : constructs and pulls global data object
 * data_parser.php : posts form data to upload data to database

##3.2 : API Call Syntax

 * get_data.php    
Query:       `http://[server-domain]/API/get_data.php`    
 * data_parser.php  
Query:       `http://[server-domain]/API/data_parser.php?type=[type]`, where [type] is the stat type.  

##3.3 : Module Architecture

The module architecture is defined in section 2.0 : Files. It can be seen visually in the diagram in FrontEndBlockDiagram.png.

##3.4 : Data Structure Specifications

###3.4.0 : ASDS

The area selection data structure is defined below:

`function t_AsdsNode(cc2, name, data)`  
`{`  
&nbsp;&nbsp;&nbsp;&nbsp;`this.cc2 = cc2;`  
&nbsp;&nbsp;&nbsp;&nbsp;`this.name = name;`  
&nbsp;&nbsp;&nbsp;&nbsp;`this.data = data;`  
&nbsp;&nbsp;&nbsp;&nbsp;`this.next = null;`  
`}`  

The cc2 and name fields are the cc2 and name of the region, while the data field is the same as the object in country_data indexed by cc2.

The ASDS list is a singly-linked list of ASDS nodes. It is defined in data.js as:  
`function t_DataList()`  
`{`  
&nbsp;&nbsp;&nbsp;&nbsp;`this.size = 0;`  
&nbsp;&nbsp;&nbsp;&nbsp;`this.start = null;`  
&nbsp;&nbsp;&nbsp;&nbsp;`this.end = null;`  
`}`  
Each member pointer is initialized to null, but will point to ASDS nodes as they are added to the list.

#Section 4

##4.0 : Use cases

The obvious use case of this program is for the purposes of composing vaccine deployment strategies. As our target audience, making sure WHO can effectively use our platform to inform policy decisions is our most important goal.

Secondary, but no less important, is the utility of our platform as a research tool. Researchers in epidemiology and the study of infectious diseases can benefit greatly from the ability to transparently visualize and compare this data.

As an external use case, we may also consider that as a public platform, the availability of this data in an unprecedented clarity can be a valuable tool for informing public perception of disease and the spread of epidemics, as well as increasing public awareness of the state of the problem worldwide.

Luckily, these three use cases are not mutually exclusive, and won't require much in the way of specific attention to one that would not satisfy all at once.

##4.1 : How to Satisfy Use Cases in the UI

To satisfy these use cases and deliver the ideal user experience, we must:

 * Deliver an easy to use and easy to understand interface
 * Allow the user to quickly and easily make an area selection
 * Quickly display graphs of area selection data in a way that makes the area selection and graph generation feel strongly connected, to avoid confusion
 * Allow the user to easily understand which stats are being displayed, for which countries, over what period of time
 * Display graphs in a way where the data is easily understood, without giving the ability for the user or the program itself to misrepresent data for political, malicious, or otherwise negative purposes

##4.2 : Features of the UI

 Our UI includes a loading screen, during which the loading script is run. Once this is done, the user can click a button to begin, and the loading screen slides down to reveal the main screen, which includes:  
 * A map of the world, from which a user can make an area selection.  
 * A control panel, which contains the following:  
&nbsp;&nbsp;&nbsp;&nbsp;- The Dav3i logo  
&nbsp;&nbsp;&nbsp;&nbsp;- The search bar  
&nbsp;&nbsp;&nbsp;&nbsp;- Stat selection tabs  
&nbsp;&nbsp;&nbsp;&nbsp;- Dropdown menus for index selection and for custom stat selection  
&nbsp;&nbsp;&nbsp;&nbsp;- Graph section  
&nbsp;&nbsp;&nbsp;&nbsp;- A button to extend the graph section  
 * A footer, which includes links to contact information and a legal notice with a link to a copy of the GPL.  

##4.3 : User Experience and Paths of Action

The UX is defined in UserExperience.png. The 'default' block points to default settings values.

##4.4 : Input Handing

The front end receives 2 types of input:  
 * Mouse input, in the form of region selection, stat selection, settings changes, and various minor actions
 * Keyboard input in the year selections

Mouse input is handled differently in each context
 * In region selection, each region is selected by clicking it once, toggling the region to selected. After a region is selected, one can deselect it either by clicking the individual region again, or by deselecting the whole area selection by clicking the "clear selection" button.
 * Stat changes are done by selecting a tab that corresponds to a given stat. When the user selects a stat, the map recolors based on the values of that stat at year g_HMSYear. The graphs also refresh to reflect the selected stat if any regions are selected.
 * Settings changes (mouse input specifically, so excluding year changes) consist of radio button or dropdown menu selections, which modify enumerated selection variables (g\_GraphType and g\_IntHMS) or data set indices.
 * Minor actions include clicking the "settings" button (which brings up the settings menu, which can be closed by clicking the black background or the "close" button) and clicking the view expand button (which results in switching to expanded view if in compact view, and vice versa).

Keyboard input requires a more secure approach. Because the text boxes we have currently in the application limit the size of user input (4 characters), we do not see the need to further security. However, in the future when we implement a search bar, this will be a much more important consideration.

The year change inputs function as follows:
 * the user types an input and sets it either by clicking the "apply" button or closing the settings menu.
 * if it is valid, the action completes successfully and change is applied.
 * if it is not valid, the location of the error is highlighted and the user can not continue until putting in valid input.

#Section 4

##5.0 : Major Design Decisions

###5.0.0 : Data Structures

We originally went with a much more complicated (though more tightly structured) approach with respect to data structures, but the new approach employs a much more thoughtful use of the power of javascript objects, and effectively uses the constant access property of fields, as opposed to the haphazard searching and set membership testing that put the old version of this platform in n^2+ territory.

###5.0.1 : UX  

####5.0.1.0 : Control Panel

The design of the control panel was chosen so that a lot of functionality could fit into the small area allotted to it, while allowing the user to expand it out. The tab selection was chosen so that heat mapping and graph selection could be done easily and transparently. We also chose to give the user the option to scroll through the available stats so that any stat could be selected to heat map in the compact view. We also wanted to include a logo, so we put that on top with the settings menu link.

####5.0.1.1 : Map

The map was chosen from the available vectors because it included more of the countries we needed, and the polygonal style made it easier to add the rest of them. The toggle selection on the map was chosen because that is the inherent functionality of jVectorMap. While this decision was made for us, we found that it made for a better user experience than what we had planned on. In order to make deselection easier, we added a clear selection button as well.

####5.0.1.2 : Main Screen Layout

The main screen layout was chosen because the original design left the map feeling claustrophobic and closed off due to the border sections surrounding it. Instead, the map now fills most of the screen. It is on the right side so that user attention is directed mostly toward the control panel when viewing data, as users generally look left when using web applications according to eye tracking studies.

####5.0.1.3 : Settings

The settings menu layout was chosen for 2 reasons:
 * The simplicity of selection from enumerated lists is most easily expressed in a UI by radio buttons.
 * Our ideal year selection element, a slider, introduced a lot of difficulty into our work, and text inputs were chosen instead. We may reinvestigate a slider in the future.

The custom toggles and regular stat index selections were chosen to be dropdown menus in light of their immediacy next to the graphs and how connected visually that feels to seeing the graphs change in response to changing these settings.

##5.1 : Change Log From Last Release

Since v1.0, the following large scale changes have been made:

 * introduction of CI and build infrastructure using SemaphoreCI
 * overhaul of the back end database and CRUD operation architecture
 * overhaul of the front end to handle new global data format
 * introduction of data set index selection per stat, should allow easily for adding additional data sets for estimated stats
 * intoduction of 'custom' tab in order to compare 2 stats

##5.2 : Bug History

Please follow the following format when adding bugs to this history:

 * \#(enumerated id#): (Descriptive Name)
First Reported: (Month) (Day), (Year)
Status: (fixed, open, in progress, in reproduction)
Description: 
Reason for bug: 
Reproduction steps:
Description of fix: 
Additional Notes: 
