import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

// Capturamos el nombre de la feature desde los argumentos de la consola
const featureName = process.argv[2];

if (!featureName) {
  console.error('❌ Error: Debes indicar el nombre de la feature.');
  console.error('💡 Ejemplo de uso: bun run generate-feature.ts tablas-maestras');
  process.exit(1);
}

const basePath = join('src', 'app', 'features', featureName);

const directories = [
  'application/state',
  'domain/constants',
  'domain/entities',
  'infrastructure/apis',
  'infrastructure/dtos',
  'infrastructure/mappers',
  'presentation/components',
  'presentation/pages'
];

// Archivo de rutas base para la feature
const routesContent = `import { Routes } from '@angular/router';

export const ${featureName.replace(/-([a-z])/g, (g) => g[1].toUpperCase())}Routes: Routes = [
  {
    path: '',
    // component: TuComponentePrincipal,
    children: [
      // { path: 'nueva-ruta', component: TuOtroComponente }
    ]
  }
];
`;

async function generateFeature() {
  console.log(`🚀 Generando arquitectura para la feature: ${featureName}...`);
  
  try {
    // 1. Crear la estructura de carpetas
    for (const dir of directories) {
      const fullPath = join(basePath, dir);
      await mkdir(fullPath, { recursive: true });
      console.log(`📁 Directorio creado: ${fullPath}`);
    }
    
    // 2. Crear el archivo de rutas base
    const routesFilePath = join(basePath, `${featureName}.routes.ts`);
    await writeFile(routesFilePath, routesContent, 'utf8');
    console.log(`📄 Archivo creado: ${routesFilePath}`);
    
    console.log(`\n✅ ¡Feature '${featureName}' generada con éxito!`);
  } catch (error) {
    console.error('❌ Error al generar la feature:', error);
  }
}
//bun run setup-feature.ts tablas-maestras
generateFeature();