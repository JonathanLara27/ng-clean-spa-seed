import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

// Definición de las carpetas a crear
const directories = [
  'src/app/core/interceptors',
  'src/app/core/guards',
  'src/app/core/services',
  'src/app/shared/components',
  'src/app/shared/pipes',
  'src/app/shared/directives',
  'src/app/features',
  'src/styles/abstracts',
  'src/styles/base',
  'src/styles/components',
  'src/styles/layout',
  'src/styles/pages',
  'src/styles/themes',
  'src/styles/vendors'
];

// Definición de los archivos iniciales para la arquitectura SCSS 7-1
const files = {
  'src/styles/main.scss': `@import 'abstracts/variables';\n@import 'abstracts/mixins';\n\n@import 'base/reset';\n@import 'base/typography';\n\n@import 'themes/material-theme';\n`,
  'src/styles/abstracts/_variables.scss': `// Variables globales (colores, espaciados, breakpoints)\n$primary-color: #3f51b5;\n$accent-color: #ff4081;\n`,
  'src/styles/abstracts/_mixins.scss': `// Mixins globales\n@mixin flex-center {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n`,
  'src/styles/base/_reset.scss': `// Reseteo de estilos básicos\n*, *::before, *::after {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\n`,
  'src/styles/base/_typography.scss': `// Configuración de tipografía\nbody {\n  font-family: 'Roboto', 'Helvetica Neue', sans-serif;\n}\n`,
  'src/styles/themes/_material-theme.scss': `// Configuración y overrides del tema de Angular Material\n`,
  'src/styles/layout/_grid.scss': `// Sistema de grillas o layouts principales\n`,
  'src/styles/components/_buttons.scss': `// Estilos globales de botones personalizados\n`
};

async function generateArchitecture() {
  console.log('🚀 Iniciando la creación de la estructura Clean SPA...');
  
  try {
    // 1. Crear carpetas
    for (const dir of directories) {
      await mkdir(dir, { recursive: true });
      console.log(`📁 Directorio listo: ${dir}`);
    }
    
    // 2. Crear archivos base con su contenido inicial
    for (const [filePath, content] of Object.entries(files)) {
      await writeFile(filePath, content, 'utf8');
      console.log(`📄 Archivo creado:  ${filePath}`);
    }
    
    console.log('\n✅ ¡Estructura generada con éxito! Ya puedes empezar a crear tus features.');
  } catch (error) {
    console.error('❌ Error al generar la estructura:', error);
  }
}

generateArchitecture();
