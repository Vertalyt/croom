
<template>
<td :key="statParam.key">{{ statParam.summStatBase }}</td>
</template>


<script setup>
defineProps({
  statParam:{
    type: Object,
    requared: true
  },
})
</script>

<script>
export default {
  name: 'ManekenResultSlot',
}
</script>

