<script lang="ts" setup>
import { useSwitchSiderbar, useSwitchMember, useGetRoomInfo } from '@/hooks';
import { ref } from 'vue';
import { useMediaConnect, useMediaSetting } from './hooks/useVideoCall';
import VideoControl from './video-control.vue';
import { computed } from 'vue';
import { useCreateRoom } from '@/hooks';
import { ToastBox } from '@/components/base';
import { watch } from 'vue';

defineOptions({
  name: 'VideoRoom',
});

const { showSiderbar } = useSwitchSiderbar();
showSiderbar.value = 0;

const { open } = useSwitchMember();

const audioInputDevice = ref<MediaDeviceInfo | undefined>();
const speakerRef = ref('');

const otherVideo = ref<{ id: string; ref: any }[]>([]);

const collectOtherVideoRef = (ref: any, id: string) => {
  if (!otherVideo.value.find((other) => other.id === id)) {
    otherVideo.value.push({ id, ref });
  }
};

const toastInfo = ref({
  visible: false,
  msg: '',
});

const {
  startGetMedia,
  video,
  switchTrackEnable,
  videoEnabled,
  audioEnabled,
  mediaLoaded,
  currentAudioInput,
  currentAudioOutput,
} = useMediaSetting({
  immeately: false,
  audio: audioInputDevice,
  speaker: speakerRef,
});

// 获取摄像头、麦克风权限
const stream = await startGetMedia().catch(() => {
  console.log('没有stream');
});

// 创建房间
useCreateRoom('video', true);

// 视频通话
useMediaConnect(stream!, {
  onTrack(track, id) {
    otherVideo.value.forEach((item) => {
      if (item.id === id) {
        item.ref.srcObject = track;
      }
    });
  },
});

const { members, selfInfo } = useGetRoomInfo();

watch(selfInfo, (v) => {
  if (v) {
    toastInfo.value.visible = true;
    toastInfo.value.msg = `您已加入 "${v.roomId}" 房间`;
  }
});

const memberwithoutOwner = computed(() =>
  members.value.filter((item) => item.id !== selfInfo.value.socketId)
);

const selectDevice = computed(() => ({
  audioInput: currentAudioInput.value,
  audioOutput: currentAudioOutput.value,
}));

// 当前激活的 菜单
const activeControlMenu = computed<string[]>(() => {
  const arr = [];
  if (videoEnabled.value) arr.push('camera');
  if (audioEnabled.value) arr.push('audio');
  return arr;
});

// 切换菜单按钮
const handleMenuChange = (active: string) => {
  if (active === 'camera' || active === 'audio') {
    const enabled =
      active === 'camera' ? videoEnabled.value : audioEnabled.value;
    switchTrackEnable(active === 'camera' ? 'video' : 'audio', !enabled);
  }
};

// 切换扬声器、麦克风
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

    <div v-show="open" class="w-[400px] overflow-auto">
      <div class="member-video mt-4 px-2">
        <video
          v-for="item in memberwithoutOwner"
          :key="item.id"
          :ref="(ref) => collectOtherVideoRef(ref, item.id || '')"
          class="mb-4 h-[200px] w-full"
          style="background-color: #1f1f1f"
          playsinline
          autoplay
        />
      </div>
    </div>
  </div>

  <ToastBox
    v-model:visible="toastInfo.visible"
    horizontal="center"
    vertical="top"
    type="success"
    :msg="toastInfo.msg"
  />
</template>
