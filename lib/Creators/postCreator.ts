class postCreator {
    static create(signature: ISignatureDefinition): string {
        var signatureText = "";
        signatureText += "\t" + signature.signature.replace(";", "{") + "\n";
        signatureText += "\t\tvar fullPath = this.host + '" + signature.path + "';\n";
        signatureText += "\t\treturn this.httpPost(fullPath, " + signature.parameters[0].name + ");\n";
        signatureText += "\t}\n\n";
        return signatureText;
    }
}
export = postCreator;