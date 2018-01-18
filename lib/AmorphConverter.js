const defunction = require('defunction')

const AmorphConverter = module.exports = defunction(['Function', 'Function'], '*', function AmorphConverter(to, from) {
  this.to = to
  this.from = from
})
