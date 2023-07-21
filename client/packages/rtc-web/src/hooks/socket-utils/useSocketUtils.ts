import { useSocket } from './useSocket';
import { transformSocketListenEvent } from '@/utils';

export const useSocketCount = () => {
  const handleSocketCount = async (socket: any) => {
    const [count] = await transformSocketListenEvent(socket, 'count');
    return count.mc;
  };

  return useSocket<number>(handleSocketCount);
};
