import { ActionDialogData } from './action-dialog.interface';

// Centralizamos todas las variantes de modales de la app aquí
export const APP_DIALOGS = {
    // regresar: <ActionDialogData>{
    //     iconType: 'svg',
    //     icon: 'warning.svg',
    //     title: '¿Deseas regresar sin guardar?',
    //     cancelText: 'Seguir registro',
    //     confirmText: 'Salir sin guardar'
    // },

    // cancelar: <ActionDialogData>{
    //     iconType: 'svg',
    //     icon: 'warning.svg',
    //     title: '¿Terminaste tu registro?',
    //     subtitle: 'No olvides guardar o perderás la información ingresada.',
    //     cancelText: 'Continuar registro',
    //     confirmText: 'Cancelar y salir'
    // },

    cambiosSinGuardar : <ActionDialogData>{
        iconType: 'svg',
        icon: 'warning.svg',
        title: 'Tienes cambios sin guardar',
        subtitle: '¿Deseas salir sin guardar? Perderás los cambios realizados.',
        cancelText: 'No, seguir editando',
        confirmText: 'Sí, salir sin guardar',
        showCancelButton: true,
    },

    eliminar: <ActionDialogData>{
        iconType: 'svg',
        icon: 'delete.svg',
        title: '¿Estás seguro de eliminar este registro?',
        cancelText: 'No, cancelar',
        confirmText: 'Sí, eliminar',
        showCancelButton: true,
    },

    // 🚀 NUEVO: Plantilla genérica para confirmaciones (Reemplazo de confirm() nativo)
    confirmacionGeneral: <ActionDialogData>{
        iconType: 'svg',
        icon: 'warning.svg',
        title: '¿Estás seguro que desea realizar esta accion?', // Texto por defecto, se suele sobreescribir
        subtitle: 'Esta accion no se puede deshacer.', // Opcional
        cancelText: 'No',
        confirmText: 'Si',
        showCancelButton: true,
    },

    mensajeInformativo: <ActionDialogData>{
        title: 'Información',
        subtitle: '', // Se puede usar para detalles adicionales
        confirmText: 'OK',
        showCancelButton: false,
    },

    confirmacionConMotivo: <ActionDialogData>{
        iconType: 'svg',
        icon: 'warning.svg',
        title: '¿Estás seguro?',
        cancelText: 'No',
        confirmText: 'Si',
        showCancelButton: true,
        showTextArea: true,
        inputLabel: 'Motivo',
        inputPlaceholder: 'Escribe el motivo aquí...',
        isRequired: true,
    },
};