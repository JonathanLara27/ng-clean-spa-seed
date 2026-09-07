import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { NotificationData } from '../../../core/interfaces/notification.interface';

@Component({
  selector: 'app-custom-snackbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="custom-snackbar-layout">
        <div class="custom-snackbar-content">
            @if (data.title) {
                <strong class="custom-snackbar-title">{{ data.title }}</strong>
            }

            @if (isArray()) {
                <ul class="custom-snackbar-list">
                    @for (item of data.message; track item) {
                        <li>{{ item }}</li>
                    }
                </ul>
            } @else {
                <span class="custom-snackbar-text">{{ data.message }}</span>
            }
        </div>

        <button type="button" class="custom-snackbar-action" (click)="snackRef.dismissWithAction()">
            {{ data.actionText }}
        </button>
    </div>
  `,
  styleUrl: './custom-snackbar.scss',
})
export class CustomSnackbar {

  public snackRef = inject(MatSnackBarRef);
  public data: NotificationData = inject(MAT_SNACK_BAR_DATA);

  public isArray = computed(() => Array.isArray(this.data.message));
}
