import { SocketEventName } from '@/config';
import { useSocket } from './useSocket';
import { ref } from 'vue';

export const useSocketCount = () => {
  const count = ref(0);
  const handleSocketCount = (socket: any) => {
    socket.on(SocketEventName.Count, (data: any) => {
      count.value = data.mc;
    });
  };

  useSocket(handleSocketCount);

  return {
    data: count,
  };
};
