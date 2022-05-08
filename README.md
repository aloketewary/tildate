<p align="center">
  <img src="https://i.ibb.co/CQvK68H/tildate-logo.png" width="597" alt="tildate">
</p>

# tildate

> TilDate is a typescript datetime library to format and parse native js Date()

[![Build Status](https://travis-ci.org/aloketewary/tildate.svg?branch=master)](https://travis-ci.org/aloketewary/tildate)
[![NPM version](https://img.shields.io/npm/v/tildate.svg)](https://www.npmjs.com/package/tildate)
![Downloads](https://img.shields.io/npm/dm/tildate.svg)
[![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

---

## ✨ Features

- DateTime is capable of formatting using same formatter as Java
- It can Parse string using same formatter
- Added extra functionality ex: isBefore(), isAfter(), isSame()
- 

## 🔧 Installation

```sh
yarn add tildate
or
npm i tildate -S
```

## 🎬 Getting started

It's simple to start:

```ts
import { DateTime } from 'tildate';
// Others imports
class MyClass {
   dateTime = new DateTime();
}

<!-- in html -->
{{dateTime}} // for Angular
```

## 🎭 Examples

Go checkout [examples](./examples) !

## 📜 API

> Document your API here

### `publicMethodOne(value:string): string`

These methods do foo bar moo...

**Example:**

```ts
// example
```

## 🎓 Guides

<details>
<summary>How to do format</summary>
 new DateTime().format('yyyy-MM-dd');
</details>
<details>
<summary>How to do parse</summary>
 new DateTime().parse("2012-03-12'T'12:45:34.34");
</details>

### 🕵️ Troubleshooting

## 🥂 License

[MIT](./LICENSE) as always
