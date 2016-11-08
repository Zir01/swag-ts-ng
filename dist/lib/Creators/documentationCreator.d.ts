declare class documentationCreator {
    static create(signature: ISignatureDefinition): string;
    private static wordWrap(input, maxLength);
}
export = documentationCreator;
