import browser from 'webextension-polyfill'

export const openTab = (url: string) => {
  browser.windows.create({
    url,
    type: 'normal',
    width: 500,
    height: 600,
  })
}
