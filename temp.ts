import swaggerService = require("./lib/SwaggerService");
import http = require("http");


http.get("http://localhost:49250/swagger/docs/v1", (res) => {
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
            destination: "app",
            swaggerObject: swaggerObject
        };
        var swagSrv = new swaggerService(opt);
        swagSrv.process();
        console.log('Parse done!');


    });
}).on('error', (e) => {
    console.log('Error while gettings: ' + this.options.swaggerPath + ' - ' + e.message);
});;




