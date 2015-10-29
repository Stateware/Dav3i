// creates a div with the name divname and adds it to the parent div specified
function addDiv(divName, parent)
{
    // create new div and assign it given id
    var newDiv = document.createElement('div');
    newDiv.id = divName;

    // append it to body of page, and then to the parent div
    document.getElementsByTagName('body')[0].appendChild(newDiv);
    document.getElementById(parent).appendChild(newDiv);

    // return divName, or null if element was not created correctly
    return newDiv;
}

// adds a name field to the parent div given, with the placeholder text given
function addNameField(placeholderText,parentDivName)
{
    // creating the session name field div
    var nameFieldDiv = document.createElement('div');

    // creating the id that the name field with have
    var nameFieldId = parentDivName + "-name-field";
    nameFieldDiv.id = nameFieldId;

    // creating the input text form
    nameFieldDiv.innerHTML = "<input type='text' placeholder="+ placeholderText +">";

    // append it to the session div
    document.getElementsByTagName('body')[0].appendChild(nameFieldDiv);
    document.getElementById(parentDivName).appendChild(nameFieldDiv);
    
    // returns null if element was not created correctly
    return document.getElementById(nameFieldId);
}

// adds a session div with the given divName, to the parent div given
function addSession(divName,parent)
{
    // creates the new div
    var sessionDiv = addDiv(divName,parent);
    var placeholderText = "Session Name";

    // add the name field to the session div
    addNameField(placeholderText,sessionDiv.id);
    addButton("Add Instance", sessionDiv.id);
}

// adds a button with the given text to the div provided
function addButton(text,parentDivName)
{
    // creates the button and sets the values accordingly
    var button = document.createElement('input');
    button.type = 'button';
    button.value = text;

    // appends the div to the parent div given
    var parentDiv = document.getElementById(parentDivName);
    parentDiv.appendChild(button);
}