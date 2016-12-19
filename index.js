const Nobject = require('nobject')
const CrossConverter = require('cross-converter')
const FormNotStringError = require('./errors/FormNotString')
const NoFormError = require('./errors/NoForm')
const NotNobjectError = require('./errors/NotNobject')
const NotReadyError = require('./errors/NotReady')

const formsObj = {}
const converters = new Nobject()

function Amorph(truth, form) {

  if (typeof form !== 'string') {
    throw new FormNotStringError()
  }

  if (formsObj[form] !== true) {
    throw new NoFormError(form)
  }

  this.truth = truth
  this.form = form
}

Amorph.converters = converters
Amorph.isReady = true

Amorph.prototype.toString = function toString() {
  return `[Amorph ${this.form} : ${this.truth}]`
}

Amorph.loadConverters = function loadConverters(convertersNobject) {

  if (!(convertersNobject instanceof Nobject)) {
    throw new NotNobjectError('converters')
  }

  convertersNobject.forEach((args, converter) => {
    const from = args[0]
    const to = args[1]
    Amorph.loadConverter(from, to, converter)
  })

}

Amorph.loadConverter = function loadConverter(from, to, converter) {
  converters.set(from, to, converter)
  formsObj[from] = formsObj[to] = true
  Amorph.isReady = false
}

Amorph.ready = function ready() {
  Amorph.crossConverter = new CrossConverter(this.converters)
  Amorph.isReady = true
}

Amorph.prototype.to = function to(form) {

  if (!Amorph.isReady) {
    throw new NotReadyError()
  }

  return Amorph.crossConverter.convert(this.truth, this.form, form)
}

Amorph.prototype.equals = function equals(amorph, form) {

  if (form) {
    return this.to(form) === amorph.to(form)
  }

  return (
    this.to(this.form) === amorph.to(this.form)
  ) || (
    this.to(amorph.form) === amorph.to(amorph.form)
  )
}

module.exports = Amorph
