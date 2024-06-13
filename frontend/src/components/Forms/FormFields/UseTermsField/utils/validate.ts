import { UseTermsFieldValue } from "../hooks/types";

export const validate = (value: UseTermsFieldValue) => {
    return value
        ? null
        : new UseTermsFieldValidationError(
              "invalid",
              "Вы не ознакомились с правилами использования!"
          );
};

export class UseTermsFieldValidationError {
    constructor(
        public type: "invalid",
        public message: string
    ) {
        this.type = type;
        this.message = message;
    }
}
