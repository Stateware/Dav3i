#Stateware Coding Standards

##Headers

#####File Headers

All source code files must include headers with the following fields (commenting syntax based on language)  
`// File Name:          example.c`  
`// Description:        This file is the implementation of the functions`  
`//                     prototyped in example.h`  
`// Dependencies:       example.h, foo_bar.c`  
`// Additional Notes:   This program is scrumdiddlyumptious!`  

#####Function Headers

All functions must include headers with the following fields. PRE and POST conditions MUST unambiguously define the state of inputs and outputs before and after execution of the function.  
`// Description:   This function takes 2 integer inputs and returns the value of`  
`//                the larger input`  
`function Max(int a, int b)`  
`// PRE:  a and b are initialized`  
`// POST: if a > b, FCTVAL == a, o.w. FCTVAL == b`  

##Commenting

It is better to comment too much than it is to not comment enough. Each piece of logic in a function should have a comment briefly explaining what it does.

##Naming Conventions

All names must be descriptive and unambiguous, though short enough as to not impede programming or readability. Use your common sense and don't use names that can be easily confused.

#####File Names

All source code files and assets must be named with all lowercase letters, with underscores to separate words. (e.g. `example.c`, `employee_timecard.h`, `estimated_incidence.csv`, `sponsor_logos.png`)

#####Documentation File Names

All documentation files must be be named with capital letters to begin words, o.w. lowercase, without underscores. (e.g. `FrontEndArchitecture.md`, `FrontEndBlockDiagram.pdf`)

#####Function Names

Function names must be named with capital letters to begin words, o.w. lowercase, without underscores. (e.g. `MyFunction()`, `FooBar()`, `GetName()`, `IsVerified()`)

#####Class Names

All class names must be named with capital letters to begin words, o.w. lowercase, without underscores.(e.g. `Country`, `TimeCard`, `RevenueReport`, `Rectangle`)

#####Argument/Data Member/Variable Names

Names of function arguments, class data members, and variables must be named in camel case. That is, with all first letters of words capitalized except the first one, without underscores between words. (e.g. `myVariable`, `myArgument`, `revenueTotal`, `orderNumber`)

#####Indexing Variable Names

If writing a very simple loop, the names `i`, `j`, `k` are adequate. However, if writing a relatively complex loop, more descriptive names are good for readability. If not using single letter names, follow regular variable naming conventions.

#####Global Variable Names

All global variables names must include the prefix `g_`, then afterwards follow class naming conventions. (e.g. `g_MyGlobal`)

#####Boolean Variable Names

Boolean variables must be named according to regular variable naming conventions, with a clearly identifiable indication of true or false. Names like `status` are undescriptive. Opt instead for names like `done`, `found`, `verified`, `error`, etc. Avoid using names that negate, like `notFound`, or `notDone`, as negating these variables is confusing and clunky, giving statements like `if (!notFound)`.

#####Constant/Enumeration Names

All constants must be named in all capital letters, with underscores separating words. (e.g. `EXAMPLE_CONSTANT`, `MAX_SIZE`)

#####Acronyms or Initialisms in Names

Treat acronyms or initialisms as regular words for the purposes of naming. Follow the regular convention for whatever you are naming.

##Structuring Your Code

#####Indents

Consistently tab *all* blocks so that the organization of your code is easily readable. Open and close parentheses of each block should match horizontally.

#####"Magic" Numbers

Any constants used in your code should be named constants, never hardcoded values. This gives flexibility in changing these values easily, especially when they are used more than once. The golden rule is "If you want to change something, you should only have to change it in one place."

#####Global Variables

Global variables that are not constants are dangerous and can cause errors that are difficult to debug. Avoid using globals that are not constants whenever possible.

#####Loose Coupling

Functions (or in the sense of a developed architecture, functional modules) must do one thing and do it well. Functions must take inputs, give outputs, and have good documentation for what these must be. Functions should run to at most a page or so, and more complex logic can be split up among multiple functions, giving the highest level function's logic a number of easily understood function calls instead of complex logic.

#####Declaring Local Variables

All local variables must be declared at the beginning of a given function, with an unambiguous description of the variable's meaning in a comment on the same line.

#####Return Values

When returning a value from a function, never use the same variable for multiple different purposes. That is, if a function normally returns an `int` variable, don't use the same variable to return `-1` for failure. This complicates the purpose of a given variable, and unnecessarily adds complexity.

#####Using Floating Point Numbers

Because floating point numbers are inexact, any time the value of a `float` is checked, it must not be checked for equality; instead, it should be compared within some defined level of tolerance. (e.g. `if (float > (key - delta) && float < (key + delta))`; rather than `if (float == key)`)

#####Division

*Never* divide outside of `if` statements. This is an invitation for divide by zero errors. *Never* assume a divisor can never be zero.

#####Mathematical Expressions

Fully parenthesize each expression. Never rely on default order of operations and assume correct functionality. This invites incorrect functionality, and makes the incorrect assumption that whoever maintains your code will always understand your intention. Don't parenthesize atomic statements (jshint will sniff this out for us).

##Language Specific Conventions

####HTML/CSS

#####Necessary Components of All HTML Files

Every HTML file we create *must* include `<!DOCTYPE html>`, as well as `<html>`, `<head>`, and `<body>` tags, in the appropriate order.

#####Linking External Assets

Everything external to the file that must be loaded into the browser (scripts, stylesheets, etc.) *must* be specified in the `<head>` section. You *must* link assets as described in the **Build Lifecycle** section of the readme. Order of libraries does not matter, but the order of automatic page specific code modules does. Keep this in mind when linking.

#####Inline Style and Scripts

*Never* use inline style or scripts. Our code is much better organized if all styles or scripting behavior relevant to an element is found in one file as opposed to many.

#####Choosing Elements

There are a ton of different elements to use in HTML, and they're all for different things. Don't be the engineer with a hammer that sees every problem as a nail. Understand your options and choose the right one for the job.

#####Tags

All tags must be written fully in lowercase. *Always* close tags. Open and close tags in the correct order (e.g. do `<p><strong>text</strong></p>` rather than `<p><strong>text</p></strong>`).

#####Nested Elements

*Always* indent nested elements. This makes the code much more readable.

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

To avoid this, write more specific classes for lower nested elements, or try to eliminate redundancy in your selector. If you want to style one element, you should still apply a class to it instead of using an ID as a selector.

#####Use of IDs

*Never* use an ID as a selector. IDs are of a higher specificity than anything else when styling is applied, so large stylesheets that include many of them will necessarily create overridden styling, and thus unpredictable behavior. Use classes instead, even if you're styling one element.

#####Comments

Comment where appropriate in HTML. If you're calling a script using an event listener, describe the behavior briefly, and any user behavior that might cause that script to be called. (e.g. `<!--User clicks settings button, settings menu is made visible-->`).

In CSS, comment *every* style block with a note on where or to what elements the style is applied. One brief comment should be enough to adequately describe this.

####JavaScript

For now, JavaScript conventions are mostly covered under the general guidelines. Anything JavaScript specific will be added as needed.

####C Sharp
For C# files, ignore the general guidelines for naming classes; other than that, follow the general guidelines.

#####Private Variables
When naming private variables, add '_' in front of the name (i.e. the private variable 'length' should be named '_length')
