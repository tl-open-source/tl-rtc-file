<template>
    <div>
      <a-button @click="onClick">Home</a-button>
      {{ test }}
    </div>
</template>
<script setup>
const { data: test } = await useFetch('/api/test');
const onClick=async function(){
    console.log(1);
    

}
</script>