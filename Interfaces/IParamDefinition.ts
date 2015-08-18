const enum ParamType { Query, Header, Path, FormData, Body }

interface IParamDefinition {
    name: string;
    paramType: ParamType;
    dataType: string;
    required: boolean;
    text: string;
    items: any;
    description?: string;
}
