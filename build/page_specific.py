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

	# extract page-specific css sources from index.html and place paths into relevant section of package.json
	try:
		sources = build_lib.GetSources(text, 'page-specific css', 'css')
	except:
		print "Error extracting sources from document. Ending script. (exited with code 3)"
		sys.exit(3)
	try:
		packageText = build_lib.ReplaceSources('css', page, packageText, sources)
	except:
		print "Error modifying package.json. Ending script. (exited with code 3)"
		sys.exit(3)

	# extract externally created css sources from index.html and place paths into relevant section of package.json
	try:
		sources = build_lib.GetSources(text, 'external css', 'css')
	except:
		print "Error extracting sources from document. Ending script. (exited with code 3)"
		sys.exit(3)
	try:
		packageText = build_lib.ReplaceSources('css', 'external', packageText, sources)
	except:
		print "Error modifying package.json. Ending script. (exited with code 3)"
		sys.exit(3)

	# extract page-specific script sources from index.html and place paths into relevant section of package.json
	try:
		sources = build_lib.GetSources(text, 'page-specific scripts', 'javascript')
	except:
		print "Error extracting sources from document. Ending script. (exited with code 3)"
		sys.exit(3)
	try:
		packageText = build_lib.ReplaceSources('scripts', page, packageText, sources)
	except:
		print "Error modifying package.json. Ending script. (exited with code 3)"
		sys.exit(3)

	# extract externally created script sources from index.html and place paths into relevant section of package.json
	try:
		sources = build_lib.GetSources(text, 'external libraries', 'javascript')
	except:
		print "Error extracting sources from document. Ending script. (exited with code 3)"
		sys.exit(3)
	try:
		packageText = build_lib.ReplaceSources('scripts', 'external', packageText, sources)
	except:
		print "Error modifying package.json. Ending script. (exited with code 3)"
		sys.exit(3)

	# extract remote linkages section from index.html and place paths into relevant section of package.json
	try:
		section = build_lib.GetSection(text, 'remote linkages')
	except:
		print "Error extracting section from document. Ending script. (exited with code 3)"
		sys.exit(3)
	try:
		packageText = build_lib.ReplaceSection('remote', page, packageText, section)
	except:
		print "Error modifying package.json. Ending script. (exited with code 3)"
		sys.exit(3)

	# extract inline scripts section from index.html and place paths into relevant section of package.json
	try:
		section = build_lib.GetSection(text, 'inline scripts')
	except:
		print "Error extracting section from document. Ending script. (exited with code 3)"
		sys.exit(3)
	try:
		packageText = build_lib.ReplaceSection('inline', page, packageText, section)
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
