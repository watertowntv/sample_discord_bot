// noinspection JSUnusedGlobalSymbols


export const randomRange = (min: number, max: number): number => {
    if (min > max) return max;

    return Math.random() * (max - min) + min;
}

export const coerceIn = (value: number, minimumValue: number, maximumValue: number): number => {
    if (value < minimumValue) return minimumValue;
    if (value > maximumValue) return maximumValue;

    return value
};
