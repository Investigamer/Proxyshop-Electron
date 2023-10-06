import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface AppScreenState {
  version: string;
  apiPort: number;
  darkTheme: boolean;
  counterValue: number;
}

const initialState: AppScreenState = {
  version: 'Unknown',
  apiPort: 8000,
  darkTheme: false,
  counterValue: 0,
};

export const appScreenSlice = createSlice({
  name: 'appScreen',
  initialState,
  reducers: {
    setVersion: (state, action: PayloadAction<string>) => {
      state.version = action.payload;
    },
    setPort: (state, action: PayloadAction<number>) => {
      state.apiPort = action.payload
    },
    setDarkTheme: (state, action: PayloadAction<boolean>) => {
      state.darkTheme = action.payload;
    },
    increaseCount: (state) => {
      state.counterValue += 1;
    },
  },
});

export const { setVersion, setPort, setDarkTheme, increaseCount } = appScreenSlice.actions;

export default appScreenSlice.reducer;
