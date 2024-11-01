// eslint-disable-next-line n/no-missing-import
import { BigNumber } from "bignumber.js";

export type Numberish = bigint | BigNumber | number | string;
export type NumberFormatter = (val: Numberish) => string;
export type NumberFormat = "fiat" | "integer" | "percentage" | "token";
