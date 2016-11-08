declare module Swagger {
    interface ISwagger {
        swagger: string;
        info: IInfo;
        host: string;
        basePath: string;
        schemes: string[];
        comsumes: string[];
        produces: string[];
        paths: {};
        definitions: {};
        parameters: {};
    }
}
