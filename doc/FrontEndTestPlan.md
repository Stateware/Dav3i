#Davvvi Front End Test Plan

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

## Specification Tests  

When the Dav3i client is opened, there are 2 ways to select a country. These are:  

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

## Combination Specification Tests  

The Specification Tests previously mentioned should be run alongside other related Specification Tests. These "Combination" Specification Tests are different from the more general Specification Tests because they involve operations that are not considered normal operations, and are also not pathological in their nature. They are similar to the Specification Tests in that they make assumptions about the program and have steps in common with each other, but these tests do not follow a normal pattern of user experience. This being said, they do not involve "bad" or "faulty" input like Pathological Tests, they simply have abnormal sequences of the program operation, but with viable input.  

Some of these tests include, but are not limited to, the following:  

&nbsp;1. Select 3 countries by clicking on them with the mouse or touching them using a touchscreen. Deselect a single country using the same method, and then select a different country. Does the old country deselect properly and does the new country select properly?  

## Normal Operations Tests  

These "Normal Operation" Tests will run normal and expected sequences of "good" operations (with "good" inputs) into the program to make sure that normal user actions operate as expected. These tests will go into more detail than the Specification Tests, which primarily were used just to make sure the program works to begin with. These are different from the Pathological Tests, as these Normal Operation Tests deal with "good" inputs, not "bad" inputs like the Pathological Tests. Some of these tests include, but are not limited to, the following:  

&nbsp;1. If a country is repeatedly clicked or touched, will it select and deselect accordingly without problems?  
&nbsp;2. If the "Clear Selection" button is clicked while no countries are selected, what happens?  
&nbsp;3. If a set of countries are selected and the page is refreshed, are the countries deselcted?  


## Pathological Tests  

This group of tests will assess how the program reacts to bad sequences of user input. The term "bad" in this context pertains to selecting and deselecting countries. These tests should be run after the Specification Tests and the "Normal Operation" Tests. Similar to these tests, these Pathological Tests are not exhaustive, partially due to the nature of testing in general, but mainly because it would not be possible to create a completely exhaustive set of pathological tests.  

Despite these tests being non exhaustive, they will provide insight to how the program responds to conditions deemed as "extreme", or unintended by the implementors of the program. Since the previous tests show that the basic features other program are functioning correctly, any lower-level means of performing the following tests should be sufficient. Please note that these tests may have unpredictable and unknown results.  

Some pathological tests can be derived from asking the following questions:  

&nbsp;1. Can all 205 countries/regions be selected at once without problem?  
&nbsp;2. Will right clicking the map bring up a menu? What happens if someone clicks an option on the menu?  

**_These tests will not uncover all potential problems... only a full code review can ensure complete quality control._**  

# 3.0 : Graph Visualization  

"Graph Visualization" encompasses the features which allow the generation of the graphs of the proper type, the validation of the correct data with the graphs, and the number/correct type of graphs.  

## Specification Tests  

When the Dav3i client is opened, there are 2 ways to select a country. These are:  

&nbsp;1. Moving the mouse to the desired country and clicking on it.  
&nbsp;2. Touching the desired country using a touchscreen.  

After the first country is selected, the same process can be used to select as many countries as desired.  

In absolute terms, as there are 205 regions on the map that can be selected, this yields 2 X 205 = 410 test cases which are needed to exhaustively test this functionality. However, exhaustive testing for the most part is not economical and does not uncover potential problems in the code. In order to create a reasonable number of tests, it is reasonable to select a smaller subset of countries, as without loss of generality, country selection is uniform across the map.  

Once a number of countries are selected, in order to deselect a country, follow the same process as selecting a country, and the client will simply deselect the country in question.  

There are 3 ways to deselect all of the countries that have been selected. These are:  

&nbsp;1. Deselecting every country that is selected individually by touching them on a touchscreen.  
&nbsp;2. Deselecting every country that is selected individually by clicking them with a mouse.  
&nbsp;3. Pressing the "Clear Selection" button.  


## Combination Specification Tests  

## Normal Operations Tests  

## Pathological Tests  

# 4.0 : Settings Changes  

"Settings Changes" encompasses the features which allow the user to change the heat map statistic, the vaccination statistic types, and the time span of generated graphs and the resulting changes to the map and the graphs due to these changes.  

## Specification Tests  

## Combination Specification Tests  

## Normal Operations Tests  

## Pathological Tests  

# 5.0 : Customization of View 

"Customization of View" encompasses the features which allow the user to modify their view (i.e. changing the size of the control panel, changing the size of the graphs, resizing of the window, and zooming in/out of the World Map).  

## Specification Tests  

## Combination Specification Tests  

## Normal Operations Tests  

## Pathological Tests  