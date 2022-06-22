import React, {useCallback, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {LoggedInParamList} from '../../AppInner';
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import orderSlice from '../slices/order';
import {useAppDispatch} from '../store';

function Complete() {
  const dispatch = useAppDispatch();
  //훅으로 사용
  const route = useRoute<RouteProp<LoggedInParamList>>();
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();
  const [image, setImage] = useState<{
    uri: string;
    name: string;
    type: string;
  }>();
  const [preview, setPreview] = useState<{uri: string}>();
  const accessToken = useSelector((state: RootState) => state.user.accessToken);

  const onResponse = useCallback(async response => {
    console.log(response.width, response.height, response.exif);
    //.min은 타입 (ex jpeg,png)
    setPreview({uri: `data:${response.mime};base64,${response.data}`});
    const orientation = (response.exif as any)?.Orientation;
    console.log('orientation', orientation);
    return ImageResizer.createResizedImage(
      response.path, //파일의 경로
      //width
      600,
      //height
      600,
      //format
      response.mime.includes('jpeg') ? 'JPEG' : 'PNG',
      //quality(화질)
      100,
      //rotarion 이미지가 돌아가 버리는 현상이 발생하면 여기서 수정 바람~
      0,
    ).then(r => {
      console.log(r.uri, r.name);

      //이미지 피커로 받아온 이미지를 이미지 리사이저로 용량이나 사이즈를 줄여서 보게끔
      setImage({
        uri: r.uri,
        name: r.name,
        type: response.mime,
      });
    });
  }, []);

  //카메라로 찍어도 -> 리사이징 해야함
  const onTakePhoto = useCallback(() => {
    return ImagePicker.openCamera({
      //미리보기 표시 가능
      includeBase64: true,
      //어느 방향으로 사진을 찍어도 정방향으로 바꿔주는
      includeExif: true,
      cropping: true,
      saveToPhotos: true,
    })
      .then(onResponse)
      .catch(console.log);
  }, [onResponse]);

  //파일을 선택하거나 -> 리사이징 해야함
  const onChangeFile = useCallback(() => {
    return ImagePicker.openPicker({
      includeExif: true,
      includeBase64: true,
      mediaType: 'photo',
    })
      .then(onResponse)
      .catch(console.log);
  }, [onResponse]);

  const orderId = route.params?.orderId;

  const onComplete = useCallback(async () => {
    if (!image) {
      Alert.alert('알림', '파일을 업로드해주세요.');
      return;
    }
    if (!orderId) {
      Alert.alert('알림', '유효하지 않은 주문입니다.');
      return;
    }

    //이미지는 폼데이터로 넣어줘야 한다
    const formData = new FormData();
    formData.append('image', image);
    formData.append('orderId', orderId);

    try {
      await axios.post(`${Config.API_URL}/complete`, formData, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      Alert.alert('알림', '완료처리 되었습니다.');
      //지도페이지로 다시 돌아가게 하기(완료 처리 화면 없애주기 위해서)
      navigation.goBack();
      navigation.navigate('Settings');
      dispatch(orderSlice.actions.rejectOrder(orderId));
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      if (errorResponse) {
        Alert.alert('알림', (errorResponse.data as any).message);
      }
    }
  }, [dispatch, navigation, image, orderId, accessToken]);

  return (
    <View>
      <View style={styles.orderId}>
        <Text>주문번호: {orderId}</Text>
      </View>
      <View style={styles.preview}>
        {/*source={{ uri : '경로' }}*/}
        {preview && <Image style={styles.previewImage} source={preview} />}
      </View>
      <View style={styles.buttonWrapper}>
        <Pressable style={styles.button} onPress={onTakePhoto}>
          <Text style={styles.buttonText}>이미지 촬영</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={onChangeFile}>
          <Text style={styles.buttonText}>이미지 선택</Text>
        </Pressable>
        {/*완료버튼 광클 못하게 disabled 로직 구현 해볼것 */}
        <Pressable
          style={
            image
              ? styles.button
              : StyleSheet.compose(styles.button, styles.buttonDisabled)
          }
          onPress={onComplete}>
          <Text style={styles.buttonText}>완료</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  orderId: {
    padding: 20,
  },
  preview: {
    marginHorizontal: 10,
    width: Dimensions.get('window').width - 20,
    height: Dimensions.get('window').height / 3,
    backgroundColor: '#D2D2D2',
    marginBottom: 10,
  },
  previewImage: {
    height: Dimensions.get('window').height / 3,
    //가로세로 비율 조정 없이 딱 맞게
    resizeMode: 'contain',
  },
  buttonWrapper: {
    //가로로 배치 시키기
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: 120,
    alignItems: 'center',
    backgroundColor: 'yellow',
    borderRadius: 5,
    margin: 5,
  },
  buttonText: {
    color: 'black',
  },
  buttonDisabled: {
    backgroundColor: 'gray',
  },
});

export default Complete;
