import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares';
import { sendSuccess } from '../utils';
import { UserService } from '../services/user.service';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    // Get all users
    getUsers = asyncHandler(async (req: Request, res: Response) => {
        const users = await this.userService.getAllUsers();
        sendSuccess(res, users, 'Users retrieved successfully');
    });

    // Get user by ID
    getUserById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = await this.userService.getUserById(id);
        sendSuccess(res, user, 'User retrieved successfully');
    });

    // Create new user
    createUser = asyncHandler(async (req: Request, res: Response) => {
        const userData = req.body;
        const user = await this.userService.createUser(userData);
        sendSuccess(res, user, 'User created successfully', 201);
    });

    // Update user
    updateUser = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const userData = req.body;
        const user = await this.userService.updateUser(id, userData);
        sendSuccess(res, user, 'User updated successfully');
    });

    // Delete user
    deleteUser = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        await this.userService.deleteUser(id);
        sendSuccess(res, null, 'User deleted successfully');
    });
}
