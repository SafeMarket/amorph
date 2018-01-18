/* globals describe, it */

const Amorph = require('./')
const AmorphConverter = require('amorph-converter')
const chai = require('chai')
const intcoder = require('intcoder')
const amorphHex = require('amorph-hex')

chai.should()

describe('Amorph', () => {

  let amorphInt
  let amorph

  it('should create amorph', () => {
    amorph = new Amorph(new Uint8Array([1, 1]))
  })

  it('should create amorphInt', () => {
    amorphInt = new AmorphConverter((uint8Array) => {
      return intcoder.decode(uint8Array)
    }, (int) => {
      return intcoder.encode(int)
    })
  })

  it('should amorph.to', () => {
    amorph.to(amorphInt).should.equal(257)
  })

  it('should amorph.from', () => {
    Amorph.from(amorphInt, 257).uint8Array.should.deep.equal(new Uint8Array([1, 1]))
  })

  it('should .equals', () => {
    amorph.equals(new Amorph(new Uint8Array([1, 1]))).should.equal(true)
  })

  it('should .as (-1)', () => {
    amorph.as(amorphInt, (int) => {
      return int - 1
    }).uint8Array.should.deep.equal(new Uint8Array([1, 0]))
  })

  it('should .as (-2)', () => {
    amorph.as(amorphInt, (int) => {
      return int - 2
    }).uint8Array.should.deep.equal(new Uint8Array([255]))
  })

  describe('amorph-hex', () => {
    it('should would work', () => {
      Amorph.from(amorphHex.unprefixed, '0101').as(amorphInt, (int) => {
        return int - 2
      }).to(amorphHex.prefixed).should.equal('0xff')
    })
  })

})
