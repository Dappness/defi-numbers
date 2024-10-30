// eslint-disable-next-line n/no-missing-import
import { BigNumber } from "bignumber.js";
import numeral from "numeral";
import { KeyboardEvent } from "react";

// Allows calling JSON.stringify with bigints
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#use_within_json
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
BigInt.prototype.toJSON = function () {
	return this.toString();
};

export const MAX_UINT256 =
	115792089237316195423570985008687907853269984665640564039457584007913129639935n;

export const INTEGER_FORMAT = "0,0";
export const FIAT_FORMAT_A = "0,0.00a";
export const FIAT_FORMAT_3_DECIMALS = "0,0.000a";
export const FIAT_FORMAT = "0,0.00";
export const FIAT_FORMAT_WITHOUT_DECIMALS = "0,0";
export const TOKEN_FORMAT_A = "0,0.[0000]a";
export const TOKEN_FORMAT_A_BIG = "0,0.[00]a";
export const TOKEN_FORMAT = "0,0.[0000]";
export const PERCENTAGE_FORMAT = "0,0.00%";

// Do not display percentage values greater than this amount; they are likely to be nonsensical.
export const PERCENTAGE_UPPER_THRESHOLD = 1_000_000;
export const PERCENTAGE_LOWER_THRESHOLD = 0.0001;
export const SMALL_PERCENTAGE_LABEL = "<0.01%";

// Do not display bn values lower than this amount; they are likely to generate NaN results
export const BN_LOWER_THRESHOLD = 0.000001;

// Display <0.001 for small amounts
export const AMOUNT_LOWER_THRESHOLD = 0.001;
export const SMALL_AMOUNT_LABEL = "<0.001";

// fiat value threshold for displaying the fiat format without cents
export const FIAT_CENTS_THRESHOLD = "100000";

const NUMERAL_DECIMAL_LIMIT = 9;

export type Numberish = bigint | BigNumber | number | string;
export type NumberFormatter = (val: Numberish) => string;

export function bn(val: Numberish): BigNumber {
	return new BigNumber(val.toString());
}

interface FormatOpts {
	abbreviated?: boolean;
}

/**
 * Converts a number to a string format within the decimal limit that numeral
 * can handle. Numeral is only used for display purposes, so we don't need to
 * worry about precision.
 */
function toSafeValue(val: Numberish): string {
	return bn(val).toFixed(NUMERAL_DECIMAL_LIMIT);
}

// Formats an integer value.
function integerFormat(val: Numberish): string {
	if (isSmallAmount(val)) {
		return "0";
	}
	return numeral(toSafeValue(val)).format(INTEGER_FORMAT);
}

// Formats a fiat value.
function fiatFormat(
	val: Numberish,
	{ abbreviated = true }: FormatOpts = {},
): string {
	if (isSmallAmount(val)) {
		return SMALL_AMOUNT_LABEL;
	}
	if (requiresThreeDecimals(val)) {
		return formatWith3Decimals(val);
	}
	const format = abbreviated
		? FIAT_FORMAT_A
		: isMoreThanOrEqualToAmount(val, FIAT_CENTS_THRESHOLD)
			? FIAT_FORMAT_WITHOUT_DECIMALS
			: FIAT_FORMAT;
	return numeral(toSafeValue(val)).format(format);
}

// Formats a token value.
function tokenFormat(
	val: Numberish,
	{ abbreviated = true }: FormatOpts = {},
): string {
	const bnVal = bn(val);

	if (!bnVal.isZero() && bnVal.lte(bn("0.00001"))) {
		return "< 0.00001";
	}
	if (!bnVal.isZero() && bnVal.lt(bn("0.0001"))) {
		return "< 0.0001";
	}

	// Uses 2 decimals then value is > thousand
	const TOKEN_FORMAT_ABBREVIATED = bnVal.gte(bn("1000"))
		? TOKEN_FORMAT_A_BIG
		: TOKEN_FORMAT_A;
	const format = abbreviated ? TOKEN_FORMAT_ABBREVIATED : TOKEN_FORMAT;

	return numeral(toSafeValue(val)).format(format);
}

function percentageFormat(val: Numberish): string {
	if (bn(val).gt(PERCENTAGE_UPPER_THRESHOLD)) {
		return "-";
	}

	if (isSmallPercentage(val)) {
		return SMALL_PERCENTAGE_LABEL;
	}

	return numeral(val.toString()).format(PERCENTAGE_FORMAT);
}

// Sums an array of numbers safely using bignumber.js.
export function safeSum(amounts: Numberish[]): string {
	return amounts.reduce((a, b) => bn(a).plus(b.toString()), bn(0)).toString();
}

// Prevents invalid characters from being entered into a number input.
export function blockInvalidNumberInput(
	event: KeyboardEvent<HTMLInputElement>,
): void {
	// eslint-disable-next-line @typescript-eslint/no-unused-expressions
	["+", "-", "e", "E"].includes(event.key) && event.preventDefault();
}

type NumberFormat = "fiat" | "integer" | "percentage" | "token";

// General number formatting function.
export function fNum(
	format: NumberFormat,
	val: Numberish,
	opts?: FormatOpts,
): string {
	switch (format) {
		case "fiat":
			return fiatFormat(val, opts);
		case "integer":
			return integerFormat(val);
		case "percentage":
			return percentageFormat(val);
		case "token":
			return tokenFormat(val, opts);
		default:
			throw new Error(`Number format not implemented`);
	}
}

// Edge case where we need to display 3 decimals for small amounts between 0.001 and 0.01
function requiresThreeDecimals(value: Numberish): boolean {
	return !isZero(value) && bn(value).gte(0.001) && bn(value).lte(0.009);
}

function formatWith3Decimals(value: Numberish): string {
	return numeral(toSafeValue(value)).format(FIAT_FORMAT_3_DECIMALS);
}

function isSmallAmount(value: Numberish): boolean {
	return !isZero(value) && bn(value).lt(AMOUNT_LOWER_THRESHOLD);
}

function isMoreThanOrEqualToAmount(
	value: Numberish,
	amount: Numberish,
): boolean {
	return !isZero(value) && bn(value).gte(bn(amount));
}

function isSmallPercentage(
	value: Numberish,
	{ isPercentage = false }: { isPercentage?: boolean } = {},
): boolean {
	// if the value is already a percentage (like in slippageFormat) we divide by 100 so that slippageFormat('10') is '10%'
	const val = isPercentage ? bn(value).div(100) : bn(value);
	return !isZero(value) && val.lt(PERCENTAGE_LOWER_THRESHOLD);
}

export function isSuperSmallAmount(value: Numberish): boolean {
	return bn(value).lte(BN_LOWER_THRESHOLD);
}

export function isZero(amount: Numberish): boolean {
	return bn(amount).isZero();
}
