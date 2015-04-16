import java.io.IOException;


public class TestingMain {
	
	static JDBC database;
	static JUNIT php;
	
	public static void main(String []args)
	{
		//init
		database = new JDBC();
		php = new JUNIT();
		
		
		for(int i = 0; i < 193; i++)
			if(compareByCountry(i) != true)
				System.out.println("ABORT");
	}
	
	public static boolean compareByStat(int statID)
	{
		double[] PHP = null;
		try {
			 PHP = php.getStatArrays("" + statID);
		} catch (IOException | ThePHPPageGaveMeAnErrorException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		//+1 because of the indexing of MySQL
		double[] DB = database.getStatArrays("" + (statID+1));
		
		//if any index says no go, return false
		for(int i = 0; i < DB.length; i++)
			if(PHP[i]!=DB[i])
				return false;
		
		return true;
	}
	
	public static boolean compareByCountry(int countryID)
	{
		double[][] PHP = null;
		try {
			 PHP = php.getCountryArrays("" + countryID);
		} catch (IOException | ThePHPPageGaveMeAnErrorException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		double[][] DB = database.getCountryArrays("" + (countryID+1));
		
		for(int i = 0; i < PHP.length; i++)
			for(int j = 0; j < PHP[0].length; j++)
				if(PHP[i][j]!=DB[i][j])
					return false;
		return true;
	}

}
