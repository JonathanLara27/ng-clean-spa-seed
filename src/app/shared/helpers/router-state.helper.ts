import { Router } from '@angular/router';

/**
 * Extrae de forma segura los datos enviados a través del estado del historial de navegación (History API) del Router.
 * * ⚠️ **Importante:** Esta función depende de `getCurrentNavigation()`, por lo que **debe ejecutarse de manera síncrona en el constructor** del componente o servicio. Si se llama más tarde (ej. en `ngOnInit` o tras una petición asíncrona), la navegación habrá terminado y retornará `null`.
 *
 * @template T - El tipo de dato (Interfaz/Clase) que esperas recuperar del estado.
 * @param {Router} router - La instancia inyectada del Router de Angular.
 * @param {string} key - La clave exacta con la que se guardó el dato en el objeto `state` durante la navegación.
 * @returns {T | null} El dato casteado al tipo `<T>` si se encuentra, o `null` si no existe la clave o la navegación ya concluyó.
 * * @example
 * // Uso en el constructor:
 * const myData = extractStateData<DiagnosticoEntity>(this.router, 'diagnostico');
 */
export const extractStateData = <T>(router: Router, key: string): T | null => {
    const navigation = router.currentNavigation();
    return (navigation?.extras?.state?.[key] as T) || null;
};