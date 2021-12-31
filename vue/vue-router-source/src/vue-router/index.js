import install from './install'
import { creatMatcher } from './creat-matcher'
import HashHistory from './history/hash'
import BrowserHistory from './history/history'

class VueRouter {
    constructor(options = {}) {
        console.log(options)

        this.matcher = creatMatcher(options.routes || [])
        
        if (options.mode === 'hash') {
            this.history = new HashHistory(this)
        } else {
            this.history = new BrowserHistory(this)
        }
        
    }
    match(location) {
        return this.matcher.match(location)
    }
    push(location) {
        this.history.transitionTo(location, () => {
            this.history.updateLocation(location)
        })
    }
    init(app) {
        const history = this.history

        history.listen((route) => {
            app._route = route
        })
        const setupListenerHandler = () => {
            history.setupListener()
        }
        history.transitionTo(history.getCurrentLocation(), setupListenerHandler)
    }
    addRoutes(routes) {
        this.matcher.addRoutes(routes)
    }
}

VueRouter.install = install

export default VueRouter