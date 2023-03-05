import axios, {isCancel, AxiosError, AxiosRequestConfig} from 'axios';

const BASE_URL: string = 'http://localhost:3000';

export function get(params: any) {
    return axios({
        method: 'get',
        url: BASE_URL,
        params,
    })
}