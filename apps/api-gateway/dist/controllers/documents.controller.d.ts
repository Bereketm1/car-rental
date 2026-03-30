export declare class DocumentsController {
    uploadFile(file: any): {
        success: boolean;
        data: {
            filename: string;
            originalName: any;
            mimeType: any;
            size: any;
            url: string;
        };
    };
    getFile(filename: string, res: any): Promise<any>;
}
