// File Name: tests.js 
// Description: This file is the implementation of the testting functions,based on the Qunit 
// prototyped in:testing.html
// Dependencies: dynamic_upload.js , lookup_table.js, graph.js
// Additional Notes: We only need to put all the functions related to the upload features 

 
 
//Description: This function is a testing function for the function "initPage()" 
//from the file loading_script.js 
//PRE: The page is not initialized  
//POST: The testing function is called and the page is initialized
QUnit.module("Init Phase Tests", {
	beforeEach: function(assert) {
		initPage();
	}
});



//Description: This function is a testing function for the function GetInitialYears(DescriptorJSON)
//from the file lookup_table.js 
//PRE: descriptorTest is a year range and the yearRange is combined with a "FirstYear" and a "LastYear" 
//POST: We test the equality of the descriptorTest and the yearRange
QUnit.test( "GetInitialYears Test", function( assert ) {
	//generic test
	var descriptorTest = {
							yearRange : [1900,2000]
						 };
	var yearRange = {
						FirstYear : 1900,
						LastYear  : 2000
					};			
						 
	assert.deepEqual( GetInitialYears(descriptorTest), yearRange );
});



//Description: This function is a testing function for the function SetGraphType(type)
//from the file setting.js
//PRE: The "type" is a graph type name , g_GraphType should be equal to the "type" 
//POST: The type name is equal to the g_GraphType
QUnit.test( "SetGraphType Test", function( assert ) {
	//set global to input
	var type = "heyo";		
	SetGraphType(type);					 
	assert.equal( type, g_GraphType );
});


//Description: This function is a testing function for the function InitializeLookupTable(DescriptorJSON)
//from the file lookup_table.js
//PRE: The descriptorTest has two parts , the cc2 & common_name.The output is a collection of cc2 and common_name with 
//specific foramt 
//POST: The cc2&common_name hold by variable descriptorTest should be equal to the output , after processed 
//by the function called InitializeLookupTable 
QUnit.test( "InitializeLookupTable Test", function( assert ) {
	//generic test
	
	var descriptorTest = {
							cc2 : [1,2,3,4,5,6,7,8,9,10],
							common_name : ["one","two","three","four","five","six","seven","eight","nine","ten"]
						 };
						 
	var output=[[1,"one",0],
				[2,"two",0],
				[3,"three",0],
				[4,"four",0],
				[5,"five",0],
				[6,"six",0],
				[7,"seven",0],
				[8,"eight",0],
				[9,"nine",0],
				[10,"ten",0]];
					 
	assert.deepEqual( InitializeLookupTable(descriptorTest), output );
});


//Description: This function is a testing function for the function GenerateStatReferenceList(DescriptorJSON)
//from the file lookup_table.js
//PRE: The variable descriptorTest holds "stats" that has several numbers 
//POST: The funtion  GenerateStatReferenceList creats the referrenceList by passing the "stats" in 
QUnit.test( "GenerateStatReferenceList Test", function( assert ) {
	//generic test

	var descriptorTest = {
							stats : ["one","two","three","four","five","six","seven","eight","nine","ten"]
						 };
						 
	var output= ["one","two","three","four","five","six","seven","eight","nine","ten"];
					 
	assert.deepEqual( GenerateStatReferenceList(descriptorTest), output );
});


//Description: This function is a testing function for the function ParseStatList()
//from the file lookup_table.js
//PRE: The variable g_StatList is a collection of stats , the output is value corresponding to those stats
//POST: The function ParseStatList() should return the value same as hte output by passing the g_StatList
QUnit.test( "ParseStatList Test", function( assert ) {
	//generic test

	g_StatList = ["Births", "Deaths", "Reported Cases", "Population", "MCV1-VACCL", "Estimated Mortality", "MCV2-VACCL",
					"Estimated Cases - Upper Bound", "Estimated Cases", "Estimated Mortality - Upper Bound",
	 				"Estimated Mortality - Lower Bound", "Estimated Cases - Lower Bound", "SIA-VACCB"];
	
	var output= [ 	[0,0,0,0,0,0,1],
					[0,1,8,5,3,2,12],
					[-1,-1,11,10,-1,-1,4],
					[-1,-1,7,9,-1,-1,6] 
				];
					 
	assert.deepEqual( ParseStatList(), output );
});


//Description: This function is a testing function for the function Update_Inputs()
//from the file lookup_table.js
//PRE: The variable tempSettings is the setting with the years 
//POST:The setting should be updated and equals to the input values/

QUnit.test( "Update Input test", function (assert) {
	var tempSettings = [1980, 2012, 2012, 0, 1];
	assert.deepEqual(UpdateInputs(),tempSettings);
});
					 

					 

//Description: This function is a testing function for the function addDiv
//from the file dynamic_upload.js
//PRE: the name of a div is provided 
//POST: The function shoul return the id of the div provided 					 
QUnit.test("addDiv Test", function (assert) {
    var divnameTest = "instance";
    
    var output= {   
	                id : "instance"
    
                };
   
	var secondOutput= "instance";
    var lastChildTest=document.getElementById("instances").lastChild;
    assert.deepEqual(addDiv(divnameTest), output);
	assert.deepEqual(lastChildTest,secondOutput);
    
    
});



//Description: This function is a testing function for the function addNameField
//from the function dynamic_upload.js
//PRE: The the placeholderText is the text in the textfiled
//POST:The addDiv function should a placeholdertext's type,palceholdertext, and its name. 
QUnit.test("addNameField", function (assert)  {
  var placeholderTextTest ="enter the session name here";
      
      
  var output={
            
                type :["text"],
                
                placeholder :["enter the session name here"],
      
                name :["instance-name-1"]
      
             }
  
  assert.deepEqual(addDiv(placeholderTextTest,"instances"), output);




    
});             



//Description: This function is a testing function for the function addInstance
//from the file dynamic_upload.js
//PRE: the variable "instance " is the name of a instance and the variable instanCount is the counter of that instance
//POST: with the providided instance and the instanceCount, the function should return the right output
QUnit.test("addInstance",function (assert){
    var output= "instance 1";
    
    
    assert.deepEqual(addInstance(),output);
    
});                    
                     

					 
//Description: This function is a testing function for the function addButton
//from the files dynamic_upload.js
//PRE:The variable "text" is the text dispalyed on the button "parentDiv" is just the parent div of that button
//POST: The function should return the name ,type and accept value of the button with specific text and parentdiv
QUnit.test("addButton",function(assert){
    
    var buttonTest={
						name :[ "instance-file-1"],
						type :['file'],
						accept :[".zip"]
                   }


    
    
    
    assert.deepEqual(addButton(addButton,"instances"),buttonTest)
});                     
                     
                     

QUnit.log( function( details )  {
	console.log( "Log: ", details.actual, details.message );
});