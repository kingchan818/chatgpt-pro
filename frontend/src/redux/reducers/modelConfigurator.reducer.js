import { createSlice } from '@reduxjs/toolkit';
import { chatgptModels } from '../../domain';

const modelConfiguratorSlice = createSlice({
  name: 'modelConfigurator',
  initialState: {
    currentModel: chatgptModels[0],
    models: chatgptModels,
  },
  reducers: {
    setCurrentModel: (state, action) => ({ ...state, currentModel: action.payload }),
  },
});

export const { setCurrentModel } = modelConfiguratorSlice.actions;

export default modelConfiguratorSlice.reducer;
