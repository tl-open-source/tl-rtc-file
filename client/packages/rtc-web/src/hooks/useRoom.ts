import { CommonFnType } from '@/types';
import { resolveRef } from '@/utils/reactive';
import {
  MaybeRef,
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
} from 'vue';
import { useSocket } from './socket-utils';
import { SocketEventName } from '@/config';
import { useRouteParamsReactive } from '.';
import { useRouter } from 'vue-router';
import { InitDataKey } from '@/context';
import { genNickName } from '@/utils';
import { uniqBy } from 'lodash';
import { watchArray } from '@vueuse/core';

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
  room?: string;
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
    console.log('emitCreateRoom');
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

// 设置 room 连接的一些处理
export const useRoomConnect = () => {
  const roomInfo = useGetRoomInfo();

  const { members, selfInfo } = roomInfo;
  const rtcConnects = new Map<string, RTCPeerConnection>();
  const initData = inject(InitDataKey)!;
  const socketRef = shallowRef();

  watchArray(
    () => members.value,
    async (_, __, added, removed) => {
      console.log('watch', added, removed);

      // 处理 exit
      if (removed.length) {
        removed.forEach((peer) => {
          if (peer.id) {
            rtcConnects.delete(peer.id);
          }
        });
      }
    }
  );

  const createRtcConnect = (id: string) => {
    const pc = new RTCPeerConnection(initData.value.config);

    pc.onicecandidate = (e) => {
      // console.log('on candidate', e);
    };

    rtcConnects.set(id, pc);

    return pc;
  };

  const getRtcConnect = (id: string) => {
    return rtcConnects.get(id) || createRtcConnect(id);
  };

  // room Created事件 创建 peer、创建 offer
  const roomCreated = async (data: any) => {
    selfInfo.value = {
      owner: data.owner,
      recoderId: data.recoderId,
      roomId: data.room,
      socketId: data.id,
    };
    const handler = async (peer: any) => {
      const rtcConnect = getRtcConnect(peer.id);
      await createOffer(rtcConnect, peer);
    };

    await Promise.all(data.peers.map(handler));
    console.log('connect created', data, rtcConnects);
  };

  const createOffer = async (pc: RTCPeerConnection, peer: any) => {
    const offer = await pc.createOffer(initData.value.options);
    await pc.setLocalDescription(offer);
    socketRef.value.emit(SocketEventName.RoomOffer, {
      from: selfInfo.value.socketId,
      to: peer.id,
      room: selfInfo.value.roomId,
      sdp: offer.sdp,
    });
  };

  const roomOffer = async (data: any) => {
    const pc = getRtcConnect(data.from);
    await pc.setRemoteDescription(
      new RTCSessionDescription({ type: 'offer', sdp: data.sdp })
    );
    const answer = await pc.createAnswer(initData.value.options);
    await pc.setLocalDescription(answer);

    socketRef.value.emit(SocketEventName.RoomAnswer, {
      from: selfInfo.value.socketId,
      to: data.from,
      room: selfInfo.value.roomId,
      sdp: answer.sdp,
    });
  };

  const roomAnswer = async (data: any) => {
    const pc = getRtcConnect(data.from);

    await pc.setRemoteDescription(
      new RTCSessionDescription({ type: 'answer', sdp: data.sdp })
    );
  };
  const roomCandidate = () => {
    //
  };

  const handleRoomConnect = (socket: any) => {
    socketRef.value = socket;
    socket.on(SocketEventName.RoomCreated, roomCreated);
    socket.on(SocketEventName.RoomOffer, roomOffer);
    socket.on(SocketEventName.RoomAnswer, roomAnswer);
    socket.on(SocketEventName.RoomCandidate, roomCandidate);
  };
  useSocket(handleRoomConnect);

  return { ...roomInfo };
};

// 获取房间的一些信息，例如 peer 等信息
export const useGetRoomInfo = () => {
  const members = ref<Partial<Member>[]>([]);
  const selfInfo = ref<OwnerInfo>({
    socketId: '',
    owner: false,
    recoderId: '',
    roomId: '',
  });

  const roomCreated = (data: any) => {
    members.value = uniqBy(
      [
        ...data.peers.map((peer: any) => ({
          id: peer.id,
          nickName: peer.nickName,
          owner: peer.owner,
        })),
        {
          id: data.id,
          owner: data.owner,
          nickName: data.nickName,
        },
      ],
      'id'
    );

    selfInfo.value = {
      socketId: data.id,
      owner: data.owner,
      recoderId: data.recoderId,
      roomId: data.room,
    };
    console.log('created', members, data);
  };

  const roomExit = async (data: any) => {
    console.log('exit', data);
    members.value = members.value.filter((item) => item.id !== data.from);
  };

  const roomJoin = async (data: any) => {
    console.log('join', data);
    members.value = uniqBy(
      [
        ...members.value,
        {
          id: data.id,
          nickName: data.nickName,
          owner: data.owner,
        },
      ],
      'id'
    );
  };

  const roomOwner = computed(
    () => members.value.find((item) => item.owner) || undefined
  );

  const self = computed(
    () =>
      members.value.find((item) => item.id === selfInfo.value.socketId) ||
      undefined
  );

  const handleRoomInfo = async (socket: any) => {
    console.log('执行', socket);
    socket.on(SocketEventName.RoomCreated, roomCreated);
    socket.on(SocketEventName.RoomExit, roomExit);
    socket.on(SocketEventName.RoomJoin, roomJoin);

    onBeforeUnmount(() => {
      console.log('unmount');
      console.log(selfInfo.value);
      socket.emit(SocketEventName.RoomExit, {
        from: selfInfo.value.socketId,
        room: selfInfo.value.roomId,
        recoderId: selfInfo.value.recoderId,
      });
      socket.removeAllListeners();
    });
  };

  useSocket(handleRoomInfo);

  return {
    roomOwner,
    members,
    self,
    selfInfo,
  };
};
