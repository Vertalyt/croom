<script setup>
import { ref } from 'vue'
import AppHeader from './components/AppHeader.vue';
import AppManeken from './components/AppManeken.vue'
import AppManekenRezult from './components/AppManekenRezult.vue'
import { baseDummyParams } from './initialization/baseParams'
import { baseParam } from './initialization/baseParams'
import { basickParamsRase } from './initialization/baseParams'


const dummy = baseDummyParams
const baseParamArr = ref(baseParam) // базовое значение конкретной расы, и их переменные, стартовое люди
const basickParams = ref(basickParamsRase) // поиск значений по расе
const paramArr = ref(baseParam) // передаю в таблицу итоговый суммарный результат

function combinationParam(addParam) {
  return baseParamArr.value.map(baseItem => {
  const matchingAddParam = addParam.find(addItem => addItem.key === baseItem.key);

  if (matchingAddParam) {
    return {
      ...baseItem,
      nameModel: baseItem.nameModel + matchingAddParam.count,
      summStatBase: baseItem.summStatBase + matchingAddParam.count,
    };
  }
  return baseItem;
});
}

const statChange = (addParam) => {
  paramArr.value = combinationParam(addParam)
}

const changeRase = ({ raseModel, addParam }) => {
  const raseParams = basickParams.value.find(r => r.rase === raseModel);

  if (raseParams) {
    const updatedParamArr = baseParamArr.value.map(p => {
      const matchingParam = raseParams.date.find(rp => rp.key === p.key);
      const matchingPlusParam = paramsPlus.value.find(pp => pp.key === p.key);

      let { nameModel, summStatBase } = p;

      if (matchingParam) {
        nameModel = matchingParam.count;
        summStatBase = matchingParam.count;
      }

      if (matchingPlusParam) {
        summStatBase += matchingPlusParam.count;
      }

      return { ...p, nameModel, summStatBase };
    });

    baseParamArr.value = updatedParamArr;
    paramArr.value = combinationParam(addParam)
  }
}
        // переменная для записи всех дополнительных значений, помимо  базовых, от всего шмота например.
  const paramsPlus = ref([
            {key: 'strong', count: 0 },
            {key: 'agility', count: 0 },
            {key: 'intelledgy', count: 0 },
            {key: 'luck', count: 0 },
            {key: 'reaction', count: 0 },
            {key: 'wisdom', count: 0 },
            {key: 'constitution', count: 0 },
  ])


// eslint-disable-next-line no-unused-vars
const components = {
  AppHeader
}
</script>
<template>
  <div class="room-container">
    <div class="wrapper">
      <div class="conteiner">

        <AppHeader />
        <main class="main-wrapper">
          <AppManeken 
          v-if="dummy" 
          :dummy="dummy" 
          :paramArr="paramArr"
          @statChange="statChange"
          @changeRase="changeRase"
          />
          <AppManekenRezult />
        </main>
      </div>
    </div>
  </div>
</template>