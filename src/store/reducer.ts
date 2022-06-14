import {combineReducers} from 'redux';
import orderSlice from '../slices/order';

import userSlice from '../slices/user';

const rootReducer = combineReducers({
  user: userSlice.reducer,
  order: orderSlice.reducer,
});

//타입스크립트때문에 나오게 된 코드
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
