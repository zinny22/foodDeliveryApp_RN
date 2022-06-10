import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
} from 'react-native';
import {RootStackParamList} from '../../App';
import DismissKeyboardView from '../components/DismissKeyboardView';

type SignInSreenProps = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;
function SignIn({navigation}: SignInSreenProps) {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');

  const emailRef = useRef<TextInput | null>(null); //generic
  const pwdRef = useRef<TextInput | null>(null);

  const onSubmit = useCallback(() => {
    if (!email || !email.trim()) {
      return Alert.alert('알림', '이메일을 입력해주세요');
    }
    if (!pwd || !pwd.trim()) {
      return Alert.alert('알림', '비밀번호을 입력해주세요');
    }
    Alert.alert('알림', '로그인 되었습니다.');
  }, [email, pwd]);

  const onChangeEmail = useCallback(text => {
    setEmail(text.trim());
  }, []);

  const onChangePwd = useCallback(text => {
    setPwd(text.trim());
  }, []);

  const toSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  const canGoNext = email && pwd;
  return (
    <DismissKeyboardView style={styles.inputWrap}>
      <View>
        <Text style={styles.lable}>이메일</Text>
        <TextInput
          style={styles.TextInput}
          value={email}
          placeholder="이메일을 입력해주세요"
          onChangeText={onChangeEmail}
          importantForAutofill="yes"
          autoComplete="email"
          textContentType="emailAddress"
          keyboardType="email-address"
          returnKeyType="next"
          onSubmitEditing={() => {
            pwdRef.current?.focus();
          }}
          blurOnSubmit={false}
          clearButtonMode="while-editing"
          ref={emailRef}
        />
      </View>
      <View>
        <Text style={styles.lable}>비밀번호</Text>
        <TextInput
          style={styles.TextInput}
          value={pwd}
          placeholder="비밀번호를 입력해주세요"
          onChangeText={onChangePwd}
          importantForAutofill="yes"
          autoComplete="password"
          textContentType="password"
          secureTextEntry
          ref={pwdRef}
          clearButtonMode="while-editing"
          onSubmitEditing={onSubmit}
        />
      </View>
      <View style={styles.buttonZone}>
        <Pressable
          onPress={onSubmit}
          style={
            !canGoNext
              ? styles.loginButton
              : [styles.loginButton, styles.loginButtonActive]
          }
          disabled={!canGoNext}>
          <Text style={styles.loginButtonText}>로그인</Text>
        </Pressable>
        <Pressable onPress={toSignUp}>
          <Text>회원가입하기</Text>
        </Pressable>
      </View>
    </DismissKeyboardView>
  );
}

const styles = StyleSheet.create({
  inputWrap: {
    padding: 20,
  },
  buttonZone: {
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  loginButtonActive: {
    backgroundColor: 'blue',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
  },
  lable: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20,
  },
  TextInput: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 40,
  },
});
export default SignIn;
