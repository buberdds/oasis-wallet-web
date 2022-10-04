import { wrapStore } from 'webext-redux'
import { configureAppStore } from 'store/configureStore'

const store = configureAppStore()

function dateReplacer(key, value) {
  console.log(key, value)
  console.log(typeof this[key])
  return value
  // return this[key] instanceof Date ? { _RECOVER_DATE: this[key].join('-') } : value
}

// function dateReviver(key, value) {
//   return value
//   // return value && value['_RECOVER_DATE'] ? new Date(value['_RECOVER_DATE']) : value
// }

wrapStore(store)
// {
// serializer: payload => JSON.stringify(payload, dateReplacer),
// deserializer: payload => JSON.parse(payload, dateReviver),
// }
