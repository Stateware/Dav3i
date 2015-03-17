<!-- The data encoding type, enctype, MUST be specified as below -->
<form enctype="multipart/form-data" action="data_parser.php" method="POST">
	Type:<input type="text" name="data_type" /><br />
	Table Name:<input type="text" name="table_name" /><br />
	Statistic Name:<input type="text" name="stat_name" /><br />
    <!-- MAX_FILE_SIZE must precede the file input field -->
    <input type="hidden" name="MAX_FILE_SIZE" value="300000" /><br />
    <!-- Name of input element determines name in $_FILES array -->
    Send this file: <input name="userfile" type="file" /><br />
    <input type="submit" value="Send File" />
</form>