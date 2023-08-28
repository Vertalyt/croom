
<template>
              <table class="table">
                <thead>
                  <td class="options__table__title" colspan="5"><h3>Манекен 1</h3></td>
                </thead>
                <tbody class="options__tbody">
                  <tr>
                    <td>Параметри</td>
                    <td>Сума</td>
                    <td>Базові</td>
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
  }
})

</script>


<script>
export default {
  name: 'ManekenStatParams',
}
</script>

