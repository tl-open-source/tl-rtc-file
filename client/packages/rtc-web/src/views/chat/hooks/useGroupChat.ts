import { ChatEventName } from '@/config';
import { useSocket } from '@/hooks';
import { shallowRef } from 'vue';

export type SendMessage = {
  content: string;
  room: string;
  from: string;
  nickName: string;
  recoderId: any;
};

export const useGroupChat = () => {
  const socketRef = shallowRef();
  const handleChatingRoom = (data: SendMessage) => {
    console.log('receive', data);
  };

  const sendMessage = (data: SendMessage) => {
    socketRef.value.emit(ChatEventName.ChatingRoom, data);
  };

  const handleSocket = (socket: any) => {
    socketRef.value = socket;
    socket.on(ChatEventName.ChatingRoom, handleChatingRoom);
  };

  useSocket(handleSocket);

  return {
    sendMessage,
  };
};
