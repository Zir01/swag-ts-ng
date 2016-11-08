declare module Swagger {
    interface ISecurityScheme {
        type: string;
        description: string;
        name: string;
        in: string;
        flow: string;
        authorizationUrl: string;
        tokenUrl: string;
        scopes: {};
        tags: {};
        externalDocs: IExternalDoc;
    }
}
