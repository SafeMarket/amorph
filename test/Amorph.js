const Amorph = require('../')
const hexConverters = require('amorph-hex')
const base58Converters = require('amorph-base58')
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

  it('should not be ready', () => {
    expect(Amorph.isReady).to.be.false
  })

  it('should create hellowolrd Amorph', () => {
    const lowercase = 'hello world!'
    helloworld = new Amorph('hello world!', 'lowercase')
    expect(helloworld).to.be.instanceOf(Amorph)
    expect(helloworld.form).to.equal('lowercase')
    expect(helloworld.truth).to.equal(lowercase)
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

  it('should throw NoFormError when trying to convert to piglatin', () => {
    expect(() => { deadbeef.to('piglatin') }).to.throw(Amorph.errors.NoFormError)
  })

  it('should convert deadbeef to hex', () => {
    expect(deadbeef.to('hex')).to.equal('deadbeef')
  })

  it('should have path from uint8Array to hex.prefixed via hex', () => {
    const path = Amorph.paths.get('uint8Array', 'hex.prefixed')
    expect(path).to.be.instanceOf(Array)
    expect(path).to.be.deep.equal(['hex'])
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

})