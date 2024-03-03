<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import AppManeken from '@/components/AppManeken.vue'
import AppManekenResult from '@/components/AppManekenResult.vue'
import AppPivotTable from '../components/AppPivotTable.vue'
import AppLoader from '../components/AppLoader.vue'

import { basicParamsRase, baseStatModule } from '@/initialization/baseParams'
import ManeckenModal from '@/components/use/ManeckenModal.vue'
import { aggregateStatValues } from '@/utils/aggregateStatValues'
import { useStore } from 'vuex'

defineEmits({
  OpenProfile: Boolean
})

const props = defineProps({
  idMannequin: {
    type: Number,
    required: true
  },
  openPivot: {
    type: Boolean,
    required: true
  }
})

const basickParams = ref(basicParamsRase) // поиск значений по расе
const store = useStore()
const updatedStatConfigurations = ref(baseStatModule) // передаю в таблицу итоговый суммарный результат
const isOpen = ref(false)
const cellOptions = ref()

const baseManekenConfig = computed(() => store.getters['listManeken'](props.idMannequin)) // базовое значение конкретной расы, и их переменные, стартовое люди
const raseParams = ref(baseManekenConfig.value.raseParams)
const baseStatConfigurations = ref(baseManekenConfig.value.statModule)

const listStat = computed(() => store.getters['statChange/listStat'](props.idMannequin)) // слежу за массивом, который хранит в себе все обьекты изменения стат

const localeSite = ref()
const clientInfo = ref(null)
async function isLoadingParam() {
  clientInfo.value = await store.dispatch('requests/clientInfo')
  if (clientInfo.value) {
    localeSite.value = clientInfo.value.locale
  }
}

const isLoading = ref(false)
onMounted( async () => {
  isLoading.value = true
  await isLoadingParam()
  isLoading.value = false
} )

watch(
  [raseParams, listStat],
  (_) => {
    const newBaseConfig = baseStatConfigurations.value.map((i) => ({ ...i }))
    updateBaseConfigAndStats(newBaseConfig, props.idMannequin)
  },
  { deep: true }
)

function updateBaseConfigAndStats(newBaseConfig, idMannequin) {
  const updatedConfigurations = newBaseConfig.map((i) => {
    const updatedStats = baseManekenConfig.value.raseParams
      ? {
          summStatBase:
            baseManekenConfig.value.raseParams.find((param) => param.key === i.key)?.count ||
            i.summStatBase,
          summStatBonusAndBase:
            baseManekenConfig.value.raseParams.find((param) => param.key === i.key)?.count ||
            i.summStatBonusAndBase
        }
      : {}

    return {
      ...i,
      ...updatedStats
    }
  })

  const { arrUpdate } = aggregateStatValues({
    baseUpdate: updatedConfigurations,
    idMannequin
  })

  updatedStatConfigurations.value = arrUpdate
  store.commit('updateManekenInfo', { idMannequin, statModule: arrUpdate })
}

const changeRase = ({ raseModel }) => {
  //получаю все данные по ноой рассе
  raseParams.value = basickParams.value.find((r) => r.availableRaces === raseModel).date
  store.commit('updateManekenInfo', {
    raseParams: raseParams.value,
    raseName: raseModel,
    idMannequin: props.idMannequin
  })
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

const lvlSearch = ref([
  { id: 'minLvl', count: 0 },
  { id: 'maxLvl', count: 0 }
])


</script>

<template>
    <AppLoader v-if="isLoading" />

  <ManeckenModal
    v-if="isOpen && !isLoading"
    :cellOptions="cellOptions"
    :minStats="minstats"
    :idMannequin="props.idMannequin"
    :lvlSearch="lvlSearch"
    @isClose="isClose"
    @lvlMinMaxChange="(val) => lvlSearch = val"
  />

  <main 
  v-if="!isLoading"
  class="main-wrapper">
    <AppPivotTable v-if="openPivot" />

    <div class="main-wrapper" :class="{ show: !openPivot, hide: openPivot }">
      <AppManeken
        :updatedStatConfigurations="updatedStatConfigurations"
        :idMannequin="props.idMannequin"
        @changeRase="changeRase"
        @modalOpen="modalOpen"
      />

      <AppManekenResult
        v-if="updatedStatConfigurations"
        :updatedStatConfigurations="updatedStatConfigurations"
        :idMannequin="props.idMannequin"
      />
    </div>
  </main>

</template>

<style scoped>
/* Начальные стили элемента */
.show {
  opacity: 1; /* Начальное значение прозрачности */
  transition: opacity 0.6s ease; /* Плавное изменение opacity за 0.3 секунды с эффектом ease */
}

/* Стили, которые будут применяться при наведении курсора (или другом событии) */
.hide {
  opacity: 0;
}
</style>
