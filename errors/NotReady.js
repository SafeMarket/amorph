const createTestableErrorClass = require('testable-error')

module.exports = createTestableErrorClass('Amorph:NotReadyError', 'Amorph is not ready, Call Amorph.ready() after loading new converters')
