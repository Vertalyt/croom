<script setup>
import { ref, computed } from 'vue'
import AppHeader from './components/AppHeader.vue'
import AppManeken from './components/AppManeken.vue'
import AppManekenResult from './components/AppManekenResult.vue'
import { initialSetupEntries, basickParamsRase, baseStatModule } from './initialization/baseParams'
import ManeckenModal from './components/use/ManeckenModal.vue'
import { aggregateStatValues } from './utils/aggregateStatValues'


const isDummyLoaded = initialSetupEntries
const baseStatConfigurations = ref(baseStatModule) // базовое значение конкретной расы, и их переменные, стартовое люди
const basickParams = ref(basickParamsRase) // поиск значений по расе
const summaryUpdatedStatConfigurations = ref([]) // массив хранит в каждом обьекте тип бонуса и его характеристики
const updatedStatConfigurations = ref(baseStatModule) // передаю в таблицу итоговый суммарный результат
const isOpen = ref(false)
const cellOptions = ref()

const statChange = ({ addParam, baseAndCommonStats = 'bonusAndBase', type }) => {
  // Создаем новый массив с обновленными данными
  const updatedConfigurations = summaryUpdatedStatConfigurations.value.map((item) => {
    if (item.type === type) {
      // Если тип совпадает, возвращаем объект с обновленным параметром
      return { ...item, param: addParam }
    }
    return item // Возвращаем неизмененный элемент
  })
  // Проверяем, есть ли тип в массиве, и добавляем новый элемент, если нет
  const existingTypes = summaryUpdatedStatConfigurations.value.map((item) => item.type)
  if (!existingTypes.includes(type)) {
    updatedConfigurations.push({ type, param: addParam, baseAndCommonStats })
  }
  // Обновляем массив с обновленными данными
  summaryUpdatedStatConfigurations.value = updatedConfigurations

  //суммирус все колонки для итогового результата
  const { arrUpdate, sumChangeInfo } = aggregateStatValues({ baseUpdateRase : baseStatConfigurations.value, sumChangeInfo: summaryUpdatedStatConfigurations.value })
  updatedStatConfigurations.value = arrUpdate
  summaryUpdatedStatConfigurations.value = sumChangeInfo
}

const changeRase = ({ raseModel }) => {
  //получаю все данные по ноой рассе
  const raseParams = basickParams.value.find((r) => r.availableRaces === raseModel)?.date;
    //изменяю зачение базовой расы на обновленную
  baseStatConfigurations.value = baseStatConfigurations.value.map((i) => {
    const updatedStats = raseParams ? {
      summStatBase: raseParams.find(param => param.key === i.key)?.count || i.summStatBase,
      summStatBonusAndBase: raseParams.find(param => param.key === i.key)?.count || i.summStatBonusAndBase
    } : {};
    return {
      ...i,
      ...updatedStats
    };
  });

  //суммирую в итоговый массив 
  const { arrUpdate, sumChangeInfo } = aggregateStatValues({ baseUpdateRase : baseStatConfigurations.value, sumChangeInfo: summaryUpdatedStatConfigurations.value })
  updatedStatConfigurations.value = arrUpdate
  summaryUpdatedStatConfigurations.value = sumChangeInfo
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
    .filter(stat => typeof stat.summStatBase !== 'undefined' && stat.summStatBase !== 0)
    .map(stat => {
      return {
        minKey: stat.minKey,
        summStatBase: stat.summStatBase
      };
    });
});


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
