import * as React from 'react';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  Text,
  TouchableHighlight,
  Pressable,
  Button,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View} from 'react-native';
import {useCallback} from 'react';

type RootStackParamList = {
  Home: undefined;
  Details: undefined;
};
//타입스트립트에서 네비게이션 선언하는 방법 그냥 외우자 ㅎ
type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
type DetailsScreenProps = NativeStackScreenProps<ParamListBase, 'Details'>;

function HomeScreen({navigation, route}: HomeScreenProps) {
  const onClick = useCallback(() => {
    navigation.navigate('Details');
  }, [navigation]);

  return (
          <>
          <View style={{flex: 1, backgroundColor:'orange' ,alignItems: 'flex-end', justifyContent: 'center'}}>
            <Pressable onPress={onClick} style={{padding:20, backgroundColor:'white'}}>
              <Text style={{color:'gray'}}>Home Screen</Text>
            </Pressable>
          </View>
          <View style={{backgroundColor:'green', flex:1}}><Text>second</Text></View>
          </>
  );
}

function DetailsScreen({navigation}: DetailsScreenProps) {
  const onClick = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);


  return (
          <>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <TouchableHighlight onPress={onClick}>
              <Text>Details Screen</Text>
            </TouchableHighlight>
          </View>
          <View style={{
            position:'absolute',
            backgroundColor:'rgba(0,0,0,0.5)',
            top:0,
            bottom:0,
            right:0,
            left:0}}>
              <View style={{
                position:'absolute',
                backgroundColor:'white',
                top:50,
                bottom:50,
                right:50,
                left:50}}>
                <Text>hello</Text>
              </View>
          </View>
          </>
  );
}

const Stack = createNativeStackNavigator();
function App() {
  return (
          //safe-area가 이미 적용 되어있다.
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen
                      name="Home"
                      component={HomeScreen}
                      options={{title: '홈화면'}}
              />
              <Stack.Screen name="Details">
                {props => <DetailsScreen {...props} />}
              </Stack.Screen>
            </Stack.Navigator>
          </NavigationContainer>
  );
}


export default App;