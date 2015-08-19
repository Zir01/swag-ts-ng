import typeParser = require("../Parsers/typeParser");

class classCreator {
    static create(models: IModelDefinition[], moduleName: string): ICodeBlock[] {
        var blocks: ICodeBlock[] = [];

        for (var i = 0; i < models.length; i++) {
            var model: IModelDefinition = models[i];
            var body = "";
            body += "\texport class " + model.name + " implements I" + model.name + " {\n";
            for (var j = 0; j < model.properties.length; j++) {
                var property: IPropertyDefinition = model.properties[j];
                body += "\t\t" + property.name + ": " + property.dataType + ";\n";
            }

            body += "\t}\n";

            var block: ICodeBlock = {
                codeType: CodeBlockType.ModelClass,
                moduleName: moduleName,
                name: model.name,
                body: body
            }

            blocks.push(block);
        }

        return blocks;
    }
}

export = classCreator;
