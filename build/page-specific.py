# The purpose of this script is to find all linked libraries and css that apply on a particular page 
# (specified via CLI) and populate the relevant sections of package.json. Then, take that page's HTML
# and replace the source blocks with links to production versions of all scripts and css, and place
# the resulting HTML in the prod folder.

# To run successfully, app-wide-lib.py should be run first, as this script depends on app-wide libraries
# existing in package.json already.

import sys
import argparse
import buildLib
import json

# define command line arguments
try:
	parser = argparse.ArgumentParser(description='filename')
	parser.add_argument('-f', '--filename', help='Input file name', required=True)
	args = parser.parse_args()
except:
	print "Error defining arguments. Ending script. (exited with code 4)."
	sys.exit(4)

# open file and read into memory
print "Opening " +  args.filename + ".html to extract source paths..."
try:
	file = open(args.filename + '.html', 'r')
	text = file.read()
	file.close()
except:
	print "Error opening file. Ending script. (exited with code 1)"
	sys.exit(1)

print args.filename + ".html successfully opened and read.\n"
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

# extract page-specific css sources from index.html and place paths into relevant section of package.json
try:
	sources = buildLib.GetSources(text[text.find('<!-- page-specific css -->'):text.find('<!-- end internal page-specific css -->')], 'css')
except:
	print "Error extracting sources from document. Ending script. (exited with code 3)"
	sys.exit(3)
try:
	packageText = buildLib.ReplaceSources("css", args.filename, packageText, sources)
except:
	print "Error modifying package.json. Ending script. (exited with code 3)"
	sys.exit(3)

print "package.json successfully opened and read.\n"
print "File text:\n" + packageText + "\n"

# extract page-specific script sources from index.html and place paths into relevant section of package.json
try:
	sources = buildLib.GetSources(text[text.find('<!-- page-specific scripts -->'):text.find('<!-- end page-specific scripts -->')], 'javascript')
except:
	print "Error extracting sources from document. Ending script. (exited with code 3)"
	sys.exit(3)
try:
	packageText = buildLib.ReplaceSources("scripts", args.filename, packageText, sources)
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
