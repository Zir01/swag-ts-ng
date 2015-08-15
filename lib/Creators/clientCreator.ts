import _                    = require("lodash");
import deleteCreator        = require("./deleteCreator");
import documentationCreator = require("./documentationCreator");
import getCreator           = require("./getCreator");
import postCreator          = require("./postCreator");
import putCreator           = require("./putCreator");

class clientCreator {
    static create(options: ISwaggerOptions, signatureDefinitions: ISignatureDefinition[]): string {
        var template: string = "";
        template += "class " + options.clientClassName + " {\n";
        template += "\tprivate http: ng.IHttpService;\n";
        template += "\tprivate q: ng.IQService;\n\n";
        template += "\tconstructor(public host: string, http: ng.IHttpService, q: ng.IQService) {\n";
        template += "\t\tthis.http = http;\n";
        template += "\t\tthis.http.defaults.withCredentials = true;\n";
        template += "\t\tthis.q = q;\n";
        template += "\t}\n";
        template += "[FUNCTIONS]\n";

        // resuable httpDelete method wrapper
        template += "\tprivate httpDelete(fullPath: string): ng.IPromise<any> {\n";
        template += "\t\tvar deferred = this.q.defer();\n";
        template += "\t\tthis.http.delete(fullPath, { timeout: deferred })\n";
        template += "\t\t\t.then((result: angular.IHttpPromiseCallbackArg<{}>) => { deferred.resolve(result.data); })\n";
        template += "\t\t\t.catch((error: ng.IHttpPromiseCallbackArg<string>) => { deferred.reject(error); });\n";
        template += "\t\treturn deferred.promise;\n";
        template += "\t}\n\n";

        // resuable httpGet method wrapper
        template += "\tprivate httpGet(fullPath: string): ng.IPromise<any> {\n";
        template += "\t\tvar deferred = this.q.defer();\n";
        template += "\t\tthis.http.get(fullPath, { timeout: deferred })\n";
        template += "\t\t\t.then((result: angular.IHttpPromiseCallbackArg<{}>) => { deferred.resolve(result.data); })\n";
        template += "\t\t\t.catch((error: ng.IHttpPromiseCallbackArg<string>) => { deferred.reject(error); });\n";
        template += "\t\treturn deferred.promise;\n";
        template += "\t}\n\n";

        // resuable httpPost method wrapper
        template += "\tprivate httpPost(fullPath: string, object: any): ng.IPromise<any> {\n";
        template += "\t\tvar deferred = this.q.defer();\n";
        template += "\t\tthis.http.post(fullPath, object, { headers: { \"Content-Type\": \"application/json\" } })\n";
        template += "\t\t\t.then((result: angular.IHttpPromiseCallbackArg<{}>) => { deferred.resolve(result.data); })\n";
        template += "\t\t\t.catch((error: ng.IHttpPromiseCallbackArg<string>) => { deferred.reject(error); });\n";
        template += "\t\treturn deferred.promise;\n";
        template += "\t}\n\n";

        // resuable httpPut method wrapper
        template += "\tprivate httpPut(fullPath: string, object: any): ng.IPromise<any> {\n";
        template += "\t\tvar deferred = this.q.defer();\n";
        template += "\t\tthis.http.put(fullPath, object, { headers: { \"Content-Type\": \"application/json\" } })\n";
        template += "\t\t\t.then((result: angular.IHttpPromiseCallbackArg<{}>) => { deferred.resolve(result.data); })\n";
        template += "\t\t\t.catch((error: ng.IHttpPromiseCallbackArg<string>) => { deferred.reject(error); });\n";
        template += "\t\treturn deferred.promise;\n";
        template += "\t}\n";

        var signatureText = "";

        // get a list of unique signatures names
        var uniqSignatures = _.uniq(signatureDefinitions, 'methodName');

        // loop through unique signatures
        _.forEach(uniqSignatures, (usd: ISignatureDefinition) => {

            // get list of signatures with matching methodName
            var signatures = _.filter(signatureDefinitions, (sd: ISignatureDefinition) => { return sd.methodName == usd.methodName; });


            if (signatures.length > 1) {
                // this means we have to create an overload for this signature
                signatureText += "\n";

                // get the signature with the most and least parameters, we will use it to create the implementation for this method
                var signatureWithLeastParams = _.min<ISignatureDefinition>(signatures, "parameters.length");
                var signatureWithMostParams = _.max<ISignatureDefinition>(signatures, "parameters.length");

                // add documentation if any
                signatureText += documentationCreator.create(signatureWithMostParams);

                // loop through the signatures and create the overloads with no implementation
                _.forEach(signatures, (s: ISignatureDefinition) => {
                    signatureText += "\t" + s.signature + "\n";
                });

                // lets loop through the params of the signature with most parameters
                var signatureImpText = "\t" + signatureWithMostParams.methodName + "(";
                _.forEach(signatureWithMostParams.parameters, (p: IParamDefinition, i: number) => {
                    signatureImpText += "arg" + i.toString() + "?: any, ";
                });
                signatureImpText = signatureImpText.substr(0, signatureImpText.length - 2);
                signatureImpText += ") {\n[IMP]\n\t}";

                var impText = "";
                impText = "\t\tvar path = this.host + \"" + signatureWithLeastParams.path + "\";\n\n";

                // logic to create overload checks on parameters
                _.forEach(signatureWithMostParams.parameters, (p: IParamDefinition, i: number) => {
                    var arg = "arg" + i.toString();
                    impText += "\t\tif (" + arg + " && typeof (" + arg + ") === \"" + p.type + "\") {\n";
                    impText += "\t\t\tpath += \"/{" + arg + "}\";\n"
                    impText += "\t\t\tpath = path.replace(\"{" + arg + "}\", " + arg + ".toString());\n"
                    impText += "\t\t}\n\n"
                });

                impText += "\t\treturn this.httpGet(path);";

                signatureImpText = signatureImpText.replace("[IMP]", impText);
                signatureText = signatureText + signatureImpText + "\n";
            } else {
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
            template = "/* tslint:disable:max-line-length */\n\nmodule " + options.clientModuleName + " {\n\t\"use strict\";\n\n\texport " + template;
            template += "\t}\n";
            template += "}\n";
        } else {
            template = "/* tslint:disable:max-line-length */\n\n\"use strict\";\n\n" + template;
            template += "}\n";
            template += "\nexport = " + options.clientClassName + "\n";
        }

        return template;

        //fs.writeFileSync(this.destPath + "/" + this.swaggerObject.info.title + "/" + this.swaggerObject.info.title + "Client.ts", template);
        //console.log(" --> " + this.destPath + "/" + this.swaggerObject.info.title + "/" + this.swaggerObject.info.title + "Client.ts was created");
    }
}

export = clientCreator;
