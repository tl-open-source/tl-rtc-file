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
  roomInfo?: OwnerInfo;
};

export type OwnerInfo = {
  socketId: string;
  roomId: string;
  recoderId: string;
  owner: boolean;
};

export type ConnectOption = {
  roomJoined?: (...args: any[]) => Promise<void>;
  roomCreated?: (data: any) => Promise<void>;
  onAddRtcPeer?: (id: string, pc: any) => Promise<void>;
  onConnectComplete?: (...args: any[]) => void;
  onBeforeCreateOffer?: (...args: any[]) => Promise<void>;
  onBeforeCreateAnswer?: (...args: any[]) => Promise<void>;
  onTrack?: (...args: any[]) => void;
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

export const useCreateRoom = (type: 'password' | 'video' = 'password') => {
  const router = useRouter();

  const initData = inject(InitDataKey);

  const { roomId } = useRouteParamsReactive(['roomId']);

  const { isValid } = useRoom(() => roomId.value || '');

  const emitCreateRoom = (socket: any) => {
    socket.emit(SocketEventName.CreateAndJoin, {
      room: roomId.value,
      type: type,
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

export const useRoomConnect = (option: ConnectOption = {}) => {
  const roomInfo = useGetRoomInfo();

  const { members, selfInfo } = roomInfo;
  const rtcConnects = new Map<string, RTCPeerConnection>();
  const dataChanelMap = new Map<string, RTCDataChannel>();
  const initData = inject(InitDataKey)!;
  const socketRef = shallowRef();
  const completed = ref(false);

  watchArray(
    () => members.value,
    async (_, __, added, removed) => {
      console.log('watch', added, removed);

      // 处理 exit
      if (removed.length) {
        removed.forEach(async (peer) => {
          if (peer.id) {
            const rtcConnect = await getRtcConnect(peer.id);
            rtcConnect.close();
            rtcConnects.delete(peer.id);
          }
        });
      }
    }
  );

  const createRtcConnect = async (id: string) => {
    // const pc = new RTCPeerConnection(initData.value.config);
    const pc = new RTCPeerConnection();
    pc.onicecandidate = (event) => {
      if (event.candidate != null) {
        const message = {
          from: selfInfo.value.socketId,
          to: id,
          room: selfInfo.value.roomId,
          sdpMid: event.candidate.sdpMid,
          sdpMLineIndex: event.candidate.sdpMLineIndex,
          sdp: event.candidate.candidate,
        };
        socketRef.value.emit('candidate', message);
      }
    };

    const dataChanel = pc.createDataChannel('datachanel');
    dataChanelMap.set(id, dataChanel);

    dataChanel.onopen = () => {
      // dataChanel.send('aaa');
    };

    pc.ondatachannel = (e) => {
      const chanel = e.channel;
      if (chanel.label === 'datachanel') {
        chanel.onmessage = (e: any) => {
          // console.log('接受', e.data);
        };
      }
    };

    pc.onconnectionstatechange = (e) => {
      if (pc.connectionState === 'connected') {
        // console.log('完成');
        completed.value = true;
      }
    };

    pc.ontrack = (e) => {
      option?.onTrack?.(e, id);
    };

    rtcConnects.set(id, pc);
    await option.onAddRtcPeer?.(id, pc);

    return pc;
  };

  const getRtcConnect = async (id: string) => {
    return rtcConnects.get(id) || (await createRtcConnect(id));
  };

  const roomCreated = async (data: any) => {
    await option?.roomCreated?.(data);
  };

  const roomJoined = async (data: any) => {
    const peer = await getRtcConnect(data.id);

    await option?.roomJoined?.(data.id, peer);
    createOffer(peer, data);
  };

  /**
   * @description 这里的 createOffer
   */
  const createOffer = async (pc: RTCPeerConnection, peer: any) => {
    await option?.onBeforeCreateOffer?.(peer.id, pc);
    const offer = await pc.createOffer(initData.value.options);
    await pc.setLocalDescription(offer);
    console.log('create offer - send');
    socketRef.value.emit(SocketEventName.RoomOffer, {
      from: selfInfo.value.socketId,
      to: peer.id,
      room: selfInfo.value.roomId,
      sdp: offer.sdp,
    });
  };

  /**
   * @description offer 监听事件
   */
  const roomOffer = async (data: any) => {
    const pc = await getRtcConnect(data.from);
    await pc.setRemoteDescription(
      new RTCSessionDescription({ type: 'offer', sdp: data.sdp })
    );
    await option?.onBeforeCreateAnswer?.(data.from, pc);
    const answer = await pc.createAnswer(initData.value.options);
    await pc.setLocalDescription(answer);
    console.log('receive offer - send answer');
    socketRef.value.emit(SocketEventName.RoomAnswer, {
      from: selfInfo.value.socketId,
      to: data.from,
      room: selfInfo.value.roomId,
      sdp: answer.sdp,
    });
  };

  /**
   * @description answer 监听事件
   */
  const roomAnswer = async (data: any) => {
    const pc = await getRtcConnect(data.from);
    console.log('receive answer');
    await pc.setRemoteDescription(
      new RTCSessionDescription({ type: 'answer', sdp: data.sdp })
    );
  };
  const roomCandidate = async (data: any) => {
    const pc = await getRtcConnect(data.from);
    const rtcIceCandidate = new RTCIceCandidate({
      candidate: data.sdp,
      sdpMid: data.sdpMid,
      sdpMLineIndex: data.sdpMLineIndex,
    });
    await pc.addIceCandidate(rtcIceCandidate);
  };

  const handleRoomConnect = (socket: any) => {
    socketRef.value = socket;
    startConnect();
  };

  const startConnect = () => {
    socketRef.value.on(SocketEventName.RoomCreated, roomCreated);
    socketRef.value.on(SocketEventName.RoomJoin, roomJoined);
    socketRef.value.on(SocketEventName.RoomOffer, roomOffer);
    socketRef.value.on(SocketEventName.RoomAnswer, roomAnswer);
    socketRef.value.on(SocketEventName.RoomCandidate, roomCandidate);
  };
  useSocket(handleRoomConnect);

  return { ...roomInfo, rtcConnects, dataChanelMap, completed, startConnect };
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

  const self = computed(() => {
    const info =
      members.value.find((item) => item.id === selfInfo.value.socketId) ||
      undefined;

    if (info) {
      return Object.assign({}, { ...info, roomInfo: selfInfo.value });
    }
    return undefined;
  });

  const handleRoomInfo = async (socket: any) => {
    socket.on(SocketEventName.RoomCreated, roomCreated);
    socket.on(SocketEventName.RoomExit, roomExit);
    socket.on(SocketEventName.RoomJoin, roomJoin);

    onBeforeUnmount(() => {
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
