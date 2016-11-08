declare class modelParser {
    static parse(options: ISwaggerOptions, swaggerDefinitions: any, moduleName: string): IModelDefinition[];
}
export = modelParser;
