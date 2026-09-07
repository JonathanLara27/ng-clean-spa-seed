import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { LoaderState } from '../../../core/states/loader.state';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
  ],
})
export class LoadingComponent {

  private loaderState = inject(LoaderState);

  isLoading = input<boolean>(this.loaderState.isLoading());

  // public isLoading = this.loaderService.isLoading;

}
