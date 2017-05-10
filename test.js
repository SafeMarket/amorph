/* globals describe, it */

const Amorph = require('./')
const hexPlugin = require('amorph-hex')
const base58Plugin = require('amorph-base58')
const bufferPlugin = require('amorph-buffer')
const bignumberPlugin = require('amorph-bignumber')
const chai = require('chai')
const PluginVersionError = require('./errors/PluginVersionError')
const CCNoPathError = require('cross-converter/errors/NoPath')
const CCNoConverterError = require('cross-converter/errors/NoConverter')
const Nobject = require('nobject')
const ArgumentTypeError = require('arguguard/errors/user/ArgumentType')
const ArgumentInstanceError = require('arguguard/errors/user/ArgumentInstance')

chai.should()

describe('Amorph', () => {

  let helloworld
  let deadbeef

  it('should load lowercase-uppercase converter', () => {
    Amorph.crossConverter.addConverter('lowercase', 'uppercase', (lowercase) => { return lowercase.toUpperCase() })
  })

  it('should re-load lowercase-uppercase converter', () => {
    Amorph.crossConverter.addConverter('lowercase', 'uppercase', (lowercase) => { return lowercase.toUpperCase() })
  })

  it('should throw Error', () => {
    // eslint-disable-next-line no-new
    (() => { new Amorph('hello') }).should.throw(ArgumentTypeError)
  })

  it('should create helloworld Amorph', () => {
    const lowercase = 'hello world!'
    helloworld = new Amorph('hello world!', 'lowercase')
    helloworld.should.be.instanceOf(Amorph)
    helloworld.form.should.equal('lowercase')
    helloworld.truth.should.equal(lowercase)
  })

  it('helloworld to string should be "[Amorph lowercase:helloworld]"', () => {
    return helloworld.toString().should.equal('[Amorph lowercase : hello world!]')
  })

  it('should convert lowercase to uppercase', () => {
    const amorph = new Amorph('hello world!', 'lowercase')
    amorph.to('uppercase').should.equal('HELLO WORLD!')
  })

  it('should load hexPlugin', () => {
    Amorph.loadPlugin(hexPlugin)
  })

  it('should load bufferPlugin', () => {
    Amorph.loadPlugin(bufferPlugin)
  })

  it('should create deadbeef Amorph', () => {
    const uint8Array = new Uint8Array([222, 173, 190, 239])
    deadbeef = new Amorph(uint8Array, 'uint8Array')
    deadbeef.should.be.instanceOf(Amorph)
    deadbeef.form.should.equal('uint8Array')
    deadbeef.truth.should.equal(uint8Array)
  })

  it('deadbeef to string should be "[Amorph uint8Array:[222, 173, 190, 239]]"', () => {
    deadbeef.toString().should.equal('[Amorph uint8Array : 222,173,190,239]')
  })

  it('should convert deadbeef to uint8Array', () => {
    deadbeef.to('uint8Array').should.deep.equal(new Uint8Array([222, 173, 190, 239]))
  })

  it('should throw CCNoConverterError when trying to convert to piglatin', () => {
    (() => { deadbeef.to('piglatin') }).should.throw(CCNoConverterError)
  })

  it('should convert deadbeef to hex', () => {
    deadbeef.to('hex').should.equal('deadbeef')
  })

  it('should have undefined path from uint8Array to hex.prefixed', () => {
    const path = Amorph.crossConverter.paths.get('uint8Array', 'hex.prefixed')
    chai.expect(path).to.equal(undefined)
  })

  it('should add path from uint8Array to hex.prefixed', () => {
    Amorph.crossConverter.addPath(['uint8Array', 'hex', 'hex.prefixed'])
  })

  it('should convert deadbeef to hex.prefixed', () => {
    deadbeef.to('hex.prefixed').should.equal('0xdeadbeef')
  })

  it('should not have path from uint8Array to uppercase', () => {
    const path = Amorph.crossConverter.paths.get('uint8Array', 'uppercase')
    chai.expect(path).to.equal(undefined)
  })

  it('should throw CCNoPathError when converting deadbeef to lowercase', () => {
    (() => { deadbeef.to('uppercase') }).should.throw(CCNoPathError)
  })

  it('should load base58Plugin', () => {
    Amorph.loadPlugin(base58Plugin)
  })

  it('should convert deadbeef to base58', () => {
//    console.log(JSON.stringify(JSON.parse(Amorph.crossConverter.paths.toJSON()), null, 2))
    Amorph.crossConverter.addPath(['uint8Array', 'hex', 'buffer', 'base58'])
    deadbeef.to('base58').should.equal('6h8cQN')
  })

  it('should convert hex.prefixed to base58', () => {
    Amorph.crossConverter.addPath(['hex.prefixed', 'hex', 'buffer', 'base58'])
    new Amorph('0xdeadbeef', 'hex.prefixed').to('base58').should.equal('6h8cQN')
  })

  it('should throw plugin version error with blank nobject', () => {
    (() => {
      Amorph.loadPlugin(new Nobject())
    }).should.throw(PluginVersionError)
  })

  it('should throw plugin version error pluginVersion 2', () => {
    (() => {
      Amorph.loadPlugin({
        pluginVersion: 2
      })
    }).should.throw(PluginVersionError)
  })

  describe('.equals', () => {

    it('should load bignumberPlugin', () => {
      Amorph.loadPlugin(bignumberPlugin)
    })

    it('amorph(10, number) should equal amorph(10, number)', () => {
      const amorph1 = new Amorph(10, 'number')
      const amorph2 = new Amorph(10, 'number')
      amorph1.equals(amorph2).should.equal(true)
    })

    it('amorph(10, number) should NOT equal amorph(20, number)', () => {
      const amorph1 = new Amorph(10, 'number')
      const amorph2 = new Amorph(20, 'number')
      amorph1.equals(amorph2).should.equal(false)
    })

    it('amorph(10, number) should equal amorph(a, hex)', () => {
      const amorph1 = new Amorph(10, 'number')
      const amorph2 = new Amorph('a', 'hex')
      Amorph.crossConverter.addPath(['hex', 'bignumber', 'number'])
      amorph1.equals(amorph2).should.equal(true)
    })

    it('amorph(0a, hex) should equal amorph(10, number)', () => {
      const amorph1 = new Amorph('0a', 'hex')
      const amorph2 = new Amorph(10, 'number')
      Amorph.crossConverter.addPath(['number', 'bignumber', 'hex'])
      amorph1.equals(amorph2).should.equal(true)
    })

    it('amorph(10, number) should equal(bignumber) amorph(a, hex)', () => {
      const amorph1 = new Amorph(10, 'number')
      const amorph2 = new Amorph('a', 'hex')
      amorph1.equals(amorph2, 'bignumber').should.equal(true)
    })

    it('amorph(10, number) should equal(hex) amorph(a, hex)', () => {
      const amorph1 = new Amorph(10, 'number')
      const amorph2 = new Amorph('0a', 'hex')
      amorph1.equals(amorph2, 'hex').should.equal(true)
    })

    it('amorph(11, number) should NOT equal amorph(a, hex)', () => {
      const amorph1 = new Amorph(11, 'number')
      const amorph2 = new Amorph('a', 'hex')
      amorph1.equals(amorph2, 'hex').should.not.equal(true)
    })

    it('amorph([1, 2, 3], array) should equal amorph([1, 2, 3], array)', () => {
      const amorph1 = new Amorph([1, 2, 3], 'array')
      const amorph2 = new Amorph([1, 2, 3], 'array')
      amorph1.equals(amorph2).should.equal(true)
    })

  })

  describe('.as', () => {
    it('number test', () => {
      const amorph1 = new Amorph(1, 'number')
      const amorph2 = amorph1.as('number', (number) => { return number + 1 })
      amorph1.to('number').should.equal(1)
      amorph2.to('number').should.equal(2)
    })
    it('hex test', () => {
      const amorph1 = new Amorph('010203', 'hex')
      Amorph.crossConverter.addPath(['hex', 'buffer', 'uint8Array', 'array'])
//      console.log(amorph1.to('hex'))
//      console.log(amorph1.to('uint8Array'))
//      const amorph2 = amorph1.as('array', (array) => { return array.slice(-1) })
      amorph1.to('array').should.deep.equal([1, 2, 3])
//      amorph2.to('array').should.deep.equal([3])
    })
  })

  describe('readme examples', () => {

    it('should work', () => {

      Amorph.crossConverter.addConverter('string', 'uppercase', (string) => { return string.toUpperCase() })
      Amorph.crossConverter.addConverter('uppercase', 'exclamation', (uppercase) => { return `${uppercase}!` })
      Amorph.crossConverter.addPath(['string', 'uppercase', 'exclamation'])

      new Amorph('hello world', 'string').to('exclamation')
      // >> HELLO WORLD!

      Amorph.loadPlugin(hexPlugin)
      Amorph.loadPlugin(base58Plugin)
      Amorph.crossConverter.addPath(['hex', 'buffer', 'base58'])

      const deadbeef2 = new Amorph('deadbeef', 'hex')
      deadbeef2.to('hex.prefixed').should.equal('0xdeadbeef')
      deadbeef2.to('uint8Array').should.deep.equal(new Uint8Array([222, 173, 190, 239]))
      deadbeef2.to('base58').should.equal('6h8cQN')
    })

  })

})
