

export default {
  namespaced: true,
  state() {
    return {
      listStatChange: []
    }
  },
  getters: {
    listStatChange(state) {
      return state.listStatChange
    }
  },
  mutations: {
    setlistStatChange(state, payload) {
      state.listStatChange = payload
    },
    statChange(state, { addParam, baseAndCommonStats, type }) {
        state.listStatChange = state.listStatChange.map((item) => {
          if (item.type === type) {
            // Если тип совпадает, возвращаем объект с обновленным параметром
            return { ...item, param: addParam };
          }
          return item; // Возвращаем неизмененный элемент
        });
        // Проверяем, есть ли тип в массиве, и добавляем новый элемент, если нет
        const existingTypes = state.listStatChange.map((item) => item.type);
        if (!existingTypes.includes(type)) {
          state.listStatChange.push({ type, param: addParam, baseAndCommonStats });
        }
      },
  },
  actions: {
    statChange({ commit }, { addParam, baseAndCommonStats, type }) {
      commit('statChange', { addParam, baseAndCommonStats, type })
    },
  }
}
