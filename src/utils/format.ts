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
