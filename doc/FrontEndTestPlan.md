#Dav3i Front End Test Plan

###Table of Contents
 * 1.0 : Introduction  
 * 2.0 : Selection of Countries  
 &nbsp;&nbsp;&nbsp;&nbsp;2.1 : Specification Tests  
 &nbsp;&nbsp;&nbsp;&nbsp;2.2 : Combination Specification Tests  
 &nbsp;&nbsp;&nbsp;&nbsp;2.3 : Normal Operations Tests   
 &nbsp;&nbsp;&nbsp;&nbsp;2.4 : Pathological Tests   
 * 3.0 : Graph Visualization  
 &nbsp;&nbsp;&nbsp;&nbsp;3.1 : Specification Tests  
 &nbsp;&nbsp;&nbsp;&nbsp;3.2 : Combination Specification Tests  
 &nbsp;&nbsp;&nbsp;&nbsp;3.3 : Normal Operations Tests  
 &nbsp;&nbsp;&nbsp;&nbsp;3.4 : Pathological Tests     
 * 4.0 : Settings Changes  
 &nbsp;&nbsp;&nbsp;&nbsp;4.1 : Specification Tests  
 &nbsp;&nbsp;&nbsp;&nbsp;4.2 : Combination Specification Tests   
 &nbsp;&nbsp;&nbsp;&nbsp;4.3 : Normal Operations Tests  
 &nbsp;&nbsp;&nbsp;&nbsp;4.4 : Pathological Tests    
 * 5.0 : Customization of View  
 &nbsp;&nbsp;&nbsp;&nbsp;5.1 : Specification Tests  
 &nbsp;&nbsp;&nbsp;&nbsp;5.2 : Combination Specification Tests  
 &nbsp;&nbsp;&nbsp;&nbsp;5.3 : Normal Operations Tests  
 &nbsp;&nbsp;&nbsp;&nbsp;5.4 : Pathological Tests   
 
# 1.0 : Introduction  
 
This document will cover the black box UI/UX testing of DAV3I, a data visualization website created by STATEWARE. These tests will be derived from our high level design documents and the variety of user interaction documents on our Github. Please keep in mind that, like with all testing frameworks, this is not an exhaustive list. For a complete test, a code review is also necessary.  

This document is divided into four sections describing some main specifications of the front end--Selection of Countries, Graph Visualization, Settings Changes, and Customization of View. Each section will being with a series of Specification Tests, which ensures the functionality of the documented feature or group of features. The next group of tests are the Combination Specification Tests and Normal Operations Tests which describe use cases and modifications of the Specification tests. Lastly, there are Pathological Tests to be performed. These are a series of tests in which purposefully invalid and illogical inputs are used. These are simulating the worst-case scenarios and edge case user actions that would not fall in the typical range of normal operations.  

It should be noted that the sequence of testing these features is not important. What is important, however, is the completion of the Specifications before all other types of testing. This ensures baseline functionality.  

# 2.0 : Selection of Countries  

"Selection of Countries" represents the features of selection and de-selection of countries/regions on the generated map of the World.

## 2.1 : Specification Tests  

When the Dav3i client is launched, there is only 1 way to open it. This is by clicking the "Begin" button once it appears. 

After Dav3i is opened, there are 2 ways to select a country. These are:  

&nbsp;1. Moving the mouse to the desired country and clicking on it.  
&nbsp;2. Touching the desired country using a touchscreen.  

After the first country is selected, the same process can be used to select as many countries as desired.  

In absolute terms, as there are 205 countries/regions on the map that can be selected, this yields 2 X 205 = 410 test cases which are needed to exhaustively test this functionality. However, exhaustive testing for the most part is not economical and does not uncover potential problems in the code. In order to create a reasonable number of tests, it is reasonable to select a smaller subset of countries, as without loss of generality, country selection is uniform across the map.  

Once a number of countries are selected, in order to deselect a country, follow the same process as selecting a country, and the client will simply deselect the country in question.  

There are 3 ways to deselect all of the countries that have been selected. These are:  

&nbsp;1. Deselecting every country that is selected individually by touching them on a touchscreen.  
&nbsp;2. Deselecting every country that is selected individually by clicking them with a mouse.  
&nbsp;3. Pressing the "Clear Selection" button.  

In absolute terms, as there are 205 countries/regions on the map that can be selected, the same number of countries can be deselected. Therefore, this yields (2 x 205) + 1 test cases to exhaustively test the functionality of deselecting every country on the map. Much like selecting countries, this exhaustive test will not necessarily be the best testing plan to take, so it is reasonable to have a smaller subset of countries selected, and use that set of selected countries to test the functionality of deselecting.  

## 2.2 : Combination Specification Tests  

The Specification Tests previously mentioned should be run alongside other related Specification Tests. These "Combination" Specification Tests are different from the more general Specification Tests because they involve operations that are not considered normal operations, and are also not pathological in their nature. They are similar to the Specification Tests in that they make assumptions about the program and have steps in common with each other, but these tests do not follow a normal pattern of user experience. This being said, they do not involve "bad" or "faulty" input like Pathological Tests, they simply have abnormal sequences of the program operation, but with viable input.  

Some of these tests include, but are not limited to, the following:  

&nbsp;1. Select 3 countries by clicking on them with the mouse or touching them using a touchscreen. Deselect a single country using the same method, and then select a different country. Does the old country deselect properly and does the new country select properly?  

## 2.3 : Normal Operations Tests  

These "Normal Operation" Tests will run normal and expected sequences of "good" operations (with "good" inputs) into the program to make sure that normal user actions operate as expected. These tests will go into more detail than the Specification Tests, which primarily were used just to make sure the program works to begin with. These are different from the Pathological Tests, as these Normal Operation Tests deal with "good" inputs, not "bad" inputs like the Pathological Tests. Some of these tests include, but are not limited to, the following:  

&nbsp;1. If a country is repeatedly clicked or touched, will it select and deselect accordingly without problems?  
&nbsp;2. If the "Clear Selection" button is clicked while no countries are selected, what happens?  
&nbsp;3. If a set of countries are selected and the page is refreshed, are the countries deselcted?  


## 2.4 : Pathological Tests  

This group of tests will assess how the program reacts to bad sequences of user input. The term "bad" in this context pertains to selecting and deselecting countries. These tests should be run after the Specification Tests and the "Normal Operation" Tests. Similar to these tests, these Pathological Tests are not exhaustive, partially due to the nature of testing in general, but mainly because it would not be possible to create a completely exhaustive set of pathological tests.  

Despite these tests being non exhaustive, they will provide insight to how the program responds to conditions deemed as "extreme", or unintended by the implementors of the program. Since the previous tests show that the basic features other program are functioning correctly, any lower-level means of performing the following tests should be sufficient. Please note that these tests may have unpredictable and unknown results.  

Some pathological tests can be derived from asking the following questions:  

&nbsp;1. Can all 205 countries/regions be selected at once without problem? How long will it take to deselect them all with the "Clear Selection" button?   

&nbsp;2. Will right clicking the map bring up a menu? What happens if someone clicks an option on the menu?    

&nbsp;3. What happens when you try to touch multiple countries at once?  

**_These tests will not uncover all potential problems... only a full code review can ensure complete quality control._**  

# 3.0 : Graph Visualization  

"Graph Visualization" encompasses the features which allow the generation of the graphs of the proper type, the validation of the correct data with the graphs, and the number/correct type of graphs. These tests are performed under the assumption that the tests in the "Selection of Countries" section have all passed, as this feature depends on the ability to choose a country or countries. The tests about graph types other than Regional depend on certain aspects of the "Setting Changes" section tests to have all passed, namely the ability to change graph type.  

## 3.1 : Specification Tests  

Graphs can be of 3 types in Dav3i: Regional, Combined, and Whole Selection. For descriptions of these 3 graph types and their purposes, refer to the Front End Architecture Document on Github. 

**Overall Specification Tests**

1. As soon as a country is selected, a graph is generated. What is the default type for these graphs?

**Regional Graph Type Specification Tests**  

1. After a country is selected, a graph generates on the control panel to the left. If there are more graphs than available to be seen on the control panel, they will still generate below the current graphs and be accessible by scroll bar. Every selection of country will result in the other graphs being redrawn to scale with every other country. Also, every graph will have that country's respective name as its title.  

2. (As of 5/2/15) There are 7 tabs, and therefore statistics, to choose from. Clicking a new tab will regenerate the already generated graphs in order to fit the new statistics.   

3. Deselecting a country will result in its respective graph being removed and the other remaining graphs being redrawn to scale with every remaining countries selected. The remaining graphs will also move to accomodate the empty space, if there is any.   

**Combined Graph Type Specification Tests**  

1. After a first country is selected, a graph will generate on the control panel to the left. Any additional country selected will result in the one generated graph being regenerated with the additional line representing the new country's statistics.   
2. (As of 5/2/15) There are 7 tabs, and therefore statistics, to choose from. Clicking a new tab will regenerate the already generated graph and data lines in order to fit the new statistics.   

3. Deselecting a country will result in its respective data line being removed and the other remaining graphs being redrawn to scale with every remaining countries selected. If there are no more countries selected after the deselection of the above country, there will be no graph displayed on the control panel.  

**Whole Selection Graph Type Specification Tests**    

1. After a first country is selected, a graph will generate on the control panel to the left. Any additional country selected will result in the one generated graph being regenerated with the data line incrementing due to the new country's statistics.   

2. (As of 5/2/15) There are 7 tabs, and therefore statistics, to choose from. Clicking a new tab will regenerate the already generated graph in order to fit the new statistics.   

3. Deselecting a country will result in the current data line being decremented. If there are no more countries selected after the deselection of the above country, there will be no graph displayed on the control panel.   

## 3.2 : Combination Specification Tests  

This section is inherently tied with the above "Selection of Countries" section as the selection or deselection of a country will generate, modify, or remove a graph.  

## 3.3 : Normal Operations Tests  

1. What happens when multiple countries are selected and deselected? Are the graphs generated reflecting these actions?  

## 3.4 : Pathological Tests  

1. What happens if you select a large amount of countries which therefore results in a large amount of graphs being generated? How many graphs can we generate?  

2. With a large amount of graphs generated? How long will the redrawing take if we switch to a new tab?   

# 4.0 : Settings Changes  

"Settings Changes" encompasses the features which allow the user to change the heat map statistic, the vaccination statistic types, and the time span of generated graphs and the resulting changes to the map and the graphs due to these changes. All of these changes come from the settings menu within Dav3i. These tests also are written under the assumption that the above two sections, "Selection of Countries" and "Graph Visualization" have passed. 

## 4.1 : Specification Tests  

**Overall Specification Tests**

1. To open up the settings menu, click the "Settings" button.  

2. What are the default selected and inputted settings?   

3. After changing a statistic, there are 3 ways to apply changes (which will be discussed below). Theses are:  

&nbsp;1. Click or touch the "Apply" button  
&nbsp;2. Click or touch the "OK" button (this will simultaneously close the settings menu)  
&nbsp;3. Click or touch the view outsides of the settings menu (this will simultaneously close the settings menu)  

_Note: if you have invalid data, you will not be able to apply the changes_  

4. There are 3 ways to exit the Settings menu (if you have not exited by applying settings). These are:   

&nbsp;1. Click or touch the "OK" button  
&nbsp;2. Click or touch the "Cancel" button (Note: any unapplied changes will be lost)  
&nbsp;3. Click or touch the view outside of the menu  

**Graph Type Settings Specification Tests**  

1. There are 3 radio buttons and, thusly, 3 Graph Types. These are:  
&nbsp;1. Regional   
&nbsp;2. Combined  
&nbsp;3. Whole Selection  

2. When applying any of these Graph Types, if different from the current Graph Type, the current graphs will update their type accordingly. _(Note: this modification and active switch will only be viewable if and when there is a country selected)_  

**Timespan Selection Specification Tests**  

1. There are 3 text boxes and 3 corresponding settings to modify. These are:  
&nbsp;1. Start Year  
&nbsp;2. End Year  
&nbsp;3. Heatmap Year    	

**Statistic for Vaccinations Heat Map Specifications Tests**  

1. There are 3 radio buttons, and thusly, 3 statistics for the heatmap. These are:  
&nbsp;1. SIA
&nbsp;2. MCV1  
&nbsp;3. MCV2  

2. When applying any of these statistic, if different from the current heatmap statistic, the heapmap will update accordingly. _(Note: this will only be viewable if and when under the Vaccinations tab in the control panel)_   	

## 4.2 : Combination Specification Tests  

1. What happens when you do multiple settings changes at one time?  

## 4.3 : Normal Operations Tests  

## 4.4 : Pathological Tests  

1. What happens when you but the end year before the start year?   

2. What happens when you make any of the timespan settings an invalid year?    

3. What happens when you input any non-numeric characters into any of the timespan settings?  

# 5.0 : Customization of View 

"Customization of View" encompasses the features which allow the user to modify their view (i.e. changing the size of the control panel, changing the size of the graphs, resizing of the window, and zooming in/out of the World Map).  

## 5.1 : Specification Tests  

## 5.2 : Combination Specification Tests  

## 5.3 : Normal Operations Tests  

## 5.4 : Pathological Tests  