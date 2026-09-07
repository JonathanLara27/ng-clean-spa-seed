export type NotificationType = 'success' | 'warning' | 'error' | 'info';

export interface NotificationConfig {
    message: string | string[];
    title?: string;
    actionText?: string;
    duration?: number;
    positionHorizontal?: 'start' | 'center' | 'end' | 'left' | 'right';
    positionVertical?: 'top' | 'bottom';
}

export interface NotificationData extends Pick<NotificationConfig, 'title' | 'message' | 'actionText'> { }