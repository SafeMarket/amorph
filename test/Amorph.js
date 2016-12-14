const Amorph = require('../')
const hexConverters = require('amorph-hex')
const base58Converters = require('amorph-base58')
const bignumberConverters = require('amorph-bignumber')
const expect = require('chai').expect

describe('Amorph', () => {

  let helloworld, deadbeef

  it('should be ready', () => {
    expect(Amorph.isReady).to.be.true
  })

  it('should have errors object', () => {
    expect(Amorph.errors).to.be.an.object
  })

  it('should load lowercase-uppercase converter', () => {
    Amorph.loadConverter('lowercase', 'uppercase', (lowercase) => { return lowercase.toUpperCase() })
  })

  it('should have 2 forms', () => {
    expect(Amorph.forms.length).to.equal(2)
  })

  it('should re-load lowercase-uppercase converter', () => {
    Amorph.loadConverter('lowercase', 'uppercase', (lowercase) => { return lowercase.toUpperCase() })
  })

  it('should still have 2 forms', () => {
    expect(Amorph.forms.length).to.equal(2)
  })

  it('should not be ready', () => {
    expect(Amorph.isReady).to.be.false
  })

  it('should throw FormNotStringError', () => {
    expect(() => { new Amorph('hello') }).to.throw(Amorph.errors.FormNotStringError)
  })

  it('should throw NoFormError', () => {
    expect(() => { new Amorph('hello', 'world') }).to.throw(Amorph.errors.NoFormError)
  })

  it('should create helloworld Amorph', () => {
    const lowercase = 'hello world!'
    helloworld = new Amorph('hello world!', 'lowercase')
    expect(helloworld).to.be.instanceOf(Amorph)
    expect(helloworld.form).to.equal('lowercase')
    expect(helloworld.truth).to.equal(lowercase)
  })

  it('helloworld to string should be "[Amorph lowercase:helloworld]"', () => {
    return expect(helloworld.toString()).to.equal('[Amorph lowercase : hello world!]')
  })

  it('should throw NotReadyError when trying to convert', () => {
    expect(() => { helloworld.to('uppercase') }).to.throw(Amorph.errors.NotReadyError)
  })

  it('should ready', () => {
    Amorph.ready()
    expect(Amorph.isReady).to.be.true
  })

  it('should convert lowercase to uppercase', () => {
    expect(new Amorph('hello world!', 'lowercase').to('uppercase')).to.equal('HELLO WORLD!')
  })

  it('should throw NotNobjectError when trying to load a non-nobject', () => {
    expect(() => { Amorph.loadConverters({}) }).to.throw(Amorph.errors.NotNobjectError)
  })

  it('should load hexConverters', () => {
    Amorph.loadConverters(hexConverters)
  })

  it('should not be ready', () => {
    expect(Amorph.isReady).to.be.false
  })

  it('should ready', () => {
    Amorph.ready()
    expect(Amorph.isReady).to.be.true
  })

  it('should create deadbeef Amorph', () => {
    const uint8Array = new Uint8Array([222, 173, 190, 239])
    deadbeef = new Amorph(uint8Array, 'uint8Array')
    expect(deadbeef).to.be.instanceOf(Amorph)
    expect(deadbeef.form).to.equal('uint8Array')
    expect(deadbeef.truth).to.equal(uint8Array)
  })

  it('deadbeef to string should be "[Amorph uint8Array:[222, 173, 190, 239]]"', () => {
    return expect(deadbeef.toString()).to.equal('[Amorph uint8Array : 222,173,190,239]')
  })

  it('should convert deadbeef to uint8Array', () => {
    expect(deadbeef.to('uint8Array')).to.deep.equal(new Uint8Array([222, 173, 190, 239]))
  })

  it('should throw NoFormError when trying to convert to piglatin', () => {
    expect(() => { deadbeef.to('piglatin') }).to.throw(Amorph.errors.NoFormError)
  })

  it('should convert deadbeef to hex', () => {
    expect(deadbeef.to('hex')).to.equal('deadbeef')
  })

  it('should have path from uint8Array to hex.prefixed via hex', () => {
    const path = Amorph.paths.get('uint8Array', 'hex.prefixed')
    expect(path).to.be.instanceOf(Array)
    expect(path).to.be.deep.equal(['uint8Array', 'hex', 'hex.prefixed'])
  })

  it('should convert deadbeef to hex.prefixed', () => {
    expect(deadbeef.to('hex.prefixed')).to.equal('0xdeadbeef')
  })

  it('should not have path from uint8Array to uppercase', () => {
    const path = Amorph.paths.get('uint8Array', 'uppercase')
    expect(path).to.be.undefined
  })

  it('should throw NoPathError when converting deadbeef to lowercase', () => {
    expect(() => { deadbeef.to('uppercase') }).to.throw(Amorph.errors.NoPathError)
  })

  it('should load base58Converters', () => {
    Amorph.loadConverters(base58Converters)
  })

  it('should not be ready', () => {
    expect(Amorph.isReady).to.be.false
  })

  it('should ready', () => {
    Amorph.ready()
    expect(Amorph.isReady).to.be.true
  })

  it('should convert deadbeef to base58', () => {
    expect(deadbeef.to('base58')).to.equal('6h8cQN')
  })

  it('should have path from hex.prefixed to base58', () => {
    expect(Amorph.paths.get('hex.prefixed', 'base58')).to.be.instanceOf(Array)
    expect(Amorph.paths.get('hex.prefixed', 'base58')).to.deep.equal(['hex.prefixed', 'hex', 'uint8Array', 'base58'])
  })

  it('should convert hex.prefixed to base58', () => {
    expect(new Amorph('0xdeadbeef', 'hex.prefixed').to('base58')).to.equal('6h8cQN')
  })

  describe('.equals', () => {

    it('should load bignumberConverters', () => {
      Amorph.loadConverters(bignumberConverters)
      Amorph.ready()
    })

    it('amorph(10, number) should equal amorph(10, number)', () => {
      const amorph1 = new Amorph(10, 'number')
      const amorph2 = new Amorph(10, 'number')
      expect(amorph1.equals(amorph2)).to.equal(true)
    })

    it('amorph(10, number) should NOT equal amorph(20, number)', () => {
      const amorph1 = new Amorph(10, 'number')
      const amorph2 = new Amorph(20, 'number')
      expect(amorph1.equals(amorph2)).to.equal(false)
    })

    it('amorph(10, number) should equal amorph(a, hex)', () => {
      const amorph1 = new Amorph(10, 'number')
      const amorph2 = new Amorph('a', 'hex')
      expect(amorph1.equals(amorph2)).to.equal(true)
    })

    it('amorph(0a, hex) should equal amorph(10, number)', () => {
      const amorph1 = new Amorph('0a', 'hex')
      const amorph2 = new Amorph(10, 'number')
      expect(amorph1.equals(amorph2)).to.equal(true)
    })

    it('amorph(10, number) should equal(bignumber) amorph(a, hex)', () => {
      const amorph1 = new Amorph(10, 'number')
      const amorph2 = new Amorph('a', 'hex')
      expect(amorph1.equals(amorph2), 'bignumber').to.equal(true)
    })

    it('amorph(10, number) should NOT equal(hex) amorph(a, hex)', () => {
      const amorph1 = new Amorph(10, 'number')
      const amorph2 = new Amorph('a', 'hex')
      expect(amorph1.equals(amorph2, 'hex')).to.equal(true)
    })

    it('amorph(11, number) should NOT equal amorph(a, hex)', () => {
      const amorph1 = new Amorph(11, 'number')
      const amorph2 = new Amorph('a', 'hex')
    })

  })

  describe('readme examples', () => {

    it('should work', () => {

      Amorph.loadConverter('string', 'uppercase', (string) => { return string.toUpperCase() })
      Amorph.loadConverter('uppercase', 'exclamation', (uppercase) => { return uppercase + '!' })
      Amorph.ready()

      new Amorph('hello world', 'string').to('exclamation')
      // >> HELLO WORLD!

      Amorph.loadConverters(require('amorph-hex'))
      Amorph.loadConverters(require('amorph-base58'))
      Amorph.ready()

      const deadbeef2 = new Amorph('deadbeef', 'hex')
      expect(deadbeef2.to('hex.prefixed')).to.equal('0xdeadbeef')
      expect(deadbeef2.to('uint8Array')).to.deep.equal(new Uint8Array([222, 173, 190, 239]))
      expect(deadbeef2.to('base58')).to.equal('6h8cQN')
    })

  })

})
