
<template>
              <table class="table">
                <thead>
                </thead>
                <tbody class="options__tbody">
                  <tr>
                    <td>Параметри</td>
                    <td>Сума</td>
                    <td>Базові</td>
                    <td v-if="elixCheck">Еліксири</td>
                    <td v-if="!additionalCheck"><span class="material-symbols-outlined">add</span></td>
                    <td v-if="!additionalCheck"><span class="material-symbols-outlined">remove</span></td>
                  </tr>

                  <tr v-for="p in statParams" :key="p.name">
                  <td>
                    <img :src="p.link" :alt="p.name" />
                    {{ p.name }}
                  </td>
                  <td>{{ p.summStatBonusAndBase }}</td>
                  <slot name="statManeken" :summBase="p" />
                </tr>
                <slot />
           </tbody>
              </table>
</template>


<script setup>

defineProps({
  statParams: {
    type: Array,
    requared: true
  },
  accessibleStats: {
    type: Number,
    requared: true
  },
  additionalCheck: {
    type: Boolean,
    requared: false
  },
  inputShow: {
    type: Boolean,
    requared: false
  },
  elixCheck: {
    type: Boolean,
    requared: false
  },
})

</script>


<script>
export default {
  name: 'ManekenStatParams',
}
</script>

