<script lang="ts" setup>
import { useSwitchSiderbar, useSwitchMember } from '@/hooks';
import { onMounted, ref } from 'vue';
import { useMediaConnect } from './hooks/useVideoCall';
import VideoControl from './video-control.vue';
import { computed } from 'vue';

defineOptions({
  name: 'VideoRoom',
});

const { showSiderbar } = useSwitchSiderbar();
const { open } = useSwitchMember();

const audioInputDevice = ref<MediaDeviceInfo | undefined>();
const speakerRef = ref('');

const otherVideo = ref();

const {
  video,
  switchTrackEnable,
  videoEnabled,
  audioEnabled,
  mediaLoaded,
  currentAudioInput,
  currentAudioOutput,
} = useMediaConnect(
  {
    onTrack(track, id) {
      console.log('id', id);
      otherVideo.value.srcObject = track;
      // otherVideo.value?.play?.();
    },
  },
  {
    immeately: false,
    audio: audioInputDevice,
    speaker: speakerRef,
  }
);

console.log('执行');

const handleClick = () => {
  // const aa = members.value[1]?.id;
  // const peer = dataChanelMap.get(aa!);
  // console.log('click', peer, dataChanelMap);
  // peer?.send('asdas');
};

const selectDevice = computed(() => ({
  audioInput: currentAudioInput.value,
  audioOutput: currentAudioOutput.value,
}));

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
        style="
          height: calc(100% - 80px);
          width: 100%;
          background-color: #1f1f1f;
        "
        playsinline
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

    <div v-show="open" class="w-[400px]" @click="handleClick">
      <video ref="otherVideo" playsinline autoplay />
    </div>
  </div>
</template>
