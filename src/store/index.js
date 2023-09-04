import { createStore } from 'vuex'
import listStatObjects from './modules/statChange.module'
import { baseStatModule } from '../initialization/baseParams'


export default createStore({
  state() {
    return {
      listManeken: [
        { idMannequin: 1, statModule: baseStatModule, lvl: 0},
      ]
    }
  },
  getters: {
    listManeken: (state) => (id) => {
      return state.listManeken.filter(item => {
        return item.idMannequin === id;
      });
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
    addManekenInfo(state, { idMannequin, statModule }) {
      state.listManeken.push({ idMannequin, statModule })
    },
    updateManekenInfo(state, { idMannequin, statModule, lvl }) {
      state.listManeken = state.listManeken.map((c) => {
        if (c.idMannequin === idMannequin) {
          return {
            ...c,
            statModule,
            lvl
          }
        }
        return c
      })
    }
  },
  actions: {
    addManekenInfo({ commit }, { idMannequin, statModule }) {
      commit('addManekenInfo', { idMannequin, statModule })
    },
    updateManekenInfo({ commit }, update) {
      commit('updateManekenInfo', update)
    },
    setlistManecken({ commit }, { idMannequin, raseModel }) {
      commit('updateManekenInfo', { idMannequin, raseModel })
    }
  },
  modules: {
    listStatObjects,
}
})
