import browser from 'webextension-polyfill'

export const openTab = (url: string) => {
  browser.windows.create({
    url,
    type: 'popup',
    width: 500,
    height: 650,
  })
}
