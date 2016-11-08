"use strict";
const helper = require("./creatorHelper");
class deleteCreator {
    static create(signature) {
        var result = "";
        result += "\t" + signature.signature.replace(";", " {") + "\n";
        result += helper.generatePathFromSignature(signature);
        result += "\t\treturn this.httpDelete(path);\n";
        result += "\t}\n";
        return result;
    }
}
module.exports = deleteCreator;

//# sourceMappingURL=deleteCreator.js.map
