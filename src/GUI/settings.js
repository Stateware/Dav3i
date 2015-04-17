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

// File Name:               settings.js
// Description:             Module to modify and work with settings
// Date Created:            3/26/2015
// Contributors:            Emma Roudabush, Paul Jang
// Date Last Modified:      4/16/2015
// Last Modified By:        Paul Jang
// Dependencies:            data.js, index.html
// Additional Notes:        N/A

// Author: Emma Roudabush
// Date Created: 4/14/2015
// Last Modified: 4/14/2015 by Emma Roudabush
// Description: To set g_GraphType
// PRE: type is a number between 0-2
// POST: g_GraphType is set to the appropriate graph type
function SetGraphType(type)
{
    g_GraphType = type;
    if (g_DataList != undefined)
    {
        // redraw divs and graphs
        GenerateSubDivs();
        GenerateGraphs();
    }
}
