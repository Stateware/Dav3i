<?php
require_once '.\..\..\src\api\api_library.php';

class api_libraryTest extends \PHPUnit_Framework_TestCase
{
	public function testByStatUnsanitaryYear()
	{
		$statID = 0;
		$year = "19d0";
		try
		{
			$ret = ByStat($statID, $year);
			$this->assertTrue(false);
		}
		catch(Exception $e)
		{
			$this->assertTrue("{\"error\" : \"Input is unsanitary: year\"}" == $e->getMessage());
		}
	}

	public function testByStatInvalidYear()
	{
		$statID = 0;
		$year = "1960";
		try
		{
			$ret = ByStat($statID, $year);
			$this->assertTrue(false);
		}
		catch(Exception $e)
		{
			$this->assertTrue("{\"error\" : \"Input is invalid: year\"}" == $e->getMessage());
		}
	}

	public function testByStatUnsanitaryStatID()
	{
		$statID = 'd';
		$year = "1980";
		try
		{
			$ret = ByStat($statID, $year);
			$this->assertTrue(false);
		}
		catch(Exception $e)
		{
			$this->assertTrue("{\"error\" : \"Input is unsanitary: statID\"}" == $e->getMessage());
		}
	}

	public function testByStatInvalidStatID()
	{
		$statID = 1202;
		$year = "1980";
		try
		{
			$ret = ByStat($statID, $year);
			$this->assertTrue(false);
		}
		catch(Exception $e)
		{
			$this->assertTrue("{\"error\" : \"Input is invalid: statID\"}" == $e->getMessage());
		}
	}

	public function testByStatMissingHeatmapData()
	{
		$statID = 1;
		$year = "1980";
		try
		{
			$ret = ByStat($statID, $year);
			$this->assertTrue(false);
		}
		catch(Exception $e)
		{
			$this->assertTrue("{\"error\" : \"Database missing data.\"}" == $e->getMessage());
		}
	}

	public function testByStatMissingCountryData()
	{
		$statID = 2;
		$year = "1980";
		try
		{
			$ret = ByStat($statID, $year);
			$this->assertTrue(false);
		}
		catch(Exception $e)
		{
			$this->assertTrue("{\"error\" : \"Database missing country data.\"}" == $e->getMessage());
		}
	}

	public function testByStatReturnValue()
	{
		$year = "1980";
		$statID = 0;
		$expected = array(array_fill(0, 193, NULL), "force" => "object");

		$ret = ByStat($statID, $year);

		$this->assertTrue($ret == $expected);
	}

	public function testByCountryUnsanitaryCountryIDs()
	{
		$countryIDs = "3,5, 7";
		try
		{
			$ret = ByCountry($countryIDs);
			$this->assertTrue(false);
		}
		catch(Exception $e)
		{
			$this->assertTrue("{\"error\" : \"Input is unsanitary: countryIDs\"}" == $e->getMessage());
		}
	}

	public function testByCountryInvalidCountryID()
	{
		$countryIDs = "1,3,300";
		try
		{
			$ret = ByCountry($countryIDs);
			$this->assertTrue(false);
		}
		catch(Exception $e)
		{
			$this->assertTrue("{\"error\" : \"Input is invalid: countryID (300)\"}" == $e->getMessage());
		}
	}

	public function testByCountryReturnValue()
	{
		$countryIDs = "1";
		$ret = ByCountry($countryIDs);
		$expected = "{\"1\":[[null,\"418898\",\"432971\",\"447294\",\"461747\",\"476219\",\"490634\",\"505010\",\"519380\",\"533755\",\"548144\",\"562566\",\"577105\",\"591869\",\"606960\",\"622489\",\"638551\",\"655205\",\"672499\",\"690483\",\"709358\",\"729348\",\"750381\",\"772201\",\"794448\",\"816457\",\"837467\",\"856997\",\"874823\",\"890976\",\"905805\",\"919918\",\"934096\"],[\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\"],[\"29656\",\"19714\",\"30067\",\"22589\",\"22685\",\"22822\",\"15580\",\"13368\",\"21009\",\"19820\",\"29069\",\"18382\",\"16772\",\"9273\",\"5480\",\"635\",\"251\",\"8183\",\"2576\",\"350\",\"2219\",\"9046\",\"11945\",\"1196\",\"29\",\"258\",\"765\",\"1014\",\"265\",\"2807\",\"1190\",\"1449\",\"4458\"],[\"7637141\",\"7901870\",\"8190093\",\"8489864\",\"8784753\",\"9063646\",\"9320678\",\"9561022\",\"9798055\",\"10051133\",\"10333844\",\"10652727\",\"11002758\",\"11372156\",\"11743432\",\"12104952\",\"12451945\",\"12791388\",\"13137542\",\"13510616\",\"13924930\",\"14385283\",\"14886574\",\"15421075\",\"15976715\",\"16544376\",\"17122409\",\"17712824\",\"18314441\",\"18926650\",\"19549124\",\"20180490\",\"20820525\"],[\"0\",\"0\",\"0\",\"0.26\",\"0.35\",\"0.44\",\"0.44\",\"0.55\",\"0.56\",\"0.48\",\"0.38\",\"0.39\",\"0.39\",\"0.47\",\"0.44\",\"0.46\",\"0.62\",\"0.78\",\"0.62\",\"0.46\",\"0.41\",\"0.72\",\"0.74\",\"0.62\",\"0.64\",\"0.45\",\"0.48\",\"0.88\",\"0.79\",\"0.77\",\"0.93\",\"0.88\",\"0.97\"],[\"-1\",\"10661.2\",\"14178\",\"10400.2\",\"10514.3\",\"10612.9\",\"7218.01\",\"6158.81\",\"10022.5\",\"9130.83\",\"13857.1\",\"8555.92\",\"7736.93\",\"4645.7\",\"3035.49\",\"1346.95\",\"768.091\",\"4083.9\",\"1971.51\",\"962.913\",\"1248.56\",\"4219\",\"5482.85\",\"1936.59\",\"27.7336\",\"336.851\",\"681.73\",\"360.803\",\"371.054\",\"1104.98\",\"382.591\",\"649.37\",\"1446.28\"],[\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\"],[\"-1\",\"511298\",\"630708\",\"471686\",\"480200\",\"484310\",\"339179\",\"298511\",\"466993\",\"421053\",\"620728\",\"391992\",\"361409\",\"228742\",\"161036\",\"84900.6\",\"63514\",\"245234\",\"113867\",\"75878.9\",\"96361.2\",\"234295\",\"274439\",\"108446\",\"65307.4\",\"56305.1\",\"68385.1\",\"80065.7\",\"56958.6\",\"105670\",\"80369\",\"79669.1\",\"166605\"],[\"-1\",\"430565\",\"572506\",\"420149\",\"425057\",\"428510\",\"291478\",\"248899\",\"404954\",\"368689\",\"559861\",\"345552\",\"312534\",\"187584\",\"122644\",\"54409.6\",\"31064.8\",\"165048\",\"79661\",\"45385.1\",\"58834\",\"170445\",\"221465\",\"78290.5\",\"1305.99\",\"15860.2\",\"32126.6\",\"14587.4\",\"17473.1\",\"52073.8\",\"18029.7\",\"30563.8\",\"68145.2\"],[\"-1\",\"13694.7\",\"16880.2\",\"12657.8\",\"12861.6\",\"12944.5\",\"9089.11\",\"7976.48\",\"12494.8\",\"11280.6\",\"16637.4\",\"10483.4\",\"9690.47\",\"6125.73\",\"4314\",\"2266.78\",\"1696.75\",\"6573.46\",\"3048.7\",\"1729.65\",\"2198.98\",\"6272.53\",\"7340.4\",\"2899.76\",\"1490.22\",\"1284.79\",\"1560.34\",\"2144.41\",\"1299.83\",\"2412.94\",\"1832.74\",\"1817.69\",\"3796.08\"],[\"-1\",\"8115.15\",\"11801.9\",\"8472.72\",\"8499.98\",\"8577.73\",\"5629.94\",\"4635.13\",\"7909.58\",\"7293.38\",\"11458.1\",\"6886.68\",\"6093.96\",\"3427.71\",\"2035.27\",\"693.593\",\"224.087\",\"2273.57\",\"1170.7\",\"442.263\",\"595.21\",\"2646.22\",\"3970.35\",\"1207.19\",\"0\",\"2.77903\",\"179.846\",\"0\",\"10.7631\",\"330.474\",\"0\",\"83.609\",\"236.99\"],[\"-1\",\"355271\",\"516393\",\"370970\",\"372584\",\"375431\",\"246819\",\"203160\",\"346512\",\"319194\",\"501438\",\"301561\",\"266674\",\"150064\",\"89050.4\",\"30366.9\",\"9805.28\",\"99370.2\",\"51201.8\",\"22398.1\",\"30128.5\",\"115882\",\"173592\",\"52777.3\",\"0\",\"140.808\",\"9122.15\",\"0\",\"545.323\",\"16739\",\"0\",\"4237.26\",\"12010.2\"],[\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0.9025\",\"0\",\"0\",\"0.9405\",\"0\",\"0\",\"0.9405\",\"0\",\"0.80461\",\"0\"]],\"force\":\"object\"}";
		//$this->assertTrue($ret == $expected);
	}

	public function testDescriptorNoTables()
	{
		try
		{
			$ret = Descriptor();
			$this->assertFalse(true);
		}
		catch(Exception $e)
		{
			echo $e->getMessage();
			$this->assertTrue("{\"error\" : \"No tables with years exist\"}" == $e->getMessage());
		}
	}

	public function testDescriptorMetaCorrupt()
	{
		try
		{
			$ret = Descriptor();
			$this->assertFalse(true);
		}
		catch(Exception $e)
		{
			echo $e->getMessage();
			$this->assertTrue("{\"error\" : \"The meta_country data is corrupt\"}" == $e->getMessage());
		}
	}

	public function testDescriptorReturnValue()
	{
		$ret = Descriptor();
		$expected = "";

		$this->assertTrue($expected == $ret);
	}

	public function testIsSanitaryYearSanitary()
	{
		$year = "1444";
		$this->assertTrue(IsSanitaryYear($year));
	}

	public function testIsSanitaryYearUnsanitary()
	{
		$year = "0x444";
		$this->assertFalse(IsSanitaryYear($year));
	}

	public function testIsSanitaryStatIDSanitary()
	{
		$statID = "1444";
		$this->assertTrue(IsSanitaryStatID($statID));
	}

	public function testIsSanitaryStatIDUnsanitary()
	{
		$statID = "a144";
		$this->assertFalse(IsSanitaryStatID($statID));
	}

	public function testIsSanitaryCountryListSanitary()
	{
		$countryList = "2,5,2,7,4";
		$this->assertTrue(IsSanitaryCountryList($countryList));
	}

	public function testIsSanitaryCountryListUnsanitary()
	{
		$countryList = "2,5,2, 7,4";
		$this->assertFalse(IsSanitaryCountryList($countryList));
	}

	public function testIsValidYearBelowRange()
	{
		$year = "1400";
		$yearRange = ["1578","1628"];
		$this->assertFalse(IsValidYear($year,$yearRange));
	}

	public function testIsValidYearWithinRange()
	{
		$year = "1600";
		$yearRange = ["1578","1628"];
		$this->assertTrue(IsValidYear($year,$yearRange));
	}

	public function testIsValidYearAboveRange()
	{
		$year = "1635";
		$yearRange = ["1578","1628"];
		$this->assertFalse(IsValidYear($year,$yearRange));
	}

	public function testIsValidStatIDBelowRange()
	{
		$statID = "-3";
		$numStats = 6;
		$this->assertFalse(IsValidStatID($statID,$numStats));
	}

	public function testIsValidStatIDWithinRange()
	{
		$statID = "3";
		$numStats = 8;
		$this->assertTrue(IsValidStatID($statID,$numStats));
	}

	public function testIsValidStatIDAboveRange()
	{
		$statID = "9";
		$numStats = 9;
		$this->assertFalse(IsValidStatID($statID,$numStats));
	}

	public function testIsValidCountryIDBelowRange()
	{
		$countryID = "0";
		$numCountries = 400;
		$this->assertFalse(IsValidCountryID($countryID,$numCountries));
	}

	public function testIsValidCountryIDWithinRange()
	{
		$countryID = "400";
		$numCountries = 400;
		$this->assertTrue(IsValidCountryID($countryID,$numCountries));
	}

	public function testIsValidCountryIDAboveRange()
	{
		$countryID = "401";
		$numCountries = 400;
		$this->assertFalse(IsValidCountryID($countryID,$numCountries));
	}

	public function testGetStatNamesArchitectureError()
	{
		try
		{
			GetStatNames(new mysqli("localhost","root","","dav3iphpunittestemptymeta"));
			$this->assertTrue(false);
		}
		catch(Exception $e)
		{
			//echo $e->getMessage();
			$this->assertTrue("{\"error\" : \"MySQL Architecture error\"}" == $e);
		}
	}

	public function testGetStatNamesReturnValue()
	{
		$ret = GetStatNames(new mysqli("localhost","root","","dav3iphpunittest"));
		$expected = array("Births","Reported Cases","Population","MCV1-VACCL","Estimated Mortality","MCV2-VACCL","Estimated Cases - Upper Bound","Estimated Cases","Estimated Mortality - Upper Bound","Estimated Mortality - Lower Bound","Estimated Cases - Lower Bound","SIA-VACCB");
		//echo json_encode($ret);
		$this->assertTrue($ret == $expected);
	}

	public function testGetTableNamesArchitectureError()
	{
		try
		{
			GetTableNames(new mysqli("localhost","root","","dav3iphpunittestemptymeta"));
			$this->assertTrue(false);
		}
		catch(Exception $e)
		{
			//echo $e->getMessage();
			$this->assertTrue("{\"error\" : \"MySQL Architecture error\"}" == $e);
		}
	}

	public function testGetTableNamesReturnValue()
	{
		$ret = GetTableNames(new mysqli("localhost","root","","dav3iphpunittest"));
		$expected = array("data_births","data_cases","data_popula","data_mcv1","data_estmortal","data_mcv2","data_ubecases","data_estcases","data_ubemortal","data_lbemortal","data_lbecases","data_sia");
		//echo json_encode($ret);
		$this->assertTrue($ret == $expected);
	}

	public function testGetYearRangeNoDescription()
	{
		$tableName = "data_death";
		$ret = GetYearRange(new mysqli("localhost","root","","dav3iphpunittest"),$tableName);
		$expected = false;
		$this->assertTrue($ret == $expected);
	}

	public function testGetYearRangeReturnValue()
	{
		$tableName = "data_births";
		$ret = GetYearRange(new mysqli("localhost","root","","dav3iphpunittest"),$tableName);
		$expected = ["1980","2012"];
		$this->assertTrue($ret == $expected);
	}

	public function testGetCountryQueriesReturnValue()
	{
		$tableNames = array(1 => "data_births", 3 => "data_cases");
		$countries = array(1, 2, 6);

		$expected = "{\"1\":\"SELECT * FROM data_births WHERE country_id=1 OR country_id=2 OR country_id=6\",\"3\":\"SELECT * FROM data_cases WHERE country_id=1 OR country_id=2 OR country_id=6\"}";

		$ret = GetCountryQueries($tableNames, $countries);
		//echo json_encode($ret);
		$this->assertTrue(json_encode($ret) == $expected);
	}
}