MiniBundler
===========

A tiny CommonJS module bundler and "require" implementation.

Creates a self-contained script from a set of modules and their depdencies. To remain simple, it rewrites any relative require module IDs to their top level ID equivalents. 

The output script can be loaded in a script tag, and "require" is made global.

Example Usage
-------------

    var MINIBUNDLER = require("minibundler");
    
    // first argument can be a single module ID:
    var script = MINIBUNDLER.bundle("foo");
    
    // an array of module IDs:
    var script = MINIBUNDLER.bundle(["foo", "bar"]);
    
    // a hash of ids mapping to paths
    var script = MINIBUNDLER.bundle({
      "foo" : "/something/lib/foo.js",
      "bar" : "/another/bar.js"
    });
    
    // some paths can be left out to search
    var script = MINIBUNDLER.bundle({
      "foo" : "/something/lib/foo.js",
      "bar" : null
    });
    
    // or require that all paths be specified by passing "true" as the second argument
    var script = MINIBUNDLER.bundle({
      "foo" : "/something/lib/foo.js"
    }, true);


Output
------

    var require = (/* "require" implementation */);
    require.def("foo", function(exports, require, module) {
      /* foo module text */
    });
    require.def("bar", function(exports, require, module) {
      /* bar module text */
    });


TODO
----

* Options for compression, etc.


License
-------

Copyright (c) 2010 Thomas Robinson, 280 North Inc., http://280north.com

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
