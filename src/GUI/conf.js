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

/*
 * Function: LoadConfig
 * This function is the callback for an ajax call that will be passed JSON from the connection strings config file and set it up as a config object to be used
 * 
 *
 * Pre: data is valid JSON and defined as in the documentation
 * 
 *
 * Post: g_Config is a valid connection strings config object as defined in the documentation
 * 
 *
 * Authors: William Bittner, Nicholas Denaro
 * 
 *
 * Date Created: 4/4/2016
 * 
 *
 * Last Modified: 4/4/2016 by William Bittner
 * 
 */
function LoadConfig( data )
{
	g_Config = data;
	//the below functions are named (not anonymous) so as to be unit testable, but are to be only used within the context
	//	of this config object, hence the use of underscore in the beginning
	g_Config.getAPI = _getAPI;
	g_Config.setEnvironment = _setEnvironment;
	
	
	return g_Config;
}

/*
 * Function: _getAPI
 * This function get the correct API url from the config object
 * 
 *
 * Pre: The "this" is in the context of a connection strings config object
 * 
 *
 * Post: The connection string for the API call is returned
 * 
 *
 * Authors: William Bittner, Nicholas Denaro
 * 
 *
 * Date Created: 4/4/2016
 * 
 *
 * Last Modified: 4/4/2016 by William Bittner
 * 
 */
function _getAPI()
{
	return this[this.environment].API;
}

/*
 * Function: _setEnvironment
 * This function sets the environment variable of the config
 * 
 *
 * Pre: The "this" is in the context of a connection strings config object
 * 
 *
 * Post: If the newEnvironment parameter is a valid environment, then the environment is changed and true is returned, else it is unchanged and false is returned
 * 
 *
 * Authors: William Bittner, Nicholas Denaro
 * 
 *
 * Date Created: 4/4/2016
 * 
 *
 * Last Modified: 4/4/2016 by William Bittner
 * 
 */
function _setEnvironment( newEnvironment )
{
	if( this[newEnvironment] !== undefined )
	{
		this.environment = newEnvironment; 
		return true;
	}
	else
	{
		return false;
	}
}