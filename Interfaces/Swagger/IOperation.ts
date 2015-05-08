module Swagger {
    export interface IOperation {
        tags: string[];
        summary: string;
        description: string;
        externalDocs: IExternalDoc;
        operationId: string;
        consumes: string[];
        produces: string[];
        parameters: IParameter;
    }
}