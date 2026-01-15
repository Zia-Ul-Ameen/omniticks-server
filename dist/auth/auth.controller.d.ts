import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto, response: Response): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            isAdmin: true;
            role: string;
        };
    }>;
    logout(response: Response): Promise<{
        message: string;
    }>;
}
