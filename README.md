# @lopatnov/join

[![NPM version](https://badge.fury.io/js/%40lopatnov%2Fjoin.svg)](https://www.npmjs.com/package/@lopatnov/join)
[![GitHub issues](https://img.shields.io/github/issues/lopatnov/join)](https://github.com/lopatnov/join/issues)
[![GitHub forks](https://img.shields.io/github/forks/lopatnov/join)](https://github.com/lopatnov/join/network)
[![GitHub stars](https://img.shields.io/github/stars/lopatnov/join)](https://github.com/lopatnov/join/stargazers)
[![License](https://img.shields.io/github/license/lopatnov/join)](https://github.com/lopatnov/join/blob/master/LICENSE)

[![build-and-test-package](https://github.com/lopatnov/join/workflows/build-and-test-package/badge.svg)](https://github.com/lopatnov/join/tree/master/tests)
[![publish-npm-package](https://github.com/lopatnov/join/workflows/publish-npm-package/badge.svg)](https://github.com/lopatnov/join/releases)

[![Patreon](https://img.shields.io/badge/Donate-Patreon-informational)](https://www.patreon.com/lopatnov)
[![Twitter](https://img.shields.io/twitter/url?url=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40lopatnov%2Fjoin)](https://twitter.com/intent/tweet?text=I%20want%20to%20share%20TypeScript%20library:&url=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40lopatnov%2Fjoin)

The TypeScript library template.

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

## How to use

### As three separate operations

```typescript
const rightJoin = join(JoinTypes.right);

const joinObject = rightJoin({
  sample1: "One",
  sample2: "Two",
  sample3: "Three",
});

const m = joinObject({
  sample2: "Dos",
  sample3: "Tres",
  sample4: "Quatro",
});
```

### As a function

```typescript
const c = join(JoinTypes.innerJoin)({
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
```

## Demo

See, how it's working: [https://runkit.com/lopatnov/join](https://runkit.com/lopatnov/join)

Test it with a runkit: [https://npm.runkit.com/@lopatnov/join](https://npm.runkit.com/%40lopatnov%2Fjoin)

## Rights and Agreements

License [Apache-2.0](https://github.com/lopatnov/join/blob/master/LICENSE)

Copyright 2020 Oleksandr Lopatnov
