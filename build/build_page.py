# The purpose of this script is to find all linked libraries and css that apply on a particular page 
# (specified via CLI) and populate the relevant sections of package.json. Then, take that page's HTML
# and replace the source blocks with links to production versions of all scripts and css, and place
# the resulting HTML in the prod folder.

# To run successfully, app-wide-lib.py should be run first, as this script depends on app-wide libraries
# existing in package.json already.

import sys
import build_lib
import json

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

# iterate through and pull sources from each page
pages = packageText['pages']
for page in pages:
	# open file and read into memory
	print "Opening " +  page + ".html to extract source paths..."
	try:
		file = open(page + '.html', 'r')
		text = file.read()
		file.close()
	except:
		print "Error opening file. Ending script. (exited with code 1)"
		sys.exit(1)

	print page + ".html successfully opened and read.\n"
	print "File text:\n" + text + "\n"

	# replace source blocks of page with production versions
	try:
		text = build_lib.ReplaceLinks(text, page, packageText)
	except:
		print "Error modifying HTML. Ending script. (exited with code 3)"
		sys.exit(3)

	# create output file
	try:
		outfile = open('prod/' + page + '.html', 'w')
		outfile.write(text)
		outfile.close()
	except:
		print "Error writing to file. Ending script. (exited with code 1)"
		sys.exit(1)

	print "prod/" + page + ".html successfully created.\n"
	print "File text:\n" + text + "\n"

sys.exit(0)
