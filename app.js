var swaggerService = require("./lib/SwaggerService");
var http = require("http");
exports.process = function (options) {
    if (!options) {
        console.error("Sorry. Please supply options with swaggerPath");
    }
    else {
        http.get(options.swaggerPath, function (res) {
            res.setEncoding("utf-8");
            var swaggerString = "";
            res.on("data", function (data) {
                console.log("Swagger json found!");
                swaggerString += data;
            });
            res.on("end", function () {
                // swagger object coming from server
                var swaggerObject = JSON.parse(swaggerString);
                var opt = {
                    swaggerObject: swaggerObject
                };
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
                if (options.interfaceDestination) {
                    opt.interfaceDestination = options.interfaceDestination;
                }
                if (options.modelModuleName) {
                    opt.modelModuleName = options.modelModuleName;
                }
                if (options.clientDestination) {
                    opt.clientDestination = options.clientDestination;
                }
                if (options.clientModuleName) {
                    opt.clientModuleName = options.clientModuleName;
                }
                if (options.clientClassName) {
                    opt.clientClassName = options.clientClassName;
                }
                var swagSrv = new swaggerService(opt);
                swagSrv.process();
            });
        }).on("error", function (e) {
            console.log("Error : " + e.message);
        });
    }
};
//# sourceMappingURL=app.js.map