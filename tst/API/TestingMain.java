import java.io.IOException;
import java.util.Arrays;


public class TestingMain {
	
	static JDBC database;
	static JUNIT php;
	
	public static void main(String []args)
	{
		//init
		database = new JDBC("testing","chocolatenut9");
		php = new JUNIT();


		try {
			boolean b = doesParamBehave(new String[]{"?statID=a","?statID=BASDFA","?statID=3","?statID=11","?statID=12344444","?statID=193","?statID=lmao","?statID=gg","?statID=ez","?statID=ok"},
										 new String[]{"D","D","W","W","D","D","D","D","D","D"},"byStat",false);
			System.out.println(b);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public static String[] doesParamBehave(String[] tests, String phpDocument, boolean param) throws IOException
	{
		String[] retArr = new String[tests.length];
		
		//if it works, put in a w, if it doesnt, put in a D
		for(int i = 0; i<tests.length; i++)
		{
			if(php.paramWorks(tests[i],phpDocument,param)==true)
				retArr[i] = "W";
			else
				retArr[i] = "D";
		}
		
		
		return retArr;
	}
	
	public static boolean doesParamBehave(String[] tests, String[] results, String phpDocument, boolean param) throws IOException
	{
		String[] retArr = new String[tests.length];
		
		
		for(int i = 0; i<tests.length; i++)
		{
			if(php.paramWorks(tests[i],phpDocument,param)==true)
				retArr[i] = "W";
			else
				retArr[i] = "D";
		}
		
		if(Arrays.equals((Object[])retArr,(Object[])results))
			return true;
		
		return false;
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
