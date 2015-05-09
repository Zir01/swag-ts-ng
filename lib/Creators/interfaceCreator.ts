import typeParser = require("../Parsers/typeParser");

class interfaceCreator {
    static create(definitions, apiModuleName: string): IModelDefinition[] {

        var modelDefinitions: IModelDefinition[] = [];


        for (var p in definitions) {
            var name = p;
            var definition = definitions[p];

            var fileContents = "module " + apiModuleName + " {\n"
            fileContents += "\texport interface I" + name + " {\n";
            for (var p in definition.properties) {
                fileContents += "\t\t" + p + ": " + typeParser.parse(modelDefinitions, definition.properties[p]) + ";\n";
            }
            fileContents += "\t}\n";
            fileContents += "}";
            var modelDef: IModelDefinition = {
                definitionName: "#/definitions/" + name,
                interfaceName: apiModuleName + ".I" + name,
                fileName: "I" + name + ".ts",
                fileContents: fileContents
            };
            modelDefinitions.push(modelDef);
            
        }
        return modelDefinitions;
    }
}
export = interfaceCreator;