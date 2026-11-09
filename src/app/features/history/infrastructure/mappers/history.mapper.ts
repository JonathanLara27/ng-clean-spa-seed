import { formatDate } from "../../../../shared/helpers/format-date";
import { HistoryFieldConfig, HistoryRowUI } from "../../domain/entities/history.entity";
import { HistoryDto } from "../dtos/history.dto";

export class HistoryMapper {
    static procesarDiferencias<T>(
        dtos: HistoryDto[],
        camposConfig: HistoryFieldConfig<T>[]
    ): HistoryRowUI[] {
        if (!dtos.length || !camposConfig.length) return [];

        const filasAplanadas: HistoryRowUI[] = [];

        for (const dto of dtos) {
            const anterior = typeof dto.before === 'string' ? JSON.parse(dto.before) : (dto.before || null);
            const nuevo = typeof dto.after === 'string' ? JSON.parse(dto.after) : (dto.after || null);

            const fechaFormateada = formatDate(dto.updated_at);

            for (const config of camposConfig) {
                const key = config.key as keyof typeof anterior;

                const valAnt = anterior ? anterior[key] : null;
                const valNue = nuevo ? nuevo[key] : null;

                if (HistoryMapper.equals(valAnt, valNue)) continue;

                const strAnt = valAnt ?? 'N/A (Nuevo)';
                const strNue = valNue ?? 'N/A (Eliminado)';

                const displayAnt = config.formatter ? config.formatter(strAnt) : String(strAnt);
                const displayNue = config.formatter ? config.formatter(strNue) : String(strNue);

                if (displayAnt === displayNue) continue;

                filasAplanadas.push({
                    fecha: fechaFormateada,
                    usuario: dto.username || '-',
                    campoStack: config.label,
                    anteriorStack: displayAnt,
                    nuevoStack: displayNue,
                    motivo: dto.reason || '-'
                });
            }
        }

        return filasAplanadas;
    }

    private static equals(a: any, b: any): boolean {
        if (a === b) return true;

        if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
            return false;
        }

        return JSON.stringify(a) === JSON.stringify(b);
    }
}