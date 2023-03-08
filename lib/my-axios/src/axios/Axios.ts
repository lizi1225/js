import { AxiosRequestConfig, AxiosResponse } from './types'
import qs from 'qs'
import parse from 'parse-headers'

class Axios {
    constructor() {
        // this.defaults = instanceConfig;
    }
    static create() {
        return new Axios()
    }
    request<T>(config: AxiosRequestConfig): Promise<AxiosResponse> {
        return this.dispatchRequest(config)
    }
    dispatchRequest(config: AxiosRequestConfig): Promise<AxiosResponse> {
        return new Promise((resolve, reject) => {
            let { url, method = 'get', params } = config
            if (params) {
                let paramsString = qs.stringify(params)
                url += ((url.indexOf('?') === -1 ? '?' : '&') + paramsString)
            }
            const request: XMLHttpRequest = new XMLHttpRequest()
            request.responseType = 'json'
            request.open(method, url, true)
            request.onreadystatechange = function () {
                if (request.readyState === 4) {
                    if (request.status >= 200 && request.status < 300) {
                        let response: AxiosResponse = {
                            data: request.response,
                            status: request.status,
                            statusText: request.statusText,
                            headers: parse(request.getAllResponseHeaders()),
                            config: config,
                            request
                        }
                        resolve(response);
                    } else {
                        reject('请求失败')
                    }
                }
            }
            request.send()

        })
    }
}


export default Axios