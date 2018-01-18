# amorph

> Amorphous javascript object: Express truths in many forms


## Install

Install with [npm](https://www.npmjs.com/)

```sh
$ npm i amorph --save
```

## Usage

```js
  // Basic Usage

  const Amorph = require('amorph')
  const amorphHex = require('amorph-hex')
  const amorphInt = require('amorph-int')

  const myBalance  = Amorph.from(amorphHex, '0101')

  myBalance.to(amorphInt)
  // >> 257

  myBalance.as(amorphInt, (int) => {
    return int - 2
  }).to(amorphHex)
  // >> 'ff'

  // Custom Converters
  const AmorphConverter = require('amorph/lib/AmorphConverter')
  const amorphAscii = new AmorphConverter((uint8Array) => {
    // Given a uint8Array, returns ascii
    return asciiEncoder.encode(uint8Array)
  }, (ascii) => {
    // Given ascii, returns uint8Array
    return asciiEncoder.decode(ascii)
  })

  Amorph.from(amorphAscii, 'hello world!').to(hexConverter)
  // >> 68656c6c6f20776f726c6421

```

## Running tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/SafeMarket/amorph/issues)


## License

Copyright © 2016 []()
Licensed under the MIT license.

***

_This file was generated by [readme-generator](https://github.com/jonschlinkert/readme-generator) on November 03, 2016._
