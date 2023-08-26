<script setup>
import { ref } from 'vue'
import AppHeader from './components/AppHeader.vue';
import AppManeken from './components/AppManeken.vue'
import AppManekenResult from './components/AppManekenResult.vue'
import { initialSetupEntries, basickParamsRase, baseStatModule } from './initialization/baseParams'
import ManeckenModal from './components/use/ManeckenModal.vue';


const isDummyLoaded = initialSetupEntries
const baseStatConfigurations = ref(baseStatModule) // базовое значение конкретной расы, и их переменные, стартовое люди
const basickParams = ref(basickParamsRase) // поиск значений по расе
const updatedStatConfigurations = ref(baseStatModule) // передаю в таблицу итоговый суммарный результат
const isOpen = ref(false)
const cellOptions = ref()

        // переменная для записи всех дополнительных значений, помимо  базовых, от всего шмота например.
const paramsPlus = ref([
            {key: 'dstrength', count: 0 },
            {key: 'ddexterity', count: 0 },
            {key: 'dintel', count: 0 },
            {key: 'dluck', count: 0 },
            {key: 'dreaction', count: 0 },
            {key: 'dwisdom', count: 0 },
            {key: 'dconst', count: 0 },
  ])

function combinationParam(addParam, baseAndCommonStats) {
  return baseStatConfigurations.value.map(baseItem => {
  const matchingAddParam = addParam.find(addItem => addItem.key === baseItem.key);
  // const matchingAddParamPlus = paramsPlus.value.find(addItem => addItem.key === baseItem.key);

  if (matchingAddParam) {
      if(baseAndCommonStats === 'areCommon') {
        return {  ...baseItem,
      summStatBase: baseItem.summStatBase + matchingAddParam.count,
      summStatOll: baseItem.summStatOll + matchingAddParam.count,
        }
      } else {
        return {  ...baseItem,
      summStatOll: baseItem.summStatOll + matchingAddParam.count,
        }
      }
  }

  return baseItem;
});
}
const statChange = ({ addParam, baseAndCommonStats = 'areCommon'}) => {
  updatedStatConfigurations.value = combinationParam(addParam, baseAndCommonStats)
}
const changeRase = ({ raseModel, addParam }) => {
  const raseParams = basickParams.value.find(r => r.availableRaces === raseModel);

  if (raseParams) {
    const updatedParamArr = baseStatConfigurations.value.map(p => {
      const matchingParam = raseParams.date.find(rp => rp.key === p.key);
      const matchingPlusParam = paramsPlus.value.find(pp => pp.key === p.key);

      let { summStatBase, summStatOll } = p;

      if (matchingParam) {
        summStatBase = matchingParam.count;
        summStatOll = matchingParam.count;
      }

      if (matchingPlusParam) {
        summStatOll += matchingPlusParam.count;
      }

      return { ...p, summStatBase, summStatOll };
    });

    baseStatConfigurations.value = updatedParamArr;
    updatedStatConfigurations.value = combinationParam(addParam)
  }
}
const modalOpen = (param) => {
  cellOptions.value = param
  isOpen.value = true
}
const isClose = () => {
  isOpen.value = false
}

// eslint-disable-next-line no-unused-vars
const components = {
  AppHeader,
  ManeckenModal,
  AppManekenResult,
  AppManeken
}
</script>
<template>
  <div class="room-container">
    <div class="wrapper">
      <div class="conteiner">
        <ManeckenModal v-if="isOpen" :cellOptions="cellOptions"  @isClose="isClose" />
        <AppHeader />
        
        <main class="main-wrapper">
          <AppManeken 
          v-if="isDummyLoaded" 
          :isDummyLoaded="isDummyLoaded" 
          :updatedStatConfigurations="updatedStatConfigurations"
          @statChange="statChange"
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