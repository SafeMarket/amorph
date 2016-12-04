const _ = require('lodash')
const combinatrics = require('js-combinatorics')
const Nobject = require('nobject')

const errors = require('./errors')
const forms = []
const formsObj = {}
const converters = new Nobject
const paths = new Nobject


function Amorph(truth, form){

  if (!_.isString(form)) {
    throw new errors.FormNotStringError
  }

  if (!formsObj[form]) {
    throw new errors.NoFormError(form)
  }

  this.truth = truth
  this.form = form
}

Amorph.errors = errors
Amorph.forms = forms
Amorph.converters = converters
Amorph.paths = paths
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
  if (formsObj[from] !== true) {
    forms.push(from)
    formsObj[from] = true
  }

  if (formsObj[to] !== true) {
    forms.push(to)
    formsObj[to] = true
  }

  converters.set(from, to, converter)
  paths.set(from, to, [from, to])

  Amorph.isReady = false
}

Amorph.ready = function () {

  const formPairs = []

  combinatrics.combination(forms, 2).forEach((pair) => {
    formPairs.push(pair)
    formPairs.push(pair.slice(0).reverse())
  })

  updatePaths(formPairs)

  Amorph.isReady = true
}

Amorph.prototype.to = function to(form) {

  if (form === this.form) {
    return this.truth
  }

  if (!Amorph.isReady) {
    throw new errors.NotReadyError
  }

  if (formsObj[form] !== true) {
    throw new errors.NoFormError(form)
  }

  const converter = converters.get(this.form, form)
  if (converter) {
    return converter(this.truth)
  }

  const path = paths.get(this.form, form)
  if (_.isUndefined(path)) {
    throw new errors.NoPathError(this.form, form)
  }

  let currentForm = this.form
  let currentTruth = this.truth

  path.forEach((step, index) => {
    if (index === 0) {
      return
    }
    currentTruth = converters.get(currentForm, step)(currentTruth)
    currentForm = step
  })

  return currentTruth
}

function determinePathValidity(formPair, path) {

  let isValid = true

  _.forEach(path, (step, index) => {
    if (index === 0) {
      return true
    }
    if (!converters.get(path[index-1], step)) {
      isValid = false
      return false
    }
  })

  return isValid
}

function updatePaths(formPairs) {

  let updateCount = 0
  const formPairsUnpathed = []

  formPairs.forEach((formPair) => {

    const from = formPair[0]
    const to = formPair[1]

    let path = paths.get(formPair)

    if (path && path.length === 2) {
      return
    }

    paths.forEach((_formPair, _path) => {

      const _from = _formPair[0]
      const _to = _formPair[1]

      let pathBetweenFroms
      let pathBetweenTos

      if (from === _to || _from === to) {
        return
      }

      if (from === _from) {
        pathBetweenFroms = [from]
      } else {
        pathBetweenFroms = paths.get(from, _from)
      }

      if (!pathBetweenFroms) {
        return
      }

      if (to === _to) {
        pathBetweenTos = [to]
      } else {
        pathBetweenTos = paths.get(_to, to)
      }

      if (!pathBetweenTos) {
        return
      }

      let lastStep
      const potentialPath = pathBetweenFroms.concat(_path).concat(pathBetweenTos).filter((step) => {
        if (step === lastStep) {
          return false
        }
        lastStep = step
        return true
      })

      if(!path || potentialPath.length < path.length){
        updateCount ++
        paths.set(formPair, potentialPath)
        path = potentialPath
      }

    })

    if (!paths.get(formPair)) {
      formPairsUnpathed.push(formPair)
    }

  })

  if (updateCount > 0) {
    updatePaths(formPairsUnpathed)
  }

}

module.exports = Amorph

