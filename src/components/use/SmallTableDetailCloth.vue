
<template>
<table class="detail_Cloth">
  <tr>
    <th class="th_nameParam_Cloth" colspan="2">{{ nameTable }}</th>
  </tr>

  <tr v-for="st in items" :key="st.key">
    <td class="td_nameParam_Cloth">{{ st.name  }}</td>
    <td class="td_countParam_Cloth">{{ st.count }}</td>
  </tr>
</table>
</template>


<script setup>
defineProps({
  items: {
    type: Object,
    required: true
  },
  nameTable: {
    type: String,
    required: true
  }
})
</script>

<script>
export default {
  name: 'SmallTableDetailCloth',
}
</script>

<style scoped>

.detail_Cloth {
    margin: 5px;
    border: 1px solid #817979b5;
    border-radius: 5px;
}
.th_nameParam_Cloth {
  font-size: 11px;
}
.td_nameParam_Cloth {
  font-size: 11px;
}
.td_countParam_Cloth {
  font-size: 10px;
}
@media only screen and (max-device-width: 460px) {

  .detail_Cloth {
    margin: 2px;
}

}

</style>