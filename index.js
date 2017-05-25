const Nobject = require('nobject')
const CrossConverter = require('cross-converter')
const PluginVersionError = require('./errors/PluginVersionError')
const arguguard = require('arguguard')
const Validator = require('arguguard/lib/Validator')

const converters = new Nobject()

const optionsValidator = new Validator('OptionsValidator', (arg) => {
  if (arg === undefined) {
    return
  }
  if (arg instanceof Object) {
    return
  }
  throw new Error('Should be either undefind or instance of Object')
})

const optionalStringValidator = new Validator('OptionalStringValidator', (arg) => {
  if (arg === undefined) {
    return
  }
  if (typeof arg === 'string') {
    return
  }
  throw new Error('Should be either undefind or a string')
})


function Amorph(truth, form) {
  arguguard('Amorph', ['*', 'string'], arguments)

  this.truth = truth
  this.form = form
  this.toCache = {}
  this.asCache = {}
}

Amorph.equivalenceTests = {}
Amorph.crossConverter = new CrossConverter()

Amorph.prototype.toString = function toString() {
  arguguard('amorph.toString', [], arguments)
  return `[Amorph ${this.form} : ${this.truth}]`
}

Amorph.prototype.clone = function clone() {
  return new Amorph(this.truth, this.form)
}

Amorph.loadPlugin = function loadPlugin(plugin) {
  arguguard('amorph.loadPlugin', [optionsValidator], arguments)
  if (plugin.pluginVersion !== 1) {
    throw new PluginVersionError(`Cannot handle plugin with pluginVersion [${typeof plugin.pluginVersion} ${plugin.pluginVersion}]`)
  }
  plugin.converters.forEach((args, converter) => {
    const from = args[0]
    const to = args[1]
    Amorph.crossConverter.addConverter(from, to, converter)
  })
  Object.keys(plugin.equivalenceTests).forEach((form) => {
    Amorph.equivalenceTests[form] = plugin.equivalenceTests[form]
  })
}

Amorph.prototype.to = function to(form) {
  arguguard('amorph.to', [optionalStringValidator], arguments)
  if (this.toCache[form]) {
    return this.toCache[form]
  }
  const thisTo = Amorph.crossConverter.convert(this.truth, this.form, form)
  this.toCache[form] = thisTo
  return thisTo
}

function equivalenceTest(form, a, b) {
  if (Amorph.equivalenceTests[form]) {
    return Amorph.equivalenceTests[form](a, b)
  }
  return a === b
}

Amorph.prototype.equals = function equals(amorph, form) {
  arguguard('amorph.equals', ['Amorph', optionalStringValidator], arguments)

  if (form) {
    return equivalenceTest(form, this.to(form), amorph.to(form))
  }

  return (
    equivalenceTest(this.form, this.to(this.form), amorph.to(this.form))
  ) || (
    equivalenceTest(amorph.form, this.to(amorph.form), amorph.to(amorph.form))
  )
}

Amorph.prototype.as = function as(form, func) {
  arguguard('amorph.equals', ['string', 'function'], arguments)
  if (this.asCache[form] !== undefined) {
    return this.asCache[form]
  }
  const thisAsForm = new Amorph(func(this.to(form)), form)
  this.asCache[form] = thisAsForm
  return thisAsForm
}

module.exports = Amorph
