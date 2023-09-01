<template>
  <div class="dummy__rezult">
    <div class="options__itemBlock options__itemBlock_button">
      <ManekenStatParams :statParams="statParams">
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

    <div class="options__itemBlock options__itemBlock_button">
      <table class="table">
        <tbody>
          <tr>
            <td>
              <img src="../assets/img/icon/svg/health.svg" alt="health" />
              Життя
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
          <td class="options__table__title" colspan="5"><h3>Стоимість</h3></td>
        </thead>
        <tbody>
          <tr>
            <td>Талисмани</td>
            <td>Золоті талисмани</td>
            <td>Ратник</td>
            <td>Обмінні</td>
            <td>Реліквії</td>
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
import ManekenResultSlot from './use/slots/ManekenResultSlot.vue'
import ParamItemsManeken from './use/ParamItemsManeken.vue'

const props = defineProps({
  updatedStatConfigurations: {
    type: Array,
    required: true
  }
})

// Computed properties для улучшенной читаемости
const statParams = computed(() => props.updatedStatConfigurations.filter((d) => d.type === 'stat'))
const armorParams = computed(() => props.updatedStatConfigurations.filter((d) => d.type === 'armor'))
const magicParams = computed(() => props.updatedStatConfigurations.filter((d) => d.type === 'protectionMagick'))


</script>

<script>
export default {
  name: 'AppManekenResult'
}
</script>
