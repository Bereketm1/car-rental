import { JwtService } from '@nestjs/jwt';
export declare class AuthController {
    private jwtService;
    constructor(jwtService: JwtService);
    login(signInDto: Record<string, any>): Promise<{
        success: boolean;
        data: {
            access_token: string;
            user: {
                name: string;
                role: string;
                email: string;
            };
        };
    }>;
}
