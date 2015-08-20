import _ = require("lodash");

class creatorHelper {
    static generatePathFromSignature(signature: ISignatureDefinition): string {
        var result = "\t\tvar path = this.host + \"" + signature.path + "\";\n";
        var query = "";
        var queryCnt = 0;

        _.forEach(signature.parameters, (p: IParamDefinition, i: number) => {
            if (p.paramType == ParamType.Path) {
                result += "\t\tpath = path.replace(\"{" + p.name.trim() + "}\", " + p.name + ".toString());\n";
            }

            if (p.paramType == ParamType.Query) {
                if (p.dataType != "array") {
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
