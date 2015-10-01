<?php
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

/* File Name:           descriptorTest.php
 * Description:          This file tests the functions of descriptor.php using PHP Unit.
 * 
 * Date Created:        9/23/2015
 * Contributors:        Brent Mosier
 * Date Last Modified:  9/23/2015
 * Last Modified By:    Brent Mosier
 * Dependencies:        api_library.php
 * PRE:               NONE
 * POST:              FCTVAL == Formatted JSON String containing the countryName,
 *                      yearRange, cc2, and stats arrays
 * Additional Notes:    Before completion of this file we need a populated
 *                      database on the correct server
 */
require_once '.\..\..\src\api\descriptor.php';

 class descriptorTest extends \PHPUnit_Framework_TestCase
 {
 	
 	function testDesc()
 	{
 		//no external access
 		$expected = "{\"yearRange\":[\"1980\",\"2012\"],\"cc2\":[\"AF\",\"AO\",\"AL\",\"AD\",\"AE\",\"AR\",\"AM\",\"AG\",\"AU\",\"AT\",\"AZ\",\"BI\",\"BE\",\"BJ\",\"BF\",\"BD\",\"BG\",\"BH\",\"BS\",\"BA\",\"BY\",\"BZ\",\"BO\",\"BR\",\"BB\",\"BN\",\"BT\",\"BW\",\"CF\",\"CA\",\"CH\",\"CL\",\"CN\",\"CI\",\"CM\",\"CD\",\"CG\",\"CK\",\"CO\",\"KM\",\"CV\",\"CR\",\"CU\",\"CY\",\"CZ\",\"DE\",\"DJ\",\"DM\",\"DK\",\"DO\",\"DZ\",\"EC\",\"EG\",\"ER\",\"ES\",\"EE\",\"ET\",\"FI\",\"FJ\",\"FR\",\"FM\",\"GA\",\"GB\",\"GE\",\"GH\",\"GN\",\"GM\",\"GW\",\"GQ\",\"GR\",\"GD\",\"GT\",\"GY\",\"HN\",\"HR\",\"HT\",\"HU\",\"ID\",\"IN\",\"IE\",\"IR\",\"IQ\",\"IS\",\"IL\",\"IT\",\"JM\",\"JO\",\"JP\",\"KZ\",\"KE\",\"KG\",\"KH\",\"KI\",\"KN\",\"KR\",\"KW\",\"LA\",\"LB\",\"LR\",\"LY\",\"LC\",\"LK\",\"LS\",\"LT\",\"LU\",\"LV\",\"MA\",\"MC\",\"MD\",\"MG\",\"MV\",\"MX\",\"MH\",\"MK\",\"ML\",\"MT\",\"MM\",\"ME\",\"MN\",\"MZ\",\"MR\",\"MU\",\"MW\",\"MY\",\"NA\",\"NE\",\"NG\",\"NI\",\"NU\",\"NL\",\"NO\",\"NP\",\"NR\",\"NZ\",\"OM\",\"PK\",\"PA\",\"PE\",\"PH\",\"PW\",\"PG\",\"PL\",\"KP\",\"PT\",\"PY\",\"QA\",\"RO\",\"RU\",\"RW\",\"SA\",\"SD\",\"SN\",\"SG\",\"SB\",\"SL\",\"SV\",\"SM\",\"SO\",\"RS\",\"ST\",\"SR\",\"SK\",\"SI\",\"SE\",\"SZ\",\"SC\",\"SY\",\"TD\",\"TG\",\"TH\",\"TJ\",\"TM\",\"TL\",\"TO\",\"TT\",\"TN\",\"TR\",\"TV\",\"TZ\",\"UG\",\"UA\",\"UY\",\"US\",\"UZ\",\"VC\",\"VE\",\"VN\",\"VU\",\"WS\",\"YE\",\"ZA\",\"ZM\",\"ZW\"],\"cc3\":[\"AFG\",\"AGO\",\"ALB\",\"AND\",\"ARE\",\"ARG\",\"ARM\",\"ATG\",\"AUS\",\"AUT\",\"AZE\",\"BDI\",\"BEL\",\"BEN\",\"BFA\",\"BGD\",\"BGR\",\"BHR\",\"BHS\",\"BIH\",\"BLR\",\"BLZ\",\"BOL\",\"BRA\",\"BRB\",\"BRN\",\"BTN\",\"BWA\",\"CAF\",\"CAN\",\"CHE\",\"CHL\",\"CHN\",\"CIV\",\"CMR\",\"COD\",\"COG\",\"COK\",\"COL\",\"COM\",\"CPV\",\"CRI\",\"CUB\",\"CYP\",\"CZE\",\"DEU\",\"DJI\",\"DMA\",\"DNK\",\"DOM\",\"DZA\",\"ECU\",\"EGY\",\"ERI\",\"ESP\",\"EST\",\"ETH\",\"FIN\",\"FJI\",\"FRA\",\"FSM\",\"GAB\",\"GBR\",\"GEO\",\"GHA\",\"GIN\",\"GMB\",\"GNB\",\"GNQ\",\"GRC\",\"GRD\",\"GTM\",\"GUY\",\"HND\",\"HRV\",\"HTI\",\"HUN\",\"IDN\",\"IND\",\"IRL\",\"IRN\",\"IRQ\",\"ISL\",\"ISR\",\"ITA\",\"JAM\",\"JOR\",\"JPN\",\"KAZ\",\"KEN\",\"KGZ\",\"KHM\",\"KIR\",\"KNA\",\"KOR\",\"KWT\",\"LAO\",\"LBN\",\"LBR\",\"LBY\",\"LCA\",\"LKA\",\"LSO\",\"LTU\",\"LUX\",\"LVA\",\"MAR\",\"MCO\",\"MDA\",\"MDG\",\"MDV\",\"MEX\",\"MHL\",\"MKD\",\"MLI\",\"MLT\",\"MMR\",\"MNE\",\"MNG\",\"MOZ\",\"MRT\",\"MUS\",\"MWI\",\"MYS\",\"NAM\",\"NER\",\"NGA\",\"NIC\",\"NIU\",\"NLD\",\"NOR\",\"NPL\",\"NRU\",\"NZL\",\"OMN\",\"PAK\",\"PAN\",\"PER\",\"PHL\",\"PLW\",\"PNG\",\"POL\",\"PRK\",\"PRT\",\"PRY\",\"QAT\",\"ROU\",\"RUS\",\"RWA\",\"SAU\",\"SDN\",\"SEN\",\"SGP\",\"SLB\",\"SLE\",\"SLV\",\"SMR\",\"SOM\",\"SRB\",\"STP\",\"SUR\",\"SVK\",\"SVN\",\"SWE\",\"SWZ\",\"SYC\",\"SYR\",\"TCD\",\"TGO\",\"THA\",\"TJK\",\"TKM\",\"TLS\",\"TON\",\"TTO\",\"TUN\",\"TUR\",\"TUV\",\"TZA\",\"UGA\",\"UKR\",\"URY\",\"USA\",\"UZB\",\"VCT\",\"VEN\",\"VNM\",\"VUT\",\"WSM\",\"YEM\",\"ZAF\",\"ZMB\",\"ZWE\"],\"common_name\":[\"Afghanistan\",\"Angola\",\"Albania\",\"Andorra\",\"United Arab Emirates\",\"Argentina\",\"Armenia\",\"Antigua and Barbuda\",\"Australia\",\"Austria\",\"Azerbaijan\",\"Burundi\",\"Belgium\",\"Benin\",\"Burkina Faso\",\"Bangladesh\",\"Bulgaria\",\"Bahrain\",\"Bahamas, The\",\"Bosnia and Herzegovina\",\"Belarus\",\"Belize\",\"Bolivia\",\"Brazil\",\"Barbados\",\"Brunei\",\"Bhutan\",\"Botswana\",\"Central African Republic\",\"Canada\",\"Switzerland\",\"Chile\",\"China, People's Republic of\",\"Cote d'Ivoire (Ivory Coast)\",\"Cameroon\",\"Congo, (Congo ? Kinshasa)\",\"Congo, (Congo ? Brazzaville)\",\"Cook Islands\",\"Colombia\",\"Comoros\",\"Cape Verde\",\"Costa Rica\",\"Cuba\",\"Cyprus\",\"Czech Republic\",\"Germany\",\"Djibouti\",\"Dominica\",\"Denmark\",\"Dominican Republic\",\"Algeria\",\"Ecuador\",\"Egypt\",\"Eritrea\",\"Spain\",\"Estonia\",\"Ethiopia\",\"Finland\",\"Fiji\",\"France\",\"Micronesia\",\"Gabon\",\"United Kingdom\",\"Georgia\",\"Ghana\",\"Guinea\",\"Gambia, The\",\"Guinea-Bissau\",\"Equatorial Guinea\",\"Greece\",\"Grenada\",\"Guatemala\",\"Guyana\",\"Honduras\",\"Croatia\",\"Haiti\",\"Hungary\",\"Indonesia\",\"India\",\"Ireland\",\"Iran\",\"Iraq\",\"Iceland\",\"Israel\",\"Italy\",\"Jamaica\",\"Jordan\",\"Japan\",\"Kazakhstan\",\"Kenya\",\"Kyrgyzstan\",\"Cambodia\",\"Kiribati\",\"Saint Kitts and Nevis\",\"Korea, South\",\"Kuwait\",\"Laos\",\"Lebanon\",\"Liberia\",\"Libya\",\"Saint Lucia\",\"Sri Lanka\",\"Lesotho\",\"Lithuania\",\"Luxembourg\",\"Latvia\",\"Morocco\",\"Monaco\",\"Moldova\",\"Madagascar\",\"Maldives\",\"Mexico\",\"Marshall Islands\",\"Macedonia\",\"Mali\",\"Malta\",\"Myanmar (Burma)\",\"Montenegro\",\"Mongolia\",\"Mozambique\",\"Mauritania\",\"Mauritius\",\"Malawi\",\"Malaysia\",\"Namibia\",\"Niger\",\"Nigeria\",\"Nicaragua\",\"Niue\",\"Netherlands\",\"Norway\",\"Nepal\",\"Nauru\",\"New Zealand\",\"Oman\",\"Pakistan\",\"Panama\",\"Peru\",\"Philippines\",\"Palau\",\"Papua New Guinea\",\"Poland\",\"Korea, North\",\"Portugal\",\"Paraguay\",\"Qatar\",\"Romania\",\"Russia\",\"Rwanda\",\"Saudi Arabia\",\"Sudan\",\"Senegal\",\"Singapore\",\"Solomon Islands\",\"Sierra Leone\",\"El Salvador\",\"San Marino\",\"Somalia\",\"Serbia\",\"Sao Tome and Principe\",\"Suriname\",\"Slovakia\",\"Slovenia\",\"Sweden\",\"Swaziland\",\"Seychelles\",\"Syria\",\"Chad\",\"Togo\",\"Thailand\",\"Tajikistan\",\"Turkmenistan\",\"Timor-Leste (East Timor)\",\"Tonga\",\"Trinidad and Tobago\",\"Tunisia\",\"Turkey\",\"Tuvalu\",\"Tanzania\",\"Uganda\",\"Ukraine\",\"Uruguay\",\"United States\",\"Uzbekistan\",\"Saint Vincent and the Grenadines\",\"Venezuela\",\"Vietnam\",\"Vanuatu\",\"Samoa\",\"Yemen\",\"South Africa\",\"Zambia\",\"Zimbabwe\"],\"stats\":[\"Births\",\"Deaths\",\"Reported Cases\",\"Population\",\"MCV1-VACCL\",\"Estimated Mortality\",\"MCV2-VACCL\",\"Estimated Cases - Upper Bound\",\"Estimated Cases\",\"Estimated Mortality - Upper Bound\",\"Estimated Mortality - Lower Bound\",\"Estimated Cases - Lower Bound\",\"SIA-VACCB\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\"]}";
 		//$this->expectOutputString($expected);
 		$val = desc();
 		$this->assertTrue($val == NULL);

 		//ERROR WITH CODE:
 			//$descriptorJSON changes upon each call to it. The data remains unchanged, but there is an additional double quote every time the function is called
 			//This seems to be an error in the code itself, so I think we should discuss it to figure out what needs to be done
 	}
 	
 	/*
 	function testDescIf()
 	{
 		//external access

 	}
 	*/
 }
?>