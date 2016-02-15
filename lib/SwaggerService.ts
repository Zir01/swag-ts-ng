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
        var modelDefinitions: IModelDefinition[] = modelParser.parse(this.options, this.options.swaggerObject.definitions, this.options.modelModuleName);
        console.log(" --> Created: " + modelDefinitions.length + " models");

        // loop through definitions
        console.log("Creating model interfaces");
        var interfaces: ICodeBlock[] = interfaceCreator.create(modelDefinitions, this.options.modelModuleName);

        console.log("Creating model classes");
        var classes: ICodeBlock[] = classCreator.create(modelDefinitions, this.options.modelModuleName);

        // loop through paths and create Signature definitions to pass to the clientCreator creator
        console.log("Creating Function signatures from swagger.paths");
        var modelPrefix: string = this.options.modelModuleName !== this.options.clientModuleName ? this.options.modelModuleName + "." : "";
        var signatureDefinitions: ISignatureDefinition[] = signatureCreator.create(this.options, this.options.swaggerObject.paths, modelPrefix);
        console.log(" --> Created: " + signatureDefinitions.length + " signatures");

        // we have all we need, now create the client code to access the API
        console.log("Creating client classes");
        var clientCode: ICodeBlock = clientCreator.create(this.options, signatureDefinitions);

        // done, now lets go ahead and create the code files
        var blocks: ICodeBlock[] = interfaces;
        if (this.options.classDestination) {
            blocks = blocks.concat(classes);
        }

        blocks.push(clientCode);

        if (this.options.singleFile) {
            this.writeSingleFile(blocks);
        } else {
            console.log("Writing interfaces to " + this.options.interfaceDestination);
            this.writeMultipleFiles(interfaces, this.options.interfaceDestination);

            if (this.options.classDestination) {
                console.log("Writing classes to " + this.options.classDestination);
                this.writeMultipleFiles(classes, this.options.classDestination);
            }

            this.mkdirSync(this.options.clientDestination);
            var fileName = this.options.clientDestination + "/" + this.options.clientClassName + ".ts";
            console.log("Writing client class to " + fileName);
            var code = "/* tslint:disable:max-line-length */\n\n";
            if (this.options.clientModuleName) {
                code += "module " + this.options.clientModuleName + " {\n";
                code += "\t\"use strict\";\n\n";
                code += clientCode.body + "}\n\n";
            } else {
                code += clientCode.body;
            }

            fs.writeFileSync(fileName, code);
        }

        console.log("Done!");
    }

    private writeMultipleFiles(blocks: ICodeBlock[], destination: string): void {
        this.mkdirSync(destination);
        _.forEach(blocks, (cb: ICodeBlock) => {
            var fileName = destination + "/" + cb.name + ".ts";
            var code = "module " + cb.moduleName + " {\n";
            code += "\t\"use strict\";\n\n";
            code += cb.body + "}\n\n";
            fs.writeFileSync(fileName, code);
        });
    }

    private writeSingleFile(blocks: ICodeBlock[]): void {
        var code = "/* tslint:disable:max-line-length */\n\n";
        var modules = _.groupBy(blocks, (b: ICodeBlock) => { return b.moduleName; });
        _.forEach(modules, (m: ICodeBlock[]) => {
            if (m[0].moduleName) {
                code += "module " + m[0].moduleName + " {\n";
                code += "\t\"use strict\";\n";
                _.forEach(m, (cb: ICodeBlock) => { code += "\n" + cb.body; });
                code += "}\n\n";
            } else {
                _.forEach(m, (cb: ICodeBlock) => { code += cb.body + "\n"; });
            }
        });

        var fileName = this.options.clientDestination + "/" + this.options.clientClassName + ".ts";
        fs.writeFileSync(fileName, code);
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
