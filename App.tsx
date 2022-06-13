import * as React from 'react';
import AppInner from './AppInner';
import {Provider} from 'react-redux';
import store from './src/store';

function App() {
  return (
    <Provider store={store}>
      <AppInner />
    </Provider>
  );
}

export default App;
