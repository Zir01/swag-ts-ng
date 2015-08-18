import fs               = require("fs");
import path             = require("path");
import _                = require("lodash");
import modelParser      = require("./Parsers/modelParser");
import signatureCreator = require("./Creators/signatureCreator");
import interfaceCreator = require("./Creators/interfaceCreator");
import classCreator     = require("./Creators/classCreator");
import clientCreator    = require("./Creators/clientCreator");

class SwaggerService {
    constructor(public options: ISwaggerOptions) {
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
        // parse model
        console.log('Parsing models');
        var modelDefinitions: IModelDefinition[] = modelParser.parse(this.options.swaggerObject.definitions, this.options.modelModuleName);
        console.log(" --> Created: " + modelDefinitions.length + " models");

        // loop through definitions
        console.log("Creating model interfaces");
        var interfaces: ICodeBlock[] = interfaceCreator.create(modelDefinitions, this.options.modelModuleName);

        console.log("Creating model classes");
        var classes: ICodeBlock[] = classCreator.create(modelDefinitions, this.options.modelModuleName);

        // loop through paths and create Signature definitions to pass to the clientCreator creator
        console.log("Creating Function signatures from swagger.paths");
        var signatureDefinitions: ISignatureDefinition[] = signatureCreator.create(modelDefinitions, this.options.swaggerObject.paths);
        console.log(" --> Created: " + signatureDefinitions.length + " signatures");

        // we have all we need in and signatureDefinitions[], now create the client code to access the API
        console.log("Creating client classes");
        var clientCode = clientCreator.create(this.options, signatureDefinitions);

        // done, now lets go ahead and create the code files
        console.log("Writing interfaces to " + this.options.interfaceDestination);
        this.mkdirSync(this.options.interfaceDestination);
        _.forEach(interfaces, (cb: ICodeBlock) => {
            var fileName = this.options.interfaceDestination + "/" + cb.name + ".ts";
            fs.writeFileSync(fileName, cb.body);
        });

        if (this.options.classDestination) {
            console.log("Writing classes to " + this.options.classDestination);
            this.mkdirSync(this.options.classDestination);
            _.forEach(classes, (cb: ICodeBlock) => {
                var fileName = this.options.classDestination + "/" + cb.name + ".ts";
                fs.writeFileSync(fileName, cb.body);
            });
        }

        this.mkdirSync(this.options.clientDestination);
        var fileName = this.options.clientDestination + "/" + this.options.clientClassName + ".ts";
        console.log("Writing client class to " + fileName);
        fs.writeFileSync(fileName, clientCode.body);
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
