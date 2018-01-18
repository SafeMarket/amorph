/* globals describe, it */

const Amorph = require('./')
const AmorphConverter = require('./lib/AmorphConverter')
const chai = require('chai')
const intcoder = require('intcoder')

chai.should()

describe('Amorph', () => {

  let intConverter
  let amorph

  it('should create amorph', () => {
    amorph = new Amorph(new Uint8Array([1, 1]))
  })

  it('should create hex converter', () => {
    intConverter = new AmorphConverter((uint8Array) => {
      return intcoder.decode(uint8Array)
    }, (int) => {
      return intcoder.encode(int)
    })
  })

  it('should amorph.to', () => {
    amorph.to(intConverter).should.equal(257)
  })

  it('should amorph.from', () => {
    Amorph.from(intConverter, 257).uint8Array.should.deep.equal(new Uint8Array([1, 1]))
  })

  it('should .equals', () => {
    amorph.equals(new Amorph(new Uint8Array([1, 1]))).should.equal(true)
  })

  it('should .as (-1)', () => {
    amorph.as(intConverter, (int) => {
      return int - 1
    }).uint8Array.should.deep.equal(new Uint8Array([1, 0]))
  })

  it('should .as (-2)', () => {
    amorph.as(intConverter, (int) => {
      return int - 2
    }).uint8Array.should.deep.equal(new Uint8Array([255]))
  })

})
