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

## Combination Specification Tests  

## Normal Operations Tests  

## Pathological Tests  

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


## Specification Tests  

## Combination Specification Tests  

## Normal Operations Tests  

## Pathological Tests  