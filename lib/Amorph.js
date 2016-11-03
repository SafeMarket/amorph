const _ = require('lodash')
const combinatrics = require('js-combinatorics')
const Nobject = require('nobject')

const errors = require('./errors')
const forms = []
const converters = new Nobject
const paths = new Nobject


function Amorph(truth, form){
  this.truth = truth
  this.form = form
}

Amorph.errors = errors
Amorph.forms = forms
Amorph.converters = converters
Amorph.paths = paths
Amorph.isReady = true

Amorph.updatePath = 


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
  if (forms.indexOf(from) === -1) {
    forms.push(from)
  }

  if (forms.indexOf(to) === -1) {
    forms.push(to)
  }

  converters.set(from, to, converter)

  Amorph.isReady = false
}

Amorph.ready = function () {

  const formPairs = []

  combinatrics.combination(forms, 2).forEach((pair) => {
    formPairs.push(pair)
    formPairs.push(pair.slice(0).reverse())
  })
  const pathCandidates = new Nobject

  formPairs.forEach((formPair) => {
    pathCandidates.set(formPair, [])
  })
  const pcs = combinatrics.permutationCombination(forms)

  pcs.forEach((permutationCombination) => {
    if(permutationCombination.length < 3) {
      return true
    }

    const from = permutationCombination.shift()
    const to = permutationCombination.pop()
    pathCandidates.get(from, to).push(permutationCombination)

  })

  formPairs.forEach((formPair) => {
    updatePath(formPair, pathCandidates.get(formPair))
  })

  Amorph.isReady = true
}

Amorph.prototype.to = function to(form) {

  if (!Amorph.isReady) {
    throw new errors.NotReadyError
  }

  if (forms.indexOf(form) === -1) {
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

  path.forEach((step) => {
    currentTruth = converters.get(currentForm, step)(currentTruth)
    currentForm = step
  })

  return converters.get(currentForm, form)(currentTruth)
}

function determinePathValidity(formPair, path) {

  let isValid = true
  const augmentedPath = augmentPath(path, formPair)

  _.forEach(augmentedPath, (step, index) => {
    if (index === 0) {
      return true
    }
    if (!converters.get(augmentedPath[index-1], step)) {
      isValid = false
      return false
    }
  })

  return isValid
}

function updatePath(formPair, pathCandidates) {
    
  if (_.isFunction(converters.get(formPair))) {
    //direct converter already exists. no path necessary
    paths.set(formPair, undefined)
    return true
  }

  const path = paths.get(formPair)

  if (path && path.length === 1) {
    //path of length 1 is the shortest possible path
    return true
  }

  _.forEach(pathCandidates, (pathCandidate) => {

    if (path && pathCandidate.length > path.length) {
      return false
    }

    if (determinePathValidity(formPair, pathCandidate)) {
      paths.set(formPair, pathCandidate)
      return false
    }

  })

}

function augmentPath(path, formPair) {
  const augmentedPath = path.slice(0)
  augmentedPath.unshift(formPair[0])
  augmentedPath.push(formPair[1])
  return augmentedPath
}

module.exports = Amorph

