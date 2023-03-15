type Method = 'get' | 'GET' | 'post' | 'POST' | 'delete' | 'DELETE' | 'put' | 'PUT' | 'options' | 'OPTIONS'

export interface AxiosRequestConfig {
    url: string,
    method?: Method,
    params?: any,
    data?: Record<string, any>;
    headers?: Record<string, any>;
    timeout?: number;
}

export interface AxiosInstance {
    <T = any>(config: AxiosRequestConfig): Promise<T>;
}

export interface AxiosResponse<T = any> {
    data: T,
    status: number,
    statusText: string,
    headers: any,
    config: AxiosRequestConfig,
    request?: XMLHttpRequest
}