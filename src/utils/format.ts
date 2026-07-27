// noinspection JSUnusedGlobalSymbols

export const formatNumber = (value: number): string => {
    return value.toLocaleString('en-US');
};

export const truncateString = (inputString: string, maximumLength: number): string => {
    if (inputString.length <= maximumLength) {
        return inputString;
    }
    return `${inputString.slice(0, maximumLength - 3)}...`;
};

export const coerceIn = (value: number, minimumValue: number, maximumValue: number): number => {
    return Math.min(Math.max(value, minimumValue), maximumValue);
};
