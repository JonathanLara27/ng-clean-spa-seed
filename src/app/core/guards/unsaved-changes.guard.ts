import { CanDeactivateFn } from '@angular/router';

// Interfaz que obligará a nuestro componente a tener el método
export interface CanComponentDeactivate {
    canDeactivate: () => boolean | Promise<boolean>;
}

export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (component) => {
    // Si el componente tiene el método, lo evaluamos. Si no, lo dejamos pasar.
    return component.canDeactivate ? component.canDeactivate() : true;
};