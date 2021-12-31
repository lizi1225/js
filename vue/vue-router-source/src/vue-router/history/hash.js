import Base from "./base";

function ensureSlash() {
    if (window.location.hash) return
    window.location.hash = '/'
}
export default class HashHistory extends Base {
    constructor(router) {
        super(router)

        // 确保有hash
        ensureSlash()
    }
    getCurrentLocation() {
        return window.location.hash.slice(1)
    }
    setupListener() {
        window.addEventListener('hashchange', () => {
            this.transitionTo(this.getCurrentLocation())
        })
    }
    updateLocation(location) {
        window.location.hash = location
    }
}