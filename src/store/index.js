import { createStore } from 'vuex'
import statChange from './modules/statChange.module'
import dummy from './modules/dummy.module'
import spells from './modules/spells.module'
import auth from './modules/auth.module'
import requests from './modules/requests.module'

import { baseStatModule, basickParamsRase } from '../initialization/baseParams'
const raseParams = basickParamsRase.find(item => item.availableRaces === 'human').date

export default createStore({
  state() {
    return {
      listManeken: [
        { idMannequin: 1, statModule: baseStatModule, lvl: 0, raseParams: [...raseParams], accessibleStats: null},
        { idMannequin: 2, statModule: baseStatModule, lvl: 0, raseParams: [...raseParams], accessibleStats: null},
      ],
      message: null,
    }
  },
  getters: {
    getMainState(state) {
      return state.listManeken
     },
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
    },
    message(state) {
      return state.message
  },
  },  
  mutations: {
    setMessage(state, payload) {
      return state.message = payload
  },
  clearMessage(state) {
    state.message = null
  },
  addListManeken(state, payload) {
    state.listManeken = JSON.parse(payload)
  },
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
  actions: {
    setMessage({ commit }, payload) {
      commit('setMessage', payload)
      setTimeout(() => {
          commit('clearMessage')
      }, 2500);
  },
  },
  modules: {
    statChange,
    dummy,
    spells,
    auth,
    requests
}
})
