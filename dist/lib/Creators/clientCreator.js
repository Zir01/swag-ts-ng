"use strict";
const _ = require("lodash");
const deleteCreator = require("./deleteCreator");
const documentationCreator = require("./documentationCreator");
const getCreator = require("./getCreator");
const postCreator = require("./postCreator");
const putCreator = require("./putCreator");
class clientCreator {
    static create(options, signatureDefinitions) {
        var template = "";
        template += "class " + options.clientClassName + " {\n";
        template += "\tprivate http: ng.IHttpService;\n";
        template += "\tprivate q: ng.IQService;\n\n";
        template += "\tconstructor(public host: string, http: ng.IHttpService, q: ng.IQService) {\n";
        template += "\t\tthis.http = http;\n";
        template += "\t\tthis.http.defaults.withCredentials = true;\n";
        template += "\t\tthis.q = q;\n";
        template += "\t}\n";
        template += "[FUNCTIONS]\n";
        template += "\tprivate httpDelete(fullPath: string): ng.IPromise<any> {\n";
        template += "\t\tvar deferred = this.q.defer();\n";
        template += "\t\tthis.http.delete(fullPath, { timeout: deferred })\n";
        template += "\t\t\t.then((result: ng.IHttpPromiseCallbackArg<{}>) => { deferred.resolve(result.data); })\n";
        template += "\t\t\t.catch((error: ng.IHttpPromiseCallbackArg<string>) => { deferred.reject(error); });\n";
        template += "\t\treturn deferred.promise;\n";
        template += "\t}\n\n";
        template += "\tprivate httpGet(fullPath: string): ng.IPromise<any> {\n";
        template += "\t\tvar deferred = this.q.defer();\n";
        template += "\t\tthis.http.get(fullPath, { timeout: deferred })\n";
        template += "\t\t\t.then((result: ng.IHttpPromiseCallbackArg<{}>) => { deferred.resolve(result.data); })\n";
        template += "\t\t\t.catch((error: ng.IHttpPromiseCallbackArg<string>) => { deferred.reject(error); });\n";
        template += "\t\treturn deferred.promise;\n";
        template += "\t}\n\n";
        template += "\tprivate httpPost(fullPath: string, object: any): ng.IPromise<any> {\n";
        template += "\t\tvar deferred = this.q.defer();\n";
        template += "\t\tthis.http.post(fullPath, object, { headers: { \"Content-Type\": \"application/json\" } })\n";
        template += "\t\t\t.then((result: ng.IHttpPromiseCallbackArg<{}>) => { deferred.resolve(result.data); })\n";
        template += "\t\t\t.catch((error: ng.IHttpPromiseCallbackArg<string>) => { deferred.reject(error); });\n";
        template += "\t\treturn deferred.promise;\n";
        template += "\t}\n\n";
        template += "\tprivate httpPut(fullPath: string, object: any): ng.IPromise<any> {\n";
        template += "\t\tvar deferred = this.q.defer();\n";
        template += "\t\tthis.http.put(fullPath, object, { headers: { \"Content-Type\": \"application/json\" } })\n";
        template += "\t\t\t.then((result: ng.IHttpPromiseCallbackArg<{}>) => { deferred.resolve(result.data); })\n";
        template += "\t\t\t.catch((error: ng.IHttpPromiseCallbackArg<string>) => { deferred.reject(error); });\n";
        template += "\t\treturn deferred.promise;\n";
        template += "\t}\n";
        var signatureText = "";
        var uniqSignatures = _.uniq(signatureDefinitions, 'methodName');
        _.forEach(uniqSignatures, (usd) => {
            var signatures = _.filter(signatureDefinitions, (sd) => { return sd.methodName == usd.methodName; });
            if (signatures.length > 1) {
                signatureText += "\n";
                var signatureWithLeastParams = _.min(signatures, "parameters.length");
                var signatureWithMostParams = _.max(signatures, "parameters.length");
                signatureText += documentationCreator.create(signatureWithMostParams);
                _.forEach(signatures, (s) => {
                    signatureText += "\t" + s.signature + "\n";
                });
                var signatureImpText = "\t" + signatureWithMostParams.methodName + "(";
                _.forEach(signatureWithMostParams.parameters, (p, i) => {
                    signatureImpText += "arg" + i.toString() + "?: any, ";
                });
                signatureImpText = signatureImpText.substr(0, signatureImpText.length - 2);
                signatureImpText += ") {\n[IMP]\n\t}";
                var impText = "";
                impText = "\t\tvar path = this.host + \"" + signatureWithLeastParams.path + "\";\n\n";
                _.forEach(signatureWithMostParams.parameters, (p, i) => {
                    var arg = "arg" + i.toString();
                    impText += "\t\tif (" + arg + " && typeof (" + arg + ") === \"" + p.dataType + "\") {\n";
                    impText += "\t\t\tpath += \"/{" + arg + "}\";\n";
                    impText += "\t\t\tpath = path.replace(\"{" + arg + "}\", " + arg + ".toString());\n";
                    impText += "\t\t}\n\n";
                });
                impText += "\t\treturn this.httpGet(path);";
                signatureImpText = signatureImpText.replace("[IMP]", impText);
                signatureText = signatureText + signatureImpText + "\n";
            }
            else {
                signatureText += "\n";
                signatureText += documentationCreator.create(signatures[0]);
                if (signatures[0].method == "delete") {
                    signatureText += deleteCreator.create(signatures[0]);
                }
                if (signatures[0].method == "get") {
                    signatureText += getCreator.create(signatures[0]);
                }
                if (signatures[0].method == "post") {
                    signatureText += postCreator.create(signatures[0]);
                }
                if (signatures[0].method == "put") {
                    signatureText += putCreator.create(signatures[0]);
                }
            }
        });
        template = template.replace("[FUNCTIONS]", signatureText);
        if (options.clientModuleName) {
            template = template.replace(/^\t/gm, "\t\t");
            template = "\texport " + template + "\t}\n";
        }
        else {
            template += "}\n\nexport = " + options.clientClassName + "\n";
        }
        var result = {
            codeType: 2,
            moduleName: options.clientModuleName,
            name: options.clientClassName,
            body: template
        };
        return result;
    }
}
module.exports = clientCreator;

//# sourceMappingURL=clientCreator.js.map
