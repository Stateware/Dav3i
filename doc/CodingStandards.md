#Approach to Coding

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
 * Validate all input parameters. Check for *every* possible case. Documenting what valid input is is insufficient. Comments do not execute.
 * Keep Murphy's Law in mind: Anything that CAN go wrong, WILL go wrong. Plan for edge cases. Think of everything.
 * Every line of code must be evaluated against this document by at least one person who is not the author. Ideally, it is also reviewed by a second, less experienced person, who can provide a "naive" review, and challenge assumptions made by those familiar with the code.
 * Avoid changing code. A well written module should never be changed, it should be rewritten (refactored). Poorly written modules should never be contributed. Enhancements always include refactoring.
 * Avoid temporary variables if they are not necessary to function. Break this rule *only* if it will *add* to the readability of the program.
 * Avoid repetitive code. You should also avoid repetitive code. Modularize instead. It is possible to go too far with this, but in most cases it is good practice.
 * Use standard libraries whenever possible. These are more rigorously tested than code we create, and there is no reason to waste your time re-implementing them.
 * Test your modules individually. If your modules don't work by themselves, they'll never work put together. Write tests as you code.
 * Optimize algorithms, not code. Code efficiency is rarely an issue; algorithmic complexity and ease of maintenance are.
 * All modules must have cyclomatic complexity (the number of unique paths through a module's execution) must be less than 7, though less than 5 is ideal.
 * Clear code is better than clever code. Don't introduce complexity for the sake of your ego, the engineers that maintain your code won't appreciate it as much as you do.
 * Comment FREQUENTLY and PRECISELY. Don�t be ambiguous, and be exact in detailing what your code is doing. Note that you do not want to repeat your code in the comments; instead, document design and implementation decisions, as well as high level function.
 * Refactor! Refactor! Refactor! Refactor! Refactor! Refactor!

#Headers

#####File Headers

All source code files must include headers with the following fields (commenting syntax based on language)  
`// File Name:          example.c`  
`// Description:        This file is the implementation of the functions`  
`//                     prototyped in example.h`  
`// Date Created:       1/28/2015`  
`// Contributors:       Willy Wonka, Augustus Gloop`  
`// Date Last Modified: 1/29/2015`  
`// Last Modified By:   Augustus Gloop`  
`// Dependencies:       example.h, foo_bar.c`  
`// Additional Notes:   This program is scrumdiddlyumptious!`  

#####Function Headers

All functions must include headers with the following fields. PRE and POST conditions MUST unambiguously define the state of inputs and outputs before and after execution of the function.  
`// Author:        Dr. Seuss`  
`// Date Created:  1/28/2015`  
`// Last Modified: 1/29/2015 by Dr. Seuss`  
`// Description:   This function takes 2 integer inputs and returns the value of`  
`//                the larger input`  
`void Max(int a, int b)`  
`// PRE:  a and b are initialized`  
`// POST: if a > b, FCTVAL == a, o.w. FCTVAL == b`  

#Naming Conventions

All names must be descriptive and unambiguous, though short enough as to not impede programming or readability. 

#####File Names

All source code files and assets must be named with all lowercase letters, with underscores to separate words. (e.g. `example.c`, `employee_timecard.h`, `estimated_incidence.csv`, `sponsor_logos.png`)

#####Documentation File Names

All documentation files must be be named with capital letters to begin words, o.w. lowercase, without underscores. (e.g. `FrontEndArchitecture.md`, `FrontEndBlockDiagram.pdf`)

#####Function Names

Function names must be named with capital letters to begin words, o.w. lowercase, without underscores. (e.g. `MyFunction()`, `FooBar()`, `GetName()`, `IsVerified()`)

#####Class Names

All class names must include the prefix `c_`, followed by their title, with first letters of words capitalized, o.w. lowercase, without underscores. (e.g. `c_Country`, `c_TimeCard`, `c_RevenueReport`, `c_Rectangle`)

#####User Created Data Type Names

All user created data type names (names of TYPES, not INSTANCES) must be named using the same conventions as class names. This includes structs, unions, enumerated types, and abstract data structures like lists and trees. Prefixes vary as follows:
 * Enum: `e_`
 * Struct: `s_`
 * Union: `u_`

#####Argument/Data Member/Variable Names

Names of function arguments, class data members, and variables must be named in camel case. That is, with all first letters of words capitalized except the first one, without underscores between words. (e.g. `myVariable`, `myArgument`, `revenueTotal`, `orderNumber`)

#####Array Names

Arrays can follow regular variable naming conventions. Often, it will make sense to pluralize their names as well, for readability, but this is not always the case.

#####Indexing Variable Names

If writing a very simple loop, the names `i`, `j`, `k` are adequate. However, if writing even a minutely complex loop, more descriptive names are good for readability. If not using single letter names, follow regular variable naming conventions.

#####Global Variable Names

All global variables names must include the prefix `g_`, then afterwards follow class naming conventions. (e.g. `g_MyGlobal`, `g_WeProbablyShouldntUseGlobalsAnyway`)

#####Boolean Variable Names

Boolean variables must be named according to regular variable naming conventions, with a clearly identifiable indication of true or false. Names like `status` are undescriptive. Opt instead for names like `done`, `found`, `verified`, `error`, etc. Avoid using names that negate, like `notFound`, or `notDone`, as negating these variables is confusing and clunky, giving statements like `if (!notFound)`.

#####Constant/Enumeration Names

All constants must be named in all capital letters, with underscores separating words. (e.g. `EXAMPLE_CONSTANT`, `MAX_SIZE`)

Enumerated type values (the values themselves, not the types) must begin with the name of the type, in all caps, then are followed by an underscore the chosen name for the value in all caps. (e.g. `COLOR_RED`, `COLOR_BLUE,`  for enum called `t_Color`; `LOG_INFO`, `LOG_ERROR` for enum called `t_Log`)

#####Qualifying Prefixes and Suffixes

When using descriptive prefixes and suffixes in variable names, like `total` in `revenueTotal`, or `first` in `firstIteration`, keep a few rules in mind: If the word indicates an order, like `first` or `last`, the word can be used as a prefix. Otherwise, it can be applied as a suffix, like `total`, `average`, `min`, or `max`)

#Structuring Your Code

#####Line Length

For languages where adding newlines does not change the function of your code, keep line width under 120 characters (including comments) in order for your code to be correctly displayed on GitHub. Note that this does not apply to certain languages, like HTML.

#####Indents

All block indents are to be done using 4 spaces. VS has an option to auto replace tabs with spaces, please use this. All blocks must be indented to the same place vertically; this organizes your code better for readability.

#####"Magic" Numbers

Any constants used in your code should be named constants, never hardcoded values. This gives flexibility in changing these values easily, especially when they are used more than once.

#####Loose Coupling

Functions (or in the sense of a developed architecture, functional modules) must do one thing and do it well. Functions must take inputs, give outputs, and have good documentation for what these must be. Functions should run to at most a page or so, and more complex logic can be split up among multiple functions, giving the highest level function�s logic a number of easily understood function calls instead of complex logic.

#####Declaring Local Variables

All local variables must be declared at the beginning of a given function, with an unambiguous description of the variable�s meaning in a comment on the same line.

#####Using Local Variables

Try to consolidate references to variables as closely as you can. That is, if you reference a given variable `myVariable` at any given time, try to structure your logic in such a way that the next reference to `myVariable` doesn�t happen 40 lines later. This makes logic clearer, and gives less chance for unexpected behavior.

#####Return Values

When returning a value from a function, never use the same variable for multiple different purposes. That is, if a function normally returns an `int` variable, don�t use the same variable to return `-1` for failure. This complicates the purpose of a given variable, and unnecessarily adds complexity.

#####Using Floating Point Numbers

Because floating point numbers are inexact, any time the value of a `float` is checked, it must not be checked for equality; instead, it should be compared within some defined level of tolerance. (e.g. `if (float > (key - delta) && float < (key + delta))`; rather than `if (float == key)`)

#####Division

*Never* divide outside of `if` statements. This is an invitation for divide by zero errors. *Never* assume a divisor can never be zero.

#####Mathematical Expressions

Fully parenthesize each expression. Never rely on default order of operations and assume correct functionality. This invites incorrect functionality, and makes the incorrect assumption that whoever maintains your code will always understand your intention.

#Language Specific Conventions

###HTML/CSS

#####Necessary Components of All HTML Files

Every HTML file we create *must* include `<!DOCTYPE html>`, as well as `<html>`, `<head>`, and `<body>` tags, in the appropriate order.

#####Linking External Assets

Everything external to the file that must be loaded into the browser (scripts, stylesheets, etc.) *must* be specified in the `<head>` section.

#####Inline Style and Scripts

*Never* use inline style or scripts. Our code is much better organized if all styles or scripting behavior relevant to an element is found in one file as opposed to many.

#####Choosing Elements

There are a ton of different elements to use in HTML, and they're all for different things. Don't be the engineer with a hammer that sees every problem as a nail. Understand your options and choose the right one for the job.

#####Tags

All tags must be written fully in lowercase. *Always* close tags. Open and close tags in the correct order (e.g. do `<p><strong>this</strong></p>` rather than `<p><strong>this</p></strong>`).

#####Alt Tags

When using images, *always* include alt tags.

#####Colors

Colors are always defined using hexadecimal notation (e.g. `#ffffff`, `#beeeef`). When possible, abbreviate with 3 character notation (e.g. #efe, #123).

#####ID and Class Names

ID and Class Names are fully lowercase, with hyphens to separate words (e.g. `class-name`, `element-id`).

Use descriptive and practical ID and Class names. Don't describe the style that you apply to the thing, describe what the thing is. (e.g. `error` is more descriptive than `red-text`).

#####Use of Classes

Write classes for high reusability and high modularity. If you're applying the same style to 2 or more elements, make a class. Note that "applying the same style" doesn't mean they're all exactly the same. If the differences between two elements are simply 1 or 2 parameters, you can define them under the same class and apply style as  

`.class { shared style }`  

`element0.class { specific style }`  

`element1.class { specific style }`



Further, if you want to apply a shared style to a group of elements, which has a number of subgroups, each with their own style, you can apply style as  

`.group { shared style }`  

`.group .subgroup0 { shared subgroup style }`  

`.group .subgroup1 { shared subgroup style }`  

#####CSS Selectors

While selectors like the ones defined above are okay, it's much better for both performance and readability if you only have to specify 3 or less levels. That is, we never want to write a selector like  

`.content .featured .video .classes-on-classes .we-need-to-go-deeper { style }`

To avoid this, write more specific classes for lower nested elements, or try to eliminate redundancy in your selector. If you must write a class for one element, this is preferable to using an ID in most cases.

#####Use of IDs

Use IDs only when you *need* to. IDs are of a higher specificity than anything else when styling is applied, so large stylesheets that include many of them will necessarily create overridden styling, and thus unpredictable behavior. It's worth noting that IDs are important for a lot of applications, but it's wise to keep these to a minimum. As a rule of thumb, use IDs for scripting, and avoid using them as CSS selectors.

#####Nested Elements

*Always* indent nested elements. This makes the code much more readable.

#####Comments

Comment where appropriate in HTML. If you're calling a script, describe the behavior briefly, and any user behavior that might cause that script to be called. (e.g. `<!--User clicks settings button, settings menu is made visible-->`).

In CSS, comment *every* style block with a note on where the style is applied. You shouldn't have to look at the HTML to find where a particular element or class is to understand where the style is being applied. The stylesheet should be a self-contained reference. Comment with that in mind.

#####Don't Forget What You (or another team member) Wrote

When writing CSS, it's incredibly easy to break everything and incredibly difficult to compartmentalize damage. Version control is nice for this, but that too involves a lot of work and a lot of parsing the backlog. Be as proactive as possible, and be aware of what's already written, so that you can avoid breaking other styles or selectors as you add code.

###JavaScript

For now, JavaScript conventions are mostly covered under the general guidelines. Anything JavaScript specific will be added as needed.

###PHP

#####PHP File names
Haskell Case (e.g. MyVar) because our API is structured such that the filenames for us are the function calls for front end.

#####PHP Variables
Camel Case (e.g. myVar) as is typical variable naming convention.

#####MySQL Column Names
Snake Case (my_var) so that its easy to differentiate between PHP variables and MySQL variables, as they typically have similar names.

#####File Form

 * Documentation  
`/* File Name:           FILENAME`  
`   Description:         DESCRIPTION`  
`   Date Created:        DATE`  
`   Contributors:        CONTRIBUTORS`  
`   Date Last Modified:  DATE`  
`   Last Modified By:    MODIFIER`  
`   Dependencies:        DEPENDENCIES`  
`   Input:               GET : VARIABLES THROUGH GET`  
`                        POST: VARIABLES THROUGH POST`  
`   Output:              OUTPUT`  
`*/`   
 * Requireds
```php
// ===================== Variable Declaration =====================
// ========== Error Checking and Variable Initialization ==========
// ======================= Main Computation =======================
// ===================== Function Definitions =====================
```php

#####Other Notes
Queries often require multiple variables. Let *x* be the data you're attempting to query. This is the
necessary order in which the variables must be assigned.

*$xQuery* should contain the string that is the query.
*$xResults* should contain the results returned by the query
*$xRow* should contain each row of the query
*$x* should return the data
