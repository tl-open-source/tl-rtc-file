<template>
  <a-page-header class="solid-bottom" :ghost="true" title="WebRtc示例" sub-title="使用Webrtc视频聊天，传输文件" @back="() => null" />
</template>
<script setup>
const { data: test } = await useFetch('/api/test');
const onClick = async function () {
  console.log(1);


}
</script>