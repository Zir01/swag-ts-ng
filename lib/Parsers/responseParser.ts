import _ = require("lodash");
class responseParser {
    static parse(modelDefinitions: IModelDefinition[], property): string {
        if (property.schema.type) {
            if (property.schema.type == "array") {
                if (property.schema.items.type) {
                    return property.schema.items.type + "[]";
                } else {
                    return _.find(modelDefinitions, (d: IModelDefinition) => { return d.definitionName == property.schema.items.$ref; }).interfaceName + "[]";
                }
            } else {
                if (property.schema.type) {
                    if (property.schema.type == "integer" || property.schema.type == "number") return "number";
                    return property.schema.type;
                } else {
                    return _.find(modelDefinitions, (d: IModelDefinition) => { return d.definitionName == property.schema.$ref; }).interfaceName;
                }
            }
        } else {
            return _.find(modelDefinitions, (d: IModelDefinition) => { return d.definitionName == property.schema.$ref; }).interfaceName;
        }
    }
}
export = responseParser;