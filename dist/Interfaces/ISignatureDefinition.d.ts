interface ISignatureDefinition {
    method: string;
    signature: string;
    methodName: string;
    parameters: IParamDefinition[];
    path: string;
    summary?: string;
}
