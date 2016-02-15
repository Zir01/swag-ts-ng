import _                = require("lodash");
import parameterParser  = require("../Parsers/parameterParser");
import typeParser       = require("../Parsers/typeParser");

class signatureCreator {
    static create(options: ISwaggerOptions, pathsObject, modelPrefix: string): ISignatureDefinition[] {
        var signatureDefinitions: ISignatureDefinition[] = [];

        for (var p in pathsObject) {
            // loop through the METHODS of the path
            for (var method in pathsObject[p]) {
                if (method != "options") {
                    var functionName: string = pathsObject[p][method].operationId;
                    var parameters: any[] = pathsObject[p][method].parameters;
                    var responses: any = pathsObject[p][method].responses;
                    var summary: any = pathsObject[p][method].summary;

                    var signature: string = functionName;
                    var paramDefs: IParamDefinition[] = [];
                    if (parameters && parameters.length > 0) {
                        signature += "(";
                        _.forEach(parameters, (param) => {
                            var paramDef = parameterParser.parse(options, param, "I");
                            paramDefs.push(paramDef);
                            signature += paramDef.text + ", ";
                        });
                        signature = signature.substr(0, signature.length - 2);
                        signature += ")";
                    } else {
                        signature += "()";
                    }

                    var responseFound: boolean = false;
                    for (var r in responses) {
                        if (r == "200") {
                            var responseType: string = typeParser.parse(options, responses[r], "I");
                            signature += ": ng.IPromise<" + responseType + ">;"
                            responseFound = true;
                        }
                    }

                    if (!responseFound) {
                        signature += ": ng.IPromise<any>;"
                    }

                    var signatureDefinition: ISignatureDefinition = {
                        methodName: functionName,
                        signature: signature,
                        parameters: paramDefs,
                        path: p,
                        method: method
                    };

                    if (summary && summary.length > 0) {
                        signatureDefinition.summary = summary;
                    }

                    signatureDefinitions.push(signatureDefinition);
                }
            }
        }

        return signatureDefinitions;
    }
}

export = signatureCreator;
