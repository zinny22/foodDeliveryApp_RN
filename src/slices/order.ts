import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Order {
  orderId: string;
  start: {latitude: Number; longitude: Number};
  end: {latitude: Number; longitude: Number};
  price: Number;
}

interface InitialState {
  orders: Order[];
  deliveries: Order[];
}

const initialState: InitialState = {
  orders: [],
  deliveries: [],
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addorder(state, action: PayloadAction<Order>) {
      state.orders.push(action.payload);
    },
    acceptOrder(state, action: PayloadAction<String>) {
      const index = state.orders.findIndex(v => v.orderId === action.payload);
      if (index > -1) {
        state.deliveries.push(state.orders[index]);
        state.orders.splice(index, 1);
      }
    },
    rejectOrder(state, action) {
      const index = state.orders.findIndex(v => v.orderId === action.payload);
      if (index > -1) {
        state.orders.splice(index, 1);
      }

      const deliveryIndex = state.deliveries.findIndex(
        v => v.orderId === action.payload,
      );
      if (index > -1) {
        state.deliveries.splice(deliveryIndex, 1);
      }
    },
  },
});

export default orderSlice;
