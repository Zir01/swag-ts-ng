declare module Swagger {
    interface IParameter {
        name: string;
        in: string;
        description: string;
        required: boolean;
        schema?: ISchema;
        type?: string;
        format?: string;
        allowEmptyValue?: boolean;
        items: IItems;
        collectionFormat: string;
        default: any;
        maximum?: number;
        exclusiveMaximum?: boolean;
        minimum?: number;
        exclusiveMinimum?: boolean;
        maxLength?: number;
        minLength?: number;
        pattern?: string;
        maxItems?: number;
        minItems?: number;
        uniqueItems?: boolean;
        enum?: any[];
        multipleOf?: number;
    }
}
