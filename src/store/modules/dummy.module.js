import { initialSetupEntries } from '../../initialization/baseParams'

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
    }

  },
  mutations: {
    changeDummyEl(state, { idMannequin, imgLink, typeid }) {
        const foundItem = state.listsDummy.find(item => item.idMannequin === idMannequin);
        if (foundItem) {
          foundItem.isDummy.forEach(item => {
            if (item.typeid.includes(Number(typeid))) {
              item.link = `https://files.nura.biz/site/images/things100x100/${imgLink}.png`;
            }
          });
        }
      }
  },
  actions: {
    changeDummyEl( {dispatch, state, commit}, { addParam, typeid, idMannequin, imgLink } ) {
        const foundItem = state.listsDummy.find(item => item.idMannequin === idMannequin);
        const dummy = foundItem.isDummy.find(item => item.typeid.includes(Number(typeid)))

        commit('changeDummyEl', { idMannequin, imgLink, typeid }); 
        dispatch('statChange/statChange', {
            addParam,
            type: dummy.name,
            idMannequin
        }, { root: true })
    }
  }
}
