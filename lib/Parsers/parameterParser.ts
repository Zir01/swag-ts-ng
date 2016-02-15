import typeParser = require("./typeParser");

class parameterParser {
    static parse(options: ISwaggerOptions, property, modelPrefix: string): IParamDefinition {
        var dataType = typeParser.parse(options, property, modelPrefix);

        var paramType: ParamType;
        switch (property.in) {
            case "query":
                paramType = ParamType.Query;
                break;
            case "header":
                paramType = ParamType.Header;
                console.warn("Parameter type header is not supported");
                break;
            case "path":
                paramType = ParamType.Path;
                break;
            case "formData":
                paramType = ParamType.FormData;
                console.warn("Parameter type formData is not supported");
                break;
            case "body":
                paramType = ParamType.Body;
                break;
            default:
                console.error("Unknown parameter.in: " + property.in);
        }

        var paramDef: string = property.name;
        if (!property.required) {
            paramDef += "?";
        }
        paramDef += ": " + dataType;

        var result: IParamDefinition = {
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

export = parameterParser;
