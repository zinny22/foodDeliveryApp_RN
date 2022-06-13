import * as React from 'react';
import Settings from './src/pages/Settings';
import Orders from './src/pages/Orders';
import Delivery from './src/pages/Delivery';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {RootState} from './src/store/reducer';
import {useSelector} from 'react-redux';
import useSocket from './src/hooks/useSocket';

//다른 페이지에서도 타입을 쓸수 있게 하기 위해서 export사용함
//로그인 했을때
export type LoggedInParamList = {
  Orders: undefined;
  Settings: undefined;
  Delivery: undefined;
  Complete: {orderId: string};
};

//로그인 안했을때
export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AppInner() {
  const isLoggedIn = useSelector((state: RootState) => !!state.user.email);

  const [socket, disconnect] = useSocket();

  React.useEffect(() => {
    const hellocallback = (data: any) => {
      console.log(data);
    };
    if (socket && isLoggedIn) {
      console.log(socket);
      socket.emit('login', 'hello');
      socket.on('hello', hellocallback);
    }
    return () => {
      if (socket) {
        socket.off('hello', hellocallback);
      }
    };
  }, [isLoggedIn, socket]);

  React.useEffect(() => {
    if (!isLoggedIn) {
      console.log('!isLoggedIn', !isLoggedIn);
      disconnect();
    }
  }, [isLoggedIn, disconnect]);
  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator>
          <Tab.Screen
            name="Orders"
            component={Orders}
            options={{title: '오더 목록'}}
          />
          <Tab.Screen
            name="Delivery"
            component={Delivery}
            options={{headerShown: false}}
          />
          <Tab.Screen
            name="Settings"
            component={Settings}
            options={{title: '내 정보'}}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{title: '로그인'}}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{title: '회원가입'}}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default AppInner;
