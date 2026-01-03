import prisma from '../../shared/config/database';
import { AppError } from '../../shared/middlewares';
// import { NotificationType } from '@prisma/client';
import { CreateNotificationDto, NotificationQueryDto } from './notifications.types';

export class NotificationService {
    // Create a notification
    async createNotification(data: CreateNotificationDto) {
        try {
            const notification = await prisma.notification.create({
                data: {
                    ...data,
                    isRead: false,
                },
            });
            return notification;
        } catch (error) {
            console.error('Failed to create notification:', error);
            throw new AppError('Failed to create notification', 500);
        }
    }

    // Get user notifications
    async getUserNotifications(userId: string, query: NotificationQueryDto = {}) {
        try {
            const { limit = 50, isRead, type } = query;

            const where: any = { userId };

            if (isRead !== undefined) {
                where.isRead = isRead;
            }

            if (type) {
                where.type = type;
            }

            const notifications = await prisma.notification.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: limit,
            });

            return notifications;
        } catch (error) {
            throw new AppError('Failed to fetch notifications', 500);
        }
    }

    // Mark notification as read
    async markAsRead(notificationId: string, userId: string) {
        try {
            const notification = await prisma.notification.findFirst({
                where: {
                    id: notificationId,
                    userId,
                },
            });

            if (!notification) {
                throw new AppError('Notification not found', 404);
            }

            const updated = await prisma.notification.update({
                where: { id: notificationId },
                data: { isRead: true },
            });

            return updated;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to mark notification as read', 500);
        }
    }

    // Mark all notifications as read
    async markAllAsRead(userId: string) {
        try {
            const result = await prisma.notification.updateMany({
                where: {
                    userId,
                    isRead: false,
                },
                data: {
                    isRead: true,
                },
            });
            return result;
        } catch (error) {
            throw new AppError('Failed to mark all notifications as read', 500);
        }
    }

    // Get unread notification count
    async getUnreadCount(userId: string) {
        try {
            const count = await prisma.notification.count({
                where: {
                    userId,
                    isRead: false,
                },
            });
            return count;
        } catch (error) {
            throw new AppError('Failed to get unread count', 500);
        }
    }

    // Delete notification
    async deleteNotification(notificationId: string, userId: string) {
        try {
            const notification = await prisma.notification.findFirst({
                where: {
                    id: notificationId,
                    userId,
                },
            });

            if (!notification) {
                throw new AppError('Notification not found', 404);
            }

            await prisma.notification.delete({
                where: { id: notificationId },
            });
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Failed to delete notification', 500);
        }
    }

    // Helper methods for creating specific notification types
    async notifyLeaveApproval(employeeUserId: string, leaveType: string, startDate: Date, endDate: Date) {
        await this.createNotification({
            userId: employeeUserId,
            type: 'LEAVE_APPROVED',
            title: 'Leave Request Approved',
            message: `Your ${leaveType} leave request from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()} has been approved.`,
            link: '/leaves',
        });
    }

    async notifyLeaveRejection(employeeUserId: string, leaveType: string, startDate: Date, endDate: Date, reason?: string) {
        await this.createNotification({
            userId: employeeUserId,
            type: 'LEAVE_REJECTED',
            title: 'Leave Request Rejected',
            message: `Your ${leaveType} leave request from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()} has been rejected.${reason ? ` Reason: ${reason}` : ''}`,
            link: '/leaves',
        });
    }

    async notifyNewLeaveRequest(hrUserIds: string[], employeeName: string, leaveType: string, startDate: Date, endDate: Date) {
        const notifications = hrUserIds.map(userId =>
            this.createNotification({
                userId,
                type: 'LEAVE_REQUEST',
                title: 'New Leave Request',
                message: `${employeeName} has requested ${leaveType} leave from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}.`,
                link: '/leaves',
            })
        );
        await Promise.all(notifications);
    }

    async notifyAttendanceReminder(userId: string) {
        await this.createNotification({
            userId,
            type: 'ATTENDANCE_REMINDER',
            title: 'Attendance Reminder',
            message: 'Please remember to mark your attendance for today.',
            link: '/attendance',
        });
    }

    async notifyPayrollUpdate(userId: string, month: string) {
        await this.createNotification({
            userId,
            type: 'PAYROLL_UPDATE',
            title: 'Payroll Update',
            message: `Your salary for ${month} has been processed. Check your payroll details.`,
            link: '/payroll',
        });
    }
}
