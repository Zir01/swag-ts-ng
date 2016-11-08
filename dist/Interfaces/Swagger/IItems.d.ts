declare module Swagger {
    interface IItems {
        type: string;
        format?: string;
        items?: IItems;
        collectionFormat?: string;
        default?: any;
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
