import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/middlewares';
import { sendSuccess } from '../../shared/utils';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto } from './auth.types';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    // Sign Up
    signUp = asyncHandler(async (req: Request, res: Response) => {
        const userData: SignUpDto = req.body;

        // Add logo path if file was uploaded, otherwise set to undefined
        if (req.file) {
            userData.companyLogo = `/uploads/${req.file.filename}`;
        } else {
            // Remove companyLogo if it's an empty object or set it to undefined
            userData.companyLogo = undefined;
        }

        const result = await this.authService.signUp(userData);
        sendSuccess(res, result, 'User registered successfully', 201);
    });

    // Sign In
    signIn = asyncHandler(async (req: Request, res: Response) => {
        const credentials: SignInDto = req.body;
        const result = await this.authService.signIn(credentials);
        sendSuccess(res, result, 'Login successful');
    });

    // Get Current User
    getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
        // User info is attached by auth middleware
        sendSuccess(res, req.user, 'User retrieved successfully');
    });
}
