import { InjectionKey, Ref } from 'vue';

export type InitDataKeyType = Partial<{
  langMode: string;
  socket: any;
  logo: string;
  version: string;
  options: {
    offerToReceiveAudio: number;
    offerToReceiveVideo: number;
  };
  config: {
    iceServers: Partial<{
      urls: string;
      username: string;
      credential: string;
    }>[];
  };
}>;

export const InitDataKey: InjectionKey<Ref<InitDataKeyType>> =
  Symbol('initDataKey');
