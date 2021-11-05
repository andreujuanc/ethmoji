import { BigNumber, formatFixed } from "@ethersproject/bignumber";

export function formatValue(value?: BigNumber, fallback?: string) {
    if (!value)
        return fallback;
    const parts = formatFixed(value, 18).split('.');

    return `${parts[0]}.${(parts[1] ?? '').substr(0, 4)}`;
}
