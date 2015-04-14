import java.io.IOException;





import java.sql.SQLException;
import java.util.ArrayList;



//import JSoup bus'
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
//import Json 
import org.json.*;

//TODO:
//Set to receive and act upon error messages - also change by_country->by_stat...wut



public class JUNIT {

	
	final static String descriptorURL = "http://usve74985.serverprofi24.com/API/descriptor.php";
	final static String byCountryURL = "http://usve74985.serverprofi24.com/API/by_country.php?countryIDs=";
	final static String byStatURL = "http://usve74985.serverprofi24.com/API/by_stat.php?statID=";

	static int numStats,numCountries,DEATHS,CASES,BIRTHS,POPULATION,MCV1,MCV2,
				ESTIMATED_MORTALITY,ESTIMATED_CASES_UB,ESTIMATED_CASES,
				ESTIMATED_MORTALITY_UB, ESTIMATED_MORTALITY_LB, ESTIMATED_CASES_LB;
								
	
	@SuppressWarnings("unused")
	public static void main(String args[]) throws IOException
	{
		String baseURL = "http://usve74985.serverprofi24.com/API/";
		String byStat = "by_stat.php?statID=";
		String byCountry = "by_country.php?countryIDs=";
		String descriptor = "descriptor.php";
		
		//set the number of countries and stats into their respective globals 
		setGlobals();
		
		
		//test the getCountryArrays method
		try
		{
			int param1 = 3;
			JSONArray[] countryStats = getCountryArrays("0");	
			printArray(countryStats);
		}
		catch(Exception e)
		{
			System.out.println(e);
		}
		
		//test the getStatsArray method
		try
		{
			//double[] statStats = getStatArrays(9 + "");
			
			//for(double s : statStats)
				//System.out.println(s);
		}
		catch(Exception e)
		{
			System.out.println(e);
		}
	
		
	}

	
	//Sets numStats and numCountries into the globals from the descriptorURL
	public static void setGlobals() throws IOException
	{		
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
		
		
		BIRTHS= statsAL.indexOf("Births");
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
	
	public static JSONArray[] getCountryArrays(String countryID) throws IOException, ThePHPPageGaveMeAnErrorException
	{
		Document doc = Jsoup.connect(byCountryURL + countryID).get();
		String bodyText = doc.body().text();

		//convert the entire text into JSON
		JSONObject stats = new JSONObject(bodyText);
		
		if(!stats.has("error"))
		{

			//System.out.println(stats);
			//Step into the country keys value
			//JSONObject countryJSON = stats.getJSONObject(countryID);
			JSONArray countryJSONArray = stats.getJSONArray(countryID);
			
			//Create array, then assign each index a JSONArray for each stat
			JSONArray[] jray = new JSONArray[numStats];
			for(int i = 0; i < jray.length;i++)
				jray[i] = (JSONArray) countryJSONArray.get(i);
			
			return jray;	
		}
		//elseif(country.has("error")
		throw new ThePHPPageGaveMeAnErrorException("Error calling getCountryArrays(" + countryID + ")\n"
				+ "Printed Error: " + stats.getString("error"));
	
	}
	
	public static double[] getStatArrays(String statID) throws IOException,ThePHPPageGaveMeAnErrorException
	{
		//Connect to the byStat page and grab its text
		Document doc = Jsoup.connect(byStatURL + statID).get();
		String bodyText = doc.body().text();

		JSONObject countries = new JSONObject(bodyText);
		//JSONArray countries = new JSONArray(bodyText);
		//countries.get(1)
		
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
		//elseif(bodyText.has("error")
		throw new ThePHPPageGaveMeAnErrorException("Error calling getStatArrays(" + statID + ")\n"
				+ "Printed Error: " + countries.getString("error"));
	}
	
	public static void printArray(JSONArray[] ar)
	{
		for(int i = 0; i < ar.length; i++)
			System.out.println("Index " + i + ": " + ar[i]);
	}
	
}
