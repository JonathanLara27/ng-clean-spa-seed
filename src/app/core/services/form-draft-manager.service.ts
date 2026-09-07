import { Injectable, inject, DestroyRef, Service } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';
import { DraftStorageService } from './draft-storage.service';
import { WindowUnloadService } from './window-unload.service';

@Service()
export class FormDraftManagerService {
    private draftStorage = inject(DraftStorageService);
    private windowUnload = inject(WindowUnloadService);

    public connectAutoSave(
        form: FormGroup,
        draftKey: string,
        destroyRef: DestroyRef,
        options?: {
            debounceMs?: number,
            formatPayload?: (rawData: any) => any,
            onSaveSuccess?: (rawData: any) => void | Promise<void>
        }
    ): void {
        form.valueChanges
            .pipe(
                debounceTime(options?.debounceMs || 1000),
                takeUntilDestroyed(destroyRef)
            )
            .subscribe(async () => {
                if (form.dirty) {
                    this.windowUnload.enableWarning();
                    const rawData = form.getRawValue();

                    // Formateamos para excluir binarios antes de guardar en LocalStorage
                    const payloadToSave = options?.formatPayload ? options.formatPayload(rawData) : rawData;
                    this.draftStorage.saveDraft(draftKey, payloadToSave);

                    // Hook para guardar en IndexedDB
                    if (options?.onSaveSuccess) {
                        await options.onSaveSuccess(rawData);
                    }
                }
            });
    }
}