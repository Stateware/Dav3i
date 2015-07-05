# The purpose of this script is to find all linked libraries and css that apply on a particular page 
# (specified via CLI) and populate the relevant sections of package.json. Then, take that page's HTML
# and replace the source blocks with links to production versions of all scripts and css, and place
# the resulting HTML in the prod folder.

# To run successfully, app-wide-lib.py should be run first, as this script depends on app-wide libraries
# existing in package.json already.

import sys
import argparse
import buildLib

# define command line arguments
try:
	parser = argparse.ArgumentParser(description='filename')
	parser.add_argument('-f', '--filename', help='Input file name', required=True)
	args = parser.parse_args()
except:
	print "Error defining arguments. Ending script. (exited with code 4)."
	sys.exit(4)

# open file and read into memory
print "Opening src/" + args.filename + ".html to extract source paths..."
try:
	file = open('src/' + args.filename + '.html', 'r')
	text = file.read()
	file.close()
except:
	print "Error opening file. Ending script. (exited with code 1)"
	sys.exit(1)

# replace source blocks of page with production versions
try:
	text = buildLib.ReplaceLink(text, "internal libraries", "dav3i.min.js", "javascript")
	text = buildLib.ReplaceLink(text, "app-wide css", "dav3i.css", "css")
	text = buildLib.ReplaceLink(text, "page-specific scripts", args.filename + ".min.js", "javascript")
	text = buildLib.ReplaceLink(text, "page-specific css", args.filename + ".css", "css")
except:
	print "Error modifying HTML. Ending script. (exited with code 3)"
	sys.exit(3)

# create output file
try:
	outfile = open('prod/' + args.filename + '.html', 'w')
	outfile.write(text)
	outfile.close()
except:
	print "Error writing to file. Ending script. (exited with code 1)"
	sys.exit(1)

print "prod/" + args.filename + ".html successfully created.\n"
print "File text:\n" + text + "\n"

sys.exit(0)
