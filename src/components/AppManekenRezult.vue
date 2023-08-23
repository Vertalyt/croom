<template>
  <div class="dummy__rezult">
    <div class="options__itemBlock options__itemBlock_button">
      <ManekenStatParams :paramStatArr="paramStatArr">
        <template #statManeken="{ summBase }">
          <ManekenRezultSlot :statParam="summBase" />
        </template>
      </ManekenStatParams>
    </div>

    <div class="options__itemBlock options__itemBlock_button">
      <div class="armor__title"><h3>Броня</h3></div>

      <ParamItemsManeken :paramItems="paramArmorArr" :withItemsManecken="true"/>

      <ParamItemsManeken :paramItems="paramMagicArr" :withItemsManecken="false"/>

    </div>

    <div class="options__itemBlock options__itemBlock_button">
      <table class="table">
        <tbody>
          <tr>
            <td>
              <img src="../assets/img/icon/svg/health.svg" alt="health" />
              Житя
            </td>
            <td>0</td>
          </tr>
          <tr>
            <td>
              <img src="../assets/img/icon/svg/mana.svg" alt="mana" />
              Мана
            </td>
            <td>0</td>
          </tr>
          <tr>
            <td>
              <img src="../assets/img/icon/svg/power.svg" alt="power" />
              Енергія
            </td>
            <td>0</td>
          </tr>
          <tr>
            <td>
              <img src="../assets/img/icon/svg/rating.svg" alt="rating" />
              Рейтинг
            </td>
            <td>0</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="options__itemBlock options__itemBlock_button">
      <table class="table">
        <thead>
          <td class="options__table__title" colspan="5"><h3>Стоимость</h3></td>
        </thead>
        <tbody>
          <tr>
            <td>Тали</td>
            <td>Золоті тали</td>
            <td>Ратник</td>
            <td>Обміни</td>
            <td>Реликти</td>
          </tr>
          <tr>
            <td>1000000</td>
            <td>1000</td>
            <td>300</td>
            <td>5</td>
            <td>500</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ManekenStatParams from './ManekenStatParams.vue'
import ManekenRezultSlot from './use/slots/ManekenRezultSlot.vue'
import ParamItemsManeken from './use/ParamItemsManeken.vue'


const props = defineProps({
  paramArr: {
    type: Array,
    requared: true
  }
})


// слежение за изменением суммарного массива paramArr
const paramStatArr = computed(() => props.paramArr.filter((d) => d.type === 'stat'))
const paramArmorArr = computed(() => props.paramArr.filter((d) => d.type === 'armor'))
const paramMagicArr = computed(() => props.paramArr.filter((d) => d.type === 'protectionMagick'))

// eslint-disable-next-line no-unused-vars
const components = {
  ManekenStatParams,
  ManekenRezultSlot,
  ParamItemsManeken
}
</script>

<script>
export default {
  name: 'AppManekenRezult'
}
</script>
