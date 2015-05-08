import swaggerService = require("./lib/SwaggerService");
exports.process = (options: ISwaggerOptions) => {
    if (!options) {
        console.error("Sorry. Please supply options with swaggerPath and destination properties");
    }
    else {
        var swagSrv = new swaggerService(options);
        swagSrv.process();
        console.log("process started...")
    }
}