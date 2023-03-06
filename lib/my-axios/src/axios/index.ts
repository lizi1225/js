interface RequestParams {
    url: string;
    method: 'get' | 'post' | 'delete' | 'put' | 'options'
}

class Axios {
    constructor() {
        const defaultOptions:any = {
            baseURL: '',
            timeout: 100,
            headers: {}
        }
        this.default = defaultOptions;
    }
    static create() {
        return new Axios()
    }
    get() {

    }
    post() {

    }
    request(params: RequestParams) {
        const {
            url,
            method
        } = params;
        const xhr = new XMLHttpRequest()
        xhr.open(method.toUpperCase(), url, false)
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                const res = xhr.responseText
            }
        }
        xhr.send()
    }
}


export default new Axios()