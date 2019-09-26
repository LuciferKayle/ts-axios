import { AxiosRequestConfig, AxiosResponse, AxiosPromise } from './types'
import { parseHeaders, processHeaders } from './helpers/header'
import { createError } from './helpers/error'
import { isURLSameOrigin } from './helpers/url'
import cookie from './helpers/cookie'
import { isFormData } from './helpers/util'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method = 'get',
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onUploadProgress,
      onDownloadProgress,
      auth,
      validateStatus
    } = config

    const request = new XMLHttpRequest()

    request.open(method.toUpperCase(), url!, true)

    configureRequest() // 配置请求参数

    addEvents()

    processHeaders()

    processCancel()

    request.send(data)

    // 工具函数，处理请求
    function configureRequest(): void {
      if (responseType) {
        request.responseType = responseType
      }

      if (timeout) {
        request.timeout = timeout
      }
      // 安全校验（同源策略限制）
      if (withCredentials) {
        request.withCredentials = withCredentials
      }
    }

    // 添加时间请求回调
    function addEvents(): void {
      request.onreadystatechange = function handleLoad() {
        if (request.readyState !== 4) {
          return
        }

        if (request.status === 0) {
          return
        }

        const responseHeaders = parseHeaders(request.getAllResponseHeaders())

        const responseData =
          responseType && responseType !== 'text' ? request.response : request.responseText

        const response: AxiosResponse = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        }

        handleResponse(response)
      }

      request.onerror = function handleError() {
        reject(createError('Network Error', config, null, request))
      }

      request.ontimeout = function handleTimeout() {
        reject(createError(`Timeout of ${timeout} ms exceeded`, config, null, request))
      }

      // 上传下载进度查看
      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }

      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
    }

    // 处理请求头
    function processHeaders(): void {
      // 同源策略校验
      if (withCredentials || (isURLSameOrigin(url!) && xsrfCookieName)) {
        const xsrfValue = cookie.read(xsrfCookieName!)
        if (xsrfValue) {
          headers[xsrfHeaderName!] = xsrfValue
        }
      }

      // 判断是否请求的数据类型是是否是formData
      if (isFormData(data)) {
        delete headers['Content-Type']
      }

      Object.keys(headers).forEach(name => {
        if (data === null && name.toLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          request.setRequestHeader(name, headers[name])
        }
      })

      // 用户校验
      if (auth) {
        headers['Authorization'] = 'Basic' + btoa(auth.username + ':' + auth.password)
      }
    }

    // 处理取消请求的逻辑
    function processCancel(): void {
      // 取消的逻辑
      if (cancelToken) {
        cancelToken.promise
          .then(reason => {
            request.abort()
            reject(reason)
          })
          .catch()
      }
    }

    // 处理响应status异常
    function handleResponse(response: AxiosResponse) {
      if (!validateStatus || validateStatus(response.status)) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.statusText}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
  })
}
