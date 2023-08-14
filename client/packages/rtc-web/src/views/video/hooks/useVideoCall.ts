import { useRoomConnect } from '@/hooks';
import { useUserMedia, useDevicesList } from '@vueuse/core';
import {
  Ref,
  computed,
  onBeforeUnmount,
  ref,
  shallowRef,
  watch,
  watchEffect,
} from 'vue';

export type VideoShareOption = {
  immeately?: boolean;
  audio?: Ref<MediaDeviceInfo | undefined>;
  speaker?: Ref<string>;
};

export const useMediaSetting = (
  option: VideoShareOption = { immeately: true }
) => {
  const currentCamera = ref<string>();
  const currentAudioInput = ref<string>();
  const currentAudioOutput = ref<string>();

  const audioRef = ref(option.audio);
  const speakerRef = ref(option.speaker);

  const mediaLoaded = ref(false);

  // 切换 麦克风
  watch(
    audioRef,
    (value) => {
      currentAudioInput.value = value?.deviceId;
    },
    {
      immediate: true,
    }
  );

  // 切换 扬声器
  watch(
    speakerRef,
    (value) => {
      currentAudioOutput.value = value;
    },
    {
      immediate: true,
    }
  );

  watch(currentAudioOutput, (v) => {
    if (v) {
      setSinkId(v);
    }
  });

  // 收集的错误信息
  // const errorMsg = ref({
  //   audio: '',
  // });

  const {
    videoInputs: cameras,
    audioInputs,
    audioOutputs,
  } = useDevicesList({
    requestPermissions: true,
    onUpdated() {
      // 初始化默认 摄像头、扬声器、麦克风

      if (!cameras.value.find((i) => i.deviceId === currentCamera.value))
        currentCamera.value = cameras.value[0]?.deviceId;

      if (
        !audioInputs.value.find((i) => i.deviceId === currentAudioInput.value)
      )
        currentAudioInput.value = audioInputs.value[0]?.deviceId;

      if (
        !audioOutputs.value.find((i) => i.deviceId === currentAudioOutput.value)
      ) {
        currentAudioOutput.value = audioOutputs.value[0]?.deviceId;
      }
    },
  });

  const video = shallowRef<HTMLVideoElement>();

  const constraints = computed(() => {
    const audioDevice = currentAudioInput.value
      ? { deviceId: currentAudioInput.value }
      : false;

    const videoDevice = currentCamera.value
      ? {
          deviceId: currentCamera.value,
          facingMode: 'user',
          frameRate: {
            ideal: 30,
            max: 60,
          },
          width: { ideal: 1920 },
          height: { ideal: 1280 },
        }
      : false;
    return {
      audio: audioDevice,
      video: videoDevice,
    };
  });

  const { stream, stop, restart, start } = useUserMedia({
    constraints,
  });

  const audioTracks = ref<MediaStreamTrack[]>([]);
  const videoTracks = ref<MediaStreamTrack[]>([]);

  const audioEnabled = ref(true);
  const videoEnabled = ref(true);

  // 切换 video、audio 渲染
  const switchTrackEnable = (type: 'video' | 'audio', flag: boolean) => {
    if (stream.value) {
      if (type === 'audio') {
        if (audioTracks.value?.length) {
          audioEnabled.value = flag;
          audioTracks.value.forEach((item) => (item.enabled = flag));
        }
      }
      if (type === 'video') {
        if (videoTracks.value?.length) {
          videoEnabled.value = flag;
          videoTracks.value.forEach((item) => {
            item.enabled = flag;
          });
        }
      }
    }
  };

  const setSinkId = (sinkId: string) => {
    (video.value! as any).setSinkId(sinkId);
  };

  // 先静音和关闭视频渲染
  watch(stream, (v) => {
    if (v) {
      if (video.value) {
        video.value.srcObject = stream.value!;
        if (stream.value) {
          audioTracks.value = stream.value.getAudioTracks();
          videoTracks.value = stream.value.getVideoTracks();
        }
        if (!videoEnabled.value) {
          // switchTrackEnable('video', false);
        }
        if (!audioEnabled.value) {
          // switchTrackEnable('audio', false);
        }
        mediaLoaded.value = true;
      }
    }
  });

  // 进入页面先连接
  const startGetMedia = () => {
    return new Promise<MediaStream | undefined>((resolve) => {
      const watchEnableStop = watchEffect(async () => {
        if (
          currentAudioInput.value &&
          currentCamera.value &&
          currentAudioOutput.value
        ) {
          const stream = await start();
          watchEnableStop();
          resolve(stream);
        }
      });
    });
  };

  if (option.immeately) {
    startGetMedia();
  }

  onBeforeUnmount(() => {
    stop();
  });

  return {
    startGetMedia,
    stream,
    video,
    setSinkId,
    switchTrackEnable,
    restart,
    stop,
    audioEnabled,
    videoEnabled,
    mediaLoaded,
    currentAudioInput,
    currentAudioOutput,
  };
};

export const useMediaConnect = (
  connect: { onTrack?: (track: MediaStreamTrack, id: string) => void } = {},
  ...args: Parameters<typeof useMediaSetting>
) => {
  const { startGetMedia, ...mediaResult } = useMediaSetting(...args);

  let stream: MediaStream | undefined = undefined;
  useRoomConnect({
    async roomCreated() {
      console.log('ccccreated');
      stream = await startGetMedia();
    },
    roomJoined: async (_, pc) => {
      let innerStream = stream;
      stream = undefined;
      if (!innerStream) {
        innerStream = await startGetMedia();
        console.log('jjjjjjoined');
      }
      if (pc && innerStream) {
        innerStream.getTracks().forEach((track) => {
          pc.addTrack(track, innerStream);
        });
      }
    },
    onBeforeCreateAnswer: async (_, pc) => {
      let innerStream = stream;
      stream = undefined;
      if (!innerStream) {
        innerStream = await startGetMedia();
      }
      if (pc && innerStream) {
        innerStream.getTracks().forEach((track) => {
          pc.addTrack(track, innerStream);
        });
      }
    },
    onTrack(e: any, id: string) {
      console.log(e);
      if (e.track.kind === 'video') {
        connect.onTrack?.(e.streams[0], id);
      }
    },
  });

  return { ...mediaResult };
};
