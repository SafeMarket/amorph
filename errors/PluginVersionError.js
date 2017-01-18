const createTestableErrorClass = require('testable-error')

module.exports = createTestableErrorClass('PluginVersionError', 'Cannot handle plugin with pluginVersion [%s %s]')
