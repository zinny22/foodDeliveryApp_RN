import {useCallback} from 'react';
import {io, Socket} from 'socket.io-client';
import Config from 'react-native-config';

//소켓이 있을수도 있고 없을수도 있다.
let socket: Socket | undefined;

const useSocket = (): [Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      socket = undefined;
    }
  }, []);
  if (!socket) {
    socket = io(Config.API_URL, {
      transports: ['websocket'],
    });
  }
  return [socket, disconnect];
};

export default useSocket;
