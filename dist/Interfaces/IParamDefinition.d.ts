declare const enum ParamType {
    Query = 0,
    Header = 1,
    Path = 2,
    FormData = 3,
    Body = 4,
}
interface IParamDefinition {
    name: string;
    paramType: ParamType;
    dataType: string;
    required: boolean;
    text: string;
    items: any;
    description?: string;
}
