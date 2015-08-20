import typeParser = require("../Parsers/typeParser");

class modelParser {
    static parse(swaggerDefinitions: any, moduleName: string): IModelDefinition[] {
        var models: IModelDefinition[] = [];

        for (var d in swaggerDefinitions) {
            var properties: IPropertyDefinition[] = [];
            var name = d;
            var definition = swaggerDefinitions[d];

            for (var p in definition.properties) {
                var property: IPropertyDefinition = {
                    name: p,
                    dataType: typeParser.parse(definition.properties[p])
                };

                properties.push(property);
            }

            var model: IModelDefinition = {
                moduleName: moduleName,
                definitionName: "#/definitions/" + name,
                name: name,
                properties: properties
            };

            models.push(model);
        }

        return models;
    }
}

export = modelParser;
