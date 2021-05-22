const NormalModule = require('./NormalModule')


module.exports = class NormalModuleFactory {
    create(data) {
        return new NormalModule(data)
    }
}