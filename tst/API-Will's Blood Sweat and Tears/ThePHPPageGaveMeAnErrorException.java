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

/* File Name:           ThePHPPageGaveMeAnErrorException.java
 * Description:         This file is a custom excepion used in testing to denote the PHP gave an error.
 * Date Created:        4/12/2015
 * Contributors:        William Bittner
 * Date Last Modified:  4/28/2015
 * Last Modified By:    William Bittner
 * Dependencies:        none
 * Input:               none                     
 * Output:              none
 */
@SuppressWarnings("serial")
public class ThePHPPageGaveMeAnErrorException extends Exception {

	//create all of the potential constructors one might want to use when creating this exception
	public ThePHPPageGaveMeAnErrorException() { super(); }
	public ThePHPPageGaveMeAnErrorException(String message) { super(message); }
	public ThePHPPageGaveMeAnErrorException(String message, Throwable cause) { super(message, cause); }
	public ThePHPPageGaveMeAnErrorException(Throwable cause) { super(cause); }
}
