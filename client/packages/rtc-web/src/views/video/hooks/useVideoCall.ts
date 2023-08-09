import { useUserMedia, useDevicesList } from '@vueuse/core';
import { Ref, computed, nextTick, onMounted, ref, watchEffect } from 'vue';

export type VideoShareOption = {
  audio: Ref<MediaDeviceInfo | undefined>;
};

export const useVideoShare = (option: VideoShareOption) => {
  const { audio: audioRef } = option;
  const currentCamera = ref<string>();

  const { videoInputs: cameras } = useDevicesList({
    requestPermissions: true,
    onUpdated() {
      if (!cameras.value.find((i) => i.deviceId === currentCamera.value))
        currentCamera.value = cameras.value[0]?.deviceId;
    },
  });

  const video = ref<HTMLVideoElement>();

  const switchTrackEnable = (type: 'video' | 'audio', flag: boolean) => {
    if (stream.value) {
      if (type === 'audio') {
        const audioStream = stream.value.getAudioTracks();
        if (audioStream?.length) {
          audioStream[0].enabled = flag;
        }
      }
      if (type === 'video') {
        const videoStream = stream.value.getVideoTracks();
        if (videoStream?.length) {
          videoStream[0].enabled = flag;
        }
      }
    }
  };

  const audioEnabled = computed(() => {
    return stream.value?.getAudioTracks()[0].enabled;
  });

  const videoEnabled = computed(() => {
    return stream.value?.getVideoTracks()[0].enabled;
  });

  const audioDevice = computed(() => {
    return audioRef.value ? { deviceId: audioRef.value.deviceId } : true;
  });

  const stop = () => {
    enabled.value = false;
  };

  const { stream, enabled } = useUserMedia({
    constraints: computed(() => {
      return {
        audio: audioDevice.value,
        video: {
          deviceId: currentCamera.value, // 前后置
          facingMode: 'user',
          // 码率
          frameRate: {
            ideal: 30,
            max: 60,
          },
        },
      };
    }),
  });

  const setSinkId = (sinkId: string) => {
    (video.value! as any).setSinkId(sinkId);
  };

  watchEffect(() => {
    if (video.value) {
      video.value.srcObject = stream.value!;
      switchTrackEnable('audio', false);
      switchTrackEnable('video', false);
    }
  });

  watchEffect(() => {
    if (cameras.value.length) {
      currentCamera.value = cameras.value[0].deviceId;
    }
  });

  onMounted(() => {
    enabled.value = true;
  });

  return {
    video,
    setSinkId,
    switchTrackEnable,
    stop,
    audioEnabled,
    videoEnabled,
  };
};
