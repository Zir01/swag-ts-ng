var swaggerService = require("./lib/SwaggerService");
var http = require("http");
exports.process = function (options) {
    if (!options) {
        console.error("Sorry. Please supply options with swaggerPath and destination properties");
    }
    else {
        http.get(options.swaggerPath, function (res) {
            res.setEncoding('utf-8');
            var swaggerString = '';
            res.on('data', function (data) {
                console.log('Swagger json found!');
                swaggerString += data;
            });
            res.on('end', function () {
                // swagger object coming from server
                var swaggerObject = JSON.parse(swaggerString);
                var opt = {
                    destination: options.destination,
                    swaggerObject: swaggerObject
                };
                if (options.moduleName) {
                    opt.moduleName = options.moduleName;
                }
                var swagSrv = new swaggerService(opt);
                swagSrv.process();
            });
        }).on('error', function (e) {
            console.log('Error : ' + e.message);
        });
        ;
    }
};
//# sourceMappingURL=app.js.map