<template>
  <div class="cu-bar bg-gradual-purple solid-bottom flex">
    <div class="basis-xs flex">
      <div class="padding-lr flex justify-center align-center text-xxl">
        <span class="cuIcon-settings"></span>
      </div>
    </div>
    <div class="basis-lg flex align-center justify-center text-xxl">WebRtc示例</div>
    <div class="basis-xs flex justify-end">
      <div class="padding-lr flex justify-center align-center text-xxl">
        <span class="cuIcon-notice"></span>
      </div>
    </div>
  </div>
  <div class="flex align-center justify-center" style="height:200px;">
    <div class="flex justify-center">
      <a-space direction="vertical">
        <a-input-number style="width:100%;" v-model:value="roomNo" placeholder="输入房间号" size="large" />
        <a-space>
          <a-button type="primary" size="large">
            <template #icon>
              <CheckOutlined />
            </template>
            创建/加入房间
          </a-button>
          <a-button size="large">
            <template #icon>
              <MessageOutlined />
            </template>
            与AI聊天
          </a-button>
        </a-space>
      </a-space>
    </div>
  </div>
  <a-result title="声明" sub-title="开源软件，仅可用户学习用途，其他用途后果自负。">
  </a-result>
</template>
<script setup>
import { ref } from 'vue';
import { CheckOutlined, MessageOutlined } from "@ant-design/icons-vue";
const roomNo = ref(10086);
</script>