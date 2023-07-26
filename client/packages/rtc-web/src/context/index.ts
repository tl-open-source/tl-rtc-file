import { InjectionKey, Ref } from 'vue';

export type InitDataKeyType = Partial<{
  langMode: string;
  socket: any;
  logo: string;
  version: string;
  options: RTCOfferOptions;
  config: {
    iceServers: RTCIceServer[];
  };
}>;

export const InitDataKey: InjectionKey<Ref<InitDataKeyType>> =
  Symbol('initDataKey');
