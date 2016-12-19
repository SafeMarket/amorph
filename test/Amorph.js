const Amorph = require('../')
const hexConverters = require('amorph-hex')
const base58Converters = require('amorph-base58')
const bignumberConverters = require('amorph-bignumber')
const chai = require('chai')
const FormNotStringError = require('../errors/FormNotString')
const NoFormError = require('../errors/NoForm')
const NotNobjectError = require('../errors/NotNobject')
const NotReadyError = require('../errors/NotReady')
const CCNoPathError = require('cross-converter/errors/NoPath')
const CCNoFormError = require('cross-converter/errors/NoForm')

chai.should()

describe('Amorph', () => {

  let helloworld
  let deadbeef

  it('should be ready', () => {
    Amorph.isReady.should.equal(true)
  })

  it('should load lowercase-uppercase converter', () => {
    Amorph.loadConverter('lowercase', 'uppercase', (lowercase) => { return lowercase.toUpperCase() })
  })

  it('should re-load lowercase-uppercase converter', () => {
    Amorph.loadConverter('lowercase', 'uppercase', (lowercase) => { return lowercase.toUpperCase() })
  })

  it('should not be ready', () => {
    Amorph.isReady.should.equal(false)
  })

  it('should throw FormNotStringError', () => {
    // eslint-disable-next-line no-new
    (() => { new Amorph('hello') }).should.throw(FormNotStringError)
  })

  it('should throw NoFormError', () => {
    // eslint-disable-next-line no-new
    (() => { new Amorph('hello', 'world') }).should.throw(NoFormError)
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

  it('should throw NotReadyError when trying to convert', () => {
    (() => { helloworld.to('uppercase') }).should.throw(NotReadyError)
  })

  it('should ready', () => {
    Amorph.ready()
    Amorph.isReady.should.be.equal(true)
  })

  it('should convert lowercase to uppercase', () => {
    const amorph = new Amorph('hello world!', 'lowercase')
    amorph.to('uppercase').should.equal('HELLO WORLD!')
  })

  it('should throw NotNobjectError when trying to load a non-nobject', () => {
    (() => { Amorph.loadConverters({}) }).should.throw(NotNobjectError)
  })

  it('should load hexConverters', () => {
    Amorph.loadConverters(hexConverters)
  })

  it('should not be ready', () => {
    Amorph.isReady.should.equal(false)
  })

  it('should ready', () => {
    Amorph.ready()
    Amorph.isReady.should.equal(true)
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

  it('should throw CCNoFormError when trying to convert to piglatin', () => {
    (() => { deadbeef.to('piglatin') }).should.throw(CCNoFormError)
  })

  it('should convert deadbeef to hex', () => {
    deadbeef.to('hex').should.equal('deadbeef')
  })

  it('should have path from uint8Array to hex.prefixed via hex', () => {
    const path = Amorph.crossConverter.paths.get('uint8Array', 'hex.prefixed')
    path.should.be.instanceOf(Array)
    path.should.be.deep.equal(['uint8Array', 'hex', 'hex.prefixed'])
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

  it('should load base58Converters', () => {
    Amorph.loadConverters(base58Converters)
  })

  it('should not be ready', () => {
    Amorph.isReady.should.equal(false)
  })

  it('should ready', () => {
    Amorph.ready()
    Amorph.isReady.should.equal(true)
  })

  it('should convert deadbeef to base58', () => {
    deadbeef.to('base58').should.equal('6h8cQN')
  })

  it('should have path from hex.prefixed to base58', () => {
    Amorph.crossConverter.paths.get('hex.prefixed', 'base58').should.be.instanceOf(Array)
    Amorph.crossConverter.paths.get('hex.prefixed', 'base58').should.deep.equal(['hex.prefixed', 'hex', 'uint8Array', 'base58'])
  })

  it('should convert hex.prefixed to base58', () => {
    new Amorph('0xdeadbeef', 'hex.prefixed').to('base58').should.equal('6h8cQN')
  })

  describe('.equals', () => {

    it('should load bignumberConverters', () => {
      Amorph.loadConverters(bignumberConverters)
      Amorph.ready()
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
      amorph1.equals(amorph2).should.equal(true)
    })

    it('amorph(0a, hex) should equal amorph(10, number)', () => {
      const amorph1 = new Amorph('0a', 'hex')
      const amorph2 = new Amorph(10, 'number')
      amorph1.equals(amorph2).should.equal(true)
    })

    it('amorph(10, number) should NOT equal(bignumber) amorph(a, hex)', () => {
      const amorph1 = new Amorph(10, 'number')
      const amorph2 = new Amorph('a', 'hex')
      amorph1.equals(amorph2, 'bignumber').should.equal(false)
    })

    it('amorph(10, number) should NOT equal(hex) amorph(a, hex)', () => {
      const amorph1 = new Amorph(10, 'number')
      const amorph2 = new Amorph('a', 'hex')
      amorph1.equals(amorph2, 'hex').should.equal(true)
    })

    it('amorph(11, number) should NOT equal amorph(a, hex)', () => {
      const amorph1 = new Amorph(11, 'number')
      const amorph2 = new Amorph('a', 'hex')
      amorph1.equals(amorph2, 'hex').should.not.equal(true)
    })

  })

  describe('readme examples', () => {

    it('should work', () => {

      Amorph.loadConverter('string', 'uppercase', (string) => { return string.toUpperCase() })
      Amorph.loadConverter('uppercase', 'exclamation', (uppercase) => { return `${uppercase}!` })
      Amorph.ready()

      new Amorph('hello world', 'string').to('exclamation')
      // >> HELLO WORLD!

      Amorph.loadConverters(hexConverters)
      Amorph.loadConverters(base58Converters)
      Amorph.ready()

      const deadbeef2 = new Amorph('deadbeef', 'hex')
      deadbeef2.to('hex.prefixed').should.equal('0xdeadbeef')
      deadbeef2.to('uint8Array').should.deep.equal(new Uint8Array([222, 173, 190, 239]))
      deadbeef2.to('base58').should.equal('6h8cQN')
    })

  })

})
