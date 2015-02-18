#Headers:

#####File Headers:

All source code files must include headers with the following fields  
`// File Name:          example.c`  
`// Description:        This file is the implementation of the functions`  
`//                     prototyped in example.h`  
`// Date Created:       1/28/2015`  
`// Contributors:       Willy Wonka, Augustus Gloop`  
`// Date Last Modified: 1/29/2015`  
`// Last Modified By:   Augustus Gloop`  
`// Dependencies:       example.h, foo_bar.c`  
`// Additional Notes:   This program is scrumdiddlyumptious!`  

#####Function Headers:

All functions must include headers with the following fields. PRE and POST conditions MUST unambiguously define the state of inputs and outputs before and after execution of the function.  
`// Author:        Dr. Seuss`  
`// Date Created:  1/28/2015`  
`// Last Modified: 1/29/2015 by Dr. Seuss`  
`// Description:   This function takes 2 integer inputs and returns the value of`  
`//                the larger input`  
`void Max(int a, int b)`  
`// PRE:  a and b are initialized`  
`// POST: if a > b, FCTVAL == a, o.w. FCTVAL == b`  

#Naming Conventions:

All names must be descriptive and unambiguous, though short enough as to not impede programming or readability. 

#####File Names:

All source code files and assets must be named with all lowercase letters, with underscores to separate words. (e.g. `example.c`, `employee_timecard.h`, `estimated_incidence.csv`, `sponsor_logos.png`)

#####Function Names:

Function names must be named with capital letters to begin words, o.w. lowercase, without underscores. (e.g. `MyFunction()`, `FooBar()`, `GetName()`, `IsVerified()`)

#####Class Names:

All class names must include the prefix `c_`, followed by their title, with first letters of words capitalized, o.w. lowercase, without underscores. (e.g. `c_Country`, `c_TimeCard`, `c_RevenueReport`, `c_Rectangle`)

#####User Created Data Type Names:

All user created data type names (names of TYPES, not INSTANCES) must be named using the same conventions as class names. This includes structs, unions, enumerated types, and abstract data structures like lists and trees. Prefixes vary as follows:
 * Enum: `e_`
 * Struct: `s_`
 * Union: `u_`

#####Argument/Data Member/Variable Names:

Names of function arguments, class data members, and variables must be named in camel case. That is, with all first letters of words capitalized except the first one, without underscores between words. (e.g. `myVariable`, `myArgument`, `revenueTotal`, `orderNumber`)

#####Array Names:

Arrays can follow regular variable naming conventions. Often, it will make sense to pluralize their names as well, for readability, but this is not always the case.

#####Indexing Variable Names:

If writing a very simple loop, the names `i`, `j`, `k` are adequate. However, if writing even a minutely complex loop, more descriptive names are good for readability. If not using single letter names, follow regular variable naming conventions.

#####Global Variable Names:

All global variables names must include the prefix “g_”, then afterwards follow class naming conventions. (e.g. `g_MyGlobal`, `g_WeProbablyShouldntUseGlobalsAnyway`)

#####Boolean Variable Names:

Boolean variables must be named according to regular variable naming conventions, with a clearly identifiable indication of true or false. Names like `status` are undescriptive. Opt instead for names like `done`, `found`, `verified`, `error`, etc. Avoid using names that negate, like `notFound`, or `notDone`, as negating these variables is confusing and clunky, giving statements like `if (!notFound)`.

#####Constant/Enumeration Names:

All constants must be named in all capital letters, with underscores separating words. (e.g. `EXAMPLE_CONSTANT`, `MAX_SIZE`)

Enumerated type values (the values themselves, not the types) must begin with the name of the type, in all caps, then are followed by an underscore the chosen name for the value in all caps. (e.g. `COLOR_RED`, `COLOR_BLUE,`  for enum called `t_Color`; `LOG_INFO`, `LOG_ERROR` for enum called `t_Log`)

#####Qualifying Prefixes and Suffixes:

When using descriptive prefixes and suffixes in variable names, like `total` in `revenueTotal`, or `first` in `firstIteration`, keep a few rules in mind: If the word indicates an order, like `first` or `last`, the word can be used as a prefix. Otherwise, it can be applied as a suffix, like `total`, `average`, `min`, or `max`)

#Structuring Your Code:

#####Tabs:

All block indents are to be done using 4 spaces. VS has an option to auto replace tabs with spaces, please use this.

#####“Magic” Numbers:

Any constants used in your code should be named constants, never hardcoded values. This gives flexibility in changing these values easily, especially when they are used more than once.

#####Loose Coupling:

Functions (or in the sense of a developed architecture, functional modules) must do one thing and do it well. Functions must take inputs, give outputs, and have good documentation for what these must be. Functions should run to at most a page or so, and more complex logic can be split up among multiple functions, giving the highest level function’s logic a number of easily understood function calls instead of complex logic.

#####Commenting:

Comment FREQUENTLY and PRECISELY. Don’t be ambiguous, and be exact in detailing what your code is doing.

#####Declaring Local Variables:

All local variables must be declared at the beginning of a given function, with an unambiguous description of the variable’s meaning in a comment on the same line.

#####Using Local Variables:

Try to consolidate references to variables as closely as you can. That is, if you reference a given variable `myVariable` at any given time, try to structure your logic in such a way that the next reference to `myVariable` doesn’t happen 40 lines later. This makes logic clearer, and gives less chance for unexpected behavior.

#####Return Values:

When returning a value from a function, never use the same variable for multiple different purposes. That is, if a function normally returns an `int` variable, don’t use the same variable to return `-1` for failure. This complicates the purpose of a given variable, and unnecessarily adds complexity.

#####Using Floating Point Numbers:

Because floating point numbers are inexact, any time the value of a `float` is checked, it must not be checked for equality; instead, it should be compared within some defined level of tolerance. (e.g. `if (float > (key - delta) && float < (key + delta))`; rather than `if (float == key)`)

*More to be added for PHP/HTML/CSS/JS specific conventions*
