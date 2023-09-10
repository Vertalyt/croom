import { initialSetupEntries, listTwoHandedTypes } from '../../initialization/baseParams'


let isDummy = [...initialSetupEntries]
export default {
  namespaced: true,
  state() {
    return {
      listsDummy: [
        { idMannequin: 1, isDummy:isDummy }
      ]
    }
  },
  getters: {
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
    changeDummyEl(state, { idMannequin, imgLink, cellName, typeid }) {
        const foundItem = state.listsDummy.find(item => item.idMannequin === idMannequin);
        if (foundItem) {
          
            if(listTwoHandedTypes.includes(typeid)) {
              foundItem.isDummy.forEach(item => {
                if (item.typeid.includes(typeid)) {
                  item.link = `https://files.nura.biz/site/images/things100x100/${imgLink}.png`;
                }
              });
            } else {
              foundItem.isDummy.find(item => {
                if (item.name === cellName) {
                  item.link = `https://files.nura.biz/site/images/things100x100/${imgLink}.png`;
                }
              });
            }

        }
      }
  },
  actions: {
    changeDummyEl( {dispatch, state, commit}, { addParam, typeid, idMannequin, imgLink, cellName } ) {
        const foundItem = state.listsDummy.find(item => item.idMannequin === idMannequin);

        const dummy = foundItem.isDummy.find(item => item.name === cellName)

        commit('changeDummyEl', { idMannequin, imgLink, cellName, typeid }); 
        dispatch('statChange/statChange', {
            addParam,
            type: dummy.name,
            idMannequin
        }, { root: true })
    }
  }
}