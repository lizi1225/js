export default {
    namespaced: true,
    state: {
        a: 100,
    },
    mutations: {
        updateA(state, payload) {
            state.a += payload
        }
    },
    getters: {
        b(state) {
            return state.a + 1
        }
    },
    modules: {
        C: {
            namespaced: true,
            state: {
                a: 300,
            }
        }
    }
}