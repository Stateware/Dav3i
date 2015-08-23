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

/* File Name:           data_parser.php
 * Description:         This file takes an CSV given by data_uploader.php, and parses it into
 *                      the database.
 * 
 * Date Created:        3/18/2015
 * Contributors:        Drew Lopreiato, William Bittner
 * Date Last Modified:  4/23/2015
 * Last Modified By:    Drew Lopreiato
 * Dependencies:        connect.php
 * Input:               NONE
 * Output:              NONE
 * Additional Notes:    In its current iteration, this document has security vulnerabilities
 *                      that could seriously damage the database. Keeping this file uploaded
 *                      while not actively being developed is NOT recommended.
 */

require_once("api_library.php");

if (!isset($_GET['type']))
{
	ThrowFatalError("Input is not defined: type");
}

$displayName = GetDisplayName($_POST['display_name']);
$diseaseName = strtolower($_POST['disease']);
$diseaseName = ltrim($diseaseName);

if ($_GET['type'] == 'lin')
{
	$data = file_get_contents($_FILES['userfile']['tmp_name']);
	$data = PullData($data);
	$data = Normalize($data);
	$tableName = GetTableName($displayName, $_POST['disease'], 'lin');
	AddStat($diseaseName, $displayName, $tableName, $_POST['data_type'], 'lin', $data, $_POST['tag']);
}
else if ($_GET['type'] == 'est')
{
	$dataUB = file_get_contents($_FILES['userfile1']['tmp_name']);
	$dataUB = PullData($dataUB);
	$dataUB = Normalize($dataUB);
	$tableNameUB = GetTableName($displayName, $_POST['disease'], 'eub');
	AddStat($diseaseName, $displayName, $tableNameUB, $_POST['data_type'], 'eub', $dataUB, $_POST['tag']);
	$dataST = file_get_contents($_FILES['userfile2']['tmp_name']);
	$dataST = PullData($dataST);
	$dataST = Normalize($dataST);
	$tableNameST = GetTableName($displayName, $_POST['disease'], 'est');
	AddStat($diseaseName, $displayName, $tableNameST, $_POST['data_type'], 'est', $dataST, $_POST['tag']);
	$dataLB = file_get_contents($_FILES['userfile3']['tmp_name']);
	$dataLB = PullData($dataLB);
	$dataLB = Normalize($dataLB);
	$tableNameLB = GetTableName($displayName, $_POST['disease'], 'elb');
	AddStat($diseaseName, $displayName, $tableNameLB, $_POST['data_type'], 'elb', $dataLB, $_POST['tag']);
}
else if ($_GET['type'] == 'bar')
{
	$data = file_get_contents($_FILES['userfile']['tmp_name']);
	$data = PullData($data);
	$data = Normalize($data);
	$tableName = GetTableName($displayName, $_POST['disease'], 'bar');
	AddStat($diseaseName, $displayName, $tableName, $_POST['data_type'], 'bar', $data, $_POST['tag']);
}
else if ($_GET['type'] == 'int')
{
	$data1 = file_get_contents($_FILES['userfile1']['tmp_name']);
	$data1 = PullData($data1);
	$data1 = Normalize($data1);
	$displayName1 = GetDisplayName($_POST['display_name1']);
	$tableName1 = GetTableName($displayName1, $_POST['disease'], $_POST['graph_type1']);
	$index1 = AddStat($diseaseName, $displayName1, $tableName1, $_POST['data_type1'], $_POST['graph_type1'], $data1, $_POST['tag']);
	$data2 = file_get_contents($_FILES['userfile2']['tmp_name']);
	$data2 = PullData($data2);
	$data2 = Normalize($data2);
	$displayName2 = GetDisplayName($_POST['display_name2']);
	$tableName2 = GetTableName($displayName2, $_POST['disease'], $_POST['graph_type2']);
	$index2 = AddStat($diseaseName, $displayName2, $tableName2, $_POST['data_type2'], $_POST['graph_type2'], $data2, $_POST['tag']);
	if ($_POST['data_type3'] != false && $_FILES['userfile3']['tmp_name'] != false)
	{
		$data3 = file_get_contents($_FILES['userfile3']['tmp_name']);
		$data3 = PullData($data3);
		$data3 = Normalize($data3);
		$displayName3 = GetDisplayName($_POST['display_name3']);
		$tableName3 = GetTableName($displayName3, $_POST['disease'], $_POST['graph_type3']);
		$index3 = AddStat($diseaseName, $displayName3, $tableName3, $_POST['data_type3'], $_POST['graph_type3'], $data3, $_POST['tag']);
	}
	else
	{
		$tableName3 = -1;
		$index3 = -1;
	}
	SetIntegrated($displayName, $tableName1, $index1, $tableName2, $index2, $tableName3, $index3);
}
?>
