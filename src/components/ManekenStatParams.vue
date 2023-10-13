
<template>
              <table class="table">
                <thead>
                </thead>
                <tbody class="options__tbody">
                  <tr>
                    <td>{{ getLocalizedText('Parameters') }}</td>
                    <td>{{ getLocalizedText('Sum') }}</td>
                    <td>{{ getLocalizedText('Base') }}</td>
                    <td v-if="elixCheck">{{ getLocalizedText('Elixirs') }}</td>
                    <td v-if="!additionalCheck"><span class="material-symbols-outlined">add</span></td>
                    <td v-if="!additionalCheck"><span class="material-symbols-outlined">remove</span></td>
                  </tr>

                  <tr v-for="p in statParams" :key="p.key">
                  <td>
                    <img :src="p.link" :alt="p.key" />
                    {{ getLocalizedText(p.key) }}
                  </td>
                  <td>{{ p.summStatBonusAndBase }}</td>
                  <slot name="statManeken" :summBase="p" />
                </tr>
                <slot />
           </tbody>
              </table>
</template>


<script setup>
import { getLocalizedText } from '@/locale/index'

defineProps({
  statParams: {
    type: Array,
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

