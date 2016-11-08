"use strict";
require('source-map-support/register');
const swaggerService = require("./lib/SwaggerService");
const http = require("http");
exports.process = (options) => {
    if (!options) {
        console.error("Sorry. Please supply options with swaggerPath");
    }
    else {
        http.get(options.swaggerPath, (res) => {
            res.setEncoding("utf-8");
            var swaggerString = "";
            res.on("data", (data) => {
                console.log("Swagger json found!");
                swaggerString += data;
            });
            res.on("end", () => {
                var swaggerObject = JSON.parse(swaggerString);
                var opt = options;
                opt.swaggerObject = swaggerObject;
                if (options.moduleName) {
                    opt.clientModuleName = options.moduleName;
                    opt.modelModuleName = options.moduleName;
                }
                if (options.destination) {
                    opt.clientDestination = options.destination;
                    opt.interfaceDestination = options.destination;
                }
                var swagSrv = new swaggerService(opt);
                swagSrv.process();
            });
        }).on("error", (e) => {
            console.log("Error : " + e.message);
        });
    }
};

//# sourceMappingURL=app.js.map
