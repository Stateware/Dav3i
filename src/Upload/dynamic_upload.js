// File Name:               dynamic_upload.js
// Description:             This module contains the code needed to dynamically run the upload utility page
// Date Created:            10/27/2015
// Contributors:            William Bittner, Nicholas Denaro, Paul Jang
// Date Last Modified:      11/3/2015
// Last Modified By:        Paul Jang
// Dependencies:            data_upload.html
// Additional Notes:        N/A

// a counter to keep track of how many instances are currently present on the page
var instanceCount = 1;

// Author: William Bittner, Nicholas Denaro, Paul Jang
// Date Created: 10/27/2015
// Last Modified: 11/3/2015 by Paul Jang
// Description: Add an html div to the instances div on the upload page
// PRE: instances div exists on the upload page
// POST: the upload page contains a new div with the given div name FCTVAL == newly created element.
function addDiv( divName )
{
    // create new div and assign it given id
    var newDiv = document.createElement('div');
    newDiv.id = divName;

    // append it to the parent instances div
    document.getElementById('instances').appendChild(newDiv);

    // return divName, or null if element was not created correctly
    return newDiv;
}

// Author: William Bittner, Nicholas Denaro, Paul Jang
// Date Created: 10/27/2015
// Last Modified: 11/3/2015 by Paul Jang
// Description: Add a text name field input with the given placeholder text to the specified parent div
// PRE: given parentDivName is a valid id to a div that exists
// POST: the div with div id parentDivName contains a newly created name field FCTVAL == newly created name field element
function addNameField(placeholderText,parentDivName)
{
    // creating the session name field div
    //var nameFieldDiv = document.createElement('div');

    // creating the id that the name field with have
    //var nameFieldId = parentDivName + "-name-field";
    //nameFieldDiv.id = nameFieldId;
    //nameFieldDiv.name = "instance-name-"+instanceCount;

    // creating the input text form
    //nameFieldDiv.innerHTML = "<input type='text' placeholder='"+ placeholderText +"'>";

    // create the text field and give it the correct name and placeholder text
    var input = document.createElement("input");
    input.type="text";
    input.placeholder = placeholderText;
    input.name = "instance-name-" + instanceCount;

    // append it to the parent div specified
    document.getElementById(parentDivName).appendChild(input);
    
    // returns null if element was not created correctly
    return input;
}

// Author: William Bittner, Nicholas Denaro, Paul Jang
// Date Created: 10/27/2015
// Last Modified: 11/3/2015 by Paul Jang
// Description: Adds an instance div with a text name field and an upload button to the page
// PRE: a page exists where the instance div will end up going
// POST: a newly created instance div is added to the upload page FCTVAL == id of the instance div created.
function addInstance()
{
    // creates the new div named instance-'instanceCount'
    var instanceDiv = addDiv("instance-"+instanceCount);
    var placeholderText = "Instance Name";

	// update instance count and display it
	document.getElementById("numInstances").value= instanceCount;
	document.getElementById("numInstancesLabel").innerHTML= "Number of Instances: " + instanceCount;
	
    // add the name field and the upload zip button to the instance div
    addNameField(placeholderText,instanceDiv.id);
    addButton("Upload Zip", instanceDiv.id);

    // increment the instance count
    instanceCount++;

    // returns the id of the instance div created, or null if the div was not created correctly
    return instanceDiv.id;
}

// Author: William Bittner, Nicholas Denaro, Paul Jang
// Date Created: 10/27/2015
// Last Modified: 11/3/2015 by Paul Jang
// Description: Adds an html button with the given text to the specified parent div
// PRE: parentDivName is a valid id to a div that exists
// POST: the div with div id parentDivName contains a newly created button with the text given FCTVAL == the id of the newly created button
function addButton(text,parentDivName)
{
    // creates the button and sets the values accordingly
    var button = document.createElement('input');
    button.name = "instance-file-"+instanceCount;
    button.type = 'file';
    button.accept = ".zip";

    // appends the div to the parent div given
    var parentDiv = document.getElementById(parentDivName);
    parentDiv.appendChild(button);

    // returns the id of the button created, or null if it was not created correctly
    return button.id;
}