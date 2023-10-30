import { initialSetupEntries, listTwoHandedTypes } from '../../initialization/baseParams'

const isDummySaveMan1 = [...initialSetupEntries]
const isDummySaveMan2 = [...initialSetupEntries]
const OLLCELLNAMES = ['weapons1', 'weapons2']
export default {
  namespaced: true,
  state() {
    return {
      listsDummy: [
        { idMannequin: 1, isDummy: isDummySaveMan1 },
        { idMannequin: 2, isDummy: isDummySaveMan2 }
      ]
    }
  },
  getters: {
    getDummyState(state) {
      return state.listsDummy
    },
    listsDummy: (state) => (id) => {
      const foundItem = state.listsDummy.find((item) => item.idMannequin === id)
      return foundItem ? foundItem.isDummy : []
    },
    clothName(state) {
      return state.listsDummy[0].isDummy.map((item) => {
        return item.name
      })
    }
  },
  mutations: {
    changeDummyEl(state, { idMannequin, imgLink, cellName, typeid, key }) {
      const img =
        key === 'artefact'
          ? `https://sabzero.biz/croomTemplate/assets/img/art.png`
          : `https://files.nura.biz/site/images/things100x100/${imgLink}.png`
      const foundItem = state.listsDummy.find((item) => item.idMannequin === idMannequin)

      if (foundItem) {
        if (listTwoHandedTypes.includes(typeid)) {
          foundItem.isDummy = foundItem.isDummy.map((item) => {
            // Создаем глубокую копию объекта на все ячейки с однаковым typeid (конкретно двуручное оружие)
            if (item.typeid.includes(typeid)) {
              return { ...item, link: img }
            }
            return item
          })
        } else {
          foundItem.isDummy = foundItem.isDummy.map((item) => {
            if (item.name === cellName) {
              return { ...item, link: img } // Создаем глубокую копию объекта
            }
            return item
          })
        }
      }
    },
    // cellNames передаю массивом
    clearDummyEl(state, { idMannequin, cellNames }) {
      if (cellNames.some((name) => OLLCELLNAMES.includes(name))) {
        cellNames = OLLCELLNAMES
      }
      const initialSetups = {}
      initialSetupEntries.forEach((item) => {
        initialSetups[item.name] = item.link
      })

      cellNames.forEach((cellName) => {
        const img = initialSetups[cellName]
        const foundItem = state.listsDummy.find((item) => item.idMannequin === idMannequin)

        if (foundItem) {
          foundItem.isDummy = foundItem.isDummy.map((item) => {
            if (item.name === cellName) {
              return { ...item, link: img }
            }
            return item
          })
        }
      })
    },
    addListsDummy(state, payload) {
      state.listsDummy = JSON.parse(payload)
    },
    clearDummy(state, idMannequin) {
      try {
        const mannequin = state.listsDummy.find((item) => item.idMannequin === idMannequin)
        if (mannequin) {
          mannequin.isDummy = [...initialSetupEntries]
          return true
        }
        return false // Если не найден соответствующий объект с idMannequin
      } catch (error) {
        console.log(error)
      }
    }
  },
  actions: {
    async inspectionCleaning({ commit, dispatch }, { typeid, idMannequin }) {
      // ищу есть ли такая запись в statChange
      const searchElStatEl = await dispatch(
        'statChange/searchELlist',
        { idMannequin },
        { root: true }
      )
      // также проверяю текущаю запись не двуручная ли
      const fountTwoHends = listTwoHandedTypes.includes(typeid)
      if (searchElStatEl || fountTwoHends) {
        // если есть чищу в statChange
        commit(
          'statChange/listDelChange',
          {
            idMannequin,
            type: OLLCELLNAMES
          },
          { root: true }
        )
        const cellNames = OLLCELLNAMES
        commit('clearDummyEl', { idMannequin, cellNames })
      }
    },
    async changeDummyEl(
      { commit, dispatch, state }, { addParam, typeid, idMannequin, imgLink, cellName, key = '' }
    ) {
      const foundItem = state.listsDummy.find((item) => item.idMannequin === idMannequin)

      if (foundItem) {
        if(listTwoHandedTypes.includes(typeid)) {
          await dispatch('inspectionCleaning', { typeid, idMannequin })
        }
        commit('changeDummyEl', { idMannequin, imgLink, cellName, typeid, key })
        commit(
          'statChange/statChange',
          {
            addParam,
            type: cellName,
            idMannequin,
            typeid
          },
          { root: true }
        )
      }
    },
    changeDummyElX(
      { commit, state },
      { idMannequin, addParam, typeid, imgLink, cellName, key = '' }
    ) {
      const foundItem = state.listsDummy.find((item) => item.idMannequin === idMannequin)
      if (foundItem) {
        let quantity = 1
        if (typeid === Number(40) || typeid === Number(7)) {
          quantity = 4
        }
        if (typeid === Number(55)) {
          quantity = 2
        }
        for (let i = 1; i <= quantity; i++) {
          let newCellName = cellName.slice(0, -1) + i
          commit('changeDummyEl', { idMannequin, imgLink, cellName: newCellName, typeid, key })
          commit(
            'statChange/statChange',
            {
              addParam,
              type: newCellName,
              idMannequin,
              typeid
            },
            { root: true }
          )
        }
      }
    }
  }
}
