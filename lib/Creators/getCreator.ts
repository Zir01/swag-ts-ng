import _ = require("lodash");

class getCreator{
    static create(signature: ISignatureDefinition): string {
 
        var impText = "";

        impText += "\t" + signature.signature.replace(";", "{") + "\n";
        impText += "\t\tvar path='" + signature.path + "'\n\n";

        // logic to create overload checks on parameters

        var query = "";
        var queryCnt = 0;
        _.forEach(signature.parameters, (p: IParamDefinition, i: number) => {
            if (p.i_n == "path")
                impText += "\t\tpath = path.replace('{" + p.name.trim() + "}', " + p.name + ".toString());\n";
            if (p.i_n == "query") {

                if (p.type != "array") {
                    if (queryCnt == 0)
                        query += "\t\tpath += '?" + p.name + "=' + " + p.name + ";\n";
                    else
                        query += "\t\tpath += '&" + p.name + "=' + " + p.name + ";\n";
                } else {
                    query += "\t\tvar qs = '';\n";
                    query += "\t\tfor (var i = 0; i < " + p.name + ".length; i++) {\n";
                    query += "\t\t\tqs += '" + p.name + "=' + " + p.name + "[i] + '&'\n";
                    query += "\t\t}\n";
                    query += "\t\tif (qs.length > 0) path += '?' + qs;\n";
                }
                queryCnt++;
            }
        });
        if (query.length > 0) {
            impText += query;
        }


        impText += "\t\tvar fullPath = this.host + path;\n";
        impText += "\t\treturn this.httpGet(fullPath);\n";
        impText += "\t}\n";
        return impText;
    }
}
export = getCreator;