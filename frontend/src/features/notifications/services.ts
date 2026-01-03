import { api, type ApiResponse } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/api.constants';

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationFilters {
  isRead?: boolean;
  type?: string;
}

export const notificationService = {
  async getAll(filters?: NotificationFilters): Promise<ApiResponse<Notification[]>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const url = `${API_ENDPOINTS.NOTIFICATIONS.GET_ALL}?${params.toString()}`;
    return api.get<Notification[]>(url);
  },

  async getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
    return api.get<{ count: number }>(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
  },

  async markAsRead(id: string): Promise<ApiResponse> {
    return api.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
  },

  async markAllAsRead(): Promise<ApiResponse> {
    return api.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
  },

  async delete(id: string): Promise<ApiResponse> {
    return api.delete(API_ENDPOINTS.NOTIFICATIONS.DELETE(id));
  },
};
