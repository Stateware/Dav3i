function SelectType()
{
	document.getElementById('lin').style.display='none';
	document.getElementById('est').style.display='none';
	document.getElementById('bar').style.display='none';
	document.getElementById('int').style.display='none';
	document.getElementById(document.getElementById('graph-type').value).style.display='block';
}
