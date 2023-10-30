import { getDatabase, get, ref, update, remove } from 'firebase/database'
import { getLocalizedText } from '@/locale'

export default {
  namespaced: true,

  state() {
    return {
      clientInfo: null,
      markSave: {}
    }
  },
  mutations: {
    setInfo(state, payload) {
      state.clientInfo = payload
    },
    removeIdManecken(state, IdMackenen) {
      if (Object.prototype.hasOwnProperty.call(state.markSave, IdMackenen)) {
        delete state.markSave[IdMackenen];
      }
    },
    markSave(state, payload) {
      state.markSave = payload
    },
    addMark(state, markKey) {
      state.markSave[markKey] = { mark: markKey }
    },
    clearinfo(state) {
      const locale = state.clientInfo.locale
      state.clientInfo = {
        locale
      }
    }
  },
  actions: {
    async clientInfo({ dispatch, commit }) {
      try {
        const db = getDatabase()
        const uid = await dispatch('auth/getUid', null, { root: true })
        const snapshot = await get(ref(db, 'users/' + uid + '/info'))
        const info = snapshot.val()
        commit('setInfo', info)
        return info || undefined
      } catch (error) {
        if (error.message.includes("Permission denied")) {
          // Обработка ошибки "Permission denied"
          console.log(getLocalizedText('PermissionDenied'));
        } else {
          // Обработка других ошибок
          console.log(error);
        }
        return undefined;
      }
    },
    async addManecken({ dispatch, commit }, idMarkManecken) {
      try {
        const db = getDatabase()
        const uid = await dispatch('auth/getUid', null, { root: true })
        const path = `users/${uid}/saveManecken/${idMarkManecken}/`
        const snapshot = await get(ref(db, path))
        const maneckenDate = snapshot.val()
        if(maneckenDate) {
          commit('addListManeken', maneckenDate.mainState, { root: true })
          commit('dummy/addListsDummy', maneckenDate.dummyState, { root: true })
          commit('spells/addListSpellsMannequins', maneckenDate.spellsState, { root: true })
          commit('statChange/addListStatChange', maneckenDate.statChangeState, { root: true })


          dispatch('setMessage', 'Загрузка прошла успешно', { root: true })
          return true
        } else {
          dispatch('setMessage', 'Манекен не найден', { root: true })
          return false
        }

      } catch (error) {
        console.log(error)
      }
    },
    async addMarkSave({ dispatch, commit }) {

      try {
        const db = getDatabase()
        const uid = await dispatch('auth/getUid', null, { root: true })
        if(uid !== null) {
          const snapshot = await get(ref(db, 'users/' + uid + '/dateSaveMark/'))
          const info = snapshot.val()
  
          // максимальное количество сохранений
          const MAX_LENGHT = 20
          // массив с удалдяемыми
          const deletedRecords = []
  
          if(info) {
          if (Object.keys(info).length > MAX_LENGHT) {
            const keysToDelete = Object.keys(info)
              .sort((a, b) => a - b)
              .slice(0, Object.keys(info).length - MAX_LENGHT)
            keysToDelete.forEach((key) => {
              deletedRecords.push(info[key])
              delete info[key]
            })
  
            deletedRecords.forEach(async item => {
               await dispatch('deleteRecord', item.mark)
            })
          }
          commit('markSave', info)
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    async deleteRecord({ dispatch, commit }, deletedRecordsKey) {
      const db = getDatabase();
      const uid = await dispatch('auth/getUid', null, { root: true })

      const path1 = `users/${uid}/dateSaveMark/${deletedRecordsKey}`;
      const path2 = `users/${uid}/saveManecken/${deletedRecordsKey}`;
      commit('removeIdManecken', deletedRecordsKey)
      try {
        // Удаление записи из первого пути
        await remove(ref(db, path1))
        // Удаление записи из второго пути
        await remove(ref(db, path2))
        console.log(`Запись с ключом ${deletedRecordsKey} успешно удалена из базы данных.`);
      } catch (error) {
        console.error(`Ошибка при удалении записи с ключом ${deletedRecordsKey}:`, error);
      }
    },
    async updateInfo({ dispatch, commit }, payload) {
      try {
        const db = getDatabase()
        const uid = await dispatch('auth/getUid', null, { root: true })
        // проверка если игрок не зарегестрирован
        if (uid !== null) {
          await update(ref(db, 'users/' + uid + '/info'), payload)
        }
        commit('setInfo', payload)
        dispatch('setMessage', getLocalizedText('DataUpdated'), { root: true })
      } catch (error) {
        console.log(error)
      }
    },
    async saveManecken({ dispatch, rootGetters, commit }) {
      try {
        const db = getDatabase()
        const uid = await dispatch('auth/getUid', null, { root: true })
        if (uid !== null) {
          const mainState = rootGetters.getMainState
          const statChangeState = rootGetters['statChange/getStatChangeState']
          const dummyState = rootGetters['dummy/getDummyState']
          const spellsState = rootGetters['spells/getSpellsState']

          const payload = {
            mainState: JSON.stringify(mainState),
            statChangeState: JSON.stringify(statChangeState),
            dummyState: JSON.stringify(dummyState),
            spellsState: JSON.stringify(spellsState)
          }
          const currentDate = new Date().getTime()
          // Первый запрос: сохранение данных
          const path = `users/${uid}/saveManecken/${currentDate}/`
          await update(ref(db, path), payload)
            .then(() => {
              // Второй запрос: сохранение метки времени после завершения первого запроса
              const mark = {
                mark: currentDate
              }

              const dateSaveMark = `users/${uid}/dateSaveMark/${currentDate}/`
              return update(ref(db, dateSaveMark), mark)
            })
            .then(() => {
              commit('addMark', currentDate)
              dispatch('setMessage', 'Манекен сохранен', { root: true })
            })
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
  getters: {
    clientInfo(state) {
      return state.clientInfo
    },
    markSave(state) {
      return state.markSave
    }
  }
}
