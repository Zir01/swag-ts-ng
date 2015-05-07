# swag-ts-ng
Swagger client Typescript Codegen Angularjs


## Install

    $npm install swag-ts-ng


## Usage

    var swag = require('swag-ts-ng');


    var options = {
        swaggerPath: "your swagger definition here",
        destination: "app" // your destination folder
    }
    swag.process(options);