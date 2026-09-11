import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, signal, viewChildren } from '@angular/core';
import { CustomerSection } from '../../components/customer-section/customer-section';
import { ActionDialogSection } from '../../components/action-dialog-section/action-dialog-section';
import { BannerSection } from '../../components/banner-section/banner-section';
import { FormErrorSection } from '../../components/form-error-section/form-error-section';

interface DemoSection {
  id: string;
  label: string;
}

@Component({
  selector: 'app-components-demo',
  imports: [
    CommonModule,

    CustomerSection,
    ActionDialogSection,
    BannerSection,
    FormErrorSection,
  ],
  templateUrl: './components-demo.html',
  styleUrl: './components-demo.scss',
})
export default class ComponentsDemo implements AfterViewInit, OnDestroy {
  // 🔹 1. Definimos las secciones de nuestra semilla
  public readonly sections = signal<DemoSection[]>([
    { id: 'reusable-table', label: 'Reusable Table' },
    { id: 'action-dialog', label: 'Action Dialog' },
    { id: 'banner', label: 'Banners' },
    { id: 'form-error', label: 'Form Error Label' }
  ]);

  // 🔹 2. Estado reactivo para saber en qué sección estamos
  public activeSection = signal<string>('reusable-table');

  // Capturamos todos los elementos <section> del HTML
  private sectionElements = viewChildren<ElementRef<HTMLElement>>('demoSection');
  private observer: IntersectionObserver | null = null;

  ngAfterViewInit(): void {
    this.setupScrollSpy();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  // 🔹 3. Lógica para detectar el scroll
  private setupScrollSpy(): void {
    const options = {
      root: null,
      rootMargin: '-20% 0px -60% 0px', // Define el "punto de enfoque" en la pantalla
      threshold: 0
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        this.activeSection.set(entry.target.id);
      });
    }, options);

    this.sectionElements().forEach(section => {
      this.observer?.observe(section.nativeElement);
    });
  }

  // 🔹 4. Método para el clic en la barra flotante
  public scrollTo(id: string): void {
    const element = document.getElementById(id);
    if(!element) return;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.activeSection.set(id);
  }
}
