/** *
 *  localStorage
 */

import {Base64} from 'js-base64'

export const getterLsState = () => {
  return JSON.parse(Base64.decode(localStorage.getItem('store') || ''))
}

export const setterLsState = (store:any) => {
  localStorage.setItem(
    "store",
    Base64.encode(JSON.stringify(store.state))
  )
}

