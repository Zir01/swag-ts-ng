# swag-ts-ng
Swagger client Typescript Codegen for Angularjs


## Please note this is still Work in progress (experimental)

## Install

    $npm install swag-ts-ng


## Usage

    var swag = require('swag-ts-ng');

    var options = {
        swaggerPath: "URL for your swagger definition", // required
        interfaceDestination: "API/Model",              // optional
        modelModuleName: "Model",                       // optional
        clientDestination: "API/Service",               // optional
        clientModuleName: "Service",                    // optional
        clientClassName: "ApiDataService"               // optional
    }
    
    swag.process(options);

###Options

| Field name          | Default                    | Description                      |
|---------------------|----------------------------|----------------------------------|
| swaggerPath         | none (required)            | URL of the Swagger document      |
| interfaceDestination| API/[Title from Swagger]   | Path for the interfaces          |
| modelModuleName     | API.[Title from Swagger]   | Module name for the interfaces   |
| clientDestination   | API/[Title from Swagger]   | Path for the client              |
| clientModuleName    | none                       | Module name for the client class |
| clientClassName     | [Title from Swagger]Client | Class name for the client        |

