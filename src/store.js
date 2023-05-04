import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import user from './user'

const persistedDataState = createPersistedState({
  paths: ['user'],
})

export const store = createStore({
  plugins: [persistedDataState],
  modules: {
    user: {
      namespaced: true,
      ...user,
    },
  },
})
