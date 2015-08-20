import typeParser = require("../Parsers/typeParser");

class interfaceCreator {
    static create(models: IModelDefinition[], moduleName: string): ICodeBlock[] {
        var blocks: ICodeBlock[] = [];

        for (var i = 0; i < models.length; i++) {
            var model: IModelDefinition = models[i];
            var body = "";
            body += "\texport interface I" + model.name + " {\n";
            for (var j = 0; j < model.properties.length; j++) {
                var property: IPropertyDefinition = model.properties[j];
                body += "\t\t" + property.name + ": " + property.dataType + ";\n";
            }

            body += "\t}\n";

            var block: ICodeBlock = {
                codeType: CodeBlockType.ModelInterface,
                moduleName: moduleName,
                name: "I" + model.name,
                body: body
            }

            blocks.push(block);
        }

        return blocks;
    }
}

export = interfaceCreator;
