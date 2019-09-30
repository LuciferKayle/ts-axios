const JasmineCore = require('jasmine-core')
require('jasmine-ajax')

let getAjaxRequest = JasmineCore.Ajax.requests.mostRecent()

export default getAjaxRequest
