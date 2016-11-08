"use strict";
const helper = require("./creatorHelper");
class getCreator {
    static create(signature) {
        var result = "";
        result += "\t" + signature.signature.replace(";", " {") + "\n";
        result += helper.generatePathFromSignature(signature);
        result += "\t\treturn this.httpGet(path);\n";
        result += "\t}\n";
        return result;
    }
}
module.exports = getCreator;

//# sourceMappingURL=getCreator.js.map
