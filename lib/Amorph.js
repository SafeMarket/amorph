const _ = require('lodash')
const Nobject = require('nobject')
const CrossConverter = require('./CrossConverter')
const errors = require('./errors')

const formsObj = {}
const converters = new Nobject()

function Amorph(truth, form) {

  if (!_.isString(form)) {
    throw new errors.FormNotStringError()
  }

  if (!formsObj[form]) {
    throw new errors.NoFormError(form)
  }

  this.truth = truth
  this.form = form
}

Amorph.errors = errors
Amorph.converters = converters
Amorph.isReady = true

Amorph.prototype.toString = function toString() {
  return `[Amorph ${this.form} : ${this.truth}]`
}

Amorph.loadConverters = function loadConverters(convertersNobject) {

  if (!(convertersNobject instanceof Nobject)) {
    throw new Amorph.errors.NotNobjectError('converters')
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
    throw new errors.NotReadyError()
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
