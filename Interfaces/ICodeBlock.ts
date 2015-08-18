const enum CodeBlockType { ModelInterface, ModelClass, ClientClass }

interface ICodeBlock {
    codeType: CodeBlockType;
    moduleName: string;
    name: string;
    body: string;
}
