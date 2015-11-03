// creates a div with the name divname
function addDiv( divName )
{
    // create new div and assign it given id
    var newDiv = document.createElement('div');
    newDiv.id = divName;

    // append it to body of page, and then to the parent div
    //document.getElementsByTagName('body')[0].appendChild(newDiv);
    document.getElementById('instances').appendChild(newDiv);

    // return divName, or null if element was not created correctly
    return newDiv;
}

// adds a name field to the parent div given, with the placeholder text given
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

    var input = document.createElement("input");
    input.type="text";
    input.placeholder = placeholderText;
    input.name = "instance-name-" + instanceCount;

    // append it to the session div
    //document.getElementsByTagName('body')[0].appendChild(nameFieldDiv);
    document.getElementById(parentDivName).appendChild(input);
    
    // returns null if element was not created correctly
    return input;
}

var instanceCount = 1;
// adds a instance div with the given divName, to the parent div given
function addInstance()
{
    // creates the new div
    var instanceDiv = addDiv("instance-"+instanceCount);
    var placeholderText = "Instance Name";

	//update instance count
	document.getElementById("numInstances").value= instanceCount;
	document.getElementById("numInstancesLabel").innerHTML= "Number of Instances: " + instanceCount;
	
    // add the name field to the session div
    addNameField(placeholderText,instanceDiv.id);
    addButton("Upload Zip", instanceDiv.id);

    instanceCount++;

    return instanceDiv.id;
}

// adds a button with the given text to the div provided
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
}