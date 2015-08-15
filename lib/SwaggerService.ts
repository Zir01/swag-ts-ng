import fs               = require("fs");
import path             = require("path");
import _                = require("lodash");
import signatureCreator = require("./Creators/signatureCreator");
import interfaceCreator = require("./Creators/interfaceCreator");
import classCreator     = require("./Creators/classCreator");
import clientCreator    = require("./Creators/clientCreator");

class SwaggerService {
    modelDefinitions: IModelDefinition[];
    signatureDefinitions: ISignatureDefinition[];
    classDefinitions: IClassDefinition[];

    constructor(public options: ISwaggerOptions) {
        this.modelDefinitions = [];
        this.signatureDefinitions = [];

        if (!this.options.interfaceDestination) {
            options.interfaceDestination = "API/" + this.options.swaggerObject.info.title;
        }

        if (!this.options.modelModuleName) {
            this.options.modelModuleName = "API." + this.options.swaggerObject.info.title;
        }

        if (!this.options.clientDestination) {
            options.clientDestination = "API/" + this.options.swaggerObject.info.title;
        }

        if (!this.options.clientClassName) {
            options.clientClassName = this.options.swaggerObject.info.title.trim() + "Client";
        }
    }

    public process() {
        console.log('Starting Parse!');

        // loop through definitions
        console.log("Creating Interfaces from swagger.definitions");
        this.modelDefinitions = interfaceCreator.create(this.options.swaggerObject.definitions, this.options.modelModuleName);

        console.log("Creating Classes from swagger.definitions");
        this.classDefinitions = classCreator.create(this.options.swaggerObject.definitions, this.modelDefinitions, this.options.modelModuleName);

        // loop through paths and create Signature definitions to pass to the clientCreator creator
        console.log("Creating Function signatures from swagger.paths");
        this.signatureDefinitions = signatureCreator.create(this.modelDefinitions, this.options.swaggerObject.paths);
        console.log(" --> Signatures created: " + this.signatureDefinitions.length + " signatures created");

        // we have all we need in and signatureDefinitions[], now create the client code to access the API
        console.log("Creating client class:");
        var clientCode = clientCreator.create(this.options, this.signatureDefinitions);

        // done, now lets go ahead and create the code files
        this.mkdirSync(this.options.interfaceDestination);
        _.forEach(this.modelDefinitions, (md: IModelDefinition) => {
            var fileName = this.options.interfaceDestination + "/" + md.fileName;
            fs.writeFileSync(fileName, md.fileContents);
            console.log(" --> Interface " + fileName + " file was created: ");
        });

        if (this.options.classDestination) {
            this.mkdirSync(this.options.classDestination);
            _.forEach(this.classDefinitions, (cd: IClassDefinition) => {
                var fileName = this.options.classDestination + "/" + cd.fileName;
                fs.writeFileSync(fileName, cd.fileContents);
                console.log(" --> Class " + fileName + " file was created: ");
            });
        }

        this.mkdirSync(this.options.clientDestination);
        var fileName = this.options.clientDestination + "/" + this.options.clientClassName + ".ts";
        fs.writeFileSync(fileName, clientCode);
        console.log(" --> " + fileName + " was created");
    }

    private mkdirSync(dirpath: string): void {
        var parts = dirpath.split("/");
        for (var i = 1; i <= parts.length; i++) {
            var part = parts.slice(0, i);
            try {
                fs.mkdirSync(path.join.apply(null, part));
                console.log(part + " directory created");
            } catch (e) {
                if (e.code != 'EEXIST') {
                    throw e;
                } else {
                    console.log("Directory " + part + " already exist");
                }
            }
        }
    }
}

export = SwaggerService;
