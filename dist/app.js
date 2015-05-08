var http = require("http");
var fs = require("fs");
var _ = require("lodash");
var SwaggerService = (function () {
    function SwaggerService(options) {
        this.options = options;
        this.modelDefinitions = [];
        this.signatureDefinitions = [];
        if (options.destination && options.destination.length > 0) {
            this.baseFolder = options.destination + "/API";
        }
        else {
            this.baseFolder = "API";
        }
    }
    SwaggerService.prototype.process = function () {
        var _this = this;
        console.log("Connecting to: " + this.options.swaggerPath);
        http.get(this.options.swaggerPath, function (res) {
            res.setEncoding('utf-8');
            res;
            var swaggerString = '';
            res.on('data', function (data) {
                swaggerString += data;
            });
            res.on('end', function () {
                var swaggerObject = JSON.parse(swaggerString);
                _this.swaggerVersion = swaggerObject.swagger;
                _this.version = swaggerObject.info.version;
                _this.title = swaggerObject.info.title;
                _this.apiModuleName = "API." + _this.title;
                console.log("Found API " + _this.title + ", swagger version: " + _this.version);
                // create base API folder if does not exist
                if (!fs.existsSync(_this.baseFolder)) {
                    fs.mkdirSync(_this.baseFolder);
                    console.log(_this.baseFolder + " folder created");
                }
                // create API sub folder for this API based on swagger title, if does not exist
                if (!fs.existsSync(_this.baseFolder + "/" + _this.title)) {
                    fs.mkdirSync(_this.baseFolder + "/" + _this.title);
                    console.log(_this.baseFolder + "/" + _this.title + "/ folder created");
                }
                // loop through definitions
                console.log("Creating definition files:");
                var definitions = swaggerObject.definitions;
                for (var p in definitions) {
                    _this.createInterface(p, definitions[p]);
                }
                // loop through paths
                console.log("Creating signatures based on paths");
                var paths = swaggerObject.paths;
                for (var p in paths) {
                    _this.createSignature(p, paths[p]);
                }
                // we have all we need in modelDefinitions[] and signatures[]
                console.log("Creating client class:");
                _this.createClientCode();
            });
        }).on('error', function (e) {
            console.log('Error while gettings: ' + _this.options.swaggerPath + ' - ' + e.message);
        });
        ;
    };
    SwaggerService.prototype.createInterface = function (name, definition) {
        if (definition.type == "object") {
            var fileContents = "module API." + this.title + " {\n";
            fileContents += "\texport interface I" + name + " {\n";
            for (var p in definition.properties) {
                fileContents += "\t\t" + p + ": " + this.parseType(definition.properties[p]) + ";\n";
            }
            fileContents += "\t}\n";
            fileContents += "}";
            var modelDef = {
                definitionName: "#/definitions/" + name,
                interfaceName: this.apiModuleName + ".I" + name,
                fileContents: fileContents
            };
            fs.writeFileSync(this.baseFolder + "/" + this.title + "/I" + name + ".ts", fileContents);
            console.log("Interface I" + name + ".ts file was created");
            this.modelDefinitions.push(modelDef);
        }
    };
    SwaggerService.prototype.createClientCode = function () {
        var _this = this;
        var template = "";
        template += 'class ' + this.title.trim() + 'Client {\n\n';
        template += '\tprivate http: ng.IHttpService;\n';
        template += '\private q: ng.IQService;\n\n';
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
        template += "\t\t\tdeffered.resolve(result);\n";
        template += "\t\t}).catch((error: ng.IHttpPromiseCallbackArg<string>) => {\n";
        template += "\t\t\tdeffered.reject(error);";
        template += "\t\t});";
        template += "\t\treturn deffered.promise;\n";
        template += "\t}\n";
        template += '}\n';
        template += 'export = ' + this.title.trim() + 'Client;';
        var signatureText = "";
        // get a list of unique signatures names
        var uniqSignatures = _.uniq(this.signatureDefinitions, 'methodName');
        // loop through unique signatures
        _.forEach(uniqSignatures, function (usd) {
            // get list of signatures with matching methodName
            var signatures = _.filter(_this.signatureDefinitions, function (sd) {
                return sd.methodName == usd.methodName;
            });
            if (signatures.length > 1) {
                // this means we have to create an overload for this signature
                // loop through the signatures and create the overloads with no implementation
                _.forEach(signatures, function (s) {
                    signatureText += "\t" + s.signature + "\n";
                });
                // get the signature with the most and least parameters, we will use it to create the implementation for this method
                var signatureWithLeastParams = _.min(signatures, "parameters.length");
                var signatureWithMostParams = _.max(signatures, "parameters.length");
                // lets loop through the params of the signature with most parameters
                var signatureImpText = "\t" + signatureWithMostParams.methodName + "(";
                _.forEach(signatureWithMostParams.parameters, function (p, i) {
                    signatureImpText += "arg" + i.toString() + "?:any, ";
                });
                signatureImpText = signatureImpText.substr(0, signatureImpText.length - 2);
                signatureImpText += ") {\n[IMP]\n\t}";
                var impText = "";
                impText = "\t\tvar path='" + signatureWithLeastParams.path + "';\n\n";
                // logic to create overload checks on parameters
                _.forEach(signatureWithMostParams.parameters, function (p, i) {
                    var arg = "arg" + i.toString();
                    impText += "\t\tif (" + arg + " && typeof (" + arg + ") === '" + p.type + "') {\n";
                    impText += "\t\t\tpath += '/{" + arg + "}';\n";
                    impText += "\t\t\tpath = path.replace('{" + arg + "}', " + arg + ".toString());\n";
                    impText += "\t\t}\n\n";
                });
                impText += "\t\tvar fullPath = this.host + path;\n";
                impText += "\t\treturn this.httpGet(fullPath);\n";
                signatureImpText = signatureImpText.replace("[IMP]", impText);
                signatureText = signatureText + signatureImpText + "\n\n";
                console.log("Function " + signatureWithMostParams.methodName + " created");
            }
            else {
                if (signatures[0].method == "post") {
                    signatureText += _this.getPostString(signatures[0]);
                }
                if (signatures[0].method == "get") {
                    signatureText += _this.getGetString(signatures[0]);
                }
                console.log("Function " + signatures[0].methodName + " created");
            }
        });
        template = template.replace("[FUNCTIONS]", signatureText);
        fs.writeFileSync(this.baseFolder + "/" + this.title + "/" + this.title + "Client.ts", template);
        console.log(this.baseFolder + "/" + this.title + "/" + this.title + "Client.ts was created");
    };
    SwaggerService.prototype.getGetString = function (signature) {
        var impText = "";
        impText += "\t" + signature.signature.replace(";", "{") + "\n";
        impText += "\t\tvar path='" + signature.path + "'\n\n";
        // logic to create overload checks on parameters
        var query = "";
        _.forEach(signature.parameters, function (p, i) {
            if (p.i_n == "path")
                impText += "\t\tpath = path.replace('{" + p.name + "}', " + p.name + ".toString());\n";
            if (p.i_n == "query") {
                if (p.type != "array") {
                    if (i == 0)
                        query += "\t\tpath += '?" + p.name + "=' + " + p.name + ";\n";
                    else
                        query += "\t\tpath += '&" + p.name + "=' + " + p.name + ";\n";
                }
                else {
                    query += "\t\tvar qs = '';\n";
                    query += "\t\tfor (var i = 0; i < " + p.name + ".length; i++) {\n";
                    query += "\t\t\tqs += '" + p.name + "=' + " + p.name + "[i] + '&'\n";
                    query += "\t\t}\n";
                    query += "\t\tif (qs.length > 0) path += '?' + qs;\n";
                }
            }
        });
        if (query.length > 0) {
            impText += query;
        }
        impText += "\t\tvar fullPath = this.host + path;\n";
        impText += "\t\treturn this.httpGet(fullPath);\n";
        impText += "\t}\n";
        return impText;
    };
    SwaggerService.prototype.getPostString = function (signature) {
        var signatureText = "";
        signatureText += "\t" + signature.signature.replace(";", "{") + "\n";
        signatureText += "\t\tvar fullPath = this.host + '" + signature.path + "';\n";
        signatureText += "\t\treturn this.httpPost(fullPath, " + signature.parameters[0].name + ");\n";
        signatureText += "\t}\n\n";
        return signatureText;
    };
    SwaggerService.prototype.createSignature = function (name, path) {
        var _this = this;
        for (var method in path) {
            if (method != "options") {
                var functionName = path[method].operationId;
                var parameters = path[method].parameters;
                var responses = path[method].responses;
                var signature = functionName;
                var paramDefs = [];
                if (parameters && parameters.length > 0) {
                    signature += "(";
                    _.forEach(parameters, function (param) {
                        var paramDef = _this.parseParameter(param);
                        paramDefs.push(paramDef);
                        signature += paramDef.text + ", ";
                    });
                    signature = signature.substr(0, signature.length - 2);
                    signature += ")";
                }
                else {
                    signature += "()";
                }
                for (var r in responses) {
                    if (r == "200") {
                        var responseType = this.parseResponse(responses[r]);
                        signature += ":ng.IPromise<" + responseType + ">;";
                    }
                }
                var signatureDefinition = {
                    methodName: functionName,
                    signature: signature,
                    parameters: paramDefs,
                    path: name,
                    method: method
                };
                this.signatureDefinitions.push(signatureDefinition);
            }
        }
    };
    SwaggerService.prototype.parseResponse = function (property) {
        if (property.schema.type) {
            if (property.schema.type == "array") {
                if (property.schema.items.type) {
                    return property.schema.items.type + "[]";
                }
                else {
                    return _.find(this.modelDefinitions, function (d) {
                        return d.definitionName == property.schema.items.$ref;
                    }).interfaceName + "[]";
                }
            }
            else {
                if (property.schema.type) {
                    return property.schema.type;
                }
                else {
                    return _.find(this.modelDefinitions, function (d) {
                        return d.definitionName == property.schema.$ref;
                    }).interfaceName;
                }
            }
        }
        else {
            return _.find(this.modelDefinitions, function (d) {
                return d.definitionName == property.schema.$ref;
            }).interfaceName;
        }
    };
    SwaggerService.prototype.parseParameter = function (property) {
        var paramDef = property.name;
        var type = this.parseType(property);
        if (!property.required)
            paramDef += "?";
        if (property.type) {
            if (property.type != "array") {
                paramDef += ":" + type;
            }
            else {
                type = "array";
                var innertype = this.parseType(property.items);
                paramDef += ":" + innertype + "[]";
            }
            return {
                name: property.name,
                required: property.required,
                type: type,
                text: paramDef,
                i_n: property.in,
                items: property.items
            };
        }
        if (property.schema) {
            if (property.schema.type) {
                paramDef += ":" + property.schema.type;
                return {
                    name: property.name,
                    required: property.required,
                    type: property.schema.type,
                    text: paramDef,
                    i_n: property.in,
                    items: property.items
                };
            }
            else {
                var type = _.find(this.modelDefinitions, function (md) {
                    return md.definitionName == property.schema.$ref;
                }).interfaceName;
                paramDef += ":" + type;
                return {
                    name: property.name,
                    required: property.required,
                    type: type,
                    text: paramDef,
                    i_n: property.in,
                    items: property.items
                };
            }
        }
    };
    SwaggerService.prototype.parseType = function (property) {
        if (!property.type) {
            // check $ref;
            if (property.$ref) {
                return "I" + property.$ref;
            }
            if (property.schema.$ref) {
                return _.find(this.modelDefinitions, function (md) {
                    return md.definitionName == property.schema.$ref;
                }).interfaceName;
            }
        }
        if (property.type == "integer")
            return "number";
        if (property.type == "array") {
            if (property.items.type)
                return property.items.type + "[]";
            if (property.items.$ref)
                return "I" + property.items.$ref + "[]";
        }
        return property.type;
    };
    return SwaggerService;
})();
//var opt: ISwaggerOptions = {
//    swaggerPath: "http://localhost:54144/swagger/docs/v1",
//    destination: "app"
//};
//var swaggerService = new SwaggerService(opt);
//swaggerService.process();
exports.process = function (options) {
    if (!options) {
        console.error("Sorry. Please supply options with swaggerPath and destination properties");
    }
    else {
        var swaggerService = new SwaggerService(options);
        swaggerService.process();
        console.log("process started...");
    }
};
//# sourceMappingURL=app.js.map