"use strict";
const typeParser = require("./typeParser");
class parameterParser {
    static parse(options, property, modelPrefix) {
        var dataType = typeParser.parse(options, property, modelPrefix);
        var paramType;
        switch (property.in) {
            case "query":
                paramType = 0;
                break;
            case "header":
                paramType = 1;
                console.warn("Parameter type header is not supported");
                break;
            case "path":
                paramType = 2;
                break;
            case "formData":
                paramType = 3;
                console.warn("Parameter type formData is not supported");
                break;
            case "body":
                paramType = 4;
                break;
            default:
                console.error("Unknown parameter.in: " + property.in);
        }
        var paramDef = property.name;
        if (!property.required) {
            paramDef += "?";
        }
        paramDef += ": " + dataType;
        var result = {
            name: property.name,
            paramType: paramType,
            required: property.required,
            items: property.items,
            dataType: dataType,
            text: paramDef
        };
        if (property.description && property.description.length > 0) {
            result.description = property.description;
        }
        return result;
    }
}
module.exports = parameterParser;

//# sourceMappingURL=parameterParser.js.map
