#Front End Architecture Document

#####Introduction to the Front End

The goal of our front end is to meet the needs of the user in interacting with data stored on the server. The user's must be able to select a country or region, and display relevant data pulled from the server. We accomplish this by building a webpage in HTML5, using Google Charts API, and JSVectorMap.

HTML5 was chosen based on its portability, and ease of use in implementing complex features. In the interest of maintenance, the fact that use of and support for HTML5 is growing gives it a clear advantage over HTML/CSS/JS.

Google Charts API was chosen primarily because it includes the features we need, and showed a clear performance advantage over other APIs considered in quickly generating high quality graphs. In addition, it is free to use under the GPL, and ostensibly seemed to have a low learning curve for our engineers.

JSVectorMap was chosen based on available online demos, in which we observed that it included many user oriented features that would allow us to more easily and more efficiently implement a high quality user interface.

#####Requirements

The front end must:

 * Provide an easy to use interface for selecting one or more countries/regions
 * Upon country/region selection, fetch all relevant data from server
 * Use received data to generate easily readable and comparable graphs

Necessary data:

 * Birth Rate
 * Death Rate
 * Population
 * Vaccinations (routine and periodic mass vaccinations)
 * Observed Measles Cases
 * Estimated Measles Cases
 * Estimated Mortality Rate

#####Features of the Main Page

The Main Page includes:
 1. A map of the world. This map is colored according to the current state of a selected stat, from green to blue to yellow. In other words, each country is heat mapped based on the value of this stat. By default, the stat is Estimated Measles Mortality.
 2. A search bar. This is used as an secondary way of selecting a country or region.
 3. A settings menu. This includes a toggle for turning on and off upper and lower bounds on stats that include them, as well as toggles for showing each stat. This menu also includes a seek bar for manipulating the timespan shown, and a selection for which stat is represented on the heat map.
 4. Graphs of all stats selected within the specified timespan. By default, the timespan is 1980 to present, and the stats shown are (TBD).

#####Local Data Setup

The Front End stores data in four separate parts:
 1. The Lookup Table
 2. Country/Region Data
 3. Queried CIDs
 4. Settings

The Lookup Table includes the following for each country: 
 1. Country ID (CID)
 2. CC2 code 
 3. Country Name
 4. Current data for default Heat Mapped Stat (HMS)
The Lookup Table exists so that for a selected country or region, a CC2 code can used to find its corresponding CID in order to query a server, and its name can be found to display over the relevant graphs. It also includes data for 1 trend for 1 year, to be used to color the map based on its value (heat map).

Country/Region Data refers to the data stored locally after parsing a country/region's (or many) JSON object(s) after they are received from the server. Each time a new country/region selection is made, a new query is made to the server. Inbetween country/region selections, all data for selected countries/regions is stored client-side. The local data is stored as a 3D array A[x][y][z], where x indicates a particular stat, and y and z fit the following schemes:

**Scheme 0:** A[x][y][z]: Used for single country/region query, for stats that do not include bounds.
 * y is unused, but still exists in the data structure to ensure a uniform return type from the parser. The stat's value exists in the row y = 1, for uniformity with scheme 1.
 * z corresponds to the value of the stat at time = 1980 + z.

**Scheme 1:** A[x][y][z]: Used for single country/region query, for stats that include bounds. 
 * y corresponds to upper bound when y = 0, the stat's value when y = 1, and lower bound when y = 2.
 * z corresponds to the value of the upper bound, stat, and lower bound at time = 1980 + z.

**Scheme 2:** A[x][y][z]: Used for multiple country/region query.
 * y corresponds to country, enumerated based on the order in which it was queried. 
 * z corresponds to the value of the stat at time = 1980 + z.

For a single country/region, both schemes 0 and 1 will be used, with each being used dependent on whether the stat has upper and lower bounds.
For multiple countries/regions, scheme 2 will be used for all stats.

Queried CIDs is a 1D array that includes the last queried CIDs, to be used by the graphing function to interpret Scheme 2.

Settings is a masked int, for which each bit represents one of the toggles in the settings menu.

#####Front End Execution Timeline

**The Loading Screen:** Execution begins at the time when the user opens the page. The first image displayed is a loading screen, including logos for Stateware, the project, and the Ferrari Lab. The page also includes some animation to indicate loading, which changes to a button marked "Begin" when all loading is finished.

Loading includes pulling the Lookup Table from the server, as well as generating the map underneath the loading screen.

**The Main Page:** After the user advances to remove the loading screen, the user is shown the map, filling the screen. The user is given the option of changing settings, searching for a country, clicking on a country/region on the map, or dragging a box around multiple countries/regions. These actions have the following consequences:
 * Changing settings: At this point, the only change made by changing settings is to the masked int, in which each bit is toggled appropriately to the user's changes.
 * Searching for a country: Search results are returned for the user's query. At this point, the user may select a country/region (or multiple) from the results. After selecting an area, the map is moved to the left, and zooms on the selected area, while the client queries the server for that area's data. When the data is returned (in JSON format), the data is fed to a parser, which outputs the stats as arrays in terms of the above schemes. Then, that data is used to generate graphs for the selected stats. Note that which stats are shown, for which timespans, and whether they include bounds for those that have them, is based on the settings.
 * Clicking a country/region, dragging a box around multiple: This selects an area and executes the same actions as seen above with selection from the search bar.

The second state of the main page directly follows from the last 2 options. A selected area is shown on the left, with stats relevant to that area graphed on the right. From here, the user can select another area (by map or search), or change settings. These actions have the following consequences:
 * Changing settings: This has the effect of changing the masked int, as well as refreshing the onscreen graphs to include any newly selected stats, remove any unselected ones, add/remove bounds (for single country/region), change timespan, and change the layout of the graphs to accomodate them.
 * Selecting another area: This has the effect of moving the map to zoom on that area, from wherever the map currently shows, as well as pulling new data for that area from the server, and generating graphs based on it. Again, graph generation is based on settings.