export type NotificationType =
    | 'LEAVE_REQUEST'
    | 'LEAVE_APPROVED'
    | 'LEAVE_REJECTED'
    | 'ATTENDANCE_REMINDER'
    | 'PAYROLL_UPDATE'
    | 'SYSTEM_ALERT'
    | 'GENERAL';

export interface CreateNotificationDto {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
}

export interface NotificationQueryDto {
    limit?: number;
    isRead?: boolean;
    type?: NotificationType;
}
