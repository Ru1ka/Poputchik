import { PhoneNumberFieldValue } from "../hooks/types";

export const parseValue = (value: PhoneNumberFieldValue) => {
    if (value.length < defaultValue.length) {
        return defaultValue;
    }

    const matches = value.slice(2).match(/[0-9]/g);

    if (!matches) {
        return defaultValue;
    }

    let matchesString = matches.join("");
    let goodString = "";

    if (matchesString.length > 10) {
        matchesString = matchesString.slice(0, 10);
    }

    for (let i = 0; i < matchesString.length; i++) {
        if (i === 3) {
            goodString += " ";
        } else if (i === 6 || i === 8) {
            goodString += "-";
        }

        goodString += matchesString[i];
    }

    return defaultValue + goodString;
};

export const defaultValue = "+7 ";
