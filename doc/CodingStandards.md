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

#####Documentation File Names:

All documentation files must be be named with capital letters to begin words, o.w. lowercase, without underscores. (e.g. `FrontEndArchitecture.md`, `FrontEndBlockDiagram.pdf`)

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

All global variables names must include the prefix `g_`, then afterwards follow class naming conventions. (e.g. `g_MyGlobal`, `g_WeProbablyShouldntUseGlobalsAnyway`)

#####Boolean Variable Names:

Boolean variables must be named according to regular variable naming conventions, with a clearly identifiable indication of true or false. Names like `status` are undescriptive. Opt instead for names like `done`, `found`, `verified`, `error`, etc. Avoid using names that negate, like `notFound`, or `notDone`, as negating these variables is confusing and clunky, giving statements like `if (!notFound)`.

#####Constant/Enumeration Names:

All constants must be named in all capital letters, with underscores separating words. (e.g. `EXAMPLE_CONSTANT`, `MAX_SIZE`)

Enumerated type values (the values themselves, not the types) must begin with the name of the type, in all caps, then are followed by an underscore the chosen name for the value in all caps. (e.g. `COLOR_RED`, `COLOR_BLUE,`  for enum called `t_Color`; `LOG_INFO`, `LOG_ERROR` for enum called `t_Log`)

#####Qualifying Prefixes and Suffixes:

When using descriptive prefixes and suffixes in variable names, like `total` in `revenueTotal`, or `first` in `firstIteration`, keep a few rules in mind: If the word indicates an order, like `first` or `last`, the word can be used as a prefix. Otherwise, it can be applied as a suffix, like `total`, `average`, `min`, or `max`)

#Structuring Your Code:

#####Line Length:

For languages where adding newlines does not change the function of your code, keep line width under 120 characters (including comments) in order for your code to be correctly displayed on GitHub. Note that this does not apply to certain languages, like HTML.

#####Indents:

All block indents are to be done using 4 spaces. VS has an option to auto replace tabs with spaces, please use this. All blocks must be indented to the same place vertically; this organizes your code better for readability.

#####“Magic” Numbers:

Any constants used in your code should be named constants, never hardcoded values. This gives flexibility in changing these values easily, especially when they are used more than once.

#####Loose Coupling:

Functions (or in the sense of a developed architecture, functional modules) must do one thing and do it well. Functions must take inputs, give outputs, and have good documentation for what these must be. Functions should run to at most a page or so, and more complex logic can be split up among multiple functions, giving the highest level function’s logic a number of easily understood function calls instead of complex logic.

#####Commenting:

Comment FREQUENTLY and PRECISELY. Don’t be ambiguous, and be exact in detailing what your code is doing. Note that you do not want to repeat your code in the comments; instead, document design and implementation decisions, as well as high level function.

#####Declaring Local Variables:

All local variables must be declared at the beginning of a given function, with an unambiguous description of the variable’s meaning in a comment on the same line.

#####Using Local Variables:

Try to consolidate references to variables as closely as you can. That is, if you reference a given variable `myVariable` at any given time, try to structure your logic in such a way that the next reference to `myVariable` doesn’t happen 40 lines later. This makes logic clearer, and gives less chance for unexpected behavior.

#####Return Values:

When returning a value from a function, never use the same variable for multiple different purposes. That is, if a function normally returns an `int` variable, don’t use the same variable to return `-1` for failure. This complicates the purpose of a given variable, and unnecessarily adds complexity.

#####Using Floating Point Numbers:

Because floating point numbers are inexact, any time the value of a `float` is checked, it must not be checked for equality; instead, it should be compared within some defined level of tolerance. (e.g. `if (float > (key - delta) && float < (key + delta))`; rather than `if (float == key)`)

#####Division:

NEVER divide outside of `if` statements. This is an invitation for divide by zero errors. NEVER assume a divisor can never be zero.

#####Mathematical Expressions:

Fully parenthesize each expression. Never rely on default order of operations and assume correct functionality. This invites incorrect functionality, and makes the incorrect assumption that whoever maintains your code will always understand your intention.

#Approach to Coding:

 * Always specify pre and post conditions in headers
 * Understand your logic and how your program gets from the precondition to the postcondition. You don't have to prove everything, but you have to be able to do it if you want to.
 * Understand your assumptions, and understand cases in which they are not true. This includes your architecture, platform, OS, language version, etc. Understanding this will help you better understand non-portable components.
 * Strive for *cumulative* complexity, as opposed to patchwork complexity. Cumulative complexity arises where your program is arranged logically from smaller, simpler modules. Patchwork complexity arises from complicated, ad-hoc, peculiar arrangements of modules.
 * Rely on layers of abstraction to simplify your understanding of function. No method or function should ever be more than about a page.
 * Bulletproof programs are built on bulletproof modules. Each module should do one thing and do it well.
 * Keep functions self contained. Do everything you can to reduce the influence of global or otherwise outside data; this reduces the chances of unexpected program behavior.
 * Have exactly one entrance and exit point to each module.
 * Code with the intention of testing. Even just keeping this in mind will encourage you to program defensively, and will save headaches in the process of QA.
 * Take responsibility for your contributions to the project. Never submit "hacked together" code; you must fully understand how and why your code does what it does.
 * Bugs are not autonomous malicious entities. If there's a bug, an engineer put it there. Treat it accordingly.
 * Understand the difference between coding error and design error.
 * Every function operates with a try...catch structure, even in languages that don't include this syntax. That is, your function does a thing, and if it fails in doing so, must respond to that error. Take advantage of function hierarchy and layers of abstraction to "bubble up" errors and handle them explicitly.
 * All modules must either throw exceptions or otherwise return error codes in the case of failure.
 * Validate all input parameters. Check for EVERY possible case. Documenting what valid input is is insufficient. Comments do not execute.
 * Keep Murphy's Law in mind: Anything that CAN go wrong, WILL go wrong. Plan for edge cases. Think of everything.
 * Every line of code must be evaluated against this document by at least one person who is not the author. Ideally, it is also reviewed by a second, less experienced person, who can provide a "naive" review, and challenge assumptions made by those familiar with the code.
 * Avoid changing code. A well written module should never be changed, it should be rewritten (refactored). Poorly written modules should never be contributed. Enhancements always include refactoring.
 * Avoid temporary variables if they are not necessary to function. Break this rule ONLY if it will ADD to the readability of the program.
 * Avoid repetitive code. You should also avoid repetitive code. Modularize instead. It is possible to go too far with this, but in most cases it is good practice.
 * Use standard libraries whenever possible. These are more rigorously tested than code we create, and there is no reason to waste your time re-implementing them.
 * Test your modules individually. If your modules don't work by themselves, they'll never work put together. Write tests as you code.
 * Optimize algorithms, not code. Code efficiency is rarely an issue; algorithmic complexity and ease of maintenance are.
 * All modules must have cyclomatic complexity (the number of unique paths through a module's execution) must be less than 7, though less than 5 is ideal.
 * Clear code is better than clever code. Don't introduce complexity for the sake of your ego, the engineers that maintain your code won't appreciate it as much as you do.
 * Refactor! Refactor! Refactor! Refactor! Refactor! Refactor!

*More to be added for PHP/HTML/CSS/JS specific conventions*
