import json
import re

def GetSources(input, sectionID, type):
# PRE:  input is the text of an HTML document, sectionID is the identifier of the section
#       from which sources are desired, and type is either 'javascript' or 'css'
# POST: FCTVAL == an array of all sources of type type linked within the section section of inputArray
	# use correct source specification based on type
	if (type == "javascript"):
		qString = 'src'
	elif (type =="css"):
		qString = 'href'
	else:
		qString = 'src'

	# search for section; regular capture group won't work to take sources directly with this line for some reason
	section = re.search('begin ' + sectionID + '[\s\S]*?end ' + sectionID, input)
	section = section.group(0)

	# get capture groups from selected section
	sources = re.findall(qString + ' *?\=[\'\"]([a-zA-Z0-9\_\.\-\/\?\&\:\%]*?)[\'\"]', section)

	return sources

def GetSection(input, sectionID):
# PRE:  input is the text of an HTML document, sectionID is the identifier of the section
#       from which to pull text
# POST: FCTVAL == the full text of the section of input indicated by sectionID
	section = re.search('begin ' + sectionID + '[\s\S]*?end ' + sectionID, input)
	section = section.group(0)
	output = re.search('\-\-\>([\s\S]*)\<\!\-\-', section)
	output = output.group(1)
	output = re.sub('\n', '', output)

	return output

def ReplaceSources(section, subsection, input, sources):
# PRE:  section is a the name of the section of package.json to modify
#       subsection is the name of a subsection of package.json to modify
#       input is a dict representing the object of package.json
#       sources is the array of sources to assign to the field section.header of package.json
# POST: FCTVAL == input s.t. section.subsection == sources
	input[section][subsection] = sources

	return input

def ReplaceSection(section, subsection, input, text):
# PRE:  section is a the name of the section of package.json to modify
#       subsection is the name of a subsection of package.json to modify
#       input is a dict representing the object of package.json
#       text is the text of some buffer to place into section.subsection
# POST: FCTVAL == input s.t. section.subsection == text
	input[section][subsection] = text

	return input

def ReplaceLinks(input, page, packageText):
# PRE:  input is the text of an HTML document
#       page is the name of the document without the file extension
#       packageText is a dict representing the object of package.json including all necessary information from the link module of input
# POST: FCTVAL == input s.t. section has its links replaced with paths to production versions
	# initialize new link module as empty string
	new = ""
	# add remote linkages text block, unchanged from source
	new += packageText['remote'][page]
	# add externally created css sources
	sources = packageText['css']['external']
	for source in sources:
		new += GenerateLink(source, 'css')
	# add production version app wide style
	new += GenerateLink('app_style.min.css', 'css')
	# add production version page specific style
	new += GenerateLink(page + '.min.css', 'css')
	# add externally created javascript sources
	sources = packageText['scripts']['external']
	for source in sources:
		new += GenerateLink(source, 'javascript')
	# add production version app wide script library
	new += GenerateLink('app_lib.min.js', 'javascript')
	# add production version page specific scripts
	new += GenerateLink(page + '_lib.min.js', 'javascript')
	# add inline scripts text block, unchanged from source
	new += packageText['inline'][page]
	print new

	# replace link module in HTML document and return
	output = re.sub("\<\!\-\- begin link module[\s\S]*end link module \-\-\>", new, input)
	print output
	return output

def GenerateLink(source, type):
# PRE:  source is the path of a file to link to
#	type is either 'javascript' or 'css'
# POST: FCTVAL == an HTML tag link which links to the described source
	if (type == "javascript"):
		link = 'src'
	else:
		link = 'href'

	output = '<'
	if (type == 'javascript'):
		output += 'script '
	else:
		output += 'link rel="stylesheet"'
	output += 'type="text/' + type + '"'
	output += link + '="' + source + '"'
	if (type == 'javascript'):
		output += '></script>'
	else:
		output += '/>'

	return output
