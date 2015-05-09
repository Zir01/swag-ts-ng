import swaggerService   = require("./lib/SwaggerService");
import http             = require("http");



exports.process = (options) => {
    if (!options) {
        console.error("Sorry. Please supply options with swaggerPath and destination properties");
    }
    else {

        http.get(options.swaggerPath, (res) => {
            res.setEncoding('utf-8');
            var swaggerString = '';
            res.on('data', (data) => {
                console.log('Swagger json found!');
                swaggerString += data;
            });
            res.on('end', () => {

        
                // swagger object coming from server
                var swaggerObject: Swagger.ISwagger = JSON.parse(swaggerString);

                var opt: ISwaggerOptions = {
                    destination: options.destination,
                    swaggerObject: swaggerObject
                };
                if (options.moduleName) {
                    opt.moduleName = options.moduleName;
                }
                var swagSrv = new swaggerService(opt);
                swagSrv.process();

            });
        }).on('error', (e) => {
            console.log('Error : ' + e.message);
        });;

    }
}