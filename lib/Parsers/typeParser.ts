import _ = require("lodash");
class typeParser {
    static parse(modelDefinitions: IModelDefinition[], property): string {
        if (!property.type) {
            // check $ref;
            if (property.$ref) {
                return "I" + property.$ref;
            }
            if (property.schema.$ref) {
                return _.find(modelDefinitions, (md: IModelDefinition) => { return md.definitionName == property.schema.$ref; }).interfaceName;
            }
        }

        if (property.type == "integer" || property.type == "number") return "number";
        if (property.type == "string") {
            if (property.format == "date-time") {
                return "Date";
            }
        }
        if (property.type == "array") {
            if (property.items.type) {
                if (property.items.type != "array")
                    return property.items.type + "[]";
                else
                    return property.items.items.type + "[]";
            }
            if (property.items.$ref) return "I" + property.items.$ref + "[]";
        }

        return property.type;
    }
}
export = typeParser;