import { inject, Service } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef } from '@angular/material/snack-bar';
import { CustomSnackbar } from '../../shared/components/custom-snackbar/custom-snackbar';
import { NotificationType, NotificationConfig } from '../interfaces/notification.interface';

@Service()
export class NotificationService {
    private snackBar = inject(MatSnackBar);

    private readonly DEFAULT_DURATION = 4000;
    private readonly DEFAULT_ACTION = 'Cerrar';
    private readonly DEFAULT_H_POSITION = 'end';
    private readonly DEFAULT_V_POSITION = 'top';

    private show(type: NotificationType, config: NotificationConfig): MatSnackBarRef<any> {
        const snackConfig: MatSnackBarConfig = {
            duration: config.duration ?? this.DEFAULT_DURATION,
            horizontalPosition: config.positionHorizontal ?? this.DEFAULT_H_POSITION,
            verticalPosition: config.positionVertical ?? this.DEFAULT_V_POSITION,
            panelClass: ['custom-snackbar', `custom-snackbar-${type}`],
            data: {
                message: config.message,
                title: config.title,
                actionText: config.actionText ?? this.DEFAULT_ACTION
            }
        };

        return this.snackBar.openFromComponent(CustomSnackbar, snackConfig);
    }


    success(message: string | string[], actionText?: string, duration?: number, title?: string,) {
        return this.show('success', { message, title, actionText, duration });
    }

    error(message: string | string[], actionText?: string, duration?: number, title?: string,) {
        return this.show('error', { message, title, actionText, duration: duration ?? 10000 });
    }

    warning(message: string | string[], actionText?: string, duration?: number, title?: string,) {
        return this.show('warning', { message, title, actionText, duration });
    }

    info(message: string | string[], actionText?: string, duration?: number, title?: string,) {
        return this.show('info', { message, title, actionText, duration });
    }
}
