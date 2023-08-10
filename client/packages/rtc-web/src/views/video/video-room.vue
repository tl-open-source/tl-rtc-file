<script lang="ts" setup>
import { useSwitchSiderbar, useSwitchMember } from '@/hooks';
import { onMounted, ref } from 'vue';
import { useVideoShare } from './hooks/useVideoCall';
import VideoControl from './video-control.vue';
import { computed } from 'vue';
import { watchEffect } from 'vue';

defineOptions({
  name: 'VideoRoom',
});

const { showSiderbar } = useSwitchSiderbar();
const { open } = useSwitchMember();

const audioInputDevice = ref<MediaDeviceInfo | undefined>();
const speakerRef = ref('');

const {
  video,
  switchTrackEnable,
  videoEnabled,
  audioEnabled,
  mediaLoaded,
  currentAudioInput,
  currentAudioOutput,
} = useVideoShare({
  audio: audioInputDevice,
  speaker: speakerRef,
});

const selectDevice = computed(() => ({
  audioInput: currentAudioInput.value,
  audioOutput: currentAudioOutput.value,
}));

watchEffect(() => {
  console.log(videoEnabled.value);
});

const activeControlMenu = computed<string[]>(() => {
  const arr = [];
  if (videoEnabled.value) arr.push('camera');
  if (audioEnabled.value) arr.push('audio');
  return arr;
});

onMounted(() => {
  showSiderbar.value = 0;
});

const handleMenuChange = (active: string) => {
  if (active === 'camera' || active === 'audio') {
    const enabled =
      active === 'camera' ? videoEnabled.value : audioEnabled.value;
    switchTrackEnable(active === 'camera' ? 'video' : 'audio', !enabled);
  }
};

const deviceChange = (device: MediaDeviceInfo) => {
  if (device.kind === 'audioinput') {
    audioInputDevice.value = device;
  }

  if (device.kind === 'audiooutput') {
    speakerRef.value = device.deviceId;
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
        :selectDevice="selectDevice"
        :menuDisabled="!mediaLoaded"
        :activeControlMenu="activeControlMenu"
        @control-menu-change="handleMenuChange"
        @select-device="deviceChange"
      />
    </div>

    <div v-show="open" class="w-[400px]">user 列表</div>
  </div>
</template>
