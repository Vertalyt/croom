import { createStore } from 'vuex'
import listStatObjects from './modules/statChange.module'
import { baseStatModule } from '../initialization/baseParams'


export default createStore({
  state() {
    return {
      listManeken: [
        { idManeken: 1, statModule: baseStatModule},
      ]
    }
  },
  getters: {
    listManeken: (state) => (id) => {
      const filteredItems = state.listManeken.filter(item => {
        return item.idManeken === id;
      });
      return filteredItems.map(item => item.statModule).flat();
    }
  },  
  mutations: {
    setlistManecken(state, raseParams) {
      state.listManeken =  state.listManeken.map((i) => {
        const updatedStats = raseParams
          ? {
              summStatBase: raseParams.find((param) => param.key === i.key)?.count || i.summStatBase,
              summStatBonusAndBase:
                raseParams.find((param) => param.key === i.key)?.count || i.summStatBonusAndBase
            }
          : {}
        return {
          ...i,
          ...updatedStats
        }
      })
    },
    addManekenInfo(state, { idManeken, statModule }) {
      state.listManeken.push({ idManeken, statModule })
    },
    updateManekenInfo(state, { idManeken, statModule }) {
      state.listManeken = state.listManeken.map((c) => {
        if (c.idManeken === idManeken) {
          return {
            ...c,
            statModule
          }
        }
        return c
      })
    }
  },
  actions: {
    addManekenInfo({ commit }, { idManeken, statModule }) {
      commit('addManekenInfo', { idManeken, statModule })
    },
    updateManekenInfo({ commit }, { idManeken, statModule }) {
      commit('updateManekenInfo', { idManeken, statModule })
    },
    setlistManecken({ commit }, { idManeken, raseModel }) {
      commit('updateManekenInfo', { idManeken, raseModel })
    }
  },
  modules: {
    listStatObjects,
}
})
