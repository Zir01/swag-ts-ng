import helper = require("./creatorHelper");

class getCreator {
    static create(signature: ISignatureDefinition): string {
        var result: string = "";
        result += "\t" + signature.signature.replace(";", " {") + "\n";
        result += helper.generatePathFromSignature(signature);
        result += "\t\treturn this.httpGet(path);\n";
        result += "\t}\n";
        return result;
    }
}

export = getCreator;
