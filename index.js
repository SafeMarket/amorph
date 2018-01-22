const defunction = require('defunction')
const getValidateInstanceOf = require('defunction/lib/validates/getInstanceOf')
const getValidateTypeOf = require('defunction/lib/validates/getTypeOf')
const getValidateConstructorNamed = require('defunction/lib/validates/getConstructorNamed')
const validateAnything = require('defunction/lib/validates/anything')

const validateUint8Array = getValidateInstanceOf(Uint8Array)
const validateFunction = getValidateInstanceOf(Function)
const validateAmorph = getValidateConstructorNamed('Amorph')
const validateAmorphConverter = getValidateConstructorNamed('AmorphConverter')
const validateUndefined = getValidateTypeOf('undefined')
const validateString = getValidateTypeOf('string')
const validateBoolean = getValidateTypeOf('boolean')

const Amorph = module.exports = defunction([validateUint8Array], validateUndefined, function Amorph(uint8Array) {
  this.uint8Array = uint8Array
})

Amorph.prototype.toString = defunction([], validateString, function toString() {
  return `[Amorph uint8Array : [${this.uint8Array}]]`
})

Amorph.prototype.clone = defunction([], validateAmorph, function clone() {
  return new Amorph(this.uint8Array.slice())
})

Amorph.prototype.to = defunction([validateAmorphConverter], validateAnything, function to(converter) {
  return converter.to(this.uint8Array)
})

Amorph.prototype.equals = defunction([validateAmorph], validateBoolean, function equals(amorph) {
  if (amorph.uint8Array.length !== this.uint8Array.length) {
    return false
  }
  for (let i = 0; i < amorph.uint8Array.length; i += 1) {
    if (amorph.uint8Array[i] !== this.uint8Array[i]) {
      return false
    }
  }
  return true
})

// eslint-disable-next-line prefer-arrow-callback
Amorph.from = defunction([validateAmorphConverter, validateAnything], validateAmorph, function from(converter, value) {
  return new Amorph(converter.from(value))
})

Amorph.prototype.as = defunction([validateAmorphConverter, validateFunction], validateAmorph, function as(converter, func) {
  return Amorph.from(converter, func(this.to(converter)))
})

module.exports = Amorph
