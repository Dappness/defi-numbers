import numeral from "numeral";

import {
	FIAT_THRESHOLD,
	PERCENTAGE_LOWER_THRESHOLD,
	PERCENTAGE_UPPER_THRESHOLD,
	SMALL_AMOUNT_LABEL,
	SMALL_PERCENTAGE_LABEL,
} from "./constants.js";
import { NumberFormat, Numberish } from "./types.js";
import {
	bn,
	isLessThanThreshold,
	isMoreThanThreshold,
	toSafeNum,
} from "./utils.js";

interface FormatOpts {
	abbreviated?: boolean;
}

/**
 * Formats a number according to the specified format.
 * @param format The format to use.
 * @param val The number to format.
 * @param opts {FormatOpts} The formatting options.
 * @returns The formatted number.
 */
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

// Numeral formats
const INTEGER_FORMAT = "0,0";
const FIAT_FORMAT_A = "0,0.00a";
const FIAT_FORMAT = "0,0.00";
const FIAT_FORMAT_WITHOUT_DECIMALS = "0,0";
const TOKEN_FORMAT = "0,0.[0000]";
const TOKEN_FORMAT_A = "0,0.[0000]a";
const TOKEN_FORMAT_A_BIG = "0,0.[00]a";
const PERCENTAGE_FORMAT = "0,0.[00]%";

/**
 * Formats a number as an integer.
 * @param val The number to format.
 * @returns The formatted number.
 */
function integerFormat(val: Numberish): string {
	if (isLessThanThreshold(val)) {
		return "0";
	}
	return numeral(toSafeNum(val)).format(INTEGER_FORMAT);
}

/**
 * Formats a number as a fiat value.
 * @param val The number to format.
 * @param opts {FormatOpts} The formatting options.
 * @param opts.abbreviated Whether to use abbreviated format (default: true)
 * @returns The formatted number.
 */
function fiatFormat(
	val: Numberish,
	{ abbreviated = true }: FormatOpts = {},
): string {
	if (isLessThanThreshold(val)) {
		return SMALL_AMOUNT_LABEL;
	}
	const format = abbreviated
		? FIAT_FORMAT_A
		: isMoreThanThreshold(val, { threshold: FIAT_THRESHOLD })
			? FIAT_FORMAT_WITHOUT_DECIMALS
			: FIAT_FORMAT;
	return numeral(toSafeNum(val)).format(format);
}

/**
 * Formats a number as a token value.
 * @param val The number to format.
 * @param opts {FormatOpts} The formatting options.
 * @param opts.abbreviated Whether to use abbreviated format (default: true)
 * @returns The formatted number.
 */
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
	const TOKEN_FORMAT_ABBREVIATED = bnVal.gte(1000)
		? TOKEN_FORMAT_A_BIG
		: TOKEN_FORMAT_A;
	const format = abbreviated ? TOKEN_FORMAT_ABBREVIATED : TOKEN_FORMAT;

	return numeral(toSafeNum(val)).format(format);
}

/**
 * Formats a number as a percentage value.
 * - If the value is above a certain threshold, a dash is returned as the value is likely to be nonsensical.
 * - If the value is less than a certain threshold, a < label is returned to
 *   make string length more predictable.
 * @param val The percentage to format. Decimal value. e.g. 0.10 is 10%.
 * @param opts {PercentageFormatOpts} The formatting options.
 * @param opts.belowThresholdLabel The label to display when the value is less than the lower threshold (default: "< 0.01%")
 * @param opts.lowerThreshold The lower threshold for displaying the percentage (default: 0.0001)
 * @param opts.upperThreshold The upper threshold for displaying the percentage (default: 1,000,000)
 * @returns The formatted number.
 */
function percentageFormat(
	val: Numberish,
	{
		belowThresholdLabel = SMALL_PERCENTAGE_LABEL,
		lowerThreshold = PERCENTAGE_LOWER_THRESHOLD,
		upperThreshold = PERCENTAGE_UPPER_THRESHOLD,
	}: {
		belowThresholdLabel?: string;
		lowerThreshold?: number;
		upperThreshold?: number;
	} = {},
): string {
	if (isMoreThanThreshold(val, { threshold: upperThreshold })) {
		return "-";
	}

	if (isLessThanThreshold(val, { threshold: lowerThreshold })) {
		return belowThresholdLabel;
	}

	return numeral(val.toString()).format(PERCENTAGE_FORMAT);
}
