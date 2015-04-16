//imports
import java.sql.*;
import java.util.ArrayList;


public class JDBC {

	// JDBC Driver name and database URL
	final String JDBC_DRIVER = "com.mysql.jdbc.Driver";
	final String DB_URL = "jdbc:mysql://usve74985.serverprofi24.com:3306/davvvi";
		
	Statement stmt;
	Connection conn;
	
	public JDBC(String user,String pass)
	{		
		try{
			//init vars
			conn = null;
			stmt = null;
			
			//register JDBC driver
			Class.forName(JDBC_DRIVER);
			
			
			//open a connection
			conn = DriverManager.getConnection(DB_URL, user, pass);
			System.out.println("Database connection achieved.");
			
			//init statement
			stmt = conn.createStatement();
			
		}catch(Exception e)
		{
			e.printStackTrace();
		}
	}
	
	/*public static void main(String[] args)	
	{
		
	

			double[][] d = getCountryArrays(""+1);
			for(double[] dd:d)
			{
				for (double ddd:dd) {
					System.out.print(ddd + " ");
				}
				System.out.println();
			}//
		
	}*/
	
	private int getNumberOfStats() {
		int size = -1;
		String query = "SELECT COUNT(table_id) FROM meta_stats";
		ResultSet rs;
		try {
			rs = stmt.executeQuery(query);
			rs.next();
			size = rs.getInt(1);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return size;
	}
	
	private int getNumberOfYears() {
		int size = 0;
		String query = "DESCRIBE data_births";
		ResultSet rs;
		try {
			rs = stmt.executeQuery(query);
			while (rs.next()) {
				size++;
			}
		} catch(SQLException e) {
			e.printStackTrace();
		}
		// minus 1 because something country_id
		return size - 1;
	}
	
	private int getNumberOfCountries() {
		int size = -1;
		String query = "SELECT COUNT(country_id) FROM meta_countries";
		ResultSet rs;
		try {
			rs = stmt.executeQuery(query);
			rs.next();
			size = rs.getInt(1);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return size;
	}
	
	private String getStatTableName(String statID)
	{
		String query = "SELECT table_name FROM meta_stats WHERE table_id=" + statID;
		String retStr = "";
		ResultSet rs;
		try {
			rs = stmt.executeQuery(query);
			
			//nicks a god
			rs.next();
			retStr = rs.getString(1);
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
	
		
		return(retStr);
		
	}
	
	public double[] getStatArrays(String statID)
	{
		//Get size of query return array - e.g. numcountries
		int size = getNumberOfCountries();
		String tableName = getStatTableName(statID);
		String query;
		
		double[] retArr = new double[size];
		
		try {
			
			query = "SELECT `2012` FROM " + tableName;

			ResultSet rs = stmt.executeQuery(query);
			int count = 0;
			while(rs.next())
			{
				retArr[count++]=rs.getDouble(1);
			}	
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		

		return retArr;
	}
	
	public double[][] getCountryArrays(String countryID) {
		double[][] returnValue = new double[getNumberOfStats()][getNumberOfYears()];
		
		for (int i = 0; i < returnValue.length; i++) {
			String query = "SELECT * FROM " + getStatTableName(""+(i+1)) + " WHERE country_id=" + countryID;
			ResultSet rs;
			try {
				rs = stmt.executeQuery(query);
				rs.next();
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
