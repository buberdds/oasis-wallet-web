const { bootstrap } = require('./puppeteer-setup')

describe('test popup', () => {
  let extPage, browser

  beforeAll(async () => {
    const context = await bootstrap({ appUrl: 'http://localhost:1234' })

    extPage = context.extPage
    browser = context.browser
  })

  it('should render anchor with label', async () => {
    await extPage.bringToFront()
    const link = await extPage.$('a')
    const label = await link.evaluate(e => e.innerText)
    expect(label).toEqual(expect.stringContaining('Open in new tab'))
  })

  afterAll(async () => {
    await browser.close()
  })
})
