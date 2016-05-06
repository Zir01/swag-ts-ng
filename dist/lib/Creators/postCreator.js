"use strict";
const _ = require("lodash");
const helper = require("./creatorHelper");
class postCreator {
    static create(signature) {
        var result = "\t" + signature.signature.replace(";", " {") + "\n";
        result += helper.generatePathFromSignature(signature);
        var bodyparam = _.find(signature.parameters, (p) => {
            return p.paramType == 4;
        });
        if (bodyparam) {
            result += "\t\treturn this.httpPost(path, " + bodyparam.name + ");\n";
        }
        else {
            result += "\t\treturn this.httpPost(path, null);\n";
        }
        result += "\t}\n";
        return result;
    }
}
module.exports = postCreator;

//# sourceMappingURL=postCreator.js.map
