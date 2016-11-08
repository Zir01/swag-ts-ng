import _ = require("lodash");

class typeParser {
    static parse(options: ISwaggerOptions, property:any, modelPrefix?: string): string {
        if (property.schema) {
            return this.parse(options, property.schema, modelPrefix);
        }

        if (property.$ref) {

            if (property.$ref == "Object")
                return "any";


            var prefix: string = modelPrefix || "";
            var res = property.$ref.replace("#/definitions/", "");
            res = prefix + res;

            var moduleName: string = "";
            if (options.modelModuleName)
                moduleName = options.modelModuleName + ".";



            return moduleName + res;
        }

        switch (property.type) {
            case "array":
                return this.parse(options, property.items, modelPrefix) + "[]";
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
