declare class signatureCreator {
    static create(options: ISwaggerOptions, pathsObject: any, modelPrefix: string): ISignatureDefinition[];
}
export = signatureCreator;
