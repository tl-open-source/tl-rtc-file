import { CommonFnType } from '@/types';
import { resolveRef } from '@/utils/reactive';
import {
  MaybeRef,
  computed,
  inject,
  onMounted,
  reactive,
  ref,
  watch,
} from 'vue';
import { useSocket } from './socket-utils';
import { SocketEventName } from '@/config';
import { useRouteParamsReactive } from '.';
import { useRouter } from 'vue-router';
import { InitDataKey } from '@/context';
import { genNickName } from '@/utils';

export type Member = {
  id: string;
  nickName: string;
  langMode: string;
  owner: boolean;
  ua: string;
  joinTime: string;
  userAgent: string;
  ip: string;
  network: string;
};

export type OwnerInfo = {
  socketId: string;
  roomId: string;
  recoderId: string;
  owner: boolean;
};

export const useRoom = (value: MaybeRef<string> | CommonFnType) => {
  const realValue = resolveRef(value);
  const roomIdReg = /^[a-zA-Z0-9]{4,32}$/;

  function validateRoomId() {
    return roomIdReg.test(realValue.value as string);
  }

  const isValid = computed(() => validateRoomId());

  return {
    validateRoomId,
    isValid,
  };
};

export const useCreateRoom = () => {
  const router = useRouter();

  const initData = inject(InitDataKey);

  const { roomId } = useRouteParamsReactive(['roomId']);

  const { isValid } = useRoom(() => roomId.value || '');

  const emitCreateRoom = (socket: any) => {
    socket.emit(SocketEventName.CreateAndJoin, {
      room: roomId.value,
      type: 'password',
      password: '',
      nickName: genNickName(),
      langMode: initData?.value.langMode,
      ua: 'pc',
      // network: this.network,
    });
  };

  const checkParams = () => {
    console.log('check');
    if (!isValid.value) {
      router.replace('/');
    } else {
      useSocket(emitCreateRoom);
    }
  };

  watch(
    () => isValid.value,
    () => {
      checkParams();
    }
  );

  onMounted(checkParams);

  return {
    roomId,
    isValid,
  };
};

// 获取房间的一些信息，例如 peer 等信息
export const useGetRoomInfo = () => {
  const members = ref<Member[]>([]);
  const ownerInfo = ref<OwnerInfo>({
    socketId: '',
    owner: true,
    recoderId: '',
    roomId: '',
  });

  const roomCreated = (data: any) => {
    members.value = data.peers.map((peer: any) => {
      return {
        id: peer.id,
        nickName: peer.nickName,
        langMode: peer.langMode,
        owner: peer.owner,
        ua: peer.ua,
        joinTime: peer.joinTime,
        ip: peer.ip,
        network: peer.network,
      };
    });

    ownerInfo.value = {
      owner: data.owner,
      recoderId: data.recoderId,
      roomId: data.room,
      socketId: data.id,
    };
    console.log('created', members, ownerInfo);
  };

  const roomExit = async (data: any) => {
    console.log('exit', data);
  };

  const roomJoin = async (result: any) => {
    console.log('join', result);
  };
  const handleRoomInfo = async (socket: any) => {
    socket.on(SocketEventName.RoomCreated, roomCreated);
    socket.on(SocketEventName.RoomExit, roomExit);
    socket.on(SocketEventName.RoomJoin, roomJoin);
  };

  useSocket(handleRoomInfo);

  return {
    members,
    ownerInfo,
  };
};
