module Swagger {

    export interface ISwagger {
        swagger: string;
        info: IInfo;
        host: string;
        basePath: string;
        schemes: string[];
        comsumes: string[];
        produces: string[];
        paths: {}; // IPaths
        definitions: {}; //ISchema
        parameters: {}; //IParameter

    }

}