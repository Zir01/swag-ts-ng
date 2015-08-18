import _      = require("lodash");
import helper = require("./creatorHelper");

class postCreator {
    static create(signature: ISignatureDefinition): string {
        var result = "\t" + signature.signature.replace(";", " {") + "\n";
        result += helper.generatePathFromSignature(signature);

        // get the in body parameter
        var bodyparam = _.find(signature.parameters, (p: IParamDefinition) => {
            return p.paramType == ParamType.Body;
        });

        if (bodyparam) {
            result += "\t\treturn this.httpPost(path, " + bodyparam.name + ");\n";
        } else {
            result += "\t\treturn this.httpPost(path, null);\n";
        }

        result += "\t}\n";
        return result;
    }
}

export = postCreator;
