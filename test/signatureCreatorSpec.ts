var expect: Chai.ExpectStatic = require('chai').expect;
import SwaggerService = require("../lib/SwaggerService");
import fs = require("fs");
import interfaceCreator = require("../lib/Creators/interfaceCreator");
import signatureCreator = require("../lib/Creators/signatureCreator");
import _ = require("lodash");
import testHelper = require("./samples/testHelper");

describe("signatureCreator", () => {
    describe("create()", () => {
        it("should create an array of valid signature definitions", () => {
            
            // prepare
            var swaggerObject: Swagger.ISwagger = testHelper.getSampleSwaggerObject();

            // act
            var modelDefinitions: IModelDefinition[] = interfaceCreator.create(swaggerObject.definitions, "API.ContactsAPI");

            
            var signatureDefinitions:ISignatureDefinition[] = signatureCreator.create(modelDefinitions, swaggerObject.paths);
            
            // assert #1
            expect(signatureDefinitions.length).to.be.eq(7);

            expect(signatureDefinitions[0].methodName).to.be.eq('Contacts_GetById');
            expect(signatureDefinitions[0].signature).to.be.eq('Contacts_GetById(id:number):ng.IPromise<API.ContactsAPI.IContact>;');
            expect(signatureDefinitions[0].parameters.length).to.be.eq(1);
            expect(signatureDefinitions[0].path).to.be.eq('/api/Contacts/GetById/{id}');
            expect(signatureDefinitions[0].method).to.be.eq('get');

            expect(signatureDefinitions[1].methodName).to.be.eq('Contacts_GetByName');
            expect(signatureDefinitions[1].signature).to.be.eq('Contacts_GetByName(name:string):ng.IPromise<string>;');
            expect(signatureDefinitions[1].parameters.length).to.be.eq(1);
            expect(signatureDefinitions[1].path).to.be.eq('/api/Contacts/GetByName/{name}');
            expect(signatureDefinitions[1].method).to.be.eq('get');

            expect(signatureDefinitions[2].methodName).to.be.eq('Contacts_GetByNameSurname');
            expect(signatureDefinitions[2].signature).to.be.eq('Contacts_GetByNameSurname(name:string, surname:string):ng.IPromise<string>;');
            expect(signatureDefinitions[2].parameters.length).to.be.eq(2);
            expect(signatureDefinitions[2].path).to.be.eq('/api/Contacts/GetByNameSurname/{name}/{surname}');
            expect(signatureDefinitions[2].method).to.be.eq('get');

            expect(signatureDefinitions[3].methodName).to.be.eq('Contacts_GetFook');
            expect(signatureDefinitions[3].signature).to.be.eq('Contacts_GetFook(fook:string):ng.IPromise<string>;');
            expect(signatureDefinitions[3].parameters.length).to.be.eq(1);
            expect(signatureDefinitions[3].path).to.be.eq('/api/Contacts/GetFook');
            expect(signatureDefinitions[3].method).to.be.eq('get');

            expect(signatureDefinitions[4].methodName).to.be.eq('Contacts_FindByTags');
            expect(signatureDefinitions[4].signature).to.be.eq('Contacts_FindByTags(tags:number[]):ng.IPromise<API.ContactsAPI.IContact[]>;');
            expect(signatureDefinitions[4].parameters.length).to.be.eq(1);
            expect(signatureDefinitions[4].path).to.be.eq('/api/Contacts/FindByTags');
            expect(signatureDefinitions[4].method).to.be.eq('get');

            expect(signatureDefinitions[5].methodName).to.be.eq('Contacts_GetAll');
            expect(signatureDefinitions[5].signature).to.be.eq('Contacts_GetAll():ng.IPromise<API.ContactsAPI.IContact[]>;');
            expect(signatureDefinitions[5].parameters.length).to.be.eq(0);
            expect(signatureDefinitions[5].path).to.be.eq('/api/Contacts/GetAll');
            expect(signatureDefinitions[5].method).to.be.eq('get');

            expect(signatureDefinitions[6].methodName).to.be.eq('Contacts_Save');
            expect(signatureDefinitions[6].signature).to.be.eq('Contacts_Save(contact:API.ContactsAPI.IContact):ng.IPromise<API.ContactsAPI.IContact>;');
            expect(signatureDefinitions[6].parameters.length).to.be.eq(1);
            expect(signatureDefinitions[6].path).to.be.eq('/api/Contacts/Save');
            expect(signatureDefinitions[6].method).to.be.eq('post');

            
        });
    });


});