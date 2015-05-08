var expect:Chai.ExpectStatic        = require('chai').expect;
import SwaggerService                  = require("../lib/SwaggerService");
import fs                              = require("fs");

describe("SwaggerService", () => {


    describe("init", () => {
        it("should initialise with correctly destination option", () => {

            var options: ISwaggerOptions = {
                swaggerObject: <Swagger.ISwagger>{},
                destination: "xyz"
            };

            
            
            var swagSvc = new SwaggerService(options);
            
            expect(swagSvc.options.destination).equals("xyz");

            expect(swagSvc.modelDefinitions.length).equals(0);
            expect(swagSvc.signatureDefinitions.length).equals(0);
            expect(swagSvc.destPath).equals(options.destination + "/API");

        });
        it("should initialise with correctly without destination option", () => {

            var options: ISwaggerOptions = {
                swaggerObject: <Swagger.ISwagger>{},
                destination: "xyz"
            };

            var swagSvc = new SwaggerService(options);
            expect(swagSvc.options.destination).equals("");

            expect(swagSvc.modelDefinitions.length).equals(0);
            expect(swagSvc.signatureDefinitions.length).equals(0);
            expect(swagSvc.destPath).equals("API");

        });
        it("should XXXXX", () => {

            var sampleSwagger = fs.readFileSync("./sampleSwagger.txt", "utf8");
            var swaggerObject: Swagger.ISwagger = JSON.parse(sampleSwagger);

            var options: ISwaggerOptions = {
                swaggerObject: swaggerObject,
                destination: "xyz"
            };

            var swagSvc = new SwaggerService(options);
            




        });


    });


});