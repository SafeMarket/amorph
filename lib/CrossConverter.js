const errors = require('./errors')
const Nobject = require('nobject')
const combinatrics = require('js-combinatorics')
const _ = require('lodash')

function CrossConverter(converters) {
  this.converters = converters

  const forms = this.forms = []
  const formsObj = this.formsObj = {}
  const formPairs = this.formPairs = []
  const paths = this.paths = new Nobject()

  converters.forEach((formPair) => {
    paths.set(formPair, formPair)
    formPair.forEach((form) => {
      if (formsObj[form] === true) {
        return
      }
      formsObj[form] = true
      forms.push(form)
    })
  })

  const combinationMethod = forms.length <= 31 ? 'combination' : 'bigCombination'
  const combinations = combinatrics[combinationMethod](forms, 2)

  combinations.forEach((pair) => {
    formPairs.push(pair)
    formPairs.push(pair.slice(0).reverse())
  })

  updatePaths(formPairs, paths)

}

CrossConverter.prototype.convert = function convert(truth, formFrom, formTo) {

  if (formFrom === formTo) {
    return truth
  }

  if (this.formsObj[formTo] !== true) {
    throw new errors.NoFormError(formTo)
  }

  const converter = this.converters.get(formFrom, formTo)
  if (converter) {
    return converter(truth)
  }

  const path = this.paths.get(formFrom, formTo)
  if (_.isUndefined(path)) {
    throw new errors.NoPathError(formFrom, formTo)
  }

  let currentForm = formFrom
  let currentTruth = truth

  path.forEach((step, index) => {
    if (index === 0) {
      return
    }
    currentTruth = this.converters.get(currentForm, step)(currentTruth)
    currentForm = step
  })

  return currentTruth
}

function updatePaths(formPairs, paths) {

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

      if (!path || potentialPath.length < path.length) {
        updateCount += 1
        paths.set(formPair, potentialPath)
        path = potentialPath
      }

    })

    if (!paths.get(formPair)) {
      formPairsUnpathed.push(formPair)
    }

  })

  if (updateCount > 0) {
    updatePaths(formPairsUnpathed, paths)
  }

}

module.exports = CrossConverter
