import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { RouterModule } from '@angular/router';
import { TopBar } from '../top-bar/top-bar';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterModule,
    Sidebar,
    TopBar,
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout { }
