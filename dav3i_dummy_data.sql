-- phpMyAdmin SQL Dump
-- version 4.4.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Oct 27, 2015 at 11:44 PM
-- Server version: 5.6.26
-- PHP Version: 5.6.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dav3i_new`
--

-- --------------------------------------------------------

--
-- Table structure for table `data`
--

CREATE TABLE IF NOT EXISTS `data` (
  `session_id` int(10) NOT NULL,
  `instance_id` int(10) NOT NULL,
  `country_id` int(3) NOT NULL,
  `stat_id` int(10) NOT NULL,
  `year` int(5) NOT NULL,
  `value` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `data`
--

INSERT INTO `data` (`session_id`, `instance_id`, `country_id`, `stat_id`, `year`, `value`) VALUES
(1, 1, 1, 1, 2000, 1),
(1, 1, 1, 1, 2001, 12),
(1, 1, 1, 1, 2002, 123),
(1, 1, 1, 1, 2003, 1234),
(1, 1, 1, 1, 2004, 12345),
(1, 1, 2, 1, 2000, 1),
(1, 1, 2, 1, 2001, 12),
(1, 1, 2, 1, 2002, 123),
(1, 1, 2, 1, 2003, 1234),
(1, 1, 2, 1, 2004, 12345),
(1, 2, 1, 1, 2000, 10),
(1, 2, 1, 1, 2001, 120),
(1, 2, 1, 1, 2002, 1230),
(1, 2, 1, 1, 2003, 12340),
(1, 2, 1, 1, 2004, 123450),
(1, 2, 2, 1, 2000, 10),
(1, 2, 2, 1, 2001, 120),
(1, 2, 2, 1, 2002, 1230),
(1, 2, 2, 1, 2003, 12340),
(1, 2, 2, 1, 2004, 123450),
(1, 3, 1, 1, 2000, 100),
(1, 3, 1, 1, 2001, 1200),
(1, 3, 1, 1, 2002, 12300),
(1, 3, 1, 1, 2003, 123400),
(1, 3, 1, 1, 2004, 1234500),
(1, 3, 2, 1, 2000, 1001),
(1, 3, 2, 1, 2001, 12001),
(1, 3, 2, 1, 2002, 123001),
(1, 3, 2, 1, 2003, 1234000),
(1, 3, 2, 1, 2004, 12345000),
(2, 4, 1, 1, 2000, 1),
(2, 4, 1, 1, 2001, 12),
(2, 4, 1, 1, 2002, 123),
(2, 4, 1, 1, 2003, 1234),
(2, 4, 1, 1, 2004, 12345),
(2, 4, 2, 1, 2000, 1),
(2, 4, 2, 1, 2001, 12),
(2, 4, 2, 1, 2002, 123),
(2, 4, 2, 1, 2003, 1234),
(2, 4, 2, 1, 2004, 12345),
(2, 5, 1, 1, 2000, 10),
(2, 5, 1, 1, 2001, 120),
(2, 5, 1, 1, 2002, 1230),
(2, 5, 1, 1, 2003, 12340),
(2, 5, 1, 1, 2004, 123450),
(2, 5, 2, 1, 2000, 10),
(2, 5, 2, 1, 2001, 120),
(2, 5, 2, 1, 2002, 1230),
(2, 5, 2, 1, 2003, 12340),
(2, 5, 2, 1, 2004, 123450),
(2, 6, 1, 1, 2000, 100),
(2, 6, 1, 1, 2001, 1200),
(2, 6, 1, 1, 2002, 12300),
(2, 6, 1, 1, 2003, 123400),
(2, 6, 1, 1, 2004, 1234500),
(2, 6, 2, 1, 2000, 1001),
(2, 6, 2, 1, 2001, 12001),
(2, 6, 2, 1, 2002, 123001),
(2, 6, 2, 1, 2003, 1234000),
(2, 6, 2, 1, 2004, 12345000);

-- --------------------------------------------------------

--
-- Table structure for table `meta_countries`
--

CREATE TABLE IF NOT EXISTS `meta_countries` (
  `country_id` int(3) NOT NULL,
  `cc2` varchar(2) NOT NULL,
  `cc3` varchar(3) NOT NULL,
  `common_name` varchar(32) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=194 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `meta_countries`
--

INSERT INTO `meta_countries` (`country_id`, `cc2`, `cc3`, `common_name`) VALUES
(1, 'AF', 'AFG', 'Afghanistan'),
(2, 'AO', 'AGO', 'Angola'),
(3, 'AL', 'ALB', 'Albania'),
(4, 'AD', 'AND', 'Andorra'),
(5, 'AE', 'ARE', 'United Arab Emirates'),
(6, 'AR', 'ARG', 'Argentina'),
(7, 'AM', 'ARM', 'Armenia'),
(8, 'AG', 'ATG', 'Antigua and Barbuda'),
(9, 'AU', 'AUS', 'Australia'),
(10, 'AT', 'AUT', 'Austria'),
(11, 'AZ', 'AZE', 'Azerbaijan'),
(12, 'BI', 'BDI', 'Burundi'),
(13, 'BE', 'BEL', 'Belgium'),
(14, 'BJ', 'BEN', 'Benin'),
(15, 'BF', 'BFA', 'Burkina Faso'),
(16, 'BD', 'BGD', 'Bangladesh'),
(17, 'BG', 'BGR', 'Bulgaria'),
(18, 'BH', 'BHR', 'Bahrain'),
(19, 'BS', 'BHS', 'Bahamas, The'),
(20, 'BA', 'BIH', 'Bosnia and Herzegovina'),
(21, 'BY', 'BLR', 'Belarus'),
(22, 'BZ', 'BLZ', 'Belize'),
(23, 'BO', 'BOL', 'Bolivia'),
(24, 'BR', 'BRA', 'Brazil'),
(25, 'BB', 'BRB', 'Barbados'),
(26, 'BN', 'BRN', 'Brunei'),
(27, 'BT', 'BTN', 'Bhutan'),
(28, 'BW', 'BWA', 'Botswana'),
(29, 'CF', 'CAF', 'Central African Republic'),
(30, 'CA', 'CAN', 'Canada'),
(31, 'CH', 'CHE', 'Switzerland'),
(32, 'CL', 'CHL', 'Chile'),
(33, 'CN', 'CHN', 'China, People''s Republic of'),
(34, 'CI', 'CIV', 'Cote d''Ivoire (Ivory Coast)'),
(35, 'CM', 'CMR', 'Cameroon'),
(36, 'CD', 'COD', 'Congo, (Congo ? Kinshasa)'),
(37, 'CG', 'COG', 'Congo, (Congo ? Brazzaville)'),
(38, 'CK', 'COK', 'Cook Islands'),
(39, 'CO', 'COL', 'Colombia'),
(40, 'KM', 'COM', 'Comoros'),
(41, 'CV', 'CPV', 'Cape Verde'),
(42, 'CR', 'CRI', 'Costa Rica'),
(43, 'CU', 'CUB', 'Cuba'),
(44, 'CY', 'CYP', 'Cyprus'),
(45, 'CZ', 'CZE', 'Czech Republic'),
(46, 'DE', 'DEU', 'Germany'),
(47, 'DJ', 'DJI', 'Djibouti'),
(48, 'DM', 'DMA', 'Dominica'),
(49, 'DK', 'DNK', 'Denmark'),
(50, 'DO', 'DOM', 'Dominican Republic'),
(51, 'DZ', 'DZA', 'Algeria'),
(52, 'EC', 'ECU', 'Ecuador'),
(53, 'EG', 'EGY', 'Egypt'),
(54, 'ER', 'ERI', 'Eritrea'),
(55, 'ES', 'ESP', 'Spain'),
(56, 'EE', 'EST', 'Estonia'),
(57, 'ET', 'ETH', 'Ethiopia'),
(58, 'FI', 'FIN', 'Finland'),
(59, 'FJ', 'FJI', 'Fiji'),
(60, 'FR', 'FRA', 'France'),
(61, 'FM', 'FSM', 'Micronesia'),
(62, 'GA', 'GAB', 'Gabon'),
(63, 'GB', 'GBR', 'United Kingdom'),
(64, 'GE', 'GEO', 'Georgia'),
(65, 'GH', 'GHA', 'Ghana'),
(66, 'GN', 'GIN', 'Guinea'),
(67, 'GM', 'GMB', 'Gambia, The'),
(68, 'GW', 'GNB', 'Guinea-Bissau'),
(69, 'GQ', 'GNQ', 'Equatorial Guinea'),
(70, 'GR', 'GRC', 'Greece'),
(71, 'GD', 'GRD', 'Grenada'),
(72, 'GT', 'GTM', 'Guatemala'),
(73, 'GY', 'GUY', 'Guyana'),
(74, 'HN', 'HND', 'Honduras'),
(75, 'HR', 'HRV', 'Croatia'),
(76, 'HT', 'HTI', 'Haiti'),
(77, 'HU', 'HUN', 'Hungary'),
(78, 'ID', 'IDN', 'Indonesia'),
(79, 'IN', 'IND', 'India'),
(80, 'IE', 'IRL', 'Ireland'),
(81, 'IR', 'IRN', 'Iran'),
(82, 'IQ', 'IRQ', 'Iraq'),
(83, 'IS', 'ISL', 'Iceland'),
(84, 'IL', 'ISR', 'Israel'),
(85, 'IT', 'ITA', 'Italy'),
(86, 'JM', 'JAM', 'Jamaica'),
(87, 'JO', 'JOR', 'Jordan'),
(88, 'JP', 'JPN', 'Japan'),
(89, 'KZ', 'KAZ', 'Kazakhstan'),
(90, 'KE', 'KEN', 'Kenya'),
(91, 'KG', 'KGZ', 'Kyrgyzstan'),
(92, 'KH', 'KHM', 'Cambodia'),
(93, 'KI', 'KIR', 'Kiribati'),
(94, 'KN', 'KNA', 'Saint Kitts and Nevis'),
(95, 'KR', 'KOR', 'Korea, South'),
(96, 'KW', 'KWT', 'Kuwait'),
(97, 'LA', 'LAO', 'Laos'),
(98, 'LB', 'LBN', 'Lebanon'),
(99, 'LR', 'LBR', 'Liberia'),
(100, 'LY', 'LBY', 'Libya'),
(101, 'LC', 'LCA', 'Saint Lucia'),
(102, 'LK', 'LKA', 'Sri Lanka'),
(103, 'LS', 'LSO', 'Lesotho'),
(104, 'LT', 'LTU', 'Lithuania'),
(105, 'LU', 'LUX', 'Luxembourg'),
(106, 'LV', 'LVA', 'Latvia'),
(107, 'MA', 'MAR', 'Morocco'),
(108, 'MC', 'MCO', 'Monaco'),
(109, 'MD', 'MDA', 'Moldova'),
(110, 'MG', 'MDG', 'Madagascar'),
(111, 'MV', 'MDV', 'Maldives'),
(112, 'MX', 'MEX', 'Mexico'),
(113, 'MH', 'MHL', 'Marshall Islands'),
(114, 'MK', 'MKD', 'Macedonia'),
(115, 'ML', 'MLI', 'Mali'),
(116, 'MT', 'MLT', 'Malta'),
(117, 'MM', 'MMR', 'Myanmar (Burma)'),
(118, 'ME', 'MNE', 'Montenegro'),
(119, 'MN', 'MNG', 'Mongolia'),
(120, 'MZ', 'MOZ', 'Mozambique'),
(121, 'MR', 'MRT', 'Mauritania'),
(122, 'MU', 'MUS', 'Mauritius'),
(123, 'MW', 'MWI', 'Malawi'),
(124, 'MY', 'MYS', 'Malaysia'),
(125, 'NA', 'NAM', 'Namibia'),
(126, 'NE', 'NER', 'Niger'),
(127, 'NG', 'NGA', 'Nigeria'),
(128, 'NI', 'NIC', 'Nicaragua'),
(129, 'NU', 'NIU', 'Niue'),
(130, 'NL', 'NLD', 'Netherlands'),
(131, 'NO', 'NOR', 'Norway'),
(132, 'NP', 'NPL', 'Nepal'),
(133, 'NR', 'NRU', 'Nauru'),
(134, 'NZ', 'NZL', 'New Zealand'),
(135, 'OM', 'OMN', 'Oman'),
(136, 'PK', 'PAK', 'Pakistan'),
(137, 'PA', 'PAN', 'Panama'),
(138, 'PE', 'PER', 'Peru'),
(139, 'PH', 'PHL', 'Philippines'),
(140, 'PW', 'PLW', 'Palau'),
(141, 'PG', 'PNG', 'Papua New Guinea'),
(142, 'PL', 'POL', 'Poland'),
(143, 'KP', 'PRK', 'Korea, North'),
(144, 'PT', 'PRT', 'Portugal'),
(145, 'PY', 'PRY', 'Paraguay'),
(146, 'QA', 'QAT', 'Qatar'),
(147, 'RO', 'ROU', 'Romania'),
(148, 'RU', 'RUS', 'Russia'),
(149, 'RW', 'RWA', 'Rwanda'),
(150, 'SA', 'SAU', 'Saudi Arabia'),
(151, 'SD', 'SDN', 'Sudan'),
(152, 'SN', 'SEN', 'Senegal'),
(153, 'SG', 'SGP', 'Singapore'),
(154, 'SB', 'SLB', 'Solomon Islands'),
(155, 'SL', 'SLE', 'Sierra Leone'),
(156, 'SV', 'SLV', 'El Salvador'),
(157, 'SM', 'SMR', 'San Marino'),
(158, 'SO', 'SOM', 'Somalia'),
(159, 'RS', 'SRB', 'Serbia'),
(160, 'ST', 'STP', 'Sao Tome and Principe'),
(161, 'SR', 'SUR', 'Suriname'),
(162, 'SK', 'SVK', 'Slovakia'),
(163, 'SI', 'SVN', 'Slovenia'),
(164, 'SE', 'SWE', 'Sweden'),
(165, 'SZ', 'SWZ', 'Swaziland'),
(166, 'SC', 'SYC', 'Seychelles'),
(167, 'SY', 'SYR', 'Syria'),
(168, 'TD', 'TCD', 'Chad'),
(169, 'TG', 'TGO', 'Togo'),
(170, 'TH', 'THA', 'Thailand'),
(171, 'TJ', 'TJK', 'Tajikistan'),
(172, 'TM', 'TKM', 'Turkmenistan'),
(173, 'TL', 'TLS', 'Timor-Leste (East Timor)'),
(174, 'TO', 'TON', 'Tonga'),
(175, 'TT', 'TTO', 'Trinidad and Tobago'),
(176, 'TN', 'TUN', 'Tunisia'),
(177, 'TR', 'TUR', 'Turkey'),
(178, 'TV', 'TUV', 'Tuvalu'),
(179, 'TZ', 'TZA', 'Tanzania'),
(180, 'UG', 'UGA', 'Uganda'),
(181, 'UA', 'UKR', 'Ukraine'),
(182, 'UY', 'URY', 'Uruguay'),
(183, 'US', 'USA', 'United States'),
(184, 'UZ', 'UZB', 'Uzbekistan'),
(185, 'VC', 'VCT', 'Saint Vincent and the Grenadines'),
(186, 'VE', 'VEN', 'Venezuela'),
(187, 'VN', 'VNM', 'Vietnam'),
(188, 'VU', 'VUT', 'Vanuatu'),
(189, 'WS', 'WSM', 'Samoa'),
(190, 'YE', 'YEM', 'Yemen'),
(191, 'ZA', 'ZAF', 'South Africa'),
(192, 'ZM', 'ZMB', 'Zambia'),
(193, 'ZW', 'ZWE', 'Zimbabwe');

-- --------------------------------------------------------

--
-- Table structure for table `meta_instance`
--

CREATE TABLE IF NOT EXISTS `meta_instance` (
  `instance_id` int(10) NOT NULL,
  `instance_name` varchar(32) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `meta_instance`
--

INSERT INTO `meta_instance` (`instance_id`, `instance_name`) VALUES
(1, 'Dav3iData'),
(2, 'asdf'),
(3, 'instance3'),
(4, 'instance4'),
(5, 'instance5'),
(6, 'instance6');

-- --------------------------------------------------------

--
-- Table structure for table `meta_session`
--

CREATE TABLE IF NOT EXISTS `meta_session` (
  `session_id` int(10) NOT NULL,
  `session_name` varchar(32) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `meta_session`
--

INSERT INTO `meta_session` (`session_id`, `session_name`) VALUES
(1, 'session1'),
(2, 'session2'),
(3, 'session3');

-- --------------------------------------------------------

--
-- Table structure for table `meta_stats`
--

CREATE TABLE IF NOT EXISTS `meta_stats` (
  `stat_id` int(10) NOT NULL,
  `stat_name` varchar(32) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `meta_stats`
--

INSERT INTO `meta_stats` (`stat_id`, `stat_name`) VALUES
(1, 'births'),
(2, 'deaths'),
(3, 'cases'),
(4, 'mcv1'),
(5, 'mcv2'),
(6, 'populations'),
(7, 'sia'),
(8, 'lbe_cases'),
(9, 'lbe_mortality'),
(10, 'ube_cases'),
(11, 'ube_mortality'),
(12, 'e_cases'),
(13, 'e_mortality');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `data`
--
ALTER TABLE `data`
  ADD PRIMARY KEY (`session_id`,`instance_id`,`country_id`,`stat_id`,`year`),
  ADD KEY `instance_id_foreign_key_constraint` (`instance_id`),
  ADD KEY `country_id_foreign_key_constraint` (`country_id`),
  ADD KEY `stat_id_foreign_key_constraint` (`stat_id`);

--
-- Indexes for table `meta_countries`
--
ALTER TABLE `meta_countries`
  ADD PRIMARY KEY (`country_id`);

--
-- Indexes for table `meta_instance`
--
ALTER TABLE `meta_instance`
  ADD PRIMARY KEY (`instance_id`);

--
-- Indexes for table `meta_session`
--
ALTER TABLE `meta_session`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `meta_stats`
--
ALTER TABLE `meta_stats`
  ADD PRIMARY KEY (`stat_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `meta_countries`
--
ALTER TABLE `meta_countries`
  MODIFY `country_id` int(3) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=194;
--
-- AUTO_INCREMENT for table `meta_instance`
--
ALTER TABLE `meta_instance`
  MODIFY `instance_id` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `meta_session`
--
ALTER TABLE `meta_session`
  MODIFY `session_id` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `meta_stats`
--
ALTER TABLE `meta_stats`
  MODIFY `stat_id` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=14;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `data`
--
ALTER TABLE `data`
  ADD CONSTRAINT `country_id_foreign_key_constraint` FOREIGN KEY (`country_id`) REFERENCES `meta_countries` (`country_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `instance_id_foreign_key_constraint` FOREIGN KEY (`instance_id`) REFERENCES `meta_instance` (`instance_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `session_id_foreign_key_constraint` FOREIGN KEY (`session_id`) REFERENCES `meta_session` (`session_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `stat_id_foreign_key_constraint` FOREIGN KEY (`stat_id`) REFERENCES `meta_stats` (`stat_id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
