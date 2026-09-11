import { Injectable, signal } from "@angular/core";
import { disabled, email, form, minLength, pattern, required, SchemaPathTree, submit } from "@angular/forms/signals";

export interface FormErrorSectionModel {
    nombre: string;
    apellidos: string;
    fechaNacimiento: Date | null;
    genero: string;
    email: string;
    telefono: string;
    direccion: string;
    ciudad: string;
    codigoPostal: string;
    pais: string;
}

const INIT_FORM_ERROR_SECTION_MODEL: FormErrorSectionModel = {
    nombre: '',
    apellidos: '',
    fechaNacimiento: null,
    genero: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    pais: ''
}

const FORM_ERROR_SECTION_SCHEMA = (schemaPath: SchemaPathTree<FormErrorSectionModel>) => {
    required(schemaPath.nombre, {
        message: 'El nombre es obligatorio'
    });
    minLength(schemaPath.nombre, 3, {
        message: 'El nombre debe tener al menos 3 caracteres'
    });

    required(schemaPath.apellidos, {
        message: 'Los apellidos son obligatorios'
    });
    minLength(schemaPath.apellidos, 3, {
        message: 'Los apellidos debe tener al menos 3 caracteres'
    });


    required(schemaPath.fechaNacimiento, {
        message: 'La fecha de nacimiento es obligatoria'
    });

    required(schemaPath.genero, {
        message: 'El genero es obligatorio'
    })


    required(schemaPath.email, {
        message: 'El email es obligatorio'
    });
    email(schemaPath.email, {
        message: 'El email debe ser valido'
    });

    required(schemaPath.telefono, {
        message: 'El telefono es obligatorio'
    });
    pattern(schemaPath.telefono, /^[0-9]{9}$/, {
        message: 'El telefono debe tener 9 digitos numericos'
    });

    required(schemaPath.ciudad, {
        message: 'La ciudad es obligatoria'
    });

    required(schemaPath.direccion, {
        message: 'La direccion es obligatoria'
    });

    required(schemaPath.codigoPostal, {
        message: 'El codigo postal es obligatorio'
    });
    disabled(schemaPath.codigoPostal, { when: ({ valueOf }) => valueOf(schemaPath.direccion) === '' });


    required(schemaPath.pais, {
        message: 'El pais es obligatorio'
    });
}

@Injectable()
export class FormErrorSectionService {
    private model = signal<FormErrorSectionModel>(INIT_FORM_ERROR_SECTION_MODEL);
    public form = form(this.model, FORM_ERROR_SECTION_SCHEMA);

    public onSubmit(event: Event) {
        event.preventDefault();
        if (this.form().invalid()) {
            this.form().markAsTouched();
            return;
        }
        submit(this.form, async () => {
            if (this.form().pending()) {
                console.log('Formulario pendiente');
                return;
            }

            const currentModel = this.model();
            console.table(currentModel);

            // 1. 🔹 Reseteamos la DATA (la fuente de la verdad)
            this.model.set(INIT_FORM_ERROR_SECTION_MODEL);

            // 2. 🔹 Reseteamos los estados (touched, dirty) para que no salgan errores rojos
            this.form().reset();
        })
    }
}