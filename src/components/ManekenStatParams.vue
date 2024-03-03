
<template>
              <table class="table" aria-label="Таблиця параметрів">
                <thead>
                </thead>
                <tbody class="options__tbody">
                  <tr>
                    <th aria-label="{{ getLocalizedText('Parameters') }}">{{ getLocalizedText('Parameters') }}</th>
                    <th aria-label="{{ getLocalizedText('Sum') }}">{{ getLocalizedText('Sum') }}</th>
                    <th aria-label="{{ getLocalizedText('Base') }}">{{ getLocalizedText('Base') }}</th>
                    <th v-if="elixCheck" aria-label="{{ getLocalizedText('Elixirs') }}">{{ getLocalizedText('Elixirs') }}</th>
                    <th v-if="!additionalCheck" aria-label="{{ getLocalizedText('Parameters') }}"><span class="material-symbols-outlined">add</span></th>
                    <th v-if="!additionalCheck" aria-label="remove"><span class="material-symbols-outlined">remove</span></th>
                  </tr>

                  <tr v-for="p in statParams" :key="p.key">
                  <td aria-label="{{ getLocalizedText(p.key) }}">
                    <img :src="p.link" :alt="p.key" width="18" height="18"/>
                    {{ getLocalizedText(p.key) }}
                  </td>
                  <td aria-label="{{ p.summStatBonusAndBase }} сумарний бонус та база">{{ p.summStatBonusAndBase }}</td>
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
    required: true
  },
  additionalCheck: {
    type: Boolean,
    required: false
  },
  inputShow: {
    type: Boolean,
    required: false
  },
  elixCheck: {
    type: Boolean,
    required: false
  },
})

</script>


<script>
export default {
  name: 'ManekenStatParams',
}
</script>

