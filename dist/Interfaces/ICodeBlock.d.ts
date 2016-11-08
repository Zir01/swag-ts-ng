declare const enum CodeBlockType {
    ModelInterface = 0,
    ModelClass = 1,
    ClientClass = 2,
}
interface ICodeBlock {
    codeType: CodeBlockType;
    moduleName: string;
    name: string;
    body: string;
}
