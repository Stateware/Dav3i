/*! Dav3i - v0.1.0 - 2015-12-01
* https://github.com/Stateware/Dav3i
* Copyright (c) 2015 Stateware Team;
 Licensed GPL v3 (https://github.com/Stateware/Dav3i/blob/master/LICENSE) */
// File Name:               upload.js
// Description:             Short menu selection function to support upload utility
// Date Created:            8/19/2015
// Contributors:            Joshua Crafts
// Date Last Modified:      8/19/2015
// Last Modified By:        Joshua Crafts
// Dependencies:            none
// Additional Notes:        N/A

function SelectType()
{
	document.getElementById('lin').style.display='none';
	document.getElementById('est').style.display='none';
	document.getElementById('bar').style.display='none';
	document.getElementById('int').style.display='none';
	document.getElementById(document.getElementById('graph-type').value).style.display='block';
}
