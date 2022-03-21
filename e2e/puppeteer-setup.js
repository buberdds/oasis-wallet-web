const puppeteer = require('puppeteer')

async function bootstrap(options = {}) {
  const { devtools = false, appUrl } = options
  const browser = await puppeteer.launch({
    headless: false,
    devtools,
    args: ['--disable-extensions-except=./build-ext', '--load-extension=./build-ext'],
  })

  const appPage = await browser.newPage()
  await appPage.goto(appUrl, { waitUntil: 'load' })

  const targets = await browser.targets()
  const extensionTarget = targets.find(({ _targetInfo }) => {
    return _targetInfo.title === '__MSG_appName__' && _targetInfo.type === 'background_page'
  })
  const partialExtensionUrl = extensionTarget._targetInfo.url || ''
  const [, , extensionId] = partialExtensionUrl.split('/')
  const extPage = await browser.newPage()
  const extensionUrl = `chrome-extension://${extensionId}/popup.html`
  await extPage.goto(extensionUrl, { waitUntil: 'load' })

  return {
    appPage,
    browser,
    extensionUrl,
    extPage,
  }
}

module.exports = { bootstrap }
