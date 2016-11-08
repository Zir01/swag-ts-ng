"use strict";
const _ = require("lodash");
const parameterParser = require("../Parsers/parameterParser");
const typeParser = require("../Parsers/typeParser");
class signatureCreator {
    static create(options, pathsObject, modelPrefix) {
        var signatureDefinitions = [];
        for (var p in pathsObject) {
            for (var method in pathsObject[p]) {
                if (method != "options") {
                    var functionName = pathsObject[p][method].operationId;
                    var parameters = pathsObject[p][method].parameters;
                    var responses = pathsObject[p][method].responses;
                    var summary = pathsObject[p][method].summary;
                    var signature = functionName;
                    var paramDefs = [];
                    if (parameters && parameters.length > 0) {
                        signature += "(";
                        _.forEach(parameters, (param) => {
                            var paramDef = parameterParser.parse(options, param, "I");
                            paramDefs.push(paramDef);
                            signature += paramDef.text + ", ";
                        });
                        signature = signature.substr(0, signature.length - 2);
                        signature += ")";
                    }
                    else {
                        signature += "()";
                    }
                    var responseFound = false;
                    for (var r in responses) {
                        if (r == "200") {
                            var responseType = typeParser.parse(options, responses[r], "I");
                            signature += ": ng.IPromise<" + responseType + ">;";
                            responseFound = true;
                        }
                    }
                    if (!responseFound) {
                        signature += ": ng.IPromise<any>;";
                    }
                    var signatureDefinition = {
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
module.exports = signatureCreator;

//# sourceMappingURL=signatureCreator.js.map
