const createTestableErrorClass = require('testable-error')

module.exports = {
  NotNobjectError: createTestableErrorClass('NotNobjectError', '%s should be instance of npmjs.com/package/nobject'),
  NoPathError: createTestableErrorClass('NoPathError', 'No path from "%s" to "%s"'),
  NoFormError: createTestableErrorClass('NoFormError', 'No form "%s"'),
  NotReadyError: createTestableErrorClass('NotReadyError', 'Amorph is not ready, Call Amorph.ready() after loading new converters'),
  FormNotStringError: createTestableErrorClass('FormNotStringError', 'Amorph expects form argument as string')
}