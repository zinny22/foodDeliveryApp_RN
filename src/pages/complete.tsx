import React, {useState} from 'react';
import {View, Pressable, Text} from 'react-native';

function Complete() {
  const [count, setCount] = useState(1);
  return (
    <View>
      <Pressable onPress={() => setCount(p => p + 1)}>
        <Text>{count}</Text>
      </Pressable>
    </View>
  );
}
export default Complete;
