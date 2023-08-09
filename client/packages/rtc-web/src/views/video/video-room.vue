<script lang="ts" setup>
import { useSwitchSiderbar, useSwitchMember } from '@/hooks';
import { onMounted, ref } from 'vue';
import { useVideoShare } from './hooks/useVideoCall';
import VideoControl from './video-control.vue';

defineOptions({
  name: 'VideoRoom',
});

const { showSiderbar } = useSwitchSiderbar();
const { open } = useSwitchMember();

const audioInputDevice = ref<MediaDeviceInfo | undefined>();

const { video, setSinkId, switchTrackEnable } = useVideoShare({
  audio: audioInputDevice,
});

onMounted(() => {
  showSiderbar.value = 0;
});

const handleMenuChange = (active: string[]) => {
  const hasVideo = active.includes('camera');
  const hasAudio = active.includes('audio');
  switchTrackEnable('audio', hasAudio);
  switchTrackEnable('video', hasVideo);
};

const deviceChange = (device: MediaDeviceInfo) => {
  if (device.kind === 'audioinput') {
    audioInputDevice.value = device;
  }

  if (device.kind === 'audiooutput') {
    setSinkId(device.deviceId);
  }
};
</script>

<template>
  <div class="flex h-full">
    <div class="flex flex-1 flex-col overflow-hidden">
      <video
        id="video-call"
        ref="video"
        class="flex-1"
        playsinline
        controls
        autoplay
      ></video>
      <VideoControl
        @control-menu-change="handleMenuChange"
        @select-device="deviceChange"
      />
    </div>

    <div v-show="open" class="w-[400px]">user 列表</div>
  </div>
</template>
