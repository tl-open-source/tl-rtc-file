import { useUserMedia, useDevicesList } from '@vueuse/core';
import { ref, watchEffect } from 'vue';

export const useVideoShare = () => {
  const currentCamera = ref<string>();

  const { videoInputs: cameras, devices } = useDevicesList({
    requestPermissions: true,
    onUpdated() {
      if (!cameras.value.find((i) => i.deviceId === currentCamera.value))
        currentCamera.value = cameras.value[0]?.deviceId;
    },
  });

  const video = ref<HTMLVideoElement>();

  const { stream, enabled } = useUserMedia({
    constraints: {
      audio: true,
      video: {
        deviceId: currentCamera.value, // 前后置
        facingMode: 'user',
        // 码率
        frameRate: {
          ideal: 30,
          max: 60,
        },
      },
    },
  });

  watchEffect(() => {
    if (video.value) {
      console.log(stream.value);
      video.value.srcObject = stream.value!;
    }
  });

  watchEffect(() => {
    // console.log(devices.value);
    console.log(cameras.value, enabled.value);
    if (cameras.value.length) {
      currentCamera.value = cameras.value[0].deviceId;
    }
  });

  return {
    enabled,
    video,
  };
};
