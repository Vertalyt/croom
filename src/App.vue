<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import AppHeader from './components/AppHeader.vue'
import AppManeken from './components/AppManeken.vue'
import AppManekenResult from './components/AppManekenResult.vue'
import { basickParamsRase, baseStatModule } from './initialization/baseParams'
import ManeckenModal from './components/use/ManeckenModal.vue'
import { aggregateStatValues } from './utils/aggregateStatValues'
import { useStore } from 'vuex'

const basickParams = ref(basickParamsRase) // поиск значений по расе
const updatedStatConfigurations = ref(baseStatModule) // передаю в таблицу итоговый суммарный результат
const isOpen = ref(false)
const cellOptions = ref()
const store = useStore()
const raseParams = ref('')
const baseStatConfigurations = ref()
const baseManekenConfig = ref()
const lvlPerson = ref(0)

const idMannequin = 1; // айди манекена, в будущем буду менять в зависимости от манекена
const listStat = computed(() => store.getters['statChange/listStat'](idMannequin)) // слежу за массивом, который хранит в себе все обьекты изменения стат


onMounted(() => {
  baseManekenConfig.value = store.getters['listManeken'](idMannequin);// базовое значение конкретной расы, и их переменные, стартовое люди
  baseStatConfigurations.value = baseManekenConfig.value.statModule
} )

const updateLvl = (lvl) => {
  lvlPerson.value = lvl
  store.dispatch('updateManekenInfo', {
    ...baseManekenConfig.value,
    lvl,
  })

}

watch(listStat, (_) => {
    //суммируем все колонки для итогового результата
    const { arrUpdate } = aggregateStatValues({
      baseUpdate: baseStatConfigurations.value,
      idMannequin: idMannequin
  }, { deep: true })
  updatedStatConfigurations.value = arrUpdate

  store.commit('updateManekenInfo', { idMannequin: idMannequin, statModule: arrUpdate, lvl: lvlPerson.value})
}, {deep: true})

watch(raseParams, val => {
  //изменяю зачение базовой расы на обновленную
  const newBaseConfig = baseStatConfigurations.value.map((i) => {
    const updatedStats = val
      ? {
          summStatBase: val.find((param) => param.key === i.key)?.count || i.summStatBase,
          summStatBonusAndBase:
          val.find((param) => param.key === i.key)?.count || i.summStatBonusAndBase
        }
      : {}
    return {
      ...i,
      ...updatedStats
    }
  })
  //суммирую в итоговый массив
  const { arrUpdate } = aggregateStatValues({
    baseUpdate: newBaseConfig,
    idMannequin: idMannequin
  })
  updatedStatConfigurations.value = arrUpdate
  store.commit('updateManekenInfo', { idMannequin: idMannequin, statModule: arrUpdate, lvl: lvlPerson.value })
})

const changeRase = ({ raseModel }) => {
  //получаю все данные по ноой рассе
  raseParams.value = basickParams.value.find((r) => r.availableRaces === raseModel)?.date
  store.commit('updateManekenInfo', { raseParams, idMannequin })
}

const modalOpen = (param) => {
  cellOptions.value = param
  isOpen.value = true
}
const isClose = () => {
  isOpen.value = false
}

const minstats = computed(() => {
  return updatedStatConfigurations.value
    .filter((stat) => typeof stat.summStatBase !== 'undefined' && stat.summStatBase !== 0)
    .map((stat) => {
      return {
        minKey: stat.minKey,
        summStatBase: stat.summStatBase
      }
    })
})

</script>
<template>
  <div class="room-container">
    <div class="wrapper">
      <div class="conteiner">
        <ManeckenModal
          v-if="isOpen"
          :cellOptions="cellOptions"
          :minStats="minstats"
          :idMannequin="idMannequin"
          @isClose="isClose"
        />
        <AppHeader />

        <main class="main-wrapper">
          <AppManeken
            :updatedStatConfigurations="updatedStatConfigurations"
            :idMannequin="idMannequin"
            @changeRase="changeRase"
            @modalOpen="modalOpen"
            @updateLvl="updateLvl"

          />
          <AppManekenResult
            v-if="updatedStatConfigurations"
            :updatedStatConfigurations="updatedStatConfigurations"
            :idMannequin="idMannequin"
          />
        </main>
      </div>
    </div>
  </div>
</template>
