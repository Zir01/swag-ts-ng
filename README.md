# swag-ts-ng
Swagger client Typescript Codegen for Angularjs


## Please note this is still Work in progress (experimental)

## Install

    $npm install swag-ts-ng


## Usage

    var swag = require('swag-ts-ng');


    var options = {
        swaggerPath: "your swagger definition here",
        destination: "app", // your destination folder
		moduleName: "MyModuleName" // optional
    }
    swag.process(options);