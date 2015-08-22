# The purpose of this script is to find all linked libraries and css that apply app-wide, then populate the relevant
# sections of package.json for building. The paths to the linked scripts are taken from index.html.

import sys
import build_lib
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
	packageText = json.load(package)
	package.close()
except:
	print "Error opening file. Ending script. (exited with code 1)"
	sys.exit(1)

print "package.json successfully opened and read.\n"
print "File text:\n"
print packageText
print "\n"


# extract internal libraries sources from index.html and place paths into relevant section of package.json
try:
	sources = build_lib.GetSources(text, 'internal libraries', 'javascript')
except:
	print "Error extracting sources from document. Ending script. (exited with code 3)"
	sys.exit(3)
try:
	packageText = build_lib.ReplaceSources('scripts', 'appWide', packageText, sources)
except:
	print "Error modifying package.json. Ending script. (exited with code 3)"
	sys.exit(3)

print packageText
# extract app-wide css sources from index.html and place paths into relevant section of package.json
try:
	sources = build_lib.GetSources(text, 'app-wide css', 'css')
except:
	print "Error extracting sources from document. Ending script. (exited with code 3)"
	sys.exit(3)
try:
	packageText = build_lib.ReplaceSources('css', 'appWide', packageText, sources)
except:
	print "Error modifying package.json. Ending script. (exited with code 3)"
	sys.exit(3)

# open package.json to write modified text
print "Opening package.json to replace source paths..."
try:
	outfile = open('package.json', 'w')
	json.dump(packageText, outfile)
	outfile.close()
except:
	print "Error writing to file. Ending script. (exited with code 1)"
	sys.exit(1)

print "package.json successfully opened and modified.\n"
print "File text:\n"
print packageText
print "\n"

sys.exit(0)
