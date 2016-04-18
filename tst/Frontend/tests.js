QUnit.module("Init Phase Tests", {
	beforeEach: function(assert) {
		initPage();
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

QUnit.test( "PopulateSessionNames test", function (assert) {
	var sessions = {0:"zero", 1:"one", 2:"two"};
	
	var emptyCache = new data_cache();
	
	var finalCache = new data_cache();
	finalCache[0] = new data_cache();
	finalCache[0].name="zero";
	finalCache[1] = new data_cache();
	finalCache[1].name="one";
	finalCache[2] = new data_cache();
	finalCache[2].name="two";
	finalCache.keys=[0,1,2];
	
	
	assert.deepEqual(PopulateSessionNames(sessions,emptyCache),finalCache);
});

QUnit.test( "PopulateInstanceNames test", function (assert) {
	var instances = {0:"zero", 1:"one", 2:"two"};
	var sessionID = 0;
	var emptyCache = new data_cache();
	
	var finalCache = new data_cache();
	finalCache[0] = new data_cache();
	finalCache[0][0] = new data_cache();
	finalCache[0][0].name = "zero";
	finalCache[0][1] = new data_cache();
	finalCache[0][1].name = "one";
	finalCache[0][2] = new data_cache();
	finalCache[0][2].name = "two";
	finalCache.keys=[0];
	finalCache[0].keys = [0,1,2];
	
	
	assert.deepEqual(PopulateInstanceNames(sessionID, instances, emptyCache),finalCache);
});

QUnit.test( "IsRegionSelected not in test", function (assert) {
	var map = {};
	map.getSelectedRegions = function(){ return ["US","MX","CA"]; };
	var lookupTable = {};
	lookupTable[1]={};
	lookupTable[1][0]="UX";
	
	
		
	assert.equal(IsRegionSelected(1, map, lookupTable),false);
});

QUnit.test( "IsRegionSelected test", function (assert) {
	var map = {};
	map.getSelectedRegions = function(){ return ["US","MX","CA"]; };
	var lookupTable = {};
	lookupTable[1]={};
	lookupTable[1][0]="US";
	
	
		
	assert.equal(IsRegionSelected(1, map, lookupTable),true);
});


QUnit.log( function( details )  {
	console.log( "Log: ", details.actual, details.message );
});



QUnit.test( "t_AsdsNode Constructor test", function (assert) {
    //params
    var numRuns = 3;
    var startYear = 1990;
    var name = "TEST NODE";
    var runParams = [];
    
    //run params
    runParams[0] = new Array(2);
    runParams[0]["numYears"] = 10;
    runParams[0]["shuffleYears"] = false;
    
    runParams[1] = new Array(2);
    runParams[1]["numYears"] = 10;
    runParams[1]["shuffleYears"] = true;
    
    runParams[2] = new Array(2);
    runParams[2]["numYears"] = 1;
    runParams[2]["shuffleYears"] = false;
    
    //do test runs
    for(var run = 0; run < numRuns; run++)
    {
        var numYears = runParams[run]["numYears"];
        
        //variables
        var cache = new data_cache();
        var testNode;
        var years = new Array(numYears);
        var data = new Array(numYears);
        var minData = Number.MAX_SAFE_INTEGER;
        var maxData = Number.MIN_SAFE_INTEGER;
        
        //fill years & data arrays
        for(var i = 0; i < numYears; i++)
        {
            years[i] = startYear + i;
            data[i] = Math.floor((Math.random() * 100) + 1);
            
            //check for new min & max Data
            if(data[i] < minData)
                minData = data[i];
            if(data[i] > maxData)
                maxData = data[i];
        }
        
        //shuffle years so they aren't sorted
        if(runParams[run]["shuffleYears"])
        {
            var a = 0;
            var b = 0;
            var temp = null;

            for (a = years.length - 1; a > 0; a -= 1) {
                b = Math.floor(Math.random() * (a + 1))
                temp = years[a]
                years[a] = years[b]
                years[b] = temp
            }
        }
        
        //create cache object
        for(var i = 0; i < numYears; i++)
        {
            cache.set(years[i], data[i]);
        }
        
        //call to function under test
        testNode = t_graphStat(cache, name); 
        
        //check values
        for(var i = 1; i < numYears; i++) //years are sorted
        {
            assert.equal(testNode.years[i-1] < testNode.years[i], true); 
        }
        
        for(var i = 0; i < numYears; i++) //data matches for each year
        {
            assert.equal(cache.get(testNode.years[i]), testNode.data[i]);
        }
        assert.equal(testNode.name, name); //name is correct
        assert.equal(testNode.min, minData); //min is correct
        assert.equal(testNode.max, maxData); //max is correct
    }
});
