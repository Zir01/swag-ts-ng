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

        switch (property.type) {
            case "array":
                return this.parse(modelDefinitions, property.items) + "[]";
            case "boolean":
                return "boolean";
            case "integer":
                return "number";
            case "number":
                return "number";
            case "string":
                if (property.format === "date-time" || property.format === "date") {
                    return "Date";
                }

                return "string";
        }

        console.log("Warning: Unknown data type '" + property.type + "'");
        return property.type;
    }
}
export = typeParser;