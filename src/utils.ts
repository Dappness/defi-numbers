/* eslint-disable n/no-missing-import */
import { BigNumber } from "bignumber.js";

import {
	AMOUNT_LOWER_THRESHOLD,
	NUMERAL_DECIMAL_LIMIT,
	PERCENTAGE_LOWER_THRESHOLD,
} from "./constants.js";
import { Numberish } from "./types.js";

/**
 * Converts a number to a BigNumber instance.
 * @param val The number to convert.
 * @returns A BigNumber instance.
 */
export function bn(val: Numberish): BigNumber {
	return new BigNumber(val.toString());
}

/**
 * Converts a number to a string format within the decimal limit that numeral
 * can handle. Numeral is only used for display purposes, so we don't need to
 * worry about precision.
 * @param val The number to convert.
 * @returns A string representation of the number within the decimal limit.
 */
export function toSafeNum(val: Numberish): string {
	return bn(val).toFixed(NUMERAL_DECIMAL_LIMIT);
}

/**
 * Sums an array of numbers safely using bignumber.js.
 * @param amounts The numbers to sum.
 * @returns The sum of the numbers.
 */
export function safeSum(amounts: Numberish[]): string {
	return amounts.reduce((a, b) => bn(a).plus(b.toString()), bn(0)).toString();
}

/**
 * Prevents invalid characters from being entered into a number input.
 * Can be used as an event listener for the `onKeyDown` prop of an input element.
 * @param event The keyboard event.
 */
export function blockInvalidNumberInput(event: KeyboardEvent): void {
	// eslint-disable-next-line @typescript-eslint/no-unused-expressions
	["+", "-", "e", "E"].includes(event.key) && event.preventDefault();
}

export function isSmallPercentage(
	value: Numberish,
	{ isPercentage = false }: { isPercentage?: boolean } = {},
): boolean {
	// if the value is already a percentage (like in slippageFormat) we divide by 100 so that slippageFormat('10') is '10%'
	const val = isPercentage ? bn(value).div(100) : bn(value);
	return !isZero(value) && val.lt(PERCENTAGE_LOWER_THRESHOLD);
}

export function isLessThanThreshold(
	value: Numberish,
	{ threshold = AMOUNT_LOWER_THRESHOLD }: { threshold?: number } = {},
): boolean {
	return !isZero(value) && bn(value).lt(threshold);
}

export function isMoreThanThreshold(
	value: Numberish,
	{ threshold }: { threshold: number },
): boolean {
	return !isZero(value) && bn(value).gte(threshold);
}

export function isZero(amount: Numberish): boolean {
	return bn(amount).isZero();
}
