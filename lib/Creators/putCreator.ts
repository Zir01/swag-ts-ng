import _ = require("lodash");
import helper = require("./creatorHelper");

class putCreator {
    static create(signature: ISignatureDefinition): string {
        var result = "\n\t" + signature.signature.replace(";", " {") + "\n";
        result += helper.generatePathFromSignature(signature);

        // get the in body parameter
        var bodyparam = _.find(signature.parameters, (p: IParamDefinition) => {
            return p.i_n == "body";
        });

        if (bodyparam) {
            result += "\t\treturn this.httpPut(path, " + bodyparam.name + ");\n";
        } else {
            result += "\t\treturn this.httpPut(path, null);\n";
        }

        result += "\t}\n";
        return result;
    }
}

export = putCreator;
