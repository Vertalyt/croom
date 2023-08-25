
<template>
      <div class="armor_Wrapper">
        <div 
        class="armor_Item" 
        :class="['armor_Item', withItemsManecken ? 'armor_Item_half' : 'armor_Item_full']"
        v-for="p in paramItems" :key="p.key">
          <div class="armor__info">
            <img :src="p.link" :alt="p.name" />
            {{ p.name }}
          </div>
          <div class="armor__result">{{ p.summStatOll }}</div>
        </div>
      </div>
</template>


<script setup>
defineProps({
  paramItems: {
    type: Array,
    requared: true
  },
  withItemsManecken: {
    type: Boolean
  }
})
</script>

<script>
export default {
  name: 'ParamItemsManeken',
}
</script>

