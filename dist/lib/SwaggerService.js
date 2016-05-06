"use strict";
const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const modelParser = require("./Parsers/modelParser");
const signatureCreator = require("./Creators/signatureCreator");
const interfaceCreator = require("./Creators/interfaceCreator");
const classCreator = require("./Creators/classCreator");
const clientCreator = require("./Creators/clientCreator");
class SwaggerService {
    constructor(options) {
        this.options = options;
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
    process() {
        console.log('Parsing models');
        var modelDefinitions = modelParser.parse(this.options, this.options.swaggerObject.definitions, this.options.modelModuleName);
        console.log(" --> Created: " + modelDefinitions.length + " models");
        console.log("Creating model interfaces");
        var interfaces = interfaceCreator.create(modelDefinitions, this.options.modelModuleName);
        console.log("Creating model classes");
        var classes = classCreator.create(modelDefinitions, this.options.modelModuleName);
        console.log("Creating Function signatures from swagger.paths");
        var modelPrefix = this.options.modelModuleName !== this.options.clientModuleName ? this.options.modelModuleName + "." : "";
        var signatureDefinitions = signatureCreator.create(this.options, this.options.swaggerObject.paths, modelPrefix);
        console.log(" --> Created: " + signatureDefinitions.length + " signatures");
        console.log("Creating client classes");
        var clientCode = clientCreator.create(this.options, signatureDefinitions);
        var blocks = interfaces;
        if (this.options.classDestination) {
            blocks = blocks.concat(classes);
        }
        blocks.push(clientCode);
        if (this.options.singleFile) {
            this.writeSingleFile(blocks);
        }
        else {
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
            }
            else {
                code += clientCode.body;
            }
            fs.writeFileSync(fileName, code);
        }
        console.log("Done!");
    }
    writeMultipleFiles(blocks, destination) {
        this.mkdirSync(destination);
        _.forEach(blocks, (cb) => {
            var fileName = destination + "/" + cb.name + ".ts";
            var code = "module " + cb.moduleName + " {\n";
            code += "\t\"use strict\";\n\n";
            code += cb.body + "}\n\n";
            fs.writeFileSync(fileName, code);
        });
    }
    writeSingleFile(blocks) {
        var code = "/* tslint:disable:max-line-length */\n\n";
        var modules = _.groupBy(blocks, (b) => { return b.moduleName; });
        _.forEach(modules, (m) => {
            if (m[0].moduleName) {
                code += "module " + m[0].moduleName + " {\n";
                code += "\t\"use strict\";\n";
                _.forEach(m, (cb) => { code += "\n" + cb.body; });
                code += "}\n\n";
            }
            else {
                _.forEach(m, (cb) => { code += cb.body + "\n"; });
            }
        });
        var fileName = this.options.clientDestination + "/" + this.options.clientClassName + ".ts";
        fs.writeFileSync(fileName, code);
    }
    mkdirSync(dirpath) {
        var parts = dirpath.split("/");
        for (var i = 1; i <= parts.length; i++) {
            var part = parts.slice(0, i);
            try {
                fs.mkdirSync(path.join.apply(null, part));
                console.log(part + " directory created");
            }
            catch (e) {
                if (e.code != 'EEXIST') {
                    throw e;
                }
                else {
                    console.log("Directory " + part + " already exist");
                }
            }
        }
    }
}
module.exports = SwaggerService;

//# sourceMappingURL=SwaggerService.js.map
