"use strict";
const _ = require("lodash");
const helper = require("./creatorHelper");
class putCreator {
    static create(signature) {
        var result = "\t" + signature.signature.replace(";", " {") + "\n";
        result += helper.generatePathFromSignature(signature);
        var bodyparam = _.find(signature.parameters, (p) => {
            return p.paramType == 4;
        });
        if (bodyparam) {
            result += "\t\treturn this.httpPut(path, " + bodyparam.name + ");\n";
        }
        else {
            result += "\t\treturn this.httpPut(path, null);\n";
        }
        result += "\t}\n";
        return result;
    }
}
module.exports = putCreator;

//# sourceMappingURL=putCreator.js.map
