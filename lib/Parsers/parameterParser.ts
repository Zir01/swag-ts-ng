import _            = require("lodash");
import typeParser   = require("./typeParser");

class parameterParser {
    static parse(modelDefinitions: IModelDefinition[], property): IParamDefinition {
        var paramDef: string = property.name;
        var dataType = typeParser.parse(modelDefinitions, property);
        if (!property.required) {
            paramDef += "?";
        }

        if (property.type) {
            if (property.type != "array") {
                paramDef += ": " + dataType;
            } else {
                dataType = "array";
                var innertype = typeParser.parse(modelDefinitions, property.items);
                paramDef += ": " + innertype + "[]";
            }
        } else if (property.schema) {
            if (property.schema.type) {
                if (property.schema.type != "array") {
                    paramDef += ": " + property.schema.type;
                    dataType = property.schema.type;
                } else {
                    var dataType = _.find(modelDefinitions, (md: IModelDefinition) => { return md.definitionName == property.schema.items.$ref; }).interfaceName;
                    paramDef += ": " + dataType + "[]";
                    dataType = property.schema.type;
                }
            } else {
                var dataType = _.find(modelDefinitions, (md: IModelDefinition) => { return md.definitionName == property.schema.$ref; }).interfaceName;
                paramDef += ": " + dataType;
            }
        }

        var result: IParamDefinition = {
            name: property.name,
            required: property.required,
            i_n: property.in,
            items: property.items,
            type: dataType,
            text: paramDef
        };

        if (property.description && property.description.length > 0) {
            result.description = property.description;
        }

        return result;
    }
}

export = parameterParser;
