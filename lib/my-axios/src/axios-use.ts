import axios, { AxiosResponse, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
const baseURL = 'http://localhost:8080';
export interface User {
    username: string;
    password: string;
}
let user: User = {
    username: 'zhangsan',
    password: '123456'
};
axios({
    method: 'get',
    url: baseURL + '/get',
    params: user
}).then((response: AxiosResponse) => {
    console.log(response);
    return response.data;
}).then((data: User) => {
    console.log(data);
}).catch(function (error: any) {
    console.log(error);
});

axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    return config
})

axios.interceptors.response.use(response => {
    return response
})