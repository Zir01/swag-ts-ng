import querystring      = require("querystring");
import http             = require("http");
import fs               = require("fs");
import _                = require("lodash");
import typeParser       = require("./Parsers/typeParser");
import parameterParser  = require("./Parsers/parameterParser");
import responseParser   = require("./Parsers/responseParser");
import getCreator       = require("./Creators/getCreator");
import postCreator      = require("./Creators/postCreator");
import signatureCreator = require("./Creators/signatureCreator");
import interfaceCreator = require("./Creators/interfaceCreator");
import clientCreator    = require("./Creators/clientCreator");

class SwaggerService {
    modelDefinitions: IModelDefinition[];
    signatureDefinitions: ISignatureDefinition[];
    apiModuleName: string;
    destPath: string;
    swaggerObject: Swagger.ISwagger;
    

    constructor(public options: ISwaggerOptions) {
        this.modelDefinitions = [];
        this.signatureDefinitions = [];

        this.swaggerObject = options.swaggerObject;
        if (options.destination && options.destination.length > 0) {
            this.destPath = options.destination + "/API";
        } else {
            this.destPath = "API";
        }

        if (this.options.moduleName) {
            this.apiModuleName = this.options.moduleName + "." + this.swaggerObject.info.title;
        } else {
            this.apiModuleName = "API." + this.swaggerObject.info.title;
        }


        

    }

    public process() {


        console.log('Starting Parse!');

        // create base API folder if does not exist
        if (!fs.existsSync(this.destPath)) {
            fs.mkdirSync(this.destPath);
            console.log(this.destPath + " directory created");
        }

        // create API sub folder for this API based on swagger title, if does not exist
        if (!fs.existsSync(this.destPath + "/" + this.swaggerObject.info.title)) {
            fs.mkdirSync(this.destPath + "/" + this.swaggerObject.info.title);
            console.log(this.destPath + "/" + this.swaggerObject.info.title + "/ directory created");
        }

        // loop through definitions
        console.log("Creating Interfaces file from swagger.definitions");
        this.modelDefinitions = interfaceCreator.create(this.swaggerObject.definitions, this.apiModuleName);
        

        // loop through paths and create Signature definitions to pass to the clientCreator creator
        console.log("Creating Function signatures from swagger.paths");
        this.signatureDefinitions = signatureCreator.create(this.modelDefinitions, this.swaggerObject.paths);



        // we have all we need in and signatureDefinitions[], now create the client code to access the API
        console.log("Creating client class:");
        var clientCode = clientCreator.create(this.swaggerObject.info.title, this.signatureDefinitions);



        // done, now lets go ahead and create the code files
        _.forEach(this.modelDefinitions, (md: IModelDefinition) => {
            fs.writeFileSync(this.destPath + "/" + this.swaggerObject.info.title + "/" + md.fileName, md.fileContents);
            console.log(" --> Interface " + this.destPath + "/" + this.swaggerObject.info.title + "/" + md.fileName + " file was created: ");
        });

        fs.writeFileSync(this.destPath + "/" + this.swaggerObject.info.title + "/" + this.swaggerObject.info.title + "Client.ts", clientCode);
        console.log(" --> " + this.destPath + "/" + this.swaggerObject.info.title + "/" + this.swaggerObject.info.title + "Client.ts was created");
        


        
        

    }
     


}
export = SwaggerService;