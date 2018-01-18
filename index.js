const defunction = require('defunction')

const Amorph = module.exports = defunction(['Uint8Array'], '*', function Amorph(uint8Array) {
  this.uint8Array = uint8Array
})

Amorph.prototype.toString = defunction([], 'string', function toString() {
  return `[Amorph uint8Array : [${this.uint8Array}]]`
})

Amorph.prototype.clone = defunction([], 'Amorph', function clone() {
  return new Amorph(this.uint8Array.slice())
})

Amorph.prototype.to = defunction(['AmorphConverter'], '*', function to(converter) {
  return converter.to(this.uint8Array)
})

Amorph.prototype.equals = defunction(['Amorph'], 'boolean', function equals(amorph) {
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

Amorph.from = defunction(['AmorphConverter', '*'], 'Amorph', function from(converter, value) {
  return new Amorph(converter.from(value))
})

Amorph.prototype.as = defunction(['AmorphConverter', 'function'], 'Amorph', function as(converter, func) {
  return Amorph.from(converter, func(this.to(converter)))
})

module.exports = Amorph
