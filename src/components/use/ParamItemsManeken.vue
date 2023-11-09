
<template>
      <div class="armor_Wrapper">
        <div 
        class="armor_Item" 
        :class="['armor_Item', withItemsManecken ? 'armor_Item_half' : 'armor_Item_full', ]"
        v-for="p in paramItems" :key="p.key">
          <div class="armor__info"
          :class="{'full': !withItemsManecken }"
          >
            <img :src="p.link" :alt="p.key" width="20" height="20"/>
            {{ getLocalizedText(p.key) }}
          </div>
          <div class="armor__result">{{ p.summStatBonusAndBase }}</div>
        </div>
      </div>
</template>


<script setup>
import { getLocalizedText } from '@/locale/index'

defineProps({
  paramItems: {
    type: Array,
    requared: true
  },
  withItemsManecken: {
    type: Boolean
  },
  full: {
    requared: false,
    type: Boolean
  }
})
</script>

<script>
export default {
  name: 'ParamItemsManeken',
}
</script>

<style>
.full {
  width: 250px;
}
</style>