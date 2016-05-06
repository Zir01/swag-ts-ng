"use strict";
const typeParser = require("../Parsers/typeParser");
class modelParser {
    static parse(options, swaggerDefinitions, moduleName) {
        var models = [];
        for (var d in swaggerDefinitions) {
            var properties = [];
            var name = d;
            var definition = swaggerDefinitions[d];
            for (var p in definition.properties) {
                var property = {
                    name: p,
                    dataType: typeParser.parse(options, definition.properties[p], "I")
                };
                properties.push(property);
            }
            var model = {
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
module.exports = modelParser;

//# sourceMappingURL=modelParser.js.map
