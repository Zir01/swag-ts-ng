import typeParser = require("../Parsers/typeParser");

class interfaceCreator {
    static create(definitions, apiModuleName: string): IModelDefinition[] {

        var modelDefinitions: IModelDefinition[] = [];


        for (var p in definitions) {
            var name = p;
            var definition = definitions[p];
        
            if (definition.type == "object") {

                var fileContents = apiModuleName + " {\n"
                fileContents += "\texport interface I" + name + " {\n";
                for (var p in definition.properties) {
                    fileContents += "\t\t" + p + ": " + typeParser.parse(modelDefinitions, definition.properties[p]) + ";\n";
                }
                fileContents += "\t}\n";
                fileContents += "}";
                var modelDef: IModelDefinition = {
                    definitionName: "#/definitions/" + name,
                    interfaceName: apiModuleName + ".I" + name,
                    fileContents: fileContents
                };
                //fs.writeFileSync(this.destPath + "/" + this.swaggerObject.info.title + "/I" + name + ".ts", fileContents);
                //console.log(" --> Interface " + this.destPath + "/" + this.swaggerObject.info.title + "/I" + name + ".ts file was created: ");
                modelDefinitions.push(modelDef);
            }
        }
        return modelDefinitions;
    }
}
export = interfaceCreator;