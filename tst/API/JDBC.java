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

/* File Name:           JDBC.java
 * Description:         This file connects to the database and has functions to access its data
 * Date Created:        4/12/2015
 * Contributors:        William Bittner, Drew Lopreiato
 * Date Last Modified:  4/23/2015
 * Last Modified By:    William Bittner
 * Dependencies:        Imports listed below, jar listed in backend architecture document
 * Input:               none                     
 * Output:              none
 */

//imports
import java.sql.*;
import java.util.ArrayList;


public class JDBC {

	// JDBC Driver name and database URL
	final String JDBC_DRIVER = "com.mysql.jdbc.Driver";
	final String DB_URL = "jdbc:mysql://usve74985.serverprofi24.com:3306/davvvi";
	
	//Declare the statement and connection needed to talk to the database	
	Statement stmt;				//used to query the database
	Connection conn;			//used to connect to the database
	
	public JDBC(String user,String pass)
	{		
		try{
			conn = null;
			stmt = null;
			
			//register JDBC driver
			Class.forName(JDBC_DRIVER);
			
			
			//open a connection
			conn = DriverManager.getConnection(DB_URL, user, pass);
			System.out.println("Database connection achieved.");
			
			//define stmt so that it is connected to the database
			stmt = conn.createStatement();
			
		}catch(Exception e)
		{
			e.printStackTrace();
		}
	}
	
	// Author:        William Bittner, Drew Lopreiato
	// Date Created:  4/12/2015  
	// Last Modified: 4/23/2015 by William Bittner  
	// Description:   This function gets the number of stats by counting the entries in the table meta_stats
	private int getNumberOfStats() 
	// PRE: There was a successful connection to the database
	// POST: FCTVAL = number of stats
	{
		int size = -1;
		String query = "SELECT COUNT(table_id) FROM meta_stats";
		ResultSet rs;
		try {
			//Query the database
			rs = stmt.executeQuery(query);
			//Call next so that the result set is readied
			rs.next();
			//Grab the first int in the result set, which is the size as per our query
			size = rs.getInt(1);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return size;
	}
	
	// Author:        William Bittner, Drew Lopreiato
	// Date Created:  4/12/2015  
	// Last Modified: 4/23/2015 by William Bittner  
	// Description:   This function gets the number of years by counting the entries in the table data_births
	private int getNumberOfYears() 
	// PRE: There was a successful connection to the database
	// POST: FCTVAL = number of years
	{
		int size = 0;
		String query = "DESCRIBE data_births";
		ResultSet rs;
		try {
			//Query the database
			rs = stmt.executeQuery(query);
			//While there exists a next, add one to size. Each entry represents one year
			while (rs.next()) {
				size++;
			}
		} catch(SQLException e) {
			e.printStackTrace();
		}
		// minus 1 because country_id is the first column in the database
		return size - 1;
	}
	
	// Author:        William Bittner, Drew Lopreiato
	// Date Created:  4/12/2015  
	// Last Modified: 4/23/2015 by William Bittner  
	// Description:   This function gets the number of countries by counting the entries in the table meta_countries
	private int getNumberOfCountries() 
	// PRE: There was a successful connection to the database
	// POST: FCTVAL = number of countries
	{
		int size = -1;
		String query = "SELECT COUNT(country_id) FROM meta_countries";
		ResultSet rs;
		try {
			//Query the database
			rs = stmt.executeQuery(query);
			//Ready the data
			rs.next();
			//Grab the first int, which is the number of countries
			size = rs.getInt(1);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return size;
	}
	
	// Author:        William Bittner, Drew Lopreiato
	// Date Created:  4/12/2015  
	// Last Modified: 4/23/2015 by William Bittner  
	// Description:   This function gets the table name of a stat 
	private String getStatTableName(String statID)
	// PRE: There was a successful connection to the database and statID is a valid stat id
	// POST: FCTVAL = the table name of the stat whos id is statID
	{
		String query = "SELECT table_name FROM meta_stats WHERE table_id=" + statID;
		String retStr = "";
		ResultSet rs;
		try {
			//Query the database
			rs = stmt.executeQuery(query);
			
			//Ready the string
			rs.next();
			//The string is the first thing in the return
			retStr = rs.getString(1);
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return(retStr);
	}
	
	// Author:        William Bittner, Drew Lopreiato
	// Date Created:  4/12/2015  
	// Last Modified: 5/2/2015 by William Bittner  
	// Description:   This function mimics the return of the php document byStat
	// Additional Notes: To not specify a year, pass in null for the year parameter
	public double[] getStatArrays(String statID,String year)
	// PRE: There was a successful connection to the database and statID is a valid statID
	// POST: FCTVAL = an array of doubles representing each countries value for that stat in the index of its country ID
	{
		//Get size of query return array - e.g. numcountries
		int size = getNumberOfCountries();
		String tableName = getStatTableName(statID);
		String query;
		
		double[] retArr = new double[size];
		
		try {
			if(year ==null)
				query = "SELECT `2012` FROM " + tableName;
			else
				query = "SELECT `" + year + "` FROM " + tableName;
			//Query the database
			ResultSet rs = stmt.executeQuery(query);
			int count = 0;
			//Count starts at 0 to 0 index the array, grab the first thing from the result
			while(rs.next())
			{
				retArr[count++]=rs.getDouble(1);
			}	
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return retArr;
	}
	
	// Author:        William Bittner, Drew Lopreiato
	// Date Created:  4/12/2015  
	// Last Modified: 4/23/2015 by William Bittner  
	// Description:   This function mimics the return of the php document byCountry
	public double[][] getCountryArrays(String countryID)
	// PRE: There was a successful connection to the database and statID is a valid countryID
	// POST: FCTVAL = a 2D array that has an array for each stat whose elements are each an array of the value for each 
	//				year
	{
		double[][] returnValue = new double[getNumberOfStats()][getNumberOfYears()];
		
		//First loop is the number of stats
		for (int i = 0; i < returnValue.length; i++) {
			String query = "SELECT * FROM " + getStatTableName(""+(i+1)) + " WHERE country_id=" + countryID;
			ResultSet rs;
			try {
				//Query the query
				rs = stmt.executeQuery(query);
				rs.next();
				//Second loop is the number of years for each stat
				for (int j = 0; j < returnValue[i].length; j++) {
					// + 1 because sql is indexed at 1
					// + 1 because the first column is country_id
					returnValue[i][j] = rs.getDouble(j+2);
				}
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		
		return returnValue;
	}
}
