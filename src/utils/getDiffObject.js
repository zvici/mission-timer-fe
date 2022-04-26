/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable operator-linebreak */
import { transform, isEqual, isArray, isObject } from 'lodash'

function getDiffObject(originObj, newObj) {
  function changes(newObj, originObj) {
    let arrayIndexCounter = 0

    return transform(newObj, (result, value, key) => {
      if (!isEqual(value, originObj[key])) {
        const resultKey = isArray(originObj) ? arrayIndexCounter++ : key
        result[resultKey] =
          isObject(value) && isObject(originObj[key])
            ? changes(value, originObj[key])
            : value
      }
    })
  }

  return changes(newObj, originObj)
}

export default getDiffObject
