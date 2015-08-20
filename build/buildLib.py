import json

def GetSource(inputArray, type):
# PRE:  inputArray is a string starting with 'src="xxxxx"' or 'href="xxxxx"' taken from 
#       an HTML document. Type is 'javascript' or 'css'.
# POST: FCTVAL == the path of the linked source from the HTML document
	startIndex = inputArray.find('"')
	endIndex = inputArray[startIndex+1:len(inputArray)].find('"')+4
	if (type == 'css'):
		endIndex += 1;
	output = inputArray[startIndex+1:endIndex]
	# verify that local source contains javascript or css extension
	if (output.find('http://') == -1 and output.find('https://') == -1 and output.find('.js') == -1 and output.find('.css') == -1):
		print output
		raise ValueError('Extracted source not valid.')
	return output

def GetSources(inputArray, type):
# PRE:  inputArray is the text of some source block from an HTML document
# POST: FCTVAL == an array of all sources linked within inputArray
	if (type == "javascript"):
		qString = 'src='
	elif (type =="css"):
		qString = 'href='
	else:
		qString = 'src='
	index = inputArray.find(qString)
	sources = []

	while (index != -1):
		inputArray = inputArray[index+1:len(inputArray)]
		sources.append(GetSource(inputArray, type))
		index = inputArray.find(qString)

	# verify that all local sources exist
	for i in sources:
		if (i.find('http://') == -1 and i.find('https://') == -1):
			try:
				file = open(i, 'r')
				file.close()
			except:
				print i
				raise ValueError('File ' + i + ' does not exist.')

	return sources

def ReplaceSources(section, header, inputArray, sources):
# PRE:  section is a the name of the section of package.json to modify
#       header is the name of a subsection of package.json to modify
#       inputArray is the text of package.json
#       sources is the array of sources to assign to the field section.header of package.json
# POST: FCTVAL == inputArray s.t. section.header == sources
	remainder = inputArray[inputArray.find(section):len(inputArray)]
	startIndex = remainder.find(header)
	endIndex = startIndex + remainder[startIndex:len(remainder)].find(']')
	sourceString = header + '": ['
	for i in sources:
		sourceString += '"' + i + '"'
		sourceString += ', '
	output = inputArray[0:inputArray.find(section)]
	output += remainder[0:startIndex]
	if (sourceString[-1] == '['):
		output += sourceString[0:len(sourceString)]
	else:
		output += sourceString[0:-2]
	output += remainder[endIndex:len(remainder)]

	# verify that resulting text is JSON
	try:
		json.loads(output)
	except:
		print output
		raise ValueError('Modified text not valid JSON.')

	return output

def ReplaceLink(input, section, link, type):
# PRE:  input is the text of a file to replace
#       section is a valid source block identifier ("internal libraries", "app-wide css", etc.)
#       link is the path of some source to replace a source block with (path of production version)
#       type is either 'css' or 'javascript'
# POST: FCTVAL == input s.t. section has its links replaced with a valid link of type type to link
	startIndex = input.find('<!-- ' + section + ' -->')
	startIndex = startIndex + input[startIndex:len(input)].find('>') + 1
	endIndex = input.find('<!-- end ' + section + ' -->')
	output = input[0:startIndex] + '\n    '
	if (type == "javascript"):
		output += "<script type='text/javascript' src='" + link + "'></script>"
	elif (type == "css"):
		output += "<link rel='stylesheet' type='text/css' href='" + link + "'>"
	else:
		output += "<script type='text/javascript' src='" + link + "'></script>"
	output += '\n    ' + input[endIndex:len(input)]
	return output
