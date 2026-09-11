import { Component, inject } from '@angular/core';
import { CustomerState } from '../../../application/state/customer.state';
import { CustomerSectionService } from './customer-section.service';
import { Customer } from '../../../domain/entities';
import { ActionEvent } from '../../../../../shared/components/reusable-table/table-config.interface';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ReusableTableComponent } from '../../../../../shared/components/reusable-table/reusable-table';
import { CustomPaginatorComponent } from '../../../../../shared/components/custom-paginator/custom-paginator';

@Component({
  selector: 'app-customer-section',
  imports: [
    ReusableTableComponent,
    CustomPaginatorComponent,
    MatIconModule,
    ReactiveFormsModule
  ],
  providers: [
    CustomerState,
    CustomerSectionService,
  ],
  templateUrl: './customer-section.html',
})
export class CustomerSection {

  viewService = inject(CustomerSectionService);

  public state = this.viewService.state;
  public searchControl = this.viewService.searchControl;
  public headerConfig = this.viewService.headerConfig;
  public columns = this.viewService.columns;
  public actions = this.viewService.actions;

  ngOnInit(): void {
    this.viewService.init();
  }

  public onPageChange(page: number): void {
    this.viewService.onPageChange(page);
  }

  public onPageSizeChange(limit: number): void {
    this.viewService.onPageSizeChange(limit);
  }

  public onAction(event: ActionEvent<Customer>): void {
    this.viewService.onAction(event);
  }

  public openModalUpsert(data?: Customer): void {
    this.viewService.openModalUpsert(data);
  }

}
