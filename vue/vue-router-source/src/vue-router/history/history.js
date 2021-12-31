import Base from "./base";

export default class BrowserHistory extends Base{
    constructor(router) {
        super(router)
    }
    getCurrentLocation() {
        return window.location.pathname
    }
    updateLocation(location) {
        history.pushState({}, null, location)
    }
    setupListener() {
        window.addEventListener('popstate', () => {
            this.transitionTo(this.getCurrentLocation())
        })
    }
}