import React from 'react';
import Index from './src/Index';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

LogBox.ignoreLogs(['Reanimated 2']);
LogBox.ignoreLogs(['new NativeEventEmitter']);

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Index />
    </GestureHandlerRootView>
  );
};

export default App;