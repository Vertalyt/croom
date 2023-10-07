<script setup>
import { ref, computed, watch } from 'vue'
import AppManeken from '@/components/AppManeken.vue'
import AppManekenResult from '@/components/AppManekenResult.vue'

import { basickParamsRase, baseStatModule } from '@/initialization/baseParams'
import ManeckenModal from '@/components/use/ManeckenModal.vue'
import { aggregateStatValues } from '@/utils/aggregateStatValues'
import { useStore } from 'vuex'

defineEmits({
  OpenProfile: Boolean
})

const props = defineProps({
  idMannequin: {
    type: Number,
    requared: true
  }
})

const basickParams = ref(basickParamsRase) // поиск значений по расе
const store = useStore()
const updatedStatConfigurations = ref(baseStatModule) // передаю в таблицу итоговый суммарный результат
const isOpen = ref(false)
const cellOptions = ref()

const baseManekenConfig = computed( () => store.getters['listManeken'](props.idMannequin));// базовое значение конкретной расы, и их переменные, стартовое люди
const raseParams = ref(baseManekenConfig.value.raseParams)
const baseStatConfigurations = ref(baseManekenConfig.value.statModule)


const listStat = computed(() => store.getters['statChange/listStat'](props.idMannequin)) // слежу за массивом, который хранит в себе все обьекты изменения стат



watch([raseParams, listStat], _ => {
  const newBaseConfig = baseStatConfigurations.value.map((i) => ({ ...i }));
  updateBaseConfigAndStats(newBaseConfig, props.idMannequin);
}, { deep: true });


function updateBaseConfigAndStats(newBaseConfig, idMannequin) {
  const updatedConfigurations = newBaseConfig.map((i) => {
    const updatedStats = baseManekenConfig.value.raseParams
      ? {
          summStatBase: baseManekenConfig.value.raseParams.find((param) => param.key === i.key)?.count || i.summStatBase,
          summStatBonusAndBase: baseManekenConfig.value.raseParams.find((param) => param.key === i.key)?.count || i.summStatBonusAndBase
        }
      : {};
      
    return {
      ...i,
      ...updatedStats
    };
  });

  const { arrUpdate } = aggregateStatValues({
    baseUpdate: updatedConfigurations,
    idMannequin,
  });

  updatedStatConfigurations.value = arrUpdate;
  store.commit('updateManekenInfo', { idMannequin, statModule: arrUpdate });
}


const changeRase = ({ raseModel }) => {
  //получаю все данные по ноой рассе
  raseParams.value = basickParams.value.find((r) => r.availableRaces === raseModel).date
  store.commit('updateManekenInfo', { 
    raseParams : raseParams.value,
    raseName: raseModel,
    idMannequin : props.idMannequin })
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
  { id: 'minLvl', count: 'change' },
  { id: 'maxLvl', count: 'change' }
])

const minLvl = ref(lvlSearch.value[0].count)
const maxLvl = ref(lvlSearch.value[1].count)

const handleLvlMinMaxChange = ({lvlMinMax, id}) => {
  lvlSearch.value = lvlMinMax
  const foundTypeLvl = lvlMinMax.find(item => item.id === id)
  if(foundTypeLvl.id === 'minLvl') {
    minLvl.value = foundTypeLvl.count
  } else {
    maxLvl.value = foundTypeLvl.count
  }
}




</script>

<template>

        <ManeckenModal
          v-if="isOpen"
          :cellOptions="cellOptions"
          :minStats="minstats"
          :idMannequin="props.idMannequin"
          :minLvl="minLvl"
          :maxLvl="maxLvl"
          :lvlSearch="lvlSearch"
          @isClose="isClose"
          @lvlMinMaxChange="handleLvlMinMaxChange"
        />

        <main class="main-wrapper">
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
        </main>


</template>
