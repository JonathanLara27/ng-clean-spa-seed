# 🚀 Angular Clean SPA Template

Un template base de nivel empresarial para aplicaciones Single Page Application (SPA) construidas con Angular. Este proyecto implementa una **Arquitectura Limpia Simplificada** orientada a *features*, utiliza **Bun** como gestor de paquetes por defecto, integra **Angular Material** y aplica la **Arquitectura 7-1 para SCSS**.

## 🛠️ Stack Tecnológico

*   **Framework:** Angular (v22+) - Standalone Components
*   **Gestor de paquetes:** Bun
*   **UI Library:** Angular Material
*   **Estilos:** SCSS (Arquitectura 7-1)

---

## 🏗️ Estructura del Proyecto

El proyecto sigue una división estricta para separar responsabilidades, mantener el código escalable y facilitar el testing.

```text
src/
├── app/
│   ├── core/               # Singleton services, Interceptors, Guards, configuraciones globales.
│   ├── shared/             # Componentes UI reutilizables (dumb), Pipes, Directivas, Material Modules.
│   ├── features/           # Módulos de negocio (Clean Architecture simplificada por feature).
│   │   └── [feature-name]/
│   │       ├── domain/         # Modelos, Interfaces, Tipos (Reglas de negocio puras).
│   │       ├── application/    # Casos de uso, State management, Facades (Lógica de aplicación).
│   │       ├── infrastructure/ # HTTP Services, DTOs, Mappers, Repositories (Acceso a datos externos).
│   │       └── presentation/   # Smart Components, UI Pages, Rutas específicas de la feature.
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── assets/                 # Imágenes, iconos, traducciones.
└── styles/                 # Arquitectura SCSS 7-1
    ├── abstracts/          # Variables, mixins, funciones (sin CSS de salida).
    ├── base/               # Resets, tipografía global.
    ├── components/         # Estilos de componentes globales puros (botones, tarjetas).
    ├── layout/             # Estilos de estructura (header, footer, sidebar, grid).
    ├── pages/              # Estilos específicos de página (uso excepcional).
    ├── themes/             # Temas de Angular Material (Dark/Light mode).
    ├── vendors/            # Overrides de Material u otras librerías externas.
    └── main.scss           # Archivo de entrada: Importa todas las carpetas anteriores.

```

---

## 🧠 Guía de Arquitectura

### 1. Core (`/core`)

Aquí reside el "corazón" técnico de la aplicación.

* **Regla:** Solo debe ser importado una vez en el `app.config.ts`.
* **Contiene:** Interceptores de HTTP (Tokens, Errores), Guards de rutas globales, Servicios de autenticación y configuraciones de inicialización.

### 2. Shared (`/shared`)

Contiene piezas visuales y utilidades que se usan en múltiples lugares.

* **Regla:** Cero lógica de negocio. Los componentes aquí deben ser *Dumb Components* (reciben datos por `@Input`, emiten eventos por `@Output`).
* **Contiene:** Botones personalizados, modales genéricos, directivas de formato, pipes de fechas.

### 3. Features (`/features`)

Cada feature (ej. `auth`, `dashboard`, `users`) es independiente y sigue una arquitectura limpia simplificada en 4 capas:

* **Domain:** Define *qué* es la entidad (ej. `User.interface.ts`). No depende de Angular.
* **Infrastructure:** Sabe *cómo* obtener los datos (ej. `user-http.service.ts`). Llama a la API y mapea los datos de backend a los modelos del Domain.
* **Application:** Sabe *qué hacer* con los datos (ej. `user.facade.ts` o `user.store.ts`). Orquesta la infraestructura y maneja el estado local.
* **Presentation:** Sabe *cómo mostrar* los datos (ej. `user-list.component.ts`). Solo se inyectan servicios de la capa *Application*, nunca de *Infrastructure*.

### 4. Estilos (SCSS 7-1)

Para evitar el acoplamiento de estilos y el CSS global desorganizado, los estilos globales se administran en la carpeta `src/styles/`.

* **Nota:** Los componentes de Angular seguirán usando sus propios archivos `.scss` encapsulados para estilos locales, pero importarán variables y mixins desde `src/styles/abstracts/` según sea necesario.

---

## 🚀 Uso Rápido

1. **Clonar el template:**
```bash
git clone <tu-repo-url> nuevo-proyecto
cd nuevo-proyecto

```


2. **Instalar dependencias con Bun:**
```bash
bun install

```


3. **Iniciar el servidor de desarrollo:**
```bash
bun run start

```



---

## 🤝 Reglas de Convivencia (Controlling Technical Debt)

* **No cruzar dependencias entre features:** Un componente de la feature `A` no puede importar directamente servicios de la feature `B`. Si necesitan comunicarse, deben hacerlo a través del `Core` o manejadores de estado globales.
* **Standalone First:** Todos los componentes, directivas y pipes deben ser `standalone: true`.
* **Tipado estricto:** Prohibido el uso de `any`. Utiliza `unknown` o define la interfaz en la capa *Domain*.

```