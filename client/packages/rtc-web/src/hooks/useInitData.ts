import { ConfigEnum } from '@/config';
import { useFetch, useLocalStorage } from '@vueuse/core';
import { ref, shallowReactive } from 'vue';
import io from 'socket.io-client';
import { InitDataKeyType } from '@/context';
import { isDev } from '@/utils';

export const useFetchData = async () => {
  const useTurn = useLocalStorage(ConfigEnum.useRelay, isDev() ? false : true);

  const { data, error } = await useFetch(
    () => `/api/comm/initData?turn=${useTurn.value}`
  )
    .get()
    .json();

  return { data, error };
};

export const useInitData = async () => {
  const { data, error } = await useFetchData();
  const initData = ref<InitDataKeyType>({
    langMode: 'zh', // 默认中文
  });

  if (data.value) {
    const { wsHost, logo, version, rtcConfig, options } = data.value;
    initData.value = Object.assign({}, initData.value, {
      socket: wsHost ? shallowReactive(io(wsHost)) : null,
      logo,
      version,
      options: Object.keys(options).reduce(
        (cur, next) => ({ ...cur, [next]: Boolean(options[next]) }),
        {}
      ),
      config: rtcConfig,
    });
  }

  if (error.value) {
    throw error.value;
  }

  return {
    initData,
  };
};
