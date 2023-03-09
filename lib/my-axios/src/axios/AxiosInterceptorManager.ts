export interface OnFulfilledFn<T> {
    (value: T): T | Promise<T>
}

export interface OnRejectedFn {
    (err: any): any
}

export interface Interceptor<T = any> {
    onFulfilled: OnFulfilledFn<T>;
    onRejected: OnRejectedFn | null;
}

export default class InterceptorManager<T> {
    public interceptors: Array<Interceptor<T> | null> = []
    use(onFulfilled: OnFulfilledFn<T>, onRejected: OnRejectedFn): number {
        this.interceptors.push({
            onFulfilled,
            onRejected,
        })
        return this.interceptors.length - 1
    }
    eject(id: number): void {
        if (this.interceptors[id]) {
            this.interceptors[id] = null
        }
    }
}