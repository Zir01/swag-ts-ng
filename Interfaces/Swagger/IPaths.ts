module Swagger {
    export interface IPaths {
        $ref: string;
        get: IOperation;
        put: IOperation;
        post: IOperation;
        delete: IOperation;
        options: IOperation;
        head: IOperation;
        patch: IOperation;
        parameters: IParameter|IReference;
        email: string;

        //^X- : any;
    }
}