/* eslint-disable @typescript-eslint/no-var-requires */
// react-testing-library renders your components to document.body,
// this adds jest-dom's custom assertions
import '@testing-library/jest-dom/extend-expect'

import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import 'portable-fetch'

import 'jest-styled-components'

// Init i18n for the tests needing it
import 'locales/i18n'

require('dotenv').config()
process.env.REACT_APP_LOCALNET = '1'

global.TextEncoder = require('util').TextEncoder
global.TextDecoder = require('util').TextDecoder
window.TextDecoder = global.TextDecoder
window.TextEncoder = global.TextEncoder

global.fetch = require('portable-fetch')
window.fetch = require('portable-fetch')

global.window.scrollTo = () => {}

const xhrMock: Partial<XMLHttpRequest> = {
  abort: jest.fn(),
  open: jest.fn(),
  send: jest.fn(),
  setRequestHeader: jest.fn(),
  readyState: 4,
  status: 200,
  response: '',
}

beforeEach(() => {
  jest.spyOn(window, 'XMLHttpRequest').mockImplementation(() => xhrMock as XMLHttpRequest)
})
