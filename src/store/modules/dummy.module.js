import { initialSetupEntries, listTwoHandedTypes } from '../../initialization/baseParams'


const isDummySaveMan1 = [...initialSetupEntries]
const isDummySaveMan2 = [...initialSetupEntries]

export default {
  namespaced: true,
  state() {
    return {
      listsDummy: [
        { idMannequin: 1, isDummy:isDummySaveMan1 },
        { idMannequin: 2, isDummy:isDummySaveMan2 },
      ]
    }
  },
  getters: {
    getDummyState(state) {
      return state.listsDummy
     },
    listsDummy: (state) => (id) => {
      const foundItem = state.listsDummy.find(item => item.idMannequin === id);
      return foundItem ? foundItem.isDummy : [];
    },
    clothName(state) {
      return state.listsDummy[0].isDummy.map(item => {
        return item.name
      })
    }

  },
  mutations: {
    changeDummyEl(state, { idMannequin, imgLink, cellName, typeid, key }) {
      const img = key === 'artefact' 
        ? `https://sabzero.biz/croomTemplate/assets/img/art.png` 
        : `https://files.nura.biz/site/images/things100x100/${imgLink}.png`;
  
      const foundItem = state.listsDummy.find(item => item.idMannequin === idMannequin);
  
      if (foundItem) {
        if (listTwoHandedTypes.includes(typeid)) {
          foundItem.isDummy = foundItem.isDummy.map(item => {
   // Создаем глубокую копию объекта на все ячейки с однаковым typeid (конкретно двуручное оружие)
            if (item.typeid.includes(typeid)) {
              return { ...item, link: img };
            }
            return item;
          });
        } else {
          foundItem.isDummy = foundItem.isDummy.map(item => {
            if (item.name === cellName) {
              return { ...item, link: img }; // Создаем глубокую копию объекта
            }
            return item;
          });
        }
      }
    },
    clearDummyEl(state, { idMannequin, cellNames }) {
      const initialSetups = {};
    
      // Создаем объект, где ключами являются имена ячеек, а значениями - ссылки на изображения
      initialSetupEntries.forEach(item => {
        initialSetups[item.name] = item.link;
      });
    
      cellNames.forEach(cellName => {
        const img = initialSetups[cellName];
        const foundItem = state.listsDummy.find(item => item.idMannequin === idMannequin);
    
        if (foundItem) {
          foundItem.isDummy = foundItem.isDummy.map(item => {
            if (item.name === cellName) {
              return { ...item, link: img };
            }
            return item;
          });
        }
      });
    },    
    addListsDummy(state, payload) {
      state.listsDummy = JSON.parse(payload)
    }
  },  
  actions: {
  async changeDummyEl( { commit, state, dispatch}, { addParam, typeid, idMannequin, imgLink, cellName, key } ) {
        const foundItem = state.listsDummy.find(item => item.idMannequin === idMannequin);
        const dummy = foundItem.isDummy.find(item => item.name === cellName)

       const searchElStatEl = await dispatch('statChange/searchELlist', { idMannequin }, { root: true })
        if (searchElStatEl) {
          commit('statChange/listDelChange', {
            idMannequin,
            type: ['weapons1', 'weapons2']
          }, { root: true })
          
          const cellNames = ['weapons1', 'weapons2'];
          commit('clearDummyEl', { idMannequin, cellNames });
        } 

        commit('changeDummyEl', { idMannequin, imgLink, cellName, typeid, key }); 
        commit('statChange/statChange', {
            addParam,
            type: dummy.name,
            idMannequin,
            typeid
        }, { root: true })
    }
  }
}