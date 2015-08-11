import _ = require("lodash");

class postCreator {
    static create(signature: ISignatureDefinition): string {

        
        var signatureText = "";
        signatureText += "\t" + signature.signature.replace(";", "{") + "\n";
        signatureText += "\t\tvar path = this.host + '" + signature.path + "';\n";


        var query = "";
        _.forEach(signature.parameters, (p: IParamDefinition, i: number) => {
            if (p.i_n == "path")
                signatureText += "\t\tpath = path.replace('{" + p.name.trim() + "}', " + p.name + ".toString());\n";
            if (p.i_n == "query") {

                if (p.type != "array") {
                    if (i == 0)
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
            }
        });
        if (query.length > 0) {
            signatureText += query;
        }


        // get the in body parameter
        var bodyparam = _.find(signature.parameters, (p: IParamDefinition) => {
            return p.i_n == "body";
        });

        if (bodyparam) {
            signatureText += "\t\treturn this.httpPost(path, " + bodyparam.name + ");\n";
        } else {
            signatureText += "\t\treturn this.httpPost(path, null);\n";
        }

        signatureText += "\t}\n\n";
        return signatureText;
    }
}
export = postCreator;