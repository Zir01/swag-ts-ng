declare module Swagger {
    interface ISchema {
        discriminator: string;
        readOnly: boolean;
        xml: IXml;
        externalDocs: IExternalDoc;
        example: any;
    }
}
