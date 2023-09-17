export default {
  namespaced: true,
  state() {
    return {
      listMannequins: [{ idMannequin: 1, listStat: [] }]
    }
  },
  getters: {
    listStat: (state) => (id) => {
      const foundItem = state.listMannequins.find((item) => item.idMannequin === id)
      return foundItem ? foundItem.listStat : []
    },
    priseInfoCloth: (state) => (id) => {
      const foundItem = state.listMannequins.find((item) => item.idMannequin === id)
      if (foundItem) {
        return foundItem.listStat.flatMap(item => {
          return item.param.filter(characteristics => characteristics.priseInfo)
        })
      }
      return [] // Возвращаем пустой массив, если элемент не найден
    },    
    minParamCloth: (state) => (id) => {
      // Найдем элемент с соответствующим idMannequin
      const foundItem = state.listMannequins.find((item) => item.idMannequin === id)

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
    statChange(state, { addParam, type, name, idMannequin }) {
      state.listMannequins.filter((item) => {
        if (item.idMannequin === idMannequin) {
          item.listStat = item.listStat.map((item) => {
            if (item.type === type) {
              // Если тип совпадает, возвращаем объект с обновленным параметром
              return { ...item, name, param: addParam }
            }
            return item // Возвращаем неизмененный элемент
          })
          // Проверяем, есть ли тип в массиве, и добавляем новый элемент, если нет
          const existingTypes = item.listStat.map((item) => item.type)
          if (!existingTypes.includes(type)) {
            item.listStat.push({ type, name, param: addParam })
          }
        }
      })
    },
    listDelChange(state, { type, idMannequin }) {
      state.listMannequins.map((item) => {
        if (item.idMannequin === idMannequin) {
          item.listStat = item.listStat.map((statItem) => {
            if (statItem.type !== type) {
              // Если тип не совпадает, возвращаем объект без изменений
              return statItem;
            }
            // Если тип совпадает, возвращаем null (или любое другое значение, которое будет игнорироваться)
            return null;
          }).filter((filteredItem) => filteredItem !== null); // Удаляем элементы, равные null
        }
        return item; // Возвращаем обновленный элемент списка манекенов
      });
      return state; // Возвращаем обновленное состояние
    }      
  },
  actions: {
    statChange({ commit }, { addParam, type, name, idMannequin }) {
      commit('statChange', { addParam, type, name, idMannequin })
    },
    listDelChange( { commit }, { type, idMannequin } ) {
      commit('listDelChange', { type, idMannequin })
    }
  }
}
