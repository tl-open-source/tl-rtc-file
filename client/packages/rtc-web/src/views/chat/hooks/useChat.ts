import { ChatEventName } from '@/config';
import { useSocket } from '@/hooks';
import { unescapeStr } from '@/utils';
import { ref, shallowRef } from 'vue';

export type SendMessage = {
  content: string;
  room: string;
  from: string;
  nickName: string;
  recoderId: any;
  time: string;
  to?: string;
};

// export type MessageStatus = 'fail' | 'complete' | 'pending';
export type MessageType = 'send' | 'receive';

export type MessageInfo = {
  content: string;
  // status: MessageStatus;
  type: MessageType;
} & SendMessage;

export const useChat = () => {
  const socketRef = shallowRef();
  const msgList = ref<MessageInfo[]>([]);

  const handleChat = (socket: any) => {
    socketRef.value = socket;
    socket.on(ChatEventName.ChatingRoom, handleChatingRoom);
  };
  const handleChatingRoom = (data: SendMessage) => {
    console.log('receive', data);
    msgList.value.push({
      ...data,
      content: unescapeStr(data.content),
      type: 'receive',
    });
  };

  const sendMessage = (data: SendMessage) => {
    socketRef.value.emit(ChatEventName.ChatingRoom, data);
    msgList.value.push({
      ...data,
      content: unescapeStr(data.content),
      type: 'send',
    });
  };

  useSocket(handleChat);

  return {
    sendMessage,
    msgList,
  };
};
