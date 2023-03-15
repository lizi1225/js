import Axios from "./Axios";
import { AxiosRequestConfig, AxiosInstance } from './types'

function createInstance(): AxiosInstance {
    const context: Axios = new Axios()

    const instance = Axios.prototype.request.bind(context)
    Object.assign(instance, Axios.prototype, context);
    return instance as AxiosInstance;
}

const axios = createInstance()

export default axios
export * from './types'