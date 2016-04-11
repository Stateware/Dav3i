QUnit.module("Init Phase Tests", {
	beforeEach: function(assert) {
		ReadConfig();
	}
});

QUnit.test( "Test GetCountryDataArray", function (assert) {
	test_cache = new data_cache();

	testData = new Array(2);
	testData[0] = new Array(8);
	testData[0][0] = 55;
	testData[0][1] = 58;
	testData[0][2] = 60;
	testData[0][3] = 62;
	testData[0][4] = 57;
	testData[0][5] = 56;
	testData[0][6] = 55;
	testData[0][7] = 52;
	testData[1] = new Array(8);
	testData[1][0] = 25;
	testData[1][1] = 28;
	testData[1][2] = 30;
	testData[1][3] = 32;
	testData[1][4] = 27;
	testData[1][5] = 26;
	testData[1][6] = 25;
	testData[1][7] = 22;

	//Stat 0, Year 1990-1997
	test_cache.get(0).get(0).get(0).get(0).get(1990) = testData[0][0];
	test_cache.get(0).get(0).get(0).get(0).get(1991) = testData[0][1];
	test_cache.get(0).get(0).get(0).get(0).get(1992) = testData[0][2];
	test_cache.get(0).get(0).get(0).get(0).get(1993) = testData[0][3];
	test_cache.get(0).get(0).get(0).get(0).get(1994) = testData[0][4];
	test_cache.get(0).get(0).get(0).get(0).get(1995) = testData[0][5];
	test_cache.get(0).get(0).get(0).get(0).get(1996) = testData[0][6];
	test_cache.get(0).get(0).get(0).get(0).get(1997) = testData[0][7];

	//Stat 1, Year 1990-1997
	test_cache.get(0).get(0).get(0).get(1).get(1990) = testData[1][0];
	test_cache.get(0).get(0).get(0).get(1).get(1991) = testData[1][1];
	test_cache.get(0).get(0).get(0).get(1).get(1992) = testData[1][2];
	test_cache.get(0).get(0).get(0).get(1).get(1993) = testData[1][3];
	test_cache.get(0).get(0).get(0).get(1).get(1994) = testData[1][4];
	test_cache.get(0).get(0).get(0).get(1).get(1995) = testData[1][5];
	test_cache.get(0).get(0).get(0).get(1).get(1996) = testData[1][6];
	test_cache.get(0).get(0).get(0).get(1).get(1997) = testData[1][7];

	var result = FormatStatData(test_cache.get(0).get(0).get(0));
	assert.deepEqual(result, testData);
});


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

QUnit.test( "SetGraphType Test", function( assert ) {
	//set global to input
	var type = "heyo";		
	SetGraphType(type);					 
	assert.equal( type, g_GraphType );
});

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

QUnit.test( "GenerateStatReferenceList Test", function( assert ) {
	//generic test

	var descriptorTest = {
							stats : ["one","two","three","four","five","six","seven","eight","nine","ten"]
						 };
						 
	var output= ["one","two","three","four","five","six","seven","eight","nine","ten"];
					 
	assert.deepEqual( GenerateStatReferenceList(descriptorTest), output );
});


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


QUnit.test( "Update Input test", function (assert) {
	var tempSettings = [1980, 2012, 2012, 0, 1];
	assert.deepEqual(UpdateInputs(),tempSettings);
});
				
QUnit.test( "Fill Session Drop Down Menu test", function (assert) {
	// sample json in the format of the descriptor
	var dataJSON = {
        "instances": {"1": "instance_A", "3": "instance_B", "4": "instance_C", "7": "instance_D"},
        "sessions": {"1": "session1", "2": "session2", "3": "session3"}
	};

	var output = "session1";

	assert.deepEqual( fillSessionDropDown(dataJSON) , output);
});

QUnit.test( "Fill Instance Drop Down Menu test", function (assert) {
	// sample json in the format of the descriptor
	var dataJSON = {
        "instances": {"1": "instance4", "3": "instance6", "4": "instance7", "7": "instance8"},
        "sessions": {"1": "session1", "2": "session2", "3": "session3"}
	};

	var output = "instance4";

	assert.deepEqual( fillSessionDropDown(dataJSON) , output);
});

QUnit.module("Config Tests", {
	/*beforeEach: function(assert) {
		initPage();
	}*/
});

QUnit.test( "Load Config Test", function (assert) {
	var data = "Hi, I'm a data!";
	data.getAPI = _getAPI;
	data.setEnvironment = _setEnvironment;
	
	assert.deepEqual( LoadConfig(data), data);
	
});

QUnit.test( "_getAPI Test", function (assert) {
	this.environment="env";
	this.env = {};
	this.env.API = "Hi, I'm an API URL!";
	this._getAPI = _getAPI;
	
	assert.equal( this._getAPI(), this.env.API);
	
});

QUnit.test( "_setEnvironment succeed Test", function (assert) {
	var newEnvironment="env";
	this.env = {};
	this._setEnvironment = _setEnvironment;
	
	assert.equal( this._setEnvironment(newEnvironment), true);
	
});

QUnit.test( "_setEnvironment fail Test", function (assert) {
	var newEnvironment="env";
	this.env = undefined;
	this._setEnvironment = _setEnvironment;
	
	assert.equal( this._setEnvironment(newEnvironment), false);
	
});


QUnit.log( function( details )  {
	console.log( "Log: ", details.actual, details.message );
});