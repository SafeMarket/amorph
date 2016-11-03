const createTestableErrorClass = require('testable-error')

module.exports = {
  NotNobjectError: createTestableErrorClass('NotNobjectError', '%s should be instance of npmjs.com/package/nobject'),
  NoPathError: createTestableErrorClass('NoPathError', 'No path from "%s" to "%s"'),
  NoFormError: createTestableErrorClass('NoFormError', 'No form "%s"'),
  NotReadyError: createTestableErrorClass('NotReadyError', 'Thingy is not ready, Call Thingy.ready() after loading new converters')
}