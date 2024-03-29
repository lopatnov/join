# @lopatnov/join [![Twitter](https://img.shields.io/twitter/url?url=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40lopatnov%2Fjoin)](https://twitter.com/intent/tweet?text=I%20want%20to%20share%20TypeScript%20library:&url=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40lopatnov%2Fjoin)

[![npm](https://img.shields.io/npm/dt/@lopatnov/join)](https://www.npmjs.com/package/@lopatnov/join)
[![NPM version](https://badge.fury.io/js/%40lopatnov%2Fjoin.svg)](https://www.npmjs.com/package/@lopatnov/join)
[![GitHub issues](https://img.shields.io/github/issues/lopatnov/join)](https://github.com/lopatnov/join/issues)
[![GitHub forks](https://img.shields.io/github/forks/lopatnov/join)](https://github.com/lopatnov/join/network)
[![GitHub stars](https://img.shields.io/github/stars/lopatnov/join)](https://github.com/lopatnov/join/stargazers)
[![License](https://img.shields.io/github/license/lopatnov/join)](https://github.com/lopatnov/join/blob/master/LICENSE)

[![build-and-test-package](https://github.com/lopatnov/join/workflows/build-and-test-package/badge.svg)](https://github.com/lopatnov/join/tree/master/tests)
[![publish-npm-package](https://github.com/lopatnov/join/workflows/publish-npm-package/badge.svg)](https://github.com/lopatnov/join/releases)
[![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/@lopatnov/join)](https://www.npmjs.com/package/@lopatnov/join?activeTab=dependencies)

[![Patreon](https://img.shields.io/badge/Donate-Patreon-informational)](https://www.patreon.com/lopatnov)
[![sobe.ru](https://img.shields.io/static/v1?label=sobe.ru&message=%D0%91%D0%BB%D0%B0%D0%B3%D0%BE%D0%B4%D0%B0%D1%80%D0%BD%D0%BE%D1%81%D1%82%D1%8C&color=yellow&logo=data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAArlBMVEUAAAD//////////////////////////////////////////////////////////////////PP/3l7/9c//0yb/zAD/6ZP/zQf/++7/3FD/88X/0h7//v7/5oX/zATUqQDktgD/5HjQpgAFBACQcwD/zw/fsgCOcQD6yADZrQD2xAD8yQDnuADxwADcsADbrwDpugD3xQD5xwDjtQDywQD+ywD9ygDvvwD7yAD/1jRaObVGAAAAEHRSTlMAA3zg707pEJP8MMUBYN5fiwXJMQAAAAFiS0dEAf8CLd4AAAAHdElNRQflBgMAAxO4O2jCAAAAuElEQVQoz42S1w7CMAxFS8ueYZgNLZuyRynw/z9GdtxIkbgPceQT6Tq2vZwfEKx8wRPyiaViSYDABqQsAMq0OzxUqhbo9kBcavUM6A9AAtJAYDgC0ID7i+t4AghwfxanszlAGBnA/Flc0MfL1doA5s/ChoLtbg8QI392gpIBzf/AwYAWAsdTrIE05/nz5Xq7S6DKpenHM0pe+o/qg5Am74/0ybTkm+q6wG4iltV2LTko52idy+Banx9RYiS6Vrsc3AAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMS0wNi0wM1QwMDowMzoxOCswMDowMLvSSCkAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjEtMDYtMDNUMDA6MDM6MTgrMDA6MDDKj/CVAAAAAElFTkSuQmCC)](https://sobe.ru/na/tech_knigi)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-lopatnov-informational?style=social&logo=linkedin)](https://www.linkedin.com/in/lopatnov/)

Object join technics.

## Install

[![https://nodei.co/npm/@lopatnov/join.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/@lopatnov/join.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/@lopatnov/join)

```shell
npm install @lopatnov/join
```

[Browser](https://lopatnov.github.io/join/dist/join.js)

```html
<script src="https://lopatnov.github.io/join/dist/join.min.js"></script>
```

## Import package to the project

### TypeScript

```typescript
import { join, JoinTypes } from "@lopatnov/join";
```

### JavaScript

```javascript
var library = require("@lopatnov/join");
var join = library.join;
var JoinTypes = library.JoinTypes;
```

## Join Types

![Join Types](./img/join-types.png)

```typescript
enum JoinTypes {
  none       = 0b0000,
  left       = 0b1000, // take unique left object properties
  right      = 0b0001, // take unique right object properties
  innerLeft  = 0b0100, // take non-unique (inner) properties from left object
  innerRight = 0b0010, // take non-unique (inner) properties from right object
  innerJoin  = none | innerLeft | innerRight | none, // innerLeft + innerRight = deep merge inner join of two objects
  leftJoin   = left | innerLeft | innerRight | none,
  rightJoin  = none | innerLeft | innerRight | right,
  fullJoin   = left | innerLeft | innerRight | right,
  expand     = left | none      | innerRight | right
}
```

`JoinTypes.expand` is default join type

## How to use

```ts
// 1. Set join Type
function join(joinType?: JoinTypes) => (local function)<TContext>(context: TContext)
```

```ts
// 2. Set context (left object)
(local function)<TContext>(context: TContext) => (local function)<TJoinObject>(joinObject: TJoinObject)
```

```ts
// 3. Set join object (right object) and gets result
(local function)<TJoinObject>(joinObject: TJoinObject): TContext & TJoinObject
```

### As three separate operations

#### Right join sample

```typescript
const rightJoin = join(JoinTypes.right);

const contextJoinBy = rightJoin({
  sample1: "One",
  sample2: "Two",
  sample3: "Three",
});

const result = contextJoinBy({
  sample2: "Dos",
  sample3: "Tres",
  sample4: "Quatro",
});

console.log(result); // { sample4: "Quatro" }
```

#### Left join sample

```typescript
const leftJoin = join(JoinTypes.left);

const contextJoinBy = leftJoin({
  sample1: "One",
  sample2: "Two",
  sample3: "Three",
});

const result = contextJoinBy({
  sample2: "Dos",
  sample3: "Tres",
  sample4: "Quatro",
});

console.log(result); // { sample1: "One" }
```

#### Complex join sample

```typescript
const complexJoin = join(JoinTypes.left | JoinTypes.innerLeft | JoinTypes.right);

const contextJoinBy = complexJoin({
  sample1: "One",
  sample2: "Two",
  sample3: "Three",
});

const result = contextJoinBy({
  sample2: "Dos",
  sample3: "Tres",
  sample4: "Quatro",
});

console.log(result); // {sample1: "One", sample2: "Two", sample3: "Three", sample4: "Quatro"}
```

#### Inner join sample

```typescript
const result = join(JoinTypes.innerJoin)({
  sample1: "One",
  sample2: "Two",
  sample3: {
    smile: "cheese",
  },
})({
  sample2: "Dos",
  sample3: {
    sorrir: "queijo",
  },
  sample4: "Quatro",
});

console.log(result); // {sample2: "Dos", sample3: {smile: "cheese", sorrir: "queijo"}}
```

## Demo

See, how it's working: [https://runkit.com/lopatnov/join](https://runkit.com/lopatnov/join)

Test it with a runkit: [https://npm.runkit.com/@lopatnov/join](https://npm.runkit.com/%40lopatnov%2Fjoin)

## Rights and Agreements

License [Apache-2.0](https://github.com/lopatnov/join/blob/master/LICENSE)

Copyright 2020–2021 Oleksandr Lopatnov
