import { Component, inject, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UserStore } from '../../states/user.store';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private readonly userStore = inject(UserStore);
  private readonly sanitizer = inject(DomSanitizer);

  public menuItems = this.userStore.menuItems;
  public isCollapsed = signal<boolean>(false);
  public activeSubmenu = signal<string | null>(null);

  public toggleSidebar(): void {
    this.isCollapsed.update(v => !v);
    if (this.isCollapsed()) {
      this.activeSubmenu.set(null); // Cierra submenús al colapsar
    }
  }

  public toggleSubmenu(id: string): void {
    if (this.isCollapsed()) {
      this.isCollapsed.set(false); // Expande si estaba colapsado
    }
    this.activeSubmenu.update(current => current === id ? null : id);
  }

  public logout(): void {
    this.userStore.logout();
  }

  // Utilidad para renderizar SVGs dinámicos de forma segura
  public sanitizeSvg(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}
