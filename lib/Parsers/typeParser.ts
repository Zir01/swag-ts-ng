import _ = require("lodash");

class typeParser {
    static parse(property, modelPrefix?: string): string {
        if (property.schema) {
            return this.parse(property.schema, modelPrefix);
        }

        if (property.$ref) {
            var prefix: string = modelPrefix || "";
            return property.$ref.replace("#/definitions/", prefix + "I");
        }

        switch (property.type) {
            case "array":
                return this.parse(property.items) + "[]";
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

        console.warn("Warning: Unknown data type '" + property.type + "'");
        return property.type;
    }
}

export = typeParser;
