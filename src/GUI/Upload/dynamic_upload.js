var scenario_counter = 1;
function addScenario(divName){
    var newdiv = document.createElement('div');
    newdiv.innerHTML = "<input type='text' placeholder='Scenario Name' name='myInputs[]'>";
    document.getElementById(divName).appendChild(newdiv);
    counter++;
    var btn = document.createElement("button");
    var text = document.createTextNode("Edit Scenario");
    btn.appendChild(text);
    btn.style.textAlign="center";
    document.getElementById(divName).appendChild(btn);
}

var session_counter = 1;
function addSession(divName){
    var newdiv = document.createElement('div');
    newdiv.innerHTML = "<input type='text' placeholder='Session Name' name='myInputs[]'>";
    document.getElementById(divName).appendChild(newdiv);
    counter++;
    var btn = document.createElement("button");
    var text = document.createTextNode("Edit Session");
    btn.appendChild(text);
    btn.style.textAlign="center";
    document.body.appendChild(btn);
}