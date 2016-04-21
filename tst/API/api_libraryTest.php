<?php
require_once '.\..\..\src\api\api_library.php';

class api_libraryTest extends \PHPUnit_Framework_TestCase
{
	public function testByStatUnsanitaryYear()
	{
		$statID = 0;
		$year = "19d0";
		$sessionID = 35;
		$instanceID = 46;
		try
		{
			$ret = ByStat($statID, $year, $sessionID, $instanceID);
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
		$sessionID = 35;
		$instanceID = 46;
		try
		{
			$ret = ByStat($statID, $year, $sessionID, $instanceID);
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
		$sessionID = 35;
		$instanceID = 46;
		try
		{
			$ret = ByStat($statID, $year, $sessionID, $instanceID);
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
		$sessionID = 35;
		$instanceID = 46;
		try
		{
			$ret = ByStat($statID, $year, $sessionID, $instanceID);
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
		$sessionID = 35;
		$instanceID = 46;
		try
		{
			$ret = ByStat($statID, $year, $sessionID, $instanceID);
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
		$sessionID = 35;
		$instanceID = 46;
		try
		{
			$ret = ByStat($statID, $year, $sessionID, $instanceID);
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
		$sessionID = 35;
		$instanceID = 46;

		$expected = array(array_fill(0, 193, NULL), "force" => "object");

		try
		{
			$ret = ByStat($statID, $year);

			$this->assertTrue($ret == $expected);
		}
		catch(Exception $e)
		{

		}
	}

	public function testByCountryUnsanitaryCountryIDs()
	{
		$countryIDs = "3,5, 7";
		$sessionID = 35;
		$instanceID = 46;
		try
		{
			$ret = ByCountry($countryIDs,$sessionID,$instanceID);
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
		$sessionID = 35;
		$instanceID = 46;
		try
		{
			$ret = ByCountry($countryIDs,$sessionID,$instanceID);
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
		$sessionID = 35;
		$instanceID = 46;
		$ret = ByCountry($countryIDs,$sessionID,$instanceID);
		$expected = "{\"1\":[[null,\"418898\",\"432971\",\"447294\",\"461747\",\"476219\",\"490634\",\"505010\",\"519380\",\"533755\",\"548144\",\"562566\",\"577105\",\"591869\",\"606960\",\"622489\",\"638551\",\"655205\",\"672499\",\"690483\",\"709358\",\"729348\",\"750381\",\"772201\",\"794448\",\"816457\",\"837467\",\"856997\",\"874823\",\"890976\",\"905805\",\"919918\",\"934096\"],[\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\",\"-1\"],[\"29656\",\"19714\",\"30067\",\"22589\",\"22685\",\"22822\",\"15580\",\"13368\",\"21009\",\"19820\",\"29069\",\"18382\",\"16772\",\"9273\",\"5480\",\"635\",\"251\",\"8183\",\"2576\",\"350\",\"2219\",\"9046\",\"11945\",\"1196\",\"29\",\"258\",\"765\",\"1014\",\"265\",\"2807\",\"1190\",\"1449\",\"4458\"],[\"7637141\",\"7901870\",\"8190093\",\"8489864\",\"8784753\",\"9063646\",\"9320678\",\"9561022\",\"9798055\",\"10051133\",\"10333844\",\"10652727\",\"11002758\",\"11372156\",\"11743432\",\"12104952\",\"12451945\",\"12791388\",\"13137542\",\"13510616\",\"13924930\",\"14385283\",\"14886574\",\"15421075\",\"15976715\",\"16544376\",\"17122409\",\"17712824\",\"18314441\",\"18926650\",\"19549124\",\"20180490\",\"20820525\"],[\"0\",\"0\",\"0\",\"0.26\",\"0.35\",\"0.44\",\"0.44\",\"0.55\",\"0.56\",\"0.48\",\"0.38\",\"0.39\",\"0.39\",\"0.47\",\"0.44\",\"0.46\",\"0.62\",\"0.78\",\"0.62\",\"0.46\",\"0.41\",\"0.72\",\"0.74\",\"0.62\",\"0.64\",\"0.45\",\"0.48\",\"0.88\",\"0.79\",\"0.77\",\"0.93\",\"0.88\",\"0.97\"],[\"-1\",\"10661.2\",\"14178\",\"10400.2\",\"10514.3\",\"10612.9\",\"7218.01\",\"6158.81\",\"10022.5\",\"9130.83\",\"13857.1\",\"8555.92\",\"7736.93\",\"4645.7\",\"3035.49\",\"1346.95\",\"768.091\",\"4083.9\",\"1971.51\",\"962.913\",\"1248.56\",\"4219\",\"5482.85\",\"1936.59\",\"27.7336\",\"336.851\",\"681.73\",\"360.803\",\"371.054\",\"1104.98\",\"382.591\",\"649.37\",\"1446.28\"],[\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\"],[\"-1\",\"511298\",\"630708\",\"471686\",\"480200\",\"484310\",\"339179\",\"298511\",\"466993\",\"421053\",\"620728\",\"391992\",\"361409\",\"228742\",\"161036\",\"84900.6\",\"63514\",\"245234\",\"113867\",\"75878.9\",\"96361.2\",\"234295\",\"274439\",\"108446\",\"65307.4\",\"56305.1\",\"68385.1\",\"80065.7\",\"56958.6\",\"105670\",\"80369\",\"79669.1\",\"166605\"],[\"-1\",\"430565\",\"572506\",\"420149\",\"425057\",\"428510\",\"291478\",\"248899\",\"404954\",\"368689\",\"559861\",\"345552\",\"312534\",\"187584\",\"122644\",\"54409.6\",\"31064.8\",\"165048\",\"79661\",\"45385.1\",\"58834\",\"170445\",\"221465\",\"78290.5\",\"1305.99\",\"15860.2\",\"32126.6\",\"14587.4\",\"17473.1\",\"52073.8\",\"18029.7\",\"30563.8\",\"68145.2\"],[\"-1\",\"13694.7\",\"16880.2\",\"12657.8\",\"12861.6\",\"12944.5\",\"9089.11\",\"7976.48\",\"12494.8\",\"11280.6\",\"16637.4\",\"10483.4\",\"9690.47\",\"6125.73\",\"4314\",\"2266.78\",\"1696.75\",\"6573.46\",\"3048.7\",\"1729.65\",\"2198.98\",\"6272.53\",\"7340.4\",\"2899.76\",\"1490.22\",\"1284.79\",\"1560.34\",\"2144.41\",\"1299.83\",\"2412.94\",\"1832.74\",\"1817.69\",\"3796.08\"],[\"-1\",\"8115.15\",\"11801.9\",\"8472.72\",\"8499.98\",\"8577.73\",\"5629.94\",\"4635.13\",\"7909.58\",\"7293.38\",\"11458.1\",\"6886.68\",\"6093.96\",\"3427.71\",\"2035.27\",\"693.593\",\"224.087\",\"2273.57\",\"1170.7\",\"442.263\",\"595.21\",\"2646.22\",\"3970.35\",\"1207.19\",\"0\",\"2.77903\",\"179.846\",\"0\",\"10.7631\",\"330.474\",\"0\",\"83.609\",\"236.99\"],[\"-1\",\"355271\",\"516393\",\"370970\",\"372584\",\"375431\",\"246819\",\"203160\",\"346512\",\"319194\",\"501438\",\"301561\",\"266674\",\"150064\",\"89050.4\",\"30366.9\",\"9805.28\",\"99370.2\",\"51201.8\",\"22398.1\",\"30128.5\",\"115882\",\"173592\",\"52777.3\",\"0\",\"140.808\",\"9122.15\",\"0\",\"545.323\",\"16739\",\"0\",\"4237.26\",\"12010.2\"],[\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0\",\"0.9025\",\"0\",\"0\",\"0.9405\",\"0\",\"0\",\"0.9405\",\"0\",\"0.80461\",\"0\"]],\"force\":\"object\"}";
		//$this->assertTrue($ret == $expected);
	}

	/*public function testDescriptorNoTables()
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
	}*/

	/*public function testDescriptorMetaCorrupt()
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
	}*/

	public function testDescriptorReturnValue()
	{
		try
		{
			$sessionID = 35;
			$ret = json_encode(Descriptor($sessionID));
			$expected = "{\"yearRange\":{\"startYear\":\"1980\",\"endYear\":\"2012\"},\"countries\":{\"1\":{\"cc2\":\"AF\",\"cc3\":\"AFG\",\"common_name\":\"Afghanistan\"},\"2\":{\"cc2\":\"AO\",\"cc3\":\"AGO\",\"common_name\":\"Angola\"},\"3\":{\"cc2\":\"AL\",\"cc3\":\"ALB\",\"common_name\":\"Albania\"},\"4\":{\"cc2\":\"AD\",\"cc3\":\"AND\",\"common_name\":\"Andorra\"},\"5\":{\"cc2\":\"AE\",\"cc3\":\"ARE\",\"common_name\":\"United Arab Emirates\"},\"6\":{\"cc2\":\"AR\",\"cc3\":\"ARG\",\"common_name\":\"Argentina\"},\"7\":{\"cc2\":\"AM\",\"cc3\":\"ARM\",\"common_name\":\"Armenia\"},\"8\":{\"cc2\":\"AG\",\"cc3\":\"ATG\",\"common_name\":\"Antigua and Barbuda\"},\"9\":{\"cc2\":\"AU\",\"cc3\":\"AUS\",\"common_name\":\"Australia\"},\"10\":{\"cc2\":\"AT\",\"cc3\":\"AUT\",\"common_name\":\"Austria\"},\"11\":{\"cc2\":\"AZ\",\"cc3\":\"AZE\",\"common_name\":\"Azerbaijan\"},\"12\":{\"cc2\":\"BI\",\"cc3\":\"BDI\",\"common_name\":\"Burundi\"},\"13\":{\"cc2\":\"BE\",\"cc3\":\"BEL\",\"common_name\":\"Belgium\"},\"14\":{\"cc2\":\"BJ\",\"cc3\":\"BEN\",\"common_name\":\"Benin\"},\"15\":{\"cc2\":\"BF\",\"cc3\":\"BFA\",\"common_name\":\"Burkina Faso\"},\"16\":{\"cc2\":\"BD\",\"cc3\":\"BGD\",\"common_name\":\"Bangladesh\"},\"17\":{\"cc2\":\"BG\",\"cc3\":\"BGR\",\"common_name\":\"Bulgaria\"},\"18\":{\"cc2\":\"BH\",\"cc3\":\"BHR\",\"common_name\":\"Bahrain\"},\"19\":{\"cc2\":\"BS\",\"cc3\":\"BHS\",\"common_name\":\"Bahamas, The\"},\"20\":{\"cc2\":\"BA\",\"cc3\":\"BIH\",\"common_name\":\"Bosnia and Herzegovina\"},\"21\":{\"cc2\":\"BY\",\"cc3\":\"BLR\",\"common_name\":\"Belarus\"},\"22\":{\"cc2\":\"BZ\",\"cc3\":\"BLZ\",\"common_name\":\"Belize\"},\"23\":{\"cc2\":\"BO\",\"cc3\":\"BOL\",\"common_name\":\"Bolivia\"},\"24\":{\"cc2\":\"BR\",\"cc3\":\"BRA\",\"common_name\":\"Brazil\"},\"25\":{\"cc2\":\"BB\",\"cc3\":\"BRB\",\"common_name\":\"Barbados\"},\"26\":{\"cc2\":\"BN\",\"cc3\":\"BRN\",\"common_name\":\"Brunei\"},\"27\":{\"cc2\":\"BT\",\"cc3\":\"BTN\",\"common_name\":\"Bhutan\"},\"28\":{\"cc2\":\"BW\",\"cc3\":\"BWA\",\"common_name\":\"Botswana\"},\"29\":{\"cc2\":\"CF\",\"cc3\":\"CAF\",\"common_name\":\"Central African Republic\"},\"30\":{\"cc2\":\"CA\",\"cc3\":\"CAN\",\"common_name\":\"Canada\"},\"31\":{\"cc2\":\"CH\",\"cc3\":\"CHE\",\"common_name\":\"Switzerland\"},\"32\":{\"cc2\":\"CL\",\"cc3\":\"CHL\",\"common_name\":\"Chile\"},\"33\":{\"cc2\":\"CN\",\"cc3\":\"CHN\",\"common_name\":\"China, People's Republic of\"},\"34\":{\"cc2\":\"CI\",\"cc3\":\"CIV\",\"common_name\":\"Cote d'Ivoire (Ivory Coast)\"},\"35\":{\"cc2\":\"CM\",\"cc3\":\"CMR\",\"common_name\":\"Cameroon\"},\"36\":{\"cc2\":\"CD\",\"cc3\":\"COD\",\"common_name\":\"Congo, (Congo ? Kinshasa)\"},\"37\":{\"cc2\":\"CG\",\"cc3\":\"COG\",\"common_name\":\"Congo, (Congo ? Brazzaville)\"},\"38\":{\"cc2\":\"CK\",\"cc3\":\"COK\",\"common_name\":\"Cook Islands\"},\"39\":{\"cc2\":\"CO\",\"cc3\":\"COL\",\"common_name\":\"Colombia\"},\"40\":{\"cc2\":\"KM\",\"cc3\":\"COM\",\"common_name\":\"Comoros\"},\"41\":{\"cc2\":\"CV\",\"cc3\":\"CPV\",\"common_name\":\"Cape Verde\"},\"42\":{\"cc2\":\"CR\",\"cc3\":\"CRI\",\"common_name\":\"Costa Rica\"},\"43\":{\"cc2\":\"CU\",\"cc3\":\"CUB\",\"common_name\":\"Cuba\"},\"44\":{\"cc2\":\"CY\",\"cc3\":\"CYP\",\"common_name\":\"Cyprus\"},\"45\":{\"cc2\":\"CZ\",\"cc3\":\"CZE\",\"common_name\":\"Czech Republic\"},\"46\":{\"cc2\":\"DE\",\"cc3\":\"DEU\",\"common_name\":\"Germany\"},\"47\":{\"cc2\":\"DJ\",\"cc3\":\"DJI\",\"common_name\":\"Djibouti\"},\"48\":{\"cc2\":\"DM\",\"cc3\":\"DMA\",\"common_name\":\"Dominica\"},\"49\":{\"cc2\":\"DK\",\"cc3\":\"DNK\",\"common_name\":\"Denmark\"},\"50\":{\"cc2\":\"DO\",\"cc3\":\"DOM\",\"common_name\":\"Dominican Republic\"},\"51\":{\"cc2\":\"DZ\",\"cc3\":\"DZA\",\"common_name\":\"Algeria\"},\"52\":{\"cc2\":\"EC\",\"cc3\":\"ECU\",\"common_name\":\"Ecuador\"},\"53\":{\"cc2\":\"EG\",\"cc3\":\"EGY\",\"common_name\":\"Egypt\"},\"54\":{\"cc2\":\"ER\",\"cc3\":\"ERI\",\"common_name\":\"Eritrea\"},\"55\":{\"cc2\":\"ES\",\"cc3\":\"ESP\",\"common_name\":\"Spain\"},\"56\":{\"cc2\":\"EE\",\"cc3\":\"EST\",\"common_name\":\"Estonia\"},\"57\":{\"cc2\":\"ET\",\"cc3\":\"ETH\",\"common_name\":\"Ethiopia\"},\"58\":{\"cc2\":\"FI\",\"cc3\":\"FIN\",\"common_name\":\"Finland\"},\"59\":{\"cc2\":\"FJ\",\"cc3\":\"FJI\",\"common_name\":\"Fiji\"},\"60\":{\"cc2\":\"FR\",\"cc3\":\"FRA\",\"common_name\":\"France\"},\"61\":{\"cc2\":\"FM\",\"cc3\":\"FSM\",\"common_name\":\"Micronesia\"},\"62\":{\"cc2\":\"GA\",\"cc3\":\"GAB\",\"common_name\":\"Gabon\"},\"63\":{\"cc2\":\"GB\",\"cc3\":\"GBR\",\"common_name\":\"United Kingdom\"},\"64\":{\"cc2\":\"GE\",\"cc3\":\"GEO\",\"common_name\":\"Georgia\"},\"65\":{\"cc2\":\"GH\",\"cc3\":\"GHA\",\"common_name\":\"Ghana\"},\"66\":{\"cc2\":\"GN\",\"cc3\":\"GIN\",\"common_name\":\"Guinea\"},\"67\":{\"cc2\":\"GM\",\"cc3\":\"GMB\",\"common_name\":\"Gambia, The\"},\"68\":{\"cc2\":\"GW\",\"cc3\":\"GNB\",\"common_name\":\"Guinea-Bissau\"},\"69\":{\"cc2\":\"GQ\",\"cc3\":\"GNQ\",\"common_name\":\"Equatorial Guinea\"},\"70\":{\"cc2\":\"GR\",\"cc3\":\"GRC\",\"common_name\":\"Greece\"},\"71\":{\"cc2\":\"GD\",\"cc3\":\"GRD\",\"common_name\":\"Grenada\"},\"72\":{\"cc2\":\"GT\",\"cc3\":\"GTM\",\"common_name\":\"Guatemala\"},\"73\":{\"cc2\":\"GY\",\"cc3\":\"GUY\",\"common_name\":\"Guyana\"},\"74\":{\"cc2\":\"HN\",\"cc3\":\"HND\",\"common_name\":\"Honduras\"},\"75\":{\"cc2\":\"HR\",\"cc3\":\"HRV\",\"common_name\":\"Croatia\"},\"76\":{\"cc2\":\"HT\",\"cc3\":\"HTI\",\"common_name\":\"Haiti\"},\"77\":{\"cc2\":\"HU\",\"cc3\":\"HUN\",\"common_name\":\"Hungary\"},\"78\":{\"cc2\":\"ID\",\"cc3\":\"IDN\",\"common_name\":\"Indonesia\"},\"79\":{\"cc2\":\"IN\",\"cc3\":\"IND\",\"common_name\":\"India\"},\"80\":{\"cc2\":\"IE\",\"cc3\":\"IRL\",\"common_name\":\"Ireland\"},\"81\":{\"cc2\":\"IR\",\"cc3\":\"IRN\",\"common_name\":\"Iran\"},\"82\":{\"cc2\":\"IQ\",\"cc3\":\"IRQ\",\"common_name\":\"Iraq\"},\"83\":{\"cc2\":\"IS\",\"cc3\":\"ISL\",\"common_name\":\"Iceland\"},\"84\":{\"cc2\":\"IL\",\"cc3\":\"ISR\",\"common_name\":\"Israel\"},\"85\":{\"cc2\":\"IT\",\"cc3\":\"ITA\",\"common_name\":\"Italy\"},\"86\":{\"cc2\":\"JM\",\"cc3\":\"JAM\",\"common_name\":\"Jamaica\"},\"87\":{\"cc2\":\"JO\",\"cc3\":\"JOR\",\"common_name\":\"Jordan\"},\"88\":{\"cc2\":\"JP\",\"cc3\":\"JPN\",\"common_name\":\"Japan\"},\"89\":{\"cc2\":\"KZ\",\"cc3\":\"KAZ\",\"common_name\":\"Kazakhstan\"},\"90\":{\"cc2\":\"KE\",\"cc3\":\"KEN\",\"common_name\":\"Kenya\"},\"91\":{\"cc2\":\"KG\",\"cc3\":\"KGZ\",\"common_name\":\"Kyrgyzstan\"},\"92\":{\"cc2\":\"KH\",\"cc3\":\"KHM\",\"common_name\":\"Cambodia\"},\"93\":{\"cc2\":\"KI\",\"cc3\":\"KIR\",\"common_name\":\"Kiribati\"},\"94\":{\"cc2\":\"KN\",\"cc3\":\"KNA\",\"common_name\":\"Saint Kitts and Nevis\"},\"95\":{\"cc2\":\"KR\",\"cc3\":\"KOR\",\"common_name\":\"Korea, South\"},\"96\":{\"cc2\":\"KW\",\"cc3\":\"KWT\",\"common_name\":\"Kuwait\"},\"97\":{\"cc2\":\"LA\",\"cc3\":\"LAO\",\"common_name\":\"Laos\"},\"98\":{\"cc2\":\"LB\",\"cc3\":\"LBN\",\"common_name\":\"Lebanon\"},\"99\":{\"cc2\":\"LR\",\"cc3\":\"LBR\",\"common_name\":\"Liberia\"},\"100\":{\"cc2\":\"LY\",\"cc3\":\"LBY\",\"common_name\":\"Libya\"},\"101\":{\"cc2\":\"LC\",\"cc3\":\"LCA\",\"common_name\":\"Saint Lucia\"},\"102\":{\"cc2\":\"LK\",\"cc3\":\"LKA\",\"common_name\":\"Sri Lanka\"},\"103\":{\"cc2\":\"LS\",\"cc3\":\"LSO\",\"common_name\":\"Lesotho\"},\"104\":{\"cc2\":\"LT\",\"cc3\":\"LTU\",\"common_name\":\"Lithuania\"},\"105\":{\"cc2\":\"LU\",\"cc3\":\"LUX\",\"common_name\":\"Luxembourg\"},\"106\":{\"cc2\":\"LV\",\"cc3\":\"LVA\",\"common_name\":\"Latvia\"},\"107\":{\"cc2\":\"MA\",\"cc3\":\"MAR\",\"common_name\":\"Morocco\"},\"108\":{\"cc2\":\"MC\",\"cc3\":\"MCO\",\"common_name\":\"Monaco\"},\"109\":{\"cc2\":\"MD\",\"cc3\":\"MDA\",\"common_name\":\"Moldova\"},\"110\":{\"cc2\":\"MG\",\"cc3\":\"MDG\",\"common_name\":\"Madagascar\"},\"111\":{\"cc2\":\"MV\",\"cc3\":\"MDV\",\"common_name\":\"Maldives\"},\"112\":{\"cc2\":\"MX\",\"cc3\":\"MEX\",\"common_name\":\"Mexico\"},\"113\":{\"cc2\":\"MH\",\"cc3\":\"MHL\",\"common_name\":\"Marshall Islands\"},\"114\":{\"cc2\":\"MK\",\"cc3\":\"MKD\",\"common_name\":\"Macedonia\"},\"115\":{\"cc2\":\"ML\",\"cc3\":\"MLI\",\"common_name\":\"Mali\"},\"116\":{\"cc2\":\"MT\",\"cc3\":\"MLT\",\"common_name\":\"Malta\"},\"117\":{\"cc2\":\"MM\",\"cc3\":\"MMR\",\"common_name\":\"Myanmar (Burma)\"},\"118\":{\"cc2\":\"ME\",\"cc3\":\"MNE\",\"common_name\":\"Montenegro\"},\"119\":{\"cc2\":\"MN\",\"cc3\":\"MNG\",\"common_name\":\"Mongolia\"},\"120\":{\"cc2\":\"MZ\",\"cc3\":\"MOZ\",\"common_name\":\"Mozambique\"},\"121\":{\"cc2\":\"MR\",\"cc3\":\"MRT\",\"common_name\":\"Mauritania\"},\"122\":{\"cc2\":\"MU\",\"cc3\":\"MUS\",\"common_name\":\"Mauritius\"},\"123\":{\"cc2\":\"MW\",\"cc3\":\"MWI\",\"common_name\":\"Malawi\"},\"124\":{\"cc2\":\"MY\",\"cc3\":\"MYS\",\"common_name\":\"Malaysia\"},\"125\":{\"cc2\":\"NA\",\"cc3\":\"NAM\",\"common_name\":\"Namibia\"},\"126\":{\"cc2\":\"NE\",\"cc3\":\"NER\",\"common_name\":\"Niger\"},\"127\":{\"cc2\":\"NG\",\"cc3\":\"NGA\",\"common_name\":\"Nigeria\"},\"128\":{\"cc2\":\"NI\",\"cc3\":\"NIC\",\"common_name\":\"Nicaragua\"},\"129\":{\"cc2\":\"NU\",\"cc3\":\"NIU\",\"common_name\":\"Niue\"},\"130\":{\"cc2\":\"NL\",\"cc3\":\"NLD\",\"common_name\":\"Netherlands\"},\"131\":{\"cc2\":\"NO\",\"cc3\":\"NOR\",\"common_name\":\"Norway\"},\"132\":{\"cc2\":\"NP\",\"cc3\":\"NPL\",\"common_name\":\"Nepal\"},\"133\":{\"cc2\":\"NR\",\"cc3\":\"NRU\",\"common_name\":\"Nauru\"},\"134\":{\"cc2\":\"NZ\",\"cc3\":\"NZL\",\"common_name\":\"New Zealand\"},\"135\":{\"cc2\":\"OM\",\"cc3\":\"OMN\",\"common_name\":\"Oman\"},\"136\":{\"cc2\":\"PK\",\"cc3\":\"PAK\",\"common_name\":\"Pakistan\"},\"137\":{\"cc2\":\"PA\",\"cc3\":\"PAN\",\"common_name\":\"Panama\"},\"138\":{\"cc2\":\"PE\",\"cc3\":\"PER\",\"common_name\":\"Peru\"},\"139\":{\"cc2\":\"PH\",\"cc3\":\"PHL\",\"common_name\":\"Philippines\"},\"140\":{\"cc2\":\"PW\",\"cc3\":\"PLW\",\"common_name\":\"Palau\"},\"141\":{\"cc2\":\"PG\",\"cc3\":\"PNG\",\"common_name\":\"Papua New Guinea\"},\"142\":{\"cc2\":\"PL\",\"cc3\":\"POL\",\"common_name\":\"Poland\"},\"143\":{\"cc2\":\"KP\",\"cc3\":\"PRK\",\"common_name\":\"Korea, North\"},\"144\":{\"cc2\":\"PT\",\"cc3\":\"PRT\",\"common_name\":\"Portugal\"},\"145\":{\"cc2\":\"PY\",\"cc3\":\"PRY\",\"common_name\":\"Paraguay\"},\"146\":{\"cc2\":\"QA\",\"cc3\":\"QAT\",\"common_name\":\"Qatar\"},\"147\":{\"cc2\":\"RO\",\"cc3\":\"ROU\",\"common_name\":\"Romania\"},\"148\":{\"cc2\":\"RU\",\"cc3\":\"RUS\",\"common_name\":\"Russia\"},\"149\":{\"cc2\":\"RW\",\"cc3\":\"RWA\",\"common_name\":\"Rwanda\"},\"150\":{\"cc2\":\"SA\",\"cc3\":\"SAU\",\"common_name\":\"Saudi Arabia\"},\"151\":{\"cc2\":\"SD\",\"cc3\":\"SDN\",\"common_name\":\"Sudan\"},\"152\":{\"cc2\":\"SN\",\"cc3\":\"SEN\",\"common_name\":\"Senegal\"},\"153\":{\"cc2\":\"SG\",\"cc3\":\"SGP\",\"common_name\":\"Singapore\"},\"154\":{\"cc2\":\"SB\",\"cc3\":\"SLB\",\"common_name\":\"Solomon Islands\"},\"155\":{\"cc2\":\"SL\",\"cc3\":\"SLE\",\"common_name\":\"Sierra Leone\"},\"156\":{\"cc2\":\"SV\",\"cc3\":\"SLV\",\"common_name\":\"El Salvador\"},\"157\":{\"cc2\":\"SM\",\"cc3\":\"SMR\",\"common_name\":\"San Marino\"},\"158\":{\"cc2\":\"SO\",\"cc3\":\"SOM\",\"common_name\":\"Somalia\"},\"159\":{\"cc2\":\"RS\",\"cc3\":\"SRB\",\"common_name\":\"Serbia\"},\"160\":{\"cc2\":\"ST\",\"cc3\":\"STP\",\"common_name\":\"Sao Tome and Principe\"},\"161\":{\"cc2\":\"SR\",\"cc3\":\"SUR\",\"common_name\":\"Suriname\"},\"162\":{\"cc2\":\"SK\",\"cc3\":\"SVK\",\"common_name\":\"Slovakia\"},\"163\":{\"cc2\":\"SI\",\"cc3\":\"SVN\",\"common_name\":\"Slovenia\"},\"164\":{\"cc2\":\"SE\",\"cc3\":\"SWE\",\"common_name\":\"Sweden\"},\"165\":{\"cc2\":\"SZ\",\"cc3\":\"SWZ\",\"common_name\":\"Swaziland\"},\"166\":{\"cc2\":\"SC\",\"cc3\":\"SYC\",\"common_name\":\"Seychelles\"},\"167\":{\"cc2\":\"SY\",\"cc3\":\"SYR\",\"common_name\":\"Syria\"},\"168\":{\"cc2\":\"TD\",\"cc3\":\"TCD\",\"common_name\":\"Chad\"},\"169\":{\"cc2\":\"TG\",\"cc3\":\"TGO\",\"common_name\":\"Togo\"},\"170\":{\"cc2\":\"TH\",\"cc3\":\"THA\",\"common_name\":\"Thailand\"},\"171\":{\"cc2\":\"TJ\",\"cc3\":\"TJK\",\"common_name\":\"Tajikistan\"},\"172\":{\"cc2\":\"TM\",\"cc3\":\"TKM\",\"common_name\":\"Turkmenistan\"},\"173\":{\"cc2\":\"TL\",\"cc3\":\"TLS\",\"common_name\":\"Timor-Leste (East Timor)\"},\"174\":{\"cc2\":\"TO\",\"cc3\":\"TON\",\"common_name\":\"Tonga\"},\"175\":{\"cc2\":\"TT\",\"cc3\":\"TTO\",\"common_name\":\"Trinidad and Tobago\"},\"176\":{\"cc2\":\"TN\",\"cc3\":\"TUN\",\"common_name\":\"Tunisia\"},\"177\":{\"cc2\":\"TR\",\"cc3\":\"TUR\",\"common_name\":\"Turkey\"},\"178\":{\"cc2\":\"TV\",\"cc3\":\"TUV\",\"common_name\":\"Tuvalu\"},\"179\":{\"cc2\":\"TZ\",\"cc3\":\"TZA\",\"common_name\":\"Tanzania\"},\"180\":{\"cc2\":\"UG\",\"cc3\":\"UGA\",\"common_name\":\"Uganda\"},\"181\":{\"cc2\":\"UA\",\"cc3\":\"UKR\",\"common_name\":\"Ukraine\"},\"182\":{\"cc2\":\"UY\",\"cc3\":\"URY\",\"common_name\":\"Uruguay\"},\"183\":{\"cc2\":\"US\",\"cc3\":\"USA\",\"common_name\":\"United States\"},\"184\":{\"cc2\":\"UZ\",\"cc3\":\"UZB\",\"common_name\":\"Uzbekistan\"},\"185\":{\"cc2\":\"VC\",\"cc3\":\"VCT\",\"common_name\":\"Saint Vincent and the Grenadines\"},\"186\":{\"cc2\":\"VE\",\"cc3\":\"VEN\",\"common_name\":\"Venezuela\"},\"187\":{\"cc2\":\"VN\",\"cc3\":\"VNM\",\"common_name\":\"Vietnam\"},\"188\":{\"cc2\":\"VU\",\"cc3\":\"VUT\",\"common_name\":\"Vanuatu\"},\"189\":{\"cc2\":\"WS\",\"cc3\":\"WSM\",\"common_name\":\"Samoa\"},\"190\":{\"cc2\":\"YE\",\"cc3\":\"YEM\",\"common_name\":\"Yemen\"},\"191\":{\"cc2\":\"ZA\",\"cc3\":\"ZAF\",\"common_name\":\"South Africa\"},\"192\":{\"cc2\":\"ZM\",\"cc3\":\"ZMB\",\"common_name\":\"Zambia\"},\"193\":{\"cc2\":\"ZW\",\"cc3\":\"ZWE\",\"common_name\":\"Zimbabwe\"}},\"stats\":{\"1\":\"births\",\"2\":\"deaths\",\"3\":\"cases\",\"4\":\"mcv1\",\"5\":\"mcv2\",\"6\":\"populations\",\"7\":\"sia\",\"8\":\"lbe_cases\",\"9\":\"lbe_mortality\",\"10\":\"ube_cases\",\"11\":\"ube_mortality\",\"12\":\"e_cases\",\"13\":\"e_mortality\"},\"instances\":{\"46\":\"jgb\"},\"sessions\":{\"35\":\"gygygy\"}}";

			$this->assertTrue($expected == $ret);
		}
		catch(Exception $e)
		{
			$this->assertTrue(false); // Should not throw exception.
		}
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
		$yearRange = array("startYear"=>"1578","endYear"=>"1628");
		$this->assertFalse(IsValidYear($year,$yearRange));
	}

	public function testIsValidYearWithinRange()
	{
		$year = "1600";
		$yearRange = array("startYear"=>"1578","endYear"=>"1628");
		$this->assertTrue(IsValidYear($year,$yearRange));
	}

	public function testIsValidYearAboveRange()
	{
		$year = "1635";
		$yearRange = array("startYear"=>"1578","endYear"=>"1628");
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
		$countryID = "-1";
		$numCountries = 400;
		$this->assertFalse(IsValidCountryID($countryID,$numCountries));
	}

	public function testIsValidCountryIDWithinRange()
	{
		$countryID = "400";
		$numCountries = 400;
		$this->assertFalse(IsValidCountryID($countryID,$numCountries));
	}

	public function testIsValidCountryIDAboveRange()
	{
		$countryID = "401";
		$numCountries = 400;
		$this->assertFalse(IsValidCountryID($countryID,$numCountries));
	}

	/*public function testGetStatNamesArchitectureError()
	{
		try
		{
			GetStatNames(new mysqli("localhost","root","","dav3iphpunittestemptymeta"));
			$this->assertTrue(false);
		}
		catch(Exception $e)
		{
			$this->assertTrue("{\"error\" : \"MySQL Architecture error\"}" == $e);
		}
	}*/

	public function testGetStatNamesReturnValue()
	{
		$database = new mysqli("localhost","root","","dav3i");
		$sessionID = 35;
		$ret = GetStatMap($database, $sessionID);
		$expected = array("Births","Reported Cases","Population","MCV1-VACCL","Estimated Mortality","MCV2-VACCL","Estimated Cases - Upper Bound","Estimated Cases","Estimated Mortality - Upper Bound","Estimated Mortality - Lower Bound","Estimated Cases - Lower Bound","SIA-VACCB");
		//echo json_encode($ret);
		$this->assertTrue($ret == $expected);
	}

	/*public function testGetTableNamesArchitectureError()
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
	}*/

	public function testGetYearRangeNoDescription()
	{
		$database = new mysqli("localhost","root","","dav3i");
		$sessionID = 36;//non-existent session
		$ret = GetYearRange($database, $sessionID);
		$expected = false;
		$this->assertTrue($ret == $expected);
	}

	public function testGetYearRangeReturnValue()
	{
		$database = new mysqli("localhost","root","","dav3i");
		$sessionID = 35;
		$ret = GetYearRange($database, $sessionID);
		$expected = ["1980","2012"];
		$this->assertTrue($ret == $expected);
	}
}