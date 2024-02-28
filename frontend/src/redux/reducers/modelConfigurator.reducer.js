import { createSlice } from '@reduxjs/toolkit';
import { CHATGPT_MODELS } from '../../domain';

const modelConfiguratorSlice = createSlice({
  name: 'modelConfigurator',
  initialState: {
    currentModel: CHATGPT_MODELS[0],
    models: CHATGPT_MODELS,
  },
  reducers: {
    setCurrentModel: (state, action) => ({ ...state, currentModel: action.payload }),
  },
});

export const { setCurrentModel } = modelConfiguratorSlice.actions;

export default modelConfiguratorSlice.reducer;
