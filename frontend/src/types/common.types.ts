// Common API response wrapper
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

// Pagination types
export interface PaginationParams {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}

// Common error type
export interface ApiError {
    message: string;
    code: string;
    details?: Record<string, unknown>;
}

// Loading state type
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
