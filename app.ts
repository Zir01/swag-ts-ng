import querystring = require("querystring");
import http = require("http");
import fs = require("fs");
import _ = require("lodash");

class SwaggerService{

    swaggerVersion: string;
    version: string;
    title: string;
    modelDefinitions: IModelDefinition[];
    signatureDefinitions: ISignatureDefinition[];
    apiModuleName: string;

    baseFolder: string;

    constructor(public options: ISwaggerOptions) {
        this.modelDefinitions = [];
        this.signatureDefinitions = [];

        if (options.destination && options.destination.length > 0) {
            this.baseFolder = options.destination + "/API";
        } else {
            this.baseFolder = "API";
        }

    }

    public process() {

        console.log("Connecting to: " + this.options.swaggerPath);
        http.get(this.options.swaggerPath, (res) => {
            res.setEncoding('utf-8');

            var swaggerString = '';

            res.on('data', (data)=> {
                swaggerString += data;
            });

            res.on('end', ()=> {
                var swaggerObject = JSON.parse(swaggerString);

                this.swaggerVersion = swaggerObject.swagger;
                this.version = swaggerObject.info.version;
                this.title = swaggerObject.info.title;
                this.apiModuleName = "API." + this.title;

                console.log("Found API " + this.title + ", swagger version: " + this.version);



                

                // create base API folder if does not exist
                if (!fs.existsSync(this.baseFolder)) {
                    fs.mkdirSync(this.baseFolder);
                    console.log(this.baseFolder + " folder created");
                }



                // create API sub folder for this API based on swagger title, if does not exist
                if (!fs.existsSync(this.baseFolder + "/" + this.title)) {
                    fs.mkdirSync(this.baseFolder +  "/" + this.title);
                    console.log(this.baseFolder +  "/" + this.title + "/ folder created");
                }




                // loop through definitions
                console.log("Creating definition files:");
                var definitions = swaggerObject.definitions;
                for (var p in definitions) {
                    this.createInterface(p, definitions[p]);
                }

                
                
                
                // loop through paths
                console.log("Creating signatures based on paths");
                var paths = swaggerObject.paths;
                for (var p in paths) {
                    this.createSignature(p, paths[p]);
                }


                // we have all we need in modelDefinitions[] and signatures[]
                console.log("Creating client class:");
                this.createClientCode();



            });
        });




    }

    private createInterface(name, definition) {
        if (definition.type == "object") {

            

            var fileContents = "module API." + this.title + " {\n"

            fileContents += "\texport interface I" + name + " {\n";
            for (var p in definition.properties) {
                fileContents += "\t\t" + p + ": " + this.parseType(definition.properties[p]) + ";\n";
            }
            fileContents += "\t}\n";
            fileContents += "}";

            var modelDef: IModelDefinition = {
                definitionName: "#/definitions/" + name,
                interfaceName:  this.apiModuleName + ".I" + name,
                fileContents: fileContents
            };

            fs.writeFile(this.baseFolder +  "/" + this.title + "/I" + name + ".ts", fileContents, (err)=> {
                if (err) {
                    return console.log(err);
                }
                console.log("Interface I" + name + ".ts file was created");
            }); 

            this.modelDefinitions.push(modelDef);
        }
    }

    private createClientCode() {

        var template: string = "";
        template += 'class ' + this.title.trim() + 'Client {\n';
        template += '\tconstructor(public host: string, public http: ng.IHttpService, public q: ng.IQService) {\n';
        template += '\t}\n';
        template += '[FUNCTIONS]\n';
        template += '}\n';
        template += 'export = ' + this.title.trim() + 'Client;';

        
        var signatureText = "";

        // get a list of unique signatures names
        var uniqSignatures = _.uniq(this.signatureDefinitions, 'methodName');

        // loop through unique signatures
        _.forEach(uniqSignatures, (usd: ISignatureDefinition) => {

            // get list of signatures with matching methodName
            var signatures = _.filter(this.signatureDefinitions, (sd: ISignatureDefinition) => { return sd.methodName == usd.methodName; });


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
                impText = "\t\tvar path='" + signatureWithLeastParams.path + "'\n\n";

                // logic to create overload checks on parameters
                _.forEach(signatureWithMostParams.parameters, (p: IParamDefinition, i: number) => {
                    var arg = "arg" + i.toString();
                    impText += "\t\tif (" + arg + " && typeof (" + arg + ") === '" + p.type + "') {\n";
                    impText += "\t\t\tpath += '/{" + arg + "}';\n"
                    impText += "\t\t\tpath = path.replace('{" + arg + "}', " + arg + ".toString());\n"
                    impText += "\t\t}\n\n"
                });


                impText += "\t\tvar fullPath = this.host + path;\n";
                impText += "\t\tvar deffered = this.q.defer();\n";
                impText += "\t\tthis.http.get(fullPath, { timeout: deffered }).then((result) => {\n";
                impText += "\t\t\tdeffered.resolve(result.data);\n";
                impText += "\t\t}).catch((error: ng.IHttpPromiseCallbackArg<string>) => {\n";
                impText += "\t\t\tdeffered.reject(error);\n";
                impText += "\t\t});\n";
                impText += "\t\treturn deffered.promise;\n";

                signatureImpText = signatureImpText.replace("[IMP]", impText);
                signatureText = signatureText + signatureImpText + "\n\n";

                console.log("Function " + signatureWithMostParams.methodName + " created");

            } else {

                if (signatures[0].method == "post") {
                    signatureText += this.getPostString(signatures[0]);
                }
                if (signatures[0].method == "get") {
                    signatureText += this.getGetString(signatures[0]);
                }
                console.log("Function " + signatures[0].methodName + " created");

            }
        });
        template = template.replace("[FUNCTIONS]", signatureText);



        fs.writeFile(this.baseFolder +  "/" + this.title + "/" + this.title + "Client.ts", template, (err) => {
            if (err) {
                return console.log(err);
            }
            console.log(this.baseFolder + "/" + this.title + "/" + this.title + "Client.ts was created");
        }); 

    }


    private getGetString(signature: ISignatureDefinition): string {


        var impText = "";

        impText += "\t" + signature.signature.replace(";", "{") + "\n";
        impText += "\t\tvar path='" + signature.path + "'\n\n";

        // logic to create overload checks on parameters
        _.forEach(signature.parameters, (p: IParamDefinition, i: number) => {
            impText += "\t\tpath = path.replace('{" + p.name + "}', " + p.name + ".toString());\n"
        });


        impText += "\t\tvar fullPath = this.host + path;\n";
        impText += "\t\tvar deffered = this.q.defer();\n";
        impText += "\t\tthis.http.get(fullPath, { timeout: deffered }).then((result) => {\n";
        impText += "\t\t\tdeffered.resolve(result.data);\n";
        impText += "\t\t}).catch((error: ng.IHttpPromiseCallbackArg<string>) => {\n";
        impText += "\t\t\tdeffered.reject(error);\n";
        impText += "\t\t});\n";
        impText += "\t\treturn deffered.promise;\n";
        impText += "\t}\n\n";

        return impText;

    }

    private getPostString(signature: ISignatureDefinition): string {
        var signatureText = "";
        signatureText += "\t" + signature.signature.replace(";", "{") + "\n";
        signatureText += "\t\tvar fullPath = this.host + '" + signature.path + "';\n";
        signatureText += "\t\tvar deffered = this.q.defer();\n";
        signatureText += "\t\tthis.http.post(fullPath, " + signature.parameters[0].name + ",\n";
        signatureText += "\t\t\t{\n";
        signatureText += "\t\t\t\theaders: {\n";
        signatureText += "\t\t\t\t\t'Content-Type': 'application/json'\n";
        signatureText += "\t\t\t\t}\n";
        signatureText += "\t\t\t}).then((result) => {\n";
        signatureText += "\t\t\t\tdeffered.resolve(result);\n";
        signatureText += "\t\t}).catch((error: ng.IHttpPromiseCallbackArg<string>) => {\n";
        signatureText += "\t\t\tdeffered.reject(error);\n";
        signatureText += "\t\t});\n";
        signatureText += "\t\treturn deffered.promise;\n";
        signatureText += "\t}\n\n";

        return signatureText;

    }

    private createSignature(name, path) {

        // loop through the METHODS of the path
        for (var method in path) {
            if (method != "options") {
                var functionName: string = path[method].operationId;
                var parameters: any[] = path[method].parameters;
                var responses: any = path[method].responses;

                var signature: string = functionName;
                var paramDefs: IParamDefinition[] = [];
                if (parameters && parameters.length > 0) {
                    signature += "(";
                    _.forEach(parameters, (param) => {
                        var paramDef = this.parseParameter(param);
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
                        var responseType: string = this.parseResponse(responses[r]);
                        signature += ":ng.IPromise<" + responseType + ">;"
                    }
                }

                var signatureDefinition: ISignatureDefinition = {
                    methodName: functionName,
                    signature: signature,
                    parameters: paramDefs,
                    path: name,
                    method: method
                };

                this.signatureDefinitions.push(signatureDefinition);
            }
        }
        

    }

    private parseResponse(property: any): string {


        if (property.schema.type) {
            if (property.schema.type == "array") {
                if (property.schema.items.type) {
                    return property.schema.items.type + "[]";
                } else {
                    return _.find(this.modelDefinitions, (d: IModelDefinition) => { return d.definitionName == property.schema.items.$ref; }).interfaceName + "[]";
                }
            } else {
                if (property.schema.type) {
                    return property.schema.type;
                } else {
                    return _.find(this.modelDefinitions, (d: IModelDefinition) => { return d.definitionName == property.schema.$ref; }).interfaceName;
                }
            }
        } else {
            return _.find(this.modelDefinitions, (d: IModelDefinition) => { return d.definitionName == property.schema.$ref; }).interfaceName;
        }

    }

    private parseParameter(property: any): IParamDefinition {

        var paramDef: string = property.name;
        if (!property.required) paramDef += "?";

        if (property.type) {
            var type = this.parseType(property);
            paramDef += ":" + type;
            return {
                name: property.name,
                required: property.required,
                type: type,
                text: paramDef
            };
        }
        if (property.schema) {
            if (property.schema.type) {
                paramDef += ":" + property.schema.type;
                return {
                    name: property.name,
                    required: property.required,
                    type: property.schema.type,
                    text: paramDef
                };
            } else {
                var type = _.find(this.modelDefinitions, (md: IModelDefinition) => { return md.definitionName == property.schema.$ref; }).interfaceName;
                paramDef += ":" + type;
                return {
                    name: property.name,
                    required: property.required,
                    type: type,
                    text: paramDef
                };
            }
        }

    }

    private parseType(property: any): string {

        if (!property.type) {
            // check $ref;
            if (property.$ref) {
                return "I" + property.$ref;
            }
            if (property.schema.$ref) {
                return _.find(this.modelDefinitions, (md: IModelDefinition) => {return md.definitionName == property.schema.$ref;}).interfaceName;
            }
        }

        if (property.type == "integer") return "number";
        if (property.type == "array") {
            if (property.items.type) return property.items.type + "[]";
            if (property.items.$ref) return "I" + property.items.$ref + "[]";
        }

        return property.type;
    }


}

//var opt: ISwaggerOptions = {
//    swaggerPath: "http://localhost:54144/swagger/docs/v1",
//    destination: "app"
//};
//var swaggerService = new SwaggerService(opt);
//swaggerService.process();



exports.process = (options: ISwaggerOptions) => {


    if (!options) {
        console.error("Sorry. Please supply options with swaggerPath and destination properties");
    }
    else {
        var swaggerService = new SwaggerService(options);
        swaggerService.process();
    }
}