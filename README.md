<h1 align="center">DeFi Numbers</h1>

<p align="center">Number formatting and utilities for DeFi apps.</p>

<p align="center">
	<!-- prettier-ignore-start -->
	<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
	<a href="#contributors" target="_blank"><img alt="👪 All Contributors: 2" src="https://img.shields.io/badge/%F0%9F%91%AA_all_contributors-2-21bb42.svg" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->
	<!-- prettier-ignore-end -->
	<a href="https://github.com/Dappness/defi-numbers/blob/main/.github/CODE_OF_CONDUCT.md" target="_blank"><img alt="🤝 Code of Conduct: Kept" src="https://img.shields.io/badge/%F0%9F%A4%9D_code_of_conduct-kept-21bb42" /></a>
	<a href="https://codecov.io/gh/Dappness/defi-numbers" target="_blank"><img alt="🧪 Coverage" src="https://img.shields.io/codecov/c/github/Dappness/defi-numbers?label=%F0%9F%A7%AA%20coverage" /></a>
	<a href="https://github.com/Dappness/defi-numbers/blob/main/LICENSE.md" target="_blank"><img alt="📝 License: MIT" src="https://img.shields.io/badge/%F0%9F%93%9D_license-MIT-21bb42.svg"></a>
	<a href="http://npmjs.com/package/defi-numbers"><img alt="📦 npm version" src="https://img.shields.io/npm/v/defi-numbers?color=21bb42&label=%F0%9F%93%A6%20npm" /></a>
	<img alt="💪 TypeScript: Strict" src="https://img.shields.io/badge/%F0%9F%92%AA_typescript-strict-21bb42.svg" />
</p>

## Usage

```shell
npm i defi-numbers
```

### Basic Usage

```ts
import { fNum } from "defi-numbers";

// Token amounts
fNum("token", "12345"); // -> 12.35k
fNum("token", "12345", { abbreviated: false }); // -> 12,345
fNum("token", "0.001234"); // -> 0.0012
fNum("token", "0.00001"); // -> < 0.00001

// Fiat values
fNum("fiat", "1234.56"); // -> 1.23k
fNum("fiat", "1234.56", { abbreviated: false }); // -> 1,234.56
fNum("fiat", "0.001"); // -> < 0.01

// Percentages
fNum("percentage", "0.10"); // -> 10%
fNum("percentage", "0.001"); // -> 0.1%
fNum("percentage", "0.00001"); // -> < 0.01%

// Integers
fNum("integer", "1234567"); // -> 1,234,567
fNum("integer", "0.123"); // -> 0
```

### Utility Functions

```tsx
import { bn, safeSum, blockInvalidNumberInput } from "defi-numbers";

// Create BigNumber instances
bn("123.456").gte(100); // -> true

// Sum array of numbers safely
safeSum(["0.1", "0.2", "0.3"]); // -> "0.6"

// Block invalid number input in React
<input type="number" onKeyDown={blockInvalidNumberInput} />;
```

## Contributors

<!-- spellchecker: disable -->
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://dappness.com/"><img src="https://avatars.githubusercontent.com/u/2406506?v=4?s=100" width="100px;" alt="Gareth Fuller"/><br /><sub><b>Gareth Fuller</b></sub></a><br /><a href="https://github.com/Dappness/defi-numbers/commits?author=garethfuller" title="Code">💻</a> <a href="#content-garethfuller" title="Content">🖋</a> <a href="https://github.com/Dappness/defi-numbers/commits?author=garethfuller" title="Documentation">📖</a> <a href="#ideas-garethfuller" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-garethfuller" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-garethfuller" title="Maintenance">🚧</a> <a href="#projectManagement-garethfuller" title="Project Management">📆</a> <a href="#tool-garethfuller" title="Tools">🔧</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- spellchecker: enable -->
