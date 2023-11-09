
<template>

<div class="pivot_Wrapper">
      {{ nemChar }} Манекен 1
      <div class="armor_Item">

        <div 
        v-for="i in item1"
        :key="i.key"
        class="detail_info">
        <img 
        v-if="i.link"
        :src="i.link" :alt="i.name" width="18" height="18"><span>{{ getLocalizedText(i.key) }}</span>
          <span>{{ i.summStatBonusAndBase}}{{i.count}}</span>
        </div>

      </div>
    </div>

    <div class="pivot_Wrapper">
      {{ nemChar }} Манекен 2
      <div class="armor_Item">

        <div 
        v-for="i in item2"
        :key="i.key"
        class="detail_info">
        <img 
        v-if="i.link"
        :src="i.link" :alt="i.name"><span>{{ getLocalizedText(i.key) }}</span>
          <span>{{ i.summStatBonusAndBase}}{{i.count}}</span>
        </div>


      </div>
    </div>

</template>


<script setup>
import { getLocalizedText } from '../../locale'

defineEmits({
  isClose : null
});
defineProps({
  nemChar : {
    require: false,
    type: String
  },
  item1 : {
    require: true,
    type: Array
  },
  item2 : {
    require: true,
    type: Array
  }
})


</script>

<script>
export default {
  name: 'PivotContent',
}
</script>

<style scoped>
div > img {
  height: 20px;
  margin-right: 15px;
}

span {
  margin-right: 10px;
}

.pivot_Wrapper {
  display: grid;
  margin-bottom: 15px;
  border: 1px solid;
  border-radius: 10px;
  justify-items: center;
  justify-content: center;
  margin-right: 10px;
  padding: 2px 5px;
  background: #6f7376cc;
  padding-bottom: 15px;
}

.armor_Item {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  border-radius: 10px;
  padding-top: 7px;
}

.detail_info {
  background-color: #bbccd9bf;
  display: flex;
  align-items: center;
  justify-content: space-between;
  justify-content: flex-start;
  border: 1px solid;
  border-radius: 7px;
  padding: 4px 10px;
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>

