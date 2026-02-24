# @lopatnov/join

> A TypeScript library providing **SQL-like join operations** for JavaScript objects.
> Merge two objects using one of 9 composable join types, with support for deep merging of nested objects.

[![npm downloads](https://img.shields.io/npm/dt/@lopatnov/join)](https://www.npmjs.com/package/@lopatnov/join)
[![npm version](https://badge.fury.io/js/%40lopatnov%2Fjoin.svg)](https://www.npmjs.com/package/@lopatnov/join)
[![License](https://img.shields.io/github/license/lopatnov/join)](https://github.com/lopatnov/join/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/lopatnov/join)](https://github.com/lopatnov/join/issues)
[![GitHub stars](https://img.shields.io/github/stars/lopatnov/join)](https://github.com/lopatnov/join/stargazers)

---

## Table of Contents

- [Installation](#installation)
- [Import](#import)
- [Join Types](#join-types)
- [API](#api)
- [Usage Examples](#usage-examples)
- [Demo](#demo)
- [Contributing](#contributing)
- [Built With](#built-with)
- [License](#license)

---

## Installation

```shell
npm install @lopatnov/join
```

**Browser:**

```html
<script src="https://lopatnov.github.io/join/dist/join.umd.min.js"></script>
```

---

## Import

### TypeScript / ES Modules

```typescript
import { join, JoinTypes } from "@lopatnov/join";
```

### CommonJS

```javascript
const { join, JoinTypes } = require("@lopatnov/join");
```

---

## Join Types

![Join Types](./img/join-types.png)

The library uses a **4-bit flag system** to describe which parts of two objects appear in the result:

| Bit | Name         | Meaning                                        |
| :-: | ------------ | ---------------------------------------------- |
|  3  | `left`       | Include properties unique to the left object   |
|  2  | `innerLeft`  | Include shared properties, keeping left values |
|  1  | `innerRight` | Include shared properties, using right values  |
|  0  | `right`      | Include properties unique to the right object  |

### Named Join Types

| Join Type    |  Bits  | Description                                                      |
| :----------- | :----: | ---------------------------------------------------------------- |
| `none`       | `0000` | Empty result — no properties from either object                  |
| `left`       | `1000` | Only properties unique to the left object                        |
| `right`      | `0001` | Only properties unique to the right object                       |
| `innerLeft`  | `0100` | Shared properties only, keeping left values                      |
| `innerRight` | `0010` | Shared properties only, replacing with right values              |
| `innerJoin`  | `0110` | Shared properties, deep-merged (left + right values combined)    |
| `leftJoin`   | `1110` | Left-unique + shared properties (deep-merged)                    |
| `rightJoin`  | `0111` | Shared properties (deep-merged) + right-unique                   |
| `fullJoin`   | `1111` | All properties from both objects, shared ones deep-merged        |
| `expand`     | `1011` | Left-unique + right values for shared + right-unique _(default)_ |

Custom join types can be composed with bitwise OR:

```typescript
const customJoin = join(JoinTypes.left | JoinTypes.innerLeft | JoinTypes.right);
```

---

## API

```typescript
function join(
  joinType?: JoinTypes
): <TContext>(
  context: TContext
) => <TJoinObject>(joinObject: TJoinObject) => TContext & TJoinObject;
```

`join` uses a **curried three-step pattern**:

| Step | Call                        | Description                                          |
| ---- | --------------------------- | ---------------------------------------------------- |
| 1    | `join(JoinTypes.xxx)`       | Set the join type; returns a context-setter function |
| 2    | `contextSetter(leftObject)` | Set the left object; returns a joiner function       |
| 3    | `joiner(rightObject)`       | Set the right object; returns the merged result      |

`JoinTypes.expand` is the default join type when `join()` is called with no arguments.

---

## Usage Examples

### Right Join

Returns only the properties unique to the **right** object:

```typescript
const rightJoin = join(JoinTypes.right);

const contextJoinBy = rightJoin({
  sample1: "One",
  sample2: "Two",
  sample3: "Three"
});

const result = contextJoinBy({
  sample2: "Dos",
  sample3: "Tres",
  sample4: "Quatro"
});

console.log(result); // { sample4: "Quatro" }
```

### Left Join

Returns only the properties unique to the **left** object:

```typescript
const leftJoin = join(JoinTypes.left);

const contextJoinBy = leftJoin({
  sample1: "One",
  sample2: "Two",
  sample3: "Three"
});

const result = contextJoinBy({
  sample2: "Dos",
  sample3: "Tres",
  sample4: "Quatro"
});

console.log(result); // { sample1: "One" }
```

### Custom Bitwise Composition

Returns left-unique + shared (from left) + right-unique properties:

```typescript
const customJoin = join(JoinTypes.left | JoinTypes.innerLeft | JoinTypes.right);

const contextJoinBy = customJoin({
  sample1: "One",
  sample2: "Two",
  sample3: "Three"
});

const result = contextJoinBy({
  sample2: "Dos",
  sample3: "Tres",
  sample4: "Quatro"
});

console.log(result); // { sample1: "One", sample2: "Two", sample3: "Three", sample4: "Quatro" }
```

### Inner Join (Deep Merge)

Returns shared properties with their values **deep-merged**:

```typescript
const result = join(JoinTypes.innerJoin)({
  sample1: "One",
  sample2: "Two",
  sample3: { smile: "cheese" }
})({
  sample2: "Dos",
  sample3: { sorrir: "queijo" },
  sample4: "Quatro"
});

console.log(result);
// { sample2: "Dos", sample3: { smile: "cheese", sorrir: "queijo" } }
```

---

## Demo

- Live demo: [https://runkit.com/lopatnov/join](https://runkit.com/lopatnov/join)
- Try in browser: [https://npm.runkit.com/@lopatnov/join](https://npm.runkit.com/%40lopatnov%2Fjoin)

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

- Bug reports → [open an issue](https://github.com/lopatnov/join/issues)
- Questions → [Discussions](https://github.com/lopatnov/join/discussions)
- Found it useful? A [star on GitHub](https://github.com/lopatnov/join) helps others discover the project

---

## Built With

- [TypeScript](https://www.typescriptlang.org/) — strict typing throughout
- [Rollup](https://rollupjs.org/) — bundled to ESM, CJS, and UMD formats
- [Vitest](https://vitest.dev/) — unit testing with coverage
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) — linting and formatting

---

## License

[Apache-2.0](https://github.com/lopatnov/join/blob/master/LICENSE) © 2020–2026 [Oleksandr Lopatnov](https://github.com/lopatnov) · [LinkedIn](https://www.linkedin.com/in/lopatnov/)
