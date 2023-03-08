import Axios from "./Axios";
import {AxiosRequestConfig} from './types'

function createInstance() {
    const context: Axios = new Axios()

    const instance = Axios.prototype.request.bind(context)
    Object.assign(instance, Axios.prototype, context);
    return instance
}

const axios = createInstance()

export default axios
export * from './types'