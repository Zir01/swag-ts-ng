"use strict";
require('source-map-support/register'); //to get ts stacktraces
var swaggerService = require("./lib/SwaggerService");
var http = require("http");
var fs = require("fs");
exports.process = function (options) {
    function runConversion(swaggerString) {
        var swaggerObject = JSON.parse(swaggerString);
        var opt = options;
        opt.swaggerObject = swaggerObject;
        // for backwards compatibility
        if (options.moduleName) {
            opt.clientModuleName = options.moduleName;
            opt.modelModuleName = options.moduleName;
        }
        // for backwards compatibility
        if (options.destination) {
            opt.clientDestination = options.destination;
            opt.interfaceDestination = options.destination;
        }
        var swagSrv = new swaggerService(opt);
        swagSrv.process();
    }
    if (!options) {
        console.error("Sorry. Please supply options with swaggerPath");
    }
    else {
        if (options.swaggerLocation == "url") {
            http.get(options.swaggerPath, function (res) {
                res.setEncoding("utf-8");
                var swaggerString = "";
                res.on("data", function (data) {
                    console.log("Swagger json found!");
                    swaggerString += data;
                });
                res.on("end", function () {
                    // swagger object coming from server
                    runConversion(swaggerString);
                });
            }).on("error", function (e) {
                console.log("Error : " + e.message);
            });
        }
        else {
            //assuming 'local' swagger files.
            //usying sync. no use doing async stuff
            runConversion(fs.readFileSync(options.swaggerPath, 'UTF-8'));
        }
    }
};
//# sourceMappingURL=app.js.map