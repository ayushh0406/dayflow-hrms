import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/middlewares';
import { sendSuccess } from '../../shared/utils';
import { NotificationService } from './notifications.service';

export class NotificationController {
    private notificationService: NotificationService;

    constructor() {
        this.notificationService = new NotificationService();
    }

    // Get user notifications
    getNotifications = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.user!;
        const query = {
            limit: parseInt(req.query.limit as string) || 50,
            isRead: req.query.isRead === 'true' ? true : req.query.isRead === 'false' ? false : undefined,
            type: req.query.type as any,
        };

        const notifications = await this.notificationService.getUserNotifications(userId, query);
        sendSuccess(res, notifications, 'Notifications retrieved successfully');
    });

    // Get unread notification count
    getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.user!;
        const count = await this.notificationService.getUnreadCount(userId);
        sendSuccess(res, { count }, 'Unread count retrieved successfully');
    });

    // Mark notification as read
    markAsRead = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.user!;
        const { id } = req.params;

        const notification = await this.notificationService.markAsRead(id, userId);
        sendSuccess(res, notification, 'Notification marked as read');
    });

    // Mark all notifications as read
    markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.user!;

        const result = await this.notificationService.markAllAsRead(userId);
        sendSuccess(res, result, 'All notifications marked as read');
    });

    // Delete notification
    deleteNotification = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.user!;
        const { id } = req.params;

        await this.notificationService.deleteNotification(id, userId);
        sendSuccess(res, null, 'Notification deleted successfully');
    });
}
