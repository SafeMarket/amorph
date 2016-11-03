const errors = require('../lib/errors')
const expect = require('chai').expect

describe('errors', () => {

  it('should be a hash of Errors', () => {
    expect(errors).to.be.an.object
    Object.keys(errors).forEach((_Error) => {
      expect(new Error).to.be.instanceOf(Error)
    })
  })

})