import _ = require("lodash");
import typeParser = require("./typeParser");

class parameterParser {
    static parse(modelDefinitions: IModelDefinition[], property): IParamDefinition {
        var paramDef: string = property.name;
        var type = typeParser.parse(modelDefinitions, property);
        if (!property.required) paramDef += "?";


        if (property.type) {
            if (property.type != "array") {
                paramDef += ":" + type;
            } else {
                type = "array";
                var innertype = typeParser.parse(modelDefinitions, property.items);
                paramDef += ":" + innertype + "[]";
            }
            return {
                name: property.name,
                required: property.required,
                type: type,
                text: paramDef,
                i_n: property.in,
                items: property.items
            };
        }



        if (property.schema) {
            if (property.schema.type) {
                paramDef += ":" + property.schema.type;
                return {
                    name: property.name,
                    required: property.required,
                    type: property.schema.type,
                    text: paramDef,
                    i_n: property.in,
                    items: property.items
                };
            } else {
                var type = _.find(modelDefinitions, (md: IModelDefinition) => { return md.definitionName == property.schema.$ref; }).interfaceName;
                paramDef += ":" + type;
                return {
                    name: property.name,
                    required: property.required,
                    type: type,
                    text: paramDef,
                    i_n: property.in,
                    items: property.items
                };
            }
        }
    }
}
export = parameterParser;