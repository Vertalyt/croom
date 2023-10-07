import { listTwoHandedTypes } from '../../initialization/baseParams'



export default {
  namespaced: true,
  state() {
    return {
      listStatChange: [
        { idMannequin: 1, listStat: [] },
        { idMannequin: 2, listStat: [] },
      ]
    }
  },
  getters: {
    getStatChangeState(state) {
     return state.listStatChange
    },
    listStat: (state) => (id) => {
      const foundItem = state.listStatChange.find((item) => item.idMannequin === id)
      return foundItem ? foundItem.listStat : []
    },
    priseInfoCloth: (state) => (id) => {
      const foundItem = state.listStatChange.find((item) => item.idMannequin === id)
      if (foundItem) {
        return foundItem.listStat.flatMap(item => {
          return item.param.filter(characteristics => characteristics.priseInfo)
        })
      }
      return [] // Возвращаем пустой массив, если элемент не найден
    },
    foundCloth: (state) => (id, type) => {
      const foundItem = state.listStatChange.find((item) => item.idMannequin === id)
      if (foundItem) {
        return foundItem.listStat.find(item => item.type === type)
      }
      return [] // Возвращаем пустой массив, если элемент не найден
    },       
    minParamCloth: (state) => (id) => {
      // Найдем элемент с соответствующим idMannequin
      const foundItem = state.listStatChange.find((item) => item.idMannequin === id)

      if (foundItem) {
        // Создадим массив объектов с типом и базовым значением параметра
        return foundItem.listStat
          .map((item) => {
            // Используем деструктуризацию для более ясного доступа к свойствам
            const { type, param } = item
            let baseParam = param.find((b) => b.base)?.base || 0 // Добавим обработку отсутствия базового параметра

            // если base было найдено, убираем все елементы со значением 0
            if (baseParam !== 0) {
              baseParam = baseParam
              .map((i) => {
                if (i.count !== 0) {
                  return i
                } else {
                  return null
                }
              })
              .filter((item) => item !== null)

            if (baseParam.length > 0) {
              return {
                type,
                base: baseParam
              }
            }
            }
            return null
          })
          .filter((item) => item !== null) // Исключим null значения из массива
      } else {
        // Обработка случая, когда элемент не найден
        return []
      }
    }
  },
  mutations: {
    statChange(state, { addParam, type, name, idMannequin, typeid }) {
      state.listStatChange.filter((item) => {
        if (item.idMannequin === idMannequin) {
          item.listStat = item.listStat.map((item) => {
            if (item.type === type) {
              // Если тип совпадает, возвращаем объект с обновленным параметром
              return { ...item, name, param: addParam, typeid }
            }
            return item // Возвращаем неизмененный элемент
          })
          // Проверяем, есть ли тип в массиве, и добавляем новый элемент, если нет
          const existingTypes = item.listStat.map((item) => item.type)
          if (!existingTypes.includes(type)) {
            item.listStat.push({ type, name, param: addParam, typeid })
          }
        }
      })
    },
    listDelChange(state, { type, idMannequin }) {
      state.listStatChange = state.listStatChange.map((item) => {
        if (item.idMannequin === idMannequin) {
          item.listStat = item.listStat.filter((statItem) => {
            return !type.includes(statItem.type);
          });
        }
        return item;
      });
    },
    addListStatChange(state, payload) {
      state.listStatChange = JSON.parse(payload)
    },
    searchELlist(state, { idMannequin }) {
      const mannequin = state.listStatChange.find((item) => item.idMannequin === idMannequin);
      if (mannequin) {
        const hasTypeid = mannequin.listStat.some((statItem) => state.listTwoHandedTypes.includes(statItem.type));
        return hasTypeid;
      }
      return false; // Если не найден соответствующий объект с idMannequin
    },    
    clearELlist(state, idMannequin) {
        try {
          const mannequin = state.listStatChange.find((item) => item.idMannequin === idMannequin);
          if (mannequin) {
            mannequin.listStat = [];
            return true;
          }
          return false; // Если не найден соответствующий объект с idMannequin
        } catch (error) {
          console.log(error);
        }
    },

  },
  actions: {
    searchELlist({ state }, {idMannequin }) {
      const mannequin = state.listStatChange.find((item) => item.idMannequin === idMannequin);
      if (mannequin) {
        const hasTypeid = mannequin.listStat.some((statItem) => {
          return listTwoHandedTypes.includes(statItem.typeid);
        });
        
        return hasTypeid;
      }
      return false; // Если не найден соответствующий объект с idMannequin
    },
    delEl({ commit }, {idMannequin, el }) {
          commit('listDelChange', { type: [el], idMannequin })
          commit('dummy/clearDummyEl', { idMannequin, cellNames: [el] }, { root: true })
  },
  }
}
