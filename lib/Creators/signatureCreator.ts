import _                = require("lodash");
import parameterParser  = require("../Parsers/parameterParser");
import responseParser   = require("../Parsers/responseParser");

class signatureCreator {
    static create(modelDefinitions, pathsObject): ISignatureDefinition[]{

        var signatureDefinitions:ISignatureDefinition[] = [];

        for (var p in pathsObject) {
            // loop through the METHODS of the path
            for (var method in pathsObject[p]) {
                if (method != "options") {
                    var functionName: string = pathsObject[p][method].operationId;
                    var parameters: any[] = pathsObject[p][method].parameters;
                    var responses: any = pathsObject[p][method].responses;

                    var signature: string = functionName;
                    var paramDefs: IParamDefinition[] = [];
                    if (parameters && parameters.length > 0) {
                        signature += "(";
                        _.forEach(parameters, (param) => {
                            var paramDef = parameterParser.parse(modelDefinitions, param);
                            paramDefs.push(paramDef);
                            signature += paramDef.text + ", ";
                        });
                        signature = signature.substr(0, signature.length - 2);
                        signature += ")";
                    } else {
                        signature += "()";
                    }

                    for (var r in responses) {
                        if (r == "200") {
                            var responseType: string = responseParser.parse(modelDefinitions, responses[r]);
                            signature += ":ng.IPromise<" + responseType + ">;"
                        }
                    }

                    var signatureDefinition: ISignatureDefinition = {
                        methodName: functionName,
                        signature: signature,
                        parameters: paramDefs,
                        path: p,
                        method: method
                    };

                    signatureDefinitions.push(signatureDefinition);
                    console.log(" --> Signature " + signatureDefinition.signature);
                }
            }
        }

        return signatureDefinitions;
    }
}
export = signatureCreator;