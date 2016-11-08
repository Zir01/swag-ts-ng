declare class SwaggerService {
    options: ISwaggerOptions;
    constructor(options: ISwaggerOptions);
    process(): void;
    private writeMultipleFiles(blocks, destination);
    private writeSingleFile(blocks);
    private mkdirSync(dirpath);
}
export = SwaggerService;
