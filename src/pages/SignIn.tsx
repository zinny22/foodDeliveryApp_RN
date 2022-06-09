import React, {useCallback, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
} from 'react-native';

function SignIn() {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');

  const onSubmit = useCallback(() => {
    Alert.alert('알림', '로그인완료');
  }, []);

  const onChangeEmail = useCallback(text => {
    setEmail(text);
  }, []);

  const onChangePwd = useCallback(text => {
    setPwd(text);
  }, []);

  const emailRef = useRef<TextInput | null>(); //generic
  const pwdRef = useRef<TextInput | null>();

  const canGoNext = email && pwd;
  return (
    <View style={styles.inputWrap}>
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
          returnKeyType="next"
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
        <Pressable>
          <Text>회원가입하기</Text>
        </Pressable>
      </View>
    </View>
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
