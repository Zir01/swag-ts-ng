import swaggerService   = require("./lib/SwaggerService");
import http             = require("http");

exports.process = (options) => {
    if (!options) {
        console.error("Sorry. Please supply options with swaggerPath");
    } else {
        http.get(options.swaggerPath, (res) => {
            res.setEncoding("utf-8");
            var swaggerString = "";
            res.on("data", (data) => {
                console.log("Swagger json found!");
                swaggerString += data;
            });

            res.on("end", () => {
                // swagger object coming from server
                var swaggerObject: Swagger.ISwagger = JSON.parse(swaggerString);

                var opt: ISwaggerOptions = options;
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
            });
        }).on("error", (e) => {
            console.log("Error : " + e.message);
        });
    }
}
