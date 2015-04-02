#Pixy Noteable Outputs
###by_country
*** performing type analysis ***

Warning: can't resolve method call (no definition found)
- name:    query<m>
- call:    C:\Users\Fetch\Documents\Eclipse\Dav3i\src\API\api_library.php:106
Warning: can't resolve method call (no definition found)
- name:    fetch_assoc<m>
- call:    C:\Users\Fetch\Documents\Eclipse\Dav3i\src\API\api_library.php:107
Warning: can't resolve method call (no definition found)
- name:    query<m>
- call:    C:\Users\Fetch\Documents\Eclipse\Dav3i\src\API\api_library.php:118
Warning: can't resolve method call (no definition found)
- name:    fetch_array<m>
- call:    C:\Users\Fetch\Documents\Eclipse\Dav3i\src\API\api_library.php:119
Warning: can't resolve method call (no definition found)
- name:    query<m>
- call:    C:\Users\Fetch\Documents\Eclipse\Dav3i\src\API\api_library.php:244
Warning: can't resolve method call (no definition found)
- name:    fetch_assoc<m>
- call:    C:\Users\Fetch\Documents\Eclipse\Dav3i\src\API\api_library.php:252
Warning: can't resolve method call (no definition found)
- name:    mysqli<m>
- call:    C:\Users\Fetch\Documents\Eclipse\Dav3i\src\API\connect.php:20
Warning: can't resolve method call (no definition found)
- name:    query<m>
- call:    C:\Users\Fetch\Documents\Eclipse\Dav3i\src\API\api_library.php:142
Warning: can't resolve method call (no definition found)
- name:    fetch_assoc<m>
- call:    C:\Users\Fetch\Documents\Eclipse\Dav3i\src\API\api_library.php:145
Warning: can't resolve method call (no definition found)
- name:    query<m>
- call:    C:\Users\Fetch\Documents\Eclipse\Dav3i\src\API\api_library.php:209
Warning: can't resolve method call (no definition found)
- name:    fetch_assoc<m>
- call:    C:\Users\Fetch\Documents\Eclipse\Dav3i\src\API\api_library.php:219
Warning: can't find function json_encode
- C:\Users\Fetch\Documents\Eclipse\Dav3i\src\API\by_country.php:30
- 
*****************
XSS Analysis BEGIN
*****************

Number of sinks: 3

XSS Analysis Output
--------------------

Vulnerability detected!
- unconditional
- C:\Users\Fetch\Documents\Eclipse\Dav3i\src\API\toolbox.php:19
- Graph: xss1

Vulnerability detected!
- unconditional
- C:\Users\Fetch\Documents\Eclipse\Dav3i\src\API\by_country.php:33
- Graph: xss2

Total Vuln Count: 2

*****************
XSS Analysis END
*****************

###by_stat
*** performing type analysis ***

Warning: can't resolve method call (no definition found)
- name:    query<m>
- call:    C:\Users\Fetch\Documents\Eclipse\Dav3i\src\API\api_library.php:244
Warning: can't resolve method call (no definition found)
- name:    fetch_assoc<m>
- call:    C:\Users\Fetch\Documents\Eclipse\Dav3i\src\API\api_library.php:252
Warning: can't resolve method call (no definition found)
- name:    mysqli<m>
- call:    C:\Users\Fetch\Documents\Eclipse\Dav3i\src\API\connect.php:20
Warning: can't resolve method call (no definition found)
- name:    query<m>
- call:    C:\Users\Fetch\Documents\Eclipse\Dav3i\src\API\api_library.php:142
Warning: can't resolve method call (no definition found)
- name:    fetch_assoc<m>
- call:    C:\Users\Fetch\Documents\Eclipse\Dav3i\src\API\api_library.php:145
Warning: can't resolve method call (no definition found)
- name:    query<m>
- call:    C:\Users\Fetch\Documents\Eclipse\Dav3i\src\API\api_library.php:64
Warning: can't resolve method call (no definition found)
- name:    fetch_assoc<m>
- call:    C:\Users\Fetch\Documents\Eclipse\Dav3i\src\API\api_library.php:65
Warning: can't resolve method call (no definition found)
- name:    query<m>
- call:    C:\Users\Fetch\Documents\Eclipse\Dav3i\src\API\api_library.php:209
Warning: can't resolve method call (no definition found)
- name:    fetch_assoc<m>
- call:    C:\Users\Fetch\Documents\Eclipse\Dav3i\src\API\api_library.php:219
Warning: can't resolve method call (no definition found)
- name:    query<m>
- call:    C:\Users\Fetch\Documents\Eclipse\Dav3i\src\API\toolbox.php:45
Warning: can't resolve method call (no definition found)
- name:    fetch_assoc<m>
- call:    C:\Users\Fetch\Documents\Eclipse\Dav3i\src\API\toolbox.php:46
Warning: can't resolve method call (no definition found)
- name:    free<m>
- call:    C:\Users\Fetch\Documents\Eclipse\Dav3i\src\API\toolbox.php:47
Warning: can't find function json_encode
- C:\Users\Fetch\Documents\Eclipse\Dav3i\src\API\by_stat.php:32

*****************
XSS Analysis BEGIN
*****************

Number of sinks: 3

XSS Analysis Output
--------------------

Vulnerability detected!
- unconditional
- C:\Users\Fetch\Documents\Eclipse\Dav3i\src\API\by_stat.php:34
- Graph: xss2

Total Vuln Count: 1

*****************
XSS Analysis END
*****************


*****************
SQL Analysis BEGIN
*****************

###descriptor

*****************
XSS Analysis BEGIN
*****************

Number of sinks: 3

XSS Analysis Output
--------------------

Vulnerability detected!
- unconditional
- C:\Users\Fetch\Documents\Eclipse\Dav3i\src\API\descriptor.php:32
- Graph: xss2

Total Vuln Count: 1

*****************
XSS Analysis END
*****************



