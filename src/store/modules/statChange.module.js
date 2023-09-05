

export default {
  namespaced: true,
  state() {
    return {
      listMannequins: [
        { idMannequin: 1, listStat:[] }
      ]
    }
  },
  getters: {
    listStat: (state) => (id) => {
      const foundItem = state.listMannequins.find(item => item.idMannequin === id);
      return foundItem ? foundItem.listStat : [];
    }

  },
  mutations: {
    statChange(state, { addParam, type, idMannequin }) {
      state.listMannequins.filter(item => {
         if(item.idMannequin === idMannequin ) {
          item.listStat = item.listStat.map((item) => {
            if (item.type === type) {
              // Если тип совпадает, возвращаем объект с обновленным параметром
              return { ...item, param: addParam };
            }
            return item; // Возвращаем неизмененный элемент
          });
          // Проверяем, есть ли тип в массиве, и добавляем новый элемент, если нет
          const existingTypes = item.listStat.map((item) => item.type);
          if (!existingTypes.includes(type)) {
            item.listStat.push({ type, param: addParam });
          }
         }
      });
    },
  },
  actions: {
    statChange({ commit }, { addParam, type, idMannequin }) {
      commit('statChange', { addParam, type, idMannequin })
    },
  }
}
