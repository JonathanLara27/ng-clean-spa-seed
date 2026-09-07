import { NotificationService } from "../../core/services/notification.service";

export interface ValidationRule {
    isValid: boolean;
    errorMessage: string;
}

export class EntityValidatorUtil {
    /**
     * Evalúa una lista de reglas. Se detiene en el primer error y notifica.
     * @returns true si todas las reglas pasan, false si alguna falla.
     */
    static validateRules(rules: ValidationRule[], notifyService: NotificationService): boolean {
        const failedRule = rules.find(rule => !rule.isValid);

        if (failedRule) {
            notifyService.error(failedRule.errorMessage);
            return false;
        }

        return true;
    }
}