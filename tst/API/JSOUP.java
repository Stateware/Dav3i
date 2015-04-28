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

/* File Name:           JSOUP.java
 * Description:         This file parses the data from the php pages after making calls to them
 * Date Created:        4/12/2015
 * Contributors:        William Bittner
 * Date Last Modified:  4/28/2015
 * Last Modified By:    William Bittner
 * Dependencies:        Imports listed below, jar listed in backend architecture document
 * Input:               none                     
 * Output:              none
 */

import java.io.IOException;
import java.util.ArrayList;




import org.jsoup.HttpStatusException;
//import JSoup 
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
//import Json 
import org.json.*;


public class JSOUP {

	//Set the URLS we will need as global variables so I don't have to pass them around.
	final String descriptorURL = "http://usve74985.serverprofi24.com/API/descriptor.php";
	final String byCountryURL = "http://usve74985.serverprofi24.com/API/by_country.php?countryIDs=";
	final  String byStatURL = "http://usve74985.serverprofi24.com/API/by_stat.php?statID=";
	final String byCountryURLNoParam = "http://usve74985.serverprofi24.com/API/by_country.php";
	final  String byStatURLNoParam = "http://usve74985.serverprofi24.com/API/by_stat.php";
	
	//Make each stat an integer so I can assign it a statID and test the php calls correctly,
	// since each php page takes a statID
	static int numStats,numCountries,DEATHS,CASES,BIRTHS,POPULATION,MCV1,MCV2,
				ESTIMATED_MORTALITY,ESTIMATED_CASES_UB,ESTIMATED_CASES,
				ESTIMATED_MORTALITY_UB, ESTIMATED_MORTALITY_LB, ESTIMATED_CASES_LB;
								
	
	
	public JSOUP()
	{
		//set the number of countries and stats into their respective globals 
		try {
			setGlobals();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	// Author:        William Bittner
	// Date Created:  4/12/2015  
	// Last Modified: 4/28/2015 by William Bittner  
	// Description:   This function sets numStats and numCountries into the globals from the 
	//					descriptorURL and sets the stat ID globals
	public void setGlobals() throws IOException
	{		
	//PRE: DescriptorURL is valid and echos the formatted output as defined in the documentation
	//POST: All global variables as defined in the description are set
	
		//connect to descriptor page and get the text
		Document desc = Jsoup.connect(descriptorURL).get();
		String descText = desc.body().text();
				
		//Convert the text into json
		JSONObject descJSON = new JSONObject(descText);
		
		//Convert the value of the key "stats" into an array, with each
		//index having a stat
		JSONArray statsArray = descJSON.getJSONArray("stats");
		
		//Add stats to an arraylist so I can use the indexOf() function
		ArrayList<String> statsAL = new ArrayList<String>();
		for(int i = 0; i < statsArray.length(); i++)
			statsAL.add((String)statsArray.get(i));
		
		//initialize each global stat to its statID
		BIRTHS= statsAL.indexOf("Births") ;
		DEATHS= statsAL.indexOf("Deaths");
		CASES= statsAL.indexOf("Cases");
		POPULATION= statsAL.indexOf("Population");
		MCV1= statsAL.indexOf("MCV1");
		MCV2= statsAL.indexOf("MCV2");
		ESTIMATED_MORTALITY= statsAL.indexOf("Estimated Mortality");
		ESTIMATED_CASES= statsAL.indexOf("Estimated Cases");
		ESTIMATED_MORTALITY_UB= statsAL.indexOf("Estimated Mortality - Upper Bound");
		ESTIMATED_CASES_UB= statsAL.indexOf("Estimated Cases - Upper Bound");
		ESTIMATED_MORTALITY_LB= statsAL.indexOf("Estimated Mortality - Lower Bound");
		ESTIMATED_CASES_LB= statsAL.indexOf("Estimated Cases - Lower Bound");
	
		//set the size of the array of stats, and therefore the number of stats
		numStats = statsArray.length();
		
		//Convert the value of the key "cc3" into an array, with each
		//index having a country
		JSONArray countriesArray = descJSON.getJSONArray("cc3");
		
		//set the size of the array of countries, and therefore the number of countries
		numCountries = countriesArray.length();		
	}
	
	// Author:        William Bittner
	// Date Created:  4/12/2015  
	// Last Modified: 4/28/2015 by William Bittner  
	// Description:   This function takes a countryID and performs a call to byCountry using that ID. 
	public double[][] getCountryArrays(String countryID) throws IOException, ThePHPPageGaveMeAnErrorException
	//PRE: Global variable byCountryURL is initialized properly
	//POST: FCTVAL = an array of arrays of doubles (or a double double array) where each index in
	//				the outer most array is a stat with index of it's statID
	//				(so the stat with statID 0 will be in the 0 index of the array)
	//			     and each stat array has indexs for the value of that stat for the countryID param for each year
	{
		//Make the call to the page, then grab the body of the page
		Document doc = Jsoup.connect(byCountryURL + countryID).get();
		String bodyText = doc.body().text();

		//convert the body text into JSON
		JSONObject stats = new JSONObject(bodyText);
		
		//if we have no errors - proceed to parse
		if(!stats.has("error"))
		{
			//Step into the country keys value
			//JSONObject countryJSON = stats.getJSONObject(countryID);
			JSONArray countryJSONArray = stats.getJSONArray(countryID);
			
			//Create array, then assign each index a JSONArray for each stat
			JSONArray[] jray = new JSONArray[numStats];
			for(int i = 0; i < jray.length;i++)
				jray[i] = (JSONArray) countryJSONArray.get(i);
			
			return convertJSONArraysToDoubleDoubleArray(jray);	
		}
		//elseif(country.has("error") - grab the error from the call and throw it.
		throw new ThePHPPageGaveMeAnErrorException("Error calling getCountryArrays(" + countryID + ")\n"
				+ "PHP Error: " + stats.getString("error"));
	
	}
	
	// Author:        William Bittner
	// Date Created:  4/12/2015  
	// Last Modified: 4/28/2015 by William Bittner  
	// Description: This function takes a string ID, a string phpDocument which determins which call to make -
	// 					this must either be "byCountry" or "byStat", and a boolean param - true for it appending
	//					the proper parameter name (ex: "statID=") before your parameter, false if you want to write 
	//					your own parameter names. This function allows you to test the functinality of the PHP pages
	//					in depth by being able to assess the output of giving anything you want to the document.
	public boolean paramWorks(String ID, String phpDocument, boolean param) throws IOException, HttpStatusException
	//PRE: Global variables byCountryURL, byStatURL, byCountryURLNoParam, and byStatURLNoParam are initialized properly
	//POST: FCTVAL = true if the query did not result in an error from the PHP document, 
	//					or false if the query did result in an error from the PHP document
	{
		Document doc;
		//if param is true we want to use the URL that appends the correct parameter name to the URL
		if(param)
		{
			//if the phpDocument is valid, make the correct API call. If invalid, throw an error
			switch(phpDocument){
			case "byCountry":	doc = Jsoup.connect(byCountryURL + ID).get();
								break;
			case "byStat":		doc = Jsoup.connect(byStatURL + ID).get();
								break;
			default:			doc = null;
								throw new Error("Invalid php document.");
			}
		}
		else//This is the same as above but with no parameter. here ID can function as more than an ID, it is the 
			// complete assignment of the parameter to the value of the ID
		{
			switch(phpDocument){
			case "byCountry":	doc = Jsoup.connect(byCountryURLNoParam + ID).get();
								break;
			case "byStat":		doc = Jsoup.connect(byStatURLNoParam + ID).get();
								break;
			default:			doc = null;
								throw new Error("Invalid php document.");
			}
		}
		
		String bodyText = doc.body().text();

		//convert the entire text into JSON
		JSONObject jsonText = new JSONObject(bodyText);
		
		if(jsonText.has("error"))
		{
			return false;
		}
		else
		{
			return true;
		}
	}	
	
	// Author:        William Bittner
	// Date Created:  4/12/2015  
	// Last Modified: 4/28/2015 by William Bittner  
	// Description:	 This function takes a string stat ID and performs the api call byStat on that ID 
	public double[] getStatArrays(String statID) throws IOException,ThePHPPageGaveMeAnErrorException
	//PRE: Global variable byStatURL is the correct URL for the API call byStat
	//FCTVAL = an array of doubles, with each index corresponding to the country whose ID is that index, and
	// 			the data being that country's data for the stat ID for whatever year the PHP page defaults to
	{
		//Connect to the byStat page and grab its text
		Document doc = Jsoup.connect(byStatURL + statID).get();
		String bodyText = doc.body().text();

		JSONObject countries = new JSONObject(bodyText);
		
		//if there is no error, proceed as normal and process the json into the double array
		if(!countries.has("error"))
		{			
			//Split the text into an array of Strings
			String[] sray = countries.get(statID+"").toString().split(",");
		
			//Remove [ and ] from first and last strings
			sray[0]=sray[0].substring(1);
			sray[numCountries-1] = sray[numCountries-1].substring(0, sray[numCountries-1].length()-1);
			
			//get rid of quotes around numbers
			for(int i = 0; i < numCountries; i++)
				sray[i]=sray[i].substring(1,sray[i].length()-1);

			
			//convert string into double and put into double array
			double[] dray = new double[numCountries];	
			for(int i = 0; i < numCountries; i++)
			{
				dray[i] = Double.parseDouble(sray[i]);
			}
			
			return dray;
		}
		//elseif(bodyText.has("error")) - throw the error that the php page gave us
		throw new ThePHPPageGaveMeAnErrorException("Error calling getStatArrays(" + statID + ")\n"
				+ "Printed Error: " + countries.getString("error"));
	}
	
	// Author:        William Bittner
	// Date Created:  4/12/2015  
	// Last Modified: 4/28/2015 by William Bittner  
	// Description:	 This function converts an array of JSONArrays of doubles of into a double[][] 
	public double[][] convertJSONArraysToDoubleDoubleArray(JSONArray[] j)
	//PRE: the JSONArray[] j is an array of JSONArrays that each are a JSONArray of doubles
	//FCTVAL = a 2D array containing whatever the input contained, but of the data type double[][]
	{
		double[][] retArr = new double[j.length][j[1].length()];
		
		for(int i = 0; i < j.length; i++)
			for(int k = 0; k < j[1].length(); k++)
				retArr[i][k] = j[i].getDouble(k);
		
		return retArr;
	}
}
