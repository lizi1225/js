export default {
    namespaced: true,
    state: {
        a: 200,
    },
    mutations: {
        updateA(state, payload) {
            state.a += payload
        }
    },
    actions: {
        updateA({ commit }, payload) {
            setTimeout(() => {
                commit('B/updateA', payload)
            }, 1000)
        }
    }
}