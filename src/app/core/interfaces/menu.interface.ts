export interface MenuItem {
  id: string;
  label: string;
  route?: string;
  icon?: string;      // 👈 Para iconos estándar de Material (ej. 'people')
  svgIcon?: string;   // 👈 Para SVGs de tus assets (ej. 'custom-logo')
  children?: MenuItem[];
}