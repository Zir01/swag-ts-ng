var expect: Chai.ExpectStatic = require('chai').expect;
import SwaggerService = require("../lib/SwaggerService");
import fs = require("fs");
import interfaceCreator = require("../lib/Creators/interfaceCreator");
import signatureCreator = require("../lib/Creators/signatureCreator");
import getCreator = require("../lib/Creators/getCreator");
import _ = require("lodash");
import testHelper = require("./samples/testHelper");

describe("getCreator", () => {
    describe("create()", () => {
        it("should create valid code generation for get operations", () => {
            
            // prepare
            var swaggerObject: Swagger.ISwagger = testHelper.getSampleSwaggerObject();

            // act
            var modelDefinitions: IModelDefinition[] = interfaceCreator.create(swaggerObject.definitions, "API.ContactsAPI");


            var signatureDefinitions: ISignatureDefinition[] = signatureCreator.create(modelDefinitions, swaggerObject.paths);

            _.forEach(signatureDefinitions, (sd: ISignatureDefinition) => {
                var getCode = getCreator.create(sd);
                console.log(getCode);
                console.log(testHelper.getContacts_GetById());
                expect(getCode).equals(testHelper.getContacts_GetById());
            });
            
            


        });
    });


});