import axios, { AxiosResponse, AxiosRequestConfig } from './axios';
const baseURL = 'http://localhost:3000';
export interface User {
    username: string;
    password: string;
}
let user: User = {
    username: 'zhangsan',
    password: '123456'
};
axios({
    method: 'post',
    url: baseURL + '/post',
    params: user,
    headers: {
        'content-type': 'application/json',
    },
}).then((response: AxiosResponse) => {
    console.log(response);
    return response.data;
}).then((data: User) => {
    console.log(data);
}).catch(function (error: any) {
    console.log(error);
});

// axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
//     return config
// })

// axios.interceptors.response.use(response => {
//     return response
// })