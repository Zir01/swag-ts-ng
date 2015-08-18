var expect: Chai.ExpectStatic   = require('chai').expect;
import SwaggerService           = require("../lib/SwaggerService");
import fs                       = require("fs");
import interfaceCreator         = require("../lib/Creators/interfaceCreator");
import _                        = require("lodash");
import testHelper               = require("./samples/testHelper");

describe("interfaceCreator", () => {
    describe("create()", () => {
        it("should create an array of valid interface definitions", () => {
            
            // prepare
            var swaggerObject:Swagger.ISwagger = testHelper.getSampleSwaggerObject();

            // act
            //var modelDefinitions: IModelDefinition[] = interfaceCreator.create(swaggerObject.definitions, "API.ContactsAPI");

            // assert #1
            //expect(modelDefinitions.length).to.be.eq(2);

            // assert #2 - IContact.ts
            //expect(modelDefinitions[0].fileName).to.be.eq("IContact.ts");
            //expect(modelDefinitions[0].definitionName).to.be.eq("#/definitions/Contact");
            //expect(modelDefinitions[0].interfaceName).to.be.eq("API.ContactsAPI.IContact");
            //expect(modelDefinitions[0].fileContents).to.be.eq(testHelper.getIContactSample());

            // assert #3 - IAddress.ts
            //expect(modelDefinitions[1].fileName).to.be.eq("IAddress.ts");
            //expect(modelDefinitions[1].definitionName).to.be.eq("#/definitions/Address");
            //expect(modelDefinitions[1].interfaceName).to.be.eq("API.ContactsAPI.IAddress");
            //expect(modelDefinitions[1].fileContents).to.be.eq(testHelper.getIAddressSample());
        });
    });


});