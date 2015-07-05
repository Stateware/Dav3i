# The purpose of this script is to find all linked libraries and css that apply app-wide, then populate the relevant
# sections of package.json for building. The paths to the linked scripts are taken from index.html.

import sys
import buildLib
import json

# open index.html and read into memory
print "Opening index.html to extract source paths..."
try:
	file = open('index.html', 'r')
	text = file.read()
	file.close()
except:
	print "Error opening file. Ending script. (exited with code 1)"
	sys.exit(1)

print "index.html successfully opened and read.\n"
print "File text:\n" + text + "\n"

# open package.json and read into memory
print "Opening package.json to read source paths..."
try:
	package = open('package.json', 'r')
	packageText = package.read()
	package.close()
except:
	print "Error opening file. Ending script. (exited with code 1)"
	sys.exit(1)

print "package.json successfully opened and read.\n"
print "File text:\n" + packageText + "\n"

# extract internal libraries sources from index.html and place paths into relevant section of package.json
try:
	sources = buildLib.GetSources(text[text.find('<!-- internal libraries -->'):text.find('<!-- end internal libraries -->')], 'javascript')
except:
	print "Error extracting sources from document. Ending script. (exited with code 3)"
	sys.exit(3)
try:
	packageText = buildLib.ReplaceSources("scripts", "internalLib", packageText, sources)
except:
	print "Error modifying package.json. Ending script. (exited with code 3)"
	sys.exit(3)

# extract app-wide css sources from index.html and place paths into relevant section of package.json
try:
	sources = buildLib.GetSources(text[text.find('<!-- app-wide css -->'):text.find('<!-- end app-wide css -->')], 'css')
except:
	print "Error extracting sources from document. Ending script. (exited with code 3)"
	sys.exit(3)
try:
	packageText = buildLib.ReplaceSources("css", "appWide", packageText, sources)
except:
	print "Error modifying package.json. Ending script. (exited with code 3)"
	sys.exit(3)

# verify that resulting text is JSON
try:
	json.loads(packageText)
except:
	print "Modified text not valid JSON. Ending script. (exited with code 2)"
	sys.exit(2)

# open package.json to write modified text
print "Opening package.json to replace source paths..."
try:
	outfile = open('package.json', 'w')
	outfile.write(packageText)
	outfile.close()
except:
	print "Error writing to file. Ending script. (exited with code 1)"
	sys.exit(1)

print "package.json successfully opened and modified.\n"
print "File text:\n" + packageText + "\n"

sys.exit(0)
