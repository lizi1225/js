import { AxiosRequestConfig, AxiosResponse } from './types'
import qs from 'qs'
import parse from 'parse-headers'
import InterceptorManager, { Interceptor } from './AxiosInterceptorManager'

interface Interceptors {
    // request: 
}

class Axios {
    public interceptors = {
        request: new InterceptorManager<AxiosRequestConfig>(),
        response: new InterceptorManager<AxiosResponse>()
    }
    constructor() {
        // this.defaults = instanceConfig;
    }
    static create() {
        return new Axios()
    }
    request<T>(config: AxiosRequestConfig): Promise<AxiosRequestConfig | AxiosResponse<T>> {
        const chain: Interceptor[] = [{
            onFulfilled: this.dispatchRequest,
            onRejected: null
        }]
        this.interceptors.request.interceptors.forEach((interceptor: Interceptor<AxiosRequestConfig> | null) => {
            interceptor && chain.unshift(interceptor)
        })

        this.interceptors.response.interceptors.forEach((interceptor: Interceptor<AxiosResponse<T>> | null) => {
            interceptor && chain.push(interceptor)
        })
        let promise: Promise<AxiosRequestConfig | AxiosResponse<T>> = Promise.resolve(config);

        while (chain.length) {
            const { onFulfilled, onRejected } = chain.shift()!;
            promise = promise.then(onFulfilled, onRejected);
        }
        return promise
    }
    dispatchRequest(config: AxiosRequestConfig): Promise<AxiosResponse> {
        return new Promise((resolve, reject) => {
            let { url, method = 'get', params, headers, data, timeout } = config
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
            if (headers) {
                for(let key in headers) {
                    request.setRequestHeader(key, headers[key])
                }
            }
            let body: string | null = null
            if (data && typeof data === 'object') {
                body = JSON.stringify(body)
            }
            if (timeout) {
                request.timeout = timeout
                request.ontimeout = () => {
                    reject(new Error(`timeout of ${timeout}ms exceeded`))
                }
            }
            request.send(body)

        })
    }
}


export default Axios