function Parser(input)
{
    this.input = input;
    this.getParsedData = parseData(input);
}

function parseData(json)
{
    //reading the json!!!
    var data = new Array();

    var country;
    //Loops through the countries
    //Uses hasOwnProperty because properties aren't in a form to check for a length.
    for(country=1;json.hasOwnProperty(country);country++)
    {
        var stat;
        //Loops through the stats
        for (stat = 1; json[country].hasOwnProperty(stat) ; stat++)
        {
            if (data[country - 1] == null)
                data[country - 1] = new Array();
            data[country - 1][stat - 1] = json[country][stat];
        }
    }

    //returning some sort of array
    return (data);
}

function runThis()
{
    //This is how we think the JSON looks.
    /*var data =
    {
        "1"://country 1
	    {
	        1: [1, 2, 3],//array1
	        2: [3, 4, 4],//array2
	        3: [5, 6, 7]
	    },
        "2"://country 2
	    {
	        1: [5, 6, 7],
	        2: [5, 7, 9],
	        3: [5, 8, 11]
	    }
    };*/

    //{"1":{"1":[1,2,3]}}

    var data = JSON.parse(document.getElementById("myText").value);

    var t_parser = new Parser(data);

    var retval = t_parser.getParsedData;

    document.getElementById("myTextArea").value = JSON.stringify(retval, "\n", 4);
}