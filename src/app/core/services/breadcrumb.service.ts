import { Service, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Service()
export class BreadcrumbService {
  private readonly router = inject(Router);

  // 1. Estado Privado (Encapsulamiento)
  private readonly _path = signal<string>('Home');
  private readonly _currentRoute = signal<string>('Inicio');

  // 2. Estado Público de Solo Lectura (Evita mutaciones accidentales desde fuera)
  public readonly path = this._path.asReadonly();
  public readonly currentRoute = this._currentRoute.asReadonly();

  constructor() {
    this.initRouterListener();
  }

  // ==========================================
  // LÓGICA PRINCIPAL (Clean Code: Funciones pequeñas y descriptivas)
  // ==========================================

  private initRouterListener(): void {
    // Procesar la ruta inicial
    this.processUrl(this.router.url);

    // Escuchar cambios reactivamente
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed() // Al estar en el constructor, no necesita destroyRef explícito
      )
      .subscribe((event) => {
        this.processUrl(event.urlAfterRedirects);
      });
  }

  private processUrl(url: string): void {
    const cleanUrl = this.stripQueryParams(url);
    const segments = this.extractSegments(cleanUrl);

    if (segments.length === 0) {
      this.updateState('Home', 'Inicio');
      return;
    }

    const formattedSegments = segments.map(this.formatSegment);
    const current = formattedSegments.pop() || '';
    const path = formattedSegments.length > 0 
        ? `Home / ${formattedSegments.join(' / ')}` 
        : 'Home';

    this.updateState(path, current);
  }

  // ==========================================
  // HELPERS PRIVADOS (Principio de Responsabilidad Única)
  // ==========================================

  private stripQueryParams(url: string): string {
    return url.split('?')[0];
  }

  private extractSegments(url: string): string[] {
    return url.split('/').filter((segment) => segment.trim() !== '');
  }

  private formatSegment(segment: string): string {
    const text = segment.replace(/-/g, ' ');
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  private updateState(path: string, currentRoute: string): void {
    this._path.set(path);
    this._currentRoute.set(currentRoute);
  }
}