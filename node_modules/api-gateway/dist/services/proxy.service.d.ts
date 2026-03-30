import { HttpService } from '@nestjs/axios';
export declare class ProxyService {
    private readonly httpService;
    private readonly serviceUrls;
    constructor(httpService: HttpService);
    forward(service: string, method: string, path: string, body?: any, query?: any): Promise<any>;
}
