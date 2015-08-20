interface ISwaggerOptions {
    swaggerObject: Swagger.ISwagger;
    interfaceDestination?: string;
    classDestination?: string;
    modelModuleName?: string
    clientDestination?: string;
    clientModuleName?: string;
    clientClassName?: string;
    singleFile?: boolean;
}
