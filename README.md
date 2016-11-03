# amorph

> Amorphous javascript object: Express truths in many forms


## Install

Install with [npm](https://www.npmjs.com/)

```sh
$ npm i amorph --save
```

## Usage

```js

const Amorph = require('amorph')
amorph.loadConverter('string', 'uppercase', (string) => { return string.toUpperCase() })
amorph.loadConverter('uppercase', 'exclamation', (uppercase) => { return uppercase + '!' })
Amorph.ready()

new Amorph('hello world', 'string').to('exclamation')
// >> HELLO WORLD!

Amorph.loadConverters(require('amorph-hex'))
Amorph.loadConverters(require('amorph-base58'))
Amorph.ready()

const deadbeef = new Amorph('deadbeef', 'hex')
deadbeef.to('hex.prefixed')
// >> 0xdeadbeef
deadbeef.to('uint8Array')
// >> Uint8Array [222, 173, 190, 239]
deadbeef.to('base58')
// >> 6h8cQN
```

## Running tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/SafeMarket/amorph/issues)

## Author

***

* [github/---](https://github.com/---)
* [twitter/---](http://twitter.com/---)

## License

Copyright © 2016 []()
Licensed under the MIT license.

***

_This file was generated by [readme-generator](https://github.com/jonschlinkert/readme-generator) on November 03, 2016._