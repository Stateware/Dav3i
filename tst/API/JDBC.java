//imports
import java.sql.*;
import java.util.ArrayList;


public class JDBC {

	// JDBC Driver name and database URL
	static final String JDBC_DRIVER = "com.mysql.jdbc.Driver";
	static final String DB_URL = "jdbc:mysql://usve74985.serverprofi24.com:3306/davvvi";
	
	//Database creds
	static final String USER = "omitted";
	static final String PASS = "omitted";
	
	static Statement stmt;
	
	public static void main(String[] args)
	{
		Connection conn = null;
		stmt = null;
		
		try{
			
			//register JDBC driver
			Class.forName(JDBC_DRIVER);
			
			
			//open a connection
			System.out.println("connection plz: ");
			conn = DriverManager.getConnection(DB_URL, USER, PASS);
			
			
			//Let's execute a query!!
			stmt = conn.createStatement();
			String query="SELECT * FROM meta_stats";
			
			//ResultSet rs = stmt.executeQuery(query);
			
			//double[] d = getStat(""+10);

			double[][] d = getCountry(""+1);
			for(double[] dd:d)
			{
				for (double ddd:dd) {
					System.out.print(ddd + " ");
				}
				System.out.println();
			}//*/
			
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
	}
	
	public static int getNumberOfStats() {
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
	
	public static int getNumberOfYears() {
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
	
	public static String getStatTableName(String statID)
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
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	
		
		return(retStr);
		
	}
	
	public static double[] getStat(String statID)
	{
		//Get size of query return array - e.g. numcountries
		int size = getNumberOfStats();
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
	
	
	public static double[][] getCountry(String countryID) {
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
