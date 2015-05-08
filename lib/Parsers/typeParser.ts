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

        if (property.type == "integer") return "number";
        if (property.type == "array") {
            if (property.items.type) return property.items.type + "[]";
            if (property.items.$ref) return "I" + property.items.$ref + "[]";
        }

        return property.type;
    }
}
export = typeParser;