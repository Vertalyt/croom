import { createStore } from 'vuex'
import statChange from './modules/statChange.module'
import dummy from './modules/dummy.module'
import spells from './modules/spells.module'


import { baseStatModule, basickParamsRase } from '../initialization/baseParams'
const raseParams = basickParamsRase.find(item => item.availableRaces === 'human').date

export default createStore({
  state() {
    return {
      listManeken: [
        { idMannequin: 1, statModule: baseStatModule, lvl: 0, raseParams: raseParams, accessibleStats: null},
        { idMannequin: 2, statModule: baseStatModule, lvl: 0, raseParams: raseParams, accessibleStats: null},
      ]
    }
  },
  getters: {
    listManeken: (state) => (id) => {
      return state.listManeken.find(item => {
        return item.idMannequin === id;
      });
    },
    statModule: (state) => (id) => {
      const mannequin = state.listManeken.find(item => item.idMannequin === id);
      if (mannequin) { 
        return mannequin.statModule
      }
    },
    listManekenSearch: (state) => ({ id, element }) => {
      const mannequin = state.listManeken.find(item => item.idMannequin === id);
      if (mannequin) { 
        return mannequin[element]
      }
    },
    listManekenBase: (state) => (id) => {
      const mannequin = state.listManeken.find(item => item.idMannequin === id);
      if (mannequin) {
        return mannequin.statModule.map(item => {
          return {
            key: item.key,
            summStatBase: item.summStatBase,
            type: item.type
          }
        })
      } else {
        return null;
      }
    }
  },  
  mutations: {
    addManekenInfo(state, { idMannequin, statModule }) {
      state.listManeken.push({ idMannequin, statModule })
    },
    updateManekenInfo(state, update) {
      state.listManeken = state.listManeken.map((c) => {
        if (c.idMannequin === update.idMannequin) {
          return {
            ...c,
            ...update
          }
        }
        return c
      })
    },
  },
  modules: {
    statChange,
    dummy,
    spells
}
})
