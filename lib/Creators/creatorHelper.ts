import _ = require("lodash");

class creatorHelper {
    static generatePathFromSignature(signature: ISignatureDefinition): string {
        var result = "\t\tvar path = this.host + \"" + signature.path + "\";\n";

        // logic to create overload checks on parameters
        var query = "";
        var queryCnt = 0;
        _.forEach(signature.parameters, (p: IParamDefinition, i: number) => {
            if (p.i_n == "path") {
                result += "\t\tpath = path.replace(\"{" + p.name.trim() + "}\", " + p.name + ".toString());\n";
            }

            if (p.i_n == "query") {
                if (p.type != "array") {
                    if (queryCnt == 0) {
                        query += "\t\tpath += \"?" + p.name + "=\" + " + p.name + ";\n";
                    } else {
                        query += "\t\tpath += \"&" + p.name + "=\" + " + p.name + ";\n";
                    }
                } else {
                    query += "\t\tvar qs = \"\";\n";
                    query += "\t\tfor (var i = 0; i < " + p.name + ".length; i++) {\n";
                    query += "\t\t\tqs += \"" + p.name + "=\" + " + p.name + "[i] + \"&\"\n";
                    query += "\t\t}\n";
                    query += "\t\tif (qs.length > 0) path += \"?\" + qs;\n";
                }

                queryCnt++;
            }
        });

        if (query.length > 0) {
            result += query;
        }

        return result;
    }
}

export = creatorHelper;