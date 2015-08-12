import helper = require("./creatorHelper");

class deleteCreator {
    static create(signature: ISignatureDefinition): string {
        var result: string = "";
        result += "\n\t" + signature.signature.replace(";", " {") + "\n";
        result += helper.generatePathFromSignature(signature);
        result += "\t\treturn this.httpDelete(path);\n";
        result += "\t}\n";
        return result;
    }
}

export = deleteCreator;
