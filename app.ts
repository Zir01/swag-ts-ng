import 'source-map-support/register'//to get ts stacktraces
import swaggerService   = require("./lib/SwaggerService");
import http             = require("http");
import fs               = require("fs")


exports.process = (options:any) => {
  function runConversion(swaggerString: string) {
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
  }
    if (!options) {
        console.error("Sorry. Please supply options with swaggerPath");
    } else {
        if (options.swaggerLocation == "url") {
          http.get(options.swaggerPath, (res) => {
              res.setEncoding("utf-8");
              var swaggerString = "";
              res.on("data", (data:string) => {
                  console.log("Swagger json found!");
                  swaggerString += data;
              });

              res.on("end", () => {
                  // swagger object coming from server
                  runConversion(swaggerString)
              });
          }).on("error", (e:any) => {
              console.log("Error : " + e.message);
          });
        } else {
          //assuming 'local' swagger files.
          //usying sync. no use doing async stuff
          runConversion(fs.readFileSync(options.swaggerPath, 'UTF-8'))
        }
    }
}
