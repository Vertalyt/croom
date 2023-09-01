<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import AppHeader from './components/AppHeader.vue'
import AppManeken from './components/AppManeken.vue'
import AppManekenResult from './components/AppManekenResult.vue'
import { initialSetupEntries, basickParamsRase, baseStatModule } from './initialization/baseParams'
import ManeckenModal from './components/use/ManeckenModal.vue'
import { aggregateStatValues } from './utils/aggregateStatValues'
import { useStore } from 'vuex'

const isDummyLoaded = initialSetupEntries
const basickParams = ref(basickParamsRase) // поиск значений по расе
const updatedStatConfigurations = ref(baseStatModule) // передаю в таблицу итоговый суммарный результат
const isOpen = ref(false)
const cellOptions = ref()
const store = useStore()
const raseParams = ref('')
const baseStatConfigurations = ref()


const listStatChange = computed(() => store.getters['listStatObjects/listStatChange']) // слежу за массивом, который хранит в себе все обьекты изменения стат
const id = 1; // айди манекена, в будущем буду менять в зависимости от манекена

onMounted(() => {
  baseStatConfigurations.value = store.getters['listManeken'](id) // базовое значение конкретной расы, и их переменные, стартовое люди
} )

watch(listStatChange, (_) => {
    //суммируем все колонки для итогового результата
    const { arrUpdate, } = aggregateStatValues({
    baseUpdateRase: baseStatConfigurations.value,
  }, { deep: true })
  updatedStatConfigurations.value = arrUpdate
  store.commit('updateManekenInfo', { idManeken: id, statModule: arrUpdate })
})

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
    baseUpdateRase: newBaseConfig,
  })
  updatedStatConfigurations.value = arrUpdate
  store.commit('updateManekenInfo', { idManeken: id, statModule: arrUpdate })
})

const changeRase = ({ raseModel }) => {
  //получаю все данные по ноой рассе
  raseParams.value = basickParams.value.find((r) => r.availableRaces === raseModel)?.date
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
          @isClose="isClose"
        />
        <AppHeader />

        <main class="main-wrapper">
          <AppManeken
            v-if="isDummyLoaded"
            :isDummyLoaded="isDummyLoaded"
            :updatedStatConfigurations="updatedStatConfigurations"

            @changeRase="changeRase"
            @modalOpen="modalOpen"
          />
          <AppManekenResult
            v-if="updatedStatConfigurations"
            :updatedStatConfigurations="updatedStatConfigurations"
          />
        </main>
      </div>
    </div>
  </div>
</template>
