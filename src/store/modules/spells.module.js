export default {
  namespaced: true,
  state() {
    return {
      listSpellsMannequins: [
        {
          idMannequin: 1,
          spells: [
            { subclassList: [] },
            { spellsList: [{ whitemagic: [] }, { blackmagic: [] }, { astralmagic: [] }] }
          ]
        },
        {
          idMannequin: 2,
          spells: [
            { subclassList: [] },
            { spellsList: [{ whitemagic: [] }, { blackmagic: [] }, { astralmagic: [] }] }
          ]
        },
      ]
    }
  },
  getters: {
    getSpellsState(state) {
      return state.listSpellsMannequins
     },
    spells: (state) => (id) => {
      const foundItem = state.listSpellsMannequins.find((item) => item.idMannequin === id)
      if(foundItem) {
        return foundItem ? foundItem.spells : []
        } 
        return []
      }
  },
  mutations: {
    spellsChange(state, { subclassList, spellsList, idMannequin }) {
      // Найдем манекен в списке
      const mannequin = state.listSpellsMannequins.find((item) => item.idMannequin === idMannequin)

      if (mannequin) {
            const stateSubclassList = mannequin.spells.find((el) => el.subclassList)
            if (stateSubclassList) {
              stateSubclassList.subclassList = subclassList
            }
            const stateSpellList = mannequin.spells.find(el => el.spellsList)
            if (stateSpellList) {            
              stateSpellList.spellsList = spellsList
          }
      }
    },
    addListSpellsMannequins(state, payload) {
      state.listSpellsMannequins = JSON.parse(payload)
    }
  },
}
