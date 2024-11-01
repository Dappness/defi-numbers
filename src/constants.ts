export const MAX_UINT256 =
	115792089237316195423570985008687907853269984665640564039457584007913129639935n;

// Do not display percentage values greater than this amount; they are likely to be nonsensical.
export const PERCENTAGE_UPPER_THRESHOLD = 1_000_000;
export const PERCENTAGE_LOWER_THRESHOLD = 0.0001;
export const SMALL_PERCENTAGE_LABEL = "< 0.01%";

// Do not display bn values lower than this amount; they are likely to generate NaN results
export const BN_LOWER_THRESHOLD = 0.000001;

// Display <0.001 for small amounts
export const AMOUNT_LOWER_THRESHOLD = 0.001;
export const SMALL_AMOUNT_LABEL = "< 0.001";

// fiat value threshold for displaying the fiat format without cents
export const FIAT_THRESHOLD = 100_000; // e.g. after $100,000 stop displaying cents.

export const NUMERAL_DECIMAL_LIMIT = 9;
