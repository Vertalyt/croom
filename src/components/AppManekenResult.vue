<template>
  <div class="dummy__rezult">
    <div class="options__itemBlock options__itemBlock_button">
      <ManekenStatParams :statParams="statParams" :additionalCheck="true">
        <template #statManeken="{ summBase }">
          <ManekenResultSlot :statParam="summBase" />
        </template>
      </ManekenStatParams>
    </div>

    <div class="options__itemBlock options__itemBlock_button">
      <div class="armor__title"><h3>Броня</h3></div>

      <ParamItemsManeken :paramItems="armorParams" :withItemsManecken="true" />

      <ParamItemsManeken :paramItems="magicParams" :withItemsManecken="false" />

    </div>

    <TotalValCharacterBlock :idMannequin="idMannequin" />

    <div class="options__itemBlock options__itemBlock_button">
      <table class="table">
        <thead>
          <td class="options__table__title" colspan="5"><h3>Вартість</h3></td>
        </thead>
        <tbody>
          <tr>
            <td v-for="n in nameCost" :key="n.name">{{ n.name }}</td>
          </tr>
          <tr>
            <td v-for="n in nameCost" :key="n.key">{{ n.cost }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue'
import ManekenStatParams from './ManekenStatParams.vue'
import ManekenResultSlot from './use/slots/ManekenResultSlot.vue'
import ParamItemsManeken from './use/ParamItemsManeken.vue'
import TotalValCharacterBlock from './TotalValCharacterBlock.vue'

import { useStore } from 'vuex'
import { totalCostCloth } from '../utils/totalCostCloth'

const props = defineProps({
  updatedStatConfigurations: {
    type: Array,
    required: true
  },
  idMannequin: {
    type: Number,
    required: true
  }
})

const store = useStore()

const nameCost = ref([
  {key: 'price', name: 'Тали', cost: 0},
  {key: 'goldprice', name: 'Золоті тали', cost: 0},
  {key: 'ratnikprice', name: 'Ратник', cost: 0},
  {key: 'obmenprice', name: 'Обміни', cost: 0},
  {key: 'reliktprice', name: 'Реліквії', cost: 0},
])


// Computed properties для улучшенной читаемости
const statParams = computed(() => props.updatedStatConfigurations.filter((d) => d.type === 'stat'))
const armorParams = computed(() => props.updatedStatConfigurations.filter((d) => d.type === 'armor'))
const magicParams = computed(() => props.updatedStatConfigurations.filter((d) => d.type === 'protectionMagick'))
const priseInfo = computed( () => store.getters['statChange/priseInfoCloth'](props.idMannequin))



const totalPriseInfo = ref([]);
watch(priseInfo, val => {
  totalPriseInfo.value = totalCostCloth(val);

  nameCost.value.forEach(item => {
    const priseFind = totalPriseInfo.value.find(priсe => Object.prototype.hasOwnProperty.call(priсe, item.key));
    if (priseFind) {
      item.cost = priseFind[item.key];
    }
  });
});




</script>

<script>
export default {
  name: 'AppManekenResult'
}
</script>
