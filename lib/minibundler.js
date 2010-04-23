var FILE = require("file");
var SYSTEM = require("system");

var REQUIRE_REGEX = /((?:^|[^\w\$_.])require\s*\(\s*["'])([^"']*)(["']\s*\))/g;

// Takes either a map of module ids to paths, or an array of top IDs
// Returns a self contained require and modules
exports.bundle = function(modules, noLookup) {
    if (typeof modules === "string")
        modules = [modules];
    if (Array.isArray(modules)) {
        var modulesToPaths = {};
        var topIDs = modules;
    } else {
        var modulesToPaths = modules;
        var topIDs = Object.keys(modules);
    }

    var script = "var require = (" + requireImplementation + ")();\n";

    while (topIDs.length > 0) {
        var baseID = topIDs.shift();

        if (!modulesToPaths[baseID] && !noLookup)
            modulesToPaths[baseID] = find(baseID);

        if (!modulesToPaths[baseID])
            throw "Unknown path for module: " + baseID;

        SYSTEM.stderr.print("Bundling " + baseID + " at " + modulesToPaths[baseID]);

        var text = FILE.read(modulesToPaths[baseID]).replace(REQUIRE_REGEX, function(_, pre, requireID, post) {
            var topID = resolve(requireID, baseID);

            SYSTEM.stderr.print(" * " + topID + (topID === requireID ? "" : " ("+requireID+")"));

            if (!modulesToPaths[topID])
                topIDs.push(topID);

            return pre + topID + post;
        });

        script += "require.def("+JSON.stringify(baseID)+",{factory:function(require,exports,module){"+text+"\n//*/\n}});\n";
    }
    return script;
}

// these are Narwhal specific:

function find(id) {
    return require.loader.find(id)[1];
}

function resolve(requireID, baseID) {
    // return (/^\./.test(requireID)) ? FILE.resolve(baseID, requireID) : FILE.resolve(requireID);
    return require.loader.resolve(requireID, baseID);
}

// This is the minimal loader to be serialized (not executed here)
// Doesn't support relative requires, so all IDs must be resolved by the bundler
var requireImplementation = function() {
    var modules = {};
    var factories = {};
    var r = function(id) {
        if (!modules[id]) {
            modules[id] = {};
            factories[id](r, modules[id], { id : id });
        }
        return modules[id];
    };
    r.def = function(id, params) {
        factories[id] = params.factory;
    };
    return r;
}
