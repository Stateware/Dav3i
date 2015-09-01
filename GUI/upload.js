/*
 * Copyright 2015 Stateware Team: William Bittner, Joshua Crafts, 
 * Nicholas Denaro, Dylan Fetch, Paul Jang, Arun Kumar, Drew Lopreiato,
 * Kyle Nicholson, Emma Roudabush, Berty Ruan, Vanajam Soni
 * 
 * This file is part of Dav3i.
 * 
 * Dav3i is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * Dav3i is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Dav3i.  If not, see <http://www.gnu.org/licenses/>.
 */

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
