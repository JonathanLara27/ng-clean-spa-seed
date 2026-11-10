import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { CustomPaginatorComponent } from '../../../../../shared/components/custom-paginator/custom-paginator';
import { ReusableTableComponent } from '../../../../../shared/components/reusable-table/reusable-table';
import { HistoryRowUI } from '../../../domain/entities/history.entity';
import { HistoryDialogService } from './history-dialog.service';

export interface HistoryDialogData {
  entityName: string;
  dataHistoryChanges: HistoryRowUI[];
  dataHistoryStatus: HistoryRowUI[];
  // isLoading: Signal<boolean>;
}

@Component({
  selector: 'app-history-dialog',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    ReusableTableComponent,
    CustomPaginatorComponent,

  ],
  providers: [
    HistoryDialogService
  ],
  templateUrl: './history-dialog.html',
  styles: [
    `
      @use 'styles/vendors/tabs-material';
    `
  ],
})
export class HistoryDialog {

  public data = inject<HistoryDialogData>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<HistoryDialog>);

  public viewService = inject(HistoryDialogService);

  public title = this.viewService.title;

  public pagination = this.viewService.pagination;

  public activeView = this.viewService.activeView;
  public isTableLoading = this.viewService.isTableLoading;
  public tableColumns = this.viewService.tableColumns;
  public changeView = (view: 'states' | 'changes') => this.viewService.changeView(view);

  public activePaginationKey = this.viewService.activePaginationKey;
  public activeStore = this.viewService.activeStore;
  public activeSearchControl = this.viewService.activeSearchControl;

  async ngOnInit() {
    this.viewService.setDataPaginationLocalEstados(this.data.dataHistoryStatus)
    this.viewService.setDataPaginationLocalCambios(this.data.dataHistoryChanges)
  }

  public close() {
    this.dialogRef.close();
  }
}
