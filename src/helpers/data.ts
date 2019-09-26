import { isPlainObject } from './util'

export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

export function transformResponse(data: any): any {
  if (typeof data === 'string') {
    console.log(typeof data)
    try {
      data = JSON.parse(data)
    } catch (err) {
      console.log(err)
    }
  }

  return data
}
