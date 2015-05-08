module Swagger {
    export interface IResponse {
        description: string;
        schema: ISchema;
        headers: {}; // IHeaders;
        examples: {}; //any

    }
}