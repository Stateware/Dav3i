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

/* File Name:           TestingMain.java
 * Description:         This file uses the two files JDBC and JSOUP to test our php pages output against our database.
 * Date Created:        4/15/2015
 * Contributors:        William Bittner
 * Date Last Modified:  4/28/2015
 * Last Modified By:    William Bittner
 * Dependencies:        none
 * Input:               none                     
 * Output:              none
 */

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.Arrays;

import org.jsoup.HttpStatusException;


public class TestingMain {
	
	static JDBC database;
	static JSOUP php;
	
	// Author:        William Bittner
	// Date Created:  4/15/2015  
	// Last Modified: 4/28/2015 by William Bittner  
	// Description:   This is the main function for this file. In here will go anything you wish to test.
	public static void main(String []args) throws IOException
	{
		//Initialize the database and php objects. Be absolutely sure to not commit unless you have replaced 
		// login and password with "OMITED"
		String login = "OMITTED";
		String password = "OMITTED";
		database = new JDBC(login,password);
		php = new JSOUP();
	
		//Here goes whatever you wish to test.
		String[] s = parseFileIntoStringArray("byCountryCases.txt", ",");
		String[] rs = parseFileIntoStringArray("byCountryResults.txt",",");
		//String[] ss = parseFileIntoStringArray("byStatsResults.txt");
		boolean r = doesParamBehave(s,rs, "byCountry", true);
		/*for (int i = 0; i < r.length; i++)
		{
			System.out.print(r[i]);
		}*/
		System.out.println(r);
		
		System.out.println("Year test works:" + php.paramWorks("3", "byStat", true, "1990", true));
		
		
	}
	
	// Author:        William Bittner
	// Date Created:  4/15/2015  
	// Last Modified: 4/28/2015 by William Bittner  
	// Description:   This function creates a string array from a file. This is useful for writing test cases
	public static String[] parseFileIntoStringArray(String path, String token) throws IOException
	//PRE: Path must be a valid text file, and to get meaningful results it should be delimited by the param token
	//POST: A String array where each index is parsed from the text file at "path"
	{
		//Create a File object, and then a BufferedReader who takes that file in.
		File f = new File(path);
		BufferedReader br = new BufferedReader(new FileReader(f));
		
		//Initialize our Strings that will hold data
		String in = "";
		String line = "";
		
		//Create the String object that holds the entirety of the file
		while((line=br.readLine())!=null)
			in+=line;
		
		//Split the String at the token
		String[] retArr = in.split(token);
		
		return retArr;
	}
	
	// Author:        William Bittner
	// Date Created:  4/15/2015  
	// Last Modified: 4/28/2015 by William Bittner  
	// Description:   This is the first of two overloaded functions that behave similarly.
	//					This functions use is to tell you whether or not passing certain parameters to 
	//						our PHP documents returns an error or meaningful data. P for pass, meaning it returned data
	//						and F for fail, meaning it returned an error.
	//					This version of the function returns a String array of "P" or "F" for each test case, whose 
	//						indecies correspond to the indecies of the String array test indicating whether that string
	//						passed or failed when given as a parameter to the php document phpDocument. Whether 
	//						or not to prepend with the proper variable name is passed in by the boolean param.
	public static String[] doesParamBehave(String[] tests, String phpDocument, boolean param) throws IOException
	//PRE: The global object php is initalized and contains a function paramWorks that takes a string, phpDocument,
	//			and boolean and returns whether that call is successful or not.
	//FCTVAL = A String array whose indecies are the result of testing that index of tests on the apicall phpdocument,
	//				where param determines whether or not to prepend the parameter name(e.g. statID=). P-pass, F-fail
	{
		String[] retArr = new String[tests.length];
		
		//If the call is successful, put a P, if it fails or results in an error, F
		for(int i = 0; i<tests.length; i++)
		{
			try
			{
				//
				if(php.paramWorks(tests[i],phpDocument,param)==true)
					retArr[i] = "P";
				else
					retArr[i] = "F";
			} catch (HttpStatusException e)
			{
				retArr[i] = "F";
			}
		}
		
		
		return retArr;
	}
	
	// Author:        William Bittner
	// Date Created:  4/15/2015  
	// Last Modified: 4/28/2015 by William Bittner  
	// Description:   This funcion behaves similarly to above overloaded function, except for one key difference. 
	//					It takes another String array as a parameter called results and tests the given results against
	//					the expected results and return true or false
	public static boolean doesParamBehave(String[] tests, String[] results, String phpDocument, boolean param) throws IOException
	//PRE: The global object php is initalized and contains a function paramWorks that takes a string, phpDocument,
	//			and boolean and returns whether that call is successful or not.
	//FCTVAL = true if the expected results match the obtained, false otherwise
	{
		//Create the array to compare with expected results
		String[] resultArr = doesParamBehave(tests,phpDocument,param);
		
		//Compare our results with expected results
		if(Arrays.equals((Object[])resultArr,(Object[])results))
			return true;
		//else
		return false;
	}
	
	// Author:        William Bittner
	// Date Created:  4/15/2015  
	// Last Modified: 4/28/2015 by William Bittner  
	// Description:	  This function calls the byStat api call for php, and reads in the data expected to be fetched
	//					from the database, and compares them to see if both are equal
	public static boolean compareByStat(int statID)
	//PRE: both php and database are initialized, and for meaningful results, statID is a valid stat ID
	//FCTVAL: True if they return the same data, false otherwise
	{
		double[] PHP = null;
		try {
			 PHP = php.getStatArrays("" + statID);
		} catch (IOException | ThePHPPageGaveMeAnErrorException e) {
			e.printStackTrace();
		}
		//This is incremented by 1 because of the indexing of MySQL
		double[] DB = database.getStatArrays("" + (statID+1));
		
		//If any indecies aren't the same, immediately return false
		for(int i = 0; i < DB.length; i++)
			if(PHP[i]!=DB[i])
				return false;
		
		return true;
	}
	
	// Author:        William Bittner
	// Date Created:  4/15/2015  
	// Last Modified: 4/28/2015 by William Bittner  
	// Description:	  This function calls the byCountry api call for php, and reads in the data expected to be fetched
	//					from the database, and compares them to see if both are equal
	public static boolean compareByCountry(int countryID)
	//PRE: both php and database are initialized, and for meaningful results, countryID is a valid country ID
	//FCTVAL: True if they return the same data, false otherwise
	{
		double[][] PHP = null;
		try {
			 PHP = php.getCountryArrays("" + countryID);
		} catch (IOException | ThePHPPageGaveMeAnErrorException e) {
			e.printStackTrace();
		}
		
		//This is incremented by 1 because of the indexing of MySQL
		double[][] DB = database.getCountryArrays("" + (countryID+1));
		
		//If any indecies aren't the same, immediately return false
		for(int i = 0; i < PHP.length; i++)
			for(int j = 0; j < PHP[0].length; j++)
				if(PHP[i][j]!=DB[i][j])
					return false;
		return true;
	}

}
