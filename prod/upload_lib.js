/*! Dav3i - v0.1.0 - 2015-08-25
* https://github.com/Stateware/Dav3i
* Copyright (c) 2015 Stateware Team;
 Licensed GPL v3 (https://github.com/Stateware/Dav3i/blob/master/LICENSE) */
function SelectType()
{
	document.getElementById('lin').style.display='none';
	document.getElementById('est').style.display='none';
	document.getElementById('bar').style.display='none';
	document.getElementById('int').style.display='none';
	document.getElementById(document.getElementById('graph-type').value).style.display='block';
}
