function Parser(input)
{
    this.input = input;
    this.getParsedData = parseData;
}


function parseData(json, settings)
{
    //Check to see what type of scheme we are outputting using settings

    //reading the json!!!

    //returning some sort of array

    return (json.data[1]);
}

function runThis()
{
    var json;
    json = {
        settings: "settings",
        data: [
            "data0",
            "data1",
            "data2"]
    };
    var t_parser = new Parser(json);

    var retval = t_parser.getParsedData(json, json.setings);

    alert(retval);
}