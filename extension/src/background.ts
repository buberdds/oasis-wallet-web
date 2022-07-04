import('./backgroundImportHelper').then(({ configureAppStore, wrapStore }) => {
  const store = configureAppStore()
  wrapStore(store)
})
