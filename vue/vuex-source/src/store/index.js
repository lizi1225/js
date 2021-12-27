import Vue from 'vue'
import Vuex from '../vuex'
// import Vuex from 'vuex'
import A from './modules/A'
import B from './modules/B'

Vue.use(Vuex)

const persistPlugin = (store) => {
  const name = 'VUEX_PERSIST'
  const state = localStorage.getItem(name)
  if (state) {
    store.replaceState(JSON.parse(state))
  }

  store.subscribe((mutations, state) => {
    localStorage.setItem(name, JSON.stringify(state))
  })
}
const store = new Vuex.Store({
  plugins: [persistPlugin],
  state: {
    a: 123,
  },
  getters: {
    b(state) {
      console.log('exec')
      return state.a + 1
    }
  },
  mutations: {
    updateA(state, payload) {
      state.a += payload
    }
  },
  actions: {
    updateA({ commit }, payload) {
      setTimeout(() => {
        commit('updateA', payload)
      }, 1000)
    }
  },
  modules: {
    A,
    B
  }
})

// setTimeout(() => {
//   store.registerModule('E', {
//     state: {
//       a: 300,
//     },
//     getters: {
//       getStateA(state) {
//         return state.a + 1
//       }
//     }
//   })
  
// }, 1000)
export default store
