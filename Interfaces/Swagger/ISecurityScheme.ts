module Swagger {
    export interface ISecurityScheme {
        type: string;
        description: string;
        name: string;
        in: string;
        flow: string;
        authorizationUrl: string;
        tokenUrl: string;
        scopes: {}; //string; 
        tags: {}; //any;
        externalDocs: IExternalDoc;

    }
}