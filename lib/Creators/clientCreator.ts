import _            = require("lodash");
import postCreator  = require("./postCreator");
import getCreator   = require("./getCreator");

class clientCreator {
    static create(swaggerTitle: string, signatureDefinitions: ISignatureDefinition[]): string {

        var template: string = "";
        template += 'class ' + swaggerTitle.trim() + 'Client {\n\n';
        template += '\tprivate http: ng.IHttpService;\n';
        template += '\tprivate q: ng.IQService;\n\n';
        template += '\tconstructor(public host: string, http: ng.IHttpService, q: ng.IQService) {\n';
        template += '\t\tthis.http = http;\n';
        template += '\t\tthis.q = q;\n';
        template += '\t}\n';
        template += '[FUNCTIONS]\n';

        // resuable httpGet method wrapper
        template += "\tprivate httpGet(fullPath: string): ng.IPromise<any> {\n";
        template += "\t\tvar deffered = this.q.defer();\n";
        template += "\t\tthis.http.get(fullPath, { timeout: deffered }).then((result) => {\n";
        template += "\t\t\tdeffered.resolve(result.data);\n";
        template += "\t\t}).catch((error: ng.IHttpPromiseCallbackArg<string>) => {\n";
        template += "\t\t\tdeffered.reject(error);\n";
        template += "\t\t});\n";
        template += "\t\treturn deffered.promise;\n";
        template += "\t}\n";

        // resuable httpPost method wrapper
        template += "\tprivate httpPost(fullPath, object: any): ng.IPromise<any> {\n";
        template += "\t\tvar deffered = this.q.defer();\n";
        template += "\t\tthis.http.post(fullPath, object,\n";
        template += "\t\t{\n";
        template += "\t\t\theaders: {\n";
        template += "\t\t\t\t'Content-Type': 'application/json'\n";
        template += "\t\t\t}\n";
        template += "\t\t}).then((result) => {\n";
        template += "\t\t\tdeffered.resolve(result.data);\n";
        template += "\t\t}).catch((error: ng.IHttpPromiseCallbackArg<string>) => {\n";
        template += "\t\t\tdeffered.reject(error);";
        template += "\t\t});";
        template += "\t\treturn deffered.promise;\n";
        template += "\t}\n";


        template += '}\n';
        template += 'export = ' + swaggerTitle.trim() + 'Client;';


        var signatureText = "";

        // get a list of unique signatures names
        var uniqSignatures = _.uniq(signatureDefinitions, 'methodName');

        // loop through unique signatures
        _.forEach(uniqSignatures, (usd: ISignatureDefinition) => {

            // get list of signatures with matching methodName
            var signatures = _.filter(signatureDefinitions, (sd: ISignatureDefinition) => { return sd.methodName == usd.methodName; });


            if (signatures.length > 1) {
                // this means we have to create an overload for this signature

                // loop through the signatures and create the overloads with no implementation
                _.forEach(signatures, (s: ISignatureDefinition) => {
                    signatureText += "\t" + s.signature + "\n";
                });



                // get the signature with the most and least parameters, we will use it to create the implementation for this method
                var signatureWithLeastParams = _.min<ISignatureDefinition>(signatures, "parameters.length");
                var signatureWithMostParams = _.max<ISignatureDefinition>(signatures, "parameters.length");

                // lets loop through the params of the signature with most parameters
                var signatureImpText = "\t" + signatureWithMostParams.methodName + "(";
                _.forEach(signatureWithMostParams.parameters, (p: IParamDefinition, i: number) => {
                    signatureImpText += "arg" + i.toString() + "?:any, ";
                });
                signatureImpText = signatureImpText.substr(0, signatureImpText.length - 2);
                signatureImpText += ") {\n[IMP]\n\t}";

                var impText = "";
                impText = "\t\tvar path='" + signatureWithLeastParams.path + "';\n\n";

                // logic to create overload checks on parameters
                _.forEach(signatureWithMostParams.parameters, (p: IParamDefinition, i: number) => {
                    var arg = "arg" + i.toString();
                    impText += "\t\tif (" + arg + " && typeof (" + arg + ") === '" + p.type + "') {\n";
                    impText += "\t\t\tpath += '/{" + arg + "}';\n"
                    impText += "\t\t\tpath = path.replace('{" + arg + "}', " + arg + ".toString());\n"
                    impText += "\t\t}\n\n"
                });


                impText += "\t\tvar fullPath = this.host + path;\n";
                impText += "\t\treturn this.httpGet(fullPath);\n";

                signatureImpText = signatureImpText.replace("[IMP]", impText);
                signatureText = signatureText + signatureImpText + "\n\n";
            } else {

                if (signatures[0].method == "post") {
                    signatureText += postCreator.create(signatures[0]);
                }
                if (signatures[0].method == "get") {
                    signatureText += getCreator.create(signatures[0]);
                }
            }
        });
        template = template.replace("[FUNCTIONS]", signatureText);

        return template;

        //fs.writeFileSync(this.destPath + "/" + this.swaggerObject.info.title + "/" + this.swaggerObject.info.title + "Client.ts", template);
        //console.log(" --> " + this.destPath + "/" + this.swaggerObject.info.title + "/" + this.swaggerObject.info.title + "Client.ts was created");
       
    }
}
export = clientCreator;