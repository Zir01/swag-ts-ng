module Swagger {
    export interface ISchema {
        discriminator: string;
        readOnly: boolean;
        xml: IXml;
        externalDocs: IExternalDoc;
        example: any;
    }
}