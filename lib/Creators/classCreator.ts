import typeParser = require("../Parsers/typeParser");

class classCreator {
    static create(swaggerDefinitions, modelDefinitions: IModelDefinition[], modelModuleName: string): IClassDefinition[] {
        var classDefinitions: IClassDefinition[] = [];

        for (var p in swaggerDefinitions) {
            var name = p;
            var definition = swaggerDefinitions[p];

            var fileContents = "module " + modelModuleName + " {\n"
            fileContents += "\t\"use strict\";\n\n";
            fileContents += "\texport class " + name + " implements I" + name + " {\n";
            for (var p in definition.properties) {
                fileContents += "\t\t" + p + ": " + typeParser.parse(modelDefinitions, definition.properties[p]) + ";\n";
            }

            fileContents += "\t}\n";
            fileContents += "}\n";
            var modelDef: IClassDefinition = {
                fileName: name + ".ts",
                fileContents: fileContents
            };

            classDefinitions.push(modelDef);
        }

        return classDefinitions;
    }
}

export = classCreator;
